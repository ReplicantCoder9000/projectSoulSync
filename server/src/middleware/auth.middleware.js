import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import db from '../models/index.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'No token provided',
          status: 401
        }
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find user and attach to request
    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'User not found',
          status: 401
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: {
          message: 'Token expired',
          status: 401
        }
      });
    }

    return res.status(401).json({
      error: {
        message: 'Invalid token',
        status: 401
      }
    });
  }
};

export const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await db.Entry.findByPk(id);

    if (!entry) {
      return res.status(404).json({
        error: {
          message: 'Entry not found',
          status: 404
        }
      });
    }

    if (entry.user_id !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'Not authorized',
          status: 403
        }
      });
    }

    req.entry = entry;
    next();
  } catch (error) {
    next(error);
  }
};
