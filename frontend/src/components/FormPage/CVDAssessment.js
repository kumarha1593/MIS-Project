import React, { useState, useEffect } from "react";

const CVDAssessment = ({ formData, handleInputChange }) => {
  const [showAbnormalHeartOptions, setShowAbnormalHeartOptions] =
    useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    // Show the options if Heart Sound is abnormal or Heart Disease Symptoms are positive
    if (
      formData.cvd.heartSound === "2" ||
      formData.cvd.heartDiseaseSymptom === "Yes"
    ) {
      setShowAbnormalHeartOptions(true);
    } else {
      setShowAbnormalHeartOptions(false);
      setShowReferralField(false);
    }
  }, [formData.cvd.heartSound, formData.cvd.heartDiseaseSymptom]);

  const handleOptionChange = (e) => {
    handleInputChange(e, "cvd");
    if (e.target.name === "teleconsultationDone" && e.target.value === "Yes") {
      setShowReferralField(true);
    } else if (e.target.name === "referralDone" && e.target.value === "Yes") {
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
    <div style={styles.formSection}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Known case of Heart disease *</label>
        <select
          name="knownHeartDisease"
          value={formData.cvd.knownHeartDisease}
          onChange={(e) => handleInputChange(e, "cvd")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Heart Sound *</label>
        <select
          name="heartSound"
          value={formData.cvd.heartSound}
          onChange={(e) => handleInputChange(e, "cvd")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Normal</option>
          <option value="2">Abnormal</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Heart disease symptom *</label>
        <select
          name="heartDiseaseSymptom"
          value={formData.cvd.heartDiseaseSymptom}
          onChange={(e) => handleInputChange(e, "cvd")}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {showAbnormalHeartOptions && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Teleconsultation done *</label>
            <select
              name="teleconsultationDone"
              value={formData.cvd.teleconsultationDone}
              onChange={handleOptionChange}
              required
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Referral done *</label>
            <select
              name="referralDone"
              value={formData.cvd.referralDone}
              onChange={handleOptionChange}
              required
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </>
      )}

      {showReferralField && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Name of the centre referred *</label>
          <input
            type="text"
            name="referredCenter"
            value={formData.cvd.referredCenter}
            onChange={(e) => handleInputChange(e, "cvd")}
            required
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Heart disease confirmed at PHC/CHC/DH and date *
        </label>
        <input
          type="date"
          name="heartDiseaseConfirmed"
          value={formData.cvd.heartDiseaseConfirmed}
          onChange={(e) => handleInputChange(e, "cvd")}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Suspected for heart disease *</label>
        <select
          name="suspectedHeartDisease"
          value={formData.cvd.suspectedHeartDisease}
          onChange={(e) => handleInputChange(e, "cvd")}
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

export default CVDAssessment;
