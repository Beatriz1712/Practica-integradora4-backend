import CartDao from "../DAO/classes/CartDao.js"
import mongoose from "mongoose"
import { v4 as uuidv4} from "uuid"
import UserDao from "../DAO/classes/UserDao.js"

//se instancia la clase del carrito 
const cartDao = new CartDao();
const userDao = new UserDao()

class CartController{

//INCOMPLETOOOOruta para sacar el id del carrito del usuario para usar con el boton micarrito INCOMPLETOOOO
async getUserCart(req, res) {
    console.log("paso1funcion");
    try {
        console.log("FUNCA");
        // Obtener el correo electrónico del usuario desde req.user
        const userEmail = req.user.email;
        console.log(userEmail);

        // Resto del código para obtener el carrito...
        // Buscar al usuario en la base de datos usando el correo electrónico
        const user = await userDao.getUserByEmail(userEmail);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtener el ID del carrito del usuario encontrado
        const cartId = user.carrito;
        console.log("Valor de user.carrito:", user.carrito);
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).json({ message: 'ID de carrito no válido' });
        }

        // Buscar el carrito utilizando el ID obtenido
        const cart = await cartDao.getCartById(cartId);
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error('Error al obtener el carrito del usuario:', error);
        return res.status(500).json({ message: 'Error al obtener el carrito del usuario.' });
    }
}


// funcion para obtener todos los carritos
async getAllCarts(req, res) {
    // try catch pa manejo de errores
    try {
        // se guarda en la constante de nombre carts todos los carritos de la base de datos con la funcion getallcarts
        const carts = await cartDao.getAllCarts(); 
        // se aplica una condicional donde: si !NO se encuentran los carritos retorna un error y se corta la condicion con el mismo return 
        if (!carts) {
            return res.status(404).json({ message: "No se encontraron carritos" });
        }
        // de lo contrario muestra todos los carritos
        return res.json(carts);
    } catch (error) {
        //si nada funciona se muestra el error maximo
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un 33-12" });
    }
}

//funcion para crear un carrito
async createCart(req, res) {
    try {
        const newCart = req.body;
        const cart = await cartDao.createCart(newCart);
        if (!cart) {
            return res.status(500).json({ message: "Error al crear el carrito" });
        }
        return res.json({ message: "Carrito creado", cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un 33-12" });
    }
}

// funcion para añadir un producto especifico a un carrito especifico 

async addProductsToCart(req, res) {
    try {
        const cartId = req.params.cid;
        const products = req.body; // Espera un array de productos

        // Verifica si products es un array y no está vacío
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Formato de productos no válido" });
        }

        // Verifica cada producto del array
        for (const product of products) {
            const { productId, quantity } = product;
            if (quantity < 1) {
                return res.status(400).json({ message: "La cantidad debe ser 1 o más" });
            }
        }

        // Llama a la función de DAO para agregar productos al carrito
        const result = await cartDao.addProductsToCart(cartId, products);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: error.message });
    }
}

async addProductToCart(req, res) {
    try {
        // en la logica se obtiene el id del carrito + id del producto especifico y se agrega el producto al carrito si todo funciona bien 
        const cartId = req.params.cid;
        const productIds = req.body.productIds;
        const result = await cartDao.addProductToCart(cartId, productIds);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un 33-12" });
    }
}

// contador (cantidad) de un producto en un carrito
async updateProductQuantity(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        const result = await cartDao.updateProductQuantity(cartId, productId, newQuantity);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un 33-12" });
    }
}

// borrar un carrito especifico
async deleteCartById(req, res) {
    try {
        const cartId = req.params.id;
        const result = await cartDao.deleteCartById(cartId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar el carrito" });
    }
}

// limpiar un carrito especifico segun id (del carrito)
async deleteAllProductsInCart(req, res) {
    try {
        const cartId = req.params.cid;
        const result = await cartDao.deleteAllProductsInCart(cartId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar los productos del carrito" });
    }
}

// eliminar un producto especifico de un carrito especifico (id de carrito / id de producto)
async deleteProductFromCart(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const result = await cartDao.deleteProductFromCart(cartId, productId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar el producto del carrito" });
    }
}

// funcion para generar un codigo aleatorio
async generateUniqueCode() {
    return uuidv4();
}

//completar compra del carrito
async purchaseProducts(req, res) {
    const cartId = req.params.cid;
    const userEmail = req.user.email;

    try {
        // Lógica para obtener los productos del carrito...
        const cartProducts = await cartDao.getCartProducts(cartId); // Función para obtener los productos del carrito
        
        // Verificar el stock de cada producto en el carrito en la base de datos
        const stock = await cartDao.checkStock(cartProducts);

        if (stock && stock.success === false) {
            return res.status(400).json({ message: stock.message });
        }

        // Calcular el total de todos los productos
        const total = calculateTotal(cartProducts);
        const currentDate = new Date();
        // Crear un ticket único con el total y otras características
        const ticketData = {
            code: generateUniqueCode(),
            purchaser: userEmail,
            amount: total,
            products: cartProducts, // Aquí irían los productos del carrito
            purchase_datetime: currentDate, 
            
        };

        // Guardar el ticket en la base de datos usando el DAO
        const createdTicket = await cartDao.createTicket(ticketData);

        if(createdTicket){
            await cartDao.deleteAllProductsInCart(cartId);
        }

        return res.status(200).json({ ticket: createdTicket });
    } catch (error) {
        console.error("Error al comprar productos del carrito:", error);
        return res.status(500).json({ message: 'Error al comprar productos del carrito.' });
    }
}

async calculateTotal(cartProducts) {
    let total = 0;
    for (const product of cartProducts) {
        // Suponiendo que cada producto tiene un campo de 'price'
        total += product.price * product.quantity;
    }
    return total;
}
}

export default CartController;

/* router.post("/add", async (req, res) => {
  try {
    // Lógica para agregar un carrito...
    const result = await cartManager.addCarts();
    res.status(200).json({ status: "success", message: result });
  } catch (error) {
    console.error("Error al agregar el carrito:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});





export default router;
 */