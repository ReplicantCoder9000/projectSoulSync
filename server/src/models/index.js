import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/config.js';
import defineUserModel from './user.model.js';
import defineEntryModel from './entry.model.js';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(config.url, {
  ...config,
  define: {
    timestamps: true,
    underscored: true
  }
});

// Initialize models
const User = defineUserModel(sequelize);
const Entry = defineEntryModel(sequelize);

// Set up associations
User.hasMany(Entry, { foreignKey: 'userId', as: 'entries' });
Entry.belongsTo(User, { foreignKey: 'userId', as: 'author' });

const db = {
  sequelize,
  Sequelize,
  User,
  Entry
};

// Test database connection and sync models
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Force sync in development mode only
    const force = process.env.NODE_ENV === 'development';
    
    // Sync User model first
    await User.sync({ force });
    console.log('User model synchronized.');
    
    // Then sync Entry model
    await Entry.sync({ force });
    console.log('Entry model synchronized.');
    
    console.log('All models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

export default db;
