// src/vistas/plantillasEmail.js

const WEB_URL = "https://neloworks.com";
// Asegúrate de usar una imagen real alojada, si usas localhost no se verá en producción
const LOGO_URL = "https://neloworks.com/img/logo.webp"; 

const c = {
    negro: '#000000',
    blanco: '#FEFEFE',
    amarillo: '#faf602',
    rojo: '#ED3237',
    oscuro: '#201E1E',
    gris: '#7b7878'
};

// ESTILOS CSS INLINE (A prueba de Dark Mode)
const estilos = {
    // Forzamos el color de fondo y de texto explícitamente para que no se inviertan
    container: `background-color: ${c.oscuro}; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%;`,
    card: `max-width: 600px; margin: 0 auto; background-color: ${c.blanco}; color: ${c.negro}; border-radius: 4px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);`,
    header: `background-color: ${c.negro}; padding: 30px 20px; text-align: center; border-bottom: 6px solid ${c.amarillo};`,
    body: `padding: 40px 30px; color: ${c.oscuro}; line-height: 1.6; background-color: ${c.blanco};`, // Fondo blanco explícito
    footer: `text-align: center; padding: 30px 20px; font-size: 12px; color: ${c.gris};`,
    h1: `margin-top: 0; color: ${c.negro}; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px;`,
    label: `display: block; font-size: 11px; color: ${c.gris}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;`,
    data: `font-size: 16px; color: ${c.negro}; margin: 0; font-weight: 500;`,
    totalBox: `background-color: ${c.negro}; color: ${c.blanco}; padding: 15px; text-align: right; font-weight: 800; font-size: 22px; margin-top: 20px; border-radius: 4px; letter-spacing: 1px;`,
    btnLink: `background-color: ${c.negro}; color: ${c.amarillo}; padding: 12px 24px; text-decoration: none; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 12px; border-radius: 10px; margin-top: 10px;`
};

const logoHtml = `
  <a href="${WEB_URL}" target="_blank" style="text-decoration: none;">
    <img src="${LOGO_URL}" alt="Nelo Works" style="max-height: 50px; display: block; margin: 0 auto; border: 0; outline: none; text-decoration: none;" />
  </a>
`;

// --- HELPER PARA EVITAR MODO OSCURO FORZADO ---
// Esto envuelve tu contenido en un HTML que le dice a Gmail/Outlook: "Respeta mis colores"
const envolverHTML = (contenido) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <style>
      /* Forzar esquema de color light */
      :root { color-scheme: light only; }
      body { background-color: ${c.oscuro} !important; margin: 0; padding: 0; }
    </style>
</head>
<body style="background-color: ${c.oscuro}; margin: 0; padding: 0;">
    ${contenido}
</body>
</html>
`;

// 1. PLANTILLA CLIENTE
export const plantillaCliente = (nombre, codigo, productosHtml, total, direccion) => envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
        ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h1 style="${estilos.h1}">¡Gracias por tu compra!</h1>
        <p style="margin-bottom: 30px; color: ${c.gris};">Hola <strong>${nombre}</strong>, tu pedido ha sido confirmado correctamente.</p>
        
        <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
          <tr>
            <td style="padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <span style="${estilos.label}">Nº de Pedido</span>
              <p style="${estilos.data}">#${codigo}</p>
            </td>
            <td style="padding-bottom: 20px; border-bottom: 1px solid #eee; text-align: right;">
              <span style="${estilos.label}">Fecha</span>
              <p style="${estilos.data}">${new Date().toLocaleDateString()}</p>
            </td>
          </tr>
        </table>

        <h3 style="font-size: 14px; text-transform: uppercase; border-bottom: 2px solid ${c.negro}; padding-bottom: 10px; margin-bottom: 15px;">Detalle del Pedido</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${productosHtml}
        </table>

        <div style="${estilos.totalBox}">
           TOTAL: $${total}
        </div>

        <div style="margin-top: 30px; margin-bottom: 30px;">
          <span style="${estilos.label}">Dirección de envío</span>
          <p style="${estilos.data}">${direccion}</p>
        </div>

        <div style="text-align: center; border-top: 1px dashed ${c.gris}; padding-top: 30px;">
            <p style="margin-bottom: 10px; font-size: 14px;">¿Quieres seguir viendo productos?</p>
            <a href="${WEB_URL}" style="${estilos.btnLink}">Ir a Neloworks.com</a>
        </div>
      </div>
    </div>
    <div style="${estilos.footer}">
      <p style="margin: 0;">© ${new Date().getFullYear()} Nelo Works.</p>
    </div>
  </div>
`);

// 2. PLANTILLA ADMIN
export const plantillaAdminVenta = (cliente, codigo, productosHtml, total, metodoPago, envio) => {
  // Armar bloque de envío
  const costoEnvioTexto = envio?.costo ? `$${envio.costo}` : 'Gratis'
  let detalleEnvioHtml = ''
  if (envio?.esSucursal && envio?.sucursalNombre) {
    detalleEnvioHtml = `
      <tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Tipo</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">Entrega en Sucursal Correo Argentino</p></td></tr>
      <tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Sucursal</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">${envio.sucursalNombre}</p></td></tr>
      ${envio.sucursalDireccion ? `<tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Dirección Sucursal</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">${envio.sucursalDireccion}</p></td></tr>` : ''}
      ${envio.codigoPostal ? `<tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">CP Destino</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">${envio.codigoPostal}</p></td></tr>` : ''}
    `
  } else if (envio?.direccionDomicilio) {
    detalleEnvioHtml = `
      <tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Tipo</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">Envío a Domicilio (Correo Argentino)</p></td></tr>
      <tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Dirección</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">${envio.direccionDomicilio}</p></td></tr>
    `
  } else {
    detalleEnvioHtml = `<tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Tipo</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">Retiro en Local</p></td></tr>`
  }

  return envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
         ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h2 style="${estilos.h1}">Nueva Venta</h2>
        <table style="width: 100%; margin-bottom: 20px; margin-top: 20px;">
          <tr>
            <td>
               <span style="${estilos.label}">Cliente</span>
               <p style="${estilos.data}">${cliente.nombre} ${cliente.apellido}</p>
            </td>
            <td style="text-align: right;">
               <span style="${estilos.label}">Pago</span>
               <span style="background-color: ${c.negro}; color: ${c.amarillo}; padding: 4px 8px; font-weight: bold; font-size: 12px; text-transform: uppercase;">${metodoPago}</span>
            </td>
          </tr>
        </table>
        <div style="background-color: ${c.negro}; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: ${c.blanco};"><strong>Contacto:</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: ${c.blanco};">${cliente.email} | ${cliente.telefono}</p>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; border-bottom: 2px solid ${c.negro}; padding-bottom: 8px; margin-bottom: 12px; color: ${c.negro};">Datos de Envío</h3>
        <div style="background-color: ${c.negro}; padding: 15px; margin-bottom: 20px; border-radius: 4px; color: ${c.blanco};">
          <table style="width: 100%;">
            <tr><td style="padding: 4px 0;"><span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Servicio</span><p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">${envio?.metodoNombre || 'Sin especificar'} — ${costoEnvioTexto}</p></td></tr>
            ${detalleEnvioHtml}
          </table>
        </div>

        <hr style="border: 0; border-top: 1px dashed ${c.gris}; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${productosHtml}
        </table>
        <div style="${estilos.totalBox}">
          TOTAL: $${total}
        </div>
      </div>
    </div>
  </div>
`)};

// 3. PLANTILLA CONTACTO (Sin teléfono)
export const plantillaContacto = (nombre, email, mensaje) => envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
         ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h2 style="${estilos.h1}">Nuevo Mensaje</h2>
        <div style="background-color: ${c.negro}; padding: 15px; margin-bottom: 20px; margin-top: 20px; border-radius: 4px;">
           <span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Remitente</span>
           <p style="font-size: 16px; color: ${c.blanco}; margin: 0; font-weight: 500;">${nombre}</p>
           <p style="color: #aaa; margin: 4px 0 0 0; font-size: 14px;">${email}</p>
        </div>
        <span style="${estilos.label}">Mensaje</span>
        <div style="background-color: ${c.negro}; border-left: 4px solid ${c.amarillo}; padding: 20px; margin-top: 5px; color: ${c.blanco}; font-style: italic; border-radius: 4px;">
          "${mensaje}"
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
           <a href="mailto:${email}" style="${estilos.btnLink}">Responder Email</a>
        </div>
      </div>
    </div>
  </div>
`);

// 4. PLANTILLA TRANSFERENCIA ADMIN
export const plantillaTransferencia = (nombre, email, telefono, total, pedido) => envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
        ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h2 style="${estilos.h1}">Comprobante de Transferencia</h2>
        <p style="color: ${c.gris}; margin-bottom: 24px;">Se recibió un comprobante de pago. Verificar antes de confirmar el pedido.</p>

        <div style="background-color: ${c.negro}; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #333;">
                <span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; font-weight: bold;">Cliente</span>
                <span style="font-size: 15px; color: ${c.blanco}; font-weight: 600;">${nombre}</span>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #333; text-align: right;">
                <span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; font-weight: bold;">Pedido</span>
                <span style="font-size: 15px; color: ${c.amarillo}; font-weight: 600;">#${pedido}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #333;">
                <span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; font-weight: bold;">Email</span>
                <span style="font-size: 15px; color: ${c.blanco};">${email}</span>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #333; text-align: right;">
                <span style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; font-weight: bold;">Teléfono</span>
                <span style="font-size: 15px; color: ${c.blanco};">${telefono || '—'}</span>
              </td>
            </tr>
          </table>
        </div>

        <div style="${estilos.totalBox}">
          MONTO: $${total}
        </div>

        <p style="margin-top: 20px; font-size: 13px; color: ${c.gris}; text-align: center;">El comprobante se encuentra adjunto a este correo.</p>
      </div>
    </div>
  </div>
`);