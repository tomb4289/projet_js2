// routes.js
import express from "express";

import produitRoutes from "./products.routes.js";
import usersRoutes from "./users.routes.js";

const router = express.Router();

// Importer les différent router des routes

// Middleware de validation
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

router.get("/", (req, res) => {
  res.end("Coucou !");
});

router.use("/products", produitRoutes);
router.use("/users", usersRoutes);

export default router;
