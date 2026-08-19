import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/authRoutes.js";
import listingRouter from "./routes/listingRoutes.js";
import interestRouter from "./routes/interestRoutes.js";
import roommateRouter from "./routes/roommateRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import { generalLimiter } from "./middleware/rateLimiters.js";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();

// Railway (and most hosts) sit behind a reverse proxy. Without this, every
// request looks like it comes from the same IP, which breaks rate limiting.
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(generalLimiter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRouter);
app.use("/listings", listingRouter);
app.use("/interests", interestRouter);
app.use("/roommates", roommateRouter);
app.use("/upload", uploadRouter);

app.get("/", (req, res) => {
    res.json({
        message: "CorperNest API is running",
        status: "OK"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is Running on Port ${PORT}`);
});