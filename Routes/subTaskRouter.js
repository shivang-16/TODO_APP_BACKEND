import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  createSubTask,
  deleteSubTask,
  editSubTask,
} from "../controller/subTaskController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create/:parentId", isAuthenticated, wrapAsync(createSubTask));
router
  .route("/:id")
  .patch(isAuthenticated, wrapAsync(editSubTask))
  .delete(isAuthenticated, wrapAsync(deleteSubTask));

export default router;
