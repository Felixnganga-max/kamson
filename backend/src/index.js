const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../src/config/database");
const eventRoutes = require("../src/routers/eventRouters");
const authRoutes = require("./routers/authRoutes");
const mediaRoutes = require("./routers/mediaRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Create Express app
const app = express();

// Connect to Database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize data against NoSQL injection
app.use(xss()); // Sanitize data against XSS
app.use(hpp()); // Protect against HTTP Parameter Pollution

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Set payload size limits
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "800mb", extended: true }));

// Apply rate limiting to API routes
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

// Handle 404 routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error(err.stack);

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // Production - don't leak stack trace
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || "Something went wrong!",
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
