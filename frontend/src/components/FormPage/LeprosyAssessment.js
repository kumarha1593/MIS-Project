import React from "react";

const LeprosyAssessment = ({ formData, handleInputChange }) => {
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
          Hypopigmented or discolored lesion(s) with loss of sensation *
        </label>
        <select
          name="lesionSensationLoss"
          value={formData.leprosy.lesionSensationLoss}
          onChange={(e) => handleInputChange(e, "leprosy")}
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
          Recurrent ulceration on palm or sole *
        </label>
        <select
          name="ulceration"
          value={formData.leprosy.ulceration}
          onChange={(e) => handleInputChange(e, "leprosy")}
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
          Clawing of fingers or tingling/numbness in hands/feet *
        </label>
        <select
          name="clawingFingers"
          value={formData.leprosy.clawingFingers}
          onChange={(e) => handleInputChange(e, "leprosy")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Inability to close eyelid *</label>
        <select
          name="inabilityToCloseEyelid"
          value={formData.leprosy.inabilityToCloseEyelid}
          onChange={(e) => handleInputChange(e, "leprosy")}
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
          Difficulty in holding objects or weakness in feet *
        </label>
        <select
          name="weaknessFeet"
          value={formData.leprosy.weaknessFeet}
          onChange={(e) => handleInputChange(e, "leprosy")}
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

export default LeprosyAssessment;
