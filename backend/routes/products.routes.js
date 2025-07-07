import express from "express";
const router = express.Router();
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

import {
  creerProduit,
  listerTousLesProduits,
  produitsDisponibles,
  obtenirUnProduit,
  mettreAJourUnProduit,
  metterAJourLeStock,
  supprimerUnProduit,
  rechercheDeProduits,
} from "../controllers/produit.controllers.js";

// POST / - Créer un produit (admin seulement)
router.post("/", authenticateToken, requireAdmin, creerProduit);

// GET / - Lister tous les produits
router.get("/", listerTousLesProduits);

// GET /available - Produits disponibles
router.get("/available", produitsDisponibles);

// GET /search/:query - Recherche de produits
router.get("/search/:query", rechercheDeProduits);

// GET /:id - Obtenir un produit
router.get("/:id", obtenirUnProduit);

// PUT /:id - Mettre à jour un produit (admin seulement)
router.put("/:id", authenticateToken, requireAdmin, mettreAJourUnProduit);

// PATCH /:id/stock - Mettre à jour le stock (admin seulement)
router.patch("/:id/stock", authenticateToken, requireAdmin, metterAJourLeStock);

// DELETE /:id - Supprimer un produit (admin seulement)
router.delete("/:id", authenticateToken, requireAdmin, supprimerUnProduit);

export default router;