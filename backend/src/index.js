const path = require("path");

// Load env FIRST, so modules required below can read process.env at load time
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

// Needed behind cPanel/nginx/Passenger so rate limiting sees real client IPs
if (isProd) app.set("trust proxy", 1);

// ---------------------------------------------------------------------------
// CORS
// Origins have NO trailing slash. Extra origins can be added through
// CORS_ORIGIN in .env as a comma-separated list.
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
      // Allow non-browser clients (Postman, curl, server-to-server) with no Origin header
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Allow images/videos served by this API to load on the frontend origin
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Body parsers (large uploads should go through multipart/multer, not JSON)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Sanitizers must run AFTER body parsing, or they never see req.body
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running healthy",
  });
});

// 404 handler (app.use instead of app.all("*") so it works on Express 4 and 5)
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
// Startup and shutdown
// ---------------------------------------------------------------------------
let server;

const shutdown = (label, err) => {
  console.error(`${label}! Shutting down...`);
  console.error(err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
};

process.on("unhandledRejection", (err) => shutdown("UNHANDLED REJECTION", err));
process.on("uncaughtException", (err) => shutdown("UNCAUGHT EXCEPTION", err));

(async () => {
  await connectDB(); // don't accept requests until the DB is connected
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
    console.log("Allowed CORS origins:", allowedOrigins.join(", "));
  });
})().catch((err) => shutdown("STARTUP FAILED", err));