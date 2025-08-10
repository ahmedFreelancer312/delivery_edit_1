module.exports = (req, res, next) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};