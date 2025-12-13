// src/controladores/emailControlador.js
import { resend, EMAIL_ADMIN } from '../configuracion/resend.js';
import { plantillaCliente, plantillaAdminVenta, plantillaContacto } from '../vistas/plantillasEmail.js';

// --- CONTROLADOR 1: PROCESAR VENTA (Sin cambios en lógica, solo plantilla mejorada) ---
export const procesarVenta = async (req, res) => {
    const { datosCliente, datosPedido, productos, totales, metodoPago } = req.body;

    try {
        const productosHtml = productos.map(p => `
            <li style="margin-bottom: 5px; list-style: none;">
                <strong>${p.nombre}</strong> <br>
                <span style="font-size:12px; color:#555;">Cantidad: ${p.cantidad}</span> - $${p.precio * p.cantidad}
            </li>
        `).join('');

        const emailCliente = resend.emails.send({
            from: 'Nelo Works <info@neloworks.com>',
            to: datosCliente.email,
            subject: `Pedido Confirmado #${datosPedido.codigoEnvio}`,
            html: plantillaCliente(datosCliente.nombre, datosPedido.codigoEnvio, productosHtml, totales.total, datosCliente.direccion)
        });

        const emailAdmin = resend.emails.send({
            from: 'Nelo Works <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `💰 Nueva Venta #${datosPedido.codigoEnvio} - ${datosCliente.nombre}`,
            html: plantillaAdminVenta(datosCliente, datosPedido.codigoEnvio, productosHtml, totales.total, metodoPago)
        });

        await Promise.all([emailCliente, emailAdmin]);
        res.json({ success: true, message: 'Correos enviados' });

    } catch (error) {
        console.error('❌ Error en procesarVenta:', error);
        res.status(500).json({ error: error.message });
    }
};

// --- CONTROLADOR 2: CONTACTO (CON IMAGEN DE DISEÑO) ---
export const enviarContacto = async (req, res) => {
    // Multer pone los campos de texto en req.body y el archivo en req.file
    const { nombre, email, message } = req.body;
    const archivo = req.file; 

    try {
        // Preparamos los adjuntos dinámicamente
        const attachments = archivo ? [{
            filename: archivo.originalname,
            content: archivo.buffer
        }] : [];

        await resend.emails.send({
            from: 'Nelo Web <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `📩 Nuevo Mensaje de: ${nombre}`,
            reply_to: email,
            html: plantillaContacto(nombre, email, message),
            attachments: attachments // <--- Aquí va la imagen del diseño
        });

        console.log(`✅ Contacto recibido de: ${nombre} (Adjunto: ${archivo ? 'Sí' : 'No'})`);
        res.json({ success: true });

    } catch (error) {
        console.error('❌ Error en enviarContacto:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
};

// --- CONTROLADOR 3: TRANSFERENCIA (CON COMPROBANTE) ---
export const procesarPagoTransferencia = async (req, res) => {
    const { nombre, email, total, pedido } = req.body;
    const archivo = req.file;

    if (!archivo) {
        return res.status(400).json({ error: 'Es obligatorio subir el comprobante.' });
    }

    try {
        await resend.emails.send({
            from: 'Nelo Pagos <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `💸 Comprobante Transferencia - Pedido #${pedido}`,
            html: `
                <h1>Se ha reportado un nuevo pago</h1>
                <p><strong>Cliente:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Monto Total:</strong> $${total}</p>
                <p><strong>ID Pedido:</strong> ${pedido}</p>
                <hr />
                <p>El comprobante está adjunto a este correo para su verificación.</p>
            `,
            attachments: [{
                filename: archivo.originalname,
                content: archivo.buffer
            }]
        });

        console.log(`✅ Comprobante recibido para pedido: ${pedido}`);
        res.json({ success: true });

    } catch (error) {
        console.error('❌ Error en procesarPagoTransferencia:', error);
        res.status(500).json({ error: error.message });
    }
};