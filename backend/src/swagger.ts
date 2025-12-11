import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { signupSchema, loginSchema } from "./schemas/userSchema";
import {
  createProjectSchema,
  updateProjectSchema,
} from "./schemas/projectSchema";
import z from "zod";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Enter JWT token",
});

// Path parameter schema
const projectIdParam = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});

// Register your schema
registry.register("SignupRequest", signupSchema);
registry.register("SigninRequest", loginSchema);

registry.register("CreateProjectRequest", createProjectSchema);
registry.register("UpdateProjectRequest", updateProjectSchema);

// Register Signup route
registry.registerPath({
  method: "post",
  path: "/api/auth/signup",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: signupSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created successfully",
    },
    400: {
      description: "Invalid input",
    },
  },
});

// Register Signin route
registry.registerPath({
  method: "post",
  path: "/api/auth/signin",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
          example: {
            email: "test@example.com",
            password: "test12345D#",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "User signed in successfully",
    },
    400: {
      description: "Invalid input",
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

// Register Create Project route
registry.registerPath({
  method: "post",
  path: "/api/projects/",
  tags: ["Projects"],
  summary: "Get all projects for authenticated user",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User signed in successfully",
    },
    400: {
      description: "Invalid input",
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

// Register Get Project route
registry.registerPath({
  method: "get",
  path: "/api/projects/",
  tags: ["Projects"],
  summary: "Get all projects for authenticated user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "User signed in successfully",
    },
    400: {
      description: "Invalid input",
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

// GET single project by ID
registry.registerPath({
  method: "get",
  path: "/api/projects/{id}",
  tags: ["Projects"],
  summary: "Get a single project by ID",
  security: [{ bearerAuth: [] }],
  request: {
    params: projectIdParam,
  },
  responses: {
    200: {
      description: "Project retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              id: z.number(),
              userId: z.number(),
              projectName: z.string(),
              description: z.string().nullable(),
              projectType: z.enum(["API", "WEB", "BOTH"]),
              status: z.enum(["ACTIVE", "ARCHIVED"]),
              createdAt: z.string(),
              updatedAt: z.string(),
              lastTestDate: z.string().nullable(),
            }),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    403: {
      description:
        "Forbidden - You don't have permission to access this project",
    },
    404: {
      description: "Project not found",
    },
  },
});

// PUT update project
registry.registerPath({
  method: "put",
  path: "/api/projects/{id}",
  tags: ["Projects"],
  summary: "Update a project",
  security: [{ bearerAuth: [] }],
  request: {
    params: projectIdParam,
    body: {
      content: {
        "application/json": {
          schema: updateProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({
              id: z.number(),
              projectName: z.string(),
              description: z.string().nullable(),
              projectType: z.enum(["API", "WEB", "BOTH"]),
              status: z.enum(["ACTIVE", "ARCHIVED"]),
              updatedAt: z.string(),
            }),
          }),
        },
      },
    },
    400: {
      description: "Invalid input - Validation error",
    },
    401: {
      description: "Unauthorized",
    },
    403: {
      description:
        "Forbidden - You don't have permission to update this project",
    },
    404: {
      description: "Project not found",
    },
  },
});

// DELETE project
registry.registerPath({
  method: "delete",
  path: "/api/projects/{id}",
  tags: ["Projects"],
  summary: "Delete a project",
  security: [{ bearerAuth: [] }],
  request: {
    params: projectIdParam,
  },
  responses: {
    200: {
      description: "Project deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    403: {
      description:
        "Forbidden - You don't have permission to delete this project",
    },
    404: {
      description: "Project not found",
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "My API Docs",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:8000" }],
});
