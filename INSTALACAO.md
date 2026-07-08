# Guia de Instalação e Uso

## Pré-requisitos

- Node.js (v14+)
- npm ou yarn
- MySQL (v5.7+) ou MariaDB

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-fretes.git
cd sistema-fretes
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

#### Opção A: Usando o MySQL CLI

```bash
mysql -u root -p < database/schema.sql
```

#### Opção B: Manualmente

1. Abra um cliente MySQL (MySQL Workbench, phpMyAdmin, etc.)
2. Execute o script `database/schema.sql`

### 4. Configure variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=sistema_fretes

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRE=7d

# API
API_URL=http://localhost:3000
```

### 5. Inicie o servidor

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
sistema-fretes/
├── backend/
│   ├── src/
│   │   ├── models/           # Modelos de dados
│   │   ├── controllers/      # Controladores da lógica
│   │   ├── routes/           # Definição das rotas
│   │   ├── middleware/       # Middlewares (autenticação, etc)
│   │   └── config/           # Configurações (banco de dados)
│   ├── server.js            # Arquivo principal do servidor
│   └── .env.example         # Exemplo de variáveis de ambiente
├── database/
│   └── schema.sql           # Script de criação do banco de dados
├── docs/
│   └── api.md               # Documentação da API
├── package.json             # Dependências do projeto
└── README.md                # Este arquivo
```

## Primeiros Passos

### 1. Registre um usuário

```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Admin",
    "email": "admin@example.com",
    "senha": "senha123",
    "tipo_usuario": "admin"
  }'
```

### 2. Faça login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "senha": "senha123"
  }'
```

Você receberá um token JWT que deve ser usado em todas as requisições autenticadas:

```bash
Authorization: Bearer {token}
```

### 3. Crie um cliente

```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "nome": "Empresa XYZ",
    "cnpj_cpf": "12.345.678/0001-90",
    "email": "contato@empresa.com",
    "telefone": "(11) 3000-0000",
    "endereco": "Rua Principal, 100",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01000-000"
  }'
```

### 4. Crie uma ordem de coleta

```bash
curl -X POST http://localhost:3000/api/ordens-coleta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "numero_ordem": "ORD001",
    "cliente_id": 1,
    "endereco_coleta": "Rua A, 100",
    "endereco_entrega": "Rua B, 200",
    "descricao_carga": "Eletrônicos",
    "peso_estimado": 50,
    "valor_frete": 500.00,
    "data_coleta": "2026-07-10"
  }'
```

## Documentação da API

Veja o arquivo `docs/api.md` para a documentação completa de todos os endpoints.

## Tipos de Usuário

- **admin** - Acesso total ao sistema
- **motorista** - Visualizar seus dados e fretes
- **financeiro** - Gerenciar pagamentos e recebimentos
- **operacional** - Gerenciar fretes e coletas

## Funcionalidades Principais

### 1. Gestão de Fretes
- Criar fretes
- Rastrear status (pendente, em viagem, entregue)
- Iniciar e finalizar viagens
- Registrar km de saída e chegada

### 2. Pagamentos
- Registrar comissões de motoristas
- Registrar despesas (borracharia, manutenção)
- Formas de pagamento: boleto, depósito, carta frete, cheque
- Rastrear status de pagamento

### 3. Recebimentos
- Registrar adiantamentos de fretes
- Registrar saldos de clientes
- Formas de recebimento: boleto, depósito, dinheiro, cheque

### 4. Abastecimento
- Registrar abastecimentos de veículos
- Abater valor automaticamente do frete
- Relatório de consumo de combustível

### 5. Motoristas e Veículos
- Cadastrar motoristas
- Cadastrar veículos
- Associar veículos a motoristas
- Gerenciar documentos (CNH, seguro, IPVA)

## Testes

```bash
npm test
```

## Troubleshooting

### Erro de conexão com banco de dados

1. Verifique se o MySQL está rodando
2. Verifique as credenciais no arquivo `.env`
3. Verifique se o banco de dados `sistema_fretes` foi criado

### Erro de token inválido

1. Verifique se o token está sendo enviado corretamente
2. Verifique a data e hora do servidor (JWT é sensível a timestamp)
3. Gere um novo token fazendo login novamente

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## Licença

Este projeto está sob a licença MIT.
