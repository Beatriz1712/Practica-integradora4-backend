import mongoose from 'mongoose';
import CartRepository from '../src/repositories/CartRepository.js';
import Assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

before(async function() {
  this.timeout(10000); // Aumentar el timeout si la conexión es lenta
  await mongoose.connect(process.env.MONGO_TEST);
});

after(async function() {
  await mongoose.disconnect();
});

const assert = Assert.strict;

describe('Testing Carts Repository', () => {
  before(function() {
    this.cartRepo = new CartRepository();
  });

  it('Se debe crear un carrito', async function() {
    const result = await this.cartRepo.createCart();
    assert.ok(result._id);
  });

  it('Se debe obtener todos los carritos', async function() {
    const carts = await this.cartRepo.getAllCarts();
    assert(Array.isArray(carts));
  });

  it('debe eliminar un carrito', async function() {
    const createdCart = await this.cartRepo.createCart();
    await this.cartRepo.deleteCart(createdCart._id);
    const cart = await this.cartRepo.getCartById(createdCart._id);
    assert.strictEqual(cart, null);
  });

  afterEach(async function() {
    try {
      if (mongoose.connection.collection('carts')) {
        await mongoose.connection.collection('carts').drop();
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
