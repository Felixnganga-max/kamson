const path = require("path");

// Load env FIRST (on Vercel, variables come from project settings; this is harmless there)
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const connectDB = require("./config/database");
const eventRoutes = require("./routers/eventRouters");
const authRoutes = require("./routers/authRoutes");
const mediaRoutes = require("./routers/mediaRoutes");

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Vercel (and cPanel/nginx) sit behind a proxy; needed for correct client IPs
app.set("trust proxy", 1);

// ---------------------------------------------------------------------------
// CORS (origins have NO trailing slash)
// Extra origins can be added via CORS_ORIGIN as a comma-separated list.
// ---------------------------------------------------------------------------
const defaultOrigins = [
  "https://www.kamson.co.ke",
  "https://kamson.co.ke",
  "http://localhost:5173",
];

const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
      .map((o) => o.trim().replace(/\/+$/, ""))
      .filter(Boolean)
  : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (Postman, curl) that send no Origin header
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Vercel functions reject request bodies over ~4.5MB regardless of these limits.
// Upload large media straight to your storage provider (Cloudinary, S3, etc.).
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Sanitizers must run AFTER body parsing
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ---------------------------------------------------------------------------
// Database: connect once per serverless instance and reuse the connection
// ---------------------------------------------------------------------------
let dbPromise = null;
const ensureDB = () => {
  if (!dbPromise) {
    dbPromise = Promise.resolve(connectDB()).catch((err) => {
      dbPromise = null; // allow a retry on the next request
      throw err;
    });
  }
  return dbPromise;
};

app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again later",
  },
});
app.use("/api", limiter);

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Server is running healthy" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode =
    err.statusCode || (Number.isInteger(err.status) ? err.status : 500);

  console.error(err.stack);

  const body = {
    status: statusCode >= 500 ? "error" : "fail",
    message:
      isProd && statusCode >= 500
        ? "Something went wrong!"
        : err.message || "Something went wrong!",
  };
  if (!isProd) body.stack = err.stack;

  res.status(statusCode).json(body);
});

// ---------------------------------------------------------------------------
// Export for Vercel; only listen when run directly (node src/index.js)
// ---------------------------------------------------------------------------
module.exports = app;

if (require.main === module) {
  let server;

  const shutdown = (label, err) => {
    console.error(`${label}! Shutting down...`);
    console.error(err);
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
  };

  process.on("unhandledRejection", (err) => shutdown("UNHANDLED REJECTION", err));
  process.on("uncaughtException", (err) => shutdown("UNCAUGHT EXCEPTION", err));

  ensureDB()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      server = app.listen(PORT, () => {
        console.log(
          `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
        );
        console.log("Allowed CORS origins:", allowedOrigins.join(", "));
      });
    })
    .catch((err) => shutdown("STARTUP FAILED", err));
}
