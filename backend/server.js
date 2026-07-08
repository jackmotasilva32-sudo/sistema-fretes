const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const autenticacaoRoutes = require('./src/routes/autenticacao');
const fretesRoutes = require('./src/routes/fretes');
const pagamentosRoutes = require('./src/routes/pagamentos');
const recebimentosRoutes = require('./src/routes/recebimentos');

app.use('/api/auth', autenticacaoRoutes);
app.use('/api/fretes', fretesRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/recebimentos', recebimentosRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'API en funcionamento', timestamp: new Date().toISOString() });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
