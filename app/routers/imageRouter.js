const express = require('express');
const router = express();

const { processFile } = require('../services/images');

const { getAllBucketImages, addImages } = require('../controllers/images');

router.get('/', getAllBucketImages);
router.post('/', processFile, addImages);

module.exports = router;
