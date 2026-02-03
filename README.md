# Projeto Full Stack – Gerenciamento de Artistas e Álbuns

Processo Seletivo SEPLAG – Analista de TI Sênior

> **Status do projeto:** Em desenvolvimento

---

## Identificação

* **Candidato:** Daniel Leite de Barros Teixeira
* **Cargo:** Analista de Tecnologia da Informação – Perfil Sênior
* **Edital:** Processo Seletivo Conjunto nº 001/2026/SEPLAG

---

## Visão Geral

Este projeto tem como objetivo implementar uma solução **full stack** para o gerenciamento de artistas e seus álbuns, atendendo aos requisitos técnicos definidos no edital do processo seletivo.

A aplicação prevê funcionalidades como:

* Cadastro, edição e consulta de artistas
* Associação de álbuns a artistas
* Upload e visualização de capas de álbuns
* Autenticação e autorização via JWT
* Paginação, ordenação e filtros
* Notificações em tempo real para novos álbuns cadastrados

---

## Arquitetura

A solução será composta por serviços independentes, orquestrados via **Docker Compose**, garantindo isolamento, reprodutibilidade e facilidade de execução:

* **API REST** – Spring Boot
* **Banco de Dados** – PostgreSQL
* **Armazenamento de Objetos** – MinIO (compatível com S3)
* **Front-end** – React (JavaScript / JSX)

A comunicação entre os serviços ocorre em **rede Docker interna**, sem exposição direta de dependências sensíveis.

---

## Stack Tecnológica

### Back End

* Java 17
* Spring Boot
* Spring Web (APIs REST)
* Spring Data JPA (persistência e paginação)
* Spring Security (JWT, CORS, Rate Limit)
* Flyway (migrations e versionamento do banco)
* PostgreSQL
* MinIO (armazenamento de imagens via API S3)
* WebSocket (notificações em tempo real)
* Spring Boot Actuator (health checks, liveness e readiness)
* OpenAPI / Swagger

### Front End

* React (JSX)
* JavaScript (ES202x)
* Tailwind CSS
* RxJS (BehaviorSubject)
* Facade Pattern

> O uso de **RxJS com BehaviorSubject no React** foi adotado para atender explicitamente ao requisito do edital referente à gestão de estado e ao padrão Facade, garantindo desacoplamento entre a camada de UI e as regras de negócio.

---

## Modelagem de Dados (Proposta)

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

### Imagem

* id (PK)
* album_id (FK)
* bucket
* object_name
* created_at

> As imagens não são armazenadas no banco de dados, apenas seus **metadados**. O conteúdo binário é persistido no MinIO.

---

## Segurança (Planejada)

* Autenticação baseada em **JWT**
* Token com expiração de **5 minutos**
* Endpoint dedicado para **renovação de token**
* Configuração de **CORS restritiva**, permitindo acesso apenas a domínios autorizados
* **Rate limit**: máximo de 10 requisições por minuto por usuário

---

## API (Planejada)

Os endpoints seguirão versionamento por URL:

* `POST /api/v1/auth/login`
* `POST /api/v1/auth/refresh`
* `GET /api/v1/artistas`
* `POST /api/v1/artistas`
* `PUT /api/v1/artistas/{id}`
* `GET /api/v1/artistas/{id}/albuns`
* `POST /api/v1/albuns`
* `POST /api/v1/albuns/{id}/capas`

A documentação da API será disponibilizada via Swagger:

```
http://localhost:8080/swagger-ui.html
```

---

## Upload de Imagens (Planejado)

* Upload realizado via API REST
* Armazenamento no MinIO
* Geração de **URLs pré-assinadas (presigned URLs)**
* Tempo de expiração das URLs: **30 minutos**

---

## Notificações em Tempo Real (Planejado)

A API publicará eventos via **WebSocket** sempre que um novo álbum for cadastrado.
O front-end consumirá esses eventos e exibirá notificações em tempo real para o usuário.

---

## Sincronização de Regionais (Planejada)

Será implementada a sincronização com o endpoint externo de regionais da Polícia Civil:

* Inserção de novos registros
* Inativação de registros não mais existentes no endpoint
* Em caso de alteração de dados, o registro anterior será inativado e um novo será criado
* Estratégia com **complexidade O(n)** utilizando estrutura de mapa por identificador

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

---

## Implementação Atual

### Concluído

* Estrutura inicial do projeto Spring Boot
* Configuração do Gradle
* Organização do repositório
* Documentação inicial (README)

### Pendente

* Implementação completa do CRUD
* Autenticação JWT
* Integração com MinIO
* WebSocket
* Front-end
* Testes unitários e de integração

Você escolhe o próximo foco.
