const express = require('express');
const router = express();

const { createNewSession, getAllSession, getAllRecomendation } = require('../controllers/sessions');

router.post('/new', createNewSession);
router.get('/', getAllSession);
router.get('/recomid', getAllRecomendation);

module.exports = router;
