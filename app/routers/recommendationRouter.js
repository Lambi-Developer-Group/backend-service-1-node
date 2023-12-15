const express = require('express');
const router = express();

const {
  getRecommendationId,
  getRecommendationImages,
} = require('../controllers/recommendation');

router.post('/', getRecommendationId);
router.post('/images', getRecommendationImages);

module.exports = router;
