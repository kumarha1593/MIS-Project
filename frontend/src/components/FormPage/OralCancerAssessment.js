import React, { useState, useEffect } from "react";
import axios from "axios";

const OralCancerAssessment = ({ currentFmId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    known_case: "",
    persistent_ulcer: "",
    persistent_patch: "",
    difficulty_chewing: "",
    difficulty_opening_mouth: "",
    growth_in_mouth: "",
    swelling_in_neck: "",
    suspected_oral_cancer: "",
  });

  const fetchOralCancerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/oral-cancer-assessment/${currentFmId}`
      );
      if (response.data.success) {
        setFormData(response.data.data); // Pre-fill the form with fetched data
      }
    } catch (error) {
      console.error("Error fetching oral cancer assessment:", error);
    }
  };

  useEffect(() => {
    if (currentFmId) {
      fetchOralCancerData();
    }
  }, [currentFmId]);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/oral-cancer-assessment`,
        {
          fm_id: currentFmId, // Make sure fm_id is passed correctly
          ...formData,
        }
      );
      if (response.data.success) {
        alert("Oral Cancer Assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving oral cancer assessment:", error);
      alert("Failed to save oral cancer assessment. Please try again.");
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.formSection}>
      {/* Form groups for each field */}
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
        <label style={styles.label}>Persistent Ulcer *</label>
        <select
          id="persistent_ulcer"
          name="persistent_ulcer"
          value={formData.persistent_ulcer || ""}
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
        <label style={styles.label}>Persistent Patch *</label>
        <select
          id="persistent_patch"
          name="persistent_patch"
          value={formData.persistent_patch || ""}
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
        <label style={styles.label}>Difficulty Chewing *</label>
        <select
          id="difficulty_chewing"
          name="difficulty_chewing"
          value={formData.difficulty_chewing || ""}
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
        <label style={styles.label}>Difficulty Opening Mouth *</label>
        <select
          id="difficulty_opening_mouth"
          name="difficulty_opening_mouth"
          value={formData.difficulty_opening_mouth || ""}
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
        <label style={styles.label}>Growth in Mouth *</label>
        <select
          id="growth_in_mouth"
          name="growth_in_mouth"
          value={formData.growth_in_mouth || ""}
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
        <label style={styles.label}>Swelling in Neck *</label>
        <select
          id="swelling_in_neck"
          name="swelling_in_neck"
          value={formData.swelling_in_neck || ""}
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
        <label style={styles.label}>Suspected Oral Cancer *</label>
        <select
          id="suspected_oral_cancer"
          name="suspected_oral_cancer"
          value={formData.suspected_oral_cancer || ""}
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

export default OralCancerAssessment;
