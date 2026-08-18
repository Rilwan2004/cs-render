import express from "express";
import { connectToDatabase } from "../lib/db.js";
import { verifyToken, requireCorpsMember } from "../middleware/auth.js";

const router = express.Router();

// GET /roommates - browse other corps members' profiles (excludes self, excludes agents, excludes password)
router.get("/", verifyToken, requireCorpsMember, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            `SELECT id, username, gender, preferred_location, budget_min, budget_max, bio,
                    has_apartment, apartment_location, apartment_price, apartment_slots, apartment_description, apartment_images
             FROM user
             WHERE role = 'corps_member' AND id != ?`,
            [req.userId]
        );
        return res.status(200).json({ profiles: rows });
    } catch (err) {
        console.error("Browse roommates error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// POST /roommates/request - send a roommate request to another corps member
router.post("/request", verifyToken, requireCorpsMember, async (req, res) => {
    const { requested_id } = req.body;

    if (!requested_id) {
        return res.status(400).json({ message: "requested_id is required" });
    }
    if (Number(requested_id) === req.userId) {
        return res.status(400).json({ message: "You can't send a roommate request to yourself" });
    }

    try {
        const db = await connectToDatabase();
        // Confirm the target is actually a corps member, not just any user id
        const [targetRows] = await db.query("SELECT role FROM user WHERE id = ?", [requested_id]);
        if (targetRows.length === 0 || targetRows[0].role !== 'corps_member') {
            return res.status(400).json({ message: "You can only send roommate requests to corps members" });
        }

        await db.query(
            "INSERT INTO roommate_requests (requester_id, requested_id, status) VALUES (?, ?, 'pending')",
            [req.userId, requested_id]
        );
        return res.status(201).json({ message: "Roommate request sent" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "You've already sent this person a request" });
        }
        console.error("Create roommate request error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET /roommates/requests/mine - requests I sent, with status.
// Contact info only appears once status is 'accepted'.
router.get("/requests/mine", verifyToken, requireCorpsMember, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            `SELECT r.id, r.status, r.created_at, u.username,
                    CASE WHEN r.status = 'accepted' THEN u.email ELSE NULL END AS contact
             FROM roommate_requests r
             JOIN user u ON r.requested_id = u.id
             WHERE r.requester_id = ?
             ORDER BY r.created_at DESC`,
            [req.userId]
        );
        return res.status(200).json({ requests: rows });
    } catch (err) {
        console.error("Get my roommate requests error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET /roommates/requests/incoming - requests sent to me, with status.
// Contact info only appears once status is 'accepted'.
router.get("/requests/incoming", verifyToken, requireCorpsMember, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            `SELECT r.id, r.status, r.created_at, u.username,
                    CASE WHEN r.status = 'accepted' THEN u.email ELSE NULL END AS contact
             FROM roommate_requests r
             JOIN user u ON r.requester_id = u.id
             WHERE r.requested_id = ?
             ORDER BY r.created_at DESC`,
            [req.userId]
        );
        return res.status(200).json({ requests: rows });
    } catch (err) {
        console.error("Get incoming roommate requests error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// PATCH /roommates/requests/:id - accept or decline a request sent to me
router.patch("/requests/:id", verifyToken, requireCorpsMember, async (req, res) => {
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ message: "Status must be 'accepted' or 'declined'" });
    }

    try {
        const db = await connectToDatabase();
        // Only the person the request was sent TO can accept/decline it
        const [rows] = await db.query(
            "SELECT id FROM roommate_requests WHERE id = ? AND requested_id = ?",
            [req.params.id, req.userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        await db.query("UPDATE roommate_requests SET status = ? WHERE id = ?", [status, req.params.id]);
        return res.status(200).json({ message: `Request ${status}` });
    } catch (err) {
        console.error("Update roommate request error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;