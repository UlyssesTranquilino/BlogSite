// Import packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Blog = require("./models/blog");
const methodOverride = require("method-override");
const blogRoutes = require("./routes/blogRoutes");

// Load environment variables from .env file
require("dotenv").config();

// Create Express app
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

// MongoDB connection string from .env
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB & start server
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log("DB connection error:", err));

// Set EJS as view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.static("public")); // Serve static files from /public
app.use(morgan("dev")); // Logging HTTP requests
app.use(express.json()); // Parse incoming JSON
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// Route: Home - redirect to /blogs
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// Route: About page
app.get("/about", (req, res) => {
  res.render("about", { title: "About the Thought Loom" });
});

// Route: List all blogs on homepage
app.use("/blogs", blogRoutes);

// 404 Page - catch all unmatched routes
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});
