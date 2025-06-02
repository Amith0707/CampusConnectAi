import jwt from 'jsonwebtoken';

const authClubMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and has Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded club info (payload) to request object for later use
    req.club = decoded;
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authClubMiddleware;
