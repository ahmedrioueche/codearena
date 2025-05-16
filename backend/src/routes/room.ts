import { Router } from 'express';
import { RoomController } from '../controllers/room';

const router = Router();

router.post('/create', RoomController.createRoom as any);
router.post('/join', RoomController.joinRoom as any);
router.get('/:code', RoomController.getRoom as any);
router.delete('/close', RoomController.closeRoom as any);
router.delete('/remove-user', RoomController.removeUser as any);
router.patch('/:code/settings', RoomController.updateSettings as any);
router.post('/leave', RoomController.leaveRoom as any);

export default router;
