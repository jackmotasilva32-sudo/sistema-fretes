const jwt = require('jsonwebtoken');

const autenticacao = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

const autorizacao = (permissoes = []) => {
  return (req, res, next) => {
    if (!permissoes.includes(req.usuario.tipo_usuario)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
};

module.exports = { autenticacao, autorizacao };
