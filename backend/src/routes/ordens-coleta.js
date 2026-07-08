const express = require('express');
const OrdenColeta = require('../models/OrdenColeta');
const { autenticacao } = require('../middleware/autenticacao');

const router = express.Router();

router.post('/', autenticacao, async (req, res) => {
  try {
    const { numero_ordem, cliente_id, endereco_coleta, endereco_entrega, descricao_carga, peso_estimado, valor_frete, data_coleta } = req.body;

    if (!numero_ordem || !cliente_id || !endereco_coleta || !endereco_entrega || !valor_frete) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const ordemExistente = await OrdenColeta.buscarPorNumero(numero_ordem);
    if (ordemExistente) {
      return res.status(400).json({ erro: 'Número de ordem já existe' });
    }

    const ordemId = await OrdenColeta.criar({
      numero_ordem,
      cliente_id,
      endereco_coleta,
      endereco_entrega,
      descricao_carga,
      peso_estimado,
      valor_frete,
      data_coleta
    });

    const ordem = await OrdemColeta.buscarPorId(ordemId);
    res.status(201).json({ mensagem: 'Ordem de coleta criada com sucesso', ordem });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/', autenticacao, async (req, res) => {
  try {
    const { cliente_id, status, pagina = 1, limite = 10 } = req.query;
    const ordens = await OrdenColeta.listar(
      { cliente_id, status },
      parseInt(limite),
      parseInt(pagina)
    );
    res.json({ ordens, pagina: parseInt(pagina), limite: parseInt(limite) });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', autenticacao, async (req, res) => {
  try {
    const { id } = req.params;
    const ordem = await OrdenColeta.buscarPorId(id);

    if (!ordem) {
      return res.status(404).json({ erro: 'Ordem de coleta não encontrada' });
    }

    res.json(ordem);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.patch('/:id/status', autenticacao, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ erro: 'Status é obrigatório' });
    }

    const ordem = await OrdenColeta.buscarPorId(id);
    if (!ordem) {
      return res.status(404).json({ erro: 'Ordem de coleta não encontrada' });
    }

    await OrdenColeta.atualizarStatus(id, status);
    res.json({ mensagem: 'Status atualizado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
