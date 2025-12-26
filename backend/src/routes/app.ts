import { Router } from 'express';

const router = Router();

router.post('/wake-up', () => {
  console.log('Wake up');
});

export default router;
