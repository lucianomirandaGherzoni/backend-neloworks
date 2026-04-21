// src/vistas/plantillasEmail.js

const WEB_URL = "https://neloworks.com";
const LOGO_URL = "https://neloworks.com/img/logo.webp";

const c = {
    negro: '#0a0a0a',
    blanco: '#ffffff',
    grisClaro: '#f5f5f5',
    grisMedio: '#999999',
    grisBorde: '#e0e0e0',
    fondoEmail: '#000000',
};

// ESTILOS MINIMALISTAS — fondo negro exterior, card blanca
const estilos = {
    container: `background-color: ${c.fondoEmail}; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%;`,
    card: `max-width: 600px; margin: 0 auto; background-color: ${c.blanco}; color: ${c.negro}; border: 1px solid ${c.grisBorde};`,
    header: `padding: 32px 30px 24px; text-align: left; border-bottom: 1px solid ${c.grisBorde};`,
    body: `padding: 36px 30px; color: ${c.negro}; line-height: 1.7; background-color: ${c.blanco};`,
    footer: `text-align: center; padding: 24px 30px; font-size: 11px; color: ${c.grisMedio}; border-top: 1px solid ${c.grisBorde}; letter-spacing: 0.5px;`,
    h1: `margin: 0 0 8px 0; color: ${c.negro}; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;`,
    label: `display: block; font-size: 10px; color: ${c.grisMedio}; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 3px; font-weight: 600;`,
    data: `font-size: 15px; color: ${c.negro}; margin: 0; font-weight: 500;`,
    totalBox: `border-top: 2px solid ${c.negro}; padding: 16px 0 0 0; text-align: right; font-weight: 700; font-size: 20px; margin-top: 20px; color: ${c.negro}; letter-spacing: 0.5px;`,
    btnLink: `border: 1.5px solid ${c.negro}; color: ${c.negro}; padding: 11px 28px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-top: 10px;`,
    divider: `border: 0; border-top: 1px solid ${c.grisBorde}; margin: 24px 0;`,
    infoBlock: `background-color: ${c.grisClaro}; padding: 16px 20px; margin-bottom: 16px;`,
};

const logoHtml = `
  <a href="${WEB_URL}" target="_blank" style="text-decoration: none;">
    <img src="${LOGO_URL}" alt="Nelo Works" style="max-height: 40px; display: block; border: 0; outline: none; text-decoration: none;" />
  </a>
`;

// Helper para forzar modo claro en clientes de email
const envolverHTML = (contenido) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <style>
      :root { color-scheme: light only; }
      body { background-color: #000000 !important; margin: 0; padding: 0; }
    </style>
</head>
<body style="background-color: #000000; margin: 0; padding: 0;">
    ${contenido}
</body>
</html>
`;

// 1. PLANTILLA CLIENTE
export const plantillaCliente = (nombre, codigo, productosHtml, total, direccion, costoEnvio, piso, depto, notaEntrega) => envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
        ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h1 style="${estilos.h1}">Pedido confirmado</h1>
        <p style="margin: 0 0 28px 0; color: ${c.grisMedio}; font-size: 14px;">Hola <strong style="color: ${c.negro};">${nombre}</strong>, recibimos tu pedido correctamente.</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
          <tr>
            <td style="padding-bottom: 16px; border-bottom: 1px solid ${c.grisBorde};">
              <span style="${estilos.label}">Nº de Pedido</span>
              <p style="${estilos.data}">#${codigo}</p>
            </td>
            <td style="padding-bottom: 16px; border-bottom: 1px solid ${c.grisBorde}; text-align: right;">
              <span style="${estilos.label}">Fecha</span>
              <p style="${estilos.data}">${new Date().toLocaleDateString()}</p>
            </td>
          </tr>
        </table>

        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; color: ${c.grisMedio}; margin: 0 0 12px 0;">Detalle del pedido</p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${productosHtml}
        </table>

        <div style="${estilos.totalBox}">
           Total: $${total}
        </div>

        <hr style="${estilos.divider}" />

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
          <tr>
            <td style="padding-top: 16px;">
              <span style="${estilos.label}">Dirección de envío</span>
              <p style="${estilos.data}">${direccion}</p>
              ${piso || depto ? `<p style="font-size: 14px; color: ${c.grisMedio}; margin: 2px 0 0 0;">${[piso && `Piso ${piso}`, depto && `Depto ${depto}`].filter(Boolean).join(', ')}</p>` : ''}
              ${notaEntrega ? `<p style="font-size: 13px; color: ${c.grisMedio}; font-style: italic; margin: 4px 0 0 0;">Nota: ${notaEntrega}</p>` : ''}
            </td>
            <td style="padding-top: 16px; text-align: right; vertical-align: top;">
              <span style="${estilos.label}">Costo de envío</span>
              <p style="${estilos.data}">${costoEnvio && Number(costoEnvio) > 0 ? `$${costoEnvio}` : 'Gratis'}</p>
            </td>
          </tr>
        </table>

        <div style="text-align: center; padding-top: 8px;">
            <a href="${WEB_URL}" style="${estilos.btnLink}">Ver más productos</a>
        </div>
      </div>
    </div>
    <div style="${estilos.footer}">
      <p style="margin: 0;">© ${new Date().getFullYear()} Nelo Works · neloworks.com</p>
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
      <tr><td style="padding: 6px 0; border-bottom: 1px solid ${c.grisBorde};"><span style="${estilos.label}">Tipo</span><p style="${estilos.data}">Entrega en Sucursal Correo Argentino</p></td></tr>
      <tr><td style="padding: 6px 0; border-bottom: 1px solid ${c.grisBorde};"><span style="${estilos.label}">Sucursal</span><p style="${estilos.data}">${envio.sucursalNombre}</p></td></tr>
      ${envio.sucursalDireccion ? `<tr><td style="padding: 6px 0; border-bottom: 1px solid ${c.grisBorde};"><span style="${estilos.label}">Dirección Sucursal</span><p style="${estilos.data}">${envio.sucursalDireccion}</p></td></tr>` : ''}
      ${envio.codigoPostal ? `<tr><td style="padding: 6px 0;"><span style="${estilos.label}">CP Destino</span><p style="${estilos.data}">${envio.codigoPostal}</p></td></tr>` : ''}
    `
  } else if (envio?.direccionDomicilio) {
    detalleEnvioHtml = `
      <tr><td style="padding: 6px 0; border-bottom: 1px solid ${c.grisBorde};"><span style="${estilos.label}">Tipo</span><p style="${estilos.data}">Envío a Domicilio (Correo Argentino)</p></td></tr>
      <tr><td style="padding: 6px 0;${envio.piso || envio.depto || envio.notaEntrega ? ` border-bottom: 1px solid ${c.grisBorde};` : ''}"><span style="${estilos.label}">Dirección</span><p style="${estilos.data}">${envio.direccionDomicilio}</p></td></tr>
      ${envio.piso || envio.depto ? `<tr><td style="padding: 6px 0;${envio.notaEntrega ? ` border-bottom: 1px solid ${c.grisBorde};` : ''}"><span style="${estilos.label}">Piso / Depto</span><p style="${estilos.data}">${[envio.piso && `Piso ${envio.piso}`, envio.depto && `Depto ${envio.depto}`].filter(Boolean).join(', ')}</p></td></tr>` : ''}
      ${envio.notaEntrega ? `<tr><td style="padding: 6px 0;"><span style="${estilos.label}">Nota para la entrega</span><p style="${estilos.data}; font-style: italic;">${envio.notaEntrega}</p></td></tr>` : ''}
    `
  } else {
    detalleEnvioHtml = `<tr><td style="padding: 6px 0;"><span style="${estilos.label}">Tipo</span><p style="${estilos.data}">Retiro en Local</p></td></tr>`
  }

  return envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
         ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h2 style="${estilos.h1}">Nueva venta</h2>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: ${c.grisMedio};">Pedido #${codigo}</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding-bottom: 16px; border-bottom: 1px solid ${c.grisBorde};">
               <span style="${estilos.label}">Cliente</span>
               <p style="${estilos.data}">${cliente.nombre} ${cliente.apellido}</p>
            </td>
            <td style="padding-bottom: 16px; border-bottom: 1px solid ${c.grisBorde}; text-align: right;">
               <span style="${estilos.label}">Método de pago</span>
               <p style="${estilos.data}">${metodoPago}</p>
            </td>
          </tr>
        </table>

        <div style="${estilos.infoBlock} margin-bottom: 20px;">
            <span style="${estilos.label}">Contacto</span>
            <p style="${estilos.data}">${cliente.email}</p>
            <p style="font-size: 14px; color: ${c.grisMedio}; margin: 4px 0 0 0;">${cliente.telefono}</p>
        </div>

        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; color: ${c.grisMedio}; margin: 0 0 12px 0;">Datos de envío</p>
        <div style="${estilos.infoBlock} margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; border-bottom: 1px solid ${c.grisBorde};"><span style="${estilos.label}">Servicio</span><p style="${estilos.data}">${envio?.metodoNombre || 'Sin especificar'} — ${costoEnvioTexto}</p></td></tr>
            ${detalleEnvioHtml}
          </table>
        </div>

        <hr style="${estilos.divider}" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${productosHtml}
        </table>
        <div style="${estilos.totalBox}">
          Total: $${total}
        </div>
      </div>
    </div>
  </div>
`);};

// 3. PLANTILLA CONTACTO (Sin teléfono)
export const plantillaContacto = (nombre, email, mensaje) => envolverHTML(`
  <div style="${estilos.container}">
    <div style="${estilos.card}">
      <div style="${estilos.header}">
         ${logoHtml}
      </div>
      <div style="${estilos.body}">
        <h2 style="${estilos.h1}">Nuevo mensaje</h2>
        <div style="${estilos.infoBlock} margin-top: 20px; margin-bottom: 20px;">
           <span style="${estilos.label}">Remitente</span>
           <p style="${estilos.data}">${nombre}</p>
           <p style="color: ${c.grisMedio}; margin: 4px 0 0 0; font-size: 14px;">${email}</p>
        </div>
        <span style="${estilos.label}">Mensaje</span>
        <div style="border-left: 3px solid ${c.negro}; padding: 16px 20px; margin-top: 8px; color: ${c.negro}; font-style: italic; background-color: ${c.grisClaro};">
          "${mensaje}"
        </div>
        <div style="margin-top: 28px; text-align: center;">
           <a href="mailto:${email}" style="${estilos.btnLink}">Responder</a>
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
        <h2 style="${estilos.h1}">Comprobante de transferencia</h2>
        <p style="color: ${c.grisMedio}; margin: 0 0 24px 0; font-size: 14px;">Se recibió un comprobante de pago. Verificar antes de confirmar el pedido.</p>

        <div style="${estilos.infoBlock} margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid ${c.grisBorde};">
                <span style="${estilos.label}">Cliente</span>
                <p style="${estilos.data}">${nombre}</p>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid ${c.grisBorde}; text-align: right;">
                <span style="${estilos.label}">Pedido</span>
                <p style="${estilos.data}">#${pedido}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="${estilos.label}">Email</span>
                <p style="${estilos.data}">${email}</p>
              </td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="${estilos.label}">Teléfono</span>
                <p style="${estilos.data}">${telefono || '—'}</p>
              </td>
            </tr>
          </table>
        </div>

        <div style="${estilos.totalBox}">
          Monto: $${total}
        </div>

        <p style="margin-top: 20px; font-size: 13px; color: ${c.grisMedio}; text-align: center;">El comprobante se encuentra adjunto a este correo.</p>
      </div>
    </div>
  </div>
`);