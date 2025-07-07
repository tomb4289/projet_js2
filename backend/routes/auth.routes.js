import express from "express";
const router = express.Router();

import {
  login,
  register,
  getProfile,
  updateProfile
} from "../controllers/auth.controllers.js";
import { authenticateToken } from "../middleware/auth.js";

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

export default router;