import { Router } from 'express';
import passport from 'passport';
import * as userController from '../controllers/UserController.js';

const router = Router()

//crear usuarios
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), (req, res) => {
  try 
    {
        const { first_name, last_name, email, age, password, rol }= req.body
        if (!first_name || !last_name || !email || !age)  return res.status(400).send({ status: 400, error: 'Faltan datos' })
        res.redirect("/login")
    } catch (error) 
    {
        res.status(500).send("Error al acceder al registrar: " + error.message);
    }
});

router.get("/failregister",async(req,res)=>{
    console.log("Fallo el registro")
    res.send({error: "Failed"})
})



router.post("/login", passport.authenticate("login", {failureRedirect:"/faillogin"}), async (req, res) => {
  try {
      if (!req.user) {
          return res.status(400).send({ status: "error", error: "Credenciales invalidas" });
      }

      // Guardar detalles del usuario en la sesión
      req.session.emailUsuario = req.user.email;
      req.session.rolUsuario = req.user.rol;

      if (req.user.rol === 'admin' || req.user.rol === 'premium') {
          // Redirige a los usuarios 'admin' y 'premium' al perfil
          req.session.nomUsuario = req.user.first_name;
          req.session.apeUsuario = req.user.last_name;
          res.redirect("/profile");
      } else {
          // Redirige a los otros usuarios a la lista de productos
          res.redirect("/products");
      }
  } catch (error) {
      res.status(500).send("Error al acceder al perfil: " + error.message);
  }
});



router.get("/faillogin",async(req,res)=>{
    res.send({error: "Failed Login"})
})


router.get("/logout", async (req, res) => {
    req.session.destroy((error) =>{
        if(error)
        {
            return res.json({ status: 'Logout Error', body: error})
        }
        res.redirect('/login')
    })    
})


//------------------------------ GITHUB
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
  req.session.user = req.user;
  res.redirect('/profile');
});

router.get('/login', async (req, res) => {
  res.render('login', {
    title: 'Vista Login',
  });
});
//------------------------------------------

router.get('/current', async (req, res, next) => {
  try {
    if (!req.session.emailUsuario) {
      return res.redirect('/login');
    }

    const { rol } = req.session;

    // Verificar permisos para las operaciones de administrador
    if (req.originalUrl.startsWith('/admin') && rol !== 'admin') {
      return res.status(403).send('No tienes permisos para acceder a esta ruta');
    }

    // Verificar permisos para las operaciones de usuario
    if (req.originalUrl.startsWith('/user') && rol !== 'user') {
      return res.status(403).send('No tienes permisos para acceder a esta ruta');
    }

    // Continuar con la operación si la autorización es exitosa
    next();
  } catch (error) {
    res.status(500).send({ status: 'error', error: 'Error en la autorización' });
  }
});


router.get('/users', userController.getUsers);
router.get('/users/:uid', userController.getUserById);



//restablecer contraseña
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password/:token', userController.resetPassword);

//cambiar rol de usuario
router.post('/change-role/:userId', userController.changeUserRole);

export default router;