import JSONArrayDatabase from "../JSONArrayDatabase.js";

const productsDBPromise = JSONArrayDatabase.createAndLoad("products.json");

export default class Product {
  static async create(movieData) {
    const productsDB = await productsDBPromise;
    if (!movieData.title || !movieData.poster || !movieData.description) {
      throw new Error("Titre, poster et description sont obligatoires");
    }
    return productsDB.insert(movieData);
  }

  static async findById(id) {
    const productsDB = await productsDBPromise;
    return productsDB.findById(id);
  }

  static async findAll() {
    const productsDB = await productsDBPromise;
    return productsDB.findAll();
  }

  static async update(id, updates) {
    const productsDB = await productsDBPromise;
    const existing = await productsDB.findById(id);
    if (!existing) {
      throw new Error("Film non trouvé");
    }

    const updatedData = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return productsDB.update(id, updatedData);
  }

  static async delete(id) {
    const productsDB = await productsDBPromise;
    return productsDB.delete(id);
  }

  static async searchByTitle(searchTerm) {
    const productsDB = await productsDBPromise;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return productsDB.data.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (movie.description &&
          movie.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }
}
