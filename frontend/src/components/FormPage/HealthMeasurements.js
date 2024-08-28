import React, { useState, useEffect } from "react";
import axios from "axios";

const HealthMeasurements = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bmi: "",
    temp: "",
    spO2: "",
  });

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/health-measurements/${currentFmId}`
        );
        if (response.data.success) {
          setFormData(response.data.data); // Populate formData with fetched data
        }
      } catch (error) {
        console.error("Error fetching health measurements:", error);
      }
    };

    fetchHealthData();
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Calculate BMI whenever weight or height changes
    if (name === "weight" || name === "height") {
      const heightInMeters = updatedFormData.height / 100;
      const bmi =
        updatedFormData.weight && heightInMeters
          ? (
              updatedFormData.weight /
              (heightInMeters * heightInMeters)
            ).toFixed(2)
          : "";
      updatedFormData.bmi = bmi;
    }

    setFormData(updatedFormData);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/health-measurements",
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("Health measurements saved successfully!");
      }
    } catch (error) {
      console.error("Error saving health measurements:", error);
      alert("Failed to save health measurements. Please try again.");
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
      //maxWidth: "300px", // Adjust this value to your desired width
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
        <label style={styles.label} htmlFor="height">
          Height (cm) *
        </label>
        <input
          type="number"
          id="height"
          name="height"
          value={formData.height || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="weight">
          Weight (kg) *
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="bmi">
          BMI *
        </label>
        <input
          type="number"
          id="bmi"
          name="bmi"
          value={formData.bmi || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="temp">
          Temperature (°C) *
        </label>
        <input
          type="number"
          id="temp"
          name="temp"
          value={formData.temp || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="spO2">
          SpO2 (%) *
        </label>
        <input
          type="number"
          id="spO2"
          name="spO2"
          value={formData.spO2 || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>
      <button type="button" onClick={handleSave}>
        Save Draft
      </button>
    </div>
  );
};

export default HealthMeasurements;
