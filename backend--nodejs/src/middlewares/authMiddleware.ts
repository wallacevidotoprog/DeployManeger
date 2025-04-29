import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
}
