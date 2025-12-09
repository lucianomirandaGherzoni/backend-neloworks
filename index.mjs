// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rutasEmail from './src/rutas/emailRutas.js'; 
import rutasPago from './src/rutas/pagoRutas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Usamos el prefijo /api para las rutas
app.use('/api', rutasEmail);
app.use('/api', rutasPago);

app.get('/', (req, res) => {
  res.send('API Backend funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});