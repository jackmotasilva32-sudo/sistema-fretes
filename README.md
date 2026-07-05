# Sistema de Gerenciamento de Fretes 🚚

Sistema completo para gerenciamento de operações de transporte e fretes, desenvolvido em **Python + Django** com **PostgreSQL** como banco de dados.

## 📋 Funcionalidades Principais

### ✅ Gestão de Clientes
- Cadastro completo de clientes (CNPJ/CPF)
- Armazenamento de endereço, telefone e email
- Classificação por estado e cidade
- Status ativo/inativo

### ✅ Gestão de Motoristas
- Cadastro com informações pessoais
- Controle de CNH (categoria e validade)
- Histórico de vinculações com veículos
- Registro de CPF e contato

### ✅ Gestão de Veículos
- Cadastro de frota (marca, modelo, placa)
- Controle de capacidade de carga
- Rastreamento de RENAVAM e chassis
- Vinculação com motoristas

### ✅ Gestão de Fretes
- Criação de fretes com ID único
- Rastreamento de status (Pendente → Coletado → Em Trânsito → Entregue)
- Cálculo de peso e valor
- Histórico de datas de coleta e entrega
- Integração com motorista e veículo

### ✅ Gestão de Pagamentos
- Registro de pagamentos aos motoristas
- Múltiplas formas de pagamento (Dinheiro, Cheque, Cartão, Transferência, PIX)
- Rastreamento de status de pagamento
- Vinculação com fretes

### ✅ Gestão de Recebimentos
- Registro de recebimentos dos clientes
- Múltiplas formas de pagamento
- Rastreamento de status de recebimento
- Vinculação com fretes

### ✅ Relatórios Avançados
- Relatório mensal de operações
- Relatório anual consolidado
- Análise por motorista
- Análise por veículo
- Análise por cliente
- Estatísticas de fretes, pagamentos e recebimentos

## 🛠 Stack Tecnológico

| Componente | Versão |
|-----------|--------|
| Python | 3.10+ |
| Django | 4.2.7 |
| Django REST Framework | 3.14.0 |
| PostgreSQL | 13+ |
| JWT | 2.8.1 |
| CORS | 4.3.1 |

## 📁 Estrutura do Projeto

```
sistema-fretes/
├── backend/
│   ├── manage.py                 # Django management script
│   ├── requirements.txt          # Dependências Python
│   ├── .env.example              # Template de variáveis de ambiente
│   ├── config/
│   │   ├── settings.py           # Configurações Django
│   │   ├── urls.py               # Rotas principais
│   │   └── wsgi.py               # WSGI application
│   ├── apps/
│   │   ├── clientes/             # App de Clientes
│   │   ├── motoristas/           # App de Motoristas
│   │   ├── veiculos/             # App de Veículos
│   │   ├── fretes/               # App de Fretes
│   │   ├── pagamentos/           # App de Pagamentos
│   │   ├── recebimentos/         # App de Recebimentos
│   │   └── relatorios/           # App de Relatórios
│   └── logs/                     # Logs da aplicação
├── .gitignore                   # Arquivos a ignorar no Git
└── README.md                    # Este arquivo
```

## 🚀 Instalação e Setup

### Pré-requisitos
- Python 3.10 ou superior
- PostgreSQL 13 ou superior
- pip e virtualenv
- Git

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/jackmotasilva32-sudo/sistema-fretes.git
cd sistema-fretes
```

### Passo 2: Configurar Ambiente Virtual

```bash
# Linux/Mac
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### Passo 3: Instalar Dependências

```bash
cd backend
pip install -r requirements.txt
```

### Passo 4: Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Django
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1

# Database PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_NAME=sistema_fretes
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET_KEY=sua-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Passo 5: Criar Banco de Dados

```sql
CREATE DATABASE sistema_fretes;
```

### Passo 6: Executar Migrações

```bash
python manage.py migrate
```

### Passo 7: Criar Superusuário (Administrador)

```bash
python manage.py createsuperuser
```

Siga as instruções para criar seu usuário administrador.

### Passo 8: Iniciar o Servidor

```bash
python manage.py runserver
```

O servidor estará disponível em `http://localhost:8000`

## 📊 Endpoints da API

### Autenticação

```
POST   /api/token/                      # Obter token JWT
POST   /api/token/refresh/              # Renovar token
```

### Clientes

```
GET    /api/clientes/                   # Listar clientes
POST   /api/clientes/                   # Criar cliente
GET    /api/clientes/{id}/              # Detalhar cliente
PUT    /api/clientes/{id}/              # Atualizar cliente
DELETE /api/clientes/{id}/              # Deletar cliente
```

### Motoristas

```
GET    /api/motoristas/                 # Listar motoristas
POST   /api/motoristas/                 # Criar motorista
GET    /api/motoristas/{id}/            # Detalhar motorista
PUT    /api/motoristas/{id}/            # Atualizar motorista
DELETE /api/motoristas/{id}/            # Deletar motorista
```

### Veículos

```
GET    /api/veiculos/                   # Listar veículos
POST   /api/veiculos/                   # Criar veículo
GET    /api/veiculos/{id}/              # Detalhar veículo
PUT    /api/veiculos/{id}/              # Atualizar veículo
DELETE /api/veiculos/{id}/              # Deletar veículo
GET    /api/veiculos/motorista-veiculo/ # Listar vínculos
POST   /api/veiculos/motorista-veiculo/ # Criar vínculo
```

### Fretes

```
GET    /api/fretes/                     # Listar fretes
POST   /api/fretes/                     # Criar frete
GET    /api/fretes/{id}/                # Detalhar frete
PUT    /api/fretes/{id}/                # Atualizar frete
DELETE /api/fretes/{id}/                # Deletar frete
PATCH  /api/fretes/{id}/atualizar-status/ # Atualizar status
```

### Pagamentos

```
GET    /api/pagamentos/                 # Listar pagamentos
POST   /api/pagamentos/                 # Criar pagamento
GET    /api/pagamentos/{id}/            # Detalhar pagamento
PUT    /api/pagamentos/{id}/            # Atualizar pagamento
DELETE /api/pagamentos/{id}/            # Deletar pagamento
PATCH  /api/pagamentos/{id}/registrar-pagamento/ # Registrar pagamento
```

### Recebimentos

```
GET    /api/recebimentos/               # Listar recebimentos
POST   /api/recebimentos/               # Criar recebimento
GET    /api/recebimentos/{id}/          # Detalhar recebimento
PUT    /api/recebimentos/{id}/          # Atualizar recebimento
DELETE /api/recebimentos/{id}/          # Deletar recebimento
PATCH  /api/recebimentos/{id}/registrar-recebimento/ # Registrar recebimento
```

### Relatórios

```
GET    /api/relatorios/mensal/          # Relatório mensal
GET    /api/relatorios/anual/           # Relatório anual
GET    /api/relatorios/por-motorista/   # Relatório por motorista
GET    /api/relatorios/por-veiculo/     # Relatório por veículo
GET    /api/relatorios/por-cliente/     # Relatório por cliente
```

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Permissões por usuário
- ✅ CORS configurável
- ✅ Validação de entrada
- ✅ Proteção CSRF
- ✅ Variáveis de ambiente sensíveis

## 📝 Exemplos de Uso

### Obter Token JWT

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "seu_usuario", "password": "sua_senha"}'
```

### Criar um Cliente

```bash
curl -X POST http://localhost:8000/api/clientes/ \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Empresa XYZ",
    "cnpj_cpf": "12.345.678/0001-90",
    "email": "contato@empresa.com",
    "telefone": "11 3000-0000",
    "endereco": "Rua das Flores, 123",
    "cidade": "São Paulo",
    "estado": "SP"
  }'
```

### Criar um Frete

```bash
curl -X POST http://localhost:8000/api/fretes/ \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "cliente-uuid",
    "motorista": "motorista-uuid",
    "veiculo": "veiculo-uuid",
    "cidade_origem": "São Paulo",
    "cidade_destino": "Rio de Janeiro",
    "peso_kg": 500,
    "valor_frete": 1500.00
  }'
```

### Obter Relatório Mensal

```bash
curl -X GET "http://localhost:8000/api/relatorios/mensal/?mes=1&ano=2024" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🧪 Testes

Para executar os testes:

```bash
python manage.py test
```

## 📚 Administração

Acesse o painel administrativo Django em:

```
http://localhost:8000/admin/
```

Faça login com as credenciais do superusuário criado anteriormente.

## 🚀 Deploy em Produção

### Configurações Importantes

1. **DEBUG = False** em .env
2. **SECRET_KEY** segura e única
3. **ALLOWED_HOSTS** configurado corretamente
4. **Banco de dados PostgreSQL** em servidor remoto
5. **HTTPS** habilitado
6. **Static files** servidos por CDN ou servidor web

### Deploy com Gunicorn e Nginx

```bash
# Instalar Gunicorn
pip install gunicorn

# Executar
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Faça um Fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**jackmotasilva32-sudo**

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.

## 🎯 Roadmap

- [ ] Frontend React
- [ ] Dashboard com gráficos
- [ ] Integração com SMS
- [ ] Notificações em tempo real
- [ ] Aplicativo mobile
- [ ] API para rastreamento GPS
- [ ] Integração com sistemas de pagamento
- [ ] Exportação de relatórios em PDF
