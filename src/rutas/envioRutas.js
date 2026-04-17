import { Router } from 'express';
import { calcularEnvio } from '../controladores/envioControlador.js';

const router = Router();

router.post('/cotizar', calcularEnvio);

export default router;