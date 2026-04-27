import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const APP_PASSWORD = process.env.APP_PASSWORD || 'storymagic123';

export function generateToken() {
  return jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyPassword(password) {
  return password === APP_PASSWORD;
}
