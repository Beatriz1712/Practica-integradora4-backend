import ProductManager from '../controllers/ProductManager.js';
import { productsModel } from '../DAO/models/products.model.js';


const productManager = new ProductManager();

const ProductController = {
  getAllProducts: async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const productsPlain = products.map(product => product.toJSON()); // Convertir a objetos planos
        res.render("manageProducts", { products: productsPlain });
    } catch (error) {
        res.status(500).send("Error al obtener productos: " + error.message);
    }
},

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productManager.getProductById(productId);

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al obtener el producto por ID' });
    }
  },


  createProduct: async (req, res) => {
    if (req.user.rol === 'admin' || req.user.rol === 'premium') {
        const productData = { ...req.body, owner: req.user._id };
        try {
            const result = await productManager.addProducts(productData);
            res.render('productAdded', { title: result.title, price: result.price });
        } catch (error) {
            res.status(500).json({ error: error.message || 'Error al agregar el producto' });
        }
    } else {
        res.status(403).send('Acceso denegado');
    }
},

  updateProductById: async (req, res) => {
    const productId = req.params.id;

    console.log('Updating product with ID:', productId);

    try {
        const product = await productManager.getProductById(productId);

        console.log('Retrieved product:', product);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        console.log('User details:', req.user);

        if (req.user.rol === 'admin' || (req.user.rol === 'premium' && product.owner.toString() === req.user._id.toString())) {
            const productData = req.body;

            console.log('Data to update:', productData);

            const result = await productManager.updateProducts(productId, productData);

            console.log('Update result:', result);

            res.json({ message: 'Producto actualizado correctamente', product: result });
        } else {
          console.log('Access denied for user:', req.user);
            res.status(403).send('Acceso denegado');
        }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: error.message || 'Error al actualizar el producto' });
    }
}
,

  deleteProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await productManager.deleteProducts(productId);

      if (result) {
        res.json({ message: 'Producto eliminado correctamente', product: result });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al eliminar el producto' });
    }
  },


  manageProducts: async (req, res) => {
    try {
      let products;
      if (req.user.rol === 'admin') {
        products = await productManager.getProducts();
      } else if (req.user.rol === 'premium') {
        products = await productManager.getProductsByOwner(req.user._id);
      } else {
        return res.status(403).send('Acceso denegado');
      }

      const productsPlain = products.map(product => product.toJSON());
      res.render("manageProducts", { products: productsPlain });
    } catch (error) {
      res.status(500).send("Error al obtener productos: " + error.message);
    }
  },

};



export default ProductController;
