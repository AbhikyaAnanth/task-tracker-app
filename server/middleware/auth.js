// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session.userId && req.session.user) {
    // Make user information available in req.user for easy access
    req.user = req.session.user;
    req.userId = req.session.userId;
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

module.exports = { requireAuth };