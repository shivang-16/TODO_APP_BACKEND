import express from "express";
import { createSubTask, deleteSubTask, editSubTask } from "../controller/subTaskController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create/:parentId", isAuthenticated, createSubTask);
router.route("/:id").patch(editSubTask).delete(deleteSubTask);

export default router;
