import fs from 'fs';
import __dirname from '../../utils.js';
import path from 'path';

const usersFilePath = path.join(__dirname, '../models/users.json');


class UserDao {
  static getAllUsers() {
    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(usersData);
  }

  static getUserById(userId) {
    const users = this.getAllUsers();
    return users.find(user => user.id === userId);
  }

  static createUser(user) {
    const users = this.getAllUsers();
    const newUser = { id: generateUserId(), ...user };
    users.push(newUser);
    this.writeUsersToFile(users);
    return newUser;
  }

  static updateUser(userId, updatedUser) {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      this.writeUsersToFile(users);
      return users[index];
    }
    return null; // User not found
  }

  static deleteUser(userId) {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    if (filteredUsers.length < users.length) {
      this.writeUsersToFile(filteredUsers);
      return true; // Deletion successful
    }
    return false; // User not found
  }

  static writeUsersToFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  }
}

function generateUserId() {
  // Implement your logic for generating unique user IDs
  // This is just a placeholder
  return Math.random().toString(36).substr(2, 9);
}

export default UserDao;
