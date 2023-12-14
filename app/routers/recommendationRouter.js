const express = require('express');
const router = express();

const { getRecommendation } = require('../controllers/recommendation');

router.get('/:sessionId', getRecommendation);

module.exports = router;
