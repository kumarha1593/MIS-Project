import React from "react";

const CKDAssessment = ({ formData, handleInputChange }) => {
  // Function to calculate the CKD risk assessment score
  const calculateCKDRiskScore = () => {
    let score = 0;
    if (
      formData.ckd.knownCKD === "Yes, on treatment" ||
      formData.ckd.knownCKD === "Yes, not on treatment"
    ) {
      score += 1;
    }
    if (formData.ckd.historyCKDStone === "Yes") {
      score += 1;
    }
    if (formData.ckd.age > 50) {
      score += 1;
    }
    if (formData.ckd.hypertensionPatient === "Yes") {
      score += 1;
    }
    if (formData.ckd.diabetesPatient === "Yes") {
      score += 1;
    }
    if (formData.ckd.swellingFaceLeg === "Yes") {
      score += 1;
    }
    if (formData.ckd.historyNSAIDS === "Yes") {
      score += 1;
    }
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
      <div className="form-group">
        <label>Known case of CKD *</label>
        <select
          name="knownCKD"
          value={formData.ckd.knownCKD}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
        >
          <option value="">Select</option>
          <option value="Yes, on treatment">Yes, on treatment</option>
          <option value="Yes, not on treatment">Yes, not on treatment</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group">
        <label>History of CKD/Stone *</label>
        <select
          name="historyCKDStone"
          value={formData.ckd.historyCKDStone}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group">
        <label>Age (Above 50) *</label>
        <input
          type="number"
          name="age"
          value={formData.ckd.age}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
        />
      </div>
      <div className="form-group">
        <label>Hypertension Patient *</label>
        <select
          name="hypertensionPatient"
          value={formData.ckd.hypertensionPatient}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group">
        <label>Diabetes Patient *</label>
        <select
          name="diabetesPatient"
          value={formData.ckd.diabetesPatient}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group">
        <label>Swelling on Face and Leg *</label>
        <select
          name="swellingFaceLeg"
          value={formData.ckd.swellingFaceLeg}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group">
        <label>History of NSAIDS/Over the Counter Drug *</label>
        <select
          name="historyNSAIDS"
          value={formData.ckd.historyNSAIDS}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Risk Score *</label>
        <input
          type="number"
          name="ckdRiskScore"
          value={calculateCKDRiskScore()}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
          readOnly
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Risk Assessment *</label>
        <select
          name="ckdRiskAssessment"
          value={formData.ckd.ckdRiskAssessment}
          onChange={(e) => handleInputChange(e, "ckd")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Risk</option>
          <option value="2">No Risk</option>
        </select>
      </div>
    </div>
  );
};

export default CKDAssessment;
