import JSONArrayDatabase from "../JSONArrayDatabase.js";

const usersDBPromise = JSONArrayDatabase.createAndLoad("users.json");

export default class User {
  static async create(userData) {
    const usersDB = await usersDBPromise;
    const existingUser = await usersDB.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    return usersDB.insert(userData);
  }

  static async findByEmail(email) {
    const usersDB = await usersDBPromise;
    return usersDB.findByEmail(email);
  }

  static async update(id, updates) {
    const usersDB = await usersDBPromise;
    if (updates.email) {
      const existingUser = await usersDB.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already in use");
      }
    }
    return usersDB.update(id, updates);
  }

  static async delete(id) {
    const usersDB = await usersDBPromise;
    return usersDB.delete(id);
  }

  static async findById(id) {
    const usersDB = await usersDBPromise;
    return usersDB.findById(id);
  }

  static async findAll() {
    const usersDB = await usersDBPromise;
    return usersDB.findAll();
  }
}
