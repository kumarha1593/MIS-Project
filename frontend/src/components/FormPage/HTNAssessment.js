import React, { useState, useEffect } from "react";
import axios from "axios";

const HTNAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    case_of_htn: "",
    blood_pressure: "",
    action_high_bp: "",
    referral_center: "",
    htn_date: "",
  });

  const [showHighBPOptions, setShowHighBPOptions] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    const fetchHtnData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/htn-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;

          // Format the date to "yyyy-MM-dd"
          if (data.htn_date) {
            data.htn_date = new Date(data.htn_date).toISOString().split("T")[0];
          }

          // Set the formData with the fetched data
          setFormData(data);

          // Check if BP is high and set the state accordingly
          const [upperBP, lowerBP] = data.blood_pressure.split("/").map(Number);
          if (upperBP > 140 || lowerBP < 90) {
            setShowHighBPOptions(true);
            if (data.action_high_bp === "referral") {
              setShowReferralField(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching HTN assessment:", error);
      }
    };

    if (currentFmId) {
      fetchHtnData(); // Ensure the fetch is only attempted if currentFmId is available
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Handle BP field change specifically
    if (name === "blood_pressure") {
      const [upperBP, lowerBP] = value.split("/").map(Number);
      if (upperBP > 140 || lowerBP < 90) {
        setShowHighBPOptions(true);
      } else {
        setShowHighBPOptions(false);
        setShowReferralField(false);
      }
    }

    // Handle action_high_bp field change
    if (name === "action_high_bp" && value === "referral") {
      setShowReferralField(true);
    } else if (name === "action_high_bp") {
      setShowReferralField(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/htn-assessment",
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("HTN assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving HTN assessment:", error);
      alert("Failed to save HTN assessment. Please try again.");
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
  };

  return (
    <div style={styles.formSection}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Known case of HTN *</label>
        <select
          id="case_of_htn"
          name="case_of_htn"
          value={formData.case_of_htn || ""}
          onChange={handleInputChange}
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
        <label style={styles.label}>Blood Pressure (mmHg) *</label>
        <input
          type="number"
          id="blood_pressure"
          name="blood_pressure"
          value={formData.blood_pressure || ""}
          onChange={handleInputChange}
        />
      </div>

      {showHighBPOptions && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Action for High BP *</label>
          <select
            id="action_high_bp"
            name="action_high_bp"
            value={formData.action_high_bp || ""}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="referral">Referral</option>
            <option value="teleconsultation">Teleconsultation</option>
          </select>
        </div>
      )}

      {showReferralField && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Referred Centre for HTN *</label>
          <input
            type="text"
            id="referral_center"
            name="referral_center"
            value={formData.referral_center || ""}
            onChange={handleInputChange}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>
          HTN Confirmed at PHC/CHC/DH and Date *
        </label>
        <input
          type="date"
          id="htn_date"
          name="htn_date"
          value={formData.htn_date || ""}
          onChange={handleInputChange}
        />
      </div>
      <button type="button" onClick={handleSave}>
        Save HTN Assessment
      </button>
    </div>
  );
};

export default HTNAssessment;
