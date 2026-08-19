import rateLimit from "express-rate-limit";

// Login: the most exploitable route (password guessing). 5 attempts per 15 minutes per IP.
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts. Please try again in 15 minutes." },
});

// Register: looser than login, but still stops spam-account creation bots. 10 per hour per IP.
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many accounts created from this network. Please try again later." },
});

// General baseline for every other route - generous, just stops outright abuse/scraping.
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please slow down and try again shortly." },
});