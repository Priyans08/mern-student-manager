const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//  CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

//  SCHEMA
const studentSchema = new mongoose.Schema({
  name: String,
  role: String,
  userId: String,
});

const Student = mongoose.model("Student", studentSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET students
app.get("/students", verifyToken, async (req, res) => {
  const students = await Student.find({ userId: req.userId });
  res.json(students);
});

// ADD student
app.post("/students", verifyToken, async (req, res) => {
  const newStudent = new Student({
    name: req.body.name,
    role: req.body.role,
    userId: req.userId   
  });

  await newStudent.save();
  res.json(newStudent);
});

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  await newUser.save();

  res.json({ message: "User registered" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

  res.json({ token });
});

// DELETE student
app.delete("/students/:id", verifyToken, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
