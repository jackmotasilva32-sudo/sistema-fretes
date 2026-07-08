const express = require('express');
const AutenticacaoController = require('../controllers/AutenticacaoController');

const router = express.Router();

router.post('/login', AutenticacaoController.login);
router.post('/registrar', AutenticacaoController.registrar);

module.exports = router;
