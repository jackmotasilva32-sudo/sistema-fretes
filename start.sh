#!/bin/bash

set -e

echo "Executando migrações do banco de dados..."
python backend/manage.py migrate

echo "Coletando arquivos estáticos..."
python backend/manage.py collectstatic --noinput

echo "Criando superusuário..."
python backend/manage.py createsuperuser --noinput --username=admin --email=admin@example.com || true

echo "Iniciando servidor Gunicorn..."
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4