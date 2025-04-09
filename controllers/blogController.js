const Blog = require("../models/blog");

// Fetch and list all blog posts
const blog_index = (req, res) => {
  // Retrieve all blogs from the database, sorted by creation date in descending order
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      // Render the "index" view and pass the list of blogs along with the page title
      res.render("index", { blogs: result, title: "All Blogs" });
    })
    .catch((err) => {
      // If an error occurs, log the error and render a 500 error page
      console.log(err);
      res.status(500).render("error", { title: "Server Error" });
    });
};

// Render the form to create a new blog post
const blog_create_get = (req, res) => {
  // Render the "create" view and pass the title for the page
  res.render("create", { title: "Create a New Blog" });
};

// Handle the creation of a new blog post
const blog_create_post = (req, res) => {
  // Check if an image was uploaded and construct the image path
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  // Create a new Blog instance using the submitted data
  const blog = new Blog({
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body,
    image: imagePath, // Store the image path in the database
  });

  // Save the new blog post to the database
  blog
    .save()
    .then((result) => {
      // Redirect to the blogs index page after saving
      res.redirect("/blogs");
    })
    .catch((err) => {
      // Log any errors that occur during the save process
      console.log(err);
    });
};

// Display a single blog post by its ID
const blog_details = (req, res) => {
  const id = req.params.id;

  // Find the blog post by its ID
  Blog.findById(id)
    .then((result) => {
      if (!result) {
        // If no blog is found, return a 404 page
        return res.status(404).render("404", { title: "Blog Not Found" });
      }
      // Render the "details" view and pass the blog data to it
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      // If an error occurs, log the error and render a 404 page
      console.log(err);
      res.status(404).render("404", { title: "Blog Not Found" });
    });
};

// Render the form to edit an existing blog post
const blog_edit_get = (req, res) => {
  const id = req.params.id;

  // Find the blog post by its ID
  Blog.findById(id)
    .then((result) => {
      if (!result) {
        // If no blog is found, return a 404 page
        return res.status(404).render("404", { title: "Blog Not Found" });
      }
      // Render the "edit" view and pass the blog data to it
      res.render("edit", { blog: result, title: "Edit Blog" });
    })
    .catch((err) => {
      // If an error occurs, log the error and render a 404 page
      console.log(err);
      res.status(404).render("404", { title: "Blog Not Found" });
    });
};

// Handle updating an existing blog post
const blog_update = (req, res) => {
  const id = req.params.id;

  // Prepare the updated blog data
  const updatedData = {
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body,
  };

  // If a new image was uploaded, include the image path
  if (req.file) {
    updatedData.image = "/uploads/" + req.file.filename;
  }

  // Find the blog post by ID and update it with the new data
  Blog.findByIdAndUpdate(id, updatedData, { new: true })
    .then((result) => {
      if (!result) {
        // If the blog is not found, return a 404 error response
        return res.status(404).json({ error: "Blog not found" });
      }
      // Return a JSON response with the redirection URL for the updated blog
      res.json({ redirect: `/blogs/${id}` });
    })
    .catch((err) => {
      // If an error occurs, log it and return a 500 error response
      console.log(err);
      res.status(500).json({ error: "Failed to update blog" });
    });
};

// Handle the deletion of a blog post
const blog_delete = (req, res) => {
  const id = req.params.id;

  // Find the blog post by ID and delete it
  Blog.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        // If the blog is not found, return a 404 error response
        return res.status(404).json({ error: "Blog not found" });
      }
      // Return a JSON response with the redirection URL to the blogs index
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      // If an error occurs, log it and return a 500 error response
      console.log(err);
      res.status(500).json({ error: "Failed to delete blog" });
    });
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_update,
  blog_delete,
  blog_edit_get,
};
