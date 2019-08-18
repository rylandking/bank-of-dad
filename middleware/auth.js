// middleware has action to req res cycle (object)
// So every time we hit the end point we can fire off this middleware
// We just want to check to see if there is a token in the header (from js webtoken)

const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function (only pertains to protected routes)
module.exports = function(req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    // 401 is unauthorized
    return res.status(401).json({ msg: 'No token. Authorization denied.' });
  }

  // If there is a token
  try {
    // Verify the token and pull out the payload
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Set the parent that's in that payload to req.parent so we have access to it inside the route
    req.parent = decoded.parent;
    next();
  } catch (err) {
    // If it doesn't verify, then we'll respond with this
    res.status(401).json({ msg: 'Token is not valid.' });
  }
};
