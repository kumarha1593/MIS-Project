import React, { useState, useEffect } from "react";
import axios from "axios";

const LeprosyAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    lesionSensationLoss: "",
    ulceration: "",
    clawingFingers: "",
    inabilityToCloseEyelid: "",
    weaknessFeet: "",
  });

  useEffect(() => {
    const fetchLeprosyData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/leprosy-assessment/${currentFmId}`
        );
        if (response.data.success) {
          // Populate form with fetched data
          setFormData({
            lesionSensationLoss: response.data.data.hypopigmented_patch,
            ulceration: response.data.data.recurrent_ulceration,
            clawingFingers: response.data.data.clawing_of_fingers,
            inabilityToCloseEyelid: response.data.data.inability_to_close_eyelid,
            weaknessFeet: response.data.data.difficulty_holding_objects,
          });
        }
      } catch (error) {
        console.error("Error fetching Leprosy assessment:", error);
      }
    };

    if (currentFmId) {
      fetchLeprosyData(); // Ensure the fetch is only attempted if currentFmId is available
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/leprosy-assessment`,
        {
          fm_id: currentFmId,
          lesionSensationLoss: formData.lesionSensationLoss,
          ulceration: formData.ulceration,
          clawingFingers: formData.clawingFingers,
          inabilityToCloseEyelid: formData.inabilityToCloseEyelid,
          weaknessFeet: formData.weaknessFeet,
        }
      );
      if (response.data.success) {
        alert("Leprosy assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving Leprosy assessment:", error);
      alert("Failed to save Leprosy assessment. Please try again.");
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
        <label style={styles.label}>
          Hypopigmented or discolored lesion(s) with loss of sensation *
        </label>
        <select
          name="lesionSensationLoss"
          value={formData.lesionSensationLoss}
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
        <label style={styles.label}>
          Recurrent ulceration on palm or sole *
        </label>
        <select
          name="ulceration"
          value={formData.ulceration}
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
        <label style={styles.label}>
          Clawing of fingers or tingling/numbness in hands/feet *
        </label>
        <select
          name="clawingFingers"
          value={formData.clawingFingers}
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
        <label style={styles.label}>Inability to close eyelid *</label>
        <select
          name="inabilityToCloseEyelid"
          value={formData.inabilityToCloseEyelid}
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
        <label style={styles.label}>
          Difficulty in holding objects or weakness in feet *
        </label>
        <select
          name="weaknessFeet"
          value={formData.weaknessFeet}
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

export default LeprosyAssessment;
