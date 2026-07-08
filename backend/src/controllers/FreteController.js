const Frete = require('../models/Frete');
const Motorista = require('../models/Motorista');
const Abastecimento = require('../models/Abastecimento');

class FreteController {
  static async criar(req, res) {
    try {
      const { numero_frete, ordem_coleta_id, motorista_id, veiculo_id, valor_frete, abastecimento, observacoes } = req.body;

      if (!numero_frete || !ordem_coleta_id || !motorista_id || !valor_frete) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
      }

      const freteExistente = await Frete.buscarPorNumero(numero_frete);
      if (freteExistente) {
        return res.status(400).json({ erro: 'Número de frete já existe' });
      }

      const freteId = await Frete.criar({
        numero_frete,
        ordem_coleta_id,
        motorista_id,
        veiculo_id,
        valor_frete,
        abastecimento: abastecimento || 0,
        observacoes
      });

      const frete = await Frete.buscarPorId(freteId);
      res.status(201).json({ mensagem: 'Frete criado com sucesso', frete });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async listar(req, res) {
    try {
      const { motorista_id, status, data_inicio, data_fim, pagina = 1, limite = 10 } = req.query;

      const fretes = await Frete.listar(
        { motorista_id, status, data_inicio, data_fim },
        parseInt(limite),
        parseInt(pagina)
      );

      res.json({ fretes, pagina: parseInt(pagina), limite: parseInt(limite) });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async obter(req, res) {
    try {
      const { id } = req.params;
      const frete = await Frete.buscarPorId(id);

      if (!frete) {
        return res.status(404).json({ erro: 'Frete não encontrado' });
      }

      res.json(frete);
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async iniciarViagem(req, res) {
    try {
      const { id } = req.params;
      const { km_saida } = req.body;

      const frete = await Frete.buscarPorId(id);
      if (!frete) {
        return res.status(404).json({ erro: 'Frete não encontrado' });
      }

      const query = `UPDATE fretes SET status = 'em_viagem', data_saida = NOW(), km_saida = ? WHERE id = ?`;
      const db = require('../config/database');
      await db.execute(query, [km_saida, id]);

      res.json({ mensagem: 'Viagem iniciada com sucesso' });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async finalizarViagem(req, res) {
    try {
      const { id } = req.params;
      const { km_chegada } = req.body;

      const frete = await Frete.buscarPorId(id);
      if (!frete) {
        return res.status(404).json({ erro: 'Frete não encontrado' });
      }

      await Frete.finalizarFrete(id, { km_chegada });

      res.json({ mensagem: 'Frete finalizado com sucesso' });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async atualizarAbastecimento(req, res) {
    try {
      const { id } = req.params;
      const { valor } = req.body;

      if (!valor) {
        return res.status(400).json({ erro: 'Valor de abastecimento obrigatório' });
      }

      const frete = await Frete.buscarPorId(id);
      if (!frete) {
        return res.status(404).json({ erro: 'Frete não encontrado' });
      }

      await Frete.atualizarAbastecimento(id, valor);

      res.json({ mensagem: 'Abastecimento atualizado com sucesso' });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async relatorioPorMotorista(req, res) {
    try {
      const { motorista_id, data_inicio, data_fim } = req.query;

      if (!motorista_id || !data_inicio || !data_fim) {
        return res.status(400).json({ erro: 'motorista_id, data_inicio e data_fim são obrigatórios' });
      }

      const relatorio = await Frete.relatorioPorMotorista(motorista_id, data_inicio, data_fim);
      res.json(relatorio);
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = FreteController;
