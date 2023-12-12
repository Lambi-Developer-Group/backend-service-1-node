const express = require('express');
const router = express();

const { createNewSession, getAllSession, getAllRecomendation } = require('../controllers/sessions');

router.post('/new', createNewSession);
router.post('/', getAllSession);
router.post('/recomid', getAllRecomendation);

module.exports = router;
