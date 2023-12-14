const express = require('express');
const router = express();

const {
  getRecommendationId,
  getRecommendationImages,
} = require('../controllers/recommendation');

router.get('/:sessionId', getRecommendationId);
router.get('/:sessionId/:recommendationId', getRecommendationImages);

module.exports = router;
