const jwt = require('jsonwebtoken');

/**
 * Protect routes by validating a Bearer JWT token.
 * Adds req.user = { userId } when token is valid.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: missing token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT secret is not configured.' });
    }

    const decoded = jwt.verify(token, secret);
    req.user = { userId: decoded.userId };
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Unauthorized: invalid token.' });
  }
}

module.exports = authMiddleware;
