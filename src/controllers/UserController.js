import UserRepository from '../repositories/UserRepository.js';
import passport from 'passport';
import { generatePasswordResetToken } from '../config/token.js'
import { sendEmail } from '../config/nodemailer.js';
import jwt from 'jsonwebtoken'
import { createHash } from '../utils.js';

const userRepository = new UserRepository();

export const getUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.send({ status: 'success', result: users });
  } catch (error) {
    res.status(500).send({ status: 'error', error: 'Error al obtener usuarios' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userRepository.getUserById(uid);
    res.send({ status: 'success', result: user });
  } catch (error) {
    res.status(500).send({ status: 'error', error: 'Error al obtener usuario por ID' });
  }
};



// Función para manejar el inicio de sesión
export const loginUser = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
      try {
          if (err || !user) {
              return res.status(401).send(info && info.message ? info.message : 'Error de autenticación');
          }
         req.login(user, async (err) => {
           if (err) {
             return next(err);
           }
           await userRepository.updateUser(user._id, {last_connection: new Date() }); //actualiza la ultima conexion del usuario
           return res.redirect("/profile"); // Redirige al usuario a /profile después de iniciar sesión
         });  
      } catch (error) {
          return next(error);
      }
  })(req, res, next);
};


export const requestPasswordReset= async (req, res) => {
  const { email } = req.body;
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
      return res.status(404).send('Usuario no encontrado');
  }

  const resetToken = generatePasswordResetToken(user.id);
    const resetLink = `http://localhost:8080/reset-password/${resetToken}`;
    const emailOptions = {
        from: 'tu-email@ejemplo.com',
        to: user.email,
        subject: 'Restablecimiento de contraseña',
        html: `<p>Para restablecer tu contraseña, por favor haz clic en el siguiente enlace: <a href="${resetLink}">${resetLink}</a></p>`
    };

    try {
        await sendEmail(emailOptions);
        res.render('emailsent');
        // return res.status(200).send('Correo enviado');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al enviar el correo');
    }
}

export const resetPassword = async (req, res) => {
  try {
      const { token, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
          return res.status(400).send('Las contraseñas no coinciden');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET); 

      const user = await userRepository.getUserById(decoded.userId);
      if (!user) {
          return res.status(404).send('Usuario no encontrado');
      }

      // Actualizar la contraseña del usuario
      const hashedPassword = createHash(password); 
      await userRepository.updateUser(user.id, { password: hashedPassword });

      res.render('passreset');
      //res.send('Contraseña actualizada con éxito');
  } catch (error) {
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).send('Token inválido o expirado');
      }
      console.error(error);
      res.status(500).send('Error al restablecer la contraseña');
  }
};


//mostrar todos los usuarios
export const getUsersAndView = async (req, res) => {
  try {
      const users = await userRepository.getAllUsers();
      const usersWithRoles = users.map(user => {
          return {
              ...user.toObject(), // Convierte el documento de Mongoose a un objeto
              isUserRole: user.rol === 'user',
              isAdminRole: user.rol === 'admin',
              isPremiumRole: user.rol === 'premium'
          };
      });
      res.render('allusers', { users: usersWithRoles });
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).send('Error al obtener usuarios');
  }
};

//cambio de rol desde el admin
export const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  try {
      // Lógica para actualizar el rol del usuario
      await userRepository.updateUserRole(userId, newRole);
      res.redirect('/allusers'); // Redireccionar de nuevo a la lista de usuarios
  } catch (error) {
      console.error('Error al actualizar el rol:', error);
      res.status(500).send('Error al actualizar el rol del usuario');
  }
};
//actualizar a usuario premium
export const updateToPremium = async (req, res) => {
  console.log("UID recibido:", req.params)
  try {
    const { uid } = req.params;
    const user = await userRepository.getUserById(uid);

    // Documentos requeridos
    const requiredDocs = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];

    const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    // Verifica si cada documento requerido está presente
    const allDocsUploaded = requiredDocs.every(doc =>
      user.documents.some(userDoc => normalizeString(userDoc.name) === normalizeString(doc))
    );


    if (!allDocsUploaded) {
      console.log("Documentos cargados por el usuario:", user.documents);
      console.log("Documentos requeridos que no se encontraron:", requiredDocs.filter(doc => !user.documents.some(userDoc => userDoc.name === doc)));
      // Si falta algún documento, no permite el cambio a premium
      return res.status(400).json({ success: false, message: 'Faltan documentos para ser usuario premium.' });
    }

    // Cambia el rol del usuario a 'premium'
    user.rol = 'premium';
    await user.save();

    // Envía una respuesta indicando el éxito de la operación
    res.json({ success: true, message: 'Usuario actualizado a premium.', user: user });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).send('Error al actualizar el usuario.');
  }
};


export const uploadDocuments = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No se han subido archivos');
  }

  try {
    const userId = req.params.uid;
    const user = await userRepository.getUserById(userId);

    // Renombra los archivos subidos según los campos del formulario
    const updatedDocuments = [];
    if (req.files.identificacion) {
      updatedDocuments.push({ name: 'Identificación', reference: req.files.identificacion[0].path });
    }
    if (req.files.comprobanteDomicilio) {
      updatedDocuments.push({ name: 'Comprobante de domicilio', reference: req.files.comprobanteDomicilio[0].path });
    }
    if (req.files.estadoCuenta) {
      updatedDocuments.push({ name: 'Comprobante de estado de cuenta', reference: req.files.estadoCuenta[0].path });
    }

    // Agrega los documentos actualizados al usuario
    user.documents.push(...updatedDocuments);
    await user.save();

    res.redirect('/confirmar-premium');
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).send('Error interno del servidor');
  }
};

