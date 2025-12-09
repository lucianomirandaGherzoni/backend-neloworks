// src/controladores/emailControlador.js
import { resend, EMAIL_ADMIN } from '../configuracion/resend.js';
import { plantillaCliente, plantillaAdminVenta, plantillaContacto } from '../vistas/plantillasEmail.js';

// Controlador para procesar ventas
export const procesarVenta = async (req, res) => {
    const { datosCliente, datosPedido, productos, totales, metodoPago } = req.body;

    try {

        console.log('Intentando enviar email a:', EMAIL_ADMIN);

        const productosHtml = productos.map(p => `
      <li style="margin-bottom: 5px;">
        <strong>${p.nombre}</strong> x${p.cantidad} - $${p.precio * p.cantidad}
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
            subject: `Venta #${datosPedido.codigoEnvio} - ${datosCliente.nombre}`,
            html: plantillaAdminVenta(datosCliente, datosPedido.codigoEnvio, productosHtml, totales.total, metodoPago)
        });

        await Promise.all([emailCliente, emailAdmin]);

        console.log(`✅ Venta procesada: ${datosPedido.codigoEnvio}`);
        res.json({ success: true, message: 'Correos enviados' });

    } catch (error) {
        console.error('❌ Error en procesarVenta:', error);
        res.status(500).json({ error: error.message });
    }
};

// Controlador para contacto
export const enviarContacto = async (req, res) => {

    const { nombre, email, phone, message } = req.body;

    try {

        console.log('Intentando enviar email a:', EMAIL_ADMIN);
        await resend.emails.send({
            from: 'Nelo Works <info@neloworks.com>',
            to: EMAIL_ADMIN,
            subject: `Nuevo mensaje de ${nombre}`,
            reply_to: email,
            html: plantillaContacto(nombre, email, phone, message)
        });

        console.log(`✅ Contacto recibido de: ${nombre}`);
        res.json({ success: true });

    } catch (error) {
        console.error('❌ Error en enviarContacto:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
};