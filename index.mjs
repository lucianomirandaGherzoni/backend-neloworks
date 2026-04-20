// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
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

// --- CORS restringido a orígenes conocidos ---
const ORIGENES_PERMITIDOS = [
  'https://neloworks.com',
  'https://www.neloworks.com',
  'http://localhost:5173',
  'http://localhost:3000',
];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, server-to-server)
    if (!origin || ORIGENES_PERMITIDOS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS: origen no permitido'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Límite de tamaño en body JSON (previene DoS) ---
app.use(express.json({ limit: '1mb' }));

// --- Rate limiting general ---
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});

// --- Rate limiting estricto para rutas costosas (APIs externas) ---
const limiterAPIs = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' },
});

app.use(limiterGeneral);

// Usamos el prefijo /api para las rutas
app.use('/api/envio', limiterAPIs, rutasEnvio);
app.use('/api', limiterAPIs, rutasEmail);
app.use('/api', limiterAPIs, rutasPago);

app.get('/', (req, res) => {
  res.send('API Backend funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});