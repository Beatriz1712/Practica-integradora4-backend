// test\Product.test.js
import mongoose from 'mongoose';
import ProductRepository from '../src/repositories/ProductRepository.js';
import Assert from 'assert';
import dotenv from 'dotenv';

const { ObjectId } = mongoose.Types;
dotenv.config();

before(async function() {
  this.timeout(10000); // ojo Aumentar el timeout si la conexión es lenta
  await mongoose.connect(process.env.MONGO_TEST);
});

after(async function() {
  await mongoose.disconnect();
});

const assert = Assert.strict;

describe('Testing Products Repository', () => {
  before(function() {
    this.productRepo = new ProductRepository();
  });

  it('Se debe añadir un producto a la DB', async function() {
    let mockProduct = {
        title: "Product to Delete",
        description: "This product will be deleted",
        price: 10,
        stock: 100,
        category: "Test",
        thumbnails: "http://example.com/product.jpg",
        carru1: "http://example.com/product.jpg",
        carru2: "http://example.com/product.jpg",
        carru3: "http://example.com/product.jpg",
        availability: true,
        owner: new ObjectId('658c4da1d6c70ef243ca3549')
    };

    const result = await this.productRepo.createProduct(mockProduct);
    assert.ok(result._id);
  });

  it('Se deben obtener todos los productos', async function() {
    const products = await this.productRepo.getAllProducts();
    assert(Array.isArray(products));
  });

  it('Debe eliminar un producto', async function() {
    let mockProduct = {
      title: "Product to Delete",
      description: "This product will be deleted",
      price: 10,
      stock: 100,
      category: "Test",
      thumbnails: "http://example.com/product.jpg",
      carru1: "http://example.com/product.jpg",
      carru2: "http://example.com/product.jpg",
      carru3: "http://example.com/product.jpg",
      minimo: 100,
      availability: true,
      owner: new ObjectId('658c4da1d6c70ef243ca3549')
    };

    const createdProduct = await this.productRepo.createProduct(mockProduct);
    await this.productRepo.deleteProduct(createdProduct._id);
    const product = await this.productRepo.getProductById(createdProduct._id);
    assert.strictEqual(product, null);
  });

  afterEach(async function() {
    try {
      if (mongoose.connection.collection('products')) {
        await mongoose.connection.collection('products').drop();
      }
    } catch (error) {
      if (error.code === 26) {
        console.log('Namespace not found, skipping drop collection');
      } else {
        throw error;
      }
    }
  });
});

