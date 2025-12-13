// src/controladores/emailControlador.js
import { resend, EMAIL_ADMIN } from '../configuracion/resend.js';
import { plantillaCliente, plantillaAdminVenta, plantillaContacto } from '../vistas/plantillasEmail.js';

export const procesarVenta = async (req, res) => {
    try {
        let datos;

        // CASO A: Transferencia (Viene con archivo y datos en string dentro de 'datosVenta')
        if (req.file && req.body.datosVenta) {
            datos = JSON.parse(req.body.datosVenta);
        }
        // CASO B: Mercado Pago (Viene como JSON directo en el body)
        else {
            datos = req.body;
        }

        const { datosCliente, datosPedido, productos, totales, metodoPago } = datos;
        const archivo = req.file; // Si hay comprobante, estará aquí

        // 1. Generamos el HTML de los productos
        const productosHtml = productos.map(p => `
            <li style="margin-bottom: 5px; list-style: none;">
                <strong>${p.nombre}</strong> <br>
                <span style="font-size:12px; color:#555;">Cantidad: ${p.cantidad}</span> - $${p.precio * p.cantidad}
            </li>
        `).join('');

        // 2. Preparamos adjuntos (Solo si hay archivo)
        const attachments = archivo ? [{
            filename: archivo.originalname,
            content: archivo.buffer
        }] : [];

        // 3. Email al CLIENTE (Sin adjunto, solo confirmación)
        const emailCliente = resend.emails.send({
            from: 'Nelo Works <info@neloworks.com>',
            to: datosCliente.email,
            subject: `Pedido Confirmado #${datosPedido.codigoEnvio}`,
            html: plantillaCliente(datosCliente.nombre, datosPedido.codigoEnvio, productosHtml, totales.total, datosCliente.direccion)
        });

        // 4. Email al ADMIN (Con el comprobante adjunto si existe)
        const emailAdmin = resend.emails.send({
            from: 'Nelo Works <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `💰 Nueva Venta #${datosPedido.codigoEnvio} - ${datosCliente.nombre}`,
            html: plantillaAdminVenta(datosCliente, datosPedido.codigoEnvio, productosHtml, totales.total, metodoPago),
            attachments: attachments // <---  LA FOTO DEL COMPROBANTE
        });

        await Promise.all([emailCliente, emailAdmin]);
        res.json({ success: true, message: 'Venta procesada y correos enviados' });

    } catch (error) {
        console.error(' Error en procesarVenta:', error);
        res.status(500).json({ error: error.message });
    }
};

// ... (El resto de controladores como enviarContacto siguen igual)
export const enviarContacto = async (req, res) => { /* ... */ };