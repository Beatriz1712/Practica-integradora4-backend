import { Router } from "express";
import { productsModel } from "../DAO/models/products.model.js";
import ProductManager  from "../controllers/ProductManager.js"
import ProductController from '../controllers/ProductController.js';
import { isAdmin } from '../config/middlewares.js';
import { isAdminOrPremium } from '../config/middlewares.js';
import { manejarError } from "../config/errores.js";
const router = Router()
const productManager = new ProductManager()



  //Carga de productos desde el front
  router.post('/add', isAdminOrPremium, ProductController.createProduct);


//get
router.get("/", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.send({ result: "success", payload: products });
    } catch (error) {
        const mensajeError = manejarError('ERROR_OBTENER_PRODUCTOS');
        res.status(500).json({ status: "error", error: mensajeError });
    }
  });
  
//get producto por id
router.get("/:id", async (req, res) => {
    try {
      const prodId = req.params.id;
      const productDetails = await productManager.getProductById(prodId);
  
      if (productDetails) {
        res.send({ product: productDetails });
      } else {
        const mensajeError = manejarError('PRODUCTO_NO_ENCONTRADO');
        res.status(404).json({ error: mensajeError });
      }
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      const mensajeError = manejarError('ERROR_OBTENER_PRODUCTO');
      res.status(500).json({ error: mensajeError });
    }
  });


//put
router.put("/:id_products", async(req,res)=> {
    let{id_products} = req.params

    let productsToReplace = req.body
    if(!productsToReplace.title || !productsToReplace.description || !productsToReplace.price || !productsToReplace.stock || !productsToReplace.category ||!productsToReplace.thumbnails || !productsToReplace.carru1 || !productsToReplace.carru2 || !productsToReplace.carru3 || !productsToReplace.minimo || !productsToReplace.availability){
        res.send({status: "error", error: "no hay datos en parametros"})
    }
    let result = await productsModel.updateOne({_id: id_products}, productsToReplace)
    res.send({result: "success", payload: result})
})

//delete
router.delete("/:id_products", async(req,res)=>{
    let{id_products}= req.params
    let result = await productsModel.deleteOne({_id: id_products})
    res.send({ result: "success", payload:result})
})

// Endpoints opcionales
router.get("/limit/:limit" , async (req,res) => {
    let limit = parseInt(req.params.limit)
    if (isNaN(limit) || limit <= 0){
        limit = 10
    } res.send( await products.getProductsByLimit(limit))
})

router.get("/page/:page" , async (req,res) => {
    let page = parseInt(req.params.page)
    if (isNaN(page) || page <= 0){
        page = 1
    } 
    const productsPerPage = 1
    res.send( await products.getProductsByPage(page, productsPerPage))
})

router.get("/buscar/query", async(req,res) =>{
    const query = req.query.q
    res.send(await product.getProductsByQuery(query))
})



//info
router.get("/info", async (req, res) => {
    let sortOrder = req.query.sortOrder; 
    let category = req.query.category; 
    let availability = req.query.availability; 
    if(sortOrder === undefined){
        sortOrder = "asc"
    }
    if(category === undefined){
        category = ""
    }
    if(availability === undefined){
        availability = ""
    }
    res.send(await products.getProductsMaster(null,null,category,availability, sortOrder))
})


//modificar productos desde explorador
router.post('/update/:id', isAdminOrPremium, ProductController.updateProductById);

router.post('/delete/:id', isAdminOrPremium, (req, res) => {
  if (req.body._method === 'DELETE') {
      ProductController.deleteProductById(req, res);
  } else {
      // Manejar otros casos o devolver un error
      res.status(400).send('Operación no válida');
  }
});

export default router

