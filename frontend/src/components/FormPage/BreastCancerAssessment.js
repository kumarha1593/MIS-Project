import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectAll from "../global/SelectAll";

const BreastCancerAssessment = ({ currentFmId, handleBack, handleNext }) => {
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

  const handleSave = async (evt) => {
    evt.preventDefault();
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
        handleNext?.()
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

  const handleSelectAllChange = (value) => {
    const newValue = value ? "No" : "";  // Set "NO" if true, otherwise empty string
    setFormData({
      known_case: newValue,
      lump_in_breast: newValue,
      blood_stained_discharge: newValue,
      change_in_shape: newValue,
      constant_pain_or_swelling: newValue,
      redness_or_ulcer: newValue,
      suspected_breast_cancer: newValue,
    });
  };

  return (
    <div style={styles.formSection}>
      <SelectAll
        label='Select All No'
        onChange={handleSelectAllChange}
      />
      <form onSubmit={handleSave}>
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
          <label style={styles.label}>Lump in Breast</label>
          <select
            id="lump_in_breast"
            name="lump_in_breast"
            value={formData.lump_in_breast || ""}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Blood-Stained Discharge</label>
          <select
            id="blood_stained_discharge"
            name="blood_stained_discharge"
            value={formData.blood_stained_discharge || ""}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Change in Shape</label>
          <select
            id="change_in_shape"
            name="change_in_shape"
            value={formData.change_in_shape || ""}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Constant Pain or Swelling</label>
          <select
            id="constant_pain_or_swelling"
            name="constant_pain_or_swelling"
            value={formData.constant_pain_or_swelling || ""}
            onChange={handleInputChange}
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
          <label style={styles.label}>Suspected Breast Cancer</label>
          <select
            id="suspected_breast_cancer"
            name="suspected_breast_cancer"
            value={formData.suspected_breast_cancer || ""}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
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
    width: "100%",
  },
};

export default BreastCancerAssessment;
