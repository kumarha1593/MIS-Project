import React, { useState, useEffect } from "react";
import axios from "axios";

const DMAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    case_of_dm: "",
    RBS: "",
    blood_sugar: "",
    action_high_bs: "",
    referral_center: "",
    DM_date: "",
  });

  const [showHighBSOptions, setShowHighBSOptions] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    const fetchDmData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/dm-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;

          // Format the date to "yyyy-MM-dd"
          if (data.DM_date) {
            data.DM_date = new Date(data.DM_date).toISOString().split("T")[0];
          }

          // Set the formData with the fetched data
          setFormData(data);

          // Check if blood sugar level is high and set the state accordingly
          const bloodSugar = parseFloat(data.blood_sugar);
          if (bloodSugar > 150) {
            // Assuming 150 as the threshold
            setShowHighBSOptions(true);
            if (data.action_high_bs === "referral") {
              setShowReferralField(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching DM assessment:", error);
      }
    };

    if (currentFmId) {
      fetchDmData(); // Ensure the fetch is only attempted if currentFmId is available
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Handle blood sugar field change specifically
    if (name === "blood_sugar") {
      const bloodSugar = parseFloat(value);
      if (bloodSugar > 150) {
        setShowHighBSOptions(true);
      } else {
        setShowHighBSOptions(false);
        setShowReferralField(false);
      }
    }

    // Handle action_high_bs field change
    if (name === "action_high_bs" && value === "referral") {
      setShowReferralField(true);
    } else if (name === "action_high_bs") {
      setShowReferralField(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/dm-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("DM assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving DM assessment:", error);
      alert("Failed to save DM assessment. Please try again.");
    }
  };

  const styles = {
    formSection: {
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "8px",
      width: "100%",
      boxSizing: "border-box",
      fontSize: "14px",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      cursor: "pointer",
      backgroundColor: "#8BC34A",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      marginTop: "20px",
      width: "98%",
    },
  };

  return (
    <div style={styles.formSection}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Known case of DM *</label>
        <select
          id="case_of_dm"
          name="case_of_dm"
          value={formData.case_of_dm || ""}
          onChange={handleInputChange}
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="yes and on treatment">Yes and on Treatment</option>
          <option value="yes and not on treatment">
            Yes and Not on Treatment
          </option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Blood Sugar Type *</label>
        <select
          id="RBS"
          name="RBS"
          value={formData.RBS || ""}
          onChange={handleInputChange}
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="fasting">Fasting</option>
          <option value="post prandial">Post Prandial</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          {formData.RBS
            ? `${
                formData.RBS.charAt(0).toUpperCase() + formData.RBS.slice(1)
              } Blood Sugar (mg/dL)`
            : "Blood Sugar (mg/dL)"}
          *
        </label>
        <input
          type="text"
          id="blood_sugar"
          name="blood_sugar"
          value={formData.blood_sugar || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      {showHighBSOptions && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Action for High Blood Sugar *</label>
          <select
            id="action_high_bs"
            name="action_high_bs"
            value={formData.action_high_bs || ""}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="referral">Referral</option>
            <option value="teleconsultation">Teleconsultation</option>
          </select>
        </div>
      )}

      {showReferralField && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Referred Centre for DM *</label>
          <input
            type="text"
            id="referral_center"
            name="referral_center"
            value={formData.referral_center || ""}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>
          DM Confirmed at PHC/CHC/DH and Date *
        </label>
        <input
          type="date"
          id="DM_date"
          name="DM_date"
          value={formData.DM_date || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>
      <button type="button" onClick={handleSave} style={styles.button}>
        Save Draft
      </button>
    </div>
  );
};

export default DMAssessment;
