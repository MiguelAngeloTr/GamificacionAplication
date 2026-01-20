import express from 'express'
import dotenv from 'dotenv';
import routes from '../src/acceso_datos/routes.js'
import {createPool} from 'mysql2/promise'
import cors from 'cors';
import path from 'path';
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'


// Para manejar las variables de entorno env
dotenv.config()

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors( {
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dbimages')))

app.use(cookieParser())
app.use("/api", routes);


export const pool = createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

})



//procesar datos provenientes del cliente


//puerto de escucha
app.listen(process.env.PORT)
console.log("servidor corriendo en puerto ", process.env.PORT);