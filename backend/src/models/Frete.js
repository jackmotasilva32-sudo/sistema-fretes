const db = require('../config/database');

class Frete {
  static async criar(dados) {
    const valor_liquido = dados.valor_frete - (dados.abastecimento || 0);
    
    const query = `
      INSERT INTO fretes 
      (numero_frete, ordem_coleta_id, motorista_id, veiculo_id, valor_frete, abastecimento, valor_liquido, status, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      dados.numero_frete,
      dados.ordem_coleta_id,
      dados.motorista_id,
      dados.veiculo_id || null,
      dados.valor_frete,
      dados.abastecimento || 0,
      valor_liquido,
      'pendente',
      dados.observacoes || null
    ]);
    
    return result.insertId;
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM fretes WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async buscarPorNumero(numero) {
    const query = 'SELECT * FROM fretes WHERE numero_frete = ?';
    const [rows] = await db.execute(query, [numero]);
    return rows[0];
  }

  static async listar(filtros = {}, limite = 10, pagina = 1) {
    const offset = (pagina - 1) * limite;
    let query = 'SELECT * FROM fretes WHERE 1=1';
    const valores = [];

    if (filtros.motorista_id) {
      query += ' AND motorista_id = ?';
      valores.push(filtros.motorista_id);
    }

    if (filtros.status) {
      query += ' AND status = ?';
      valores.push(filtros.status);
    }

    if (filtros.data_inicio && filtros.data_fim) {
      query += ' AND data_saida BETWEEN ? AND ?';
      valores.push(filtros.data_inicio, filtros.data_fim);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    valores.push(limite, offset);

    const [rows] = await db.execute(query, valores);
    return rows;
  }

  static async atualizarStatus(id, novoStatus, localizacao = null) {
    const query = `UPDATE fretes SET status = ? WHERE id = ?`;
    const [result] = await db.execute(query, [novoStatus, id]);

    if (result.affectedRows > 0 && localizacao) {
      await db.execute(
        'INSERT INTO historico_status (frete_id, status_novo, localizacao) VALUES (?, ?, ?)',
        [id, novoStatus, localizacao]
      );
    }

    return result.affectedRows > 0;
  }

  static async atualizarAbastecimento(id, valor) {
    const frete = await this.buscarPorId(id);
    const valor_liquido = frete.valor_frete - valor;

    const query = `
      UPDATE fretes 
      SET abastecimento = ?, valor_liquido = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [valor, valor_liquido, id]);
    return result.affectedRows > 0;
  }

  static async finalizarFrete(id, dados) {
    const query = `
      UPDATE fretes 
      SET status = 'entregue', 
          data_entrega = NOW(),
          km_chegada = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [dados.km_chegada, id]);
    return result.affectedRows > 0;
  }

  static async relatorioPorMotorista(motorista_id, data_inicio, data_fim) {
    const query = `
      SELECT 
        f.id,
        f.numero_frete,
        f.status,
        f.valor_frete,
        f.abastecimento,
        f.valor_liquido,
        f.data_saida,
        f.data_entrega,
        oc.numero_ordem,
        c.nome as cliente_nome
      FROM fretes f
      JOIN ordens_coleta oc ON f.ordem_coleta_id = oc.id
      JOIN clientes c ON oc.cliente_id = c.id
      WHERE f.motorista_id = ? 
        AND DATE(f.created_at) BETWEEN ? AND ?
      ORDER BY f.data_saida DESC
    `;

    const [rows] = await db.execute(query, [motorista_id, data_inicio, data_fim]);
    return rows;
  }
}

module.exports = Frete;
