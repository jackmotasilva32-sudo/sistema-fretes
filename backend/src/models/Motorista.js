const db = require('../config/database');

class Motorista {
  static async criar(dados) {
    const query = `
      INSERT INTO motoristas 
      (usuario_id, nome, cpf, cnh, telefone, endereco, banco, agencia, conta, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;
    
    const [result] = await db.execute(query, [
      dados.usuario_id,
      dados.nome,
      dados.cpf,
      dados.cnh,
      dados.telefone,
      dados.endereco,
      dados.banco,
      dados.agencia,
      dados.conta
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM motoristas WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async buscarPorUsuarioId(usuario_id) {
    const query = 'SELECT * FROM motoristas WHERE usuario_id = ?';
    const [rows] = await db.execute(query, [usuario_id]);
    return rows[0];
  }

  static async listar(limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    const query = `
      SELECT m.*, u.email, u.ativo as usuario_ativo
      FROM motoristas m
      JOIN usuarios u ON m.usuario_id = u.id
      WHERE m.ativo = TRUE
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await db.execute(query, [limite, offset]);
    return rows;
  }

  static async atualizarSaldo(id, valor, operacao = 'adicionar') {
    const operador = operacao === 'adicionar' ? '+' : '-';
    const query = `
      UPDATE motoristas 
      SET saldo = saldo ${operador} ?
      WHERE id = ?
    `;
    
    const [result] = await db.execute(query, [valor, id]);
    return result.affectedRows > 0;
  }

  static async buscarSaldo(id) {
    const query = 'SELECT saldo FROM motoristas WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0]?.saldo || 0;
  }

  static async atualizar(id, dados) {
    const campos = [];
    const valores = [];

    Object.keys(dados).forEach(chave => {
      if (chave !== 'id' && chave !== 'usuario_id' && chave !== 'saldo') {
        campos.push(`${chave} = ?`);
        valores.push(dados[chave]);
      }
    });

    if (campos.length === 0) return null;

    valores.push(id);
    const query = `UPDATE motoristas SET ${campos.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, valores);
    return result.affectedRows > 0;
  }
}

module.exports = Motorista;
