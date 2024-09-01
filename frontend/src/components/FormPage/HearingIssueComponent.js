import React, { useState, useEffect } from "react";
import axios from "axios";

const HearingIssue = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    hearingIssue: "",
  });

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

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/hearing-issue-assessment`,
        {
          fm_id: currentFmId,
          difficultyHearing: formData.hearingIssue,
        }
      );
      if (response.data.success) {
        alert("Hearing Issue assessment saved successfully!");
      }
    } catch (error) {
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
  };

  return (
    <div style={styles.formSection}>
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
      <button type="button" onClick={handleSave}>
        Save Draft
      </button>
    </div>
  );
};

export default HearingIssue;
