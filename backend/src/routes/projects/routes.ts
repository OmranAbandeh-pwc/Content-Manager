import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectsController,
  updateProjectController,
} from "../../controllers/projects/projectsController";
import { validateBody } from "../../middlewares/validation";
import { createProjectSchema } from "../../schemas/projectSchema";

export const router = express.Router();

// Create project route
router.post(
  "/",
  authenticate,
  validateBody(createProjectSchema),
  createProjectController
);

// Get all projects route
router.get("/", authenticate, getProjectsController);

// Get one project route
router.get("/:id", authenticate, getProjectByIdController);

// Update project route
router.put("/:id", authenticate, updateProjectController);

// Delete project route
router.delete("/:id", authenticate, deleteProjectController);
