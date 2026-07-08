const express = require('express');
const RecebimentoController = require('../controllers/RecebimentoController');
const { autenticacao, autorizacao } = require('../middleware/autenticacao');

const router = express.Router();

router.post('/', autenticacao, autorizacao(['admin', 'financeiro']), RecebimentoController.criar);
router.get('/', autenticacao, RecebimentoController.listar);
router.get('/:id', autenticacao, RecebimentoController.obter);
router.get('/relatorio/periodo', autenticacao, autorizacao(['admin', 'financeiro']), RecebimentoController.relatorioPorPeriodo);

module.exports = router;
