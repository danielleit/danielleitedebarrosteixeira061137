# 🚀 Início Rápido

Este projeto implementa um sistema completo de gerenciamento de artistas e álbuns para o Processo Seletivo SEPLAG 2026.

## ⚡ Executar Projeto (Modo Completo)

### Opção 1: Script Automático (Linux/Mac)

```bash
chmod +x start.sh
./start.sh
```

### Opção 2: Docker Compose Manual

```bash
docker-compose up -d --build
```

Aguarde aproximadamente 30 segundos para inicialização completa.

## 📍 Acessar Serviços

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **API REST** | http://localhost:8080 | - |
| **Swagger** | http://localhost:8080/swagger-ui.html | - |
| **Frontend** | http://localhost:3000 | admin / admin123 |
| **MinIO Console** | http://localhost:9001 | minioadmin / minioadmin |

## 🧪 Testar API via Swagger

1. Acesse http://localhost:8080/swagger-ui.html
2. Faça login em **POST /api/v1/auth/login**:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
3. Copie o token retornado
4. Clique em **Authorize** (cadeado verde no topo)
5. Cole o token no formato: `Bearer {seu_token}`
6. Teste os endpoints

## 📖 Endpoints Principais

### Autenticação
```bash
POST /api/v1/auth/login      # Login
POST /api/v1/auth/refresh    # Renovar token
```

### Artistas
```bash
GET  /api/v1/artists?page=0&size=10&sort=nome,asc  # Listar (paginado)
GET  /api/v1/artists/{id}                           # Obter por ID
POST /api/v1/artists                                # Criar
PUT  /api/v1/artists/{id}                           # Atualizar
```

### Álbuns
```bash
GET  /api/v1/albuns/artista/{artistId}?page=0&size=5  # Álbuns de um artista
POST /api/v1/albuns                                   # Criar álbum
```

### Health Checks
```bash
GET /actuator/health
GET /actuator/health/liveness
GET /actuator/health/readiness
```

## 🧪 Executar Testes

```bash
cd artists-api
./gradlew test
```

## 🛑 Parar Projeto

```bash
docker-compose down
```

## � Desenvolvimento Local (VS Code/IDEs)

Se você vai editar o código no VS Code ou outra IDE, instale as dependências localmente para autocompletar e verificação de tipos:

```bash
# Frontend (Next.js + TypeScript)
cd artists-web
npm install
cd ..
```

**Nota:** O `start.sh` já faz isso automaticamente! As dependências locais são apenas para a IDE - o container Docker usa suas próprias.

## �📚 Documentação Completa

Consulte o [README.md](README.md) para documentação detalhada sobre:
- Arquitetura
- Decisões técnicas
- Requisitos implementados
- Estrutura do banco de dados
- WebSocket e notificações
- Sincronização de regionais

## ❓ Problemas Comuns

### Porta 8080 em uso
```bash
# Linux/Mac
sudo lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Rebuild completo
```bash
docker-compose down -v
docker-compose up -d --build
```

### Ver logs
```bash
docker-compose logs -f api
docker-compose logs -f frontend
```

---

**Desenvolvido por:** Daniel Leite de Barros Teixeira  
**Processo:** SEPLAG 001/2026 - Analista de TI Sênior
