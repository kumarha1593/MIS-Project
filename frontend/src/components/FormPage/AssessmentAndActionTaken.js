import React from "react";

const AssessmentAndActionTaken = ({ formData, handleInputChange }) => {
  // Function to check if the user is a known case of DM with HTN
  const isKnownCaseDMWithHTN = () => {
    return (
      (formData.knownHTN === "Yes and on treatment" &&
        formData.knownDM === "Yes and on treatment") ||
      (formData.knownHTN === "Yes and on treatment" &&
        formData.knownDM === "Yes and not on treatment") ||
      (formData.knownHTN === "Yes and not on treatment" &&
        formData.knownDM === "Yes and not on treatment") ||
      (formData.knownHTN === "Yes and not on treatment" &&
        formData.knownDM === "Yes and on treatment")
    );
  };

  // Function to get detected diseases
  const getDetectedDiseases = () => {
    const diseases = [];

    if (formData.knownHTN === "Yes and on treatment" || formData.knownHTN === "Yes and not on treatment") {
      diseases.push("HTN");
    }

    if (formData.knownDM === "Yes and on treatment" || formData.knownDM === "Yes and not on treatment") {
      diseases.push("DM");
    }

    if (formData.cvd?.suspectedHeartDisease === "Yes") {
      diseases.push("CVD");
    }

    if (formData.knownRespiratoryDisease === "Yes") {
      diseases.push("COPD");
    }

    if (formData.suspectedOralCancer === "Yes") {
      diseases.push("Oral CA");
    }

    if (formData.suspectedBreastCancer === "Yes") {
      diseases.push("Breast CA");
    }

    if (formData.knownCervicalCancer === "Yes and on treatment" || formData.knownCervicalCancer === "Yes and not on treatment") {
      diseases.push("Cx CA");
    }

    if (formData.postStroke?.historyOfStroke === "Yes") {
      diseases.push("Post Stroke");
    }

    if (formData.mentalHealth?.briefInterventionGiven === "Yes") {
      diseases.push("Mental Health Problem");
    }

    if (formData.ckd?.ckdRiskAssessment === "Risk") {
      diseases.push("CKD");
    }

    if (formData.knownRespiratoryDisease === "Yes") {
      diseases.push("TB");
    }

    if (formData.cataract?.cataractResult === "Suspected") {
      diseases.push("Cataract");
    }

    return diseases.join(", ");
  };

  const styles = {
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
    textarea: {
      padding: "8px",
      width: "100%",
      boxSizing: "border-box",
      fontSize: "14px",
      resize: "vertical",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
    },
    h3: {
      marginBottom: "15px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      cursor: "pointer",
      backgroundColor: "#8BC34A",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      marginTop: "20px",
      width: "98%",
    },
  };

  return (
    <div style={styles.formGroup}>
      {/* Major NCD Detected */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Major NCD Detected</label>
        <input
          type="text"
          name="majorNCDDetected"
          value={getDetectedDiseases()}
          readOnly
          style={styles.input}
        />
      </div>

      {/* Other Disease Detected */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Any Other Disease Detected</label>
        <textarea
          name="otherDiseaseDetected"
          value={formData.otherDiseaseDetected}
          onChange={handleInputChange}
          placeholder="Specify any other disease detected"
          rows="2"
          style={styles.textarea}
        ></textarea>
      </div>

      {/* Known Case of DM with HTN */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Known Case of DM with HTN</label>
        <input
          type="text"
          name="knownCaseDMWithHTN"
          value={isKnownCaseDMWithHTN() ? "Yes" : "No"}
          onChange={handleInputChange}
          readOnly
          style={styles.input}
        />
      </div>

      {/* Telemedicine */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Telemedicine</label>
        <select
          name="telemedicine"
          value={formData.telemedicine}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* Medicine Distributed */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Medicine Distributed</label>
        <select
          name="medicineDistributed"
          value={formData.medicineDistributed}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* Other Advices */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Other Advices</label>
        <textarea
          name="otherAdvices"
          value={formData.otherAdvices}
          onChange={handleInputChange}
          placeholder="Enter any other advices"
          rows="3"
          style={styles.textarea}
        ></textarea>
      </div>

      {/* Remarks */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          placeholder="Enter remarks (e.g., referral status, other health observations)"
          rows="3"
          style={styles.textarea}
        ></textarea>
      </div>
    </div>
  );
};

export default AssessmentAndActionTaken;