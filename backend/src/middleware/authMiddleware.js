import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Your session has expired. Please login again.');
      }

      next();
    } catch (error) {
      res.status(401);
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid authentication token. Please login again.');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Your session has expired. Please login again.');
      } else {
        throw new Error('Authentication failed. Please login again.');
      }
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Please login to access this resource.');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('You do not have permission to access this resource.');
  }
};

export { protect, admin };