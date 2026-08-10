import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/authRoutes.js";
import listingRouter from "./routes/listingRoutes.js";
import interestRouter from "./routes/interestRoutes.js";
import roommateRouter from "./routes/roommateRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRouter);
app.use("/listings", listingRouter);
app.use("/interests", interestRouter);
app.use("/roommates", roommateRouter);
app.use("/upload", uploadRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
})