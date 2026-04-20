// src/controladores/emailControlador.js
import { resend, EMAIL_ADMIN } from '../configuracion/resend.js';
import { plantillaCliente, plantillaAdminVenta, plantillaContacto, plantillaTransferencia } from '../vistas/plantillasEmail.js';

// Escapa caracteres HTML para prevenir XSS en templates de email
const escHtml = (str) => {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

// --- CONTROLADOR 1: PROCESAR VENTA ---
export const procesarVenta = async (req, res) => {
    const { datosCliente, datosPedido, productos, totales, metodoPago, envio } = req.body;

    if (!datosCliente?.email || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: 'Datos de venta incompletos.' });
    }

    try {
        const productosHtml = productos.map(p => `
            <li style="margin-bottom: 5px; list-style: none;">
                <strong>${escHtml(p.nombre)}</strong> <br>
                <span style="font-size:12px; color:#555;">Cantidad: ${escHtml(p.cantidad)}</span> - $${escHtml(p.precio * p.cantidad)}
            </li>
        `).join('');

        const emailCliente = resend.emails.send({
            from: 'Nelo Works <info@neloworks.com>',
            to: datosCliente.email,
            subject: `Pedido Confirmado #${escHtml(datosPedido.codigoEnvio)}`,
            html: plantillaCliente(escHtml(datosCliente.nombre), escHtml(datosPedido.codigoEnvio), productosHtml, escHtml(totales.total), escHtml(datosCliente.direccion))
        });

        const emailAdmin = resend.emails.send({
            from: 'Nelo Works <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `Nueva Venta #${escHtml(datosPedido.codigoEnvio)} - ${escHtml(datosCliente.nombre)}`,
            html: plantillaAdminVenta(datosCliente, escHtml(datosPedido.codigoEnvio), productosHtml, escHtml(totales.total), escHtml(metodoPago), envio)
        });

        await Promise.all([emailCliente, emailAdmin]);
        res.json({ success: true, message: 'Correos enviados' });

    } catch (error) {
        console.error('Error en procesarVenta:', error);
        res.status(500).json({ error: 'Error al enviar los correos.' });
    }
};

// --- CONTROLADOR 2: CONTACTO ---
export const enviarContacto = async (req, res) => {
    const { nombre, email, message } = req.body;
    const archivo = req.file;

    if (!nombre || !email || !message) {
        return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios.' });
    }

    try {
        const attachments = archivo ? [{
            filename: archivo.originalname,
            content: archivo.buffer
        }] : [];

        await resend.emails.send({
            from: 'Nelo Web <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `Nuevo Mensaje de: ${escHtml(nombre)}`,
            reply_to: email,
            html: plantillaContacto(escHtml(nombre), escHtml(email), escHtml(message)),
            attachments,
        });

        res.json({ success: true });

    } catch (error) {
        console.error('Error en enviarContacto:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
};

// --- CONTROLADOR 3: TRANSFERENCIA ---
export const procesarPagoTransferencia = async (req, res) => {
    const { nombre, email, telefono, total, pedido } = req.body;
    const archivo = req.file;

    if (!archivo) {
        return res.status(400).json({ error: 'Es obligatorio subir el comprobante.' });
    }

    if (!nombre || !email || !pedido) {
        return res.status(400).json({ error: 'Datos del pedido incompletos.' });
    }

    try {
        await resend.emails.send({
            from: 'Nelo Pagos <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `Comprobante Transferencia - Pedido #${escHtml(pedido)}`,
            html: plantillaTransferencia(escHtml(nombre), escHtml(email), escHtml(telefono), escHtml(total), escHtml(pedido)),
            attachments: [{
                filename: archivo.originalname,
                content: archivo.buffer
            }]
        });

        res.json({ success: true });

    } catch (error) {
        console.error('Error en procesarPagoTransferencia:', error);
        res.status(500).json({ error: 'Error al procesar el comprobante.' });
    }
};