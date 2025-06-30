import express from "express";
const router = express.Router();

import {
  creerProduit,
  listerTousLesProduits,
  obtenirUnProduit,
  mettreAJourUnProduit,
  supprimerUnProduit,
  rechercheDeProduits,
} from "../controllers/produit.controllers.js";

router.post("/", creerProduit);

router.get("/", listerTousLesProduits);

router.get("/:id", obtenirUnProduit);

router.put("/:id", mettreAJourUnProduit);

router.delete("/:id", supprimerUnProduit);

router.get("/search", rechercheDeProduits);

export default router;
