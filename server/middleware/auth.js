import jwt from "jsonwebtoken";
import { connectToDatabase } from "../lib/db.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Must run after verifyToken - relies on req.userId being set
export const requireAgent = async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query("SELECT role FROM user WHERE id = ?", [req.userId]);
        if (rows.length === 0 || rows[0].role !== 'agent') {
            return res.status(403).json({ message: "Agent access only" });
        }
        next();
    } catch (err) {
        console.error("requireAgent error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};