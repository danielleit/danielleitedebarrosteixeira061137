-- ====================================
-- V2: Criar tabela de álbuns
-- ====================================

CREATE TABLE album (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    artist_id BIGINT NOT NULL,
    data_lancamento DATE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_album_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_album_artist_id ON album(artist_id);
CREATE INDEX idx_album_nome ON album(nome);
CREATE INDEX idx_album_ativo ON album(ativo);
