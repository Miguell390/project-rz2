// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   let token = req.headers.authorization;
//   if (token && token.startsWith('Bearer')) {
//     try {
//       token = token.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// const coordinatorOnly = (req, res, next) => {
//   if (req.user && req.user.role === 'Coordinator') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Not authorized as Coordinator' });
//   }
// };

// module.exports = { protect, coordinatorOnly };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const coordinatorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Coordinator') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as Coordinator' });
  }
};

// 👇 THIS LINE IS CRUCIAL! If it's missing, Express crashes.
module.exports = { protect, coordinatorOnly };