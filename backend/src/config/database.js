const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Explicitly specify the path to the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  const connectionString = process.env.MONGODB_URI;

  // Add additional logging for debugging
  console.log("Connection String:", connectionString);
  console.log("Environment Variables:", {
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  });

  if (!connectionString) {
    console.error("MONGODB_URI is not defined. Please check your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
