const express = require("express")
const app = express()

const projectId = 'fashap';

// Middleware to parse JSON in requests
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message:"Welcome to API"})
})

// Route users from users.js router
const usersRouter = require('./routers/users')
app.use(usersRouter)

// Route users from users.js router
const imagesRouter = require('./routers/images')
app.use(imagesRouter)

// Catch-all route for 404 errors
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

app.listen(3000, "0.0.0.0");