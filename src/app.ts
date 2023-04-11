import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import compressFilter from './utils/compressFilter.util';
import { errorHandler } from './middleware/errorHandler';
import config from './config/config';
import { xssMiddleware } from './middleware/xssMiddleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authRouter } from './routes';
import authLimiter from './middleware/authLimiter';

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: String(config.cors.origin).split('|')
  }
});

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(xssMiddleware());

app.use(cookieParser());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: String(config.cors.origin).split('|'),
    credentials: true
  })
);

app.use('/auth', authLimiter, authRouter);

io.on('connection', (socket) => {
  console.log('A user connected, socket id: ' + socket.id);

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.all('*', (_req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});

app.use(errorHandler);

export default server;
