const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import routes
// const userRoutes = require("./routes/userRoutes");
// app.use("/api", userRoutes);

const PORT = process.env.PORT || 500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
