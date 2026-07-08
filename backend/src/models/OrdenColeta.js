const db = require('../config/database');

class OrdenColeta {
  static async criar(dados) {
    const query = `
      INSERT INTO ordens_coleta 
      (numero_ordem, cliente_id, endereco_coleta, endereco_entrega, descricao_carga, peso_estimado, valor_frete, status, data_coleta)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente', ?)
    `;
    
    const [result] = await db.execute(query, [
      dados.numero_ordem,
      dados.cliente_id,
      dados.endereco_coleta,
      dados.endereco_entrega,
      dados.descricao_carga,
      dados.peso_estimado,
      dados.valor_frete,
      dados.data_coleta || null
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM ordens_coleta WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async buscarPorNumero(numero) {
    const query = 'SELECT * FROM ordens_coleta WHERE numero_ordem = ?';
    const [rows] = await db.execute(query, [numero]);
    return rows[0];
  }

  static async listar(filtros = {}, limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    let query = 'SELECT * FROM ordens_coleta WHERE 1=1';
    const valores = [];

    if (filtros.cliente_id) {
      query += ' AND cliente_id = ?';
      valores.push(filtros.cliente_id);
    }

    if (filtros.status) {
      query += ' AND status = ?';
      valores.push(filtros.status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    valores.push(limite, offset);

    const [rows] = await db.execute(query, valores);
    return rows;
  }

  static async atualizarStatus(id, novoStatus) {
    const query = `UPDATE ordens_coleta SET status = ? WHERE id = ?`;
    const [result] = await db.execute(query, [novoStatus, id]);
    return result.affectedRows > 0;
  }

  static async atualizar(id, dados) {
    const campos = [];
    const valores = [];

    Object.keys(dados).forEach(chave => {
      if (chave !== 'id' && chave !== 'numero_ordem') {
        campos.push(`${chave} = ?`);
        valores.push(dados[chave]);
      }
    });

    if (campos.length === 0) return null;

    valores.push(id);
    const query = `UPDATE ordens_coleta SET ${campos.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, valores);
    return result.affectedRows > 0;
  }
}

module.exports = OrdenColeta;
