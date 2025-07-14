// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session.userId && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

module.exports = { requireAuth };