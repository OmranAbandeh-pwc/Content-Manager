import { Request, Response, NextFunction } from "express";
import { projectService } from "../../services/projectsService";
import { CreateProject, UpdateProject } from "../../schemas/projectSchema";
import { AppError } from "../../utils/AppError";

// Create new project
export const createProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Validate request body
    const projectData: CreateProject = req.body;

    if (!projectData.projectName) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!projectData.projectType) {
      return res.status(400).json({
        success: false,
        message: "Project type is required (API, WEB, or BOTH)",
      });
    }

    // Validate project_type
    if (!["API", "WEB", "BOTH"].includes(projectData.projectType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project type. Must be API, WEB, or BOTH",
      });
    }

    // Validate status if provided
    if (
      projectData.status &&
      !["ACTIVE", "ARCHIVED"].includes(projectData.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be ACTIVE, ARCHIVED, or INACTIVE",
      });
    }

    // Create project
    const project = await projectService.createProject({
      user_id: userId,
      project_name: projectData.projectName,
      description: projectData.description,
      project_type: projectData.projectType,
      status: projectData.status,
      last_test_date: projectData.lastTestDate
        ? new Date(projectData.lastTestDate)
        : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Get all projects by userid
export const getProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const projects = await projectService.getProjectsByUserId(userId);

    // Handle empty results gracefully
    if (!projects || projects.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No projects found",
        data: [],
        count: 0,
      });
    }

    return res.status(200).json({
      // 200 for GET, not 201
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get single project by ID
export const getProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const project = await projectService.getProjectById(Number(id));

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Update project
export const updateProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const updates: UpdateProject = req.body;

    const updatedProject = await projectService.updateProject(
      Number(id),
      userId,
      updates
    );

    if (!updatedProject) {
      throw new AppError("Project not found or unauthorized", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    projectService.deleteProject(Number(id), userId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
