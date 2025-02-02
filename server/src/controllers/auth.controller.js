import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import db from '../models/index.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
};

const logAuthEvent = (type, userId = null, error = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = {
    timestamp,
    type,
    userId,
    environment: config.nodeEnv
  };

  if (error) {
    logMessage.error = error.message;
    logMessage.stack = config.nodeEnv === 'development' ? error.stack : undefined;
  }

  console.log('Auth Event:', JSON.stringify(logMessage));
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: {
          message: 'All fields are required',
          status: 400
        }
      });
    }

    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      logAuthEvent('registration_failed', null, { message: `${field} already exists` });
      return res.status(400).json({
        error: {
          message: `User with this ${field} already exists`,
          status: 400
        }
      });
    }

    // Create new user
    const user = await db.User.create({
      username,
      email,
      password
    });

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const userData = user.toJSON();
    delete userData.password;

    logAuthEvent('registration_success', user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });
  } catch (error) {
    logAuthEvent('registration_error', null, error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'Email and password are required',
          status: 400
        }
      });
    }

    // Find user
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      logAuthEvent('login_failed', null, { message: 'Invalid credentials' });
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          status: 401
        }
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      logAuthEvent('login_failed', user.id, { message: 'Invalid credentials' });
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          status: 401
        }
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const userData = user.toJSON();
    delete userData.password;

    logAuthEvent('login_success', user.id);

    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    logAuthEvent('login_error', null, error);
    next(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const userData = req.user.toJSON();
    delete userData.password;

    logAuthEvent('profile_retrieved', req.user.id);

    res.json({
      message: 'Profile retrieved successfully',
      user: userData
    });
  } catch (error) {
    logAuthEvent('profile_error', req.user?.id, error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const user = req.user;

    // Check if new email/username is already taken
    if (email !== user.email || username !== user.username) {
      const existingUser = await db.User.findOne({
        where: {
          [db.Sequelize.Op.and]: [
            { id: { [db.Sequelize.Op.ne]: user.id } },
            {
              [db.Sequelize.Op.or]: [
                { email: email || user.email },
                { username: username || user.username }
              ]
            }
          ]
        }
      });

      if (existingUser) {
        logAuthEvent('profile_update_failed', user.id, { message: 'Email or username already taken' });
        return res.status(400).json({
          error: {
            message: 'Email or username already taken',
            status: 400
          }
        });
      }
    }

    // Update user
    await user.update({
      username: username || user.username,
      email: email || user.email
    });

    const userData = user.toJSON();
    delete userData.password;

    logAuthEvent('profile_updated', user.id);

    res.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    logAuthEvent('profile_update_error', req.user?.id, error);
    next(error);
  }
};
