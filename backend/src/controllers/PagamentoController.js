const Pagamento = require('../models/Pagamento');
const Motorista = require('../models/Motorista');

class PagamentoController {
  static async criar(req, res) {
    try {
      const { tipo_pagamento, motorista_id, valor, descricao, forma_pagamento, numero_cheque, banco_cheque, data_vencimento } = req.body;

      if (!tipo_pagamento || !valor || !forma_pagamento) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
      }

      const pagamentoId = await Pagamento.criar({
        tipo_pagamento,
        motorista_id,
        valor,
        descricao,
        forma_pagamento,
        numero_cheque,
        banco_cheque,
        data_vencimento
      });

      const pagamento = await Pagamento.buscarPorId(pagamentoId);
      res.status(201).json({ mensagem: 'Pagamento registrado com sucesso', pagamento });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async listar(req, res) {
    try {
      const { motorista_id, status, tipo_pagamento, forma_pagamento, pagina = 1, limite = 10 } = req.query;

      const pagamentos = await Pagamento.listar(
        { motorista_id, status, tipo_pagamento, forma_pagamento },
        parseInt(limite),
        parseInt(pagina)
      );

      res.json({ pagamentos, pagina: parseInt(pagina), limite: parseInt(limite) });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async obter(req, res) {
    try {
      const { id } = req.params;
      const pagamento = await Pagamento.buscarPorId(id);

      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      res.json(pagamento);
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async registrarPagamento(req, res) {
    try {
      const { id } = req.params;
      const { data_pagamento } = req.body;

      const pagamento = await Pagamento.buscarPorId(id);
      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      // Se for comissão e motorista_id existe, abater do saldo do motorista
      if (pagamento.tipo_pagamento === 'comissao' && pagamento.motorista_id) {
        await Motorista.atualizarSaldo(pagamento.motorista_id, pagamento.valor, 'subtrair');
      }

      await Pagamento.registrarPagamento(id, data_pagamento || new Date().toISOString().split('T')[0]);

      res.json({ mensagem: 'Pagamento registrado com sucesso' });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async cancelarPagamento(req, res) {
    try {
      const { id } = req.params;

      const pagamento = await Pagamento.buscarPorId(id);
      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      if (pagamento.tipo_pagamento === 'comissao' && pagamento.motorista_id) {
        await Motorista.atualizarSaldo(pagamento.motorista_id, pagamento.valor, 'adicionar');
      }

      await Pagamento.cancelarPagamento(id);

      res.json({ mensagem: 'Pagamento cancelado com sucesso' });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async relatorioPagamentosMotorista(req, res) {
    try {
      const { motorista_id, data_inicio, data_fim } = req.query;

      if (!motorista_id || !data_inicio || !data_fim) {
        return res.status(400).json({ erro: 'motorista_id, data_inicio e data_fim são obrigatórios' });
      }

      const relatorio = await Pagamento.relatorioPagamentosMotorista(motorista_id, data_inicio, data_fim);
      res.json(relatorio);
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = PagamentoController;
