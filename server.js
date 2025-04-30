const express = require('express');
const db = require('./database');
const Course = require("./models/course")
// const upload = require("./config/multer")

const app = express();

app.use(express.json());

// Connect to the database
db();

// POST route to add course data
app.post('/add/data', async (req, res) => {
  try {
    const {title,src,thumbnail,description,price} = req.body;
    
    const newCourse = new Course({title,src,thumbnail,description,price});
    await newCourse.save();


    res.status(201).json({ message: 'data added successfully!'});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to add data'});
    
  }
});

// GET route to fetch course data
app.get('/view/data', async (req, res) => {
  try {
    const findCourse = await Course.find();
    res.status(200).json(findCourse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course data', error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
