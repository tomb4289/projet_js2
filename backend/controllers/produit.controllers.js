import Product from "../database/models/Product.js";

export const creerProduit = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listerTousLesProduits = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const produitsDisponibles = async (req, res) => {
  try {
    const products = await Product.findAvailable();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenirUnProduit = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const mettreAJourUnProduit = async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const metterAJourLeStock = async (req, res) => {
  try {
    const { action, quantity } = req.body;
    let qty = parseInt(quantity) || 0;

    if (action === "decrement") qty = -qty;
    else if (action !== "increment") {
      return res
        .status(400)
        .json({ error: "Action doit être 'increment' ou 'decrement'" });
    }

    const product = await Product.updateStock(req.params.id, qty);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const supprimerUnProduit = async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Produit non trouvé" });
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rechercheDeProduits = async (req, res) => {
  try {
    const products = await Product.search(req.params.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
