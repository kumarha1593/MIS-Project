import React from "react";

const CataractAssessment = ({ formData, handleInputChange }) => {
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
          Do you have cloudy or blurred vision? *
        </label>
        <select
          name="cloudyVision"
          value={formData.cataract.cloudyVision}
          onChange={(e) => handleInputChange(e, "cataract")}
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
          Pain or redness in eyes lasting for more than a week *
        </label>
        <select
          name="eyePain"
          value={formData.cataract.eyePain}
          onChange={(e) => handleInputChange(e, "cataract")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Cataract Assessment Result *</label>
        <select
          name="cataractResult"
          value={formData.cataract.cataractResult}
          onChange={(e) => handleInputChange(e, "cataract")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Suspected</option>
          <option value="2">Not Suspected</option>
        </select>
      </div>
    </div>
  );
};

export default CataractAssessment;
