const express = require('express');
const Cliente = require('../models/Cliente');
const { autenticacao } = require('../middleware/autenticacao');

const router = express.Router();

router.post('/', autenticacao, async (req, res) => {
  try {
    const { nome, cnpj_cpf, email, telefone, endereco, cidade, estado, cep } = req.body;

    if (!nome || !cnpj_cpf) {
      return res.status(400).json({ erro: 'Nome e CNPJ/CPF são obrigatórios' });
    }

    const clienteId = await Cliente.criar({
      nome,
      cnpj_cpf,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cep
    });

    const cliente = await Cliente.buscarPorId(clienteId);
    res.status(201).json({ mensagem: 'Cliente criado com sucesso', cliente });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/', autenticacao, async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const clientes = await Cliente.listar(parseInt(limite), parseInt(pagina));
    res.json({ clientes, pagina: parseInt(pagina), limite: parseInt(limite) });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', autenticacao, async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.buscarPorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.patch('/:id', autenticacao, async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.buscarPorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    await Cliente.atualizar(id, req.body);
    const clienteAtualizado = await Cliente.buscarPorId(id);
    res.json({ mensagem: 'Cliente atualizado com sucesso', cliente: clienteAtualizado });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id/saldo', autenticacao, async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.buscarPorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json({ cliente_id: id, saldo: cliente.saldo });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
