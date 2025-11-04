-- Migration: add unique constraint and foreign keys for profile tables
-- WARNING: Run a backup before applying. This file can be applied with:
--   mysql -u <user> -p <database> < migrations/001_add_profile_constraints.sql

-- Ensure there are no duplicate usuario_id values in Professores/Alunos before applying

ALTER TABLE Professores
  ADD CONSTRAINT ux_professores_usuario_id UNIQUE (usuario_id);

ALTER TABLE Alunos
  ADD CONSTRAINT ux_alunos_usuario_id UNIQUE (usuario_id);

ALTER TABLE Professores
  ADD CONSTRAINT fk_professores_usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Alunos
  ADD CONSTRAINT fk_alunos_usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
    ON DELETE CASCADE ON UPDATE CASCADE;
