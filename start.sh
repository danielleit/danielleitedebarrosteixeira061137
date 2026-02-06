#!/bin/bash

# ==================================================
# Script de Inicialização - Projeto Artists
# ==================================================

echo "🚀 Iniciando projeto Artists API + Frontend..."
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose detectados"
echo ""

# Instalar dependências do frontend localmente (para IDEs)
if [ -d "artists-web" ]; then
    echo "📦 Instalando dependências do frontend (para VS Code/IDEs)..."
    cd artists-web
    if [ -f "package.json" ]; then
        npm install --silent
        echo "✅ Dependências do frontend instaladas"
    fi
    cd ..
    echo ""
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Limpar volumes (opcional - descomente se quiser limpar dados)
# docker-compose down -v

echo ""
echo "🏗️  Construindo e iniciando containers..."
docker-compose up -d --build

echo ""
echo "⏳ Aguardando inicialização dos serviços (30 segundos)..."
sleep 30

echo ""
echo "✅ Projeto inicializado com sucesso!"
echo ""
echo "📍 Serviços disponíveis:"
echo "   - API Backend:     http://localhost:8080"
echo "   - Swagger/OpenAPI: http://localhost:8080/swagger-ui.html"
echo "   - Frontend:        http://localhost:3000"
echo "   - MinIO Console:   http://localhost:9001"
echo "   - PostgreSQL:      localhost:5432"
echo ""
echo "🔑 Credenciais:"
echo "   - Usuário App:  admin / admin123"
echo "   - MinIO:        minioadmin / minioadmin"
echo "   - PostgreSQL:   artists / artists"
echo ""
echo "📊 Verificar logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Parar serviços:"
echo "   docker-compose down"
echo ""
echo "🧪 Executar testes:"
echo "   cd artists-api && ./gradlew test"
echo ""
