// schemas/userSchema.ts
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// Password validation schema with custom rules
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .openapi({ example: "Pass@12345" });

// Email validation schema
const emailSchema = z
  .string()
  .email("Invalid email format")
  .toLowerCase()
  .openapi({ example: "test@example.com" });

// Name validation schema
const firstNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name must not exceed 100 characters")
  .trim()
  .optional();

// Name validation schema
const secondNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name must not exceed 100 characters")
  .trim()
  .optional();

// Signup schema
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  secondName: secondNameSchema,
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Update user schema (all fields optional)
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  firstName: firstNameSchema,
  secondName: secondNameSchema,
});

// Type inference from schemas
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Validation helper function
export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: any) => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ["Validation failed"] };
  }
};
