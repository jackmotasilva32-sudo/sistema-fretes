const express = require('express');
const PagamentoController = require('../controllers/PagamentoController');
const { autenticacao, autorizacao } = require('../middleware/autenticacao');

const router = express.Router();

router.post('/', autenticacao, autorizacao(['admin', 'financeiro']), PagamentoController.criar);
router.get('/', autenticacao, PagamentoController.listar);
router.get('/:id', autenticacao, PagamentoController.obter);
router.patch('/:id/pagar', autenticacao, autorizacao(['admin', 'financeiro']), PagamentoController.registrarPagamento);
router.patch('/:id/cancelar', autenticacao, autorizacao(['admin', 'financeiro']), PagamentoController.cancelarPagamento);
router.get('/relatorio/motorista', autenticacao, autorizacao(['admin', 'financeiro']), PagamentoController.relatorioPagamentosMotorista);

module.exports = router;
