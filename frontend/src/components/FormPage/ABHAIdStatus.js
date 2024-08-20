import React from "react";

const ABHAIdStatus = ({ formData, handleInputChange }) => {
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

        <select
          name="abhaIdStatus"
          value={formData.abhaIdStatus}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Created</option>
          <option value="2">Linked</option>
          <option value="3">None</option>
        </select>
      </div>
    </div>
  );
};

export default ABHAIdStatus;
