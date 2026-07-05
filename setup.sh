#!/bin/bash

echo "Iniciando setup do projeto Sistema de Fretes..."

# Verifica se está no diretório correto
if [ ! -f "backend/manage.py" ]; then
    echo "Erro: execute este script a partir da raiz do projeto"
    exit 1
fi

# Cria ambiente virtual
echo "Criando ambiente virtual..."
python -m venv venv

# Ativa ambiente virtual
echo "Ativando ambiente virtual..."
source venv/bin/activate || . venv/Scripts/activate

# Instala dependências
echo "Instalando dependências..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Copia .env
echo "Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Arquivo .env criado. Edite com suas configurações de banco de dados."
fi

# Executa migrações
echo "Executando migrações..."
python manage.py migrate

# Cria superusuário
echo "Criando superusuário (deixe em branco para pular)..."
python manage.py createsuperuser --noinput --username=admin --email=admin@example.com 2>/dev/null || true

echo "Setup concluído!"
echo "Para iniciar o servidor, execute: python manage.py runserver"