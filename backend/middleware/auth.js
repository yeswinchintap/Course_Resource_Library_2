const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log('[AUTH] Incoming request. Checking token...');

  if (!token) {
    console.log('[AUTH] No token provided.');
    return res.status(403).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] Token verified. User:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('[AUTH] Token invalid or expired.', err.message);
    res.status(401).send("Invalid token.");
  }
};

exports.checkRole = (role) => {
  return (req, res, next) => {
    console.log(`[AUTH] Role check for ${role}. Current role: ${req.user?.role}`);
    if (req.user.role !== role) {
      console.log('[AUTH] Access denied due to role mismatch.');
      return res.status(403).send("Access denied. Insufficient permissions.");
    }
    console.log('[AUTH] Role verified. Proceeding...');
    next();
  };
};
