const express = require('express');
const router = express();

const { userLogin, userRegister, testAuth, tokenSubmitter } = require('../controllers/auth');

router.post('/login', userLogin);
router.post('/register', userRegister);
router.get('/test', testAuth); //simple proof of return
router.post('/tokensubmit', tokenSubmitter);

module.exports = router;
