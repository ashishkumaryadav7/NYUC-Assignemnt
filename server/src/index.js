import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.set('trust proxy', 1);



app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());



const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', authLimiter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

await connectDB();
app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
