import { Router } from "express";
import CartRepository from "../repositories/CartRepository.js";
import ProductManager from "../controllers/ProductManager.js"
import CartManager from "../controllers/CartManager.js"
import { isAdmin } from "../config/middlewares.js";
import { getUsersAndView } from '../controllers/UserController.js';
import ProductController from "../controllers/ProductController.js";
import ticketModel from '../DAO/models/tickets.model.js'
import { v4 as uuidv4 } from "uuid";

const router = Router();
const product = new ProductManager
const cart = new CartManager
const repocart = new CartRepository();
//Pagina inicial
router.get("/", (req, res)=> {
    res.render("home", {
      title: "Ecommerce App Backend",
    });
})


// Middleware para verificar la autenticación del usuario
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // Verifica si el usuario está autenticado
      return next();
    }
    res.redirect("/login"); // Redirige al usuario a la página de inicio de sesión
  };


//Chat
router.get("/chat", isAuthenticated, (req, res) => {
  res.render("chat", {
    title: "Chat con Mongoose"
  });
});

//Renderizado de productos
router.get("/products", async (req, res) => {
    let allProducts = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON())
    res.render("productos", {
        title: "Ecommerce App | Productos",
        products : allProducts
    })
})

//Renderizado de detalle de productos
router.get("/products/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const productDetails = await product.getProductById(productId);
        if (productDetails) {
            // Verifica que los valores sean números antes de la conversión
            const price = typeof productDetails.price === 'number' ? productDetails.price : 0;
            const stock = typeof productDetails.stock === 'number' ? productDetails.stock : 0;
            const minimo = typeof productDetails.minimo === 'number' ? productDetails.minimo : 0;

            const cleanedProduct = {
                title: productDetails.title,
                description: productDetails.description,
                price: price,
                stock: stock,
                minimo: minimo,
                category: productDetails.category,
                thumbnails: productDetails.thumbnails,
                // Agrega otras propiedades aquí si es necesario
            };
            
            res.render("detail", { product: cleanedProduct });
        } else {
            // Manejo de producto no encontrado
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

//renderizado de productos en carrito

router.get("/cart", async (req, res) => {
  try {
    // Verificar si el usuario no está autenticado
    if (!req.isAuthenticated()) {
      // Redirigir al usuario a la página de inicio de sesión
      return res.redirect("/login");
    }

    console.log(req.user);
    // Obtener el ID del usuario de la sesión
    const userId = req.user._id;

    // Verificar si se pudo obtener el ID del usuario
    if (!userId) {
      console.error("No se pudo obtener el ID del usuario");
      return res.status(500).send("Error interno del servidor");
    }

    // Obtener el carrito del usuario por el ID
    let userCart = await repocart.getCartById(userId);

    // Verificar si se pudo obtener el carrito del usuario
    if (!userCart || !userCart._id) {
      console.error("No se pudo obtener el carrito del usuario");
      return res.status(500).send("Error interno del servidor");
    }

    let cartId = userCart._id;
    console.log("el id user:", userId);
    console.log("el id cart:", cartId);

    // Renderizar la plantilla con la información del carrito
    res.render("cart", {
      title: "Vista Carro",
      cart: userCart,
      cartId: cartId, // Pasar el carrito específico del usuario a la plantilla
      message: "producto eliminado",
    });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    // Manejar el error, por ejemplo, mostrando un mensaje de error
    res.status(500).send("Error interno del servidor");
  }
});


//Login
router.get("/login", async (req, res) => {
    res.render("login", {
        title: "Vista Login",
    });
    
})

//register
router.get("/register", async (req, res) => { 
    res.render("register", {
        title: "Vista Register",
    });
})

  //profile
  router.get("/profile", isAuthenticated, async (req, res) => {
    if (!req.session.emailUsuario) {
      return res.redirect("/login");
    }
    res.render("profile", {
      title: "Vista Profile Admin",
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      rol: req.user.rol,
      isAdmin: req.user.rol === 'admin'
    });
});

//Carga de Productos
router.get("/addProduct", async (req, res) => {
    res.render("addProduct", {
        title: "Carga de Productos",
    });
    
})


//Restablecer contraseña
router.get('/reset', (req, res) => {
    res.render('reset');
  });

router.get('/reset-password/:token', (req, res) => {
    res.render('tokenreset', { token: req.params.token });
});


//todos los usuarios
router.get('/allusers', getUsersAndView)

//editar productos
router.get("/manage-products", isAuthenticated, ProductController.manageProducts)

//Carga de archivos para ser premium
router.get('/cambiopremium', isAuthenticated, (req, res) => {
    res.render('cambioAPremium', {
        title: "Cambio a Usuario Premium",
        userId: req.user._id // Asegúrar  que req.user._id está disponible y es correcto
    });
});

//Cambiar a premium
router.get('/confirmar-premium', isAuthenticated, (req, res) => {
    res.render('confirmarPremium', {
        userId: req.user._id 
    });
});


// Ruta para generar un ticket de compra
router.post('/generate-ticket/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    // Ejemplo: Crear un ticket
  
    
const newTicket = await ticketModel.create({
  code: uuidv4(), // Utilizando uuid para generar un código único
  purchaser: 'Usuario de ejemplo',
  amount: calculateTotalAmount(req.cart && req.cart.products ? req.cart.products : []),
  products: (req.cart && req.cart.products) ? req.cart.products.map(product => product.productId) : [],
});
    res.status(200).json({ message: "Ticket generado con éxito", ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar el ticket' });
  }
});

// Funciones auxiliares
function generateTicketCode() {
  
  //  usa bibliotecas como 'uuid' para esto
}


  function calculateTotalAmount(products) {
    if (!products || products.length === 0) {
      return 0; // Si no hay productos o el carrito está vacío, el monto total es cero.
    }

    // Suma los precios de todos los productos en el carrito
    const totalAmount = products.reduce((total, product) => {
      // Asegúrate de que el producto tenga una propiedad 'price' válida
      if (product && typeof product.price === "number") {
        return total + product.price;
      }
      return total;
    }, 0);

    return totalAmount;
  }

  

//ruta para mostrar ticket
router.get("/ticket/:id", async (req, res) => {
  try {
    const ticket = await ticketModel.findById(req.params.id);
    if (!ticket){
      return res.status(404).json({ message: "Ticket no encontrado"});
    }
    //si acepta html
    if(req.accepts('html')) {
    console.log("Rendering ticket view");
    return res.status(200).render("ticket", { ticket });
    }
    
    //res.render("ticket", { ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al mostrar el ticket" });
  }
});

export default router