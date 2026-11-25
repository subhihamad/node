const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const bodyParser = require("body-parser");
const courseRouter = require("./router/controller.router.js");
const userRouter = require("./router/user.router.js");
const dns = require("node:dns");

const cors = require("cors");
const AppError = require("./utils/appError.js");
const { httpStatusCodes } = require("./utils/httpStatusCodes.js");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  throw new Error("MONGO_URL is not configured. Add it to the .env file.");
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const port = 5000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the course router for handling course-related routes
app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled request error:", error);
  // If headers have already been sent, delegate to the default Express error handler
  if (res.headersSent) {
    console.error("Headers already sent, delegating to default error handler");
    return next(error);
  }
  // Send a structured error response
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusCodes.INTERNAL_SERVER_ERROR,
    message: error.statusCode ? error.message : "Internal server error",
    ...(error.errors ? { errors: error.errors } : {}),
  });
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
  const error = new AppError("Route not found", 404, httpStatusCodes.NOT_FOUND);
  res.status(error.statusCode).json({
    status: error.statusText,
    message: error.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
