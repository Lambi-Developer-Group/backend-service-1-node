const express = require('express');
const app = express();

const projectId = 'fashap';

// router files
const authRouter = require('./app/routers/authRouter');
const userRouter = require('./app/routers/userRouter');
const imageRouter = require('./app/routers/imageRouter');

// Middleware to parse JSON in requests
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to API' });
});

// routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);

// Route users from users.js router
// const usersRouter = require('./app/routers/users');
// app.use(usersRouter);

// Route users from images.js router
// const imagesRouter = require('./app/routers/images');
// app.use(imagesRouter.router);

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(3000, '0.0.0.0');
