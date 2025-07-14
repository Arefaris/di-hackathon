import './config/env.js'; // Load environment variables
import express from 'express';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { setupSocket } from './socket/index.js';

import pool from './config/pool.js';
import sessionMiddleware from './middleware/sessionConfig.js';
import commonMiddleware from './middleware/commonMiddleware.js';
import errorHandler from './middleware/errorHandler.js';

import userRouter from './routes/userRouter.js';
import pagesRouter from './routes/pagesRouter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1);
// Apply basic middlewares (JSON parser, CORS, etc.)
commonMiddleware(app);
// Set up session handling
app.use(sessionMiddleware(pool));

// Serve static files (e.g. frontend)
app.use(express.static(join(__dirname, "public")));
// Mount API and page routes
app.use(userRouter);
app.use(pagesRouter);

// Global error handler
app.use(errorHandler);

const server = createServer(app);
// Share session with Socket.IO
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: process.env.ORIGIN_URL,
    credentials: true
  }
});

// Middleware for using sessions with Socket.IO 
io.engine.use(sessionMiddleware(pool));
// Register socket event handlers
setupSocket(io);

// Start HTTP + WebSocket server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
