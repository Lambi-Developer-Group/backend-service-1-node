const express = require('express');
const router = express();

const { createNewSession, getAllRecomendation, deleteAllSession, getUserSessions} = require('../controllers/sessions');

router.post('/', getUserSessions);
router.delete('/', deleteAllSession);
router.post('/new', createNewSession);
router.post('/recomid', getAllRecomendation);

module.exports = router;
