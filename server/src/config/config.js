export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || (process.env.NODE_ENV === 'production' ? 10000 : 5002),
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigin: process.env.CORS_ALLOWED_ORIGINS ? 
    process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
    [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://soulsync.netlify.app',
      'https://679e6bf092f0a8dc3d5ee08b--soulsync.netlify.app'
    ],
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  db: {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/mood_journal',
    options: {
      logging: process.env.NODE_ENV !== 'production',
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  }
};

export const dbConfig = {
  development: {
    ...config.db,
    logging: console.log,
    dialectOptions: {
      ssl: false
    }
  },
  test: {
    ...config.db,
    logging: false,
    dialectOptions: {
      ssl: false
    }
  },
  production: {
    ...config.db,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
