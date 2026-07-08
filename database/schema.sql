-- Banco de Dados: Sistema de Gestão de Fretes

CREATE DATABASE IF NOT EXISTS sistema_fretes;
USE sistema_fretes;

-- Tabela: Usuários
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_usuario ENUM('admin', 'motorista', 'financeiro', 'operacional') NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: Clientes
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cnpj_cpf VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  saldo DECIMAL(10, 2) DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: Motoristas
CREATE TABLE motoristas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  cnh VARCHAR(20) UNIQUE,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  banco VARCHAR(100),
  agencia VARCHAR(20),
  conta VARCHAR(30),
  saldo DECIMAL(10, 2) DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela: Veículos
CREATE TABLE veiculos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  motorista_id INT,
  placa VARCHAR(20) UNIQUE NOT NULL,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  ano INT,
  cor VARCHAR(50),
  renavam VARCHAR(20),
  seguro_vencimento DATE,
  ipva_vencimento DATE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
);

-- Tabela: Ordens de Coleta
CREATE TABLE ordens_coleta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_ordem VARCHAR(50) UNIQUE NOT NULL,
  cliente_id INT NOT NULL,
  endereco_coleta VARCHAR(255) NOT NULL,
  endereco_entrega VARCHAR(255) NOT NULL,
  descricao_carga TEXT,
  peso_estimado DECIMAL(10, 2),
  valor_frete DECIMAL(10, 2) NOT NULL,
  status ENUM('pendente', 'coletada', 'em_rota', 'entregue', 'cancelada') DEFAULT 'pendente',
  data_coleta DATE,
  data_entrega_prevista DATE,
  data_entrega_realizada DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabela: Fretes
CREATE TABLE fretes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_frete VARCHAR(50) UNIQUE NOT NULL,
  ordem_coleta_id INT NOT NULL,
  motorista_id INT NOT NULL,
  veiculo_id INT,
  valor_frete DECIMAL(10, 2) NOT NULL,
  abastecimento DECIMAL(10, 2) DEFAULT 0,
  valor_liquido DECIMAL(10, 2),
  status ENUM('pendente', 'em_viagem', 'entregue', 'cancelado') DEFAULT 'pendente',
  data_saida DATETIME,
  data_entrega DATETIME,
  km_saida INT,
  km_chegada INT,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ordem_coleta_id) REFERENCES ordens_coleta(id),
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id),
  FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
);

-- Tabela: Pagamentos
CREATE TABLE pagamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo_pagamento ENUM('comissao', 'borracharia', 'manutencao', 'outro') NOT NULL,
  referencia_id INT,
  motorista_id INT,
  valor DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  forma_pagamento ENUM('boleto', 'deposito', 'carta_frete', 'cheque') NOT NULL,
  numero_cheque VARCHAR(50),
  banco_cheque VARCHAR(100),
  numero_documento VARCHAR(50),
  data_vencimento DATE,
  data_pagamento DATE,
  status ENUM('pendente', 'pago', 'cancelado') DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
);

-- Tabela: Recebimentos
CREATE TABLE recebimentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo_recebimento ENUM('adiantamento_frete', 'saldo', 'outro') NOT NULL,
  cliente_id INT,
  motorista_id INT,
  valor DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  forma_recebimento ENUM('boleto', 'deposito', 'dinheiro', 'cheque') NOT NULL,
  numero_cheque VARCHAR(50),
  banco_cheque VARCHAR(100),
  data_recebimento DATE NOT NULL,
  observacoes TEXT,
  status ENUM('pendente', 'recebido', 'cancelado') DEFAULT 'recebido',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
);

-- Tabela: Abastecimento
CREATE TABLE abastecimentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  frete_id INT NOT NULL,
  motorista_id INT NOT NULL,
  veiculo_id INT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  litros DECIMAL(10, 2),
  data_abastecimento DATE NOT NULL,
  local VARCHAR(255),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (frete_id) REFERENCES fretes(id),
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id),
  FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
);

-- Tabela: Histórico de Status
CREATE TABLE historico_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  frete_id INT NOT NULL,
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50) NOT NULL,
  localizacao VARCHAR(255),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (frete_id) REFERENCES fretes(id)
);

-- Índices para otimização
CREATE INDEX idx_motoristas_usuario_id ON motoristas(usuario_id);
CREATE INDEX idx_veiculos_motorista_id ON veiculos(motorista_id);
CREATE INDEX idx_ordens_coleta_cliente_id ON ordens_coleta(cliente_id);
CREATE INDEX idx_ordens_coleta_status ON ordens_coleta(status);
CREATE INDEX idx_fretes_motorista_id ON fretes(motorista_id);
CREATE INDEX idx_fretes_veiculo_id ON fretes(veiculo_id);
CREATE INDEX idx_fretes_status ON fretes(status);
CREATE INDEX idx_fretes_ordem_coleta_id ON fretes(ordem_coleta_id);
CREATE INDEX idx_pagamentos_motorista_id ON pagamentos(motorista_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_recebimentos_cliente_id ON recebimentos(cliente_id);
CREATE INDEX idx_recebimentos_motorista_id ON recebimentos(motorista_id);
CREATE INDEX idx_abastecimentos_frete_id ON abastecimentos(frete_id);
CREATE INDEX idx_historico_status_frete_id ON historico_status(frete_id);
