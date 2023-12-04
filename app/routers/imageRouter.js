const express = require('express');
const router = express();

const { getAllBucketImages, addImages } = require('../controllers/images');

router.get('/', getAllBucketImages);
router.post('/', addImages);

module.exports = router;
