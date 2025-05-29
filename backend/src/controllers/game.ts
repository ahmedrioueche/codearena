import { Response } from 'express';
import { SearchModel } from '../models/search';
import { GameModeEnum } from '../types/game';
import { AuthenticatedRequest } from '../types/express';
import { RoomController } from './room';
import mongoose, { ClientSession, Types } from 'mongoose';
import { GameSettings } from '../types/game';
import { IUserDocument } from '../types/user';
import { pusher } from '../services/pusher';

const SEARCH_TIMEOUT_MS = 30000; // 30 seconds search timeout
const POLL_INTERVAL_MS = 3000; // Check every 3 seconds
const MAX_POLL_ATTEMPTS = Math.floor(SEARCH_TIMEOUT_MS / POLL_INTERVAL_MS); // ~10 attempts

// Ensure unique index on user field
SearchModel.collection.createIndex({ user: 1 }, { unique: true, background: true })
  .catch(err => console.error('Error creating unique index:', err));

interface MatchResult {
  room: any;
  matchedUsers: Array<{
    userId: Types.ObjectId;
    username: string;
    experienceLevel: string;
  }>;
}

export class GameController {
  private static async notifyMatchProgress(searchId: string, data: any) {
    await pusher.trigger(`search-${searchId}`, 'match-progress', data);
  }

  private static async notifyMatchFound(searchId: string, data: MatchResult) {
    await pusher.trigger(`search-${searchId}`, 'match-found', data);
  }

  private static async notifyMatchError(searchId: string, error: string) {
    await pusher.trigger(`search-${searchId}`, 'match-error', error);
  }

  static searchPlayers = async (req: AuthenticatedRequest, res: Response) => {
    let searchSession: ClientSession | null = null;
    console.log('Starting searchPlayers...');

    try {
      const userId = req.user?.userId;
      const { settings } = req.body;
      console.log(`User ${userId} is searching with settings:`, settings);

      if (!userId) {
        console.error('Unauthorized access attempt');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate required settings
      if (!settings) {
        console.error('Missing game settings');
        return res.status(400).json({ error: 'Game settings are required' });
      }

      // Validate game settings
      if (!Object.values(GameModeEnum).includes(settings.gameMode)) {
        console.error('Invalid game mode:', settings.gameMode);
        return res.status(400).json({ error: 'Invalid game mode' });
      }

      if (!settings.language) {
        console.error('Missing language setting');
        return res.status(400).json({ error: 'Language is required' });
      }

      if (
        !settings.difficultyLevel ||
        !['easy', 'medium', 'hard'].includes(settings.difficultyLevel)
      ) {
        console.error('Invalid difficulty level:', settings.difficultyLevel);
        return res.status(400).json({ error: 'Valid difficulty level is required' });
      }

      // Start a transaction session
      searchSession = await mongoose.startSession();
      
      // First, cleanup any existing searches for this user
      await SearchModel.deleteMany({ 
        user: new Types.ObjectId(userId),
        matched: false
      }).session(searchSession);

      const result = await searchSession.withTransaction(async () => {
        console.log('Transaction started');

        try {
          // Create new search document with unique index on user
          const searchDoc = await SearchModel.create([{
            user: new Types.ObjectId(userId),
            settings: {
              gameMode: settings.gameMode,
              language: settings.language,
              difficultyLevel: settings.difficultyLevel,
              maxPlayers: settings.maxPlayers || 4,
              teamSize: settings.teamSize || 2,
              timeLimit: settings.timeLimit || 300,
              topics: settings.topics || [],
            },
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + SEARCH_TIMEOUT_MS),
            matched: false,
          }], { session: searchSession });

          if (!searchDoc || !searchDoc[0]) {
            console.log(`Failed to create search for user ${userId}`);
            return null;
          }

          const searchId = (searchDoc[0] as { _id: { toString(): string } })._id.toString();
          console.log(`Created search ${searchId} for user ${userId}`);

          // Return immediately with the search ID
          return { searchId };
        } catch (error) {
          if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            console.log(`Duplicate search attempt for user ${userId}`);
            return null;
          }
          throw error;
        }
      });

      if (!result) {
        return res.status(200).json({
          room: null,
          matchedUsers: [],
          message: 'Search cancelled or no matches found within timeout period',
        });
      }

      // Start the matchmaking process in the background
      this.findMatches(userId, new Types.ObjectId(result.searchId), settings).catch(error => {
        console.error('Background matchmaking error:', error);
        this.notifyMatchError(result.searchId, 'Matchmaking failed');
      });

      return res.status(200).json({ searchId: result.searchId });
    } catch (error) {
      console.error('Search Players Error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      if (searchSession) {
        await searchSession.endSession();
        console.log('Session ended');
      }
    }
  };

  private static async findMatches(
    userId: string,
    searchId: Types.ObjectId,
    settings: GameSettings,
  ): Promise<MatchResult | null> {
    let attempt = 1;
    const maxAttempts = MAX_POLL_ATTEMPTS;

    while (attempt <= maxAttempts) {
      console.log(`Match finding attempt ${attempt}/${maxAttempts} for search ${searchId}`);

      // First check if our search still exists (might have been cancelled)
      const ourSearch = await SearchModel.findById(searchId);
      if (!ourSearch) {
        console.log(`Search ${searchId} no longer exists, stopping match finding`);
        return null;
      }

      // Start a session for atomic operations
      const session = await mongoose.startSession();
      let result = null;

      try {
        await session.withTransaction(async () => {
          // Find potential matches with session to ensure consistency
          const matches = await SearchModel.find({
            _id: { $ne: searchId },
            user: { $ne: new Types.ObjectId(userId) },
            matched: false,
            'settings.gameMode': settings.gameMode,
            'settings.language': settings.language,
            'settings.difficultyLevel': settings.difficultyLevel,
            expiresAt: { $gt: new Date() },
          })
            .session(session)
            .limit((settings.maxPlayers || 4) - 1)
            .populate<{ user: IUserDocument }>('user', 'username experienceLevel playStatus');

          console.log(`Found ${matches.length} potential matches for search ${searchId}`);

          // Notify progress
          await this.notifyMatchProgress(searchId.toString(), {
            message: `Found ${matches.length} potential players...`,
            matchedCount: matches.length
          });

          const requiredMatches = (settings.teamSize || 2) - 1;
          if (matches.length >= requiredMatches) {
            console.log(`Found enough matches (${matches.length}) for search ${searchId}`);

            const matchIds = matches.map((m) => m._id);
            const allSearchIds = [searchId, ...matchIds];

            // Attempt to acquire lock on all searches atomically
            const updatedSearches = await SearchModel.updateMany(
              { 
                _id: { $in: allSearchIds }, 
                matched: false 
              },
              { $set: { matched: true } },
              { session }
            );

            if (updatedSearches.modifiedCount !== allSearchIds.length) {
              console.log('Failed to acquire lock on all searches, retrying...');
              throw new Error('Failed to acquire lock on all searches');
            }

            // Delete the matched searches
            await SearchModel.deleteMany({
              _id: { $in: allSearchIds },
            }).session(session);

            // Create room and notify users
            const validMatches = matches.filter(
              (m): m is typeof m & { user: IUserDocument } => !!m.user?._id && !!m.user?.username,
            );

            const matchedUserIds = validMatches
              .map((m) => m?.user?._id?.toString())
              .filter((id): id is string => typeof id === 'string');

            const userIds: string[] = [userId, ...matchedUserIds];

            console.log(`Creating room for users: ${userIds}`);
            const room = await RoomController.createGameRoom(userIds, settings);

            const matchedUsers = validMatches.map((m) => ({
              userId: m.user._id!,
              username: m.user.username,
              experienceLevel: m.user.experienceLevel.toString(),
            }));

            result = { room, matchedUsers };
            
            // Notify all matched users
            await this.notifyMatchFound(searchId.toString(), result);
            for (const match of matches) {
              const matchId = (match as any)._id.toString();
              await this.notifyMatchFound(matchId, result);
            }
          }
        });

        if (result) {
          return result;
        }

      } catch (error) {
        console.log('Transaction failed:', error);
      } finally {
        await session.endSession();
      }


      if (attempt < maxAttempts) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      } else {
        console.log(`Max polling attempts reached for search ${searchId}`);
        await this.notifyMatchError(searchId.toString(), 'No matches found within timeout period');
        break;
      }
    }

    console.log(`Search polling completed without matches for ${searchId}`);
    return null;
  }

  static cancelSearch = async (req: AuthenticatedRequest, res: Response) => {
    console.log('Cancel search request received');
    try {
      const userId = req.user?.userId;
      const { searchId } = req.body;

      if (!userId) {
        console.error('Unauthorized cancel attempt');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      console.log(`Attempting to cancel search ${searchId} for user ${userId}`);
      const result = await SearchModel.deleteOne({
        _id: new Types.ObjectId(searchId),
        user: new Types.ObjectId(userId),
        matched: false, // Only delete if not already matched
      });

      if (result.deletedCount === 0) {
        console.log(`No active search found for user ${userId}`);
        return res.status(404).json({ error: 'No active search found' });
      }

      console.log(`Successfully cancelled search for user ${userId}`);
      return res.status(200).json({ message: 'Search cancelled successfully' });
    } catch (error) {
      console.error('Cancel Search Error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
