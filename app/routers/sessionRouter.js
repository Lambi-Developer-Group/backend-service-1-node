const express = require('express');
const router = express();

const { createNewSession, getAllSession } = require('../controllers/sessions');

router.post('/new', createNewSession);
router.get('/', getAllSession);

module.exports = router;
