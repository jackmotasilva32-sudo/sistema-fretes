# API de Gestão de Fretes

Documentação da API RESTful para gerenciamento de fretes, pagamentos e recebimentos.

## Base URL
```
http://localhost:3000/api
```

## Autenticação

A maioria dos endpoints requer um token JWT no header:
```
Authorization: Bearer {token}
```

## Endpoints

### Autenticação

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "senha123"
}

Response:
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGc...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "tipo_usuario": "motorista"
  }
}
```

#### Registrar
```http
POST /auth/registrar
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "tipo_usuario": "motorista"
}

Response:
{
  "mensagem": "Usuário registrado com sucesso",
  "usuario_id": 1
}
```

### Fretes

#### Criar Frete
```http
POST /fretes
Authorization: Bearer {token}
Content-Type: application/json

{
  "numero_frete": "FR001",
  "ordem_coleta_id": 1,
  "motorista_id": 1,
  "veiculo_id": 1,
  "valor_frete": 500.00,
  "abastecimento": 100.00,
  "observacoes": "Frete normal"
}
```

#### Listar Fretes
```http
GET /fretes?motorista_id=1&status=em_viagem&pagina=1&limite=10
Authorization: Bearer {token}
```

#### Obter Frete
```http
GET /fretes/{id}
Authorization: Bearer {token}
```

#### Iniciar Viagem
```http
PATCH /fretes/{id}/iniciar-viagem
Authorization: Bearer {token}
Content-Type: application/json

{
  "km_saida": 1000
}
```

#### Finalizar Viagem
```http
PATCH /fretes/{id}/finalizar-viagem
Authorization: Bearer {token}
Content-Type: application/json

{
  "km_chegada": 1150
}
```

#### Atualizar Abastecimento
```http
PATCH /fretes/{id}/abastecimento
Authorization: Bearer {token}
Content-Type: application/json

{
  "valor": 150.00
}
```

#### Relatório por Motorista
```http
GET /fretes/relatorio/motorista?motorista_id=1&data_inicio=2026-01-01&data_fim=2026-12-31
Authorization: Bearer {token}
```

### Pagamentos

#### Criar Pagamento
```http
POST /pagamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo_pagamento": "comissao",
  "motorista_id": 1,
  "valor": 200.00,
  "descricao": "Comissão do frete FR001",
  "forma_pagamento": "deposito",
  "data_vencimento": "2026-07-15"
}
```

#### Listar Pagamentos
```http
GET /pagamentos?motorista_id=1&status=pendente&tipo_pagamento=comissao&pagina=1
Authorization: Bearer {token}
```

#### Obter Pagamento
```http
GET /pagamentos/{id}
Authorization: Bearer {token}
```

#### Registrar Pagamento
```http
PATCH /pagamentos/{id}/pagar
Authorization: Bearer {token}
Content-Type: application/json

{
  "data_pagamento": "2026-07-10"
}
```

#### Cancelar Pagamento
```http
PATCH /pagamentos/{id}/cancelar
Authorization: Bearer {token}
```

#### Relatório de Pagamentos
```http
GET /pagamentos/relatorio/motorista?motorista_id=1&data_inicio=2026-01-01&data_fim=2026-12-31
Authorization: Bearer {token}
```

### Recebimentos

#### Criar Recebimento
```http
POST /recebimentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo_recebimento": "adiantamento_frete",
  "cliente_id": 1,
  "valor": 1000.00,
  "descricao": "Adiantamento para frete",
  "forma_recebimento": "deposito",
  "data_recebimento": "2026-07-08"
}
```

#### Listar Recebimentos
```http
GET /recebimentos?cliente_id=1&tipo_recebimento=adiantamento_frete&pagina=1
Authorization: Bearer {token}
```

#### Obter Recebimento
```http
GET /recebimentos/{id}
Authorization: Bearer {token}
```

#### Relatório por Período
```http
GET /recebimentos/relatorio/periodo?data_inicio=2026-01-01&data_fim=2026-12-31
Authorization: Bearer {token}
```

## Tipos de Usuário
- `admin` - Acesso total
- `motorista` - Acesso limitado (visualizar seus dados)
- `financeiro` - Gerenciamento de pagamentos e recebimentos
- `operacional` - Gerenciamento de fretes e coletas

## Status de Frete
- `pendente` - Frete criado, aguardando saída
- `em_viagem` - Motorista iniciou a viagem
- `entregue` - Frete finalizado
- `cancelado` - Frete cancelado

## Status de Pagamento
- `pendente` - Aguardando pagamento
- `pago` - Pagamento realizado
- `cancelado` - Pagamento cancelado

## Formas de Pagamento
- `boleto`
- `deposito`
- `carta_frete`
- `cheque`

## Tipos de Recebimento
- `adiantamento_frete`
- `saldo`
- `outro`
