import { calcularDimensionesAlfombra } from '../utils/dimensionesAlfombra.js';

// Cache del token de Correo Argentino (en memoria, por instancia de servidor)
let tokenCache = null; // { token: string, expireAt: Date }

const CINCO_MINUTOS_MS = 5 * 60 * 1000;

const obtenerToken = async () => {
    const ahora = new Date();

    // Reusar token si existe y no está próximo a vencer (margen de 5 minutos)
    if (
        tokenCache &&
        tokenCache.expireAt &&
        tokenCache.expireAt - ahora > CINCO_MINUTOS_MS
    ) {
        return tokenCache.token;
    }

    const credentials = Buffer.from(
        `${process.env.CORREO_USER}:${process.env.CORREO_PASSWORD}`
    ).toString('base64');

    const response = await fetch(`${process.env.CORREO_API_URL}/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Error de autenticación con Correo Argentino: HTTP ${response.status}`
        );
    }

    const data = await response.json();

    // Parsear fecha de expiración con fallback a 25 minutos desde ahora
    let expireAt;
    try {
        expireAt = new Date(data.expire);
        if (isNaN(expireAt.getTime())) throw new Error('Fecha inválida');
    } catch {
        expireAt = new Date(Date.now() + 25 * 60 * 1000);
    }

    tokenCache = { token: data.token, expireAt };
    return tokenCache.token;
};

export const calcularEnvio = async (req, res) => {
    const { codigoPostalDestino, anchoAlfombra, largoAlfombra } = req.body;

    if (!codigoPostalDestino || anchoAlfombra == null || largoAlfombra == null) {
        return res.status(400).json({
            error: 'Faltan datos requeridos: codigoPostalDestino, anchoAlfombra, largoAlfombra',
        });
    }

    // Validar variables de entorno requeridas en tiempo de ejecución
    const VARS_REQUERIDAS = [
        'CORREO_USER',
        'CORREO_PASSWORD',
        'CORREO_CUSTOMER_ID',
        'CORREO_API_URL',
        'CORREO_POSTAL_CODE_ORIGIN',
    ];
    for (const varName of VARS_REQUERIDAS) {
        if (!process.env[varName]) {
            console.error(`[ERROR] Variable de entorno no definida: ${varName}`);
            return res.status(500).json({
                error: 'El servicio de envío no está disponible en este momento.',
            });
        }
    }

    try {
        const dimensiones = calcularDimensionesAlfombra(
            Number(anchoAlfombra),
            Number(largoAlfombra)
        );

        const token = await obtenerToken();

        const payload = {
            customerId: process.env.CORREO_CUSTOMER_ID,
            postalCodeOrigin: process.env.CORREO_POSTAL_CODE_ORIGIN,
            postalCodeDestination: String(codigoPostalDestino),
            dimensions: dimensiones,
        };

        const response = await fetch(`${process.env.CORREO_API_URL}/rates`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(
                `[Correo Argentino] Error HTTP ${response.status}:`,
                errText
            );
            return res.status(502).json({
                error: 'Error al cotizar con Correo Argentino. Intentá de nuevo.',
            });
        }

        const data = await response.json();
        res.json({ rates: data.rates });

    } catch (error) {
        console.error('[calcularEnvio] Error:', error.message);

        // Errores de validación de dimensiones → 400
        if (
            error.message.includes('dimensiones') ||
            error.message.includes('peso') ||
            error.message.includes('mínimas') ||
            error.message.includes('máximas') ||
            error.message.includes('límite')
        ) {
            return res.status(400).json({ error: error.message });
        }

        res.status(502).json({
            error: 'Error al contactar con Correo Argentino. Intentá de nuevo.',
        });
    }
};

export const obtenerSucursales = async (req, res) => {
    const provinceCode = req.query.provinceCode || req.body?.provinceCode;

    if (!provinceCode) {
        return res.status(400).json({ error: 'Falta el parámetro provinceCode.' });
    }

    try {
        const token = await obtenerToken();

        const url = new URL(`${process.env.CORREO_API_URL}/agencies`);
        url.searchParams.set('customerId', process.env.CORREO_CUSTOMER_ID);
        url.searchParams.set('provinceCode', provinceCode);
        url.searchParams.set('services', 'package_reception');

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[Correo Argentino /agencies] HTTP ${response.status}:`, errText);
            return res.status(502).json({
                error: 'Error al obtener sucursales de Correo Argentino. Intentá de nuevo.',
            });
        }

        const data = await response.json();

        const sucursales = (Array.isArray(data) ? data : []).filter(
            (s) => s.status === 'ACTIVE' && s.services?.packageReception === true
        );

        res.json({ sucursales });

    } catch (error) {
        console.error('[obtenerSucursales] Error:', error.message);
        res.status(502).json({
            error: 'Error al contactar con Correo Argentino. Intentá de nuevo.',
        });
    }
};