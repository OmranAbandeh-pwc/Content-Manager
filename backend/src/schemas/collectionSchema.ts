import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const projectId = z.number().optional();

const collectionName = z
  .string()
  .min(2, "Collection Name must be at least 2 characters long")
  .max(100, "Collection Name must not exceed 100 characters")
  .trim()
  .optional();

const description = z
  .string()
  .min(10, "Collection Name must be at least 10 characters long")
  .max(500, "Collection Name must not exceed 500 characters")
  .trim()
  .optional();

const collectionType = z.enum(["API", "WEB"]).optional();

const status = z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE");

const lastRunDate = z.string().datetime().or(z.date()).nullable().optional();

export const createCollectionSchema = z.object({
  projectId,
  collectionName,
  description,
  collectionType: collectionType.optional(),
  status: status.optional(),
  lastRunDate,
});

// Export types
export type CreateCollection = z.infer<typeof createCollectionSchema>;
