export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  corsOrigin: process.env.CORS_ORIGIN ? 
    process.env.CORS_ORIGIN.split(',') : 
    ['http://localhost:5173', 'http://localhost:5174', 'https://soulsync.netlify.app'],
  db: {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/mood_journal',
    options: {
      logging: false,
      dialect: 'postgres',
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
    logging: console.log
  },
  test: {
    ...config.db,
    logging: false
  },
  production: {
    ...config.db,
    logging: false
  }
};
