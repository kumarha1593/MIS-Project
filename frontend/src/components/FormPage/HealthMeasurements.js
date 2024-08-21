import React, { useState, useEffect } from "react";

const HealthMeasurements = ({ formData, handleInputChange }) => {
  const [height, setHeight] = useState(formData.height || "");
  const [weight, setWeight] = useState(formData.weight || "");
  const [bmi, setBmi] = useState(formData.bmi || "");

  useEffect(() => {
    // Convert height to meters and calculate BMI if height and weight are available
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBmi = (
        weight /
        (heightInMeters * heightInMeters)
      ).toFixed(2);
      setBmi(calculatedBmi);
    } else {
      setBmi("");
    }
  }, [height, weight]);

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
    handleInputChange(e);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
    handleInputChange(e);
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
        <label style={styles.label}>Height (cm) *</label>
        <input
          type="number"
          name="height"
          value={height}
          onChange={handleHeightChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Weight (kg) *</label>
        <input
          type="number"
          name="weight"
          value={weight}
          onChange={handleWeightChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>BMI *</label>
        <input
          type="text"
          name="bmi"
          value={bmi}
          readOnly
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Temperature (°F) *</label>
        <input
          type="number"
          name="temp"
          value={formData.temp}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>SpO2 (%) *</label>
        <input
          type="number"
          name="spo2"
          value={formData.spo2}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default HealthMeasurements;
