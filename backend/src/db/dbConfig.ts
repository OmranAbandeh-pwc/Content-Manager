import mysql, { type Pool } from "mysql2/promise";

// Define your database configuration
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool
let pool: Pool | null = null;

export const connectToDatabase = async (): Promise<Pool> => {
  if (!pool) {
    try {
      console.log("Attempting to connect to MySQL database...");
      console.log(`Host: ${config.host}:${config.port}`);
      console.log(`Database: ${config.database}`);
      
      pool = mysql.createPool(config);
      
      // Test the connection
      const connection = await pool.getConnection();
      console.log("✅ Connected to MySQL database successfully!");
      connection.release();
      
      // Test query
      const [rows] = await pool.query("SELECT 1 AS test");
      console.log("✅ Database connection test successful!", rows);
    } catch (err) {
      pool = null;
      if (err instanceof Error) {
        console.error("❌ Database connection failed:", err.message);
        console.error("Error details:", err);
      } else {
        console.error("❌ Unknown error:", err);
      }
      throw err;
    }
  }
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing database:", err);
    }
  }
};

// Example usage function
export const queryDatabase = async (sql: string, params?: any[]) => {
  const connection = await connectToDatabase();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};