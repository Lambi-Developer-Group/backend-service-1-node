const express = require('express');
const router = express();

const { userLogin, userRegister, testAuth } = require('../controllers/auth');

router.post('/login', userLogin);
router.post('/register', userRegister);
router.get('/test', testAuth); //simple proof of return

module.exports = router;
