// src/configuracion/resend.js
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RESEND_API_KEY) {
  throw new Error("Falta la variable RESEND_API_KEY en el .env");
}

export const resend = new Resend(process.env.RESEND_API_KEY);
export const EMAIL_ADMIN = process.env.ADMIN_EMAIL;