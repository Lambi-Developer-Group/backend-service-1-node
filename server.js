const express = require('express');
const app = express();
const logger = require('morgan');
const http = require('http');

const projectId = 'fashap';
const port = 3000;

// middleware files
const notFoundMiddleware = require('./app/middleware/not-found');
const handleErrorMiddleware = require('./app/middleware/handler-error');

// router files
const authRouter = require('./app/routers/authRouter');
const userRouter = require('./app/routers/userRouter');
const imageRouter = require('./app/routers/imageRouter');
const sessionRouter = require('./app/routers/sessionRouter');

// Middleware to parse JSON in requests
app.use(logger('dev'));
app.use(express.json());

app.get('/api/', (req, res) => {
  res.json({ message: 'Welcome to Lambi API' });
});

// routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);
app.use('/api/sessions', sessionRouter);

// middleware
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

// initialize server
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log(`listening to ${port}`);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  // debug('Listening on ' + bind);
}
