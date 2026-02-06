-- ====================================
-- V6: Seed inicial (DESABILITADO - dados movidos para V11)
-- ====================================

-- Esta migration foi substituída pela V11
-- Mantida vazia para compatibilidade com histórico do Flyway

-- Inserir usuário padrão para testes (senha: admin123)
-- BCrypt hash de "admin123"
INSERT INTO app_user (username, password, email, ativo, created_at, updated_at) VALUES
('admin', '$2a$10$cQPt4UkZ9oJbwGW0BleDd.b/Rfh8Mf6IKD7Jg5mUwcW7Tx.3Tf7d6', 'admin@seplag.gov.br', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user', '$2a$10$cQPt4UkZ9oJbwGW0BleDd.b/Rfh8Mf6IKD7Jg5mUwcW7Tx.3Tf7d6', 'user@seplag.gov.br', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

