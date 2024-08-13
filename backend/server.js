const express = require("express");
const cors = require("cors"); // Added CORS
const app = express();
const mysql = require("mysql2");

// Middleware
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Added to parse JSON bodies

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "$Mumuksh14$",
  database: "user_management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Login Route
app.post("/login", (req, res) => {
  console.log("Request body:", req.body); // Log request body

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = "SELECT * FROM Users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (results.length > 0) {
      console.log("Login successful");
      return res
        .status(200)
        .json({ message: "Login successful", token: "fake-jwt-token" });
    } else {
      console.log("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
