import express from "express";
import { connectToDatabase } from "../lib/db.js";
import { verifyToken, requireCorpsMember } from "../middleware/auth.js";

const router = express.Router();

// GET /listings - browsing is a corps-member feature, agents only post and view their own.
// slots_taken (accepted applicants so far) rides along so the frontend can hide
// a listing from Browse once it's full, without breaking the detail page for
// someone who was already accepted into it.
router.get("/", verifyToken, requireCorpsMember, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            `SELECT l.id, l.location, l.price, l.slots_available, l.description, l.expires_at, l.created_at, l.images, u.username AS agent_name,
                    COALESCE(ac.accepted_count, 0) AS slots_taken
             FROM listings l
             JOIN user u ON l.agent_id = u.id
             LEFT JOIN (
                 SELECT listing_id, COUNT(*) AS accepted_count
                 FROM interests
                 WHERE status = 'accepted'
                 GROUP BY listing_id
             ) ac ON ac.listing_id = l.id
             WHERE (l.expires_at IS NULL OR l.expires_at >= CURDATE())
               AND l.agent_id != ?
             ORDER BY l.created_at DESC`,
            [req.userId]
        );
        return res.status(200).json({ listings: rows });
    } catch (err) {
        console.error("Get listings error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET /listings/mine - see listings posted by the current user (any role)
router.get("/mine", verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            "SELECT * FROM listings WHERE agent_id = ? ORDER BY created_at DESC",
            [req.userId]
        );
        return res.status(200).json({ listings: rows });
    } catch (err) {
        console.error("Get my listings error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// POST /listings - any logged-in user can post a listing, agent or corper
router.post("/", verifyToken, async (req, res) => {
    const { location, price, slots_available, description, expires_at, images } = req.body;

    if (!location || !price) {
        return res.status(400).json({ message: "Location and price are required" });
    }

    try {
        const db = await connectToDatabase();
        const [result] = await db.query(
            "INSERT INTO listings (agent_id, location, price, slots_available, description, expires_at, images) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [req.userId, location, price, slots_available || 1, description || null, expires_at || null, images || null]
        );
        return res.status(201).json({ message: "Listing created", listingId: result.insertId });
    } catch (err) {
        console.error("Create listing error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;