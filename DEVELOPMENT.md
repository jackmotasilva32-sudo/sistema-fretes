# Guia de Desenvolvimento - Sistema de Fretes

## 🚀 Início Rápido

### Opção 1: Instalação Local (sem Docker)

#### Pré-requisitos
- Python 3.10+
- PostgreSQL 13+
- Git

#### Passos

```bash
# 1. Clonar repositório
git clone https://github.com/jackmotasilva32-sudo/sistema-fretes.git
cd sistema-fretes

# 2. Executar script de setup
bash setup.sh

# 3. Criar banco de dados PostgreSQL
sudo -u postgres createdb sistema_fretes

# 4. Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# 5. Editar arquivo .env
cd backend
cp .env.example .env
# Edite com suas credenciais PostgreSQL

# 6. Executar migrações
python manage.py migrate

# 7. Criar superusuário
python manage.py createsuperuser

# 8. Iniciar servidor
python manage.py runserver
```

Servidor estará em: `http://localhost:8000`

---

### Opção 2: Com Docker (Recomendado)

#### Pré-requisitos
- Docker
- Docker Compose

#### Passos

```bash
# 1. Clonar repositório
git clone https://github.com/jackmotasilva32-sudo/sistema-fretes.git
cd sistema-fretes

# 2. Executar setup com Docker
bash docker-setup.sh

# 3. Criar superusuário (se necessário)
docker-compose exec web python manage.py createsuperuser
```

Servidor estará em: `http://localhost:8000`

---

## 🔧 Configuração do Banco de Dados

### PostgreSQL Local

```sql
-- Criar usuário
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';

-- Criar banco de dados
CREATE DATABASE sistema_fretes OWNER seu_usuario;

-- Dar permissões
ALTER USER seu_usuario CREATEDB;

-- Verificar
\l  -- listar bancos
\du  -- listar usuários
```

### Arquivo .env

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=sistema_fretes
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

---

## 📝 Estrutura de Apps Django

Cada aplicação segue o padrão Django:

```
app_name/
├── __init__.py
├── admin.py          # Registro no admin Django
├── apps.py           # Configuração do app
├── models.py         # Modelos de dados
├── serializers.py    # Serializers DRF
├── urls.py           # Rotas da app
├── views.py          # ViewSets
└── tests.py          # Testes unitários
```

---

## 📚 Criando uma Nova Aplicação

```bash
cd backend

# Criar nova app
python manage.py startapp seu_app

# Ou copiar estrutura existente (recomendado)
cp -r apps/clientes apps/sua_app
```

### Adicionar ao INSTALLED_APPS

Edite `config/settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'apps.sua_app',
]
```

### Criar Modelos

Edite `apps/sua_app/models.py`:

```python
from django.db import models
import uuid
from django.utils import timezone

class MeuModelo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    data_criacao = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.nome
```

### Criar Serializer

Edite `apps/sua_app/serializers.py`:

```python
from rest_framework import serializers
from .models import MeuModelo

class MeuModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeuModelo
        fields = '__all__'
        read_only_fields = ('id', 'data_criacao')
```

### Criar ViewSet

Edite `apps/sua_app/views.py`:

```python
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import MeuModelo
from .serializers import MeuModeloSerializer

class MeuModeloViewSet(viewsets.ModelViewSet):
    queryset = MeuModelo.objects.all()
    serializer_class = MeuModeloSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['campo1', 'campo2']
    search_fields = ['nome']
```

### Registrar URLs

Edite `apps/sua_app/urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeuModeloViewSet

router = DefaultRouter()
router.register(r'', MeuModeloViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### Adicionar ao config/urls.py

```python
urlpatterns = [
    # ...
    path('api/sua_app/', include('apps.sua_app.urls')),
]
```

### Executar Migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 🧪 Testes

### Executar Todos os Testes

```bash
python manage.py test
```

### Testes de uma App Específica

```bash
python manage.py test apps.clientes
```

### Testes com Coverage

```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Gera relatório HTML
```

### Exemplo de Teste

```python
# apps/clientes/tests.py
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Cliente

class ClienteTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='test', password='test123')
        
    def test_criar_cliente(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'nome': 'Empresa Teste',
            'cnpj_cpf': '12.345.678/0001-90',
            'email': 'teste@empresa.com',
        }
        response = self.client.post('/api/clientes/', data)
        self.assertEqual(response.status_code, 201)
```

---

## 🔐 Autenticação JWT

### Obter Token

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "seu_usuario", "password": "sua_senha"}'
```

Resposta:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Usar Token em Requisições

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:8000/api/clientes/
```

### Renovar Token

```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "SEU_REFRESH_TOKEN"}'
```

---

## 📊 Painel Administrativo

Acesse em: `http://localhost:8000/admin/`

Faça login com as credenciais do superusuário criado durante a instalação.

Você pode:
- Gerenciar usuários e permissões
- Visualizar e editar todos os dados
- Executar ações em massa
- Filtrar e buscar dados

---

## 🛢️ Backup e Restore

### Backup do PostgreSQL

```bash
pg_dump -U seu_usuario -d sistema_fretes > backup.sql
```

### Restaurar Backup

```bash
psql -U seu_usuario -d sistema_fretes < backup.sql
```

### Dump com Docker

```bash
docker-compose exec db pg_dump -U postgres sistema_fretes > backup.sql
```

---

## 🚀 Deploy em Produção

### Configurações Críticas

1. **DEBUG = False** no .env
2. **SECRET_KEY** segura e única
3. **ALLOWED_HOSTS** configurado corretamente
4. **HTTPS** habilitado
5. **Database** em servidor externo
6. **Static files** em CDN ou servidor separado

### Deploy com Heroku (Exemplo)

```bash
# Instalar Heroku CLI
# Fazer login
heroku login

# Criar app
heroku create seu-app-fretes

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Enviar variáveis de ambiente
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=sua-chave-secreta

# Fazer deploy
git push heroku main

# Executar migrações
heroku run python backend/manage.py migrate
```

---

## 📋 Comandos Úteis

### Django

```bash
# Criar app
python manage.py startapp nome_app

# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Shell interativo
python manage.py shell

# Carregar dados
python manage.py loaddata arquivo.json

# Descarregar dados
python manage.py dumpdata app_name > dados.json

# Criar superusuário
python manage.py createsuperuser

# Coletar arquivos estáticos
python manage.py collectstatic

# Limpar migrações
python manage.py migrate app_name zero
```

### Docker Compose

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f web

# Executar comando
docker-compose exec web python manage.py migrate

# Parar containers
docker-compose down

# Remover volumes (dados)
docker-compose down -v

# Rebuild
docker-compose up --build -d
```

---

## 🐛 Troubleshooting

### Erro: "No module named 'apps'"

Certifique-se de que está no diretório correto:

```bash
cd backend
```

### Erro: "ModuleNotFoundError: No module named 'rest_framework'"

Instale as dependências:

```bash
pip install -r requirements.txt
```

### Erro de Conexão com Banco

Verifique as configurações do .env:

```bash
# Testar conexão PostgreSQL
psql -U usuario -d banco -h localhost -p 5432
```

### Porta 8000 já em uso

```bash
# Usar outra porta
python manage.py runserver 8001

# Ou encontrar e matar o processo
lsof -ti:8000 | xargs kill -9
```

---

## 📖 Referências

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [JWT Auth](https://simplejwt.readthedocs.io/)

---

## 👥 Contribuindo

1. Faça um Fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
