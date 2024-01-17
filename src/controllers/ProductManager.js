import ProductRepository from '../repositories/ProductRepository.js';
import { productsModel } from '../DAO/models/products.model.js';


class ProductManager {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProducts() {
    try {
      return await this.productRepository.getAllProducts();
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductById(productId) {
    try {
      return await this.productRepository.getProductById(productId);
    } catch (error) {
      console.error('Error al buscar el producto por ID:', error);
      throw new Error('Error al obtener el producto por ID');
    }
  }

  async addProducts(productData) {
    try {
      return await this.productRepository.createProduct(productData);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw new Error('Error al agregar el producto');
    }
  }

  async updateProducts(productId, productData) {
    try {
      return await this.productRepository.updateProduct(productId, productData);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProducts(productId) {
    try {
      return await this.productRepository.deleteProduct(productId);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  }

  async getProductsByOwner(ownerId) {
    return productsModel.find({ owner: ownerId });
  }
}

export default ProductManager;
