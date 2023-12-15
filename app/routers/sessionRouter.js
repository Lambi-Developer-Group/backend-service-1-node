const express = require('express');
const router = express();

const { createNewSession, getAllSession, getAllRecomendation, deleteAllSession} = require('../controllers/sessions');

router.post('/new', createNewSession);
router.post('/', getAllSession);
router.post('/recomid', getAllRecomendation);
router.delete('/', deleteAllSession);

module.exports = router;
