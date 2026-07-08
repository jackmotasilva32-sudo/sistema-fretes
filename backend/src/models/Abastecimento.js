const db = require('../config/database');

class Abastecimento {
  static async criar(dados) {
    const query = `
      INSERT INTO abastecimentos 
      (frete_id, motorista_id, veiculo_id, valor, litros, data_abastecimento, local, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      dados.frete_id,
      dados.motorista_id,
      dados.veiculo_id,
      dados.valor,
      dados.litros,
      dados.data_abastecimento,
      dados.local,
      dados.observacoes
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM abastecimentos WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async listarPorFrete(frete_id) {
    const query = 'SELECT * FROM abastecimentos WHERE frete_id = ? ORDER BY data_abastecimento DESC';
    const [rows] = await db.execute(query, [frete_id]);
    return rows;
  }

  static async listarPorMotorista(motorista_id, limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    const query = `
      SELECT * FROM abastecimentos 
      WHERE motorista_id = ? 
      ORDER BY data_abastecimento DESC 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(query, [motorista_id, limite, offset]);
    return rows;
  }

  static async relatorioPorPeriodo(data_inicio, data_fim, motorista_id = null) {
    let query = `
      SELECT 
        motorista_id,
        veiculo_id,
        COUNT(*) as quantidade,
        SUM(valor) as valor_total,
        SUM(litros) as litros_total,
        AVG(valor) as valor_medio
      FROM abastecimentos
      WHERE DATE(data_abastecimento) BETWEEN ? AND ?
    `;
    
    const valores = [data_inicio, data_fim];

    if (motorista_id) {
      query += ' AND motorista_id = ?';
      valores.push(motorista_id);
    }

    query += ' GROUP BY motorista_id, veiculo_id';

    const [rows] = await db.execute(query, valores);
    return rows;
  }
}

module.exports = Abastecimento;
