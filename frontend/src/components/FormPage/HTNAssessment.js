import React, { useState, useEffect } from "react";

const HTNAssessment = ({ formData, handleInputChange }) => {
  const [bp, setBp] = useState(formData.bp || "");
  const [showHighBPOptions, setShowHighBPOptions] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    // Check if BP is higher than 140 or lower than 90 mmHg
    const [upperBP, lowerBP] = bp.split("/").map(Number);
    if (upperBP > 140 || lowerBP < 90) {
      setShowHighBPOptions(true);
    } else {
      setShowHighBPOptions(false);
      setShowReferralField(false);
    }
  }, [bp]);

  const handleBpChange = (e) => {
    setBp(e.target.value);
    handleInputChange(e);
  };

  const handleHighBPActionChange = (e) => {
    const value = e.target.value;
    handleInputChange(e);

    if (value === "2") {
      // If "Referral" is selected, show the referred center field
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
  };

  return (
    <div style={styles.formSection}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Known case of HTN *</label>
        <select
          name="knownHTN"
          value={formData.knownHTN}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes and on treatment</option>
          <option value="2">Yes and not on treatment</option>
          <option value="3">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Blood Pressure (mmHg) *</label>
        <input
          type="text"
          name="bp"
          value={bp}
          onChange={handleBpChange}
          required
          style={styles.input}
        />
      </div>

      {showHighBPOptions && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Action for High BP *</label>
          <select
            name="highBPAction"
            value={formData.highBPAction}
            onChange={handleHighBPActionChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="1">Teleconsultation</option>
            <option value="2">Referral</option>
          </select>
        </div>
      )}

      {showReferralField && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Referred Centre for HTN *</label>
          <input
            type="text"
            name="referredCentreHTN"
            value={formData.referredCentreHTN}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>
          HTN Confirmed at PHC/CHC/DH and Date *
        </label>
        <input
          type="date"
          name="htnConfirmed"
          value={formData.htnConfirmed}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default HTNAssessment;
