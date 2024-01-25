import multer from 'multer';
import __dirname from '../utils.js'; // Ajusta la ruta si es necesario

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = __dirname + '/public/files'; // Asegúrate de que la ruta es correcta
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({ storage: storage });


const upload = uploader.fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobanteDomicilio', maxCount: 1 },
    { name: 'estadoCuenta', maxCount: 1 }
  ]);
  
  export { upload };