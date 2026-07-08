const db = require('../config/database');

class Recebimento {
  static async criar(dados) {
    const query = `
      INSERT INTO recebimentos 
      (tipo_recebimento, cliente_id, motorista_id, valor, descricao, forma_recebimento, numero_cheque, banco_cheque, data_recebimento, observacoes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'recebido')
    `;
    
    const [result] = await db.execute(query, [
      dados.tipo_recebimento,
      dados.cliente_id || null,
      dados.motorista_id || null,
      dados.valor,
      dados.descricao,
      dados.forma_recebimento,
      dados.numero_cheque || null,
      dados.banco_cheque || null,
      dados.data_recebimento,
      dados.observacoes || null
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM recebimentos WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async listar(filtros = {}, limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    let query = 'SELECT * FROM recebimentos WHERE 1=1';
    const valores = [];

    if (filtros.cliente_id) {
      query += ' AND cliente_id = ?';
      valores.push(filtros.cliente_id);
    }

    if (filtros.motorista_id) {
      query += ' AND motorista_id = ?';
      valores.push(filtros.motorista_id);
    }

    if (filtros.tipo_recebimento) {
      query += ' AND tipo_recebimento = ?';
      valores.push(filtros.tipo_recebimento);
    }

    if (filtros.data_inicio && filtros.data_fim) {
      query += ' AND DATE(data_recebimento) BETWEEN ? AND ?';
      valores.push(filtros.data_inicio, filtros.data_fim);
    }

    query += ' ORDER BY data_recebimento DESC LIMIT ? OFFSET ?';
    valores.push(limite, offset);

    const [rows] = await db.execute(query, valores);
    return rows;
  }

  static async relatorioPorPeriodo(data_inicio, data_fim) {
    const query = `
      SELECT 
        tipo_recebimento,
        forma_recebimento,
        COUNT(*) as quantidade,
        SUM(valor) as valor_total
      FROM recebimentos
      WHERE DATE(data_recebimento) BETWEEN ? AND ?
      GROUP BY tipo_recebimento, forma_recebimento
    `;

    const [rows] = await db.execute(query, [data_inicio, data_fim]);
    return rows;
  }
}

module.exports = Recebimento;
