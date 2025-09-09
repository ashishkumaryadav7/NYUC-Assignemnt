import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  const payload = { sub: user._id.toString(), tv: user.tokenVersion, name: user.name };
  return jwt.sign(payload, env.accessSecret, { expiresIn: env.accessTtl });
}

export function signRefreshToken(user) {
  const payload = { sub: user._id.toString(), tv: user.tokenVersion };
  return jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshTtl });
}

export function verifyAccess(token) {
  return jwt.verify(token, env.accessSecret);
}

export function verifyRefresh(token) {
  return jwt.verify(token, env.refreshSecret);
}
