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
export const plantillaAdminVenta = (cliente, codigo, productosHtml, total, metodoPago) => envolverHTML(`
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
        <div style="background-color: #f4f4f4; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: ${c.negro};"><strong>Contacto:</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: ${c.negro};">${cliente.email} | ${cliente.telefono}</p>
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
`);

// 3. PLANTILLA CONTACTO (Sin teléfono)
export const plantillaContacto = (nombre, email, mensaje) => envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
         ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h2 style="${estilos.h1}">Nuevo Mensaje</h2>
        <div style="margin-bottom: 20px; margin-top: 20px;">
           <span style="${estilos.label}">Remitente</span>
           <p style="${estilos.data}"><strong>${nombre}</strong></p>
           <p style="color: ${c.gris}; margin: 0;">${email}</p>
        </div>
        <span style="${estilos.label}">Mensaje</span>
        <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 20px; margin-top: 5px; color: ${c.oscuro}; font-style: italic;">
          "${mensaje}"
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
           <a href="mailto:${email}" style="${estilos.btnLink}">Responder Email</a>
        </div>
      </div>
    </div>
  </div>
`);