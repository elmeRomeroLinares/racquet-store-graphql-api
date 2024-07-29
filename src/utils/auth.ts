import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { UserRole } from '../entities/User';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('Environment variable jwt_sectet is missing');
}

export const generateToken = (id: string, role: UserRole): string => {
  const jWTPayload: JWTPayload = { id, role };
  return jwt.sign(jWTPayload, SECRET_KEY, { expiresIn: '1h' });
};
