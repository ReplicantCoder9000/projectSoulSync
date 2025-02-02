import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import db from '../models/index.js';

const logAuthMiddlewareEvent = (type, userId = null, error = null) => {
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

  console.log('Auth Middleware Event:', JSON.stringify(logMessage));
};

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logAuthMiddlewareEvent('auth_header_missing');
      return res.status(401).json({
        error: {
          message: 'No authorization token provided',
          status: 401
        }
      });
    }

    // Check if the header follows the Bearer scheme
    if (!authHeader.startsWith('Bearer ')) {
      logAuthMiddlewareEvent('invalid_auth_scheme');
      return res.status(401).json({
        error: {
          message: 'Invalid authorization scheme',
          status: 401
        }
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      // Check token expiration
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        logAuthMiddlewareEvent('token_expired', decoded.id);
        return res.status(401).json({
          error: {
            message: 'Token has expired',
            status: 401
          }
        });
      }

      // Find user
      const user = await db.User.findByPk(decoded.id);
      if (!user) {
        logAuthMiddlewareEvent('user_not_found', decoded.id);
        return res.status(401).json({
          error: {
            message: 'User not found',
            status: 401
          }
        });
      }

      // Check if email in token matches user's current email
      if (decoded.email !== user.email) {
        logAuthMiddlewareEvent('email_mismatch', decoded.id);
        return res.status(401).json({
          error: {
            message: 'Invalid token',
            status: 401
          }
        });
      }

      // Attach user to request
      req.user = user;
      logAuthMiddlewareEvent('token_verified', user.id);
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        logAuthMiddlewareEvent('invalid_token', null, error);
        return res.status(401).json({
          error: {
            message: 'Invalid token',
            status: 401
          }
        });
      }
      if (error.name === 'TokenExpiredError') {
        logAuthMiddlewareEvent('token_expired', null, error);
        return res.status(401).json({
          error: {
            message: 'Token has expired',
            status: 401
          }
        });
      }
      throw error;
    }
  } catch (error) {
    logAuthMiddlewareEvent('auth_error', null, error);
    next(error);
  }
};

// Optional middleware to attach user if token exists, but not require it
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await db.User.findByPk(decoded.id);
      
      if (user && decoded.email === user.email) {
        req.user = user;
        logAuthMiddlewareEvent('optional_auth_success', user.id);
      }
    } catch (error) {
      logAuthMiddlewareEvent('optional_auth_error', null, error);
    }

    next();
  } catch (error) {
    logAuthMiddlewareEvent('optional_auth_error', null, error);
    next(error);
  }
};

// Middleware to verify resource ownership
export const isOwner = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const userId = req.user.id;

    const entry = await db.Entry.findByPk(entryId);

    if (!entry) {
      logAuthMiddlewareEvent('resource_not_found', userId);
      return res.status(404).json({
        error: {
          message: 'Entry not found',
          status: 404
        }
      });
    }

    if (entry.userId !== userId) {
      logAuthMiddlewareEvent('unauthorized_access', userId);
      return res.status(403).json({
        error: {
          message: 'You do not have permission to access this resource',
          status: 403
        }
      });
    }

    // Attach entry to request for later use
    req.entry = entry;
    logAuthMiddlewareEvent('ownership_verified', userId);
    next();
  } catch (error) {
    logAuthMiddlewareEvent('ownership_verification_error', req.user?.id, error);
    next(error);
  }
};
