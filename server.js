const express = require('express');
const app = express();
const logger = require('morgan');
const http = require('http');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
const recommendationRouter = require('./app/routers/recommendationRouter');

// Middleware to parse JSON in requests
app.use(logger('dev'));
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'LAMBI-API',
      version: '1.0.0',
      description: 'Express JS server to handle Android image & Firestore API requests',
      contact: {
        email: 'andhika.rahmanu@mail.ugm.ac.id',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Local Development Server',
      },
    ],
  },
  apis: ['./app/**/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/recommendations', recommendationRouter);

// middleware
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

// initialize server
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log(`Listening to http://localhost:${port}`);

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