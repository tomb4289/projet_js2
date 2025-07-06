import express from "express";
const router = express.Router();

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

// POST / - Créer un produit
router.post("/", creerProduit);

// GET / - Lister tous les produits
router.get("/", listerTousLesProduits);

// GET /available - Produits disponibles
router.get("/available", produitsDisponibles);

// GET /search/:query - Recherche de produits (MUST be before /:id)
router.get("/search/:query", rechercheDeProduits);

// GET /:id - Obtenir un produit
router.get("/:id", obtenirUnProduit);

// PUT /:id - Mettre à jour un produit
router.put("/:id", mettreAJourUnProduit);

// PATCH /:id/stock - Mettre à jour le stock
router.patch("/:id/stock", metterAJourLeStock);

// DELETE /:id - Supprimer un produit
router.delete("/:id", supprimerUnProduit);

export default router;