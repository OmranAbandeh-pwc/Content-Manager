// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = "Internal server error";
  let errors: any[] | undefined;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle regular Error objects
  else if (err instanceof Error) {
    // Check for specific error messages
    if (
      err.message === "Project not found" ||
      err.message === "PROJECT_NOT_FOUND"
    ) {
      statusCode = 404;
      message = "Project not found";
    } else if (err.message === "PROJECT_UNAUTHORIZED") {
      statusCode = 403;
      message = "You don't have permission to access this project";
    } else if (err.message === "USER_NOT_FOUND") {
      statusCode = 404;
      message = "User not found";
    } else {
      // Use the error message as-is for other errors
      message = err.message || "Internal server error";
    }
  }

  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  // Handle MySQL/Database errors
  else if (typeof err === "object" && err !== null && "code" in err) {
    const dbError = err as any;
    switch (dbError.code) {
      case "ER_DUP_ENTRY":
        statusCode = 409;
        message = "Resource already exists";
        break;
      case "ER_NO_REFERENCED_ROW_2":
        statusCode = 400;
        message = "Invalid foreign key reference";
        break;
      case "ER_ROW_IS_REFERENCED_2":
        statusCode = 409;
        message = "Cannot delete - resource is being used";
        break;
      case "ER_BAD_FIELD_ERROR":
        statusCode = 400;
        message = "Invalid field in query";
        break;
      case "ER_PARSE_ERROR":
        statusCode = 500;
        message = "Database query error";
        break;
      default:
        statusCode = 500;
        message = "Database error";
    }
  }

  // Log error details in development
  if (process.env.NODE_ENV === "development") {
    console.error("=== ERROR DETAILS ===");
    console.error("Message:", err.message);
    console.error("Status Code:", statusCode);
    console.error("Stack:", err.stack);
    console.error("Type:", err.constructor.name);
    console.error("====================");
  }

  // ALWAYS send JSON response (never HTML)
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    // Include stack trace only in development
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      errorType: err.constructor.name,
    }),
  });
};
