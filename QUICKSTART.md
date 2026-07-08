# Guia Rápido de Início

## Windows

```bash
# 1. Abra o PowerShell ou CMD e execute:
setup.bat
```

## macOS / Linux

```bash
# 1. Dê permissão de execução ao script:
chmod +x setup.sh

# 2. Execute o script:
./setup.sh
```

## Configuração Manual

Se preferir configurar manualmente, siga estes passos:

### 1. Clone o repositório
```bash
git clone https://github.com/jackmotasilva32-sudo/sistema-fretes.git
cd sistema-fretes
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o arquivo .env
```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=sistema_fretes
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRE=7d
```

### 4. Crie o banco de dados

**Com MySQL CLI:**
```bash
mysql -u root -p < database/schema.sql
```

**Com MySQL Workbench ou phpMyAdmin:**
1. Abra seu cliente MySQL
2. Copie e cole o conteúdo de `database/schema.sql`
3. Execute o script

### 5. Inicie o servidor

**Produção:**
```bash
npm start
```

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

## Verificar Instalação

Acesse no navegador:
```
http://localhost:3000
```

Você deve ver uma resposta JSON como:
```json
{
  "mensagem": "Bem-vindo à API de Gestão de Fretes",
  "versao": "1.0.0",
  "endpoints": {
    "autenticacao": "/api/auth",
    "fretes": "/api/fretes",
    "pagamentos": "/api/pagamentos",
    "recebimentos": "/api/recebimentos",
    "clientes": "/api/clientes",
    "ordens_coleta": "/api/ordens-coleta",
    "veiculos": "/api/veiculos"
  }
}
```

## Primeiro Teste

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

Você receberá um token JWT.

### 3. Use o token para acessar endpoints protegidos
```bash
curl -X GET http://localhost:3000/api/fretes \
  -H "Authorization: Bearer {seu_token}"
```

## Troubleshooting

### Erro: "Node.js não encontrado"
- Instale Node.js v14 ou superior em https://nodejs.org

### Erro: "ECONNREFUSED" (banco de dados)
- Verifique se MySQL está rodando
- Confira as credenciais no arquivo `.env`
- Confirme que o banco de dados foi criado

### Erro: "EADDRINUSE" (porta em uso)
- Mude a porta no arquivo `.env`
- Ou feche a aplicação que está usando a porta 3000

### Erro: "Token inválido"
- Faça login novamente
- Verifique o JWT_SECRET no `.env`
- Confirme que o token está sendo enviado corretamente

## Próximos Passos

1. Consulte `docs/api.md` para documentação completa da API
2. Leia `INSTALACAO.md` para guia detalhado
3. Veja `ROADMAP.md` para futuras funcionalidades

## Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Verifique a documentação em `docs/api.md`
- Leia o arquivo `INSTALACAO.md`
