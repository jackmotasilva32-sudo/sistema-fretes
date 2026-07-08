const db = require('../config/database');

class Veiculo {
  static async criar(dados) {
    const query = `
      INSERT INTO veiculos 
      (motorista_id, placa, marca, modelo, ano, cor, renavam, seguro_vencimento, ipva_vencimento, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;
    
    const [result] = await db.execute(query, [
      dados.motorista_id,
      dados.placa,
      dados.marca,
      dados.modelo,
      dados.ano,
      dados.cor,
      dados.renavam,
      dados.seguro_vencimento,
      dados.ipva_vencimento
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM veiculos WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async buscarPorPlaca(placa) {
    const query = 'SELECT * FROM veiculos WHERE placa = ?';
    const [rows] = await db.execute(query, [placa]);
    return rows[0];
  }

  static async listarPorMotorista(motorista_id) {
    const query = 'SELECT * FROM veiculos WHERE motorista_id = ? AND ativo = TRUE';
    const [rows] = await db.execute(query, [motorista_id]);
    return rows;
  }

  static async listar(limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    const query = 'SELECT * FROM veiculos WHERE ativo = TRUE LIMIT ? OFFSET ?';
    const [rows] = await db.execute(query, [limite, offset]);
    return rows;
  }

  static async atualizar(id, dados) {
    const campos = [];
    const valores = [];

    Object.keys(dados).forEach(chave => {
      if (chave !== 'id' && chave !== 'placa') {
        campos.push(`${chave} = ?`);
        valores.push(dados[chave]);
      }
    });

    if (campos.length === 0) return null;

    valores.push(id);
    const query = `UPDATE veiculos SET ${campos.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, valores);
    return result.affectedRows > 0;
  }

  static async desativar(id) {
    const query = 'UPDATE veiculos SET ativo = FALSE WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Veiculo;
