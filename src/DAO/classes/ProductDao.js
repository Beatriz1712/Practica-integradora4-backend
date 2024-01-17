import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(__dirname, '../models/products/products.json');

class ProductDao {
  static getAllProducts() {
    const productsData = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(productsData);
  }

  static getProductById(productId) {
    const products = this.getAllProducts();
    return products.find(product => product.id === productId);
  }

  static createProduct(product) {
    const products = this.getAllProducts();
    const newProduct = { id: generateProductId(), ...product };
    products.push(newProduct);
    this.writeProductsToFile(products);
    return newProduct;
  }

  static updateProduct(productId, updatedProduct) {
    const products = this.getAllProducts();
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      this.writeProductsToFile(products);
      return products[index];
    }
    return null; // Product not found
  }

  static deleteProduct(productId) {
    const products = this.getAllProducts();
    const filteredProducts = products.filter(product => product.id !== productId);
    if (filteredProducts.length < products.length) {
      this.writeProductsToFile(filteredProducts);
      return true; // Deletion successful
    }
    return false; // Product not found
  }

  static writeProductsToFile(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
  }
}

function generateProductId() {
  // Implement your logic for generating unique product IDs
  // This is just a placeholder
  return Math.random().toString(36).substr(2, 9);
}

export default ProductDao;
