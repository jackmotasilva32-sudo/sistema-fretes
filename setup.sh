#!/bin/bash

echo "╔════════════════════════════════════════════════╗"
echo "║  Sistema de Gestão de Fretes - Setup          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar Node.js
echo -e "${YELLOW}[1/5]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado. Por favor, instale Node.js v14+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
echo ""

# 2. Instalar dependências
echo -e "${YELLOW}[2/5]${NC} Instalando dependências..."
if npm install; then
    echo -e "${GREEN}✓ Dependências instaladas${NC}"
else
    echo -e "${RED}✗ Erro ao instalar dependências${NC}"
    exit 1
fi
echo ""

# 3. Configurar .env
echo -e "${YELLOW}[3/5]${NC} Configurando arquivo .env..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Arquivo .env criado${NC}"
    echo -e "${YELLOW}  Edite o arquivo backend/.env com suas credenciais do banco de dados${NC}"
else
    echo -e "${GREEN}✓ Arquivo .env já existe${NC}"
fi
echo ""

# 4. Criar banco de dados
echo -e "${YELLOW}[4/5]${NC} Configurar banco de dados..."
echo ""
echo "Para criar o banco de dados, execute:"
echo ""
echo -e "${GREEN}mysql -u root -p < database/schema.sql${NC}"
echo ""
echo "ou copie o conteúdo de database/schema.sql para seu cliente MySQL"
echo ""
read -p "Pressione ENTER quando o banco de dados estiver criado..."
echo ""

# 5. Iniciar servidor
echo -e "${YELLOW}[5/5]${NC} Iniciando servidor..."
echo -e "${GREEN}✓ Setup concluído com sucesso!${NC}"
echo ""
echo "Para iniciar o servidor, execute:"
echo ""
echo -e "${GREEN}npm start${NC} (produção)"
echo -e "${GREEN}npm run dev${NC} (desenvolvimento)"
echo ""
echo "O servidor estará disponível em: http://localhost:3000"
echo ""
