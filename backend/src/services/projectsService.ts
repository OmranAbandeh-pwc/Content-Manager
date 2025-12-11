import { queryDatabase } from "../db/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { AppError } from "../utils/AppError";

interface CreateProjectData {
  user_id: number;
  project_name: string;
  description?: string;
  project_type: "API" | "WEB" | "BOTH";
  status?: "ACTIVE" | "ARCHIVED" | "INACTIVE";
  last_test_date?: Date;
}

interface ProjectResponse {
  id: number;
  user_id: number;
  project_name: string;
  description: string | null;
  project_type: "API" | "WEB" | "BOTH";
  status: string;
  last_test_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface ProjectRow extends RowDataPacket {
  id: number;
  user_id: number;
  project_name: string;
  description: string | null;
  project_type: "API" | "WEB" | "BOTH";
  status: string;
  last_test_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class ProjectService {
  /**
   * Create a new project
   */
  async createProject(
    projectData: CreateProjectData
  ): Promise<ProjectResponse> {
    const {
      user_id,
      project_name,
      description,
      project_type,
      status = "ACTIVE",
      last_test_date,
    } = projectData;

    // Validate required fields
    if (!project_name || !user_id || !project_type) {
      throw new Error("PROJECT_MISSING_REQUIRED_FIELDS");
    }

    // Validate project_type
    if (!["API", "WEB", "BOTH"].includes(project_type)) {
      throw new Error("INVALID_PROJECT_TYPE");
    }

    // Validate status
    if (!["ACTIVE", "ARCHIVED", "INACTIVE"].includes(status)) {
      throw new Error("INVALID_STATUS");
    }

    // Insert project
    const result = await queryDatabase(
      `INSERT INTO projects (user_id, project_name, description, project_type, status, last_test_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        project_name,
        description || null,
        project_type,
        status,
        last_test_date || null,
      ]
    );

    const insertResult = result as ResultSetHeader;
    const projectId = insertResult.insertId;

    // Fetch the created project
    const createdProject = await this.getProjectById(projectId);

    if (!createdProject) {
      throw new Error("PROJECT_CREATION_FAILED");
    }

    return createdProject;
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: number): Promise<ProjectResponse | null> {
    const result = await queryDatabase(
      `SELECT id, user_id, project_name, description, project_type, status, 
              last_test_date, created_at, updated_at 
       FROM projects WHERE id = ?`,
      [projectId]
    );

    const rows = result as ProjectRow[];

    if (rows.length === 0) {
      throw new AppError("Project not found", 404);
    }

    return rows[0];
  }

  /**
   * Get all projects for a user
   */
  async getProjectsByUserId(userId: number): Promise<ProjectResponse[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, project_name, description, project_type, status, 
              last_test_date, created_at, updated_at 
       FROM projects WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    return result as ProjectResponse[];
  }

  /**
   * Get projects by type
   */
  async getProjectsByType(
    userId: number,
    projectType: "API" | "WEB" | "BOTH"
  ): Promise<ProjectResponse[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, project_name, description, project_type, status, 
              last_test_date, created_at, updated_at 
       FROM projects WHERE user_id = ? AND project_type = ? ORDER BY created_at DESC`,
      [userId, projectType]
    );

    return result as ProjectResponse[];
  }

  /**
   * Get projects by status
   */
  async getProjectsByStatus(
    userId: number,
    status: "ACTIVE" | "ARCHIVED" | "INACTIVE"
  ): Promise<ProjectResponse[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, project_name, description, project_type, status, 
              last_test_date, created_at, updated_at 
       FROM projects WHERE user_id = ? AND status = ? ORDER BY created_at DESC`,
      [userId, status]
    );

    return result as ProjectResponse[];
  }

  /**
   * Update project
   */
  async updateProject(
    projectId: number,
    userId: number,
    updateData: Partial<Omit<CreateProjectData, "user_id">>
  ): Promise<ProjectResponse> {
    // Verify project ownership
    const project = await this.getProjectById(projectId);

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    if (project.user_id !== userId) {
      throw new Error("PROJECT_UNAUTHORIZED");
    }

    const { project_name, description, project_type, status, last_test_date } =
      updateData;
    const updates: string[] = [];
    const values: any[] = [];

    if (project_name !== undefined) {
      updates.push("project_name = ?");
      values.push(project_name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (project_type !== undefined) {
      if (!["API", "WEB", "BOTH"].includes(project_type)) {
        throw new Error("INVALID_PROJECT_TYPE");
      }
      updates.push("project_type = ?");
      values.push(project_type);
    }
    if (status !== undefined) {
      if (!["ACTIVE", "ARCHIVED", "INACTIVE"].includes(status)) {
        throw new Error("INVALID_STATUS");
      }
      updates.push("status = ?");
      values.push(status);
    }
    if (last_test_date !== undefined) {
      updates.push("last_test_date = ?");
      values.push(last_test_date);
    }

    if (updates.length === 0) {
      throw new Error("PROJECT_NO_UPDATES");
    }

    values.push(projectId);

    await queryDatabase(
      `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    const updatedProject = await this.getProjectById(projectId);

    if (!updatedProject) {
      throw new Error("PROJECT_UPDATE_FAILED");
    }

    return updatedProject;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: number, userId: number): Promise<void> {
    // Verify project ownership
    const project = await this.getProjectById(projectId);

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    if (project.user_id !== userId) {
      throw new Error("PROJECT_UNAUTHORIZED");
    }

    await queryDatabase("DELETE FROM projects WHERE id = ?", [projectId]);
  }

  /**
   * Update last test date
   */
  async updateLastTestDate(
    projectId: number,
    userId: number
  ): Promise<ProjectResponse> {
    const project = await this.getProjectById(projectId);

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    if (project.user_id !== userId) {
      throw new Error("PROJECT_UNAUTHORIZED");
    }

    await queryDatabase(
      "UPDATE projects SET last_test_date = NOW() WHERE id = ?",
      [projectId]
    );

    const updatedProject = await this.getProjectById(projectId);

    if (!updatedProject) {
      throw new Error("PROJECT_UPDATE_FAILED");
    }

    return updatedProject;
  }
}

// Export singleton instance
export const projectService = new ProjectService();
