import React from "react";

const RiskAssessment = ({ formData, handleInputChange }) => {
  // Function to calculate the risk score
  const calculateRiskScore = () => {
    let score = 0;
    score += parseInt(formData.age);
    score += parseInt(formData.tobacco);
    score += parseInt(formData.alcohol);
    score += parseInt(formData.waistFemale || formData.waistMale);
    score += parseInt(formData.physicalActivity);
    score += parseInt(formData.familyHistory);
    return score;
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
        <label style={styles.label}>Age *</label>
        <select
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="0">30-39 years</option>
          <option value="1">40-49 years</option>
          <option value="2">50-59 years</option>
          <option value="3">60 years or above</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tobacco Use *</label>
        <select
          name="tobacco"
          value={formData.tobacco}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="0">Never</option>
          <option value="1">Used to consume in the past/ Sometimes now</option>
          <option value="2">Daily</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Alcohol Consumption *</label>
        <select
          name="alcohol"
          value={formData.alcohol}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="0">No</option>
          <option value="2">Yes</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Waist Circumference (Female) *</label>
        <select
          name="waistFemale"
          value={formData.waistFemale}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="0">80 cm or less</option>
          <option value="1">81-90 cm</option>
          <option value="2">More than 90 cm</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Waist Circumference (Male) *</label>
        <select
          name="waistMale"
          value={formData.waistMale}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="0">90 cm or less</option>
          <option value="1">91-100 cm</option>
          <option value="2">More than 100 cm</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Physical Activity *</label>
        <select
          name="physicalActivity"
          value={formData.physicalActivity}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="0">At least 150 minutes in a week</option>
          <option value="2">Less than 150 minutes in a week</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Family History of Diabetes *</label>
        <select
          name="familyHistory"
          value={formData.familyHistory}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="0">No</option>
          <option value="2">Yes</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Risk Score *</label>
        <input
          type="number"
          name="riskScore"
          value={calculateRiskScore()}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default RiskAssessment;
