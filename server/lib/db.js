import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// A pool instead of a single connection: if a connection drops (timeout,
// network blip, MySQL restart) the pool opens a fresh one automatically
// instead of every query failing until the server is restarted.
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "rnm-auth",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectToDatabase = async () => {
    return pool;
};