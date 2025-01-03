import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonLoader from "../global/ButtonLoader";
import { handleInputChangeWithMaxLength, removeTrailingZeros } from "../../utils/helper";

const HealthMeasurements = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bmi: "",
    temp: "",
    spO2: "",
    pulse: "",
  });

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/health-measurements/${currentFmId}`
        );
        if (response.data.success) {
          setFormData(response.data.data);
        }
      } catch (error) {
        setIsLoading(false)
        console.error("Error fetching health measurements:", error);
      }
    };

    fetchHealthData();
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

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

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true)
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/health-measurements`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      setIsLoading(false)
      if (response.data.success) {
        alert("Health measurements saved successfully!");
        handleNext?.();
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
          <label style={styles.label} htmlFor="height">
            Height (cm) *
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height ? removeTrailingZeros(formData.height) : ""}
            onChange={(e) => handleInputChangeWithMaxLength(e, 3, handleInputChange)}
            style={styles.input}
            required
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
            value={formData.weight ? removeTrailingZeros(formData.weight) : ""}
            onChange={(e) => handleInputChangeWithMaxLength(e, 3, handleInputChange)}
            style={styles.input}
            required
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
            value={formData.bmi ? removeTrailingZeros(formData.bmi) : ''}
            onChange={(e) => handleInputChangeWithMaxLength(e, 5, handleInputChange)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="temp">
            Temperature (°F)
          </label>
          <input
            type="number"
            id="temp"
            name="temp"
            value={formData.temp ? removeTrailingZeros(formData.temp) : ''}
            onChange={(e) => handleInputChangeWithMaxLength(e, 2, handleInputChange)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="spO2">
            SpO2 (%)
          </label>
          <input
            type="number"
            id="spO2"
            name="spO2"
            value={formData.spO2 ? removeTrailingZeros(formData.spO2) : ''}
            onChange={(e) => handleInputChangeWithMaxLength(e, 2, handleInputChange)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="pulse">
            Pulse (bpm) *
          </label>
          <input
            type="number"
            id="pulse"
            name="pulse"
            value={formData.pulse ? removeTrailingZeros(formData.pulse) : ''}
            onChange={(e) => handleInputChangeWithMaxLength(e, 2, handleInputChange)}
            style={styles.input}
            required
          />
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

export default HealthMeasurements;
