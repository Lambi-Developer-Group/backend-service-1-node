/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     description: Endpoint for user login
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: "your_jwt_token_here"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register
 *     description: Endpoint for user registration
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successful registration
 *         content:
 *           application/json:
 *             example:
 *               message: "User registered successfully"
 */

const express = require('express');
const router = express();

const {
  userLogin,
  userRegister,
  testAuth,
  tokenSubmitter,
  test,
} = require('../controllers/auth');

router.post('/login', userLogin);
router.post('/register', userRegister);
router.get('/test', testAuth); // simple proof of return
router.post('/tokensubmit', tokenSubmitter);

router.get('/test', test);

module.exports = router;
