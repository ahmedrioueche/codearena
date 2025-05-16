import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middlewares/error';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import roomRoutes from './routes/room';
import { API_BASE_URL } from './constants/api';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandlers();
  }

  private setMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: process.env.ORIGIN || 'https://codearena-delta.vercel.app',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['set-cookie'],
      }),
    );

    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  private setRoutes(): void {
    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'CodeArena API',
        status: 'operational',
      });
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'UP' });
    });

    // API routes
    this.app.use(`${API_BASE_URL}/auth`, authRoutes);
    this.app.use(`${API_BASE_URL}/user`, userRoutes);
    this.app.use(`${API_BASE_URL}/room`, roomRoutes);
  }

  private setErrorHandlers(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
}

export default new App().app;
