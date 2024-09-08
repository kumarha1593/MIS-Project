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
  password: "$Anshika28$",
  database: "manipur",
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

//Adding family members under a family head
app.post("/api/family-members", async (req, res) => {
  const { fc_id, name, aadhar, head_id } = req.body; // Ensure fc_id is included

  try {
    await db.promise().beginTransaction();

    const [familyResult] = await db.promise().query(
      `INSERT INTO family_members (fc_id, name, Aadhar, head_id, master_data_id, status, date)
       VALUES (?, ?, ?, ?, NULL, 0, NOW())`,
      [fc_id, name, aadhar, head_id || 0] // fc_id should be inserted here
    );

    const fm_id = familyResult.insertId;

    const [masterDataResult] = await db
      .promise()
      .query(`INSERT INTO master_data (fm_id) VALUES (?)`, [fm_id]);

    const master_data_id = masterDataResult.insertId;

    await db
      .promise()
      .query(`UPDATE family_members SET master_data_id = ? WHERE id = ?`, [
        master_data_id,
        fm_id,
      ]);

    await db.promise().commit();

    res.status(201).json({
      success: true,
      message: "Family member added successfully",
      fm_id,
      master_data_id,
    });
  } catch (error) {
    await db.promise().rollback();
    console.error("Error inserting family member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Fetch family members associated with a specific headId
app.get("/api/family-members/:headId", async (req, res) => {
  const headId = req.params.headId;

  try {
    const [rows] = await db.promise().query(
      `SELECT fm.id, fm.name, fm.Aadhar, fm.status, fm.fc_id
       FROM family_members fm
       WHERE fm.head_id = ?`,
      [headId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No family members found for this headId" });
    }

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

    let risk_assesment_id;

    // Insert or update Risk Assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT risk_assesment_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].risk_assesment_id) {
      // Update existing Risk Assessment and set updated_at
      risk_assesment_id = masterData[0].risk_assesment_id;
      await db.promise().query(
        `UPDATE risk_assessment SET
        age = ?, tobacco_use = ?, alcohol_use = ?, waist_female = ?, waist_male = ?, physical_activity = ?, 
        family_diabetes_history = ?, risk_score = ?, updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, risk_assesment_id]
      );
      console.log(`Updated risk assessment with ID: ${risk_assesment_id}`);
    } else {
      // Insert new Risk Assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO risk_assessment 
        (age, tobacco_use, alcohol_use, waist_female, waist_male, physical_activity, 
         family_diabetes_history, risk_score, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        sanitizedValues
      );
      risk_assesment_id = result.insertId;
      console.log(`Inserted new risk assessment with ID: ${risk_assesment_id}`);

      // Log fm_id and risk_assessment_id before the update query
      console.log(
        `Updating master_data for fm_id: ${fm_id} with risk_assesment_id: ${risk_assesment_id}`
      );

      // Update master_data table with the new risk_assessment_id
      const [updateResult] = await db
        .promise()
        .query(`UPDATE master_data SET risk_assesment_id = ? WHERE fm_id = ?`, [
          risk_assesment_id,
          fm_id,
        ]);
      console.log(
        `Affected rows in master_data update: ${updateResult.affectedRows}`
      );
    }

    await db.promise().commit();

    res.status(200).json({
      success: true,
      message: "Risk assessment saved successfully",
      risk_assesment_id,
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
      .query(`SELECT risk_assesment_id FROM master_data WHERE fm_id = ?`, [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].risk_assesment_id) {
      const [riskData] = await db
        .promise()
        .query(`SELECT * FROM risk_assessment WHERE id = ?`, [
          masterData[0].risk_assesment_id,
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
    ckdRiskScore = 0, // This will be passed from the frontend
    riskaAssessment = null,
  } = req.body;

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
      riskaAssessment || null,
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
  } = req.body;

  try {
    await db.promise().beginTransaction();

    const sanitizedValues = [
      known_case === "" ? null : known_case,
      heart_sound === "" ? null : heart_sound,
      symptom === "" ? null : symptom,
      cvd_date === "" ? null : cvd_date,
      suspected_cvd === "" ? null : suspected_cvd,
    ];

    let cvd_id;

    // Insert or update CVD assessment
    const [masterData] = await db
      .promise()
      .query(`SELECT CVD_id FROM master_data WHERE fm_id = ?`, [fm_id]);

    if (masterData.length > 0 && masterData[0].CVD_id) {
      // Update existing CVD assessment and set updated_at
      cvd_id = masterData[0].CVD_id;
      await db.promise().query(
        `UPDATE cvd SET
        known_case = ?, heart_sound = ?, symptom = ?, cvd_date = ?, suspected_cvd = ?, 
        updated_at = NOW()
        WHERE id = ?`,
        [...sanitizedValues, cvd_id]
      );
    } else {
      // Insert new CVD assessment and set created_at and updated_at
      const [result] = await db.promise().query(
        `INSERT INTO cvd 
        (known_case, heart_sound, symptom, cvd_date, suspected_cvd, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
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
        res.status(200).json({
          success: true,
          data: cvdData[0],
        });
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
    const [masterData] = await db
      .promise()
      .query("SELECT assesmentandaction_id FROM master_data WHERE fm_id = ?", [
        fm_id,
      ]);

    if (masterData.length > 0 && masterData[0].assesmentandaction_id) {
      const [assessmentData] = await db
        .promise()
        .query("SELECT * FROM assessment_and_action_taken WHERE id = ?", [
          masterData[0].assesmentandaction_id,
        ]);

      if (assessmentData.length > 0) {
        res.status(200).json({
          success: true,
          data: assessmentData[0],
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
