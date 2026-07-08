const db = require('../config/database');

class Pagamento {
  static async criar(dados) {
    const query = `
      INSERT INTO pagamentos 
      (tipo_pagamento, referencia_id, motorista_id, valor, descricao, forma_pagamento, numero_cheque, banco_cheque, data_vencimento, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `;
    
    const [result] = await db.execute(query, [
      dados.tipo_pagamento,
      dados.referencia_id || null,
      dados.motorista_id || null,
      dados.valor,
      dados.descricao,
      dados.forma_pagamento,
      dados.numero_cheque || null,
      dados.banco_cheque || null,
      dados.data_vencimento || null
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM pagamentos WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async listar(filtros = {}, limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    let query = 'SELECT * FROM pagamentos WHERE 1=1';
    const valores = [];

    if (filtros.motorista_id) {
      query += ' AND motorista_id = ?';
      valores.push(filtros.motorista_id);
    }

    if (filtros.status) {
      query += ' AND status = ?';
      valores.push(filtros.status);
    }

    if (filtros.tipo_pagamento) {
      query += ' AND tipo_pagamento = ?';
      valores.push(filtros.tipo_pagamento);
    }

    if (filtros.forma_pagamento) {
      query += ' AND forma_pagamento = ?';
      valores.push(filtros.forma_pagamento);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    valores.push(limite, offset);

    const [rows] = await db.execute(query, valores);
    return rows;
  }

  static async registrarPagamento(id, data_pagamento) {
    const query = `
      UPDATE pagamentos 
      SET status = 'pago', data_pagamento = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [data_pagamento, id]);
    return result.affectedRows > 0;
  }

  static async cancelarPagamento(id) {
    const query = `UPDATE pagamentos SET status = 'cancelado' WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  static async relatorioPagamentosMotorista(motorista_id, data_inicio, data_fim) {
    const query = `
      SELECT 
        tipo_pagamento,
        forma_pagamento,
        status,
        COUNT(*) as quantidade,
        SUM(valor) as valor_total
      FROM pagamentos
      WHERE motorista_id = ? 
        AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY tipo_pagamento, forma_pagamento, status
    `;

    const [rows] = await db.execute(query, [motorista_id, data_inicio, data_fim]);
    return rows;
  }
}

module.exports = Pagamento;
