import { Request, Response } from 'express';
import { RoomModel } from '../models/room';
import { UserModel } from '../models/user';
import mongoose from 'mongoose';
import { GameModeEnum, CategoryEnum } from '../types/game';
import { IRoomDocument } from '../types/room';
import { pusher } from '../services/pusher';
import { getRoomChannel } from '../services/pusher/channels';
import { EVENTS } from '../constants/events';
import { AuthenticatedRequest } from '../types/express';

export class RoomController {
  // 1. Create a room with settings
  static createRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const settings = req.body?.settings || {
        mode: GameModeEnum.RANDOM,
        category: CategoryEnum.ANIMAL,
        questionTime: 30,
        RoundsPerMatch: 5,
      };

      const user = await UserModel.findById(req?.user?.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const code = Math.random().toString(36).substring(2, 8).toLowerCase();

      const room = await RoomModel.create({
        code,
        users: [user._id],
        settings, // Use the settings from body or default
      });

      const populatedRoom = await RoomModel.findById(room._id).populate('users').lean();

      return res.status(201).json({
        room: populatedRoom,
        user,
      });
    } catch (error) {
      console.error('Create Room Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // 2. Join a room
  static joinRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req?.user?.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { code } = req.body;
      console.log({ code });
      if (!code) {
        return res.status(400).json({
          error: 'Room code is required',
        });
      }

      const room = await RoomModel.findOne({ code });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const userAlreadyInRoom = room.users.some(
        (u: mongoose.Types.ObjectId) => u.toString() === user!._id.toString(),
      );

      if (!userAlreadyInRoom) {
        room.users.push(user._id);
        await room.save();
      }

      const populatedRoom = await RoomModel.findById(room._id).populate('users').lean();

      console.log({ room });
      await pusher.trigger(getRoomChannel(room.code), EVENTS.JOINED_ROOM, user);

      return res.status(200).json({
        room: populatedRoom,
        user,
      });
    } catch (error) {
      console.error('Join Room Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // 3. Get room details
  static getRoom = async (req: Request, res: Response) => {
    try {
      const { code } = req.params;

      const room = await RoomModel.findOne({ code }).populate('users').lean();

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      return res.status(200).json({ room });
    } catch (error) {
      console.error('Get Room Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // 4. Update room settings
  static updateSettings = async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const { settings } = req.body;

      const room = await RoomModel.findOne({ code });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Validate settings
      if (settings.mode && !Object.values(GameModeEnum).includes(settings.mode)) {
        return res.status(400).json({ error: 'Invalid game mode' });
      }

      if (settings.category && !Object.values(CategoryEnum).includes(settings.category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      if (settings.roundTime && (settings.roundTime < 10 || settings.roundTime > 120)) {
        return res.status(400).json({ error: 'Round time must be between 10-120 seconds' });
      }

      if (
        settings.RoundsPerMatch &&
        (settings.RoundsPerMatch < 1 || settings.RoundsPerMatch > 10)
      ) {
        return res.status(400).json({ error: 'Rounds per match must be between 1-10' });
      }

      // Update settings
      room.settings = {
        ...room.settings,
        ...settings,
      };

      await room.save();

      return res.status(200).json({
        message: 'Settings updated',
        settings: room.settings,
      });
    } catch (error) {
      console.error('Update Settings Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // 5. Remove user from room
  static removeUser = async (req: Request, res: Response) => {
    try {
      const { username, code } = req.body;

      const room = await RoomModel.findOne({ code });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      room.users = room.users.filter(
        (u: mongoose.Types.ObjectId) => u.toString() !== user._id.toString(),
      );

      await room.save();

      return res.status(200).json({
        message: 'User removed from room',
        users: room.users,
      });
    } catch (error) {
      console.error('Remove User Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  static closeRoom = async (req: Request, res: Response) => {
    try {
      const { code } = req.body;

      const room = await RoomModel.findOneAndDelete({ code });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      return res.status(200).json({
        message: 'Room closed successfully',
      });
    } catch (error) {
      console.error('Close Room Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  static leaveRoom = async (req: Request, res: Response) => {
    try {
      const { code, userId } = req.body;
      console.log('code, userId', code, userId);

      // Validate input
      if (!code || !userId) {
        return res.status(400).json({ error: 'Room code and user ID are required' });
      }

      // Find the room and user
      const [room, user] = await Promise.all([
        RoomModel.findOne({ code }).populate('users'),
        UserModel.findById(userId),
      ]);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove user from room's users array
      const initialUserCount = room.users.length;
      room.users = (room.users as mongoose.Types.ObjectId[]).filter(
        (u) => u.toString() !== userId.toString(),
      );

      // Check if leaving user was admin
      let newAdmin = null;
      if (user.isAdmin && room.users.length > 0) {
        // Assign admin to the next available user (first in array)
        const newAdminUser = await UserModel.findByIdAndUpdate(
          room.users[0]._id,
          { $set: { isAdmin: true } },
          { new: true },
        );
        newAdmin = newAdminUser;
      }

      // Save the updated room
      await room.save();

      await UserModel.deleteOne({ _id: userId });

      // Prepare Pusher notifications
      const pusherNotifications = [pusher.trigger(getRoomChannel(code), EVENTS.LEFT_ROOM, user)];

      // Add admin change notification if needed
      if (newAdmin) {
        pusherNotifications.push(
          pusher.trigger(getRoomChannel(code), EVENTS.ADMIN_CHANGED, newAdmin),
        );
      }

      // Send all notifications
      await Promise.all(pusherNotifications);

      // If room is empty after user left, delete it
      if (initialUserCount > 0 && room.users.length === 0) {
        await RoomModel.deleteOne({ code });
        return res.status(200).json({
          message: 'User left and room closed (no users remaining)',
          roomClosed: true,
        });
      }

      return res.status(200).json({
        message: 'User left room successfully',
        remainingUsers: room.users.length,
        user,
        newAdmin,
        roomClosed: false,
      });
    } catch (error) {
      console.error('Leave Room Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  static resetAskedUsers = async (req: Request, res: Response) => {
    try {
      const { code } = req.body;

      const room = await RoomModel.findOne({ code });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      await this.updateMatchData(room);

      return res.status(200).json({
        message: 'Match data reset successfully',
        room,
      });
    } catch (error) {
      console.error('Reset Asked Users Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Private method to update match data by resetting askedUsers array
   * @param room The room document to update
   */
  private static async updateMatchData(room: IRoomDocument): Promise<void> {
    if (!room.matchData) {
      // Initialize matchData if it doesn't exist
      room.matchData = {
        questions: [],
        askedUsers: [],
      };
    } else {
      // Reset askedUsers array
      room.matchData.askedUsers = [];
    }
    await room.save();
  }

  // Utility method to get a room with proper typing
  private static async getRoomWithMatchData(code: string): Promise<IRoomDocument | null> {
    return RoomModel.findOne({ code }).populate('users').populate('matchData.askedUsers').exec();
  }
}
