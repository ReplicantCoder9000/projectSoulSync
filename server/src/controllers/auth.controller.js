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

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: {
          message: 'User with this email or username already exists',
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

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
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

    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  // User is already attached to req by auth middleware
  res.json({
    message: 'Profile retrieved successfully',
    user: req.user
  });
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

    res.json({
      message: 'Profile updated successfully',
      user: user
    });
  } catch (error) {
    next(error);
  }
};
