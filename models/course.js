const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  src: { type: String, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, required: true },
  instructor: { type: String, required: true },
});

const Course = mongoose.model("CourseCollection", courseSchema);

module.exports = Course;
