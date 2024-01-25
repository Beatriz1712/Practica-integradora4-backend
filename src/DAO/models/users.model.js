import mongoose from "mongoose"

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    rol: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
    documents: [{
        name: String,      // Nombre del documento
        reference: String  // Enlace o referencia al documento
    }],
    last_connection: Date // Fecha de la última conexión
})

export const usersModel = mongoose.model(usersCollection, userSchema)