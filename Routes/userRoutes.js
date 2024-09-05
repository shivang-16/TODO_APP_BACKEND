import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  register,
  login,
  logout,
  deleteUser,
  getMyProfile,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", wrapAsync(register));
router.post("/login", wrapAsync(login));
router.get("/logout", wrapAsync(logout));
router.get("/profile", isAuthenticated, wrapAsync(getMyProfile));
router.delete("/delete", isAuthenticated, wrapAsync(deleteUser));

export default router;
