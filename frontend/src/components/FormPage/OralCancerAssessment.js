import React from "react";

const OralCancerAssessment = ({ formData, handleInputChange }) => {
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
          Known case of Oral Cancer. If yes, treatment status *
        </label>
        <select
          name="knownOralCancer"
          value={formData.knownOralCancer}
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
        <label style={styles.label}>
          Persistent ulcer in the mouth or tongue for more than 2 weeks *
        </label>
        <select
          name="persistentUlcer"
          value={formData.persistentUlcer}
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
          Persistent white or red patch in the mouth or tongue *
        </label>
        <select
          name="whiteRedPatch"
          value={formData.whiteRedPatch}
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
          Difficulty in chewing or swallowing *
        </label>
        <select
          name="difficultyChewing"
          value={formData.difficultyChewing}
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
        <label style={styles.label}>Difficulty in opening the mouth *</label>
        <select
          name="difficultyOpeningMouth"
          value={formData.difficultyOpeningMouth}
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
          Any growth in the mouth or swelling in the neck *
        </label>
        <select
          name="growthOrSwelling"
          value={formData.growthOrSwelling}
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
          Is the person suspected for oral cancer? *
        </label>
        <select
          name="suspectedOralCancer"
          value={formData.suspectedOralCancer}
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

export default OralCancerAssessment;
