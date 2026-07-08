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
const clientesRoutes = require('./src/routes/clientes');
const ordensColetaRoutes = require('./src/routes/ordens-coleta');
const veiculosRoutes = require('./src/routes/veiculos');

app.use('/api/auth', autenticacaoRoutes);
app.use('/api/fretes', fretesRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/recebimentos', recebimentosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ordens-coleta', ordensColetaRoutes);
app.use('/api/veiculos', veiculosRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'API em funcionamento', timestamp: new Date().toISOString() });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Bem-vindo à API de Gestão de Fretes',
    versao: '1.0.0',
    documentacao: '/api/docs',
    endpoints: {
      autenticacao: '/api/auth',
      fretes: '/api/fretes',
      pagamentos: '/api/pagamentos',
      recebimentos: '/api/recebimentos',
      clientes: '/api/clientes',
      ordens_coleta: '/api/ordens-coleta',
      veiculos: '/api/veiculos'
    }
  });
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
  console.log(`Acesse http://localhost:${PORT} para mais informações`);
});
