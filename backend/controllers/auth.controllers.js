import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../database/models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    if (!user.estActif) {
      return res.status(401).json({ error: 'Compte désactivé' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, nom, role = 'client' } = req.body;

    if (!email || !password || !nom) {
      return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      nom,
      role,
      estActif: true
    };

    const user = await User.create(userData);
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.update(req.user.id, updates);
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profil mis à jour avec succès',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};