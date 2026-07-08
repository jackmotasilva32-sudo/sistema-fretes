const express = require('express');
const Veiculo = require('../models/Veiculo');
const { autenticacao } = require('../middleware/autenticacao');

const router = express.Router();

router.post('/', autenticacao, async (req, res) => {
  try {
    const { motorista_id, placa, marca, modelo, ano, cor, renavam, seguro_vencimento, ipva_vencimento } = req.body;

    if (!motorista_id || !placa || !marca || !modelo) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const veiculoExistente = await Veiculo.buscarPorPlaca(placa);
    if (veiculoExistente) {
      return res.status(400).json({ erro: 'Placa já cadastrada' });
    }

    const veiculoId = await Veiculo.criar({
      motorista_id,
      placa,
      marca,
      modelo,
      ano,
      cor,
      renavam,
      seguro_vencimento,
      ipva_vencimento
    });

    const veiculo = await Veiculo.buscarPorId(veiculoId);
    res.status(201).json({ mensagem: 'Veículo registrado com sucesso', veiculo });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/', autenticacao, async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const veiculos = await Veiculo.listar(parseInt(limite), parseInt(pagina));
    res.json({ veiculos, pagina: parseInt(pagina), limite: parseInt(limite) });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', autenticacao, async (req, res) => {
  try {
    const { id } = req.params;
    const veiculo = await Veiculo.buscarPorId(id);

    if (!veiculo) {
      return res.status(404).json({ erro: 'Veículo não encontrado' });
    }

    res.json(veiculo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/motorista/:motorista_id', autenticacao, async (req, res) => {
  try {
    const { motorista_id } = req.params;
    const veiculos = await Veiculo.listarPorMotorista(motorista_id);
    res.json({ veiculos });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.patch('/:id', autenticacao, async (req, res) => {
  try {
    const { id } = req.params;
    const veiculo = await Veiculo.buscarPorId(id);

    if (!veiculo) {
      return res.status(404).json({ erro: 'Veículo não encontrado' });
    }

    await Veiculo.atualizar(id, req.body);
    const veiculoAtualizado = await Veiculo.buscarPorId(id);
    res.json({ mensagem: 'Veículo atualizado com sucesso', veiculo: veiculoAtualizado });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
