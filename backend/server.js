const express = require("express");
const cors = require("cors"); // Added CORS
const app = express();
const mysql = require("mysql2");
const moment = require("moment");
const bodyParser = require("body-parser");

// Middleware
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Added to parse JSON bodies
app.use(bodyParser.json());

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
  console.log("Request body:", req.body);
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
      const user = results[0];
      console.log("Login successful");
      return res.status(200).json({
        message: "Login successful",
        token: "fake-jwt-token",
        user_id: user.id,
        hasDistrictInfo: user.district_info_id !== null,
      });
    } else {
      console.log("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }
  });
});

app.post("/api/district_info", (req, res) => {
  const {
    user_id,
    district,
    village,
    health_facility,
    mo_mpw_cho_anu_name,
    asha_name,
    midori_staff_name,
    date,
  } = req.body;

  // Format the date to MySQL datetime format
  const formattedDate = new Date(date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const query = `INSERT INTO district_info_fc (user_id, district, village, health_facility, mo_mpw_cho_anu_name, asha_name, midori_staff_name, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      user_id,
      district,
      village,
      health_facility,
      mo_mpw_cho_anu_name,
      asha_name,
      midori_staff_name,
      formattedDate,
    ],
    (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res
          .status(500)
          .json({ success: false, error: "Failed to store data" });
      }

      // Update users table with the new district_info_id
      const updateUserQuery =
        "UPDATE users SET district_info_id = ? WHERE id = ?";
      db.query(updateUserQuery, [result.insertId, user_id], (updateError) => {
        if (updateError) {
          console.error("Error updating user:", updateError);
          return res
            .status(500)
            .json({ success: false, error: "Failed to update user data" });
        }

        res.status(200).json({ success: true });
      });
    }
  );
});

app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT name FROM Users WHERE id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (results.length > 0) {
      return res.status(200).json({ name: results[0].name });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

// Endpoint to fetch data for FieldDashboard
app.get("/api/user_district_info/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const query = `
    SELECT d.*
    FROM users u
    JOIN district_info_fc d ON u.district_info_id = d.id
    WHERE u.id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: "User district info not found" });
    }
  });
});

// Add new family member (head of family)
app.post("/api/family-members", async (req, res) => {
  const { fc_id, name, aadhar } = req.body;

  try {
    // Start a transaction
    await db.promise().beginTransaction();

    // Insert the new family member
    const [familyResult] = await db.promise().query(
      `INSERT INTO family_members (fc_id, name, Aadhar, head_id, master_data_id, status, date)
       VALUES (?, ?, ?, 0, NULL, 0, NOW())`,
      [fc_id, name, aadhar]
    );
    const fm_id = familyResult.insertId;

    // Insert into master_data
    const [masterDataResult] = await db
      .promise()
      .query(`INSERT INTO master_data (fm_id) VALUES (?)`, [fm_id]);
    const master_data_id = masterDataResult.insertId;

    // Update family_members with master_data_id
    await db
      .promise()
      .query(`UPDATE family_members SET master_data_id = ? WHERE id = ?`, [
        master_data_id,
        fm_id,
      ]);

    // Commit the transaction
    await db.promise().commit();

    res.status(201).json({
      success: true,
      message: "Family member added successfully",
      fm_id,
      master_data_id,
    });
  } catch (error) {
    // If there's an error, rollback the transaction
    await db.promise().rollback();
    console.error("Error inserting family member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch family members for a user
app.get("/api/family-members/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const [rows] = await db.promise().query(
      `SELECT fm.id, fm.name, fm.Aadhar, fm.status,
       (SELECT COUNT(*) FROM family_members WHERE head_id = fm.id) as familyMemberCount
       FROM family_members fm
       WHERE fm.fc_id = ? AND fm.head_id = 0`,
      [user_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
