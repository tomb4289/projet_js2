import fs from "fs/promises";
import path from "path";
import { v7 as uuidv7 } from "uuid";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class JSONArrayDatabase {
  constructor(filename) {
    this.filepath = path.join(__dirname, "../data", filename);
    this.data = [];
  }

  async #load() {
    try {
      const fileContent = await fs.readFile(this.filepath, "utf-8");
      this.data = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.save();
      } else {
        console.error(`Error loading database ${this.filepath}:`, error);
        this.data = [];
      }
    }
  }

  static async createAndLoad(filename) {
    const db = new JSONArrayDatabase(filename);
    await db.#load();
    return db;
  }

  async save() {
    try {
      await fs.writeFile(
        this.filepath,
        JSON.stringify(this.data, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error(`Error saving database ${this.filepath}:`, error);
    }
  }

  async insert(item) {
    const newItem = {
      ...item,
      id: uuidv7(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.push(newItem);
    await this.save();
    return newItem;
  }

  async update(id, updates) {
    const index = this.data.findIndex((item) => item.id == id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates };
      await this.save();
      return this.data[index];
    }
    return null;
  }

  async delete(id) {
    const index = this.data.findIndex((item) => item.id == id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      await this.save();
      return deleted;
    }
    return null;
  }

  async findById(id) {
    return this.data.find((item) => item.id == id) || null;
  }

  async findByEmail(email) {
    return this.data.find((item) => item.email === email) || null;
  }

  async findAll() {
    return [...this.data];
  }
}
