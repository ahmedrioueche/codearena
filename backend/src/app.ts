import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middlewares/error';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
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
        origin: process.env.ORIGIN || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );
    this.app.use(cookieParser());

    this.app.use(helmet());
    this.app.use(morgan('dev'));
  }

  private setRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'UP' });
    });

    this.app.use(`${API_BASE_URL}/auth`, authRoutes);
    this.app.use(`${API_BASE_URL}/user`, userRoutes);
  }

  private setErrorHandlers(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
}

export default new App().app;
