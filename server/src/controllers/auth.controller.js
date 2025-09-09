import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signAccessToken, signRefreshToken, verifyRefresh } from '../utils/jwt.js';
import { created, ok, unauthorized } from '../utils/responses.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',  
  sameSite: 'none',                    
  domain: env.nodeEnv === 'production' ? '.onrender.com' : undefined,
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, error: 'Email already registered' });

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie(env.cookieName, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return created(res, { accessToken, user: { id: user._id, name: user.name, email: user.email } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return unauthorized(res, 'Invalid credentials');

  const okPass = await user.comparePassword(password);
  if (!okPass) return unauthorized(res, 'Invalid credentials');

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie(env.cookieName, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return ok(res, { accessToken, user: { id: user._id, name: user.name, email: user.email } });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) return unauthorized(res, 'Missing refresh token');

  let payload;
  try {
    payload = verifyRefresh(token);
  } catch {
    return unauthorized(res, 'Invalid refresh token');
  }

  const user = await User.findById(payload.sub);
  if (!user) return unauthorized(res, 'User not found');
  if (user.tokenVersion !== payload.tv) return unauthorized(res, 'Refresh token revoked');

  const accessToken = signAccessToken(user);
  const newRefresh = signRefreshToken(user); 

  res.cookie(env.cookieName, newRefresh, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return ok(res, { accessToken, user: { id: user._id, name: user.name, email: user.email } });
});

export const logout = asyncHandler(async (req, res) => {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (token) {
    try {
      const { sub } = verifyRefresh(token);
      await User.findByIdAndUpdate(sub, { $inc: { tokenVersion: 1 } });
    } catch {}
  }
  res.clearCookie(env.cookieName, { ...cookieOptions });
  return ok(res, { message: 'Logged out' });
});
