import express from "express";
const router = express.Router();
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

import {
  creerUnUtilisateur,
  listerTousLesUtilisateurs,
  obtenirUnUtilisateur,
  mettreAJourUnUtilisateur,
  supprimerUnUtilisateur,
  trouverParEmail,
} from "../controllers/user.controllers.js";

// POST / - Créer un utilisateur (admin seulement)
router.post("/", authenticateToken, requireAdmin, creerUnUtilisateur);

// GET / - Lister tous les utilisateurs (admin seulement)
router.get("/", authenticateToken, requireAdmin, listerTousLesUtilisateurs);

// GET /:id - Obtenir un utilisateur (admin seulement)
router.get("/:id", authenticateToken, requireAdmin, obtenirUnUtilisateur);

// PUT /:id - Mettre à jour un utilisateur (admin seulement)
router.put("/:id", authenticateToken, requireAdmin, mettreAJourUnUtilisateur);

// DELETE /:id - Supprimer un utilisateur (admin seulement)
router.delete("/:id", authenticateToken, requireAdmin, supprimerUnUtilisateur);

// GET /email/:email - Trouver par email (admin seulement)
router.get("/email/:email", authenticateToken, requireAdmin, trouverParEmail);

export default router;
