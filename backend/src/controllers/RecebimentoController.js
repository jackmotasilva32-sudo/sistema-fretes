const Recebimento = require('../models/Recebimento');

class RecebimentoController {
  static async criar(req, res) {
    try {
      const { tipo_recebimento, cliente_id, motorista_id, valor, descricao, forma_recebimento, numero_cheque, banco_cheque, data_recebimento, observacoes } = req.body;

      if (!tipo_recebimento || !valor || !forma_recebimento || !data_recebimento) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
      }

      const recebimentoId = await Recebimento.criar({
        tipo_recebimento,
        cliente_id,
        motorista_id,
        valor,
        descricao,
        forma_recebimento,
        numero_cheque,
        banco_cheque,
        data_recebimento,
        observacoes
      });

      const recebimento = await Recebimento.buscarPorId(recebimentoId);
      res.status(201).json({ mensagem: 'Recebimento registrado com sucesso', recebimento });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async listar(req, res) {
    try {
      const { cliente_id, motorista_id, tipo_recebimento, data_inicio, data_fim, pagina = 1, limite = 10 } = req.query;

      const recebimentos = await Recebimento.listar(
        { cliente_id, motorista_id, tipo_recebimento, data_inicio, data_fim },
        parseInt(limite),
        parseInt(pagina)
      );

      res.json({ recebimentos, pagina: parseInt(pagina), limite: parseInt(limite) });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async obter(req, res) {
    try {
      const { id } = req.params;
      const recebimento = await Recebimento.buscarPorId(id);

      if (!recebimento) {
        return res.status(404).json({ erro: 'Recebimento não encontrado' });
      }

      res.json(recebimento);
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async relatorioPorPeriodo(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ erro: 'data_inicio e data_fim são obrigatórios' });
      }

      const relatorio = await Recebimento.relatorioPorPeriodo(data_inicio, data_fim);
      res.json(relatorio);
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = RecebimentoController;
