import mysql from "mysql2/promise";

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "construction_inventory",
  port: parseInt(process.env.DB_PORT || "3306"),
};

// Create a connection pool
export async function getConnection() {
  try {
    const pool = mysql.createPool(dbConfig);
    return pool;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

// Execute a query with parameters
export async function executeQuery(query: string, params: any[] = []) {
  const pool = await getConnection();
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}
