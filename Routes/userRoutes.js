import express from "express";
import {
  register,
  login,
  logout,
  deleteUser,
  getMyProfile,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getMyProfile);
router.delete("/delete", isAuthenticated, deleteUser);

export default router;
