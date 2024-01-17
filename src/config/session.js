import session from 'express-session';
import mongoose from 'mongoose';

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new session.MemoryStore(), 
  cookie: {
  maxAge: 60 * 60 * 1000 // Establece la duración de la sesión a 24 horas
  }
};

export default sessionConfig;
