import express from 'express'
import dotenv from 'dotenv';
import routes from '../acceso_datos/routes.js'
import cors from 'cors';
import path from 'path';
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'


// Para manejar las variables de entorno env

// al inicio del archivo

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

app.use((req, _res, next) => {
  console.log("REQ:", req.method, req.originalUrl);
  next();
});
app.use("/api", routes);


//procesar datos provenientes del cliente

console.log("BOOT DEBUG BACKEND:", new Date().toISOString(), "PID:", process.pid);


//puerto de escucha
app.listen(process.env.PORT, () => {
  console.log("servidor corriendo en puerto ", process.env.PORT);
});