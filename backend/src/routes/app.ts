import { Router } from 'express';

const router = Router();

router.get('/wake-up', () => {
  console.log('Wake up');
});

export default router;
