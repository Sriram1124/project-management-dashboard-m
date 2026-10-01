import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { projectRouter } from './routes/project.routes';
import { userRouter } from './routes/user.routes';
import { workItemRouter } from './routes/work-item.routes';
import { formRouter } from './routes/form.routes';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);
app.use('/api/work-items', workItemRouter);
app.use('/api/forms', formRouter);

export default app;
