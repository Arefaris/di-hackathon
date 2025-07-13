import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
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
import db from './config/db.js';
import pg from 'pg';
import pool from './config/pool.js';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // not more than 100 requests 
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const pgSessionStore = pgSession(session); // initialize session storage

app.use(helmet());
app.use(cors({origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Settings express-session middleware
app.use(session({
  store: new pgSessionStore({
    pool, 
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Connect user router
app.use(userRouter);

// Base error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

// Middleware for using sessions with Socket.IO 
io.engine.use(session({
  store: new pgSessionStore({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

app.use(express.static(join(__dirname, "public")));
setupSocket(io);

server.listen(3000, '0.0.0.0', () => {
  console.log('server running at http://localhost:3000');
});
