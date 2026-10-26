import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courseRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import connectToDatabase from "./db/db.js";

const app = express();
// Allowed frontend origins: the production site, its Vercel preview URLs,
// local Vite dev, plus any extra origins listed in FRONTEND_URLS (comma-separated).
const extraOrigins = (process.env.FRONTEND_URLS || "")
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
const allowedOrigins = new Set([
    "https://superteachertoc.vercel.app",
    "http://localhost:5173",
    ...extraOrigins,
]);
const isAllowedOrigin = (origin) =>
    !origin ||
    allowedOrigins.has(origin) ||
    /^https:\/\/superteachertoc[a-z0-9-]*\.vercel\.app$/.test(origin);

app.use(cors({
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Browsers request these automatically; answer quietly instead of with a 404.
app.get(["/favicon.ico", "/favicon.png"], (req, res) => res.status(204).end());

app.get("/", (req, res) => {
    res.json({ status: "ok", service: "superteacher-backend" });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api", async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/grades", gradeRoutes);
// Grade routes are also mounted at /api so the documented paths work:
//   GET/POST /api/courses/:courseSlug/grades, PUT/DELETE /api/grades/:id, ...
app.use("/api", gradeRoutes);

// Unknown routes: return JSON naming the path, so 404s are easy to trace.
app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
    console.error("Request failed:", error);
    if (res.headersSent) {
        return next(error);
    }
    if (error.code === "MONGODB_URI_MISSING") {
        return res.status(503).json({
            message: "Database is not configured. Set MONGODB_URI in the deployment environment.",
        });
    }
    if (error.code === "IMAGEKIT_CONFIG_MISSING") {
        return res.status(503).json({ message: error.message });
    }
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            message: "PDF files must be 4 MB or smaller",
        });
    }
    if (error.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
        message: "Backend request failed",
        error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
});

if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
}

export default app;
