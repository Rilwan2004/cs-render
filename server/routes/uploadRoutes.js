import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

// Make sure the uploads folder exists before multer tries to write into it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const ALLOWED_TYPES = /jpeg|jpg|png|webp|gif|mp4|webm|mov/;

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    if (ALLOWED_TYPES.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024, files: 8 }, // 25MB per file, up to 8 files
});

// POST /upload - logged-in users only, accepts up to 8 files under the field name "files"
router.post("/", verifyToken, upload.array("files", 8), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    const urls = req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
    return res.status(201).json({ urls });
});

// Multer errors (file too large, bad type, etc.) land here instead of crashing the server
router.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message || "Upload failed" });
    }
    next();
});

export default router;
