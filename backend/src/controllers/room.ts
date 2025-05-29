import { Request, Response } from 'express';
import { RoomModel } from '../models/room';
import { UserModel } from '../models/user';
import mongoose from 'mongoose';
import { GameModeEnum, GameSettings } from '../types/game';
import { pusher } from '../services/pusher';
import { getRoomChannel } from '../services/pusher/channels';
import { EVENTS } from '../constants/events';
import { AuthenticatedRequest } from '../types/express';
import { IUserDocument } from '../types/user';
export class RoomController {
  static createGameRoom = async (userIds: string[], settings: GameSettings) => {
    // Validate all users
    const users = await UserModel.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      throw new Error('One or more users not found');
    }

    // Remove each user from existing rooms (if any)
    for (const user of users) {
      const existingRoom = await RoomModel.findOne({ users: user._id });
      if (existingRoom) {
        existingRoom.users = existingRoom.users.filter(
          (u: mongoose.Types.ObjectId) => u.toString() !== user._id.toString(),
        );
        await existingRoom.save();

        // Notify existing room about user leaving
        await pusher.trigger(getRoomChannel(existingRoom.code), EVENTS.LEFT_ROOM, {
          userId: user._id.toString(),
        });
      }
    }

    const code = Math.random().toString(36).substring(2, 8).toLowerCase();

    // Create room with GameSettings
    const room = await RoomModel.create({
      code,
      users: userIds,
      settings: {
        gameMode: settings.gameMode,
        language: settings.language,
        maxPlayers: settings.maxPlayers,
        difficultyLevel: settings.difficultyLevel,
        teamSize: settings.teamSize,
        timeLimit: settings.timeLimit,
        topics: settings.topics,
      },
      adminId: userIds[0],
    });

    return await RoomModel.findById(room._id).populate('users').lean();
  };

  static createRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req?.user?.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { settings } = req.body;
      console.log({ settings });
      const room = await RoomController.createGameRoom([user._id.toString()], settings);

      return res.status(201).json({
        room,
        user,
      });
    } catch (error) {
      console.error('Create Room Error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  static joinRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req?.user?.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: 'Room code is required' });
      }

      // Check if user is already in any room
      const existingRoom = await RoomModel.findOne({ users: user._id });
      if (existingRoom) {
        // If trying to join same room, just return success
        if (existingRoom.code === code) {
          const populatedRoom = await RoomModel.findById(existingRoom._id).populate('users').lean();
          return res.status(200).json({
            room: populatedRoom,
            user,
          });
        }

        // Remove user from existing room
        existingRoom.users = existingRoom.users.filter(
          (u: mongoose.Types.ObjectId) => u.toString() !== user._id.toString(),
        );
        await existingRoom.save();

        // Notify existing room about user leaving
        await pusher.trigger(getRoomChannel(existingRoom.code), EVENTS.LEFT_ROOM, {
          userId: user._id.toString(),
        });
      }

      const room = await RoomModel.findOne({ code });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Check if room is full
      if (room.users.length >= (room.settings.maxPlayers || 10)) {
        return res.status(400).json({ error: 'Room is full' });
      }

      const userAlreadyInRoom = room.users.some(
        (u: mongoose.Types.ObjectId) => u.toString() === user._id.toString(),
      );

      if (!userAlreadyInRoom) {
        room.users.push(user._id);
        await room.save();
      }

      const populatedRoom = await RoomModel.findById(room._id).populate('users').lean();

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

      // Create new users array without the leaving user
      const updatedUsers = room.users.filter((u: any) => u._id.toString() !== userId.toString());

      // Check if the leaving user is the admin
      let newAdmin = null;
      if (user.isAdmin && updatedUsers.length > 0) {
        // Assign new admin to first remaining user
        const newAdminUser = await UserModel.findByIdAndUpdate(
          updatedUsers[0]._id,
          { $set: { isAdmin: true } },
          { new: true },
        );
        newAdmin = newAdminUser;
        room.adminId = newAdminUser?._id.toString()!;
      }

      // If no users left, delete the room before saving
      if (updatedUsers.length === 0) {
        await RoomModel.deleteOne({ _id: room._id });
        return res.status(200).json({
          message: 'User left and room closed (no users remaining)',
          roomClosed: true,
        });
      }

      // Update the room with the new users array and possibly new adminId
      room.users = updatedUsers;
      await room.save();

      // Notify via Pusher
      const pusherNotifications = [pusher.trigger(getRoomChannel(code), EVENTS.LEFT_ROOM, user)];
      if (newAdmin) {
        pusherNotifications.push(
          pusher.trigger(getRoomChannel(code), EVENTS.ADMIN_CHANGED, newAdmin),
        );
      }
      await Promise.all(pusherNotifications);

      return res.status(200).json({
        message: 'User left room successfully',
        remainingUsers: updatedUsers.length,
        user,
        newAdmin,
        roomClosed: false,
      });
    } catch (error) {
      console.error('Leave Room Error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  static updateGameSettings = async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const { settings } = req.body;

      const room = await RoomModel.findOne({ code });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Ensure settings object exists on the room
      if (!room.settings) {
        room.settings = settings;
      } else {
        // Safely merge updates into existing settings
        if (settings.gameMode !== undefined) room.settings.gameMode = settings.gameMode;
        if (settings.language !== undefined) room.settings.language = settings.language;
        if (settings.difficultyLevel !== undefined)
          room.settings.difficultyLevel = settings.difficultyLevel;
        if (settings.maxPlayers !== undefined) room.settings.maxPlayers = settings.maxPlayers;
        if (settings.teamSize !== undefined) room.settings.teamSize = settings.teamSize;
        if (settings.timeLimit !== undefined) room.settings.timeLimit = settings.timeLimit;
        if (settings.topics !== undefined) room.settings.topics = settings.topics;
      }

      await pusher.trigger(getRoomChannel(code), EVENTS.SETTINGS_UPDATED, settings);
      await room.save();

      return res.status(200).json({
        message: 'Game settings updated',
        gameSettings: room.settings,
      });
    } catch (error) {
      console.error('Update Game Settings Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  static setPlayerReady = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req?.user?.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the room and populate the users
      const room = await RoomModel.findOne({ users: user._id }).populate<{
        users: IUserDocument[];
      }>('users');

      if (!room) {
        return res.status(404).json({ error: 'Room not found for this user' });
      }

      // Check if all users are ready
      const allReady = room.users.every((u) => u.playStatus === true);

      // Trigger Pusher event to notify room about the status change
      await pusher.trigger(getRoomChannel(room.code), EVENTS.PLAYER_READY, {
        userId: user._id,
        allReady: allReady,
      });

      return res.status(200).json({
        message: 'Player status updated to ready',
        user,
        allReady,
      });
    } catch (error) {
      console.error('Set Player Ready Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
