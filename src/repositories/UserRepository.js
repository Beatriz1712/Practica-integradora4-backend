import { usersModel } from '../DAO/models/users.model.js';

class UserRepository {
  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      const users = await usersModel.find({});
      return users;
    } catch (error) {
      throw new Error('Error al obtener usuarios');
    }
  }

  // Obtener un usuario por ID
  async getUserById(userId) {
    try {
      const user = await usersModel.findById(userId);
      return user;
    } catch (error) {
      throw new Error('Error al obtener usuario por ID');
    }
  }

  // Crear un nuevo usuario
  async createUser(userData) {
    try {
      const newUser = new usersModel(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error('Error al crear usuario');
    }
  }

  // Actualizar un usuario existente
  async updateUser(userId, updatedUserData) {
    try {
      const updatedUser = await usersModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
      return updatedUser;
    } catch (error) {
      throw new Error('Error al actualizar usuario');
    }
  }

  // Eliminar un usuario por ID
  async deleteUser(userId) {
    try {
      const deletedUser = await usersModel.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw new Error('Error al eliminar usuario');
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await usersModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error('Error al obtener usuario por email');
    }
  }


  //modificar rol de usuario
  async updateUserRole(userId, newRole) {
    try {
        const updatedUser = await usersModel.findByIdAndUpdate(
            userId, 
            { rol: newRole },
            { new: true }
        );
        return updatedUser;
    } catch (error) {
        throw new Error('Error al actualizar el rol del usuario: ' + error.message);
    }
}

}

export default UserRepository;