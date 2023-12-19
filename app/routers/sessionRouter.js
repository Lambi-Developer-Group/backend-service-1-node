/**
 * @swagger
 * tags:
 *   name: Session Router
 *   description: Create, Get, Delete session.
 */

/**
 * @swagger
 * /api/sessions/new:
 *   post:
 *     summary: Get
 *     description: Endpoint to get user session with Token
 *     tags: [Session Router]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: "your_jwt_token_here"
 */

const express = require('express');
const router = express();

const { createNewSession, getAllRecomendation, deleteAllSession, getUserSessions} = require('../controllers/sessions');

router.post('/', getUserSessions);
router.delete('/', deleteAllSession);
router.post('/new', createNewSession);
router.post('/recomid', getAllRecomendation);

module.exports = router;
