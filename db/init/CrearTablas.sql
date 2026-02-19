-- =========================================================
-- VORTEX_BIRD - ORDEN DE CREACIÓN (sin problemas de FK)
-- MySQL 8.x (utf8mb4_0900_ai_ci)
-- Incluye: asignación Coach -> Colaboradores (coach_colaborador)
-- =========================================================

CREATE DATABASE IF NOT EXISTS vortex_bird
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE vortex_bird;

-- =========================================================
-- 1) TABLAS BASE (sin FK hacia otras): roles, usuarios, cursos, insignias, plan_carrera
-- =========================================================

CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  correo VARCHAR(45) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cursos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(140) NOT NULL,
  proveedor VARCHAR(50) NULL,
  tipo VARCHAR(20) NOT NULL,
  descripcion TEXT NULL,
  costo_estimado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  requiere_apoyo TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS insignias (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  criterio TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_insignias_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS plan_carrera (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL,
  descripcion TEXT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- (Opcional) roles base
INSERT IGNORE INTO roles (id, nombre) VALUES
  (1, 'directiva'),
  (2, 'coach'),
  (3, 'colaborador');

-- =========================================================
-- 2) TABLAS QUE REFERENCIAN BASE: usuario_rol, perfil, coach_colaborador
-- (todas dependen de usuarios / roles)
-- =========================================================

CREATE TABLE IF NOT EXISTS usuario_rol (
  usuario_id INT NOT NULL,
  rol_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, rol_id),
  KEY idx_ur_rol (rol_id),
  CONSTRAINT fk_usuario_rol_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_rol_rol
    FOREIGN KEY (rol_id) REFERENCES roles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS perfil (
  usuario_id INT NOT NULL,
  cedula INT NOT NULL,
  tipo_cedula CHAR(2) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  direccion VARCHAR(45) NULL,
  nacionalidad VARCHAR(45) NULL,
  telefono VARCHAR(45) NULL,
  foto LONGBLOB NULL,
  observacion VARCHAR(45) NULL,
  PRIMARY KEY (usuario_id),
  UNIQUE KEY uq_perfil_cedula (cedula),
  CONSTRAINT fk_perfil_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coach_colaborador (
  id INT NOT NULL AUTO_INCREMENT,
  coach_usuario_id INT NOT NULL,
  colaborador_usuario_id INT NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cc_coach (coach_usuario_id),
  KEY idx_cc_colaborador (colaborador_usuario_id),
  UNIQUE KEY uq_cc_activa (coach_usuario_id, colaborador_usuario_id, activo),
  CONSTRAINT fk_cc_coach_usuario
    FOREIGN KEY (coach_usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cc_colaborador_usuario
    FOREIGN KEY (colaborador_usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 3) TABLAS DEL PLAN (dependen de plan_carrera y/o usuarios):
-- objetivos_estrategicos, metas_personales
-- =========================================================

CREATE TABLE IF NOT EXISTS objetivos_estrategicos (
  id INT NOT NULL AUTO_INCREMENT,
  plan_id INT NOT NULL,
  creado_por_usuario_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE IF NOT EXISTS metas_personales (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  plan_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  fecha_objetivo DATE NULL,
  estado VARCHAR(20) NOT NULL,
  progreso_pct INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- =========================================================
-- 4) TABLAS OPERATIVAS del plan:
-- actividades, unidades_retorno, presupuestos (depende de actividades)
-- =========================================================

CREATE TABLE IF NOT EXISTS actividades (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 0,
  descripcion VARCHAR(300) NULL,
  fecha_inicio DATE NOT NULL,
  fecha_final DATE NULL,
  tipo VARCHAR(45) NOT NULL,
  archivo LONGBLOB NULL,
  usuario_id INT NOT NULL,
  plan_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_act_usuario (usuario_id),
  KEY idx_act_plan (plan_id),
  CONSTRAINT fk_act_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_act_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS unidades_retorno (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  objetivo VARCHAR(45) NOT NULL,
  estado TINYINT NOT NULL DEFAULT 0,
  archivo LONGBLOB NULL,
  descripcion VARCHAR(300) NULL,
  nota VARCHAR(300) NULL,
  fecha DATE NOT NULL,
  usuario_id INT NOT NULL,
  plan_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ur_usuario (usuario_id),
  KEY idx_ur_plan (plan_id),
  CONSTRAINT fk_ur_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ur_plan
    FOREIGN KEY (plan_id) REFERENCES plan_carrera(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS presupuestos (
  id INT NOT NULL AUTO_INCREMENT,
  costo DOUBLE NOT NULL,
  actividad_id INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_presupuesto_actividad (actividad_id),
  CONSTRAINT fk_presupuesto_actividad
    FOREIGN KEY (actividad_id) REFERENCES actividades(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 5) EVIDENCIAS (depende de usuarios + actividades/unidades)
-- =========================================================
CREATE TABLE IF NOT EXISTS evidencias (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  actividad_id INT NULL,
  unidad_id INT NULL,
  type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  data LONGBLOB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_evid_usuario (usuario_id),
  KEY idx_evid_actividad (actividad_id),
  KEY idx_evid_unidad (unidad_id),
  CONSTRAINT fk_evid_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_evid_actividad
    FOREIGN KEY (actividad_id) REFERENCES actividades(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_evid_unidad
    FOREIGN KEY (unidad_id) REFERENCES unidades_retorno(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 6) CURSOS / INSCRIPCIONES / CERTIFICADOS (depende de cursos/usuarios/plan/evidencias)
-- =========================================================

CREATE TABLE IF NOT EXISTS inscripciones_curso (
  id INT NOT NULL AUTO_INCREMENT,
  curso_id INT NOT NULL,
  usuario_id INT NOT NULL,
  plan_id INT NOT NULL,
  estado VARCHAR(20) NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  horas_invertidas INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE IF NOT EXISTS certificados (
  id INT NOT NULL AUTO_INCREMENT,
  inscripcion_id INT NOT NULL,
  evidencia_id INT NULL,
  validado TINYINT(1) NOT NULL DEFAULT 0,
  validado_por_usuario_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cert_inscripcion (inscripcion_id),
  KEY idx_cert_evidencia (evidencia_id),
  KEY idx_cert_validador (validado_por_usuario_id),
  CONSTRAINT fk_cert_inscripcion
    FOREIGN KEY (inscripcion_id) REFERENCES inscripciones_curso(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cert_evidencia
    FOREIGN KEY (evidencia_id) REFERENCES evidencias(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_cert_validador
    FOREIGN KEY (validado_por_usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 7) GAMIFICACIÓN (depende de usuarios / insignias)
-- =========================================================

CREATE TABLE IF NOT EXISTS usuario_insignia (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  insignia_id INT NOT NULL,
  otorgada_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  motivo VARCHAR(120) NULL,
  PRIMARY KEY (id),
  KEY idx_ui_usuario (usuario_id),
  KEY idx_ui_insignia (insignia_id),
  CONSTRAINT fk_ui_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ui_insignia
    FOREIGN KEY (insignia_id) REFERENCES insignias(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS puntuaciones (
  id INT NOT NULL AUTO_INCREMENT,
  cantidad_puntos INT NOT NULL,
  usuario_id INT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_puntuaciones_usuario (usuario_id),
  CONSTRAINT fk_puntuaciones_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS puntuacion_total (
  usuario_id INT NOT NULL,
  puntos_total INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id),
  CONSTRAINT fk_pt_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recompensas (
  id INT NOT NULL AUTO_INCREMENT,
  flagTecnologia TINYINT(1) NOT NULL DEFAULT 0,
  flagVideojuegos TINYINT(1) NOT NULL DEFAULT 0,
  flagLibros TINYINT(1) NOT NULL DEFAULT 0,
  flagGimnasio TINYINT(1) NOT NULL DEFAULT 0,
  flagArte TINYINT(1) NOT NULL DEFAULT 0,
  flagAlimentacion TINYINT(1) NOT NULL DEFAULT 0,
  usuario_id INT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_recompensas_usuario (usuario_id),
  CONSTRAINT fk_recompensas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- 8) PRESUPUESTO FORMACIÓN (depende de plan_carrera / cursos / usuarios)
-- =========================================================

CREATE TABLE IF NOT EXISTS presupuestos_formacion (
  id INT NOT NULL AUTO_INCREMENT,
  plan_id INT NOT NULL,
  monto_asignado DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  monto_ejecutado DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  estado VARCHAR(20) NOT NULL,
  fecha DATE NULL,
  PRIMARY KEY (id),
  KEY idx_gf_presupuesto (presupuesto_id),
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
-- 9) NOTIFICACIONES (depende de usuarios)
-- =========================================================

CREATE TABLE IF NOT EXISTS notificaciones (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NULL,
  leida TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_usuario (usuario_id),
  CONSTRAINT fk_notif_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
