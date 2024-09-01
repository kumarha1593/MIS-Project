import React, { useState, useEffect } from "react";
import axios from "axios";

const ElderlyAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    unsteadyWalking: "",
    physicalDisability: "",
    helpNeeded: "",
    forgetNames: "",
  });

  useEffect(() => {
    const fetchElderlyData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/elderly-assessment/${currentFmId}`
        );
        if (response.data.success) {
          // Populate form fields with the fetched data
          setFormData({
            unsteadyWalking: response.data.data.unsteady_walking,
            physicalDisability: response.data.data.physical_disability,
            helpNeeded: response.data.data.help_from_others,
            forgetNames: response.data.data.forget_names,
          });
        }
      } catch (error) {
        console.error("Error fetching Elderly assessment:", error);
      }
    };

    if (currentFmId) {
      fetchElderlyData(); // Ensure the fetch is only attempted if currentFmId is available
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
        `${process.env.REACT_APP_BASE_URL}api/elderly-assessment`,
        {
          fm_id: currentFmId,
          unsteady_walking: formData.unsteadyWalking,
          physical_disability: formData.physicalDisability,
          help_from_others: formData.helpNeeded,
          forget_names: formData.forgetNames,
        }
      );
      if (response.data.success) {
        alert("Elderly assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving Elderly assessment:", error);
      alert("Failed to save Elderly assessment. Please try again.");
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
        <label style={styles.label}>
          Do you feel unsteady while standing or walking? *
        </label>
        <select
          name="unsteadyWalking"
          value={formData.unsteadyWalking || ""}
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
          Are you suffering from any physical disability? *
        </label>
        <select
          name="physicalDisability"
          value={formData.physicalDisability}
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
          Do you need help with everyday activities? *
        </label>
        <select
          name="helpNeeded"
          value={formData.helpNeeded}
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
          Do you forget names of near ones or your address? *
        </label>
        <select
          name="forgetNames"
          value={formData.forgetNames}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <button type="button" onClick={handleSave}>
        Save Draft
      </button>
    </div>
  );
};

export default ElderlyAssessment;
