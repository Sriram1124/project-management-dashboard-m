import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './lib/prisma';

const PORT = Number(process.env.PORT) || 3001;
const HOST = '0.0.0.0';

async function start() {
  try {
    await prisma.$connect();
    console.log('Connected to database.');
    
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
