import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const projectName = z
  .string()
  .min(2, "Project Name must be at least 2 characters long")
  .max(100, "Project Name must not exceed 100 characters")
  .trim()
  .optional();

const description = z
  .string()
  .min(10, "Project Name must be at least 10 characters long")
  .max(500, "Project Name must not exceed 500 characters")
  .trim()
  .optional();

const projectType = z.enum(["API", "WEB", "BOTH"]).optional();

const status = z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE");

const lastTestDate = z.string().datetime().or(z.date()).nullable().optional();

// Create Project Schema (for POST requests)
export const createProjectSchema = z.object({
  projectName,
  description,
  projectType: projectType.optional(),
  status: status.optional(),
  lastTestDate,
});

// Update Project Schema (for PATCH/PUT requests)
export const updateProjectSchema = z.object({
  projectName: projectName.optional(),
  description,
  projectType: projectType.optional(),
  status: status.optional(),
  lastTestDate,
});

// Project Response Schema (what the API returns)
export const projectResponseSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  projectName,
  description: z.string().nullable(),
  projectType,
  status,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastTestDate: z.string().datetime().nullable(),
});

// Export types
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
