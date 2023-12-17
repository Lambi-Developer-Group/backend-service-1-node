const express = require('express');
const router = express();

const { processFile } = require('../services/images');

const { getAllBucketImages, addImage } = require('../controllers/images');

router.get('/', getAllBucketImages);
router.post('/', processFile, addImage);

module.exports = router;
