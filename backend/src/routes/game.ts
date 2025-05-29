import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { GameController } from '../controllers/game';

const router = Router();

router.post('/search-players', authMiddleware, GameController.searchPlayers as any);
router.post('/cancel-search', authMiddleware, GameController.cancelSearch as any);

export default router;
