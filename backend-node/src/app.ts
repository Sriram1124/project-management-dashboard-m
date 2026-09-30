import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { projectRouter } from './routes/project.routes';
import { userRouter } from './routes/user.routes';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);

export default app;
