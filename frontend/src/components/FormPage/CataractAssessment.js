import React, { useState, useEffect } from "react";
import axios from "axios";

const CataractAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    cloudyBlurredVision: "",
    painOrRedness: "",
    cataractAssessmentResult: "",
  });

  useEffect(() => {
    const fetchCataractData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/cataract-assessment/${currentFmId}`
        );
        if (response.data.success) {
          setFormData({
            cloudyBlurredVision: response.data.data.cloudy_blurred_vision || "",
            painOrRedness: response.data.data.pain_or_redness || "",
            cataractAssessmentResult:
              response.data.data.cataract_assessment_result || "",
          });
        }
      } catch (error) {
        console.error("Error fetching Cataract assessment:", error);
      }
    };

    if (currentFmId) {
      fetchCataractData(); // Fetch data only if currentFmId is available
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/cataract-assessment`,
        {
          fm_id: currentFmId,
          cloudyBlurredVision: formData.cloudyBlurredVision,
          painOrRedness: formData.painOrRedness,
          cataractAssessmentResult: formData.cataractAssessmentResult,
        }
      );
      if (response.data.success) {
        alert("Cataract assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      console.error("Error saving Cataract assessment:", error);
      alert("Failed to save Cataract assessment. Please try again.");
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
          <label style={styles.label}>
            Do you have cloudy or blurred vision? *
          </label>
          <select
            name="cloudyBlurredVision"
            value={formData.cloudyBlurredVision}
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
            Pain or redness in eyes lasting for more than a week
          </label>
          <select
            name="painOrRedness"
            value={formData.painOrRedness}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cataract Assessment Result</label>
          <select
            name="cataractAssessmentResult"
            value={formData.cataractAssessmentResult}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Suspected">Suspected</option>
            <option value="Not Suspected">Not Suspected</option>
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

export default CataractAssessment;
