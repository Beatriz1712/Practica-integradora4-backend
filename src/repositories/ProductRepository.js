import { productsModel } from '../DAO/models/products.model.js';

class ProductRepository {
  // Obtener todos los productos
  async getAllProducts() {
    try {
      const products = await productsModel.find({});
      return products;
    } catch (error) {
      throw new Error('Error al obtener productos');
    }
  }

  // Obtener un producto por ID
  async getProductById(productId) {
    try {
      const product = await productsModel.findById(productId);
      return product;
    } catch (error) {
      throw new Error('Error al obtener producto por ID');
    }
  }

  // Crear un nuevo producto
  async createProduct(productData) {
    try {
      const newProduct = new productsModel(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error('Error al crear producto');
    }
  }

  // Actualizar un producto existente
  async updateProduct(productId, updatedProductData) {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(productId, updatedProductData, { new: true });
      return updatedProduct;
    } catch (error) {
      throw new Error('Error al actualizar producto');
    }
  }

  // Eliminar un producto por ID
  async deleteProduct(productId) {
    try {
      const deletedProduct = await productsModel.findByIdAndDelete(productId);
      return deletedProduct;
    } catch (error) {
      throw new Error('Error al eliminar producto');
    }
  }
}

export default ProductRepository;
