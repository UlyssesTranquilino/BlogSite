const express = require("express");
const blogController = require("../controllers/blogController");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to handle image upload
router.post("/", upload.single("image"), blogController.blog_create_post);
router.put("/:id", upload.single("image"), blogController.blog_update);

// Blog routes
router.get("/", blogController.blog_index); // List all blogs
router.get("/create", blogController.blog_create_get); // Show create form
router.post("/", blogController.blog_create_post); // Create blog
router.get("/:id", blogController.blog_details); // View single blog
router.delete("/:id", blogController.blog_delete); // Delete blog
router.get("/:id/edit", blogController.blog_edit_get); // Show edit form
router.put("/:id", blogController.blog_update); // Update blog

module.exports = router;
