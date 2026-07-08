const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

class AutenticacaoController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const senhaValida = await Usuario.verificarSenha(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario
        }
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async registrar(req, res) {
    try {
      const { nome, email, senha, tipo_usuario } = req.body;

      if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
      }

      const usuarioExistente = await Usuario.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }

      const usuarioId = await Usuario.criar({
        nome,
        email,
        senha,
        tipo_usuario
      });

      res.status(201).json({
        mensagem: 'Usuário registrado com sucesso',
        usuario_id: usuarioId
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = AutenticacaoController;
