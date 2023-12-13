const express = require('express');
const router = express();

const { getAllBucketImages, addImage } = require('../controllers/images');

router.get('/', getAllBucketImages);
router.post('/', addImage);

module.exports = router;
