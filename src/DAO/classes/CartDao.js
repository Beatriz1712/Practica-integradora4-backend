import fs from 'fs';
import path from 'path';
import { cartsModel } from '../models/carts.model.js';
import ticketModel from '../models/tickets.model.js';
import { productsModel } from '../models/products.model.js';
import __dirname from '../../utils.js';

const cartsFilePath = path.join(__dirname, '../models/carts/carts.json');

class CartDao {
  static getAllCarts() {
    const cartsData = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(cartsData);
  }

  static getCartById(cartId) {
    const carts = this.getAllCarts();
    return carts.find(cart => cart.id === cartId);
  }

  static createCart(cart) {
    const carts = this.getAllCarts();
    const newCart = { id: generateCartId(), ...cart };
    carts.push(newCart);
    this.writeCartsToFile(carts);
    return newCart;
  }

  static updateCart(cartId, updatedCart) {
    const carts = this.getAllCarts();
    const index = carts.findIndex(cart => cart.id === cartId);
    if (index !== -1) {
      carts[index] = { ...carts[index], ...updatedCart };
      this.writeCartsToFile(carts);
      return carts[index];
    }
    return null; // Cart not found
  }

  static deleteCart(cartId) {
    const carts = this.getAllCarts();
    const filteredCarts = carts.filter(cart => cart.id !== cartId);
    if (filteredCarts.length < carts.length) {
      this.writeCartsToFile(filteredCarts);
      return true; // Deletion successful
    }
    return false; // Cart not found
  }

  static writeCartsToFile(carts) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf-8');
  }


  async deleteAllProductsInCart(cartId) {
    try {
        const cart = await cartsModel.findById(cartId);
        if (!cart) {
            return { error: 'Carrito no encontrado' };
        }

        cart.products = [];
        await cart.save();

        return { message: 'Productos eliminados del carrito' };
    } catch (error) {
        console.error(error);
        return { error: 'Error al eliminar los productos del carrito' };
    }
}

  async getCartProducts(cartId) {
    try {
        const cart = await cartsModel.findById(cartId);
        const productIds = cart.products.map(product => product.product);

        // Obtener información completa de los productos a partir de los IDs
        const products = await productsModel.find({ _id: { $in: productIds } });

        // Ahora tienes toda la información de los productos
        return products;
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        throw error;
    }
}

async checkStock(cartProducts) {
  try {
      console.log("productos del carrito", cartProducts);
      for (const product of cartProducts) {
          console.log(`Verificando stock para producto ${product._id}`);

          const productInDB = await productsModel.findById(product._id);

          if (!productInDB) {
              console.log(`Producto ${product._id} no encontrado en la base de datos`);
              return { success: false, message: "Producto no encontrado" };
          }

          const availableStock = productInDB.stock;

          if (product.quantity > availableStock) {
              console.log(`Stock insuficiente para ${productInDB.title}`);
              return { success: false, message: `Stock insuficiente para ${productInDB.title}` };
          }

          console.log(`Stock suficiente para ${productInDB.title}. Stock disponible: ${availableStock}`);

          // Restar la cantidad del carrito al stock del producto en la base de datos
          console.log(`Stock antes de la actualización para ${productInDB.title}: ${productInDB.stock}`);
          productInDB.stock -= product.quantity;
          await productInDB.save();
          console.log(`Stock después de la actualización para ${productInDB.title}: ${productInDB.stock}`);
      }

      return { success: true, message: 'Stock disponible para todos los productos' };
  } catch (error) {
      console.error('Error al verificar el stock de productos:', error);
      throw error;
  }
}


  
  async createTicket(ticketData) {
    try {
        // crear un ticket utilizando el ticketModel
        const ticket = new ticketModel(ticketData);
        const savedTicket = await ticket.save();
        return savedTicket;
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        return null;
    }
  }



}

function generateCartId() {
  // Implement your logic for generating unique cart IDs
  // This is just a placeholder
  return Math.random().toString(36).substr(2, 9);
}



export default CartDao;
