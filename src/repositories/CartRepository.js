import { cartsModel } from '../DAO/models/carts.model.js';
import CartDao from '../DAO/classes/CartDao.js';

const cartDao= new CartDao()

class CartRepository {
  // Obtener todos los carritos
  async getAllCarts() {
    try {
      const carts = await cartsModel.find({});
      return carts;
    } catch (error) {
      throw new Error("Error al obtener carritos");
    }
  }

  // Obtener un carrito por ID
  async getCartById(cartId) {
    try {
      const cart = await cartsModel.findById(cartId);
      return cart;
    } catch (error) {
      throw new Error("Error al obtener carrito por ID");
    }
  }

  // Obtener un carrito por ID de usuario
  async getCartById(userId) {
    try {
      console.log(userId);
      const cart = await cartsModel.findOne({ userId: userId }).lean();
      return cart;
    } catch (error) {
      throw new Error("Error al obtener carrito por ID");
    }
  }

  // Crear un nuevo carrito
  async createCart() {
    try {
      const newCart = new cartsModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear carrito");
    }
  }

  // Actualizar un carrito existente
  async updateCart(cartId, updatedCartData) {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(
        cartId,
        updatedCartData,
        { new: true }
      );
      return updatedCart;
    } catch (error) {
      throw new Error("Error al actualizar carrito");
    }
  }

  // Eliminar un carrito por ID
  async deleteCart(cartId) {
    try {
      const deletedCart = await cartsModel.findByIdAndDelete(cartId);
      return deletedCart;
    } catch (error) {
      throw new Error("Error al eliminar carrito");
    }
  }

  // Crear un nuevo carrito asociado al usuario
  async createCartForUser(userId) {
    try {
      const newCart = new cartsModel({ products: [] }); // Crea un nuevo carrito vacío para el usuario
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear carrito para el usuario");
    }
  }
  //borra todos los productos del carrito
  async deleteAllProductsInCart(cartId) {
    try {
      const result = await this.dao.deleteAllProductsInCart(cartId);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar todos los productos del carrito");
    }
  }


  // Agregar un producto al carrito del usuario
  async addProductToUserCart(userId, productId, quantity) {
    try {
      //intenta encontar el carrito existente del usuario
      let userCart = await cartsModel.findOne({ userId: userId });

      // Si no hay un carrito, crea uno nuevo
      if (!userCart) {
        userCart = new cartsModel({
          userId: userId,
          products: [],
        });
        await userCart.save();
      }

      // Ahora, agrega el producto al carrito
      userCart.products.push({ productId: productId, quantity: quantity });
      await userCart.save();

      return userCart;
    } catch (error) {
      throw new Error("Error al agregar el producto al carrito del usuario");
    }
  }
}
export default CartRepository;
