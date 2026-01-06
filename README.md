# VortexBird Application
Aplicación web para la gestión de actividades, usuarios y planes, desarrollada con arquitectura cliente-servidor.

## Descripción general

Problema que resuelve.

Junto con la universidad autonomá de Occidente y VortexBird se trabajo durante el curso de Ingenieria de Software una aplicación web que permitiera gestionar actividades, planes, usuarios y recompensas mediante la gamificación,
utilizando un frontend SPA y un backend basado en una API REST.
El sistema sigue una arquitectura cliente-servidor con separación clara entre frontend, backend y base de datos.


## Arquitectura

El proyecto utiliza una arquitectura cliente-servidor en capas:

- Frontend: SPA desarrollada en React
- Backend: API REST construida con Node.js y Express
- Base de datos: MySQL
- Contenerización: Docker (MySQL)





React (Frontend)
      |
      | HTTP / JSON
      v
Express API (Backend)
      |
      | SQL
      v
MySQL (Docker)


## Tecnologías usadas

- Frontend:
  - React
  - React Router
  - HTML / CSS / JavaScript

- Backend:
  - Node.js
  - Express
  - dotenv

- Base de datos:
  - MySQL 8.4 (Docker)

- Herramientas:
  - Docker & Docker Compose
  - npm


## Estructura del proyecto

VortexBirdApplication/
│
├── presentacion/     # Frontend React
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/           # Backend Express
│   ├── src/
│   ├── .env
│   └── package.json
│
├── db/               # Base de datos MySQL (Docker)
│   ├── docker-compose.yml
│   └── init/
│       └── vortex_bird.sql
│
└── README.md


## Base de datos (Docker)

cd db
docker compose up -d

## Backend

cd server
npm install
npm start


## Frontend

cd presentacion
npm install
npm start


## Variables de entorno

Crear un archivo `.env` en `server/` con:

DB_HOST=localhost
DB_PORT=3307
DB_NAME=vortex_bird
DB_USER=vortex_user
DB_PASSWORD=vortex_pass


## Estado del proyecto

Proyecto académico / portafolio.
En desarrollo.


Instalación y ejecución

Esta es la sección más importante.

Base de datos

## Autor

Miguel Ángel Jiménez Trochez 
Ingeniería Informática
