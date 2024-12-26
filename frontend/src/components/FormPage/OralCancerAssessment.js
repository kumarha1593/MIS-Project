import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectAll from "../global/SelectAll";
import ButtonLoader from "../global/ButtonLoader";

const OralCancerAssessment = ({ currentFmId, handleBack, handleNext }) => {
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

  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true)
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/oral-cancer-assessment`,
        {
          fm_id: currentFmId, // Make sure fm_id is passed correctly
          ...formData,
        }
      );
      setIsLoading(false)
      if (response.data.success) {
        alert("Oral Cancer Assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      setIsLoading(false)
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

  const handleSelectAllChange = (value) => {
    const newValue = value ? "No" : "";  // Set "NO" if true, otherwise empty string
    setFormData({
      known_case: newValue,
      persistent_ulcer: newValue,
      persistent_patch: newValue,
      difficulty_chewing: newValue,
      difficulty_opening_mouth: newValue,
      growth_in_mouth: newValue,
      swelling_in_neck: newValue,
      suspected_oral_cancer: newValue,
    });
  };

  return (
    <div style={styles.formSection}>
      <SelectAll
        label='Select All No'
        onChange={handleSelectAllChange}
      />
      {/* Form groups for each field */}
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
          <label style={styles.label}>Sudden change in voice *</label>
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
        <footer className="form-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button style={{ height: 40 }} disabled={isLoading} type="submit">
            {isLoading
              ?
              <ButtonLoader />
              :
              'Save & Next'
            }
          </button>
        </footer>
      </form>
    </div>
  );
};

export default OralCancerAssessment;
