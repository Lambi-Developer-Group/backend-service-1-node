const express = require('express');
const router = express();

const { userLogin, userRegister, test } = require('../controllers/auth');

router.post('/login', userLogin);
router.post('/register', userRegister);

router.get('/test', test);

module.exports = router;
