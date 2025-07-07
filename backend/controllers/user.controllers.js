import User from "../database/models/User.js";
import bcrypt from 'bcrypt';

export const creerUnUtilisateur = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
      }
      userData.password = await bcrypt.hash(password, 10);
    }
    
    userData.estActif = true;
    
    const user = await User.create(userData);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listerTousLesUtilisateurs = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenirUnUtilisateur = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const mettreAJourUnUtilisateur = async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
      }
      updates.password = await bcrypt.hash(password, 10);
    }
    
    const user = await User.update(req.params.id, updates);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const supprimerUnUtilisateur = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const trouverParEmail = async (req, res) => {
  try {
    const user = await User.findByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
