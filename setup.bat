@echo off
CLS

echo.
echo ╔════════════════════════════════════════════════╗
echo ║  Sistema de Gestão de Fretes - Setup          ║
echo ╚════════════════════════════════════════════════╝
echo.

REM 1. Verificar Node.js
echo [1/5] Verificando Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js não encontrado. Por favor, instale Node.js v14+
    pause
    exit /b 1
)
echo ✓ Node.js encontrado
node -v
echo.

REM 2. Instalar dependências
echo [2/5] Instalando dependências...
call npm install
if errorlevel 1 (
    echo ✗ Erro ao instalar dependências
    pause
    exit /b 1
)
echo ✓ Dependências instaladas
echo.

REM 3. Configurar .env
echo [3/5] Configurando arquivo .env...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo ✓ Arquivo .env criado
    echo   Edite o arquivo backend\.env com suas credenciais do banco de dados
) else (
    echo ✓ Arquivo .env já existe
)
echo.

REM 4. Criar banco de dados
echo [4/5] Configurar banco de dados...
echo.
echo Para criar o banco de dados, execute:
echo.
echo mysql -u root -p ^< database\schema.sql
echo.
echo ou copie o conteúdo de database\schema.sql para seu cliente MySQL
echo.
pause /b
echo.

REM 5. Iniciar servidor
echo [5/5] Setup concluído com sucesso!
echo.
echo Para iniciar o servidor, execute:
echo.
echo npm start (produção)
echo npm run dev (desenvolvimento)
echo.
echo O servidor estará disponível em: http://localhost:3000
echo.
pause
