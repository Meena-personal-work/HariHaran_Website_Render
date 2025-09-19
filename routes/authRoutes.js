const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Hardcoded admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "hariharan";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@hariharan25"; // use env var, not plain code

// Login only
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: ADMIN_USERNAME, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  res.json({ token });
});

module.exports = router;
