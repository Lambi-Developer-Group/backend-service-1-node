const express = require('express');
const router = express();

const { createNewSession } = require('../controllers/sessions');

router.post('/newSession', createNewSession);

module.exports = router;
