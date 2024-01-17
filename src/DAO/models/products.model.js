import mongoose from "mongoose"

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: String, required: true },
    carru1: { type: String, required: true },
    carru2: { type: String, required: true },
    carru3: { type: String, required: true },
    minimo: { type: Number, required: true },
    availability: {type: Boolean,required: true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // Referencia al modelo de Usuario
});


export const productsModel  = mongoose.model(productsCollection, productsSchema)

