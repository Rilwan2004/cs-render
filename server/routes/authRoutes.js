import express from "express";
import {connectToDatabase} from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are all required" });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (role && !['corps_member', 'agent'].includes(role)) {
        return res.status(400).json({ message: "Role must be 'corps_member' or 'agent'" });
    }

    try {
        const db = await connectToDatabase();
        const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (rows.length > 0) {  
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashPassword, role || 'corps_member']
        );
        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const db = await connectToDatabase();
        const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (rows.length === 0) {  
            return res.status(400).json({ message: "user not existing" });
        }
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "wrong password" });
        }
        const token = jwt.sign({id:rows[0].id}, process.env.JWT_KEY, {expiresIn: "2h"});
        return res.status(200).json({token:token})
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        // Select specific columns only - never send the password hash to the client
        const [rows] = await db.query(
            `SELECT id, username, email, role, gender, preferred_location, budget_min, budget_max, bio,
                    has_apartment, apartment_location, apartment_price, apartment_slots, apartment_description, apartment_images
             FROM user WHERE id = ?`,
            [req.userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user: rows[0] });
    } catch (err) {
        console.error("Home error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// PATCH /profile - fill in the roommate-matching fields (gender, location, budget, bio, apartment info)
router.patch('/profile', verifyToken, async (req, res) => {
    const {
        gender, preferred_location, budget_min, budget_max, bio,
        has_apartment, apartment_location, apartment_price, apartment_slots, apartment_description, apartment_images
    } = req.body;

    if (gender && !['male', 'female'].includes(gender)) {
        return res.status(400).json({ message: "Gender must be 'male' or 'female'" });
    }

    try {
        const db = await connectToDatabase();
        await db.query(
            `UPDATE user SET
                gender = COALESCE(?, gender),
                preferred_location = COALESCE(?, preferred_location),
                budget_min = COALESCE(?, budget_min),
                budget_max = COALESCE(?, budget_max),
                bio = COALESCE(?, bio),
                has_apartment = COALESCE(?, has_apartment),
                apartment_location = COALESCE(?, apartment_location),
                apartment_price = COALESCE(?, apartment_price),
                apartment_slots = COALESCE(?, apartment_slots),
                apartment_description = COALESCE(?, apartment_description),
                apartment_images = COALESCE(?, apartment_images)
             WHERE id = ?`,
            [
                gender || null, preferred_location || null, budget_min || null, budget_max || null, bio || null,
                has_apartment ?? null, apartment_location || null, apartment_price || null, apartment_slots || null,
                apartment_description || null, apartment_images || null,
                req.userId
            ]
        );
        return res.status(200).json({ message: "Profile updated" });
    } catch (err) {
        console.error("Update profile error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default router;