const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      requried: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timeStamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
