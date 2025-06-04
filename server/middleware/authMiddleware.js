import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(' No token provided in Authorization header');
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(' Authenticated user:', decoded);
    next();
  } catch (err) {
    console.error(' Invalid token:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
