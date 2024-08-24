const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model
const expressAsyncHandler = require("express-async-handler");
const router = express.Router();

const signup = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Log the received email and password (be careful not to log passwords in production)
  console.log(
    "Received signup request with email:",
    email,
    "and password:",
    password
  );

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log the hashed password (optional)
    console.log("Hashed password:", hashedPassword);

    const user = await User.create({
      email,
      password: hashedPassword,
    });
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    // Log the error details
    console.error("Error during user signup:", error);

    // Send an error response with the error message
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ where: { email } }); // Correctly using where clause
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(user);
  } catch (error) {
    console.error(error); // Logging the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { login, signup };
