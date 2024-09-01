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
        res.status(200).json({
          success: true,
          data: personalInfo[0],
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

//HEALTH MEASUREMENTS
app.post("/api/health-measurements", async (req, res) => {
  const {
    fm_id,
    height = null,
    weight = null,
    bmi = null,
    temp = null,
    spO2 = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedHeight = height === "" ? null : height;
    const sanitizedWeight = weight === "" ? null : weight;
    const sanitizedBmi = bmi === "" ? null : bmi;
    const sanitizedTemp = temp === "" ? null : temp;
    const sanitizedSpO2 = spO2 === "" ? null : spO2;

    const sanitizedValues = [
      sanitizedHeight,
      sanitizedWeight,
      sanitizedBmi,
      sanitizedTemp,
      sanitizedSpO2,
    ];

    let health_id;

    // Insert or update health measurements
    const [masterData] = await db
      .promise()
      .query(`SELECT health_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].health_id) {
      // Update existing health measurements and set updated_at
      health_id = masterData[0].health_id;
      await db.promise().query(
        `UPDATE health SET
        height = ?, weight = ?, bmi = ?, temp = ?, spO2 = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, health_id]
      );
      console.log(`Updated health measurements with ID: ${health_id}`);
    } else {
      // Insert new health measurements and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO health 
        (height, weight, bmi, temp, spO2, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      health_id = result.insertId;
      console.log(`Inserted new health measurements with ID: ${health_id}`);

      // Log fm_id and health_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with health_id: ${health_id}`
      );

      // Update master_data table with the new health_id
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
    blood_pressure = null,
    action_high_bp = null,
    referral_center = null,
    htn_date = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedCaseOfHtn = case_of_htn === "" ? null : case_of_htn;
    const sanitizedBloodPressure =
      blood_pressure === "" ? null : blood_pressure;
    const sanitizedActionHighBp = action_high_bp === "" ? null : action_high_bp;
    const sanitizedReferralCenter =
      referral_center === "" ? null : referral_center;
    const sanitizedHtnDate = htn_date === "" ? null : htn_date;

    const sanitizedValues = [
      sanitizedCaseOfHtn,
      sanitizedBloodPressure,
      sanitizedActionHighBp,
      sanitizedReferralCenter,
      sanitizedHtnDate,
    ];

    let htn_id;

    // Insert or update HTN assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT htn_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].htn_id) {
      // Update existing HTN assessment and set updated_at
      htn_id = masterData[0].htn_id;
      await db.promise().query(
        `UPDATE htn SET
        case_of_htn = ?, blood_pressure = ?, action_high_bp = ?, referral_center = ?, htn_date = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, htn_id]
      );
      console.log(`Updated HTN assessment with ID: ${htn_id}`);
    } else {
      // Insert new HTN assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO htn 
        (case_of_htn, blood_pressure, action_high_bp, referral_center, htn_date, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      htn_id = result.insertId;
      console.log(`Inserted new HTN assessment with ID: ${htn_id}`);

      // Log fm_id and htn_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with htn_id: ${htn_id}`
      );

      // Update master_data table with the new htn_id
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
    RBS = null,
    blood_sugar = null,
    action_high_bs = null,
    referral_center = null,
    DM_date = null,
  } = req.body;

  console.log(`Received fm_id: ${fm_id}`); // Log the received fm_id

  try {
    await db.promise().beginTransaction();

    // Convert empty strings to null for nullable fields
    const sanitizedCaseOfDm = case_of_dm === "" ? null : case_of_dm;
    const sanitizedRBS = RBS === "" ? null : RBS;
    const sanitizedBloodSugar = blood_sugar === "" ? null : blood_sugar;
    const sanitizedActionHighBs = action_high_bs === "" ? null : action_high_bs;
    const sanitizedReferralCenter =
      referral_center === "" ? null : referral_center;
    const sanitizedDmDate = DM_date === "" ? null : DM_date;

    const sanitizedValues = [
      sanitizedCaseOfDm,
      sanitizedRBS,
      sanitizedBloodSugar,
      sanitizedActionHighBs,
      sanitizedReferralCenter,
      sanitizedDmDate,
    ];

    let dm_id;

    // Insert or update DM assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT dm_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].dm_id) {
      // Update existing DM assessment and set updated_at
      dm_id = masterData[0].dm_id;
      await db.promise().query(
        `UPDATE DM SET
        case_of_dm = ?, RBS = ?, blood_sugar = ?, action_high_bs = ?, referral_center = ?, DM_date = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, dm_id]
      );
      console.log(`Updated DM assessment with ID: ${dm_id}`);
    } else {
      // Insert new DM assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO DM 
        (case_of_dm, RBS, blood_sugar, action_high_bs, referral_center, DM_date, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      dm_id = result.insertId;
      console.log(`Inserted new DM assessment with ID: ${dm_id}`);

      // Log fm_id and dm_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with dm_id: ${dm_id}`
      );

      // Update master_data table with the new dm_id
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

  const calculateRiskScore = () => {
    let score = 0;
    if (age !== null) score += parseInt(age);
    if (tobacco_use !== null) score += parseInt(tobacco_use);
    if (alcohol_use !== null) score += parseInt(alcohol_use);
    if (waist_female !== null) score += parseInt(waist_female);
    if (waist_male !== null) score += parseInt(waist_male);
    if (physical_activity !== null) score += parseInt(physical_activity);
    if (family_diabetes_history !== null)
      score += parseInt(family_diabetes_history);
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

      // Log fm_id and risk_assessment_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with risk_assessment_id: ${risk_assessment_id}`
      );

      // Update master_data table with the new risk_assessment_id
      const [updateResult] = await db
        .promise()
        .query(
          `UPDATE master_data SET risk_assessment_id = ? WHERE fm_id = ?`,
          [risk_assessment_id, fm_id]
        );
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
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
    const [masterData] = await db
      .promise()
      .query(`SELECT risk_assessment_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].risk_assessment_id) {
      const [riskData] = await db
        .promise()
        .query(`SELECT * FROM risk_assessment WHERE id = ?`, [
          masterData[0].risk_assessment_id,
        ]);

      if (riskData.length > 0) {
        res.status(200).json({
          success: true,
          data: riskData[0],
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

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
