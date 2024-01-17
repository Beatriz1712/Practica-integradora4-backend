import mongoose from "mongoose"

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    rol: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' }
})

export const usersModel = mongoose.model(usersCollection, userSchema)