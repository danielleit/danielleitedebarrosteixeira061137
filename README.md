# Projeto Full Stack – Gerenciamento de Artistas e Álbuns

**Processo Seletivo SEPLAG – Analista de TI Sênior**

**Status do projeto:** Em desenvolvimento

---

## Identificação

* **Candidato:** Daniel Leite de Barros Teixeira
* **Cargo:** Analista de Tecnologia da Informação – Perfil Sênior
* **Edital:** Processo Seletivo Conjunto nº 001/2026/SEPLAG

---

## Visão Geral

Este projeto tem como objetivo implementar uma solução **full stack** para o gerenciamento de artistas e seus álbuns, atendendo aos requisitos técnicos definidos no edital do processo seletivo.

A aplicação permite:

* Cadastro, edição e consulta de artistas
* Associação de álbuns a artistas
* Upload e visualização de capas de álbuns
* Autenticação e autorização via JWT
* Paginação, ordenação e filtros
* Notificações em tempo real para novos álbuns cadastrados

O foco do projeto é demonstrar **arquitetura limpa**, **boas práticas**, **organização**, **decisões técnicas conscientes** e **capacidade de priorização**.

---

## Arquitetura

A solução é composta por serviços independentes, orquestrados via **Docker Compose**, garantindo isolamento, reprodutibilidade e facilidade de execução:

* **API REST:** Spring Boot
* **Banco de Dados:** PostgreSQL
* **Armazenamento de Objetos:** MinIO (compatível com S3)
* **Front-end:** React

A comunicação entre os serviços ocorre em rede Docker interna, evitando exposição direta de dependências sensíveis.

---

## Stack Tecnológica

### Back End

* Java 17
* Spring Boot
* Spring Web (APIs REST)
* Spring Data JPA (persistência, paginação e ordenação)
* Spring Security (JWT, CORS, Rate Limit)
* Flyway (migrations e versionamento do banco)
* PostgreSQL
* MinIO (armazenamento de imagens via API S3)
* WebSocket (notificações em tempo real)
* Spring Boot Actuator (health checks, liveness e readiness)
* OpenAPI / Swagger

### Front End

* React
* JavaScript (ES202x)
* Tailwind CSS
* RxJS (BehaviorSubject)
* Facade Pattern

> O uso de **RxJS com BehaviorSubject no React** foi adotado para atender explicitamente ao requisito do edital referente à **gestão de estado** e ao **Facade Pattern**, garantindo desacoplamento entre UI e regras de negócio.

---

## Modelagem de Dados

### Artista

* id (PK)
* nome
* ativo
* created_at
* updated_at

### Álbum

* id (PK)
* nome
* artista_id (FK)
* data_lancamento
* ativo
* created_at
* updated_at

### AlbumImage (Imagem)

* id (PK)
* album_id (FK)
* bucket
* object_name
* created_at

As imagens **não são armazenadas no banco de dados**, apenas seus metadados.
O conteúdo binário é persistido no MinIO.

---

## Decisões Arquiteturais Importantes

### Armazenamento de Imagens

As capas dos álbuns não são armazenadas diretamente na entidade `Album`.

Foi criada a entidade `AlbumImage` para:

* Permitir **múltiplas imagens por álbum**
* Evitar acoplamento entre dados relacionais e arquivos binários
* Facilitar expansão futura (imagem principal, ordenação, tipos de imagem)
* Manter o banco de dados leve e performático

Essa abordagem segue boas práticas para sistemas que lidam com arquivos e storage externo.

---

## Armazenamento de Objetos (MinIO)

O MinIO é utilizado como storage compatível com a API S3 para armazenamento das capas dos álbuns.

* Upload realizado via API REST
* Backend gera URLs pré-assinadas (presigned URLs)
* Tempo de expiração das URLs: **30 minutos**

### Bucket

* **Nome do bucket:** `album-capas`

O bucket é tratado como **responsabilidade de infraestrutura** e deve existir previamente no ambiente.

Ele pode ser criado:

* Via console web do MinIO
* Via script de inicialização
* Manualmente durante a configuração do ambiente Docker

Essa decisão foi adotada para manter simplicidade, previsibilidade e alinhamento com ambientes reais de produção.

---

## Segurança

* Autenticação baseada em JWT
* Token com expiração de **5 minutos**
* Endpoint dedicado para renovação de token
* Configuração de CORS restritiva, permitindo acesso apenas a domínios autorizados
* Rate limit: **máximo de 10 requisições por minuto por usuário**

---

## API

Os endpoints seguem versionamento por URL:

### Autenticação
* `POST /api/v1/auth/login` - Autenticação de usuário
* `POST /api/v1/auth/refresh` - Renovação de token JWT

### Artistas
* `GET /api/v1/artists` - Listar artistas (paginado, busca por nome, ordenação)
* `GET /api/v1/artists/{id}` - Obter artista por ID
* `POST /api/v1/artists` - Criar artista
* `PUT /api/v1/artists/{id}` - Atualizar artista
* `DELETE /api/v1/artists/{id}` - Excluir artista

### Álbuns
* `GET /api/v1/albuns` - Listar todos os álbuns (paginado)
* `GET /api/v1/albuns/artista/{artistId}` - Listar álbuns de um artista (paginado)
* `POST /api/v1/albuns` - Criar álbum
* `PUT /api/v1/albuns/{id}` - Atualizar álbum
* `DELETE /api/v1/albuns/{id}` - Excluir álbum

### Capas de Álbuns
* `POST /api/v1/albuns/{id}/capas` - Upload de capa
* `GET /api/v1/albuns/{id}/capas` - Listar capas do álbum

### Regionais (Requisito Sênior)
* `GET /api/v1/regionais` - Listar regionais (paginado)
* `GET /api/v1/regionais/ativas` - Listar apenas regionais ativas
* `GET /api/v1/regionais/{id}` - Obter regional por ID
* `POST /api/v1/regionais/sync` - Sincronização manual

### Health Checks
* `GET /actuator/health` - Status geral da aplicação
* `GET /actuator/health/liveness` - Liveness probe
* `GET /actuator/health/readiness` - Readiness probe

### Documentação
A documentação completa da API via Swagger/OpenAPI está disponível em:
```
http://localhost:8080/swagger-ui.html
```

---

## WebSocket - Notificações em Tempo Real

Endpoint WebSocket: `ws://localhost:8080/ws`

Sempre que um novo álbum é cadastrado, a API publica um evento via WebSocket no tópico `/topic/albums`.

O front-end consome esses eventos e exibe notificações em tempo real ao usuário.

**Estrutura da notificação:**
```json
{
  "type": "NEW_ALBUM",
  "albumId": 1,
  "albumName": "Nome do Álbum",
  "artistId": 1,
  "artistName": "Nome do Artista",
  "message": "Novo álbum cadastrado: Nome do Álbum - Nome do Artista"
}
```

---

## Sincronização de Regionais (Requisito Sênior)

O sistema implementa sincronização automática com o endpoint externo:
```
https://integrador-argus-api.geia.vip/v1/regionais
```

### Estratégia de Sincronização (Complexidade O(n))

1. **Buscar dados da API externa**
2. **Buscar dados locais**
3. **Criar mapa (HashMap) para acesso O(1) por ID**
4. **Para cada regional da API externa:**
   - Se não existe localmente → **inserir**
   - Se existe mas nome mudou → **inativar registro antigo e criar novo**
5. **Para regionais locais ativas não presentes na API → inativar**

### Execução

- **Automática:** A cada 1 hora
- **Manual:** via endpoint `POST /api/v1/regionais/sync`

---

## Como Executar

### Pré-requisitos

* Docker
* Docker Compose

### Execução Completa (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Aguardar inicialização (cerca de 30 segundos)
# Acessar:
# - API: http://localhost:8080
# - Frontend: http://localhost:3000
# - Swagger: http://localhost:8080/swagger-ui.html
# - MinIO Console: http://localhost:9001
```

### Execução Individual (Desenvolvimento)

#### Backend
```bash
cd artists-api
./gradlew bootRun
```

#### Frontend
```bash
cd artists-web
npm install
npm run dev
```

### Credenciais Padrão

**Usuários da aplicação:**
- Username: `admin` | Senha: `admin123`
- Username: `user` | Senha: `admin123`

**MinIO:**
- Access Key: `minioadmin`
- Secret Key: `minioadmin`

**PostgreSQL:**
- Database: `artists_db`
- Username: `artists`
- Password: `artists`

---

## Desenvolvimento com IDEs (VS Code, IntelliJ, etc.)

Para obter **autocompletar**, **verificação de tipos** e **IntelliSense** no frontend:

```bash
cd artists-web
npm install
```

**Por quê?**
- O container Docker tem seu próprio `node_modules` (isolado)
- A IDE precisa das dependências **localmente** para analisar o código TypeScript
- O `start.sh` já faz isso automaticamente

**Importante:** As dependências locais são **apenas para a IDE**. A aplicação roda dentro do container usando suas próprias dependências.

---

## Testes

### Backend

```bash
cd artists-api
./gradlew test
```

Os testes incluem:
- Testes unitários de serviços (ArtistService, JwtService, UserDetailsService)
- Testes de integração (em desenvolvimento)

### Frontend

```bash
cd artists-web
npm test
```

---

## Estrutura do Banco de Dados

### Tabela: artist
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | Chave primária |
| nome | VARCHAR(255) | Nome do artista |
| ativo | BOOLEAN | Status ativo/inativo |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: album
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | Chave primária |
| nome | VARCHAR(255) | Nome do álbum |
| artist_id | BIGINT | FK para artist |
| data_lancamento | DATE | Data de lançamento |
| ativo | BOOLEAN | Status ativo/inativo |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: album_image
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | Chave primária |
| album_id | BIGINT | FK para album |
| bucket | VARCHAR(255) | Nome do bucket MinIO |
| object_name | VARCHAR(500) | Nome do objeto no MinIO |
| created_at | TIMESTAMP | Data de criação |

### Tabela: app_user
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | Chave primária |
| username | VARCHAR(100) | Nome de usuário (unique) |
| password | VARCHAR(255) | Senha criptografada (BCrypt) |
| email | VARCHAR(255) | E-mail |
| ativo | BOOLEAN | Status ativo/inativo |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: regional
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| nome | VARCHAR(200) | Nome da regional |
| ativo | BOOLEAN | Status ativo/inativo |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

---

## Checklist de Requisitos Implementados

### Back End ✅

- [x] **Segurança CORS** - Configurado para aceitar apenas domínios autorizados
- [x] **Autenticação JWT** - Token com expiração de 5 minutos
- [x] **Renovação de Token** - Endpoint `/api/v1/auth/refresh`
- [x] **POST, PUT, GET** - Implementados para todos os recursos
- [x] **Paginação** - Consulta de álbuns e artistas
- [x] **Consultas parametrizadas** - Álbuns por artista
- [x] **Ordenação alfabética** - Busca de artistas (asc/desc)
- [x] **Upload de imagens** - Múltiplas capas por álbum
- [x] **MinIO (S3)** - Armazenamento de imagens
- [x] **Presigned URLs** - Expiração de 30 minutos
- [x] **Versionamento de endpoints** - `/api/v1/`
- [x] **Flyway Migrations** - Criação e população do banco
- [x] **Swagger/OpenAPI** - Documentação completa

### Requisitos Sênior ✅

- [x] **Health Checks** - Liveness e Readiness
- [x] **Testes Unitários** - ArtistService, JwtService, UserDetailsService
- [x] **WebSocket** - Notificações de novos álbuns
- [x] **Rate Limit** - 10 requisições/minuto por usuário
- [x] **Facade Pattern** - Implementado no frontend (BehaviorSubject)
- [x] **Sincronização de Regionais** - Algoritmo O(n), sincronização automática

### Front End ⚠️ (Parcialmente Implementado)

- [x] **Estrutura modular** - Domínios, facades, componentes
- [x] **TypeScript** - Todo o projeto
- [x] **Tailwind CSS** - Estilização
- [x] **Facade Pattern** - Com BehaviorSubject (RxJS)
- [x] **Autenticação JWT** - AuthService e interceptor
- [x] **WebSocket** - Hook useWebSocket
- [x] **Docker** - Dockerfile e docker-compose
- [ ] **Lazy Loading Routes** - Em desenvolvimento
- [ ] **Telas completas** - Login, listagem, cadastro (em desenvolvimento)

---

## Decisões Técnicas e Arquiteturais

### Por que MapStruct?
- Redução de boilerplate
- Type-safe
- Geração de código em tempo de compilação
- Performance superior a reflexão

### Por que Flyway?
- Versionamento declarativo do schema
- Rastreabilidade de mudanças
- Reprodutibilidade em ambientes
- Integração nativa com Spring Boot

### Por que BehaviorSubject no React?
- Atendimento explícito ao requisito do edital
- Estado reativo e compartilhado
- Desacoplamento entre UI e lógica de negócio
- Cache do último valor emitido

### Por que Generic CRUD Service?
- Reutilização de código
- Padrão consistente
- Facilita manutenção
- Extensível para casos específicos

---

## Observações e Limitações

### O que foi priorizado

1. **Requisitos sênior** - Para demonstrar capacidade técnica avançada
2. **Arquitetura sólida** - Base escalável e manutenível
3. **Segurança** - JWT, CORS, Rate Limit
4. **Documentação** - Código limpo e README detalhado
5. **Infraestrutura** - Docker, migrations, health checks

### O que ficou pendente

- **Frontend completo** - Telas funcionais básicas implementadas, mas necessitam refinamento
- **Testes de integração** - Apenas testes unitários implementados
- **Validações avançadas** - Foco em validações básicas
- **Tratamento de erros granular** - Exception handlers básicos

### Justificativa

Dado o prazo do processo seletivo, priorizei demonstrar:
- **Conhecimento técnico amplo** - Diversos requisitos complexos
- **Qualidade sobre quantidade** - Código limpo e bem estruturado
- **Pensamento arquitetural** - Decisões conscientes e documentadas
- **Capacidade de priorização** - Foco no que agrega mais valor

---

## Commits e Versionamento

O histórico de commits foi organizado de forma descritiva e incremental, demonstrando:
- Evolução natural do projeto
- Separação lógica de funcionalidades
- Mensagens claras e objetivas
- Commits pequenos e focados

---

## Próximos Passos (Se houvesse mais tempo)

1. Completar todas as telas do frontend
2. Implementar testes E2E com Cypress/Playwright
3. Adicionar cache com Redis
4. Implementar circuit breaker para chamadas externas
5. Adicionar observabilidade (prometheus, grafana)
6. Implementar CI/CD pipeline
7. Documentação de API com exemplos interativos

---

## Contato

**Candidato:** Daniel Leite de Barros Teixeira  
**Vaga:** Analista de TI – Perfil Sênior  
**Processo:** SEPLAG 001/2026  

---

**Data de entrega:** Fevereiro/2026  
**Status:** ✅ Implementação concluída com requisitos priorizados
