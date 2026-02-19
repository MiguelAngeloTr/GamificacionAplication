-- =========================================================
-- USUARIOS DE PRUEBA (directiva, coach, colaborador)
-- Requiere: usuarios, roles, usuario_rol
-- Nota DEV: contrasena en texto plano "123456"
-- =========================================================

-- 1) USUARIOS (3)
INSERT INTO usuarios (nombre, correo, contrasena)
VALUES
  ('Diana Directiva',  'directiva@test.com',   '123456'),
  ('Carlos Coach',     'coach@test.com',       '123456'),
  ('Laura Colaborador','colaborador@test.com', '123456')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  contrasena = VALUES(contrasena);

-- 2) ROLES
INSERT IGNORE INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'directiva'
WHERE u.correo = 'directiva@test.com';

INSERT IGNORE INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'coach'
WHERE u.correo = 'coach@test.com';

-- (Opcional) Si quieres que el coach también sea colaborador, deja esto:
-- INSERT IGNORE INTO usuario_rol (usuario_id, rol_id)
-- SELECT u.id, r.id
-- FROM usuarios u
-- JOIN roles r ON r.nombre = 'colaborador'
-- WHERE u.correo = 'coach@test.com';

INSERT IGNORE INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u
JOIN roles r ON r.nombre = 'colaborador'
WHERE u.correo = 'colaborador@test.com';

-- =========================================================
-- DATOS DE PRUEBA para los 3 usuarios:
--  - directiva@test.com
--  - coach@test.com
--  - colaborador@test.com
--
-- Requiere que YA existan y estén creadas:
-- usuarios, roles, usuario_rol, perfil, coach_colaborador,
-- plan_carrera, objetivos_estrategicos, metas_personales,
-- actividades, presupuestos, unidades_retorno, evidencias,
-- cursos, inscripciones_curso, certificados,
-- insignias, usuario_insignia, puntuaciones, puntuacion_total,
-- recompensas, presupuestos_formacion, gastos_formacion,
-- notificaciones
-- =========================================================

-- 0) IDs rápidos
SET @u_directiva := (SELECT id FROM usuarios WHERE correo='directiva@test.com' LIMIT 1);
SET @u_coach     := (SELECT id FROM usuarios WHERE correo='coach@test.com' LIMIT 1);
SET @u_colab     := (SELECT id FROM usuarios WHERE correo='colaborador@test.com' LIMIT 1);

-- =========================================================
-- 1) PERFIL (1:1)
-- =========================================================
INSERT INTO perfil (usuario_id, cedula, tipo_cedula, nombre, apellido, direccion, nacionalidad, telefono, foto, observacion)
VALUES
  (@u_directiva, 100000001, 'CC', 'Diana',  'Directiva',   'Cali', 'CO', '3000000001', NULL, 'Perfil de prueba'),
  (@u_coach,     100000002, 'CC', 'Carlos', 'Coach',       'Cali', 'CO', '3000000002', NULL, 'Perfil de prueba'),
  (@u_colab,     100000003, 'CC', 'Laura',  'Colaborador', 'Cali', 'CO', '3000000003', NULL, 'Perfil de prueba')
ON DUPLICATE KEY UPDATE
  cedula = VALUES(cedula),
  tipo_cedula = VALUES(tipo_cedula),
  nombre = VALUES(nombre),
  apellido = VALUES(apellido),
  direccion = VALUES(direccion),
  nacionalidad = VALUES(nacionalidad),
  telefono = VALUES(telefono),
  observacion = VALUES(observacion);

-- =========================================================
-- 2) COACH_COLABORADOR (coach -> muchos colaboradores)
-- =========================================================
INSERT INTO coach_colaborador (coach_usuario_id, colaborador_usuario_id, fecha_inicio, fecha_fin, activo)
VALUES
  (@u_coach, @u_colab, CURDATE(), NULL, 1);

-- =========================================================
-- 3) PLAN_CARRERA
-- =========================================================
INSERT INTO plan_carrera (nombre, descripcion, fecha_inicio, fecha_fin, activo)
VALUES
  ('Plan Carrera - Laura', 'Plan de prueba para colaborador', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 1);

SET @plan_id := LAST_INSERT_ID();

-- =========================================================
-- 4) OBJETIVOS_ESTRATEGICOS (creado por directiva)
-- =========================================================
INSERT INTO objetivos_estrategicos (plan_id, creado_por_usuario_id, titulo, descripcion, activo)
VALUES
  (@plan_id, @u_directiva, 'Mejorar habilidades técnicas', 'Objetivo de prueba para el plan', 1);

SET @obj_id := LAST_INSERT_ID();

-- =========================================================
-- 5) METAS_PERSONALES (del colaborador dentro del plan)
-- =========================================================
INSERT INTO metas_personales (usuario_id, plan_id, titulo, descripcion, fecha_objetivo, estado, progreso_pct)
VALUES
  (@u_colab, @plan_id, 'Completar 1 curso de SQL', 'Meta de prueba', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'pendiente', 10);

SET @meta_id := LAST_INSERT_ID();

-- =========================================================
-- 6) ACTIVIDADES (del colaborador dentro del plan)
-- =========================================================
INSERT INTO actividades (nombre, estado, descripcion, fecha_inicio, fecha_final, tipo, archivo, usuario_id, plan_id)
VALUES
  ('Actividad 01 - Diagnóstico', 0, 'Actividad de prueba', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'tarea', NULL, @u_colab, @plan_id);

SET @act_id := LAST_INSERT_ID();

-- =========================================================
-- 7) PRESUPUESTOS (1:1 con actividad)
-- =========================================================
INSERT INTO presupuestos (costo, actividad_id)
VALUES (250000, @act_id);

-- =========================================================
-- 8) UNIDADES_RETORNO (del colaborador dentro del plan)
-- =========================================================
INSERT INTO unidades_retorno (nombre, objetivo, estado, archivo, descripcion, nota, fecha, usuario_id, plan_id)
VALUES
  ('Unidad 01 - Evidencias', 'Documentar avances', 0, NULL, 'Unidad de retorno de prueba', 'Sin nota', CURDATE(), @u_colab, @plan_id);

SET @unidad_id := LAST_INSERT_ID();

-- =========================================================
-- 9) EVIDENCIAS (asociada a actividad)
-- (cumple CHECK: actividad_id o unidad_id no puede ser NULL simultáneamente)
-- =========================================================
INSERT INTO evidencias (usuario_id, actividad_id, unidad_id, type, name, data)
VALUES
  (@u_colab, @act_id, NULL, 'text/plain', 'evidencia_actividad.txt', CAST('Evidencia de prueba - actividad' AS BINARY));

SET @evid_act_id := LAST_INSERT_ID();

-- Evidencia asociada a unidad
INSERT INTO evidencias (usuario_id, actividad_id, unidad_id, type, name, data)
VALUES
  (@u_colab, NULL, @unidad_id, 'text/plain', 'evidencia_unidad.txt', CAST('Evidencia de prueba - unidad' AS BINARY));

SET @evid_unidad_id := LAST_INSERT_ID();

-- =========================================================
-- 10) CURSOS
-- =========================================================
INSERT INTO cursos (nombre, proveedor, tipo, descripcion, costo_estimado, requiere_apoyo)
VALUES
  ('SQL Intermedio', 'Plataforma X', 'curso', 'Curso de prueba', 120000, 1);

SET @curso_id := LAST_INSERT_ID();

-- =========================================================
-- 11) INSCRIPCIONES_CURSO (del colaborador + plan)
-- =========================================================
INSERT INTO inscripciones_curso (curso_id, usuario_id, plan_id, estado, fecha_inicio, fecha_fin, horas_invertidas)
VALUES
  (@curso_id, @u_colab, @plan_id, 'en_progreso', CURDATE(), NULL, 5);

SET @insc_id := LAST_INSERT_ID();

-- =========================================================
-- 12) CERTIFICADOS (1:1 con inscripción, validado por coach)
-- =========================================================
INSERT INTO certificados (inscripcion_id, evidencia_id, validado, validado_por_usuario_id)
VALUES
  (@insc_id, @evid_act_id, 1, @u_coach);

-- =========================================================
-- 13) INSIGNIAS + USUARIO_INSIGNIA
-- =========================================================
INSERT INTO insignias (nombre, tipo, criterio)
VALUES ('Insignia SQL', 'insignia', 'Completar un curso de SQL')
ON DUPLICATE KEY UPDATE
  tipo = VALUES(tipo),
  criterio = VALUES(criterio);

SET @insignia_id := (SELECT id FROM insignias WHERE nombre='Insignia SQL' LIMIT 1);

INSERT IGNORE INTO usuario_insignia (usuario_id, insignia_id, motivo)
VALUES (@u_colab, @insignia_id, 'Prueba de otorgamiento');

-- =========================================================
-- 14) PUNTUACIONES + PUNTUACION_TOTAL
-- =========================================================
INSERT INTO puntuaciones (cantidad_puntos, usuario_id)
VALUES (50, @u_colab);

INSERT INTO puntuacion_total (usuario_id, puntos_total)
VALUES (@u_colab, 50)
ON DUPLICATE KEY UPDATE
  puntos_total = VALUES(puntos_total);

-- =========================================================
-- 15) RECOMPENSAS (0..1 por usuario)
-- =========================================================
INSERT INTO recompensas (usuario_id, flagTecnologia, flagLibros, flagGimnasio)
VALUES (@u_colab, 1, 1, 0)
ON DUPLICATE KEY UPDATE
  flagTecnologia = VALUES(flagTecnologia),
  flagLibros = VALUES(flagLibros),
  flagGimnasio = VALUES(flagGimnasio),
  updated_at = CURRENT_TIMESTAMP;

-- =========================================================
-- 16) PRESUPUESTOS_FORMACION + GASTOS_FORMACION
-- =========================================================
INSERT INTO presupuestos_formacion (plan_id, monto_asignado, monto_ejecutado)
VALUES (@plan_id, 1000000.00, 0.00)
ON DUPLICATE KEY UPDATE
  monto_asignado = VALUES(monto_asignado);

SET @pres_form_id := (SELECT id FROM presupuestos_formacion WHERE plan_id=@plan_id LIMIT 1);

INSERT INTO gastos_formacion (presupuesto_id, curso_id, usuario_id, costo, estado, fecha)
VALUES
  (@pres_form_id, @curso_id, @u_colab, 120000.00, 'aprobado', CURDATE());

-- =========================================================
-- 17) NOTIFICACIONES
-- =========================================================
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, leida)
VALUES
  (@u_colab, 'meta', 'Meta creada', 'Se creó una meta personal de prueba.', 0),
  (@u_coach, 'info', 'Nuevo colaborador asignado', 'Se te asignó un colaborador (prueba).', 0),
  (@u_directiva, 'info', 'Plan creado', 'Se creó un plan de carrera (prueba).', 0);


#Consulta para ver que usuarios tienen rol
select * from usuarios join usuario_rol on
    usuarios.id=usuario_rol.usuario_id where rol_id=3
         ;












