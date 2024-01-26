import mongoose from 'mongoose';
import { productsModel } from './products.model.js';
const ticketsCollection = "tickets";
//ojo agrgo ref user
const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, max: 100, unique: true, required: true },
    purchaser: { type: String, max: 30, required: true, ref: "user" },
    amount: { type: Number },
    purchase_datetime: { type: Date, default: Date.now },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }] // Campo para la fecha de compra
  },
  { timestamps: true } // Usar timestamps para createdAt y updatedAt mongoose manejara automaticamente la creacion y actualizacion del ticket
);

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);

export default ticketModel 