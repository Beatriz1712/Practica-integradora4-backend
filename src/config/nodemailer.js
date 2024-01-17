import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service:"Gmail",
  auth:{
    user:process.env.USERMAILER,
    pass: process.env.PASSMAILER
  }
});

// Función para enviar un correo electrónico
const sendEmail = async (emailOptions) => {
  try {
    const info = await transporter.sendMail(emailOptions);
    console.log('Correo electrónico enviado:', info);
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw new Error('Error al enviar el correo electrónico');
  }
};

export { transporter, sendEmail };
