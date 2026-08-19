import express from "express";
import { connectToDatabase } from "../lib/db.js";
import { verifyToken, requireCorpsMember } from "../middleware/auth.js";

const router = express.Router();

// POST /interests - corps member expresses interest in a listing
router.post("/", verifyToken, requireCorpsMember, async (req, res) => {
    const { listing_id } = req.body;

    if (!listing_id) {
        return res.status(400).json({ message: "listing_id is required" });
    }

    try {
        const db = await connectToDatabase();

        const [listingRows] = await db.query("SELECT slots_available FROM listings WHERE id = ?", [listing_id]);
        if (listingRows.length === 0) {
            return res.status(404).json({ message: "This listing isn't available anymore." });
        }
        const [[{ acceptedCount }]] = await db.query(
            "SELECT COUNT(*) AS acceptedCount FROM interests WHERE listing_id = ? AND status = 'accepted'",
            [listing_id]
        );
        if (acceptedCount >= listingRows[0].slots_available) {
            return res.status(400).json({ message: "This listing is already full." });
        }

        await db.query(
            "INSERT INTO interests (listing_id, corps_member_id, status) VALUES (?, ?, 'pending')",
            [listing_id, req.userId]
        );
        return res.status(201).json({ message: "Interest submitted" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "You've already expressed interest in this listing" });
        }
        console.error("Create interest error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET /interests/mine - corps member: see their own submitted interests + status.
// Contact info (agent's email) only appears once status is 'accepted'.
router.get("/mine", verifyToken, requireCorpsMember, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            `SELECT i.id, i.status, i.created_at, l.location, l.price,
                    CASE WHEN i.status = 'accepted' THEN u.email ELSE NULL END AS agent_contact
             FROM interests i
             JOIN listings l ON i.listing_id = l.id
             JOIN user u ON l.agent_id = u.id
             WHERE i.corps_member_id = ?
             ORDER BY i.created_at DESC`,
            [req.userId]
        );
        return res.status(200).json({ interests: rows });
    } catch (err) {
        console.error("Get my interests error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET /interests/incoming - agent: see interests on their own listings.
// Corps member's contact info only appears once status is 'accepted'.
router.get("/incoming", verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            `SELECT i.id, i.status, i.created_at, l.location, u.username AS corps_member_name,
                    CASE WHEN i.status = 'accepted' THEN u.email ELSE NULL END AS corps_member_contact
             FROM interests i
             JOIN listings l ON i.listing_id = l.id
             JOIN user u ON i.corps_member_id = u.id
             WHERE l.agent_id = ?
             ORDER BY i.created_at DESC`,
            [req.userId]
        );
        return res.status(200).json({ interests: rows });
    } catch (err) {
        console.error("Get incoming interests error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// PATCH /interests/:id - agent: accept or decline an interest on one of their listings
router.patch("/:id", verifyToken, async (req, res) => {
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ message: "Status must be 'accepted' or 'declined'" });
    }

    try {
        const db = await connectToDatabase();
        // Only allow the agent who owns the listing to update the interest
        const [rows] = await db.query(
            `SELECT i.id, i.listing_id FROM interests i
             JOIN listings l ON i.listing_id = l.id
             WHERE i.id = ? AND l.agent_id = ?`,
            [req.params.id, req.userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Interest not found" });
        }
        const { listing_id: listingId } = rows[0];

        await db.query("UPDATE interests SET status = ? WHERE id = ?", [status, req.params.id]);

        // If this acceptance just filled the last slot, auto-decline whoever
        // else is still pending on this listing rather than leaving them
        // hanging or making the host clear them out one by one.
        if (status === 'accepted') {
            const [listingRows] = await db.query("SELECT slots_available FROM listings WHERE id = ?", [listingId]);
            const [[{ acceptedCount }]] = await db.query(
                "SELECT COUNT(*) AS acceptedCount FROM interests WHERE listing_id = ? AND status = 'accepted'",
                [listingId]
            );
            if (listingRows.length > 0 && acceptedCount >= listingRows[0].slots_available) {
                await db.query(
                    "UPDATE interests SET status = 'declined' WHERE listing_id = ? AND status = 'pending'",
                    [listingId]
                );
            }
        }

        return res.status(200).json({ message: `Interest ${status}` });
    } catch (err) {
        console.error("Update interest error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;