// src/controladores/pagoControlador.js
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configuración del cliente (como en el minuto 23:40 del video)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export const crearPreferencia = async (req, res) => {
  try {
    const { items } = req.body; // El frontend te debe mandar un array de productos

    // 2. Objeto de preferencia (según video min 25:00)
    const body = {
      items: items.map(item => ({
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        currency_id: 'ARS', // Cambia a tu moneda si no eres de Arg
      })),
      back_urls: {
        success: "https://neloworks.com/confirmacion?status=approved", // Redirige a tu web
        failure: "https://neloworks.com/cart",
        pending: "https://neloworks.com/cart"
      },
      auto_return: "approved",
    };

    // 3. Crear la preferencia
    const preference = new Preference(client);
    const result = await preference.create({ body });

    // 4. Devolver el ID al frontend (para que muestre el botón)
    res.json({ id: result.id });

  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
};

/*       */

/*                 success: "localhost:5173/confirmacion?status=approved", // <--- Tu puerto local
        failure: "localhost:5173/cart",
        pending: "localhost:5173/cart" */