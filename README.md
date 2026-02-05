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

* POST `/api/v1/auth/login`
* POST `/api/v1/auth/refresh`
* GET `/api/v1/artistas`
* POST `/api/v1/artistas`
* PUT `/api/v1/artistas/{id}`
* GET `/api/v1/artistas/{id}/albuns`
* POST `/api/v1/albuns`
* POST `/api/v1/albuns/{id}/capas`

### Documentação

A documentação da API é disponibilizada via Swagger:

```
http://localhost:8080/swagger-ui.html
```

---

## Notificações em Tempo Real

Sempre que um novo álbum é cadastrado, a API publica um evento via **WebSocket**.

O front-end consome esses eventos e exibe notificações em tempo real ao usuário.

---

## Sincronização de Regionais

Será implementada a sincronização com o endpoint externo de regionais da Polícia Civil:

* Inserção de novos registros
* Inativação de registros inexistentes no endpoint
* Em caso de alteração, o registro anterior é inativado e um novo é criado

A estratégia utiliza estrutura de mapa por identificador, garantindo **complexidade O(n)**.

---

## Como Executar

### Pré-requisitos

* Docker
* Docker Compose

### Execução

```bash
docker-compose up -d
```

Após a inicialização, os serviços estarão disponíveis conforme definido no `docker-compose.yml`.

### Observações Importantes

Antes de utilizar os endpoints de upload de imagens, é necessário garantir que o bucket
`album-capas` esteja criado no MinIO.

O console do MinIO estará disponível conforme definido no `docker-compose.yml`.

---

## Implementação Atual

### Concluído

* Estrutura inicial do projeto Spring Boot
* Configuração do Gradle
* Organização modular do backend
* CRUD de Artistas, Álbuns e Imagens
* Integração com MinIO
* Versionamento de endpoints
* Documentação inicial (README)

### Em Andamento

* Autenticação JWT
* Rate limit
* WebSocket
* Front-end

### Planejado

* Testes unitários e de integração
* Sincronização de regionais
* Ajustes finais de segurança
* Documentação complementar

---

## Observações Finais

Nem todos os requisitos foram implementados integralmente até o momento.
As decisões de priorização foram documentadas, e os pontos pendentes estão claramente descritos neste README.

O foco do projeto é demonstrar **capacidade técnica**, **organização**, **clareza arquitetural**, **boas práticas** e **maturidade profissional**.
