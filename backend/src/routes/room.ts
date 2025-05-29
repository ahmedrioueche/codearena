import { Router } from 'express';
import { RoomController } from '../controllers/room';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/create', authMiddleware, RoomController.createRoom as any);
router.post('/join', authMiddleware, RoomController.joinRoom as any);
router.get('/:code', authMiddleware, RoomController.getRoom as any);
router.delete('/close', authMiddleware, RoomController.closeRoom as any);
router.delete('/remove-user', authMiddleware, RoomController.removeUser as any);
router.patch('/:code/settings', authMiddleware, RoomController.updateSettings as any);
router.post('/leave', authMiddleware, RoomController.leaveRoom as any);
router.patch('/:code/game-settings', authMiddleware, RoomController.updateGameSettings as any);
router.post('/ready', authMiddleware, RoomController.setPlayerReady as any);

export default router;
