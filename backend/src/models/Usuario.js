const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  static async criar(dados) {
    const hashedPassword = await bcrypt.hash(dados.senha, 10);
    
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo)
      VALUES (?, ?, ?, ?, TRUE)
    `;
    
    const [result] = await db.execute(query, [
      dados.nome,
      dados.email,
      hashedPassword,
      dados.tipo_usuario
    ]);
    
    return result.insertId;
  }

  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  static async buscarPorId(id) {
    const query = 'SELECT id, nome, email, tipo_usuario, ativo FROM usuarios WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async verificarSenha(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
  }

  static async listar(limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    const query = `
      SELECT id, nome, email, tipo_usuario, ativo, created_at
      FROM usuarios
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await db.execute(query, [limite, offset]);
    return rows;
  }

  static async atualizar(id, dados) {
    const campos = [];
    const valores = [];

    if (dados.nome) {
      campos.push('nome = ?');
      valores.push(dados.nome);
    }
    if (dados.tipo_usuario) {
      campos.push('tipo_usuario = ?');
      valores.push(dados.tipo_usuario);
    }
    if (dados.hasOwnProperty('ativo')) {
      campos.push('ativo = ?');
      valores.push(dados.ativo);
    }

    if (campos.length === 0) return null;

    valores.push(id);
    const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, valores);
    return result.affectedRows > 0;
  }
}

module.exports = Usuario;
