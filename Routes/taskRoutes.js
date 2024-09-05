import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  createTask,
  getMyTask,
  editTask,
  deleteTask,
} from "../controller/taskController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, wrapAsync(createTask));
router.get("/my", isAuthenticated, wrapAsync(getMyTask));
router
  .route("/:id")
  .patch(isAuthenticated, wrapAsync(editTask))
  .delete(isAuthenticated, wrapAsync(deleteTask));

export default router;
