-- ====================================
-- V10: Correção - Aplicar DEFAULT para coluna excluido
-- ====================================

-- Garantir que excluido tenha valor DEFAULT FALSE
ALTER TABLE artist ALTER COLUMN excluido SET DEFAULT FALSE;
ALTER TABLE album ALTER COLUMN excluido SET DEFAULT FALSE;
ALTER TABLE album_image ALTER COLUMN excluido SET DEFAULT FALSE;
