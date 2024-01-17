import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = async (password, hash) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Error al comparar contraseñas');
    }
  };

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname