import { cartsModel } from "../DAO/models/carts.model.js";
import mongoose from "mongoose";

class CartManager {
    

  async getAllCarts() {
    try {
      const carts = await cartsModel.find({});
      return carts;
    } catch (error) {
      throw new Error('Error al obtener carritos');
    }
  }

  async addCart() {
    try {
      const newCart = new cartsModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error('Error al crear carrito');
    }
  }

  async updateCart(cartId, updatedCartData) {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(cartId, updatedCartData, { new: true });
      return updatedCart;
    } catch (error) {
      throw new Error('Error al actualizar carrito');
    }
  }

  async deleteCart(cartId) {
    try {
      const deletedCart = await cartsModel.findByIdAndDelete(cartId);
      return deletedCart;
    } catch (error) {
      throw new Error('Error al eliminar carrito');
    }
  }


    
    async addProductInCart(cartId, prodId) 
      {
        try 
        {
          const cart = await cartsModel.findById(cartId);
    
          if (!cart) 
          {
            return 'Carrito no encontrado';
          }
    
          // Verifica si el producto ya está en el carrito
          const existingProduct = cart.products.find((product) => product.productId === prodId);
    
          if (existingProduct) 
          {
            // Si el producto ya está en el carrito, aumenta la cantidad
            existingProduct.quantity += 1;
          } 
          else 
          {
            // Si el producto no está en el carrito, agrégalo
            cart.products.push({
              productId: prodId,
              quantity: 1,
            });
          } 
          await cart.save();
          return 'Producto agregado al carrito';
        } catch (error) {
          console.error('Error al agregar el producto al carrito:', error);
          return 'Error al agregar el producto al carrito';
        }
      }



      async getCartWithProducts(cartId) 
      {
        try
        {
          const cart = await cartsModel.findById(cartId).populate('products.productId').lean();
          if (!cart) {
            return 'Carrito no encontrado';
          }
      
          return cart;
        } catch (error) {
          console.error('Error al obtener el carrito con productos:', error);
          return 'Error al obtener el carrito con productos';
        }}


        async updateProductInCart(cartId, prodId, updatedProduct) 
        {
          try 
          {
            const cart = await cartsModel.findById(cartId);
            if (!cart) 
            {
              return 'Carrito no encontrado';
            }     
            // Busca el producto en el carrito por su ID
            const productToUpdate = cart.products.find((product) => product.productId === prodId);
        
            if (!productToUpdate) 
            {
              return 'Producto no encontrado en el carrito';
            }
        
            // Actualiza el producto con la información proporcionada
            Object.assign(productToUpdate, updatedProduct);
        
            await cart.save();
            return 'Producto actualizado en el carrito';
          } catch (error) {
            console.error('Error al actualizar el producto en el carrito:', error);
            return 'Error al actualizar el producto en el carrito';
          }
        }


        async existProductInCart(cartId, prodId) {
            try {
              const cart = await cartsModel.findById(cartId);
          
              if (!cart) {
                return 'Carrito no encontrado';
              }
          
              // Verifica si el producto está en el carrito
              const existingProduct = cart.products.find(
                (product) => product.productId.toString() === prodId
              );
          
              if (existingProduct) {
                return 'El producto está en el carrito';
              } else {
                return 'El producto no está en el carrito';
              }
            } catch (error) {
              console.error('Error al verificar el producto en el carrito:', error);
              return 'Error al verificar el producto en el carrito';
            }
          }


          async removeProductFromCart(cartId, prodId) {
            try {
                const cart = await cartsModel.findById(cartId);
        
                if (!cart) {
                    return 'Carrito no encontrado';
                }
        
                // Convierte prodId en un ObjectId
                const productObjectId = new mongoose.Types.ObjectId(prodId);
        
                // Encuentra el índice del producto a eliminar
                const productIndex = cart.products.findIndex((product) =>
                    product.productId.equals(productObjectId)
                );
        
                if (productIndex === -1) {
                    return 'Producto no encontrado en el carrito';
                }
        
                // Elimina el producto del carrito
                cart.products.splice(productIndex, 1);
        
                await cart.save();
                return 'Producto eliminado del carrito';
            } catch (error) {
                console.error('Error al eliminar productos del carrito:', error);
                return 'Error al eliminar productos del carrito';
            }
        }
        
        
          
}



export default CartManager