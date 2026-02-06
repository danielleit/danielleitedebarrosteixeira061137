-- ====================================
-- V7: Adicionar coluna excluido nas tabelas
-- ====================================

-- Adicionar coluna excluido na tabela artist
ALTER TABLE artist
ADD COLUMN IF NOT EXISTS excluido BOOLEAN;

UPDATE artist SET excluido = FALSE WHERE excluido IS NULL;

ALTER TABLE artist
ALTER COLUMN excluido SET NOT NULL,
ALTER COLUMN excluido SET DEFAULT FALSE;

-- Adicionar coluna excluido na tabela album
ALTER TABLE album
ADD COLUMN IF NOT EXISTS excluido BOOLEAN;

UPDATE album SET excluido = FALSE WHERE excluido IS NULL;

ALTER TABLE album
ALTER COLUMN excluido SET NOT NULL,
ALTER COLUMN excluido SET DEFAULT FALSE;

-- Adicionar coluna excluido na tabela album_image
ALTER TABLE album_image
ADD COLUMN IF NOT EXISTS excluido BOOLEAN;

UPDATE album_image SET excluido = FALSE WHERE excluido IS NULL;

ALTER TABLE album_image
ALTER COLUMN excluido SET NOT NULL,
ALTER COLUMN excluido SET DEFAULT FALSE;

-- Índices para otimizar consultas com soft delete
CREATE INDEX IF NOT EXISTS idx_artist_excluido ON artist(excluido);
CREATE INDEX IF NOT EXISTS idx_album_excluido ON album(excluido);
CREATE INDEX IF NOT EXISTS idx_album_image_excluido ON album_image(excluido);
