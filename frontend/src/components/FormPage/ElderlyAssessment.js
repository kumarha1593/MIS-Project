import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonLoader from "../global/ButtonLoader";

const ElderlyAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    unsteadyWalking: "",
    physicalDisability: "",
    helpNeeded: "",
    forgetNames: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true)
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
      setIsLoading(false)
      if (response.data.success) {
        alert("Elderly assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      setIsLoading(false)
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
            Do you feel unsteady while standing or walking?
          </label>
          <select
            name="unsteadyWalking"
            value={formData.unsteadyWalking || ""}
            onChange={handleInputChange}
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

export default ElderlyAssessment;
