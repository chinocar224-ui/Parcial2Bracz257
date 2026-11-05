-- Parcial 2 - Agenda y boletaje de eventos culturales
-- Ejecutar como superusuario (postgres):
--   psql -U postgres -f crear_bd.sql

CREATE USER usrparcial2 WITH PASSWORD 'P4rc14L2-2026';

CREATE DATABASE parcial2_bracz OWNER usrparcial2;

GRANT ALL PRIVILEGES ON DATABASE parcial2_bracz TO usrparcial2;

-- Las tablas (recintos y eventos_culturales) las crea TypeORM al iniciar el backend
-- (synchronize: true), igual que en clase.
