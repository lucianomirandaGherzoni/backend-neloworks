// Función para obtener el token de Andreani
const obtenerToken = async () => {
    const authHeader = btoa(`${process.env.ANDREANI_USUARIO}:${process.env.ANDREANI_PASSWORD}`);
    
    const response = await fetch('https://api.andreani.com/login', {
        method: 'GET',
        headers: { 'Authorization': `Basic ${authHeader}` }
    });

    if (!response.ok) throw new Error('Falló la autenticación con Andreani');
    
    // El token viene en el header 'x-authorization-token'
    return response.headers.get('x-authorization-token');
};

export const calcularEnvio = async (req, res) => {
    const { cpDestino, bultos } = req.body;

    try {
        const token = await obtenerToken();
        
        const payload = {
            cpDestino,
            contrato: process.env.ANDREANI_CONTRATO,
            cliente: process.env.ANDREANI_CLIENTE,
            bultos: bultos.map(b => ({
                valorDeclarado: b.valorDeclarado,
                volumen: b.volumen,
                peso: b.peso
            }))
        };

        const response = await fetch('https://api.andreani.com/v2/tarifas', {
            method: 'POST',
            headers: {
                'x-authorization-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Error Andreani:', error.message);
        res.status(500).json({ error: 'Error al cotizar el envío' });
    }
};

export const obtenerSucursales = async (req, res) => {
    const { cp } = req.query;
    try {
        const token = await obtenerToken();
        const response = await fetch(`https://api.andreani.com/v2/sucursales?codigoPostal=${cp}`, {
            method: 'GET',
            headers: { 'x-authorization-token': token }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar sucursales' });
    }
};