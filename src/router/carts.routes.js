import { Router } from "express";
import CartManager from "../controllers/CartManager.js";
import { isAuthenticated } from '../config/middlewares.js';
import CartRepository from "../repositories/CartRepository.js";
import CartController from "../controllers/CartController.js";
import passport from "../config/middlewares.js";

const router = Router()
const cartManager = new CartManager()
const cartRepository = new CartRepository();
const cartController = new CartController()


// CARRITO
//obtener todos los carritos
router.get("/", async (req, res) => {
    try {
      const carts = await cartManager.getAllCarts();
      res.send({ result: "success", payload: carts });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: "Error al obtener carritos" });
    }
  });

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
      const result = await cartManager.addCart();
      res.send({ result: "success", payload: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: "Error al crear carrito" });
    }
  });

// put
router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCart = req.body;
      const result = await cartManager.updateCart(id, updatedCart);
      res.send({ result: "success", payload: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: "Error al actualizar carrito" });
    }
  });

// Eliminar un carrito por ID
router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await cartManager.deleteCart(id);
      res.send({ result: "success", payload: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: "Error al eliminar carrito" });
    }
  });




// PRODUCTOS DENTRO DE CARRITO
// Verificar si un producto está en el carrito
router.get("/cart/:cid/products/:pid", async (req, res) => {
    console.log("entro a get");
    console.log(req.params);
    const cartId = req.params.cid;  // Obtener cartId de los parámetros de la URL
    const prodId = req.params.pid;  // Obtener prodId de los parámetros de la URL
  
    try {
      const result = await carts.existProductInCart(cartId, prodId);
  
      res.send({ result: "success", payload: result });
    } catch (error) {
      console.error("Error al verificar el producto en el carrito:", error);
      res.status(500).send({ status: "error", error: "Error al verificar el producto en el carrito" });
    }
  });
  
// Agregar productos a un carrito -- :cid es el id del carrito y :pid es el id del producto
router.post("/:cid/products/:pid", async (req, res) => {
    console.log(req.params);
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    let { product_id, quantity } = req.body; 

    try {
        const result = await cartManager.addProductInCart(cartId, prodId, product_id, quantity);

        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al agregar productos al carrito:", error);
        res.status(500).send({ status: "error", error: "Error al agregar productos al carrito" });
    }
});

// Modificar productos de un carrito
router.put("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    let { product_id, quantity } = req.body;

    try {
        const result = await cartManager.updateProductInCart(cartId, prodId, product_id, quantity);

        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al modificar productos en el carrito:", error);
        res.status(500).send({ status: "error", error: "Error al modificar productos en el carrito" });
    }
});

// Eliminar productos de un carrito
router.post("/cart/:cid/products/:pid", async (req, res) => {
  console.log("entro a delete");
  console.log(req.params);
  let cartId = req.params.cid;
  let productId = req.params.pid;

  try {
    const result = await cartManager.removeProductFromCart(cartId, productId);
    res.redirect("/cart");
    //res.send({ result: "success", payload: result });
  } catch (error) {
    console.error("Error al eliminar productos del carrito:", error);
    res.status(500);
    send({
      status: "error",
      error: "Error al eliminar productos del carrito",
    });
  }
});



//Population
//Traemos todos los carritos con http://localhost:8080/api/carts con get
router.get("/population/:cid", async (req,res)=>{
    let cartId = req.params.cid
    res.send(await cartManager.getCartWithProducts(cartId))
})



router.post("/create-cart", isAuthenticated, async (req, res) => {
  try {
    // Obtener el ID del usuario logueado desde la sesión
    const userId = req.user._id; // Asumiendo que puedes obtener el ID del usuario de la sesión

    // Lógica para crear un carrito asociado al usuario
    const result = await cartRepository.createCartForUser(userId);

    res.status(200).json({ status: "success", message: "Nuevo carrito creado", cart: result });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ status: "error", message: "Error al crear el carrito" });
  }
});


router.post("/add-to-cart/:productId", isAuthenticated, async (req, res) => {
  try {
     console.log(req.body);
     console.log(req.user._id);
     const userId = req.user._id; // Asegúrate de que el usuario esté autenticado para tener este valor
     const productId = req.params.productId;
     const { quantity } = req.body;

     // Llamada al método del repositorio para agregar el producto al carrito
     const cart = await cartRepository.addProductToUserCart(
       userId,
       productId,
       quantity
     );
     console.log(cart);
     res.redirect("/cart"); 
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ status: "error", message: "Error al agregar el producto al carrito" });
  }
});

router.delete("/api/deleteproductcarts/:cid", cartController.deleteAllProductsInCart); // borrar todos los productos del un carrito


router.get("/api/carts/:cid/purchase", passport.authenticate('current', { session: false }), isAuthenticated, cartController.purchaseProducts); 
// realizar la compra total de los productos del carrito

export default router;