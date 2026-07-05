#!/bin/bash

echo "Sistema de Gerenciamento de Fretes - Setup Docker"
echo "================================================="
echo ""

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Erro: Docker não está instalado. Instale em: https://www.docker.com/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Erro: Docker Compose não está instalado."
    exit 1
fi

# Copia .env se não existir
if [ ! -f "backend/.env" ]; then
    echo "Criando arquivo .env..."
    cp backend/.env.example backend/.env
    echo "Arquivo .env criado. Configure as variáveis se necessário."
fi

echo ""
echo "Iniciando containers com Docker Compose..."
docker-compose up -d

echo ""
echo "Aguardando banco de dados ficar pronto..."
sleep 5

echo ""
echo "Executando migrações..."
docker-compose exec -T web python manage.py migrate

echo ""
echo "Coletando arquivos estáticos..."
docker-compose exec -T web python manage.py collectstatic --noinput

echo ""
echo "================================================="
echo "Setup concluído com sucesso!"
echo "================================================="
echo ""
echo "API disponível em: http://localhost:8000"
echo "Admin Django em: http://localhost:8000/admin/"
echo "Banco de dados em: localhost:5432"
echo ""
echo "Comandos úteis:"
echo "  Ver logs:              docker-compose logs -f web"
echo "  Parar containers:      docker-compose down"
echo "  Remover dados:         docker-compose down -v"
echo ""
echo "Para criar um superusuário, execute:"
echo "  docker-compose exec web python manage.py createsuperuser"
echo ""
