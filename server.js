const express = require("express");
const db = require("./database");
const Course = require("./models/course");
const updateAllCourses = require("./models/updateDB")
const NewUsers = require("./models/signup");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// const upload = require("./config/multer")

const app = express();

app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Connect to the database
db();

// POST route to add course data
app.post("/add/data", async (req, res) => {
  try {
    const { title, src, thumbnail, description, price , duration, instructor } = req.body;

    const newCourse = new Course({ title, src, thumbnail, description, price ,duration , instructor});
    await newCourse.save();

    res.status(201).json({ message: "data added successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add data" });
  }
});

// GET route to fetch course data
app.get("/view/data", async (req, res) => {
  try {
    const findCourse = await Course.find();
    res.status(200).json(findCourse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch course data", error: error.message });
  }
});

// update data 
app.get("/update", async (req, res) => {
    await updateAllCourses();
    res.send("Courses updated successfully!");
});


// post route for signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const findNewUser = await NewUsers.findOne({ email });

    if (findNewUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await NewUsers.create({ name, email, password: hashedPassword, role });
    return res
      .status(201)
      .json({ success: true, message: "Account Created Successfully" });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Failed to signup" });
  }
});


// get route for find details of all users
app.get("/allusers", async (req, res) => {
  try {
    const findUser = await NewUsers.find();
    res.status(200).json(findUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "data nhi aaya" });
  }
});

//post route for login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const findExistUser = await NewUsers.findOne({ email });

    if (!findExistUser) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      findExistUser.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Email or password" });
    }

    //create token
    const token = jwt.sign(
      { userId: findExistUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    return res
      .cookie("token", token)
      .json({
        message: `welcome back ${findExistUser.name}`,
        success: true,
        findExistUser,
      });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Failed to Login your account" });
  }
});

//get route for logout
app.get("/logout", async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "logged out successfully", success: true });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Failed to Logout" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
