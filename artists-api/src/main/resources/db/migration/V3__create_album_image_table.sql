-- ====================================
-- V3: Criar tabela de imagens de álbuns
-- ====================================

CREATE TABLE album_image (
    id BIGSERIAL PRIMARY KEY,
    album_id BIGINT NOT NULL,
    bucket VARCHAR(255) NOT NULL,
    object_name VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_album_image_album FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_album_image_album_id ON album_image(album_id);
