import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { setupSocket } from './socket/index.js';
import userRouter from './routes/userRouter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // not more than 100 requests 
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json());

// Base error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Connect user router
app.use(userRouter);

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});
app.use(express.static(join(__dirname, "public")));
setupSocket(io);

server.listen(3000, '0.0.0.0', () => {
  console.log('server running at http://localhost:3000');
});
