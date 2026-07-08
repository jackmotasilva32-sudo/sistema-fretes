const express = require('express');
const FreteController = require('../controllers/FreteController');
const { autenticacao } = require('../middleware/autenticacao');

const router = express.Router();

router.post('/', autenticacao, FreteController.criar);
router.get('/', autenticacao, FreteController.listar);
router.get('/:id', autenticacao, FreteController.obter);
router.patch('/:id/iniciar-viagem', autenticacao, FreteController.iniciarViagem);
router.patch('/:id/finalizar-viagem', autenticacao, FreteController.finalizarViagem);
router.patch('/:id/abastecimento', autenticacao, FreteController.atualizarAbastecimento);
router.get('/relatorio/motorista', autenticacao, FreteController.relatorioPorMotorista);

module.exports = router;
