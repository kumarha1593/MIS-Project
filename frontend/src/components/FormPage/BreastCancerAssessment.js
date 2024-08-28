import React, { useState, useEffect } from "react";
import axios from "axios";

const BreastCancerAssessment = ({ currentFmId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    known_case: "",
    lump_in_breast: "",
    blood_stained_discharge: "",
    change_in_shape: "",
    constant_pain_or_swelling: "",
    redness_or_ulcer: "",
    suspected_breast_cancer: "",
  });

  const fetchBreastCancerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/breast-cancer-assessment/${currentFmId}`
      );
      if (response.data.success) {
        setFormData(response.data.data); // Pre-fill the form with fetched data
      }
    } catch (error) {
      console.error("Error fetching breast cancer assessment:", error);
    }
  };

  useEffect(() => {
    if (currentFmId) {
      fetchBreastCancerData();
    }
  }, [currentFmId]);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/breast-cancer-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("Breast Cancer Assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving breast cancer assessment:", error);
      alert("Failed to save breast cancer assessment. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      console.log(`Updated ${name} to ${value}. New state:`, newData); // Debug: Log state changes
      return newData;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.formSection}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Known Case *</label>
        <select
          id="known_case"
          name="known_case"
          value={formData.known_case || ""}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes and on treatment">Yes and on treatment</option>
          <option value="Yes and not on treatment">
            Yes and not on treatment
          </option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Lump in Breast *</label>
        <select
          id="lump_in_breast"
          name="lump_in_breast"
          value={formData.lump_in_breast || ""}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Blood-Stained Discharge *</label>
        <select
          id="blood_stained_discharge"
          name="blood_stained_discharge"
          value={formData.blood_stained_discharge || ""}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Change in Shape *</label>
        <select
          id="change_in_shape"
          name="change_in_shape"
          value={formData.change_in_shape || ""}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Constant Pain or Swelling *</label>
        <select
          id="constant_pain_or_swelling"
          name="constant_pain_or_swelling"
          value={formData.constant_pain_or_swelling || ""}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Redness or Ulcer *</label>
        <select
          id="redness_or_ulcer"
          name="redness_or_ulcer"
          value={formData.redness_or_ulcer || ""}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Suspected Breast Cancer *</label>
        <select
          id="suspected_breast_cancer"
          name="suspected_breast_cancer"
          value={formData.suspected_breast_cancer || ""}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <button type="button" onClick={handleSave} style={styles.button}>
        Save Draft
      </button>
    </div>
  );
};

const styles = {
  formSection: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default BreastCancerAssessment;
