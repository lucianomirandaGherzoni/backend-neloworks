import { Router } from 'express';
import { calcularEnvio, obtenerSucursales } from '../controladores/envioControlador.js';

const router = Router();

router.post('/cotizar', calcularEnvio);
router.get('/sucursales', obtenerSucursales);

export default router;