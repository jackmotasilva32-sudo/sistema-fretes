# Sistema de Gestão de Fretes

Sistema completo para emissão de ordens de coleta, gerenciamento de fretes, pagamentos e recebimentos diversos.

## Funcionalidades

### 1. Ordens de Coleta
- Emissão de ordens de coleta
- Rastreamento de coletas
- Integração com rotas de entrega

### 2. Gerenciamento de Fretes
- Cadastro e gerenciamento de fretes
- Status da viagem (em viagem, finalizado, cancelado)
- Associação com motoristas e veículos
- Histórico de fretes

### 3. Pagamentos
- Comissões de motoristas
- Serviços de borracharia
- Manutenção de veículos
- Despesas diversas
- Formas de pagamento: Boleto, Depósito, Carta Frete, Cheques

### 4. Recebimentos
- Adiantamentos de fretes
- Saldos de clientes
- Recebimentos diversos

### 5. Abastecimento
- Registro de combustível
- Abatimento automático do valor no frete
- Controle de despesas

## Estrutura do Projeto

```
sistema-fretes/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── database/
│   ├── config/
│   └── server.js
├── database/
│   └── schema.sql
├── docs/
│   └── api.md
└── README.md
```

## Tecnologias
- Node.js + Express
- PostgreSQL ou MySQL
- JWT para autenticação
- RESTful API
