import React from "react";

const BreastCancerAssessment = ({ formData, handleInputChange }) => {
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
          Known case of Breast Cancer. If yes, treatment status *
        </label>
        <select
          name="knownBreastCancer"
          value={formData.knownBreastCancer}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes, on treatment</option>
          <option value="2">Yes, not on treatment</option>
          <option value="3">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Lump in the breast *</label>
        <select
          name="lumpInBreast"
          value={formData.lumpInBreast}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="2">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Blood-stained discharge from the nipple / erosion of nipple /
          puckering or dimpling in nipple *
        </label>
        <select
          name="nippleDischarge"
          value={formData.nippleDischarge}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="2">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Change in shape and size of breast *</label>
        <select
          name="shapeSizeChange"
          value={formData.shapeSizeChange}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="2">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Constant pain in the breast or armpit or swelling of armpit *
        </label>
        <select
          name="painSwellingArmpit"
          value={formData.painSwellingArmpit}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="2">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Redness of skin over breast or any ulcer *
        </label>
        <select
          name="rednessUlcer"
          value={formData.rednessUlcer}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="2">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Is the person suspected for breast cancer? *
        </label>
        <select
          name="suspectedBreastCancer"
          value={formData.suspectedBreastCancer}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="2">No</option>
        </select>
      </div>
    </div>
  );
};

export default BreastCancerAssessment;
