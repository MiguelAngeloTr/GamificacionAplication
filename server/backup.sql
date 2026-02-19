-- MySQL dump 10.13  Distrib 8.4.7, for Linux (x86_64)
--
-- Host: localhost    Database: vortex_bird
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actividades`
--

DROP TABLE IF EXISTS `actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0',
  `descripcion` varchar(300) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_final` date DEFAULT NULL,
  `tipo` varchar(45) NOT NULL,
  `archivo` longblob,
  `usuario_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_act_usuario` (`usuario_id`),
  KEY `idx_act_plan` (`plan_id`),
  CONSTRAINT `fk_act_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_act_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades`
--

LOCK TABLES `actividades` WRITE;
/*!40000 ALTER TABLE `actividades` DISABLE KEYS */;
INSERT INTO `actividades` VALUES (1,'Actividad 01 - Diagnóstico',0,'Actividad de prueba','2026-02-15','2026-02-22','tarea',NULL,3,1,'2026-02-15 12:22:14');
/*!40000 ALTER TABLE `actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificados`
--

DROP TABLE IF EXISTS `certificados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inscripcion_id` int NOT NULL,
  `evidencia_id` int DEFAULT NULL,
  `validado` tinyint(1) NOT NULL DEFAULT '0',
  `validado_por_usuario_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cert_inscripcion` (`inscripcion_id`),
  KEY `idx_cert_evidencia` (`evidencia_id`),
  KEY `idx_cert_validador` (`validado_por_usuario_id`),
  CONSTRAINT `fk_cert_evidencia` FOREIGN KEY (`evidencia_id`) REFERENCES `evidencias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_cert_inscripcion` FOREIGN KEY (`inscripcion_id`) REFERENCES `inscripciones_curso` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cert_validador` FOREIGN KEY (`validado_por_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificados`
--

LOCK TABLES `certificados` WRITE;
/*!40000 ALTER TABLE `certificados` DISABLE KEYS */;
INSERT INTO `certificados` VALUES (1,1,1,1,2,'2026-02-15 12:22:15');
/*!40000 ALTER TABLE `certificados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach_colaborador`
--

DROP TABLE IF EXISTS `coach_colaborador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coach_colaborador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `coach_usuario_id` int NOT NULL,
  `colaborador_usuario_id` int NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cc_activa` (`coach_usuario_id`,`colaborador_usuario_id`,`activo`),
  KEY `idx_cc_coach` (`coach_usuario_id`),
  KEY `idx_cc_colaborador` (`colaborador_usuario_id`),
  CONSTRAINT `fk_cc_coach_usuario` FOREIGN KEY (`coach_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cc_colaborador_usuario` FOREIGN KEY (`colaborador_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_colaborador`
--

LOCK TABLES `coach_colaborador` WRITE;
/*!40000 ALTER TABLE `coach_colaborador` DISABLE KEYS */;
INSERT INTO `coach_colaborador` VALUES (1,2,3,'2026-02-15',NULL,1,'2026-02-15 12:22:14');
/*!40000 ALTER TABLE `coach_colaborador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(140) NOT NULL,
  `proveedor` varchar(50) DEFAULT NULL,
  `tipo` varchar(20) NOT NULL,
  `descripcion` text,
  `costo_estimado` decimal(12,2) NOT NULL DEFAULT '0.00',
  `requiere_apoyo` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'SQL Intermedio','Plataforma X','curso','Curso de prueba',120000.00,1);
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidencias`
--

DROP TABLE IF EXISTS `evidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `actividad_id` int DEFAULT NULL,
  `unidad_id` int DEFAULT NULL,
  `type` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `data` longblob NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_evid_usuario` (`usuario_id`),
  KEY `idx_evid_actividad` (`actividad_id`),
  KEY `idx_evid_unidad` (`unidad_id`),
  CONSTRAINT `fk_evid_actividad` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_evid_unidad` FOREIGN KEY (`unidad_id`) REFERENCES `unidades_retorno` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_evid_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidencias`
--

LOCK TABLES `evidencias` WRITE;
/*!40000 ALTER TABLE `evidencias` DISABLE KEYS */;
INSERT INTO `evidencias` VALUES (1,3,1,NULL,'text/plain','evidencia_actividad.txt',_binary 'Evidencia de prueba - actividad','2026-02-15 12:22:14'),(2,3,NULL,1,'text/plain','evidencia_unidad.txt',_binary 'Evidencia de prueba - unidad','2026-02-15 12:22:15');
/*!40000 ALTER TABLE `evidencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos_formacion`
--

DROP TABLE IF EXISTS `gastos_formacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos_formacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `presupuesto_id` int NOT NULL,
  `curso_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `costo` decimal(12,2) NOT NULL DEFAULT '0.00',
  `estado` varchar(20) NOT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_gf_presupuesto` (`presupuesto_id`),
  KEY `idx_gf_curso` (`curso_id`),
  KEY `idx_gf_usuario` (`usuario_id`),
  CONSTRAINT `fk_gf_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_gf_presupuesto` FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos_formacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gf_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos_formacion`
--

LOCK TABLES `gastos_formacion` WRITE;
/*!40000 ALTER TABLE `gastos_formacion` DISABLE KEYS */;
INSERT INTO `gastos_formacion` VALUES (1,1,1,3,120000.00,'aprobado','2026-02-15');
/*!40000 ALTER TABLE `gastos_formacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones_curso`
--

DROP TABLE IF EXISTS `inscripciones_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones_curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `horas_invertidas` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_insc_curso` (`curso_id`),
  KEY `idx_insc_usuario` (`usuario_id`),
  KEY `idx_insc_plan` (`plan_id`),
  CONSTRAINT `fk_insc_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_insc_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_insc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones_curso`
--

LOCK TABLES `inscripciones_curso` WRITE;
/*!40000 ALTER TABLE `inscripciones_curso` DISABLE KEYS */;
INSERT INTO `inscripciones_curso` VALUES (1,1,3,1,'en_progreso','2026-02-15',NULL,5,'2026-02-15 12:22:15');
/*!40000 ALTER TABLE `inscripciones_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insignias`
--

DROP TABLE IF EXISTS `insignias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insignias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `criterio` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_insignias_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insignias`
--

LOCK TABLES `insignias` WRITE;
/*!40000 ALTER TABLE `insignias` DISABLE KEYS */;
INSERT INTO `insignias` VALUES (1,'Insignia SQL','insignia','Completar un curso de SQL');
/*!40000 ALTER TABLE `insignias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metas_personales`
--

DROP TABLE IF EXISTS `metas_personales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metas_personales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `descripcion` text,
  `fecha_objetivo` date DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  `progreso_pct` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_meta_usuario` (`usuario_id`),
  KEY `idx_meta_plan` (`plan_id`),
  CONSTRAINT `fk_meta_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_meta_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metas_personales`
--

LOCK TABLES `metas_personales` WRITE;
/*!40000 ALTER TABLE `metas_personales` DISABLE KEYS */;
INSERT INTO `metas_personales` VALUES (1,3,1,'Completar 1 curso de SQL','Meta de prueba','2026-03-17','pendiente',10,'2026-02-15 12:22:14');
/*!40000 ALTER TABLE `metas_personales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `mensaje` text,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_usuario` (`usuario_id`),
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,3,'meta','Meta creada','Se creó una meta personal de prueba.',0,'2026-02-15 12:22:16'),(2,2,'info','Nuevo colaborador asignado','Se te asignó un colaborador (prueba).',0,'2026-02-15 12:22:16'),(3,1,'info','Plan creado','Se creó un plan de carrera (prueba).',0,'2026-02-15 12:22:16');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objetivos_estrategicos`
--

DROP TABLE IF EXISTS `objetivos_estrategicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objetivos_estrategicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_id` int NOT NULL,
  `creado_por_usuario_id` int NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `descripcion` text,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_obj_plan` (`plan_id`),
  KEY `idx_obj_creador` (`creado_por_usuario_id`),
  CONSTRAINT `fk_obj_creador` FOREIGN KEY (`creado_por_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_obj_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objetivos_estrategicos`
--

LOCK TABLES `objetivos_estrategicos` WRITE;
/*!40000 ALTER TABLE `objetivos_estrategicos` DISABLE KEYS */;
INSERT INTO `objetivos_estrategicos` VALUES (1,1,1,'Mejorar habilidades técnicas','Objetivo de prueba para el plan',1,'2026-02-15 12:22:14');
/*!40000 ALTER TABLE `objetivos_estrategicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil` (
  `usuario_id` int NOT NULL,
  `cedula` int NOT NULL,
  `tipo_cedula` char(2) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `nacionalidad` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `foto` longblob,
  `observacion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `uq_perfil_cedula` (`cedula`),
  CONSTRAINT `fk_perfil_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
INSERT INTO `perfil` VALUES (1,100000001,'CC','Diana','Directiva','Cali','CO','3000000001',NULL,'Perfil de prueba'),(2,100000002,'CC','Carlos','Coach','Cali','CO','3000000002',NULL,'Perfil de prueba'),(3,100000003,'CC','Laura','Colaborador','Cali','CO','3000000003',NULL,'Perfil de prueba');
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_carrera`
--

DROP TABLE IF EXISTS `plan_carrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_carrera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `descripcion` text,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_carrera`
--

LOCK TABLES `plan_carrera` WRITE;
/*!40000 ALTER TABLE `plan_carrera` DISABLE KEYS */;
INSERT INTO `plan_carrera` VALUES (1,'Plan Carrera - Laura','Plan de prueba para colaborador','2026-02-15','2026-05-16',1);
/*!40000 ALTER TABLE `plan_carrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presupuestos`
--

DROP TABLE IF EXISTS `presupuestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuestos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `costo` double NOT NULL,
  `actividad_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_presupuesto_actividad` (`actividad_id`),
  CONSTRAINT `fk_presupuesto_actividad` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuestos`
--

LOCK TABLES `presupuestos` WRITE;
/*!40000 ALTER TABLE `presupuestos` DISABLE KEYS */;
INSERT INTO `presupuestos` VALUES (1,250000,1);
/*!40000 ALTER TABLE `presupuestos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presupuestos_formacion`
--

DROP TABLE IF EXISTS `presupuestos_formacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuestos_formacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_id` int NOT NULL,
  `monto_asignado` decimal(14,2) NOT NULL DEFAULT '0.00',
  `monto_ejecutado` decimal(14,2) NOT NULL DEFAULT '0.00',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pres_form_plan` (`plan_id`),
  CONSTRAINT `fk_pres_form_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuestos_formacion`
--

LOCK TABLES `presupuestos_formacion` WRITE;
/*!40000 ALTER TABLE `presupuestos_formacion` DISABLE KEYS */;
INSERT INTO `presupuestos_formacion` VALUES (1,1,1000000.00,0.00,'2026-02-15 12:22:15');
/*!40000 ALTER TABLE `presupuestos_formacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntuacion_total`
--

DROP TABLE IF EXISTS `puntuacion_total`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntuacion_total` (
  `usuario_id` int NOT NULL,
  `puntos_total` int NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `fk_pt_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntuacion_total`
--

LOCK TABLES `puntuacion_total` WRITE;
/*!40000 ALTER TABLE `puntuacion_total` DISABLE KEYS */;
INSERT INTO `puntuacion_total` VALUES (3,50,'2026-02-15 12:22:15');
/*!40000 ALTER TABLE `puntuacion_total` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntuaciones`
--

DROP TABLE IF EXISTS `puntuaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntuaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad_puntos` int NOT NULL,
  `usuario_id` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_puntuaciones_usuario` (`usuario_id`),
  CONSTRAINT `fk_puntuaciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntuaciones`
--

LOCK TABLES `puntuaciones` WRITE;
/*!40000 ALTER TABLE `puntuaciones` DISABLE KEYS */;
INSERT INTO `puntuaciones` VALUES (1,50,3,'2026-02-15 12:22:15');
/*!40000 ALTER TABLE `puntuaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recompensas`
--

DROP TABLE IF EXISTS `recompensas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recompensas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `flagTecnologia` tinyint(1) NOT NULL DEFAULT '0',
  `flagVideojuegos` tinyint(1) NOT NULL DEFAULT '0',
  `flagLibros` tinyint(1) NOT NULL DEFAULT '0',
  `flagGimnasio` tinyint(1) NOT NULL DEFAULT '0',
  `flagArte` tinyint(1) NOT NULL DEFAULT '0',
  `flagAlimentacion` tinyint(1) NOT NULL DEFAULT '0',
  `usuario_id` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_recompensas_usuario` (`usuario_id`),
  CONSTRAINT `fk_recompensas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recompensas`
--

LOCK TABLES `recompensas` WRITE;
/*!40000 ALTER TABLE `recompensas` DISABLE KEYS */;
INSERT INTO `recompensas` VALUES (1,1,0,1,0,0,0,3,'2026-02-15 12:22:15');
/*!40000 ALTER TABLE `recompensas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'coach'),(3,'colaborador'),(1,'directiva');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidades_retorno`
--

DROP TABLE IF EXISTS `unidades_retorno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidades_retorno` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `objetivo` varchar(45) NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '0',
  `archivo` longblob,
  `descripcion` varchar(300) DEFAULT NULL,
  `nota` varchar(300) DEFAULT NULL,
  `fecha` date NOT NULL,
  `usuario_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ur_usuario` (`usuario_id`),
  KEY `idx_ur_plan` (`plan_id`),
  CONSTRAINT `fk_ur_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ur_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades_retorno`
--

LOCK TABLES `unidades_retorno` WRITE;
/*!40000 ALTER TABLE `unidades_retorno` DISABLE KEYS */;
INSERT INTO `unidades_retorno` VALUES (1,'Unidad 01 - Evidencias','Documentar avances',0,NULL,'Unidad de retorno de prueba','Sin nota','2026-02-15',3,1,'2026-02-15 12:22:14');
/*!40000 ALTER TABLE `unidades_retorno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_insignia`
--

DROP TABLE IF EXISTS `usuario_insignia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_insignia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `insignia_id` int NOT NULL,
  `otorgada_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `motivo` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ui_usuario` (`usuario_id`),
  KEY `idx_ui_insignia` (`insignia_id`),
  CONSTRAINT `fk_ui_insignia` FOREIGN KEY (`insignia_id`) REFERENCES `insignias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ui_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_insignia`
--

LOCK TABLES `usuario_insignia` WRITE;
/*!40000 ALTER TABLE `usuario_insignia` DISABLE KEYS */;
INSERT INTO `usuario_insignia` VALUES (1,3,1,'2026-02-15 12:22:15','Prueba de otorgamiento');
/*!40000 ALTER TABLE `usuario_insignia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_rol`
--

DROP TABLE IF EXISTS `usuario_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_rol` (
  `usuario_id` int NOT NULL,
  `rol_id` int NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`,`rol_id`),
  KEY `idx_ur_rol` (`rol_id`),
  CONSTRAINT `fk_usuario_rol_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_rol_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_rol`
--

LOCK TABLES `usuario_rol` WRITE;
/*!40000 ALTER TABLE `usuario_rol` DISABLE KEYS */;
INSERT INTO `usuario_rol` VALUES (1,1,'2026-02-15 12:22:13'),(2,2,'2026-02-15 12:22:13'),(3,3,'2026-02-15 12:22:13');
/*!40000 ALTER TABLE `usuario_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Diana Directiva','directiva@test.com','$2b$10$aLNu84TP8tQz8wnmvoWBwORHEBbcLnFjIsk7P9tK4g6bAlDNt0W46','2026-02-15 12:22:13'),(2,'Carlos Coach','coach@test.com','$2b$10$dpNCvlSE99TtboGmgqvrdu1tEusIWNltoeWB56qzJs69GIDctlhza','2026-02-15 12:22:13'),(3,'Laura Colaborador','colaborador@test.com','$2b$10$sul1r3QPvLcUx.YspXgOMuOVve1kB4ukoe2NHBGIXb0x6Sg65bY8G','2026-02-15 12:22:13');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-18 21:37:01
