import { verifyAccess } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) return res.status(401).json({ success: false, error: 'Missing token' });
  try {
    const payload = verifyAccess(token);
    req.user = { id: payload.sub, tokenVersion: payload.tv, name: payload.name };
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
