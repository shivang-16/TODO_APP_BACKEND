import express from "express";
import {
  createTask,
  getMyTask,
  editTask,
  deleteTask,
} from "../controller/taskController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTask);
router.post("/my", isAuthenticated, getMyTask);
router.route("/:id").patch(editTask).delete(deleteTask);
export default router;
