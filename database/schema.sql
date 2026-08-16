-- ==========================================
-- ESQUEMA DE BASE DE DATOS: RESTAURANTE
-- ==========================================

-- Tabla de Usuarios (Clientes y Administradores)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Aquí se guardará el hash de bcrypt
    rol VARCHAR(20) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Mesas
CREATE TABLE mesas (
    id SERIAL PRIMARY KEY,
    numero_mesa INT UNIQUE NOT NULL,
    capacidad INT NOT NULL,
    ubicacion VARCHAR(100),
    activa BOOLEAN DEFAULT TRUE -- Para el "soft delete" que pide la rúbrica
);

-- Tabla de Reservaciones
CREATE TABLE reservaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    mesa_id INT REFERENCES mesas(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    numero_comensales INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Evitar que una misma mesa se reserve a la misma hora exacta
    UNIQUE (mesa_id, fecha, hora)
);

-- ==========================================
-- DATOS DE PRUEBA (SEED)
-- ==========================================
-- Insertar algunas mesas por defecto
INSERT INTO mesas (numero_mesa, capacidad, ubicacion) VALUES 
(1, 2, 'Ventana'),
(2, 4, 'Centro'),
(3, 6, 'Terraza'),
(4, 8, 'VIP');