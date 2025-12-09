import { Router } from 'express';
import { crearPreferencia } from '../controladores/pagoControlador.js';

const router = Router();

router.post('/crear-preferencia', crearPreferencia);

export default router;