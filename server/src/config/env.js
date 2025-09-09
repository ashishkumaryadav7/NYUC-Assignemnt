import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nyuc_task_manager',
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTtl: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  refreshTtl: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  cookieName: process.env.COOKIE_NAME || 'rt',
};
