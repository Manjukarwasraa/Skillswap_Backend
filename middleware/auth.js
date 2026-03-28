const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token found' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = checkToken;
