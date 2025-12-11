// app.ts
import "dotenv/config"; // ✅ Cleaner than require
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { connectToDatabase } from "./db/dbConfig";
import { swaggerDocument } from "./swagger";
import { errorHandler } from "./middlewares/errorHandler";
import { router as authRouter } from "./routes/auth/routes";
import { router as projectRouter } from "./routes/projects/routes";
import { router as collectionsRouter } from "./routes/collections/routes";

// Create Express app
const app: Application = express();

// ============= SECURITY MIDDLEWARE =============
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// ============= PARSING MIDDLEWARE =============
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============= LOGGING MIDDLEWARE =============
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined")); // Production logging
}

// ============= HEALTH CHECK =============
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============= API DOCUMENTATION =============
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "API Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// ============= API ROUTES =============
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/collections", collectionsRouter);

// ============= 404 HANDLER =============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============= ERROR HANDLER (Must be last) =============
app.use(errorHandler);

// ============= DATABASE & SERVER STARTUP =============
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Connect to database first
    await connectToDatabase();
    console.log("✅ Database connected successfully");

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("✅ HTTP server closed");

        // Close database connection
        // await disconnectFromDatabase(); // Implement this if needed

        console.log("✅ Database connection closed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("❌ Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app; // Export for testing
