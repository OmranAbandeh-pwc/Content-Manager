// middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validate body
export const validateBody = (schema: z.ZodSchema) => {
  return validate(schema, "body");
};

// Validate query
export const validateQuery = (schema: z.ZodSchema) => {
  return validate(schema, "query");
};

// Validate params
export const validateParams = (schema: z.ZodSchema) => {
  return validate(schema, "params");
};

// Generic validate function
const validate = (schema: z.ZodSchema, property: "body" | "query" | "params") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[property] = schema.parse(req[property]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: `${property} validation failed`,
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
};