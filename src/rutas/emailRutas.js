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

// Ruta 1: Venta normal (JSON) - Sin archivos
router.post('/procesar-venta', procesarVenta);

// Ruta 2: Contacto - Imagen opcional
// El frontend debe usar name="archivo_adjunto" en el input file
router.post('/contacto', upload.single('archivo_adjunto'), enviarContacto);

// Ruta 3: Transferencia - Imagen obligatoria
// El frontend debe usar name="comprobante" en el input file
router.post('/notificar-transferencia', upload.single('comprobante'), procesarPagoTransferencia);

export default router;