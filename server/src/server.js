import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config.js';
import db from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import entriesRoutes from './routes/entries.routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);

// Create ENUM type for moods
db.sequelize.query(`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_entries_mood" AS ENUM (
      'happy', 'sad', 'angry', 'anxious', 'neutral', 'excited', 'peaceful'
    );
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
`);

// Error handling for Sequelize validation errors
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        details: err.errors.map(e => ({
          field: e.path,
          message: e.message
        })),
        status: 400
      }
    });
  }
  next(err);
});

// Error handling for Sequelize unique constraint errors
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: {
        message: 'Unique constraint error',
        details: err.errors.map(e => ({
          field: e.path,
          message: e.message
        })),
        status: 400
      }
    });
  }
  next(err);
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
      ...(config.nodeEnv === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not found',
      status: 404
    }
  });
});

const PORT = config.port;

// Start server
const startServer = async () => {
  try {
    // Database will be initialized through models/index.js
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();

export default app;
