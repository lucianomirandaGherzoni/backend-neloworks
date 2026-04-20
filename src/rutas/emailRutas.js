// src/rutas/emailRutas.js
import { Router } from 'express';
import multer from 'multer';
import { enviarContacto, procesarPagoTransferencia, procesarVenta } from '../controladores/emailControlador.js';

const router = Router();

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];

const fileFilter = (req, file, cb) => {
    if (TIPOS_PERMITIDOS.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo JPG, PNG, GIF o PDF.'), false);
    }
};

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Ruta 1: Venta normal (JSON) - Sin archivos
router.post('/procesar-venta', procesarVenta);

// Ruta 2: Contacto - Imagen opcional
router.post('/contacto', upload.single('archivo_adjunto'), enviarContacto);

// Ruta 3: Transferencia - Imagen obligatoria
router.post('/notificar-transferencia', upload.single('comprobante'), procesarPagoTransferencia);

export default router;