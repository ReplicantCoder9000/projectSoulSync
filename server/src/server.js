import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';
import db from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import entriesRoutes from './routes/entries.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = config.corsOrigin;
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.max,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Logging
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    port: config.port
  });
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

// CORS error handling
app.use((err, req, res, next) => {
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: {
        message: 'CORS error: Origin not allowed',
        status: 403
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

const PORT = process.env.PORT || config.port;

// Start server
const startServer = async () => {
  try {
    // Database will be initialized through models/index.js
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
      console.log(`Health check available at http://0.0.0.0:${PORT}/health`);
      console.log('CORS enabled for origins:', config.corsOrigin);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
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

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Performing graceful shutdown...');
  process.exit(0);
});

startServer();

export default app;
