import jwt from 'jsonwebtoken';
import { UserToken } from '../models/user/user.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'secrettoken';

export function generateToken(payload: UserToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
