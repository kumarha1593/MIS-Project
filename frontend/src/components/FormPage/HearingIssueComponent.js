import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonLoader from "../global/ButtonLoader";

const HearingIssue = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    hearingIssue: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHearingData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/hearing-issue-assessment/${currentFmId}`
        );
        if (response.data.success) {
          setFormData({
            hearingIssue: response.data.data.difficulty_hearing,
          });
        }
      } catch (error) {
        console.error("Error fetching Hearing Issue data:", error);
      }
    };

    if (currentFmId) {
      fetchHearingData(); // Ensure the fetch is only attempted if currentFmId is available
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
        `${process.env.REACT_APP_BASE_URL}api/hearing-issue-assessment`,
        {
          fm_id: currentFmId,
          difficultyHearing: formData.hearingIssue,
        }
      );
      setIsLoading(false)
      if (response.data.success) {
        alert("Hearing Issue assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error saving Hearing Issue assessment:", error);
      alert("Failed to save Hearing Issue assessment. Please try again.");
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
          <label style={styles.label}>Do you have difficulty in hearing? *</label>
          <select
            name="hearingIssue"
            value={formData.hearingIssue || ""}
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

export default HearingIssue;
