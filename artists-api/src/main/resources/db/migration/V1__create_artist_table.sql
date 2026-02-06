-- ====================================
-- V1: Criar tabela de artistas
-- ====================================

CREATE TABLE artist (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice para busca por nome
CREATE INDEX idx_artist_nome ON artist(nome);
CREATE INDEX idx_artist_ativo ON artist(ativo);
