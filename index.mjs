// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rutasEmail from './src/rutas/emailRutas.js'; 
import rutasPago from './src/rutas/pagoRutas.js';
import rutasEnvio from './src/rutas/envioRutas.js';

dotenv.config();

// Validar variables de entorno requeridas para Correo Argentino
const VARS_REQUERIDAS_CORREO = [
  'CORREO_USER',
  'CORREO_PASSWORD',
  'CORREO_CUSTOMER_ID',
  'CORREO_API_URL',
  'CORREO_POSTAL_CODE_ORIGIN',
];
const varsAusentes = VARS_REQUERIDAS_CORREO.filter(v => !process.env[v]);
if (varsAusentes.length > 0) {
  console.warn(
    `[ADVERTENCIA] Variables de entorno de Correo Argentino no definidas: ${varsAusentes.join(', ')}.\n` +
    `Configurálas en el panel de Vercel → Settings → Environment Variables.`
  );
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Usamos el prefijo /api para las rutas
app.use('/api/envio', rutasEnvio);
app.use('/api', rutasEmail);
app.use('/api', rutasPago);

app.get('/', (req, res) => {
  res.send('API Backend funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});