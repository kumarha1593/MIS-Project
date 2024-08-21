import React from "react";

const ElderlyAssessment = ({ formData, handleInputChange }) => {
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
          Do you feel unsteady while standing or walking? *
        </label>
        <select
          name="unsteadyWalking"
          value={formData.elderly.unsteadyWalking}
          onChange={(e) => handleInputChange(e, "elderly")}
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
          Are you suffering from any physical disability? *
        </label>
        <select
          name="physicalDisability"
          value={formData.elderly.physicalDisability}
          onChange={(e) => handleInputChange(e, "elderly")}
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
          value={formData.elderly.helpNeeded}
          onChange={(e) => handleInputChange(e, "elderly")}
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
          value={formData.elderly.forgetNames}
          onChange={(e) => handleInputChange(e, "elderly")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );
};

export default ElderlyAssessment;
