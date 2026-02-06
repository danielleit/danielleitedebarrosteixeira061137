# ==================================================
# Script de Inicialização - Projeto Artists (Windows)
# ==================================================

Write-Host "🚀 Iniciando projeto Artists API + Frontend..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está instalado
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
    Write-Host "✅ Docker e Docker Compose detectados" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker ou Docker Compose não está instalado." -ForegroundColor Red
    Write-Host "   Por favor, instale o Docker Desktop primeiro." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Instalar dependências do frontend localmente (para IDEs)
if (Test-Path "artists-web") {
    Write-Host "📦 Instalando dependências do frontend (para VS Code/IDEs)..." -ForegroundColor Cyan
    Push-Location artists-web
    
    if (Test-Path "package.json") {
        npm install --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependências do frontend instaladas" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Erro ao instalar dependências. Continuando..." -ForegroundColor Yellow
        }
    }
    
    Pop-Location
    Write-Host ""
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Cyan
docker-compose down

# Limpar volumes (opcional - descomente se quiser limpar dados)
# docker-compose down -v

Write-Host ""
Write-Host "🏗️  Construindo e iniciando containers..." -ForegroundColor Cyan
docker-compose up -d --build

Write-Host ""
Write-Host "⏳ Aguardando inicialização dos serviços (30 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Aplicação iniciada com sucesso!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs de Acesso:" -ForegroundColor Cyan
Write-Host "   • Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "   • API:           http://localhost:8080" -ForegroundColor White
Write-Host "   • Swagger:       http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "   • MinIO Console: http://localhost:9001" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Credenciais de Login:" -ForegroundColor Cyan
Write-Host "   • Usuário: admin" -ForegroundColor White
Write-Host "   • Senha:   admin123" -ForegroundColor White
Write-Host ""
Write-Host "📋 Para ver os logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Para parar:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor Gray
Write-Host ""
