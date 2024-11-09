const express = require("express");
const cors = require("cors"); // Added CORS
const app = express();
const mysql = require("mysql2");
const moment = require("moment");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const jsonexport = require('jsonexport');
const path = require('path');

// Middleware
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Added to parse JSON bodies
app.use(bodyParser.json());

// MySQL database connection
// REMOTE
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "$Mumuksh14$",
  database: "manipur",
});

// LOCAL
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Admin@123",
//   database: "manipur",
// });

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Login Route
app.post("/api/login", (req, res) => {
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
      delete user.password;
      console.log("Login successful", user);
      return res.status(200).json({
        message: "Login successful",
        token: "fake-jwt-token",
        user_id: user.id,
        hasDistrictInfo: user.district_info_id !== null,
        user_info: user,
      });
    } else {
      console.log("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }
  });
});

//Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists in the database
    const [adminUser] = await db
      .promise()
      .query("SELECT * FROM admin_users WHERE username = ?", [username]);

    if (adminUser.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, adminUser[0].password);
    console.log("Password comparison result:", validPassword);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const adminUserData = adminUser[0];
    delete adminUserData.password;
    // Instead of generating JWT, simply return a success message
    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: adminUserData?.id, // You can return user data as needed
      user_info: adminUserData,
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
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
        "UPDATE Users SET district_info_id = ? WHERE id = ?";
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
    FROM Users u
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
app.post("/api/family-members-head", async (req, res) => {
  const { fc_id, name, aadhar } = req.body;

  try {
    // Start a transaction
    await db.promise().beginTransaction();

    // Fetch di_id based on fc_id from district_info_fc
    // const [diResult] = await db
    //   .promise()
    //   .query(`SELECT id FROM district_info_fc WHERE user_id = ?, [fc_id]`);
    // const di_id = diResult.length > 0 ? diResult[0].id : null;

    const di_id = null;

    // Insert into personal_info table
    const [personalInfoResult] = await db
      .promise()
      .query(`INSERT INTO personal_info (name) VALUES (?), [name]`);
    const personal_info_id = personalInfoResult.insertId;

    // Insert the new family member into family_members table, including di_id
    const [familyResult] = await db.promise().query(
      `INSERT INTO family_members (fc_id, name, Aadhar, head_id, master_data_id, di_id, status, date)
       VALUES (?, ?, ?, 0, NULL, ?, 0, NOW())`,
      [fc_id, name, aadhar, di_id]
    );
    const fm_id = familyResult.insertId;

    // Insert into master_data and update personal_info_id
    const [masterDataResult] = await db
      .promise()
      .query(
        `INSERT INTO master_data (fm_id, personal_info_id) VALUES (?, ?);`,
        [fm_id, personal_info_id]
      );
    const master_data_id = masterDataResult.insertId;

    // Update family_members with master_data_id
    await db
      .promise()
      .query(`UPDATE family_members SET master_data_id = ? WHERE id = ?;`, [
        master_data_id,
        fm_id,
      ]);

    // Commit the transaction
    await db.promise().commit();

    res.status(201).json({
      success: true,
      message: "Family member (head) added successfully",
      fm_id,
      master_data_id,
      personal_info_id,
    });
  } catch (error) {
    // Rollback in case of an error
    await db.promise().rollback();
    console.error("Error inserting family member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch family members for a user
app.get("/api/family-members/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  // console.log("Current Date:", currentDate); // Log the current date
  // console.log("User ID:", user_id); // Log the user ID

  try {
    const [rows] = await db.promise().query(
      `SELECT fm.id, fm.name, fm.Aadhar, fm.status,
       (SELECT COUNT(*) FROM family_members WHERE head_id = fm.id) as familyMemberCount
       FROM family_members fm
       WHERE fm.fc_id = ? AND fm.head_id = 0 AND fm.date = ?`,
      [user_id, currentDate]
    );

    // console.log("Query Result:", rows); // Log the results of the query

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// FIltered Data field dashboard

app.get("/api/filtered-family-members/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const { fromDate, toDate, specificDate, searchTerm, statusFilter } =
    req.query;

  try {
    let query = `
      SELECT fm.id, fm.name, fm.Aadhar, fm.status, fm.date,
      (SELECT COUNT(*) FROM family_members WHERE head_id = fm.id) as familyMemberCount
      FROM family_members fm
      WHERE fm.fc_id = ? AND fm.head_id = 0
    `;

    const queryParams = [user_id];

    if (specificDate) {
      query += " AND DATE(fm.date) = ?";
      queryParams.push(specificDate);
    } else if (fromDate && toDate) {
      query += " AND fm.date BETWEEN ? AND ?";
      queryParams.push(fromDate, toDate);
    } else if (fromDate) {
      query += " AND fm.date >= ?";
      queryParams.push(fromDate);
    } else if (toDate) {
      query += " AND fm.date <= ?";
      queryParams.push(toDate);
    }

    if (searchTerm) {
      query += " AND (fm.name LIKE ? OR fm.Aadhar LIKE ?)";
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (statusFilter) {
      query += " AND fm.status = ?";
      queryParams.push(statusFilter === "pending" ? 0 : 1);
    }

    const [rows] = await db.promise().query(query, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching filtered family members:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Adding family members under a family head
app.post("/api/family-members", async (req, res) => {
  const { fc_id, name, aadhar, head_id } = req.body;
  console.log("Received request to add family member:", {
    fc_id,
    name,
    aadhar,
    head_id,
  });

  // Validate head_id
  if (!head_id || isNaN(parseInt(head_id, 10))) {
    console.error(
      "Invalid or missing head_id provided in the request:",
      head_id
    );
    return res
      .status(400)
      .json({ success: false, message: "Valid head_id is required" });
  }

  const parsedHeadId = parseInt(head_id, 10);

  try {
    // Start a transaction
    await db.promise().beginTransaction();

    // Insert into personal_info table
    const [personalInfoResult] = await db
      .promise()
      .query(`INSERT INTO personal_info (name) VALUES (?)`, [name]);
    const personal_info_id = personalInfoResult.insertId;

    // Insert into family_members table
    const insertQuery = `INSERT INTO family_members (fc_id, name, Aadhar, head_id, master_data_id, status, date)
                         VALUES (?, ?, ?, ?, NULL, 0, NOW())`;
    const insertValues = [fc_id, name, aadhar, parsedHeadId];
    console.log(
      "Executing insert query:",
      insertQuery,
      "with values:",
      insertValues
    );

    const [familyResult] = await db.promise().query(insertQuery, insertValues);
    const fm_id = familyResult.insertId;
    console.log("Inserted family member with ID:", fm_id);

    // Insert into master_data and associate with personal_info_id
    const [masterDataResult] = await db
      .promise()
      .query(
        `INSERT INTO master_data (fm_id, personal_info_id) VALUES (?, ?)`,
        [fm_id, personal_info_id]
      );
    const master_data_id = masterDataResult.insertId;
    console.log("Inserted master_data with ID:", master_data_id);

    // Update family_members with master_data_id
    const updateQuery = `UPDATE family_members SET master_data_id = ? WHERE id = ?`;
    const updateValues = [master_data_id, fm_id];
    console.log(
      "Executing update query:",
      updateQuery,
      "with values:",
      updateValues
    );

    const [updateResult] = await db.promise().query(updateQuery, updateValues);
    console.log("Update result:", updateResult);

    // Commit the transaction
    await db.promise().commit();
    console.log("Transaction committed successfully");

    // Fetch the inserted record to verify
    const [verifyResult] = await db
      .promise()
      .query("SELECT * FROM family_members WHERE id = ?", [fm_id]);
    console.log("Verification of inserted record:", verifyResult[0]);

    res.status(201).json({
      success: true,
      message: "Family member added successfully",
      fm_id,
      master_data_id,
      personal_info_id,
      verifiedRecord: verifyResult[0],
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await db.promise().rollback();
    console.error("Error inserting family member:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Get all family members for a given head_id
app.get("/api/family-members", async (req, res) => {
  const { head_id } = req.query;
  try {
    const [familyMembers] = await db
      .promise()
      .query(`SELECT * FROM family_members WHERE head_id = ? OR id = ?`, [
        head_id,
        head_id,
      ]);
    res.status(200).json({
      success: true,
      data: familyMembers,
    });
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

//FORM DATA

//PERSONAL INFO
app.post("/api/personal-info", async (req, res) => {
  const {
    fm_id,
    name = "",
    identifier = null, // Default to null if not provided
    card_number = "",
    dob = null, // Default to null if not provided
    sex = null, // Default to null if not provided
    tel_no = "",
    address = "",
    state_health_insurance = null, // Default to null if not provided
    state_health_insurance_remark = "",
    disability = null, // Default to null if not provided
    disability_remark = "",
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  // Convert input values to match ENUM in the database
  const genderMap = {
    male: "M",
    female: "F",
    others: "O",
  };
  const sanitizedSex = genderMap[sex.toLowerCase()] || null;

  // Convert empty strings to null for nullable fields
  const sanitizedDob = dob === "" ? null : dob;
  const sanitizedIdentifier = identifier === "" ? null : identifier;
  const sanitizedStateHealthInsurance =
    state_health_insurance === "" ? null : state_health_insurance;
  const sanitizedDisability = disability === "" ? null : disability;

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      name,
      sanitizedIdentifier,
      card_number,
      sanitizedDob,
      sanitizedSex,
      tel_no,
      address,
      sanitizedStateHealthInsurance,
      state_health_insurance_remark,
      sanitizedDisability,
      disability_remark,
    ];

    let personal_info_id;

    // Insert or update personal_info
    const [masterData] = await db
      .promise()
      .query(`SELECT personal_info_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].personal_info_id) {
      // Update existing personal_info
      personal_info_id = masterData[0].personal_info_id;
      await db.promise().query(
        `UPDATE personal_info SET
        name = ?, identifier = ?, card_number = ?, dob = ?, sex = ?,
        tel_no = ?, address = ?, state_health_insurance = ?,
        state_health_insurance_remark = ?, disability = ?, disability_remark = ?
        WHERE id = ?`,
        [...sanitizedValues, personal_info_id]
      );
      console.log(`Updated personal_info with ID: ${personal_info_id}`);
    } else {
      // Insert new personal_info and get the insertId
      const [result] = await db.promise().query(
        `INSERT INTO personal_info 
        (name, identifier, card_number, dob, sex, tel_no, address, 
         state_health_insurance, state_health_insurance_remark, 
         disability, disability_remark) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizedValues
      );
      personal_info_id = result.insertId;
      console.log(`Inserted new personal_info with ID: ${personal_info_id}`);

      // Log fm_id and personal_info_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with personal_info_id: ${personal_info_id}`
      );

      // Update master_data table with the new personal_info_id
      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET personal_info_id = ? WHERE fm_id = ?`, [
          personal_info_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Personal information saved successfully",
      personal_info_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving personal information:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/personal-info/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT personal_info_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].personal_info_id) {
      const [personalInfo] = await db
        .promise()
        .query(`SELECT * FROM personal_info WHERE id = ?`, [
          masterData[0].personal_info_id,
        ]);

      if (personalInfo.length > 0) {
        // Map the single-character sex value back to the full word
        const genderMap = {
          M: "male",
          F: "female",
          O: "others",
        };

        const formattedPersonalInfo = {
          ...personalInfo[0],
          sex: genderMap[personalInfo[0].sex] || personalInfo[0].sex,
        };

        res.status(200).json({
          success: true,
          data: formattedPersonalInfo,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Personal information not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No personal information associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching personal information:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//health-measurements
app.post("/api/health-measurements", async (req, res) => {
  const {
    fm_id,
    height = null,
    weight = null,
    bmi = null,
    temp = null,
    spO2 = null,
    pulse = null, // Add new pulse field
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`);

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedHeight = height === "" ? null : height;
    const sanitizedWeight = weight === "" ? null : weight;
    const sanitizedBmi = bmi === "" ? null : bmi;
    const sanitizedTemp = temp === "" ? null : temp;
    const sanitizedSpO2 = spO2 === "" ? null : spO2;
    const sanitizedPulse = pulse === "" ? null : pulse; // Sanitize pulse

    const sanitizedValues = [
      sanitizedHeight,
      sanitizedWeight,
      sanitizedBmi,
      sanitizedTemp,
      sanitizedSpO2,
      sanitizedPulse, // Add pulse to sanitizedValues
    ];

    let health_id;

    const [masterData] = await db
      .promise()
      .query(`SELECT health_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].health_id) {
      health_id = masterData[0].health_id;
      await db.promise().query(
        `UPDATE health SET
        height = ?, weight = ?, bmi = ?, temp = ?, spO2 = ?, pulse = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, health_id]
      );
      console.log(`Updated health measurements with ID: ${health_id}`);
    } else {
      const [result] = await db.promise().query(
        `INSERT INTO health 
        (height, weight, bmi, temp, spO2, pulse, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      health_id = result.insertId;
      console.log(`Inserted new health measurements with ID: ${health_id}`);

      console.log(
        `Updating master_data for fm_id: ${fm_id} with health_id: ${health_id}`
      );

      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET health_id = ? WHERE fm_id = ?`, [
          health_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Health measurements saved successfully",
      health_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving health measurements:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/health-measurements/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT health_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].health_id) {
      const [healthData] = await db
        .promise()
        .query(`SELECT * FROM health WHERE id = ?`, [masterData[0].health_id]);

      if (healthData.length > 0) {
        res.status(200).json({
          success: true,
          data: healthData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Health measurements not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No health measurements associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching health measurements:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//HTN
app.post("/api/htn-assessment", async (req, res) => {
  const {
    fm_id,
    case_of_htn = null,
    upper_bp = null,
    lower_bp = null,
    action_high_bp = null,
    referral_center = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`);

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      case_of_htn === "" ? null : case_of_htn,
      upper_bp === "" ? null : upper_bp,
      lower_bp === "" ? null : lower_bp,
      action_high_bp === "" ? null : action_high_bp,
      referral_center === "" ? null : referral_center,
    ];

    let htn_id;

    const [masterData] = await db
      .promise()
      .query(`SELECT htn_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].htn_id) {
      htn_id = masterData[0].htn_id;
      await db.promise().query(
        `UPDATE htn SET
        case_of_htn = ?, upper_bp = ?, lower_bp = ?, action_high_bp = ?, referral_center = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, htn_id]
      );
      console.log(`Updated HTN assessment with ID: ${htn_id}`);
    } else {
      const [result] = await db.promise().query(
        `INSERT INTO htn 
        (case_of_htn, upper_bp, lower_bp, action_high_bp, referral_center, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      htn_id = result.insertId;
      console.log(`Inserted new HTN assessment with ID: ${htn_id}`);

      console.log(
        `Updating master_data for fm_id: ${fm_id} with htn_id: ${htn_id}`
      );

      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET htn_id = ? WHERE fm_id = ?`, [
          htn_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "HTN assessment saved successfully",
      htn_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving HTN assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/htn-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT htn_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].htn_id) {
      const [htnData] = await db
        .promise()
        .query(`SELECT * FROM htn WHERE id = ?`, [masterData[0].htn_id]);

      if (htnData.length > 0) {
        res.status(200).json({
          success: true,
          data: htnData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "HTN assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No HTN assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching HTN assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//DM
app.post("/api/dm-assessment", async (req, res) => {
  const {
    fm_id,
    case_of_dm = null,
    fasting_blood_sugar = null,
    post_prandial_blood_sugar = null,
    random_blood_sugar = null,
    action_high_bs = null,
    referral_center = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`);

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      case_of_dm === "" ? null : case_of_dm,
      fasting_blood_sugar === "" ? null : fasting_blood_sugar,
      post_prandial_blood_sugar === "" ? null : post_prandial_blood_sugar,
      random_blood_sugar === "" ? null : random_blood_sugar,
      action_high_bs === "" ? null : action_high_bs,
      referral_center === "" ? null : referral_center,
    ];

    const isHighBS =
      (fasting_blood_sugar && parseFloat(fasting_blood_sugar) >= 126) ||
      (post_prandial_blood_sugar &&
        parseFloat(post_prandial_blood_sugar) >= 200) ||
      (random_blood_sugar && parseFloat(random_blood_sugar) > 140);

    if (!isHighBS && (action_high_bs || referral_center)) {
      return res.status(400).json({
        success: false,
        message:
          "Action for high blood sugar should not be provided for normal blood sugar levels",
      });
    }

    let dm_id;

    const [masterData] = await db
      .promise()
      .query(`SELECT dm_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].dm_id) {
      dm_id = masterData[0].dm_id;
      await db.promise().query(
        `UPDATE DM SET
        case_of_dm = ?, fasting_blood_sugar = ?, post_prandial_blood_sugar = ?, 
        random_blood_sugar = ?, action_high_bs = ?, referral_center = ?, 
        updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, dm_id]
      );
      console.log(`Updated DM assessment with ID: ${dm_id}`);
    } else {
      const [result] = await db.promise().query(
        `INSERT INTO DM 
        (case_of_dm, fasting_blood_sugar, post_prandial_blood_sugar, random_blood_sugar, 
        action_high_bs, referral_center, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      dm_id = result.insertId;
      console.log(`Inserted new DM assessment with ID: ${dm_id}`);

      console.log(
        `Updating master_data for fm_id: ${fm_id} with dm_id: ${dm_id}`
      );

      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET dm_id = ? WHERE fm_id = ?`, [
          dm_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "DM assessment saved successfully",
      dm_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving DM assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/dm-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT dm_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].dm_id) {
      const [dmData] = await db
        .promise()
        .query(`SELECT * FROM DM WHERE id = ?`, [masterData[0].dm_id]);

      if (dmData.length > 0) {
        res.status(200).json({
          success: true,
          data: dmData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "DM assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No DM assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching DM assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//RISK ASSESSMENT

app.post("/api/risk-assessment", async (req, res) => {
  const {
    fm_id,
    age = null,
    tobacco_use = null,
    alcohol_use = null,
    waist_female = null,
    waist_male = null,
    physical_activity = null,
    family_diabetes_history = null,
  } = req.body;

  // Define the mappings
  const mappings = {
    age: {
      "30-39 years": 0,
      "40-49 years": 1,
      "50-59 years": 2,
      "60 years or above": 3,
    },
    tobacco_use: {
      Never: 0,
      "Used to consume in the past/Sometimes now": 1,
      Daily: 2,
    },
    alcohol_use: { No: 0, Yes: 1 },
    waist_female: {
      "80 cm or less": 0,
      "81-90 cm": 1,
      "More than 90 cm": 2,
    },
    waist_male: {
      "90 cm or less": 0,
      "91-100 cm": 1,
      "More than 100 cm": 2,
    },
    physical_activity: {
      "At least 150 minutes in a week": 0,
      "Less than 150 minutes in a week": 1,
    },
    family_diabetes_history: { No: 0, Yes: 1 },
  };

  // Function to calculate risk score based on the mappings
  const calculateRiskScore = () => {
    let score = 0;

    // Calculate score for each field using the mappings
    if (age && mappings.age[age] !== undefined) {
      score += mappings.age[age];
    }

    if (tobacco_use && mappings.tobacco_use[tobacco_use] !== undefined) {
      score += mappings.tobacco_use[tobacco_use];
    }

    if (alcohol_use && mappings.alcohol_use[alcohol_use] !== undefined) {
      score += mappings.alcohol_use[alcohol_use];
    }

    if (waist_female && mappings.waist_female[waist_female] !== undefined) {
      score += mappings.waist_female[waist_female];
    }

    if (waist_male && mappings.waist_male[waist_male] !== undefined) {
      score += mappings.waist_male[waist_male];
    }

    if (
      physical_activity &&
      mappings.physical_activity[physical_activity] !== undefined
    ) {
      score += mappings.physical_activity[physical_activity];
    }

    if (
      family_diabetes_history &&
      mappings.family_diabetes_history[family_diabetes_history] !== undefined
    ) {
      score += mappings.family_diabetes_history[family_diabetes_history];
    }

    console.log("Calculated risk score:", score); // Log the calculated score

    return isNaN(score) ? 0 : score; // Fallback to 0 if score is NaN
  };

  const risk_score = calculateRiskScore();

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      age || null,
      tobacco_use || null,
      alcohol_use || null,
      waist_female || null,
      waist_male || null,
      physical_activity || null,
      family_diabetes_history || null,
      risk_score,
    ];

    let risk_assessment_id;

    // Insert or update Risk Assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT risk_assessment_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].risk_assessment_id) {
      // Update existing Risk Assessment and set updated_at
      risk_assessment_id = masterData[0].risk_assessment_id;
      await db.promise().query(
        `UPDATE risk_assessment SET
        age = ?, tobacco_use = ?, alcohol_use = ?, waist_female = ?, waist_male = ?, physical_activity = ?, 
        family_diabetes_history = ?, risk_score = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, risk_assessment_id]
      );
      console.log(`Updated risk assessment with ID: ${risk_assessment_id}`);
    } else {
      // Insert new Risk Assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO risk_assessment 
        (age, tobacco_use, alcohol_use, waist_female, waist_male, physical_activity, 
         family_diabetes_history, risk_score, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      risk_assessment_id = result.insertId;
      console.log(
        `Inserted new risk assessment with ID: ${risk_assessment_id}`
      );

      // Update master_data table with the new risk_assessment_id
      await db
        .promise()
        .query(
          `UPDATE master_data SET risk_assessment_id = ? WHERE fm_id = ?`,
          [risk_assessment_id, fm_id]
        );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Risk assessment saved successfully",
      risk_assessment_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving risk assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/risk-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    // Fetch risk_assessment_id from master_data
    const [masterData] = await db
      .promise()
      .query(`SELECT risk_assessment_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    // Check if there is an associated risk assessment
    if (masterData.length > 0 && masterData[0].risk_assessment_id) {
      // Fetch risk assessment data
      const [riskData] = await db
        .promise()
        .query(`SELECT * FROM risk_assessment WHERE id = ?`, [
          masterData[0].risk_assessment_id,
        ]);

      // Check if data exists
      if (riskData.length > 0) {
        const assessmentData = riskData[0];

        // Return the fetched risk assessment data
        res.status(200).json({
          success: true,
          data: {
            risk_score: assessmentData.risk_score || 0, // Set default if not found
            alcohol_consumption: assessmentData.alcohol_consumption || "select", // Set default if not found
            family_history_diabetes:
              assessmentData.family_history_diabetes || "select", // Set default if not found
            ...assessmentData, // Include other fields from the assessment
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Risk assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No risk assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching risk assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Oral Cancer Assessment POST Endpoint
app.post("/api/oral-cancer-assessment", async (req, res) => {
  const {
    fm_id,
    known_case = null,
    persistent_ulcer = null,
    persistent_patch = null,
    difficulty_chewing = null,
    difficulty_opening_mouth = null,
    growth_in_mouth = null,
    swelling_in_neck = null,
    suspected_oral_cancer = null,
  } = req.body;

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      known_case === "" ? null : known_case,
      persistent_ulcer === "" ? null : persistent_ulcer,
      persistent_patch === "" ? null : persistent_patch,
      difficulty_chewing === "" ? null : difficulty_chewing,
      difficulty_opening_mouth === "" ? null : difficulty_opening_mouth,
      growth_in_mouth === "" ? null : growth_in_mouth,
      swelling_in_neck === "" ? null : swelling_in_neck,
      suspected_oral_cancer === "" ? null : suspected_oral_cancer,
    ];

    let oral_cancer_id;

    // Insert or update oral cancer assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT oral_cancer_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].oral_cancer_id) {
      // Update existing oral cancer assessment and set updated_at
      oral_cancer_id = masterData[0].oral_cancer_id;
      await db.promise().query(
        `UPDATE oralcancer SET
        known_case = ?, persistent_ulcer = ?, persistent_patch = ?, 
        difficulty_chewing = ?, difficulty_opening_mouth = ?, 
        growth_in_mouth = ?, swelling_in_neck = ?, suspected_oral_cancer = ?, 
        updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, oral_cancer_id]
      );
    } else {
      // Insert new oral cancer assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO oralcancer 
        (known_case, persistent_ulcer, persistent_patch, 
         difficulty_chewing, difficulty_opening_mouth, 
         growth_in_mouth, swelling_in_neck, suspected_oral_cancer, 
         created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      oral_cancer_id = result.insertId;

      // Update master_data table with the new oral_cancer_id
      await db
        .promise()
        .query(`UPDATE master_data SET oral_cancer_id = ? WHERE fm_id = ?`, [
          oral_cancer_id,
          fm_id,
        ]);
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Oral cancer assessment saved successfully",
      oral_cancer_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving oral cancer assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Oral Cancer Assessment GET Endpoint
app.get("/api/oral-cancer-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT oral_cancer_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].oral_cancer_id) {
      const [oralCancerData] = await db
        .promise()
        .query(`SELECT * FROM oralcancer WHERE id = ?`, [
          masterData[0].oral_cancer_id,
        ]);

      if (oralCancerData.length > 0) {
        res.status(200).json({
          success: true,
          data: oralCancerData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Oral cancer assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No oral cancer assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching oral cancer assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Breast Cancer Assessment POST Endpoint
app.post("/api/breast-cancer-assessment", async (req, res) => {
  const {
    fm_id,
    known_case = null,
    lump_in_breast = null,
    blood_stained_discharge = null,
    change_in_shape = null,
    constant_pain_or_swelling = null,
    redness_or_ulcer = null,
    suspected_breast_cancer = null,
  } = req.body;

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      known_case === "" ? null : known_case,
      lump_in_breast === "" ? null : lump_in_breast,
      blood_stained_discharge === "" ? null : blood_stained_discharge,
      change_in_shape === "" ? null : change_in_shape,
      constant_pain_or_swelling === "" ? null : constant_pain_or_swelling,
      redness_or_ulcer === "" ? null : redness_or_ulcer,
      suspected_breast_cancer === "" ? null : suspected_breast_cancer,
    ];

    let breast_cancer_id;

    // Insert or update breast cancer assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT breast_cancer_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].breast_cancer_id) {
      // Update existing breast cancer assessment and set updated_at
      breast_cancer_id = masterData[0].breast_cancer_id;
      await db.promise().query(
        `UPDATE breastcancer SET
        known_case = ?, lump_in_breast = ?, blood_stained_discharge = ?, 
        change_in_shape = ?, constant_pain_or_swelling = ?, 
        redness_or_ulcer = ?, suspected_breast_cancer = ?, 
        updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, breast_cancer_id]
      );
    } else {
      // Insert new breast cancer assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO breastcancer 
        (known_case, lump_in_breast, blood_stained_discharge, 
         change_in_shape, constant_pain_or_swelling, 
         redness_or_ulcer, suspected_breast_cancer, 
         created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      breast_cancer_id = result.insertId;

      // Update master_data table with the new breast_cancer_id
      await db
        .promise()
        .query(`UPDATE master_data SET breast_cancer_id = ? WHERE fm_id = ?`, [
          breast_cancer_id,
          fm_id,
        ]);
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Breast cancer assessment saved successfully",
      breast_cancer_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving breast cancer assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Breast Cancer Assessment GET Endpoint
app.get("/api/breast-cancer-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT breast_cancer_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].breast_cancer_id) {
      const [breastCancerData] = await db
        .promise()
        .query(`SELECT * FROM breastcancer WHERE id = ?`, [
          masterData[0].breast_cancer_id,
        ]);

      if (breastCancerData.length > 0) {
        res.status(200).json({
          success: true,
          data: breastCancerData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Breast cancer assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message:
          "No breast cancer assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching breast cancer assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//Elderly
app.post("/api/elderly-assessment", async (req, res) => {
  const {
    fm_id,
    unsteady_walking = null,
    physical_disability = null,
    help_from_others = null,
    forget_names = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`);

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedUnsteadyWalking =
      unsteady_walking === "" ? null : unsteady_walking;
    const sanitizedPhysicalDisability =
      physical_disability === "" ? null : physical_disability;
    const sanitizedHelpFromOthers =
      help_from_others === "" ? null : help_from_others;
    const sanitizedForgetNames = forget_names === "" ? null : forget_names;

    const sanitizedValues = [
      sanitizedUnsteadyWalking,
      sanitizedPhysicalDisability,
      sanitizedHelpFromOthers,
      sanitizedForgetNames,
    ];

    let elderly_id;

    // Insert or update Elderly assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT elderly_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].elderly_id) {
      // Update existing Elderly assessment and set updated_at
      elderly_id = masterData[0].elderly_id;
      await db.promise().query(
        `UPDATE elderly SET
        unsteady_walking = ?, physical_disability = ?, help_from_others = ?, forget_names = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, elderly_id]
      );
      console.log(`Updated Elderly assessment with ID: ${elderly_id}`);
    } else {
      // Insert new Elderly assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO elderly 
        (unsteady_walking, physical_disability, help_from_others, forget_names, created_at, updated_at) 
        VALUES (?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      elderly_id = result.insertId;
      console.log(`Inserted new Elderly assessment with ID: ${elderly_id}`);

      // Update master_data table with the new elderly_id
      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET elderly_id = ? WHERE fm_id = ?`, [
          elderly_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Elderly assessment saved successfully",
      elderly_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving Elderly assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/elderly-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT elderly_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].elderly_id) {
      const [elderlyData] = await db
        .promise()
        .query(`SELECT * FROM elderly WHERE id = ?`, [
          masterData[0].elderly_id,
        ]);

      if (elderlyData.length > 0) {
        res.status(200).json({
          success: true,
          data: elderlyData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Elderly assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No Elderly assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching Elderly assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/post-stroke-assessment", async (req, res) => {
  const {
    fm_id,
    history_of_stroke = null,
    stroke_date = null,
    present_condition = null,
    stroke_sign_action = null,
    referral_center_name = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedHistoryOfStroke =
      history_of_stroke === "" ? null : history_of_stroke;
    const sanitizedStrokeDate = stroke_date === "" ? null : stroke_date;
    const sanitizedPresentCondition =
      present_condition === "" ? null : present_condition;
    const sanitizedStrokeSignAction =
      stroke_sign_action === "" ? null : stroke_sign_action;
    const sanitizedReferralCenterName =
      referral_center_name === "" ? null : referral_center_name;

    const sanitizedValues = [
      sanitizedHistoryOfStroke,
      sanitizedStrokeDate,
      sanitizedPresentCondition,
      sanitizedStrokeSignAction,
      sanitizedReferralCenterName,
    ];

    let post_stroke_id;

    // Insert or update post-stroke assessment
    const [masterData] = await db
      .promise()
      .query("SELECT post_stroke_id FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].post_stroke_id) {
      // Update existing post-stroke assessment and set updated_at
      post_stroke_id = masterData[0].post_stroke_id;
      await db.promise().query(
        `UPDATE poststroke SET
         history_of_stroke = ?, stroke_date = ?, present_condition = ?, stroke_sign_action = ?, referral_center_name = ?, updated_at = NOW()
         WHERE id = ?`,
        [...sanitizedValues, post_stroke_id]
      );
      console.log(`Updated post-stroke assessment with ID: ${post_stroke_id}`);
    } else {
      // Insert new post-stroke assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO poststroke 
        (history_of_stroke, stroke_date, present_condition, stroke_sign_action, referral_center_name, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      post_stroke_id = result.insertId;
      console.log(
        `Inserted new post-stroke assessment with ID: ${post_stroke_id}`
      );

      // Log fm_id and post_stroke_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with post_stroke_id: ${post_stroke_id}`
      );

      // Update master_data table with the new post_stroke_id
      const [updateResult] = await db
        .promise()
        .query("UPDATE master_data SET post_stroke_id = ? WHERE fm_id = ?", [
          post_stroke_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Post-stroke assessment saved successfully",
      post_stroke_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving post-stroke assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/post-stroke-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query("SELECT post_stroke_id FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].post_stroke_id) {
      const [postStrokeData] = await db
        .promise()
        .query("SELECT * FROM poststroke WHERE id = ?", [
          masterData[0].post_stroke_id,
        ]);

      if (postStrokeData.length > 0) {
        res.status(200).json({
          success: true,
          data: postStrokeData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Post-stroke assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No post-stroke assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching post-stroke assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//copdtb
app.post("/api/copd-tb-assessment", async (req, res) => {
  const {
    fm_id,
    known_case_crd = null,
    crd_specify = null,
    occupational_exposure = null,
    cooking_fuel_type = null,
    chest_sound = null,
    chest_sound_action = null,
    referral_center_name = null,
    copd_confirmed = null,
    copd_confirmation_date = null,
    shortness_of_breath = null,
    coughing_more_than_2_weeks = null,
    blood_in_sputum = null,
    fever_more_than_2_weeks = null,
    night_sweats = null,
    taking_anti_tb_drugs = null,
    family_tb_history = null,
    history_of_tb = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedValues = [
      known_case_crd === "" ? null : known_case_crd,
      crd_specify === "" ? null : crd_specify,
      occupational_exposure === "" ? null : occupational_exposure,
      cooking_fuel_type === "" ? null : cooking_fuel_type,
      chest_sound === "" ? null : chest_sound,
      chest_sound_action === "" ? null : chest_sound_action,
      referral_center_name === "" ? null : referral_center_name,
      copd_confirmed === "" ? null : copd_confirmed,
      copd_confirmation_date === "" ? null : copd_confirmation_date,
      shortness_of_breath === "" ? null : shortness_of_breath,
      coughing_more_than_2_weeks === "" ? null : coughing_more_than_2_weeks,
      blood_in_sputum === "" ? null : blood_in_sputum,
      fever_more_than_2_weeks === "" ? null : fever_more_than_2_weeks,
      night_sweats === "" ? null : night_sweats,
      taking_anti_tb_drugs === "" ? null : taking_anti_tb_drugs,
      family_tb_history === "" ? null : family_tb_history,
      history_of_tb === "" ? null : history_of_tb,
    ];

    let copd_tb_id;

    // Insert or update COPD/TB assessment
    const [masterData] = await db
      .promise()
      .query("SELECT COPD_TB FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].COPD_TB) {
      // Update existing COPD/TB assessment and set updated_at
      copd_tb_id = masterData[0].COPD_TB;
      await db.promise().query(
        `UPDATE copdtb SET
         known_case_crd = ?, crd_specify = ?, occupational_exposure = ?, cooking_fuel_type = ?, chest_sound = ?, chest_sound_action = ?, referral_center_name = ?, copd_confirmed = ?, copd_confirmation_date = ?, shortness_of_breath = ?, coughing_more_than_2_weeks = ?, blood_in_sputum = ?, fever_more_than_2_weeks = ?, night_sweats = ?, taking_anti_tb_drugs = ?, family_tb_history = ?, history_of_tb = ?, updated_at = NOW()
         WHERE id = ?`,
        [...sanitizedValues, copd_tb_id]
      );
      console.log(`Updated COPD/TB assessment with ID: ${copd_tb_id}`);
    } else {
      // Insert new COPD/TB assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO copdtb 
        (known_case_crd, crd_specify, occupational_exposure, cooking_fuel_type, chest_sound, chest_sound_action, referral_center_name, copd_confirmed, copd_confirmation_date, shortness_of_breath, coughing_more_than_2_weeks, blood_in_sputum, fever_more_than_2_weeks, night_sweats, taking_anti_tb_drugs, family_tb_history, history_of_tb, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      copd_tb_id = result.insertId;
      console.log(`Inserted new COPD/TB assessment with ID: ${copd_tb_id}`);

      // Update master_data table with the new COPD_TB id
      const [updateResult] = await db
        .promise()
        .query("UPDATE master_data SET COPD_TB = ? WHERE fm_id = ?", [
          copd_tb_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "COPD/TB assessment saved successfully",
      copd_tb_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving COPD/TB assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/copd-tb-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query("SELECT COPD_TB FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].COPD_TB) {
      const [copdTBData] = await db
        .promise()
        .query("SELECT * FROM copdtb WHERE id = ?", [masterData[0].COPD_TB]);

      if (copdTBData.length > 0) {
        res.status(200).json({
          success: true,
          data: copdTBData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "COPD/TB assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No COPD/TB assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching COPD/TB assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Leprosy
app.post("/api/leprosy-assessment", async (req, res) => {
  const {
    fm_id,
    lesionSensationLoss = null,
    ulceration = null,
    clawingFingers = null,
    inabilityToCloseEyelid = null,
    weaknessFeet = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`);

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedLesionSensationLoss =
      lesionSensationLoss === "" ? null : lesionSensationLoss;
    const sanitizedUlceration = ulceration === "" ? null : ulceration;
    const sanitizedClawingFingers =
      clawingFingers === "" ? null : clawingFingers;
    const sanitizedInabilityToCloseEyelid =
      inabilityToCloseEyelid === "" ? null : inabilityToCloseEyelid;
    const sanitizedWeaknessFeet = weaknessFeet === "" ? null : weaknessFeet;

    const sanitizedValues = [
      sanitizedLesionSensationLoss,
      sanitizedUlceration,
      sanitizedClawingFingers,
      sanitizedInabilityToCloseEyelid,
      sanitizedWeaknessFeet,
    ];

    let leprosy_id;

    // Insert or update Leprosy assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT leprosy_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].leprosy_id) {
      // Update existing Leprosy assessment and set updated_at
      leprosy_id = masterData[0].leprosy_id;
      await db.promise().query(
        `UPDATE leprosy SET
        hypopigmented_patch = ?, recurrent_ulceration = ?, clawing_of_fingers = ?, inability_to_close_eyelid = ?, difficulty_holding_objects = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, leprosy_id]
      );
      console.log(`Updated Leprosy assessment with ID: ${leprosy_id}`);
    } else {
      // Insert new Leprosy assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO leprosy 
        (hypopigmented_patch, recurrent_ulceration, clawing_of_fingers, inability_to_close_eyelid, difficulty_holding_objects, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      leprosy_id = result.insertId;
      console.log(`Inserted new Leprosy assessment with ID: ${leprosy_id}`);

      // Update master_data table with the new leprosy_id
      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET leprosy_id = ? WHERE fm_id = ?`, [
          leprosy_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Leprosy assessment saved successfully",
      leprosy_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving Leprosy assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/leprosy-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT leprosy_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].leprosy_id) {
      const [leprosyData] = await db
        .promise()
        .query(`SELECT * FROM leprosy WHERE id = ?`, [
          masterData[0].leprosy_id,
        ]);

      if (leprosyData.length > 0) {
        res.status(200).json({
          success: true,
          data: leprosyData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Leprosy assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No Leprosy assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching Leprosy assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Hearing Issue
app.post("/api/hearing-issue-assessment", async (req, res) => {
  const { fm_id, difficultyHearing = null } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  try {
    await db.promise().beginTransaction();

    // Convert empty string to null for nullable fields
    const sanitizedDifficultyHearing =
      difficultyHearing === "" ? null : difficultyHearing;

    let hearing_id;

    // Insert or update hearing issue assessment
    const [masterData] = await db
      .promise()
      .query("SELECT hearing_id FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].hearing_id) {
      // Update existing hearing issue assessment and set updated_at
      hearing_id = masterData[0].hearing_id;
      await db
        .promise()
        .query(
          "UPDATE hearingissue SET difficulty_hearing = ?, updated_at = NOW() WHERE id = ?",
          [sanitizedDifficultyHearing, hearing_id]
        );
      console.log(`Updated hearing issue assessment with ID: ${hearing_id}`);
    } else {
      // Insert new hearing issue assessment and set created_at and updated_at
      const [result] = await db
        .promise()
        .query(
          "INSERT INTO hearingissue (difficulty_hearing, created_at, updated_at) VALUES (?, NOW(), NOW())",
          [sanitizedDifficultyHearing]
        );
      hearing_id = result.insertId;
      console.log(
        `Inserted new hearing issue assessment with ID: ${hearing_id}`
      );

      // Log fm_id and hearing_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with hearing_id: ${hearing_id}`
      );

      // Update master_data table with the new hearing_id
      const [updateResult] = await db
        .promise()
        .query("UPDATE master_data SET hearing_id = ? WHERE fm_id = ?", [
          hearing_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Hearing issue assessment saved successfully",
      hearing_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving hearing issue assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/hearing-issue-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query("SELECT hearing_id FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].hearing_id) {
      const [hearingData] = await db
        .promise()
        .query("SELECT * FROM hearingissue WHERE id = ?", [
          masterData[0].hearing_id,
        ]);

      if (hearingData.length > 0) {
        res.status(200).json({
          success: true,
          data: hearingData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Hearing issue assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message:
          "No hearing issue assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching hearing issue assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Abhaid
app.post("/api/abhaid-assessment", async (req, res) => {
  const { fm_id, abhaidStatus = null } = req.body;

  console.log(`Received fm_id: ${fm_id}`);

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedAbhaidStatus = abhaidStatus === "" ? null : abhaidStatus;

    const sanitizedValues = [sanitizedAbhaidStatus];

    let abhaid_id;

    // Insert or update Abhaid assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT AHBA_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].AHBA_id) {
      // Update existing Abhaid assessment and set updated_at
      abhaid_id = masterData[0].AHBA_id;
      await db.promise().query(
        `UPDATE abhaid SET
        abhaid_status = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, abhaid_id]
      );
      console.log(`Updated Abhaid assessment with ID: ${abhaid_id}`);
    } else {
      // Insert new Abhaid assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO abhaid 
        (abhaid_status, created_at, updated_at) 
        VALUES (?, NOW(), NOW())`,
        sanitizedValues
      );
      abhaid_id = result.insertId;
      console.log(`Inserted new Abhaid assessment with ID: ${abhaid_id}`);

      // Update master_data table with the new abhaid_id
      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET AHBA_id = ? WHERE fm_id = ?`, [
          abhaid_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Abhaid assessment saved successfully",
      abhaid_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving Abhaid assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/abhaid-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT AHBA_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].AHBA_id) {
      const [abhaidData] = await db
        .promise()
        .query(`SELECT * FROM abhaid WHERE id = ?`, [masterData[0].AHBA_id]);

      if (abhaidData.length > 0) {
        res.status(200).json({
          success: true,
          data: abhaidData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Abhaid assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No Abhaid assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching Abhaid assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Cataract Assessment
app.post("/api/cataract-assessment", async (req, res) => {
  const {
    fm_id,
    cloudyBlurredVision = null,
    painOrRedness = null,
    cataractAssessmentResult = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedCloudyBlurredVision =
      cloudyBlurredVision === "" ? null : cloudyBlurredVision;
    const sanitizedPainOrRedness = painOrRedness === "" ? null : painOrRedness;
    const sanitizedCataractAssessmentResult =
      cataractAssessmentResult === "" ? null : cataractAssessmentResult;

    const sanitizedValues = [
      sanitizedCloudyBlurredVision,
      sanitizedPainOrRedness,
      sanitizedCataractAssessmentResult,
    ];

    let cataract_id;

    // Insert or update cataract assessment
    const [masterData] = await db
      .promise()
      .query("SELECT cataract_id FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].cataract_id) {
      // Update existing cataract assessment and set updated_at
      cataract_id = masterData[0].cataract_id;
      await db.promise().query(
        `UPDATE cataract SET
         cloudy_blurred_vision = ?, pain_or_redness = ?, cataract_assessment_result = ?, updated_at = NOW()
         WHERE id = ?`,
        [...sanitizedValues, cataract_id]
      );
      console.log(`Updated cataract assessment with ID: ${cataract_id}`);
    } else {
      // Insert new cataract assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO cataract 
        (cloudy_blurred_vision, pain_or_redness, cataract_assessment_result, created_at, updated_at) 
        VALUES (?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      cataract_id = result.insertId;
      console.log(`Inserted new cataract assessment with ID: ${cataract_id}`);

      // Log fm_id and cataract_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with cataract_id: ${cataract_id}`
      );

      // Update master_data table with the new cataract_id
      const [updateResult] = await db
        .promise()
        .query("UPDATE master_data SET cataract_id = ? WHERE fm_id = ?", [
          cataract_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Cataract assessment saved successfully",
      cataract_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving cataract assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/cataract-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query("SELECT cataract_id FROM master_data WHERE fm_id = ?", [fm_id]);

    if (masterData.length > 0 && masterData[0].cataract_id) {
      const [cataractData] = await db
        .promise()
        .query("SELECT * FROM cataract WHERE id = ?", [
          masterData[0].cataract_id,
        ]);

      if (cataractData.length > 0) {
        res.status(200).json({
          success: true,
          data: cataractData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Cataract assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No cataract assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching cataract assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//MENTALHEALTH
app.post("/api/mental-health-assessment", async (req, res) => {
  const {
    fm_id,
    little_interest_or_pleasure = null,
    feeling_down_or_depressed = null,
    mental_health_problem = null,
    history_of_fits = null,
    other_mental_disorder = null,
    brief_intervention_given = null, // This matches the table schema
    intervention_type = null,
    mental_health_score = 0, // Calculated score from the frontend
  } = req.body;

  console.log("Received data from frontend:", req.body);

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      little_interest_or_pleasure || null,
      feeling_down_or_depressed || null,
      mental_health_problem || null,
      history_of_fits || null,
      other_mental_disorder || null,
      brief_intervention_given || null, // Ensure it matches schema
      intervention_type || null,
      mental_health_score || 0,
    ];

    let mental_health_assessment_id;

    const [masterData] = await db
      .promise()
      .query(`SELECT mental_health_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].mental_health_id) {
      mental_health_assessment_id = masterData[0].mental_health_id;
      await db.promise().query(
        `UPDATE mentalhealth SET
        little_interest_or_pleasure = ?, feeling_down_or_depressed = ?, 
        mental_health_problem = ?, history_of_fits = ?, other_mental_disorder = ?, 
        brief_intervention_given = ?, intervention_type = ?, mental_health_score = ?, 
        updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, mental_health_assessment_id]
      );
      console.log(
        `Updated Mental Health assessment with ID: ${mental_health_assessment_id}`
      );
    } else {
      const [result] = await db.promise().query(
        `INSERT INTO mentalhealth 
        (little_interest_or_pleasure, feeling_down_or_depressed, 
        mental_health_problem, history_of_fits, other_mental_disorder, 
        brief_intervention_given, intervention_type, mental_health_score, 
        created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      mental_health_assessment_id = result.insertId;
      console.log(
        `Inserted new Mental Health assessment with ID: ${mental_health_assessment_id}`
      );

      await db
        .promise()
        .query(`UPDATE master_data SET mental_health_id = ? WHERE fm_id = ?`, [
          mental_health_assessment_id,
          fm_id,
        ]);
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Mental Health assessment saved successfully",
      mental_health_assessment_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving Mental Health assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/mental-health-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT mental_health_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].mental_health_id) {
      const [mentalHealthData] = await db
        .promise()
        .query(`SELECT * FROM mentalhealth WHERE id = ?`, [
          masterData[0].mental_health_id,
        ]);

      if (mentalHealthData.length > 0) {
        res.status(200).json({
          success: true,
          data: mentalHealthData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Mental Health assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message:
          "No Mental Health assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching Mental Health assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//ckd
app.post("/api/ckd-assessment", async (req, res) => {
  const {
    fm_id,
    knownCKD = null,
    historyCKDStone = null,
    ageAbove50 = null,
    hypertensionPatient = null,
    diabetesPatient = null,
    anemiaPatient = null,
    historyOfStroke = null,
    swellingFaceLeg = null,
    historyNSAIDS = null,
    ckdRiskScore = 0,
  } = req.body;

  const riskaAssessment = ckdRiskScore >= 5 ? "Risk" : "No Risk";

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      knownCKD || null,
      historyCKDStone || null,
      ageAbove50 || null,
      hypertensionPatient || null,
      diabetesPatient || null,
      anemiaPatient || null,
      historyOfStroke || null,
      swellingFaceLeg || null,
      historyNSAIDS || null,
      ckdRiskScore || 0,
      riskaAssessment,
    ];

    let ckd_assessment_id;

    const [masterData] = await db
      .promise()
      .query(`SELECT CKD_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].CKD_id) {
      ckd_assessment_id = masterData[0].CKD_id;
      await db.promise().query(
        `UPDATE ckd_assessment SET
        knownCKD = ?, historyCKDStone = ?, ageAbove50 = ?, hypertensionPatient = ?, diabetesPatient = ?, 
        anemiaPatient = ?, historyOfStroke = ?, swellingFaceLeg = ?, historyNSAIDS = ?, 
        ckdRiskScore = ?, riskaAssessment = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, ckd_assessment_id]
      );
      console.log(`Updated CKD assessment with ID: ${ckd_assessment_id}`);
    } else {
      const [result] = await db.promise().query(
        `INSERT INTO ckd_assessment 
        (knownCKD, historyCKDStone, ageAbove50, hypertensionPatient, diabetesPatient, 
         anemiaPatient, historyOfStroke, swellingFaceLeg, historyNSAIDS, ckdRiskScore, 
         riskaAssessment, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      ckd_assessment_id = result.insertId;
      console.log(`Inserted new CKD assessment with ID: ${ckd_assessment_id}`);

      console.log(
        `Updating master_data for fm_id: ${fm_id} with CKD_id: ${ckd_assessment_id}`
      );

      await db
        .promise()
        .query(`UPDATE master_data SET CKD_id = ? WHERE fm_id = ?`, [
          ckd_assessment_id,
          fm_id,
        ]);
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "CKD assessment saved successfully",
      ckd_assessment_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving CKD assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/ckd-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT CKD_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].CKD_id) {
      const [ckdData] = await db
        .promise()
        .query(`SELECT * FROM ckd_assessment WHERE id = ?`, [
          masterData[0].CKD_id,
        ]);

      if (ckdData.length > 0) {
        res.status(200).json({
          success: true,
          data: ckdData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "CKD assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No CKD assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching CKD assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/cervical-cancer-assessment", async (req, res) => {
  const {
    fm_id,
    known_case = null,
    bleeding_between_periods = null,
    bleeding_after_menopause = null,
    bleeding_after_intercourse = null,
    foul_smelling_discharge = null,
    via_appointment_date = null,
    via_result = null,
  } = req.body;

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      known_case === "" ? null : known_case,
      bleeding_between_periods === "" ? null : bleeding_between_periods,
      bleeding_after_menopause === "" ? null : bleeding_after_menopause,
      bleeding_after_intercourse === "" ? null : bleeding_after_intercourse,
      foul_smelling_discharge === "" ? null : foul_smelling_discharge,
      via_appointment_date === "" ? null : via_appointment_date,
      via_result === "" ? null : via_result,
    ];

    let cervical_cancer_id;

    // Insert or update cervical cancer assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT cervical_cancer_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].cervical_cancer_id) {
      // Update existing cervical cancer assessment and set updated_at
      cervical_cancer_id = masterData[0].cervical_cancer_id;
      await db.promise().query(
        `UPDATE cervicalcancer SET
        known_case = ?, bleeding_between_periods = ?, bleeding_after_menopause = ?, 
        bleeding_after_intercourse = ?, foul_smelling_discharge = ?, 
        via_appointment_date = ?, via_result = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, cervical_cancer_id]
      );
    } else {
      // Insert new cervical cancer assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO cervicalcancer 
        (known_case, bleeding_between_periods, bleeding_after_menopause, 
         bleeding_after_intercourse, foul_smelling_discharge, 
         via_appointment_date, via_result, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      cervical_cancer_id = result.insertId;

      // Update master_data table with the new cervical_cancer_id
      await db
        .promise()
        .query(
          `UPDATE master_data SET cervical_cancer_id = ? WHERE fm_id = ?`,
          [cervical_cancer_id, fm_id]
        );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Cervical cancer assessment saved successfully",
      cervical_cancer_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving cervical cancer assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/cervical-cancer-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT cervical_cancer_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].cervical_cancer_id) {
      const [cervicalCancerData] = await db
        .promise()
        .query(`SELECT * FROM cervicalcancer WHERE id = ?`, [
          masterData[0].cervical_cancer_id,
        ]);

      if (cervicalCancerData.length > 0) {
        res.status(200).json({
          success: true,
          data: cervicalCancerData[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Cervical cancer assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message:
          "No cervical cancer assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching cervical cancer assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// CVD Assessment POST Endpoint
app.post("/api/cvd-assessment", async (req, res) => {
  const {
    fm_id,
    known_case = null,
    heart_sound = null,
    symptom = null,
    cvd_date = null,
    suspected_cvd = null,
    teleconsultation = null,
    referral = null,
    referral_centre = null,
  } = req.body;

  console.log("Received data:", req.body);

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      known_case === "" ? null : known_case,
      heart_sound === "" ? null : heart_sound,
      symptom === "" ? null : symptom,
      cvd_date === "" ? null : cvd_date,
      suspected_cvd === "" ? null : suspected_cvd,
      teleconsultation === "" ? null : teleconsultation,
      referral === "" ? null : referral,
      referral_centre === "" ? null : referral_centre,
    ];

    console.log("Sanitized values:", sanitizedValues); // Add this line
    let cvd_id;

    // Insert or update CVD assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT CVD_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].CVD_id) {
      // Update existing CVD assessment
      cvd_id = masterData[0].CVD_id;
      const updateQuery = `UPDATE cvd SET known_case = ?, heart_sound = ?, symptom = ?, cvd_date = ?, 
      suspected_cvd = ?, teleconsultation = ?, referral = ?, referral_centre = ?, 
      updated_at = NOW() WHERE id = ?`;
      console.log("Update query:", updateQuery); // Add this line
      await db.promise().query(updateQuery, [...sanitizedValues, cvd_id]);
    } else {
      // Insert new CVD assessment
      const [result] = await db.promise().query(
        `INSERT INTO cvd (known_case, heart_sound, symptom, cvd_date, suspected_cvd, 
        teleconsultation, referral, referral_centre, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      cvd_id = result.insertId;

      // Update master_data table with the new CVD_id
      await db
        .promise()
        .query(`UPDATE master_data SET CVD_id = ? WHERE fm_id = ?`, [
          cvd_id,
          fm_id,
        ]);
    }

    await db.promise().commit();
    res.status(200).json({
      success: true,
      message: "CVD assessment saved successfully",
      cvd_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving CVD assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// CVD Assessment GET Endpoint
app.get("/api/cvd-assessment/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    const [masterData] = await db
      .promise()
      .query(`SELECT CVD_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].CVD_id) {
      const [cvdData] = await db
        .promise()
        .query(`SELECT * FROM cvd WHERE id = ?`, [masterData[0].CVD_id]);

      if (cvdData.length > 0) {
        res.status(200).json({ success: true, data: cvdData[0] });
      } else {
        res.status(404).json({
          success: false,
          message: "CVD assessment not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No CVD assessment associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching CVD assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API endpoint to get detected diseases based on fm_id
app.get("/api/diseases/:fm_id", (req, res) => {
  const { fm_id } = req.params;

  const queries = [
    `SELECT 'HTN' as disease FROM htn WHERE fm_id = ? AND case_of_htn IN ('yes and on treatment', 'yes and not on treatment')`,
    `SELECT 'DM' as disease FROM dm WHERE fm_id = ? AND case_of_dm IN ('yes and on treatment', 'yes and not on treatment')`,
    `SELECT 'CVD' as disease FROM cvd WHERE fm_id = ? AND suspected_cvd = 'yes'`,
    `SELECT 'Oral Cancer' as disease FROM oralcancer WHERE fm_id = ? AND suspected_oral_cancer = 'yes'`,
    `SELECT 'Breast Cancer' as disease FROM breastcancer WHERE fm_id = ? AND suspected_breast_cancer = 'yes'`,
    `SELECT 'Cervical Cancer' as disease FROM cervicalcancer WHERE fm_id = ? AND via_result = 'yes'`,
    `SELECT 'Post Stroke' as disease FROM poststroke WHERE fm_id = ? AND history_of_stroke = 'yes'`,
    `SELECT 'CKD' as disease FROM ckd_assessment WHERE fm_id = ? AND ckdRiskScore >= 5`,
    `SELECT 'COPD/TB' as disease FROM copdtb WHERE fm_id = ? AND known_case_crd = 'yes'`,
    `SELECT 'Cataract' as disease FROM cataract WHERE fm_id = ? AND cataract_assessment_result = 'suspected'`,
    `SELECT 'Leprosy' as disease FROM leprosy WHERE fm_id = ? AND (hypopigmented_patch = 'Yes' OR recurrent_ulceration = 'Yes' OR clawing_of_fingers = 'Yes' OR inability_to_close_eyelid = 'Yes' OR difficulty_holding_objects = 'Yes')`,
    `SELECT 'Elderly Condition' as disease FROM elderly WHERE fm_id = ? AND (unsteady_walking = 'Yes' OR physical_disability = 'Yes' OR help_from_others = 'Yes' OR forget_names = 'Yes')`,
    `SELECT 'Mental Health Problem' as disease FROM mentalhealth WHERE fm_id = ? AND mental_health_score > 3`,
    `SELECT 'Risk' as disease FROM risk_assessment WHERE fm_id = ? AND risk_score > 4`,
  ];

  const diseasePromises = queries.map((query) => {
    return new Promise((resolve, reject) => {
      db.query(query, [fm_id], (err, results) => {
        if (err) reject(err);
        resolve(results.map((row) => row.disease));
      });
    });
  });

  Promise.all(diseasePromises)
    .then((diseaseArrays) => {
      const diseases = [].concat(...diseaseArrays);
      res.json({ diseases });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.post("/api/assessment-and-action-taken", async (req, res) => {
  const {
    fm_id,
    majorNCDDetected = null,
    anyOtherDiseaseDetected = null,
    knownCaseDMWithHTN = null,
    teleconsultation = null,
    prescriptionGiven = null,
    otherAdvices = null,
    remarks = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`);

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      majorNCDDetected === "" ? null : majorNCDDetected,
      anyOtherDiseaseDetected === "" ? null : anyOtherDiseaseDetected,
      knownCaseDMWithHTN === "" ? null : knownCaseDMWithHTN,
      teleconsultation === "" ? null : teleconsultation,
      prescriptionGiven === "" ? null : prescriptionGiven,
      otherAdvices === "" ? null : otherAdvices,
      remarks === "" ? null : remarks,
    ];

    let assesmentandaction_id;

    // Check if the family member already has an assessment and action ID in the master_data
    const [masterData] = await db
      .promise()
      .query("SELECT assesmentandaction_id FROM master_data WHERE fm_id = ?", [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].assesmentandaction_id) {
      // Update existing assessment record
      assesmentandaction_id = masterData[0].assesmentandaction_id;
      await db.promise().query(
        `UPDATE assessment_and_action_taken SET
        major_ncd_detected = ?, any_other_disease_detected = ?, known_case_dm_htn = ?, 
        teleconsultation = ?, prescription_given = ?, other_advices = ?, remarks = ?, 
        updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, assesmentandaction_id]
      );
      console.log(
        `Updated assessment and action taken with ID: ${assesmentandaction_id}`
      );
    } else {
      // Insert a new assessment record
      const [result] = await db.promise().query(
        `INSERT INTO assessment_and_action_taken 
        (major_ncd_detected, any_other_disease_detected, known_case_dm_htn, 
         teleconsultation, prescription_given, other_advices, remarks, 
         created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      assesmentandaction_id = result.insertId;
      console.log(
        `Inserted new assessment and action taken with ID: ${assesmentandaction_id}`
      );

      // Update the master_data table with the new assessmentandaction_id
      const [updateResult] = await db
        .promise()
        .query(
          "UPDATE master_data SET assesmentandaction_id = ? WHERE fm_id = ?",
          [assesmentandaction_id, fm_id]
        );
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Assessment and action taken saved successfully",
      assesmentandaction_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error saving assessment and action taken:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/assessment-and-action-taken/:fm_id", async (req, res) => {
  const { fm_id } = req.params;

  try {
    // Fetch assesmentandaction_id from master_data
    const [masterData] = await db
      .promise()
      .query("SELECT assesmentandaction_id FROM master_data WHERE fm_id = ?", [
        fm_id,
      ]);

    // Check if the family member has an associated assessment and action
    if (masterData.length > 0 && masterData[0].assesmentandaction_id) {
      // Fetch the data from assessment_and_action_taken table
      const [assessmentData] = await db.promise().query(
        `SELECT 
          id, 
          major_ncd_detected AS majorNCDDetected, 
          any_other_disease_detected AS anyOtherDiseaseDetected, 
          known_case_dm_htn AS knownCaseDMWithHTN, 
          teleconsultation, 
          prescription_given AS prescriptionGiven, 
          other_advices AS otherAdvices, 
          remarks, 
          created_at, 
          updated_at 
        FROM assessment_and_action_taken WHERE id = ?`,
        [masterData[0].assesmentandaction_id]
      );

      // Check if data exists
      if (assessmentData.length > 0) {
        // Send the fetched data back in the response
        res.status(200).json({
          success: true,
          data: assessmentData[0], // Return the first row of data
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Assessment and action taken not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message:
          "No assessment and action taken associated with this family member",
      });
    }
  } catch (error) {
    console.error("Error fetching assessment and action taken:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/final-submit", async (req, res) => {
  const { fm_id } = req.body;

  try {
    // Update the family_members table's status field to 1 for the given fm_id
    const [result] = await db
      .promise()
      .query(`UPDATE family_members SET status = 1 WHERE id = ?`, [fm_id]);

    if (result.affectedRows > 0) {
      res.status(200).json({
        success: true,
        message: "Data submitted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Family member not found",
      });
    }
  } catch (error) {
    console.error("Error updating family member status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/family-heads", async (req, res) => {
  try {
    const [familyMembers] = await db
      .promise()
      .query(`SELECT * FROM family_members WHERE head_id = 0`);
    res.status(200).json({
      success: true,
      data: familyMembers,
    });
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/api/users/:user_id/associates", async (req, res) => {
  const { user_id } = req.params;
  const { start_date, end_date } = req.query; // Get date range from query parameters

  try {
    // Query to get all associated users
    const [associatedUsers] = await db
      .promise()
      .query(`SELECT * FROM Users WHERE manager_id = ?`, [user_id]);

    if (associatedUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No associated users found for the given user_id",
      });
    }

    // Iterate through each associated user to get their family members within the date range
    const results = await Promise.all(
      associatedUsers.map(async (user) => {
        let query = `SELECT * FROM family_members WHERE fc_id = ?`;
        let params = [user.user_id];

        // Add date range filter if both start_date and end_date are provided
        if (start_date && end_date) {
          query += ` AND date BETWEEN ? AND ?`;
          params.push(start_date, end_date);
        }

        const [familyMembers] = await db.promise().query(query, params);

        return {
          user: user,
          familyMembers: familyMembers,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching associated users and family members:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/api/family-details/", async (req, res) => {
  try {
    const { head_id } = req.query;

    const [familyMembers] = await db
      .promise()
      .query(
        "SELECT id AS family_member_id FROM family_members WHERE head_id = ?",
        [head_id]
      );

    if (familyMembers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No family members found for this head_id.",
      });
    }

    const familyDetails = await Promise.all(
      familyMembers.map(async (member) => {
        const [masterData] = await db.promise().query(
          `SELECT 
            md.*,
            pi.*,
            h.*,
            htn.*,
            dm.*,
            ra.*,
            oc.*,
            bc.*,
            cc.*,
            cvd.*,
            ps.*,
            ckd.*,
            copd.*,
            cat.*,
            hr.*,
            lep.*,
            el.*,
            mh.*,
            aa.*
          FROM 
            master_data md
          LEFT JOIN personal_info pi ON md.personal_info_id = pi.id
          LEFT JOIN health h ON md.health_id = h.id
          LEFT JOIN htn ON md.htn_id = htn.id
          LEFT JOIN DM dm ON md.dm_id = dm.id
          LEFT JOIN risk_assessment ra ON md.risk_assessment_id = ra.id
          LEFT JOIN oralcancer oc ON md.oral_cancer_id = oc.id
          LEFT JOIN breastcancer bc ON md.breast_cancer_id = bc.id
          LEFT JOIN cervicalcancer cc ON md.cervical_cancer_id = cc.id
          LEFT JOIN cvd ON md.cvd_id = cvd.id
          LEFT JOIN poststroke ps ON md.post_stroke_id = ps.id
          LEFT JOIN ckd_assessment ckd ON md.CKD_id = ckd.id
          LEFT JOIN copdtb copd ON md.COPD_TB = copd.id
          LEFT JOIN cataract cat ON md.cataract_id = cat.id
          LEFT JOIN hearingissue hr ON md.hearing_id = hr.id
          LEFT JOIN leprosy lep ON md.leprosy_id = lep.id
          LEFT JOIN elderly el ON md.elderly_id = el.id
          LEFT JOIN mentalhealth mh ON md.mental_health_id = mh.id
          LEFT JOIN assessment_and_action_taken aa ON md.assesmentandaction_id = aa.id
          WHERE md.fm_id = ?`,
          [member.family_member_id]
        );
        return masterData;
      })
    );
    res.status(200).json({
      success: true,
      data: familyDetails.flat(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve family details.",
    });
  }
});

app.get("/api/user-list/", async (req, res) => {
  try {
    const { user_type, is_active } = req.query;

    let query = `
      SELECT u.*, m.name as manager_name
      FROM Users u
      LEFT JOIN Users m ON u.manager_id = m.id
      WHERE u.is_active = ?
    `;
    let queryParams = [is_active !== undefined ? is_active : true];

    if (user_type && user_type !== "all") {
      query += ` AND u.role = ?`;
      queryParams.push(user_type);
    }

    const [users] = await db.promise().query(query, queryParams);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post("/api/users", async (req, res) => {
  const {
    name,
    email,
    phone_number,
    verification_id,
    verification_id_type,
    role,
    password,
    user_id,
  } = req.body;
  try {
    // Update the family_members table's status field to 1 for the given fm_id
    const [result] = await db.promise().query(
      `INSERT INTO Users (name, email, phone, verification_id, verification_id_type, role, password, district_info_id, manager_id)
         VALUES (?,?,?,?,?,?,?,NULL,?)`,
      [
        name,
        email,
        phone_number,
        verification_id,
        verification_id_type,
        role,
        password,
        user_id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Data submitted successfully",
    });
  } catch (error) {
    console.error("Error updating family member status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/api/users/:user_id", async (req, res) => {
  const { user_id } = req.params; // Get user_id from URL parameter
  const {
    name,
    email,
    phone_number,
    verification_id,
    verification_id_type,
    role,
    password,
    is_active,
  } = req.body;

  try {
    // Create an array of fields to update and an array of corresponding values
    let updates = [];
    let values = [];

    // Add only fields that are provided (non-null) in the request body
    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (is_active) {
      updates.push("is_active = ?");
      values.push(is_active);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone_number) {
      updates.push("phone = ?");
      values.push(phone_number);
    }
    if (verification_id) {
      updates.push("verification_id = ?");
      values.push(verification_id);
    }
    if (verification_id_type) {
      updates.push("verification_id_type = ?");
      values.push(verification_id_type);
    }
    if (role) {
      updates.push("role = ?");
      values.push(role);
    }
    if (password) {
      updates.push("password = ?");
      values.push(password);
    }

    // If no fields are provided to update, return an error
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Add the user_id to the values array for the WHERE clause
    values.push(user_id);

    // Construct the SQL query dynamically based on which fields need to be updated
    const sqlQuery = `UPDATE Users SET ${updates.join(", ")} WHERE id = ?`;

    // Execute the query
    const [result] = await db.promise().query(sqlQuery, values);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// village apis
app.post("/api/create-village", async (req, res) => {
  const { village_name, village_id } = req.body;
  if (!village_name || !village_id) {
    return res
      .status(500)
      .json({ success: false, message: "Village name and ID are required" });
  }
  try {
    const [rows] = await db
      .promise()
      .query("INSERT INTO villages (village_id, name) VALUES (?, ?)", [
        village_id,
        village_name,
      ]);
    res.status(200).json({
      success: true,
      message: "Village created successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error creating village:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/village-list", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM villages");
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching village:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//Screening Date
app.get("/api/family-member-date/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [familyMemberData] = await db
      .promise()
      .query(
        `SELECT id, name, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM family_members WHERE id = ?`,
        [id]
      );
    if (familyMemberData.length > 0) {
      res.status(200).json({
        success: true,
        data: familyMemberData[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Family member not found",
      });
    }
  } catch (error) {
    console.error("Error fetching family member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/family-member-date/:id", async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;
  try {
    if (date && date.trim() !== "") {
      // Update the date only if a valid date is provided
      await db
        .promise()
        .query(`UPDATE family_members SET date = ? WHERE id = ?`, [date, id]);
    } else {
      // Do not update the date if no valid date is provided
      console.log("No valid date provided; skipping date update.");
    }
    res
      .status(200)
      .json({ success: true, message: "Date updated successfully" });
  } catch (error) {
    console.error("Error updating date:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Created by Tanmay Pradhan - 28 Oct 2024
app.get("/api/get-master-list", async (req, res) => {
  const {
    skip_count,
    page_limit,
    from_date,
    to_date,
    status,
    risk_score,
    case_of_htn,
    case_of_dm,
    suspected_oral_cancer,
    suspected_breast_cancer,
    cervical_cancer,
    known_cvd,
    history_of_stroke,
    known_ckd,
    cataract_assessment_result,
    difficulty_hearing,
    abhaid_status,
    search_term,
    village,
    district,
    health_facility,
    sex,
    age,
    alcohol_use,
    disability,
    leprosy
  } = req.query;

  if (!skip_count || !page_limit || !from_date || !to_date) {
    return res
      .status(500)
      .json({ success: false, message: "Skip Count, Page Limit, From Date and To Date are required" });
  }
  try {

    let query = `SELECT 
          family_members.name AS 'family_members_name',
          Users.name AS 'field_coordinator_name',
          district_info.district AS 'district',
          district_info.village AS 'village',
          pi.name AS 'pi_name',
          pi.identifier AS 'pi_identifier',
          pi.card_number AS 'pi_card_number',
          pi.dob AS 'pi_dob',
          pi.sex AS 'pi_sex',
          pi.tel_no AS 'pi_tel_no',
          pi.address AS 'pi_address',
          pi.state_health_insurance AS 'pi_state_health_insurance',
          pi.state_health_insurance_remark AS 'pi_state_health_insurance_remark',
          pi.disability AS 'pi_disability',
          pi.disability_remark AS 'pi_disability_remark',
          h.height AS 'height',
          h.weight AS 'weight',
          h.bmi AS 'bmi',
          h.temp AS 'temperature',
          h.spO2 AS 'spO2',
          h.pulse AS 'pulse',
          ht.case_of_htn AS 'case_of_htn',
          ht.action_high_bp AS 'action_high_bp',
          ht.referral_center AS 'referral_center_htn',
          ht.upper_bp AS 'upper_bp',
          ht.lower_bp AS 'lower_bp',
          dm.case_of_dm AS 'case_of_dm',
          dm.action_high_bs AS 'action_high_bs',
          dm.referral_center AS 'referral_center_dm',
          dm.fasting_blood_sugar AS 'fasting_blood_sugar',
          dm.post_prandial_blood_sugar AS 'post_prandial_blood_sugar',
          dm.random_blood_sugar AS 'random_blood_sugar',
          ra.age AS 'age',
          ra.tobacco_use AS 'tobacco_use',
          ra.alcohol_use AS 'alcohol_use',
          ra.waist_female AS 'waist_female',
          ra.waist_male AS 'waist_male',
          ra.physical_activity AS 'physical_activity',
          ra.family_diabetes_history AS 'family_diabetes_history',
          ra.risk_score AS 'risk_score',
          oc.known_case AS 'oc_known_case',
          oc.persistent_ulcer AS 'persistent_ulcer',
          oc.persistent_patch AS 'persistent_patch',
          oc.difficulty_chewing AS 'difficulty_chewing',
          oc.difficulty_opening_mouth AS 'difficulty_opening_mouth',
          oc.growth_in_mouth AS 'growth_in_mouth',
          oc.swelling_in_neck AS 'swelling_in_neck',
          oc.suspected_oral_cancer AS 'suspected_oral_cancer',
          bc.known_case AS 'bc_known_case',
          bc.lump_in_breast AS 'lump_in_breast',
          bc.blood_stained_discharge AS 'blood_stained_discharge',
          bc.change_in_shape AS 'change_in_shape',
          bc.constant_pain_or_swelling AS 'constant_pain_or_swelling',
          bc.redness_or_ulcer AS 'redness_or_ulcer',
          bc.suspected_breast_cancer AS 'suspected_breast_cancer',
          cc.known_case AS 'cc_known_case',
          cc.bleeding_between_periods AS 'bleeding_between_periods',
          cc.bleeding_after_menopause AS 'bleeding_after_menopause',
          cc.bleeding_after_intercourse AS 'bleeding_after_intercourse',
          cc.foul_smelling_discharge AS 'foul_smelling_discharge',
          cc.via_appointment_date AS 'via_appointment_date',
          cc.via_result AS 'via_result',
          cvd.known_case AS 'cvd_known_case',
          cvd.heart_sound AS 'heart_sound',
          cvd.symptom AS 'symptom',
          cvd.cvd_date AS 'cvd_date',
          cvd.suspected_cvd AS 'suspected_cvd',
          cvd.teleconsultation AS 'cvd_teleconsultation',
          cvd.referral AS 'cvd_referral',
          cvd.referral_centre AS 'cvd_referral_centre',
          ps.history_of_stroke AS 'history_of_stroke',
          ps.stroke_date AS 'stroke_date',
          ps.present_condition AS 'present_condition',
          ps.stroke_sign_action AS 'stroke_sign_action',
          ps.referral_center_name AS 'referral_center_name',
          ckd.knownCKD AS 'known_ckd',
          ckd.historyCKDStone AS 'history_ckd_stone',
          ckd.ageAbove50 AS 'age_above_50',
          ckd.hypertensionPatient AS 'hypertension_patient',
          ckd.diabetesPatient AS 'diabetes_patient',
          ckd.anemiaPatient AS 'anemia_patient',
          ckd.historyOfStroke AS 'history_of_stroke_ckd',
          ckd.swellingFaceLeg AS 'swelling_face_leg',
          ckd.historyNSAIDS AS 'history_nsaids',
          ckd.ckdRiskScore AS 'ckd_risk_score',
          ckd.riskaAssessment AS 'risk_assessment',
          ct.known_case_crd AS 'known_case_crd',
          ct.crd_specify AS 'crd_specify',
          ct.occupational_exposure AS 'occupational_exposure',
          ct.cooking_fuel_type AS 'cooking_fuel_type',
          ct.chest_sound AS 'chest_sound',
          ct.chest_sound_action AS 'chest_sound_action',
          ct.referral_center_name AS 'referral_center_name_ct',
          ct.copd_confirmed AS 'copd_confirmed',
          ct.copd_confirmation_date AS 'copd_confirmation_date',
          ct.shortness_of_breath AS 'shortness_of_breath',
          ct.coughing_more_than_2_weeks AS 'coughing_more_than_2_weeks',
          ct.blood_in_sputum AS 'blood_in_sputum',
          ct.fever_more_than_2_weeks AS 'fever_more_than_2_weeks',
          ct.night_sweats AS 'night_sweats',
          ct.taking_anti_tb_drugs AS 'taking_anti_tb_drugs',
          ct.family_tb_history AS 'family_tb_history',
          ct.history_of_tb AS 'history_of_tb',
          ca.cloudy_blurred_vision AS 'cloudy_blurred_vision',
          ca.pain_or_redness AS 'pain_or_redness',
          ca.cataract_assessment_result AS 'cataract_assessment_result',
          hi.difficulty_hearing AS 'difficulty_hearing',
          lp.hypopigmented_patch AS 'hypopigmented_patch',
          lp.recurrent_ulceration AS 'recurrent_ulceration',
          lp.clawing_of_fingers AS 'clawing_of_fingers',
          lp.inability_to_close_eyelid AS 'inability_to_close_eyelid',
          lp.difficulty_holding_objects AS 'difficulty_holding_objects',
          el.unsteady_walking AS 'unsteady_walking',
          el.physical_disability AS 'physical_disability',
          el.help_from_others AS 'help_from_others',
          el.forget_names AS 'forget_names',
          mh.little_interest_or_pleasure AS 'little_interest_or_pleasure',
          mh.feeling_down_or_depressed AS 'feeling_down_or_depressed',
          mh.mental_health_score AS 'mental_health_score',
          mh.mental_health_problem AS 'mental_health_problem',
          mh.history_of_fits AS 'history_of_fits',
          mh.other_mental_disorder AS 'other_mental_disorder',
          mh.brief_intervention_given AS 'brief_intervention_given',
          mh.intervention_type AS 'intervention_type',
          aat.major_ncd_detected AS 'major_ncd_detected',
          aat.any_other_disease_detected AS 'any_other_disease_detected',
          aat.known_case_dm_htn AS 'known_case_dm_htn',
          aat.teleconsultation AS 'teleconsultation',
          aat.prescription_given AS 'prescription_given',
          aat.other_advices AS 'other_advices',
          aat.remarks AS 'remarks',
          ab.abhaid_status AS 'abha_id_status',
          family_members.date AS 'screening_date',
          district_info.health_facility AS 'health_facility'
        FROM family_members
        JOIN Users ON Users.id = family_members.fc_id AND Users.role = 'Field Coordinator'
        LEFT JOIN (SELECT dif1.user_id, dif1.district, dif1.village, dif1.health_facility
        FROM
          district_info_fc dif1
        INNER JOIN (
          SELECT user_id, MAX(id) AS max_id
          FROM
            district_info_fc
          GROUP BY
            user_id
          ) dif2 ON dif1.user_id = dif2.user_id AND dif1.id = dif2.max_id
        ) AS district_info ON district_info.user_id = Users.id
        LEFT JOIN master_data ON master_data.id = family_members.master_data_id
        LEFT JOIN personal_info AS pi ON pi.id = master_data.personal_info_id
        LEFT JOIN health AS h ON h.id = master_data.health_id
        LEFT JOIN htn AS ht ON ht.id = master_data.htn_id
        LEFT JOIN DM AS dm ON dm.id = master_data.dm_id
        LEFT JOIN risk_assessment AS ra ON ra.id = master_data.risk_assessment_id
        LEFT JOIN oralcancer AS oc ON oc.id = master_data.oral_cancer_id
        LEFT JOIN breastcancer AS bc ON bc.id = master_data.breast_cancer_id
        LEFT JOIN cervicalcancer AS cc ON cc.id = master_data.cervical_cancer_id
        LEFT JOIN cvd AS cvd ON cvd.id = master_data.CVD_id
        LEFT JOIN poststroke AS ps ON ps.id = master_data.post_stroke_id
        LEFT JOIN ckd_assessment AS ckd ON ckd.id = master_data.CKD_id
        LEFT JOIN copdtb AS ct ON ct.id = master_data.COPD_TB
        LEFT JOIN cataract AS ca ON ca.id = master_data.cataract_id
        LEFT JOIN hearingissue AS hi ON hi.id = master_data.hearing_id
        LEFT JOIN leprosy AS lp ON lp.id = master_data.leprosy_id
        LEFT JOIN elderly AS el ON el.id = master_data.elderly_id
        LEFT JOIN mentalhealth AS mh ON mh.id = master_data.mental_health_id
        LEFT JOIN assessment_and_action_taken AS aat ON aat.id = master_data.assesmentandaction_id
        LEFT JOIN abhaid AS ab ON ab.id = master_data.AHBA_id
        WHERE family_members.date BETWEEN ? AND ? `;

    let totalQuery = `
    SELECT 
          COUNT(*) AS total_rows
        FROM family_members
        JOIN Users ON Users.id = family_members.fc_id AND Users.role = 'Field Coordinator'
        LEFT JOIN (SELECT dif1.user_id, dif1.district, dif1.village, dif1.health_facility
        FROM
          district_info_fc dif1
        INNER JOIN (
          SELECT user_id, MAX(id) AS max_id
          FROM
            district_info_fc
          GROUP BY
            user_id
          ) dif2 ON dif1.user_id = dif2.user_id AND dif1.id = dif2.max_id
        ) AS district_info ON district_info.user_id = Users.id
        LEFT JOIN master_data ON master_data.id = family_members.master_data_id
        LEFT JOIN personal_info AS pi ON pi.id = master_data.personal_info_id
        LEFT JOIN health AS h ON h.id = master_data.health_id
        LEFT JOIN htn AS ht ON ht.id = master_data.htn_id
        LEFT JOIN DM AS dm ON dm.id = master_data.dm_id
        LEFT JOIN risk_assessment AS ra ON ra.id = master_data.risk_assessment_id
        LEFT JOIN oralcancer AS oc ON oc.id = master_data.oral_cancer_id
        LEFT JOIN breastcancer AS bc ON bc.id = master_data.breast_cancer_id
        LEFT JOIN cervicalcancer AS cc ON cc.id = master_data.cervical_cancer_id
        LEFT JOIN cvd AS cvd ON cvd.id = master_data.CVD_id
        LEFT JOIN poststroke AS ps ON ps.id = master_data.post_stroke_id
        LEFT JOIN ckd_assessment AS ckd ON ckd.id = master_data.CKD_id
        LEFT JOIN copdtb AS ct ON ct.id = master_data.COPD_TB
        LEFT JOIN cataract AS ca ON ca.id = master_data.cataract_id
        LEFT JOIN hearingissue AS hi ON hi.id = master_data.hearing_id
        LEFT JOIN leprosy AS lp ON lp.id = master_data.leprosy_id
        LEFT JOIN elderly AS el ON el.id = master_data.elderly_id
        LEFT JOIN mentalhealth AS mh ON mh.id = master_data.mental_health_id
        LEFT JOIN assessment_and_action_taken AS aat ON aat.id = master_data.assesmentandaction_id
        LEFT JOIN abhaid AS ab ON ab.id = master_data.AHBA_id
        WHERE family_members.date BETWEEN ? AND ? `;

    const params = [from_date, to_date];

    if (status) {
      query += "AND family_members.status = ? ";
      totalQuery += "AND family_members.status = ? ";
      params.push(status);
    }

    if (risk_score) {
      query += "AND ra.risk_score = ? ";
      totalQuery += "AND ra.risk_score = ? ";
      params.push(risk_score);
    }

    if (case_of_htn) {
      query += "AND ht.case_of_htn = ? ";
      totalQuery += "AND ht.case_of_htn = ? ";
      params.push(case_of_htn);
    }

    if (case_of_dm) {
      query += "AND dm.case_of_dm = ? ";
      totalQuery += "AND dm.case_of_dm = ? ";
      params.push(case_of_dm);
    }

    if (suspected_oral_cancer) {
      query += "AND oc.suspected_oral_cancer = ? ";
      totalQuery += "AND oc.suspected_oral_cancer = ? ";
      params.push(suspected_oral_cancer);
    }

    if (suspected_breast_cancer) {
      query += "AND bc.suspected_breast_cancer = ? ";
      totalQuery += "AND bc.suspected_breast_cancer = ? ";
      params.push(suspected_breast_cancer);
    }

    if (cervical_cancer) {
      query += "AND cc.known_case = ? ";
      totalQuery += "AND cc.known_case = ? ";
      params.push(cervical_cancer);
    }

    if (known_cvd) {
      query += "AND cvd.known_case = ? ";
      totalQuery += "AND cvd.known_case = ? ";
      params.push(known_cvd);
    }

    if (history_of_stroke) {
      query += "AND ps.history_of_stroke = ? ";
      totalQuery += "AND ps.history_of_stroke = ? ";
      params.push(history_of_stroke);
    }

    if (known_ckd) {
      query += "AND ckd.knownCKD = ? ";
      totalQuery += "AND ckd.knownCKD = ? ";
      params.push(known_ckd);
    }

    if (cataract_assessment_result) {
      query += "AND ca.cataract_assessment_result = ? ";
      totalQuery += "AND ca.cataract_assessment_result = ? ";
      params.push(cataract_assessment_result);
    }

    if (difficulty_hearing) {
      query += "AND hi.difficulty_hearing = ? ";
      totalQuery += "AND hi.difficulty_hearing = ? ";
      params.push(difficulty_hearing);
    }

    if (abhaid_status) {
      query += "AND ab.abhaid_status = ? ";
      totalQuery += "AND ab.abhaid_status = ? ";
      params.push(abhaid_status);
    }

    if (village) {
      query += "AND district_info.village = ? ";
      totalQuery += "AND district_info.village = ? ";
      params.push(village);
    }

    if (district) {
      query += "AND district_info.district LIKE ? ";
      totalQuery += "AND district_info.district LIKE ? ";
      params.push(`%${district}%`,);
    }

    if (health_facility) {
      query += "AND district_info.health_facility LIKE ? ";
      totalQuery += "AND district_info.health_facility LIKE ? ";
      params.push(`%${health_facility}%`,);
    }

    if (sex) {
      query += "AND pi.sex = ? ";
      totalQuery += "AND pi.sex = ? ";
      params.push(sex);
    }

    if (age) {
      query += "AND ra.age = ? ";
      totalQuery += "AND ra.age = ? ";
      params.push(age);
    }

    if (alcohol_use) {
      query += "AND ra.alcohol_use = ? ";
      totalQuery += "AND ra.alcohol_use = ? ";
      params.push(alcohol_use);
    }

    if (disability) {
      query += "AND pi.disability = ? ";
      totalQuery += "AND pi.disability = ? ";
      params.push(disability);
    }

    if (leprosy == 'Yes') {
      query += "AND (lp.hypopigmented_patch = ? OR lp.recurrent_ulceration = ? OR lp.clawing_of_fingers = ? OR lp.inability_to_close_eyelid = ? OR lp.difficulty_holding_objects = ?) ";
      totalQuery += "AND (lp.hypopigmented_patch = ? OR lp.recurrent_ulceration = ? OR lp.clawing_of_fingers = ? OR lp.inability_to_close_eyelid = ? OR lp.difficulty_holding_objects = ?) ";
      params.push(leprosy, leprosy, leprosy, leprosy, leprosy);
    } else if (leprosy == 'No') {
      query += "AND (lp.hypopigmented_patch = ? AND lp.recurrent_ulceration = ? AND lp.clawing_of_fingers = ? AND lp.inability_to_close_eyelid = ? AND lp.difficulty_holding_objects = ?) ";
      totalQuery += "AND (lp.hypopigmented_patch = ? AND lp.recurrent_ulceration = ? AND lp.clawing_of_fingers = ? AND lp.inability_to_close_eyelid = ? AND lp.difficulty_holding_objects = ?) ";
      params.push(leprosy, leprosy, leprosy, leprosy, leprosy);
    }

    if (search_term) {
      query +=
        "AND (family_members.name LIKE ? OR pi.card_number LIKE ? OR district_info.district LIKE ? OR district_info.village LIKE ?) ";
      totalQuery +=
        "AND (family_members.name LIKE ? OR pi.card_number LIKE ? OR district_info.district LIKE ? OR district_info.village LIKE ?) ";
      params.push(
        `%${search_term}%`,
        `%${search_term}%`,
        `%${search_term}%`,
        `%${search_term}%`
      );
    }

    if (page_limit != '-1' && skip_count != '-1') {
      query += `LIMIT ? OFFSET ?;`;
      params.push(parseInt(page_limit));
      params.push(parseInt(skip_count));
    }

    const [result] = await db.promise().query(query, params);

    if (page_limit != '-1' && skip_count != '-1') {
      params.splice(-2, 2);
    }

    const [totalResult] = await db.promise().query(totalQuery, params);

    if (result.length > 0) {
      res.status(200).json({
        success: true,
        total_count: totalResult[0].total_rows,
        skip_count: parseInt(skip_count),
        page_limit: parseInt(page_limit),
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        total_count: totalResult[0].total_rows,
        skip_count: parseInt(skip_count),
        page_limit: parseInt(page_limit),
        data: [],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Created by Tanmay Pradhan - 05 Nov 2024
app.get("/api/get-screening-report", async (req, res) => {
  const {
    skip_count,
    page_limit,
    from_date,
    to_date,
    search_term,
  } = req.query;

  if (!skip_count || !page_limit || !from_date || !to_date) {
    return res
      .status(500)
      .json({ success: false, message: "Skip Count, Page Limit, From Date and To Date are required" });
  }
  try {

    let query = `SELECT u.name AS 'field_coordinator_name', dif.district, dif.village, 
    dif.health_facility,
    COUNT(fm.id) AS 'screen_count'
    FROM Users u 
    LEFT JOIN district_info_fc dif ON u.district_info_id = dif.id 
    LEFT JOIN family_members fm ON fm.fc_id = u.id
    WHERE fm.date BETWEEN ? AND ?
    AND fm.status = 1 `;

    const params = [from_date, to_date];

    if (search_term) {
      query += "AND (u.name LIKE ? OR dif.district LIKE ? OR dif.village LIKE ? OR dif.health_facility LIKE ?) ";
      params.push(`%${search_term}%`, `%${search_term}%`, `%${search_term}%`, `%${search_term}%`);
    }

    query += `GROUP BY u.name, dif.district, dif.village, dif.health_facility LIMIT ? OFFSET ?;`;
    params.push(parseInt(page_limit));
    params.push(parseInt(skip_count));

    let totalScreenQuery = `SELECT COUNT(fm.id) AS 'total_screenings' 
    FROM family_members fm
    WHERE fm.status = 1;`;

    let currentScreenQuery = `SELECT COUNT(fm.id) AS 'today_screenings' 
    FROM family_members fm
    WHERE fm.date = CURDATE()
    AND fm.status = 1;`;

    const [result] = await db.promise().query(query, params);

    const [totalResult] = await db.promise().query(totalScreenQuery);

    const [currentResult] = await db.promise().query(currentScreenQuery);

    if (result.length > 0) {
      res.status(200).json({
        success: true,
        total_screenings_till_date: totalResult[0].total_screenings,
        today_screenings: currentResult[0].today_screenings,
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        total_screenings_till_date: totalResult[0].total_screenings,
        today_screenings: currentResult[0].today_screenings,
        data: [],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Created by Tanmay Pradhan - 28 Oct 2024
app.get("/api/export-master-list", async (req, res) => {
  const {
    from_date,
    to_date,
    status,
    risk_score,
    case_of_htn,
    case_of_dm,
    suspected_oral_cancer,
    suspected_breast_cancer,
    cervical_cancer,
    known_cvd,
    history_of_stroke,
    known_ckd,
    cataract_assessment_result,
    difficulty_hearing,
    abhaid_status,
    search_term,
    village,
    district,
    health_facility,
    sex,
    age,
    alcohol_use,
    disability,
    leprosy
  } = req.query;

  if (!from_date || !to_date) {
    return res
      .status(500)
      .json({ success: false, message: "From Date and To Date are required" });
  }
  try {

    let query = `SELECT
      ROW_NUMBER() OVER (ORDER BY district_info.district) AS 'Sr No',
      district_info.district AS 'District',
      district_info.health_facility AS 'Health Facility',
      district_info.village AS 'Village',
      Users.name AS 'Field Coordinator Name',
      district_info.asha_name AS 'ASHA Name',
      district_info.midori_staff_name AS 'Midori Staff Name',
      family_members.date AS 'Screening Date',
      head_members.name AS 'Head of Family',
      pi.name AS 'Patient Name',
      pi.tel_no AS 'Patient Tel No',
      pi.identifier AS 'Patient Identifier',
      pi.card_number AS 'Identification Number',
      pi.dob AS 'Date of Birth',
      pi.sex AS 'Sex',
      pi.address AS 'Address',
      dm.case_of_dm AS 'Case of DM',
      dm.fasting_blood_sugar AS 'Fasting Blood Sugar',
      dm.post_prandial_blood_sugar AS 'Post Prandial Blood Sugar',
      dm.random_blood_sugar AS 'Random Blood Sugar',
      ra.age AS 'Age',
      pi.state_health_insurance AS 'State Health Insurance',
      pi.state_health_insurance_remark AS 'State Health Insurance Remark',
      pi.disability AS 'Disability',
      pi.disability_remark AS 'Disability Remark',
      h.height AS 'Height',
      h.weight AS 'Weight',
      h.bmi AS 'BMI',
      h.temp AS 'Temperature',
      h.spO2 AS 'SPO2',
      h.pulse AS 'Pulse',
      ht.case_of_htn AS 'Case of HTN',
      ht.action_high_bp AS 'Action High BP',
      ht.referral_center AS 'Referral Center HTN',
      ht.upper_bp AS 'Upper BP',
      ht.lower_bp AS 'Lower BP',
      dm.action_high_bs AS 'Action High BS',
      dm.referral_center AS 'Referral Center DM',
      ra.tobacco_use AS 'Tobacco Use',
      ra.alcohol_use AS 'Alcohol Use',
      ra.waist_female AS 'Female Waist',
      ra.waist_male AS 'Male Waist',
      ra.physical_activity AS 'Physical Activity',
      ra.family_diabetes_history AS 'Family Diabetes History',
      ra.risk_score AS 'Risk Score',
      oc.known_case AS 'OC Known Case',
      oc.difficulty_opening_mouth AS 'Difficulty Opening Mouth',
      oc.persistent_ulcer AS 'Persistent Ulcer',
      oc.growth_in_mouth AS 'Growth in Mouth',
      oc.persistent_patch AS 'Persistent Patch',
      oc.difficulty_chewing AS 'Difficulty Chewing',
      oc.swelling_in_neck AS 'Swelling in Neck',
      oc.suspected_oral_cancer AS 'Suspected Oral Cancer',
      bc.known_case AS 'BC Known Case',
      bc.lump_in_breast AS 'Lump in Breast',
      bc.blood_stained_discharge AS 'Blood Stained Discharge',
      bc.change_in_shape AS 'Change in Shape',
      bc.constant_pain_or_swelling AS 'Constant Pain or Swelling',
      bc.redness_or_ulcer AS 'Redness or Ulcer',
      bc.suspected_breast_cancer AS 'Suspected Breast Cancer',
      cc.known_case AS 'CC Known Case',
      cc.bleeding_between_periods AS 'Bleeding Between Periods',
      cc.bleeding_after_menopause AS 'Bleeding After Menopause',
      cc.bleeding_after_intercourse AS 'Bleeding After Intercourse',
      cc.foul_smelling_discharge AS 'Foul Smelling Discharge',
      cc.via_appointment_date AS 'VIA Appointment Date',
      cc.via_result AS 'VIA Result',
      cvd.known_case AS 'CVD Known Case',
      cvd.heart_sound AS 'Heart Sound',
      cvd.symptom AS 'Symptom',
      cvd.cvd_date AS 'CVD Date',
      cvd.suspected_cvd AS 'Suspected CVD',
      cvd.teleconsultation AS 'Teleconsultation',
      cvd.referral AS 'Referral',
      cvd.referral_centre AS 'Referral Centre',
      ps.history_of_stroke AS 'History of Stroke',
      ps.stroke_date AS 'Stroke Date',
      ps.present_condition AS 'Present Condition',
      ps.stroke_sign_action AS 'Stroke Sign Action',
      ps.referral_center_name AS 'Referral Center Name',
      ckd.knownCKD AS 'Known CKD',
      ckd.historyCKDStone AS 'History CKD Stone',
      ckd.ageAbove50 AS 'Age Above 50',
      ckd.hypertensionPatient AS 'Hypertension Patient',
      ckd.diabetesPatient AS 'Diabetes Patient',
      ckd.anemiaPatient AS 'Anemia Patient',
      ckd.historyOfStroke AS 'History of Stroke CKD',
      ckd.swellingFaceLeg AS 'Swelling Face Leg',
      ckd.historyNSAIDS AS 'History NSAIDS',
      ckd.ckdRiskScore AS 'CKD Risk Score',
      ckd.riskaAssessment AS 'Risk Assessment',
      ct.known_case_crd AS 'Known Case CRD',
      ct.crd_specify AS 'CRD Specify',
      ct.occupational_exposure AS 'Occupational Exposure',
      ct.cooking_fuel_type AS 'Cooking Fuel Type',
      ct.chest_sound AS 'Chest Sound',
      ct.chest_sound_action AS 'Chest Sound Action',
      ct.referral_center_name AS 'Referral Center Name CT',
      ct.copd_confirmed AS 'COPD Confirmed',
      ct.copd_confirmation_date AS 'COPD Confirmation Date',
      ct.shortness_of_breath AS 'Shortness of Breath',
      ct.coughing_more_than_2_weeks AS 'Coughing More Than 2 Weeks',
      ct.blood_in_sputum AS 'Blood in Sputum',
      ct.fever_more_than_2_weeks AS 'Fever More Than 2 Weeks',
      ct.night_sweats AS 'Night Sweats',
      ct.taking_anti_tb_drugs AS 'Taking Anti TB Drugs',
      ct.family_tb_history AS 'Family TB History',
      ct.history_of_tb AS 'History of TB',
      ca.cloudy_blurred_vision AS 'Cloudy Blurred Vision',
      ca.pain_or_redness AS 'Pain or Redness',
      ca.cataract_assessment_result AS 'Cataract Assessment Result',
      hi.difficulty_hearing AS 'Difficulty Hearing',
      lp.hypopigmented_patch AS 'Hypopigmented Patch',
      lp.recurrent_ulceration AS 'Recurrent Ulceration',
      lp.clawing_of_fingers AS 'Clawing of Fingers',
      lp.inability_to_close_eyelid AS 'Inability to Close Eyelid',
      lp.difficulty_holding_objects AS 'Difficulty Holding Objects',
      el.unsteady_walking AS 'Unsteady Walking',
      el.physical_disability AS 'Physical Disability',
      el.help_from_others AS 'Help from Others',
      el.forget_names AS 'Forget Names',
      mh.little_interest_or_pleasure AS 'Little Interest or Pleasure',
      mh.feeling_down_or_depressed AS 'Feeling Down or Depressed',
      mh.mental_health_score AS 'Mental Health Score',
      mh.mental_health_problem AS 'Mental Health Problem',
      mh.history_of_fits AS 'History of Fits',
      mh.other_mental_disorder AS 'Other Mental Disorder',
      mh.brief_intervention_given AS 'Brief Intervention Given',
      mh.intervention_type AS 'Intervention Type',
      aat.major_ncd_detected AS 'Major NCD Detected',
      aat.any_other_disease_detected AS 'Any Other Disease Detected',
      aat.known_case_dm_htn AS 'Known Case DM HTN',
      aat.teleconsultation AS 'Teleconsultation',
      aat.prescription_given AS 'Prescription Given',
      aat.other_advices AS 'Other Advices',
      aat.remarks AS 'Remarks',
      ab.abhaid_status AS 'ABHA ID Status' 
    FROM family_members
    JOIN Users ON Users.id = family_members.fc_id AND Users.role = 'Field Coordinator'
    LEFT JOIN (SELECT dif1.user_id, dif1.district, dif1.village, dif1.health_facility, dif1.asha_name, dif1.midori_staff_name
    FROM
      district_info_fc dif1
    INNER JOIN (
      SELECT user_id, MAX(id) AS max_id
      FROM
        district_info_fc
      GROUP BY
        user_id
      ) dif2 ON dif1.user_id = dif2.user_id AND dif1.id = dif2.max_id
    ) AS district_info ON district_info.user_id = Users.id
    LEFT JOIN master_data ON master_data.id = family_members.master_data_id
    LEFT JOIN personal_info AS pi ON pi.id = master_data.personal_info_id
    LEFT JOIN health AS h ON h.id = master_data.health_id
    LEFT JOIN htn AS ht ON ht.id = master_data.htn_id
    LEFT JOIN DM AS dm ON dm.id = master_data.dm_id
    LEFT JOIN risk_assessment AS ra ON ra.id = master_data.risk_assessment_id
    LEFT JOIN oralcancer AS oc ON oc.id = master_data.oral_cancer_id
    LEFT JOIN breastcancer AS bc ON bc.id = master_data.breast_cancer_id
    LEFT JOIN cervicalcancer AS cc ON cc.id = master_data.cervical_cancer_id
    LEFT JOIN cvd AS cvd ON cvd.id = master_data.CVD_id
    LEFT JOIN poststroke AS ps ON ps.id = master_data.post_stroke_id
    LEFT JOIN ckd_assessment AS ckd ON ckd.id = master_data.CKD_id
    LEFT JOIN copdtb AS ct ON ct.id = master_data.COPD_TB
    LEFT JOIN cataract AS ca ON ca.id = master_data.cataract_id
    LEFT JOIN hearingissue AS hi ON hi.id = master_data.hearing_id
    LEFT JOIN leprosy AS lp ON lp.id = master_data.leprosy_id
    LEFT JOIN elderly AS el ON el.id = master_data.elderly_id
    LEFT JOIN mentalhealth AS mh ON mh.id = master_data.mental_health_id
    LEFT JOIN assessment_and_action_taken AS aat ON aat.id = master_data.assesmentandaction_id
    LEFT JOIN abhaid AS ab ON ab.id = master_data.AHBA_id
    LEFT JOIN family_members AS head_members ON head_members.id = family_members.head_id
    WHERE family_members.date BETWEEN ? AND ? `;

    const params = [from_date, to_date];

    if (status) {
      query += "AND family_members.status = ? ";
      params.push(status);
    }

    if (risk_score) {
      query += "AND ra.risk_score = ? ";
      params.push(risk_score);
    }

    if (case_of_htn) {
      query += "AND ht.case_of_htn = ? ";
      params.push(case_of_htn);
    }

    if (case_of_dm) {
      query += "AND dm.case_of_dm = ? ";
      params.push(case_of_dm);
    }

    if (suspected_oral_cancer) {
      query += "AND oc.suspected_oral_cancer = ? ";
      params.push(suspected_oral_cancer);
    }

    if (suspected_breast_cancer) {
      query += "AND bc.suspected_breast_cancer = ? ";
      params.push(suspected_breast_cancer);
    }

    if (cervical_cancer) {
      query += "AND cc.known_case = ? ";
      params.push(cervical_cancer);
    }

    if (known_cvd) {
      query += "AND cvd.known_case = ? ";
      params.push(known_cvd);
    }

    if (history_of_stroke) {
      query += "AND ps.history_of_stroke = ? ";
      params.push(history_of_stroke);
    }

    if (known_ckd) {
      query += "AND ckd.knownCKD = ? ";
      params.push(known_ckd);
    }

    if (cataract_assessment_result) {
      query += "AND ca.cataract_assessment_result = ? ";
      params.push(cataract_assessment_result);
    }

    if (difficulty_hearing) {
      query += "AND hi.difficulty_hearing = ? ";
      params.push(difficulty_hearing);
    }

    if (abhaid_status) {
      query += "AND ab.abhaid_status = ? ";
      params.push(abhaid_status);
    }

    if (village) {
      query += "AND district_info.village = ? ";
      params.push(village);
    }

    if (district) {
      query += "AND district_info.district LIKE ? ";
      params.push(`%${district}%`,);
    }

    if (health_facility) {
      query += "AND district_info.health_facility LIKE ? ";
      params.push(`%${health_facility}%`,);
    }

    if (sex) {
      query += "AND pi.sex = ? ";
      params.push(sex);
    }

    if (age) {
      query += "AND ra.age = ? ";
      params.push(age);
    }

    if (alcohol_use) {
      query += "AND ra.alcohol_use = ? ";
      params.push(alcohol_use);
    }

    if (disability) {
      query += "AND pi.disability = ? ";
      params.push(disability);
    }

    if (leprosy == 'Yes') {
      query += "AND (lp.hypopigmented_patch = ? OR lp.recurrent_ulceration = ? OR lp.clawing_of_fingers = ? OR lp.inability_to_close_eyelid = ? OR lp.difficulty_holding_objects = ?) ";
      params.push(leprosy, leprosy, leprosy, leprosy, leprosy);
    } else if (leprosy == 'No') {
      query += "AND (lp.hypopigmented_patch = ? AND lp.recurrent_ulceration = ? AND lp.clawing_of_fingers = ? AND lp.inability_to_close_eyelid = ? AND lp.difficulty_holding_objects = ?) ";
      params.push(leprosy, leprosy, leprosy, leprosy, leprosy);
    }

    if (search_term) {
      query +=
        "AND (family_members.name LIKE ? OR pi.card_number LIKE ? OR district_info.district LIKE ? OR district_info.village LIKE ?) ";
      params.push(
        `%${search_term}%`,
        `%${search_term}%`,
        `%${search_term}%`,
        `%${search_term}%`
      );
    }

    const [result] = await db.promise().query(query, params);

    const filePath = path.join(__dirname, 'output.csv');
    const csv = await jsonexport(result);
    fs.writeFileSync(filePath, csv);
    // Send the file as a response
    res.download(filePath, 'data.csv', (err) => {
      if (err) {
        res.status(500).send("Error downloading the file.");
      }

      // Clean up the file after sending
      fs.unlinkSync(filePath);
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
