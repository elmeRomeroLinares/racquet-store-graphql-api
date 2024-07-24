import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error('Environment variable jwt_sectet is missing')
}

export const generateToken = (id: string, username: string): string => {
  return jwt.sign({ id, username }, SECRET_KEY, { expiresIn: '1h' });
};
