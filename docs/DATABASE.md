# Documentação do Banco de Dados

## 📊 Diagrama de Entidades

```
┌─────────────────┐
│     CLIENTE     │
├─────────────────┤
│ id (UUID)       │
│ nome            │
│ cnpj_cpf        │
│ endereco        │
│ cidade          │
│ estado          │
│ telefone        │
│ email           │
│ data_cadastro   │
│ ativo           │
└─────────────────┘
       │
       │ 1:N
       ↓
┌─────────────────┐
│     FRETE       │
├─────────────────┤
│ id (UUID)       │
│ cliente_id (FK) │
│ motorista_id(FK)│
│ veiculo_id (FK) │
│ status          │
│ valor_frete     │
│ peso_kg         │
│ data_criacao    │
│ data_coleta     │
│ data_entrega    │
└─────────────────┘
       │
       ├─ 1:N ─────────────────────┐
       │                           │
       ↓                           ↓
┌──────────────────┐     ┌──────────────────┐
│   PAGAMENTO      │     │   RECEBIMENTO    │
├──────────────────┤     ├──────────────────┤
│ id (UUID)        │     │ id (UUID)        │
│ motorista_id(FK) │     │ cliente_id (FK)  │
│ frete_id (FK)    │     │ frete_id (FK)    │
│ valor            │     │ valor            │
│ status           │     │ status           │
│ forma_pagamento  │     │ forma_pagamento  │
│ data_prevista    │     │ data_prevista    │
│ data_efetiva     │     │ data_efetiva     │
└──────────────────┘     └──────────────────┘


┌──────────────────┐
│    MOTORISTA     │
├──────────────────┤
│ id (UUID)        │
│ nome             │
│ cpf              │
│ cnh              │
│ categoria_cnh    │
│ validade_cnh     │
│ telefone         │
│ email            │
│ endereco         │
│ cidade           │
│ estado           │
│ data_nascimento  │
│ data_cadastro    │
│ ativo            │
└──────────────────┘
       │
       │ N:M (via MotoristVeiculo)
       ↓
┌──────────────────┐     ┌──────────────────┐
│ MOTORISTA_VEICULO│────→│     VEICULO      │
├──────────────────┤     ├──────────────────┤
│ id (UUID)        │     │ id (UUID)        │
│ motorista_id(FK) │     │ placa            │
│ veiculo_id (FK)  │     │ marca            │
│ data_inicio      │     │ modelo           │
│ data_fim         │     │ ano              │
│ ativo            │     │ capacidade_kg    │
└──────────────────┘     │ renavam          │
                         │ chassis          │
                         │ data_cadastro    │
                         │ ativo            │
                         └──────────────────┘
```

## 📋 Descrição das Tabelas

### 1. CLIENTE

Armazena informações dos clientes que contratam fretes.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|----------|
| id | UUID | PK | Identificador único |
| nome | VARCHAR(255) | NOT NULL | Nome do cliente |
| cnpj_cpf | VARCHAR(18) | UNIQUE | CNPJ ou CPF |
| endereco | TEXT | | Endereço completo |
| cidade | VARCHAR(100) | | Cidade |
| estado | VARCHAR(2) | | UF |
| cep | VARCHAR(10) | | CEP |
| telefone | VARCHAR(20) | | Telefone |
| email | EMAIL | | Email |
| contato | VARCHAR(255) | | Pessoa de contato |
| data_cadastro | DATETIME | DEFAULT NOW | Data de cadastro |
| ativo | BOOLEAN | DEFAULT TRUE | Status |
| observacoes | TEXT | | Observações |

### 2. MOTORISTA

Armazena informações dos motoristas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|----------|
| id | UUID | PK | Identificador único |
| nome | VARCHAR(255) | NOT NULL | Nome completo |
| cpf | VARCHAR(14) | UNIQUE, NOT NULL | CPF |
| cnh | VARCHAR(12) | UNIQUE | Número da CNH |
| categoria_cnh | VARCHAR(5) | | Categoria (A,B,C,D,E) |
| validade_cnh | DATE | | Validade da CNH |
| telefone | VARCHAR(20) | | Telefone |
| email | EMAIL | | Email |
| endereco | TEXT | | Endereço |
| cidade | VARCHAR(100) | | Cidade |
| estado | VARCHAR(2) | | UF |
| data_nascimento | DATE | | Data de nascimento |
| data_cadastro | DATETIME | DEFAULT NOW | Data de cadastro |
| ativo | BOOLEAN | DEFAULT TRUE | Status |
| observacoes | TEXT | | Observações |

### 3. VEICULO

Armazena informações dos veículos da frota.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|----------|
| id | UUID | PK | Identificador único |
| placa | VARCHAR(10) | UNIQUE | Placa do veículo |
| marca | VARCHAR(100) | NOT NULL | Marca |
| modelo | VARCHAR(100) | NOT NULL | Modelo |
| ano | INTEGER | | Ano de fabricação |
| capacidade_kg | DECIMAL(10,2) | | Capacidade de carga |
| cor | VARCHAR(50) | | Cor |
| renavam | VARCHAR(11) | UNIQUE | RENAVAM |
| chassis | VARCHAR(17) | UNIQUE | Número do chassis |
| data_cadastro | DATETIME | DEFAULT NOW | Data de cadastro |
| ativo | BOOLEAN | DEFAULT TRUE | Status |
| observacoes | TEXT | | Observações |

### 4. MOTORISTA_VEICULO

Vínculo N:M entre motoristas e veículos.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|----------|
| id | UUID | PK | Identificador único |
| motorista_id | UUID | FK | Referência Motorista |
| veiculo_id | UUID | FK | Referência Veículo |
| data_inicio | DATETIME | DEFAULT NOW | Data de associação |
| data_fim | DATETIME | | Data de desassociação |
| ativo | BOOLEAN | DEFAULT TRUE | Ainda ativo? |
| observacoes | TEXT | | Observações |

### 5. FRETE

Registro de fretes realizados.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|----------|
| id | UUID | PK | Identificador único |
| cliente_id | UUID | FK, NOT NULL | Cliente |
| motorista_id | UUID | FK | Motorista |
| veiculo_id | UUID | FK | Veículo |
| cidade_origem | VARCHAR(255) | NOT NULL | Origem |
| cidade_destino | VARCHAR(255) | NOT NULL | Destino |
| endereco_origem | TEXT | | Endereço de origem |
| endereco_destino | TEXT | | Endereço de destino |
| peso_kg | DECIMAL(10,2) | NOT NULL | Peso em kg |
| valor_frete | DECIMAL(10,2) | NOT NULL | Valor cobrado |
| status | VARCHAR(50) | DEFAULT 'PENDENTE' | Status do frete |
| data_criacao | DATETIME | DEFAULT NOW | Data de criação |
| data_coleta | DATETIME | | Data de coleta |
| data_entrega | DATETIME | | Data de entrega |
| observacoes | TEXT | | Observações |

**Status possíveis:** PENDENTE, COLETADO, EM_TRANSITO, ENTREGUE, CANCELADO

### 6. PAGAMENTO

Registro de pagamentos aos motoristas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|----------|
| id | UUID | PK | Identificador único |
| motorista_id | UUID | FK, NOT NULL | Motorista a pagar |
| frete_id | UUID | FK | Frete relacionado |
| valor | DECIMAL(10,2) | NOT NULL | Valor do pagamento |
| data_prevista | DATE | NOT NULL | Data prevista |
| data_efetiva | DATETIME | | Data efetiva |
| status | VARCHAR(50) | DEFAULT 'PENDENTE' | Status |
| forma_pagamento | VARCHAR(50) | NOT NULL | Dinheiro, Cheque, Cartão, TED, PIX |
| referencia | VARCHAR(255) | | Nº cheque, TED, etc |
| data_criacao | DATETIME | DEFAULT NOW | Data de criação |
| observacoes | TEXT | | Observações |

**Status possíveis:** PENDENTE, PAGO, CANCELADO

### 7. RECEBIMENTO

Registro de recebimentos dos clientes.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|----------|
| id | UUID | PK | Identificador único |
| cliente_id | UUID | FK, NOT NULL | Cliente a receber |
| frete_id | UUID | FK, NOT NULL | Frete relacionado |
| valor | DECIMAL(10,2) | NOT NULL | Valor do recebimento |
| data_prevista | DATE | NOT NULL | Data prevista |
| data_efetiva | DATETIME | | Data efetiva |
| status | VARCHAR(50) | DEFAULT 'PENDENTE' | Status |
| forma_pagamento | VARCHAR(50) | | Dinheiro, Cheque, Cartão, TED, PIX |
| referencia | VARCHAR(255) | | Nº cheque, TED, etc |
| data_criacao | DATETIME | DEFAULT NOW | Data de criação |
| observacoes | TEXT | | Observações |

**Status possíveis:** PENDENTE, RECEBIDO, CANCELADO

## 🔗 Relacionamentos

### Cliente → Frete (1:N)
Um cliente pode ter múltiplos fretes.

### Motorista → Frete (1:N)
Um motorista pode realizar múltiplos fretes.

### Motorista → Veiculo (N:M)
Um motorista pode dirigir múltiplos veículos ao longo do tempo.
Um veículo pode ser dirigido por múltiplos motoristas.

### Veiculo → Frete (1:N)
Um veículo pode realizar múltiplos fretes.

### Frete → Pagamento (1:N)
Um frete pode gerar múltiplos pagamentos.

### Frete → Recebimento (1:N)
Um frete pode gerar múltiplos recebimentos.

### Motorista → Pagamento (1:N)
Um motorista pode receber múltiplos pagamentos.

### Cliente → Recebimento (1:N)
Um cliente pode realizar múltiplos recebimentos.

## 📈 Indexes

Para melhor performance, foram criados índices em:

- `cliente.nome`
- `cliente.cnpj_cpf`
- `motorista.nome`
- `motorista.cpf`
- `veiculo.placa`
- `frete.id + frete.data_criacao`
- `frete.cliente_id`
- `frete.status`
- `pagamento.motorista_id + pagamento.status`
- `pagamento.data_prevista`
- `recebimento.cliente_id + recebimento.status`
- `recebimento.data_prevista`
