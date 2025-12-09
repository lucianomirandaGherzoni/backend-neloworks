// src/rutas/emailRutas.js
import { Router } from 'express';
import { procesarVenta, enviarContacto } from '../controladores/emailControlador.js';

const router = Router();

router.post('/procesar-venta', procesarVenta);
router.post('/contacto', enviarContacto);

export default router;