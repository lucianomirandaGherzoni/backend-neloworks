// src/controladores/pagoControlador.js
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export const crearPreferencia = async (req, res) => {
  try {
    const { items } = req.body;

    // Validar que items sea un array no vacío
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un producto.' });
    }

    // Validar cada item: precio positivo, cantidad positiva, título presente
    for (const item of items) {
      const precio = Number(item.price);
      const cantidad = Number(item.quantity);
      if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
        return res.status(400).json({ error: 'Datos de producto inválidos.' });
      }
      if (!isFinite(precio) || precio <= 0) {
        return res.status(400).json({ error: 'Precio de producto inválido.' });
      }
      if (!isFinite(cantidad) || cantidad < 1 || !Number.isInteger(cantidad)) {
        return res.status(400).json({ error: 'Cantidad de producto inválida.' });
      }
    }

    const body = {
      items: items.map(item => ({
        title: String(item.title).slice(0, 256),
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        currency_id: 'ARS',
      })),
      back_urls: {
        success: "https://neloworks.com/confirmacion?status=approved",
        failure: "https://neloworks.com/cart",
        pending: "https://neloworks.com/cart"
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({ id: result.id });

  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
};