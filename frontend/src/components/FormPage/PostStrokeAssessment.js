import React, { useState, useEffect } from "react";

const PostStrokeAssessment = ({ formData, handleInputChange }) => {
  const [historyOfStroke, setHistoryOfStroke] = useState(
    formData.postStroke.historyOfStroke || ""
  );
  const [showStrokeDetails, setShowStrokeDetails] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    // Show or hide stroke details based on historyOfStroke value
    if (historyOfStroke === "Yes") {
      setShowStrokeDetails(true);
    } else {
      setShowStrokeDetails(false);
      setShowReferralField(false);
    }
  }, [historyOfStroke]);

  const handleStrokeChange = (e) => {
    setHistoryOfStroke(e.target.value);
    handleInputChange(e, "postStroke");
  };

  const handleActionChange = (e) => {
    const value = e.target.value;
    handleInputChange(e, "postStroke");

    if (value === "Referral") {
      // If "Referral" is selected, show the referred center field
      setShowReferralField(true);
    } else {
      setShowReferralField(false);
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
        <label style={styles.label}>History of Stroke *</label>
        <select
          name="historyOfStroke"
          value={historyOfStroke}
          onChange={handleStrokeChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {showStrokeDetails && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Stroke</label>
            <input
              type="date"
              name="dateOfStroke"
              value={formData.postStroke.dateOfStroke}
              onChange={(e) => handleInputChange(e, "postStroke")}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Present Condition *</label>
            <select
              name="presentCondition"
              value={formData.postStroke.presentCondition}
              onChange={(e) => handleInputChange(e, "postStroke")}
              required
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="Recovered">Recovered</option>
              <option value="Not recovered">Not recovered</option>
              <option value="Need Physiotherapy">Need Physiotherapy</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              If positive for Stroke Symptoms, Action Taken *
            </label>
            <select
              name="strokeSymptomsAction"
              value={formData.postStroke.strokeSymptomsAction}
              onChange={handleActionChange}
              required
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="Teleconsultation">Teleconsultation</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          {showReferralField && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Name of the Centre Referred</label>
              <input
                type="text"
                name="referredCenter"
                value={formData.postStroke.referredCenter}
                onChange={(e) => handleInputChange(e, "postStroke")}
                style={styles.input}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostStrokeAssessment;
