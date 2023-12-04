const express = require('express');
const router = express();

const { userLogin, userRegister } = require('../controllers/auth');

router.post('/login', userLogin);
router.post('/register', userRegister);

module.exports = router;
