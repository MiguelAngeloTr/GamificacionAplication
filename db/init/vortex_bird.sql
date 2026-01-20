



-- =========================================================
-- VORTEX_BIRD - Esquema alineado a tu BD actual + Plan Carrera
-- =========================================================

CREATE DATABASE IF NOT EXISTS vortex_bird
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE vortex_bird;

-- =========================================================
-- 0) TABLAS EXISTENTES (si ya existen, NO las vuelve a crear)
-- =========================================================

-- Usuarios 
CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  correo VARCHAR(45) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo)
) ENGINE=InnoDB;

-- Coaches
CREATE TABLE IF NOT EXISTS coaches (
  cedula INT NOT NULL,
  tipo_cedula CHAR(2) NOT NULL COMMENT 'CC|CE',
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  direccion VARCHAR(45) NOT NULL,
  nacionalidad VARCHAR(45) NOT NULL,
  telefono VARCHAR(45) NOT NULL,
  foto BLOB,
  observacion VARCHAR(45) DEFAULT NULL,
  usuario_id INT NULL,
  PRIMARY KEY (cedula),
  UNIQUE KEY uq_coaches_usuario (usuario_id),
  CONSTRAINT fk_coaches_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Colaboradores (de tu dump; ojo: en tu dump el campo se llama `dirección` con tilde,
-- aquí lo normalizo a `direccion`. Si ya existe con tilde, NO ejecutes este CREATE;
-- usa el ALTER más abajo si quieres normalizarlo.)
CREATE TABLE IF NOT EXISTS colaboradores (
  cedula INT NOT NULL,
  tipo_cedula CHAR(2) NOT NULL COMMENT 'CC|CE',
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  direccion VARCHAR(45) NOT NULL,
  nacionalidad VARCHAR(45) NOT NULL,
  telefono VARCHAR(45) NOT NULL,
  foto BLOB,
  fk_cedula_coachee INT NOT NULL,
  usuario_id INT NULL,
  PRIMARY KEY (cedula),
  KEY fk_coach_idx (fk_cedula_coachee),
  UNIQUE KEY uq_colaboradores_usuario (usuario_id),
  CONSTRAINT fk_colaboradores_coach
    FOREIGN KEY (fk_cedula_coachee) REFERENCES coaches(cedula)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_colaboradores_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Directivos (de tu dump)
CREATE TABLE IF NOT EXISTS directivos (
  cedula INT NOT NULL,
  tipo_cedula CHAR(2) NOT NULL COMMENT 'CC|CE',
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  direccion VARCHAR(45) NOT NULL,
  nacionalidad VARCHAR(45) NOT NULL,
  telefono VARCHAR(45) NOT NULL,
  foto BLOB NOT NULL,
  usuario_id INT NULL,
  PRIMARY KEY (cedula),
  UNIQUE KEY uq_directivos_usuario (usuario_id),
  CONSTRAINT fk_directivos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Actividades (tu dump)
CREATE TABLE IF NOT EXISTS actividades (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  estado TINYINT(1) DEFAULT NULL,
  descripcion VARCHAR(300) DEFAULT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_final DATE DEFAULT NULL,
  tipo VARCHAR(45) NOT NULL,
  archivo BLOB,
  usuario_id INT NULL,
  plan_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Planes (tu dump) - OJO: este "planes" de tu dump no es el mismo "Plan Carrera".
CREATE TABLE IF NOT EXISTS planes (
  id INT NOT NULL AUTO_INCREMENT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  descripcion VARCHAR(300) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Presupuestos (tu dump)
CREATE TABLE IF NOT EXISTS presupuestos (
  id INT NOT NULL,
  costo DOUBLE NOT NULL,
  fk_id_actividad INT NOT NULL,
  PRIMARY KEY (id),
  KEY fk_actividad_idx (fk_id_actividad),
  CONSTRAINT fk_presupuestos_actividad
    FOREIGN KEY (fk_id_actividad) REFERENCES actividades(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Unidades de retorno (tu dump)
CREATE TABLE IF NOT EXISTS unidades_retorno (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  objetivo VARCHAR(45) NOT NULL,
  estado TINYINT DEFAULT NULL,
  archivo BLOB,
  descripcion VARCHAR(300) DEFAULT NULL,
  nota VARCHAR(300) DEFAULT NULL,
  fecha DATE NOT NULL,
  usuario_id INT NULL,
  plan_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Recompensas (tu dump)
CREATE TABLE IF NOT EXISTS recompensas (
  id INT NOT NULL AUTO_INCREMENT,
  flagTecnologia TINYINT(1) DEFAULT NULL,
  flagVideojuegos TINYINT(1) DEFAULT NULL,
  flagLibros TINYINT(1) DEFAULT NULL,
  flagGimnasio TINYINT(1) DEFAULT NULL,
  flagArte TINYINT(1) DEFAULT NULL,
  flagAlimentacion TINYINT(1) DEFAULT NULL,
  usuario_id INT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_recompensas_usuario (usuario_id),
  CONSTRAINT fk_recompensas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Puntuaciones (tu dump)
CREATE TABLE IF NOT EXISTS puntuaciones (
  id INT NOT NULL AUTO_INCREMENT,
  cantidad_puntos INT NOT NULL,
  usuario_id INT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_puntuaciones_usuario (usuario_id),
  CONSTRAINT fk_puntuaciones_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Niveles (tu dump)
CREATE TABLE IF NOT EXISTS niveles (
  id INT NOT NULL AUTO_INCREMENT,
  num_nivel INT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- =========================================================
-- EVIDENCIAS
-- =========================================================
CREATE TABLE IF NOT EXISTS evidencias (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NULL,
  actividad_id INT NULL,
  unidad_id INT NULL,
  type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  data LONGBLOB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_evid_usuario (usuario_id),
  KEY idx_evid_actividad (actividad_id),
  KEY idx_evid_unidad (unidad_id),
  CONSTRAINT fk_evid_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_evid_actividad
    FOREIGN KEY (actividad_id) REFERENCES actividades(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_evid_unidad
    FOREIGN KEY (unidad_id) REFERENCES unidades_retorno(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 2) ROLES Y PERMISOS (Directiva / Coach / Colaborador)
-- =========================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuario_rol (
  usuario_id INT NOT NULL,
  rol_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, rol_id),
  CONSTRAINT fk_usuario_rol_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_rol_rol
    FOREIGN KEY (rol_id) REFERENCES roles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Seed roles
INSERT IGNORE INTO roles (id, nombre) VALUES
  (1, 'directiva'),
  (2, 'coach'),
  (3, 'colaborador');

-- =========================================================
-- 3) PLAN CARRERA (núcleo)
-- =========================================================
CREATE TABLE IF NOT EXISTS plan_carrera (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL DEFAULT 'PLAN CARRERA',
  descripcion TEXT,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS objetivos_estrategicos (
  id INT NOT NULL AUTO_INCREMENT,
  plan_id INT NOT NULL,
  creado_por_usuario_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descripcion TEXT,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_obj_plan (plan_id),
  KEY idx_obj_creador (creado_por_usuario_id),
  CONSTRAINT fk_obj_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_obj_creador
    FOREIGN KEY (creado_por_usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Coach ↔ Colaborador (asignaciones)
CREATE TABLE IF NOT EXISTS coach_colaborador (
  id INT NOT NULL AUTO_INCREMENT,
  coach_usuario_id INT NOT NULL,
  colaborador_usuario_id INT NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_coach_colab_activo (coach_usuario_id, colaborador_usuario_id, activo),
  KEY idx_cc_coach (coach_usuario_id),
  KEY idx_cc_colab (colaborador_usuario_id),
  CONSTRAINT fk_cc_coach
    FOREIGN KEY (coach_usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cc_colab
    FOREIGN KEY (colaborador_usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Metas del colaborador
CREATE TABLE IF NOT EXISTS metas_personales (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  plan_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descripcion TEXT,
  fecha_objetivo DATE NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  progreso_pct INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_meta_usuario (usuario_id),
  KEY idx_meta_plan (plan_id),
  CONSTRAINT fk_meta_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_meta_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Cursos / certificaciones
CREATE TABLE IF NOT EXISTS cursos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(140) NOT NULL,
  proveedor VARCHAR(50) NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'curso', -- curso|certificacion
  descripcion TEXT,
  costo_estimado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  requiere_apoyo TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Inscripción / ejecución del curso por usuario
CREATE TABLE IF NOT EXISTS inscripciones_curso (
  id INT NOT NULL AUTO_INCREMENT,
  curso_id INT NOT NULL,
  usuario_id INT NOT NULL,
  plan_id INT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'inscrito', -- inscrito|en_progreso|completado|abandonado
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  horas_invertidas INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_insc_curso (curso_id),
  KEY idx_insc_usuario (usuario_id),
  KEY idx_insc_plan (plan_id),
  CONSTRAINT fk_insc_curso
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_insc_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_insc_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Certificados (HUd8)
CREATE TABLE IF NOT EXISTS certificados (
  id INT NOT NULL AUTO_INCREMENT,
  inscripcion_id INT NOT NULL,
  evidencia_id INT NULL,
  validado TINYINT(1) NOT NULL DEFAULT 0,
  validado_por_usuario_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cert_insc (inscripcion_id),
  CONSTRAINT fk_cert_insc
    FOREIGN KEY (inscripcion_id) REFERENCES inscripciones_curso(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cert_evid
    FOREIGN KEY (evidencia_id) REFERENCES evidencias(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_cert_validador
    FOREIGN KEY (validado_por_usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 4) GAMIFICACIÓN (insignias / logros / niveles y puntos)
-- =========================================================
CREATE TABLE IF NOT EXISTS insignias (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL,
  tipo VARCHAR(30) NOT NULL DEFAULT 'insignia', -- medalla|insignia|logro
  criterio TEXT,
  PRIMARY KEY (id),
  UNIQUE KEY uq_insignias_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuario_insignia (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  insignia_id INT NOT NULL,
  otorgada_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  motivo VARCHAR(120) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuario_insignia (usuario_id, insignia_id),
  CONSTRAINT fk_ui_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ui_insignia
    FOREIGN KEY (insignia_id) REFERENCES insignias(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Puntos totales por usuario (si quieres un solo registro por usuario)
CREATE TABLE IF NOT EXISTS puntuacion_total (
  usuario_id INT NOT NULL,
  puntos_total INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id),
  CONSTRAINT fk_pt_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 5) PRESUPUESTO DE FORMACIÓN (HUd4, HUd7, RNF1)
-- =========================================================
CREATE TABLE IF NOT EXISTS presupuestos_formacion (
  id INT NOT NULL AUTO_INCREMENT,
  plan_id INT NOT NULL,
  monto_asignado DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  monto_ejecutado DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pres_form_plan (plan_id),
  CONSTRAINT fk_pres_form_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gastos_formacion (
  id INT NOT NULL AUTO_INCREMENT,
  presupuesto_id INT NOT NULL,
  curso_id INT NOT NULL,
  usuario_id INT NOT NULL,
  costo DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- aprobado|pendiente|rechazado|pagado
  fecha DATE NULL,
  PRIMARY KEY (id),
  KEY idx_gf_pres (presupuesto_id),
  KEY idx_gf_curso (curso_id),
  KEY idx_gf_usuario (usuario_id),
  CONSTRAINT fk_gf_presupuesto
    FOREIGN KEY (presupuesto_id) REFERENCES presupuestos_formacion(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_gf_curso
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_gf_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 6) NOTIFICACIONES (HUch1, RNF4)
-- =========================================================
CREATE TABLE IF NOT EXISTS notificaciones (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  tipo VARCHAR(30) NOT NULL, -- vencimiento|logro|meta|info
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT,
  leida TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_usuario (usuario_id),
  CONSTRAINT fk_notif_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 7) FKs opcionales para conectar actividades/unidades al plan_carrera
-- (si ya tienes actividades/unidades con plan_id NULL, no rompe)
-- =========================================================
ALTER TABLE actividades
  ADD CONSTRAINT fk_actividades_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE unidades_retorno
  ADD CONSTRAINT fk_unidades_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Si quieres que actividades.plan_id y unidades.plan_id apunten a plan_carrera:
-- (ejecuta solo si planeas usar plan_id en esas tablas)
ALTER TABLE actividades
  ADD CONSTRAINT fk_actividades_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE unidades_retorno
  ADD CONSTRAINT fk_unidades_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE SET NULL ON UPDATE CASCADE;
