import React, { useState, useEffect } from "react";
import axios from "axios";

const HTNAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    case_of_htn: "",
    upper_bp: "",
    lower_bp: "",
    action_high_bp: "",
    referral_center: "",
  });

  const [showHighBPOptions, setShowHighBPOptions] = useState(false);

  useEffect(() => {
    const fetchHtnData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/htn-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;
          setFormData(data);

          if (data.upper_bp > 139 || data.lower_bp > 89) {
            setShowHighBPOptions(true);
          }
        }
      } catch (error) {
        console.error("Error fetching HTN assessment:", error);
      }
    };

    if (currentFmId) {
      fetchHtnData();
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "upper_bp" || name === "lower_bp") {
      const upperBP =
        name === "upper_bp" ? parseInt(value) : parseInt(formData.upper_bp);
      const lowerBP =
        name === "lower_bp" ? parseInt(value) : parseInt(formData.lower_bp);
      setShowHighBPOptions(upperBP > 139 || lowerBP > 89);
    }

    if (name === "action_high_bp" && value !== "referral") {
      setFormData((prev) => ({ ...prev, referral_center: "" }));
    }
  };

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/htn-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("HTN assessment saved successfully!");
        handleNext?.();
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
      <form onSubmit={handleSave}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Known case of HTN *</label>
          <select
            id="case_of_htn"
            name="case_of_htn"
            value={formData.case_of_htn || ""}
            onChange={handleInputChange}
            required
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
          <label style={styles.label}>Upper BP (mmHg) *</label>
          <input
            type="number"
            id="upper_bp"
            name="upper_bp"
            value={formData.upper_bp || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Lower BP (mmHg) *</label>
          <input
            type="number"
            id="lower_bp"
            name="lower_bp"
            value={formData.lower_bp || ""}
            onChange={handleInputChange}
            required
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

        {formData.action_high_bp === "referral" && (
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
        <footer className="form-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="submit">
            Save & Next
          </button>
        </footer>
      </form>
    </div>
  );
};

export default HTNAssessment;
