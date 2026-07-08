const db = require('../config/database');

class Cliente {
  static async criar(dados) {
    const query = `
      INSERT INTO clientes 
      (nome, cnpj_cpf, email, telefone, endereco, cidade, estado, cep, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;
    
    const [result] = await db.execute(query, [
      dados.nome,
      dados.cnpj_cpf,
      dados.email,
      dados.telefone,
      dados.endereco,
      dados.cidade,
      dados.estado,
      dados.cep
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM clientes WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async listar(limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    const query = 'SELECT * FROM clientes WHERE ativo = TRUE LIMIT ? OFFSET ?';
    const [rows] = await db.execute(query, [limite, offset]);
    return rows;
  }

  static async atualizarSaldo(id, valor, operacao = 'adicionar') {
    const operador = operacao === 'adicionar' ? '+' : '-';
    const query = `
      UPDATE clientes 
      SET saldo = saldo ${operador} ?
      WHERE id = ?
    `;
    
    const [result] = await db.execute(query, [valor, id]);
    return result.affectedRows > 0;
  }

  static async buscarSaldo(id) {
    const query = 'SELECT saldo FROM clientes WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0]?.saldo || 0;
  }

  static async atualizar(id, dados) {
    const campos = [];
    const valores = [];

    Object.keys(dados).forEach(chave => {
      if (chave !== 'id' && chave !== 'saldo') {
        campos.push(`${chave} = ?`);
        valores.push(dados[chave]);
      }
    });

    if (campos.length === 0) return null;

    valores.push(id);
    const query = `UPDATE clientes SET ${campos.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, valores);
    return result.affectedRows > 0;
  }
}

module.exports = Cliente;
