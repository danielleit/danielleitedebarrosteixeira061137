-- ====================================
-- V4: Criar tabela de regionais (Requisito Sênior)
-- ====================================

CREATE TABLE regional (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice para consultas
CREATE INDEX idx_regional_ativo ON regional(ativo);
CREATE INDEX idx_regional_nome ON regional(nome);
