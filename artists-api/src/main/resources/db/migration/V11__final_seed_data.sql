-- ====================================
-- V11: Seed definitivo - Artistas e Álbuns
-- ====================================

-- Limpar dados antigos (idempotência)
DELETE FROM album;
DELETE FROM artist;

-- Inserir artistas
INSERT INTO artist (nome, excluido) VALUES
('Serj Tankian', FALSE),
('Mike Shinoda', FALSE),
('Michel Teló', FALSE),
('Guns N'' Roses', FALSE);

-- Inserir álbuns
INSERT INTO album (nome, artist_id, excluido) VALUES
-- Serj Tankian (id=1)
('Harakiri', 1, FALSE),
('Black Blooms', 1, FALSE),
('The Rough Dog', 1, FALSE),

-- Mike Shinoda (id=2)
('The Rising Tied', 2, FALSE),
('Post Traumatic', 2, FALSE),
('Post Traumatic EP', 2, FALSE),
('Where''d You Go', 2, FALSE),

-- Michel Teló (id=3)
('Bem Sertanejo', 3, FALSE),
('Bem Sertanejo - O Show (Ao Vivo)', 3, FALSE),
('Bem Sertanejo - (1ª Temporada) - EP', 3, FALSE),

-- Guns N' Roses (id=4)
('Use Your Illusion I', 4, FALSE),
('Use Your Illusion II', 4, FALSE),
('Greatest Hits', 4, FALSE);

