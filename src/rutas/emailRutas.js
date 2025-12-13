// src/rutas/emailRutas.js
import { Router } from 'express';
import multer from 'multer';
import { enviarContacto, procesarPagoTransferencia, procesarVenta } from '../controladores/emailControlador.js';

const router = Router();

// Configuración de Multer: Guardar en memoria
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

router.post('/procesar-venta', procesarVenta);


router.post('/contacto', upload.single('archivo_adjunto'), enviarContacto);


router.post('/notificar-transferencia', upload.single('comprobante'), procesarPagoTransferencia);

export default router;