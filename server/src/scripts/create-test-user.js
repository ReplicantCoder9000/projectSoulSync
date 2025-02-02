import { Sequelize } from 'sequelize';
import UserModel from '../models/user.model.js';

const sequelize = new Sequelize('postgresql://journal_app_db_c496_user:CGBh2pZUfWIZuku5abLeiI18tVDrTxeO@dpg-cu4rmq5ds78s73ds0nm0-a.oregon-postgres.render.com/journal_app_db_c496', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    underscored: true, // Use snake_case for column names
    timestamps: true
  }
});

const User = UserModel(sequelize);
await sequelize.sync(); // Ensure tables are created

const db = {
  sequelize,
  User
};

const createTestUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: {
        email: 'testuser789@example.com'
      }
    });

    if (existingUser) {
      console.log('Test user already exists:', {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email
      });
      await db.sequelize.close();
      return;
    }

    const userData = {
      username: 'testuser789',
      email: 'testuser789@example.com',
      password: 'TestPassword789!',
      lastLogin: null
    };

    const user = await db.User.create(userData);
    console.log('Test user created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email
    });

    // Close database connection
    await db.sequelize.close();
  } catch (error) {
    console.error('Error creating test user:', error);
    console.error('Error details:', error.message);
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation errors:', error.errors);
    }
    process.exit(1);
  }
};

createTestUser();
