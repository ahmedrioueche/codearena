import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || '0.0.0.0';

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://${ORIGIN}:${PORT}`);
    console.log(`API Base URL: ${process.env.API_BASE_URL}`);
  });
});
