import React, { useState, useEffect } from "react";

const DMAssessment = ({ formData, handleInputChange }) => {
  const [rbsOption, setRbsOption] = useState(formData.rbsOption || "");
  const [rbsValue, setRbsValue] = useState(formData.rbsValue || "");
  const [showHighBSOptions, setShowHighBSOptions] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    // Check if RBS value is higher than 140 mg/dL
    if (Number(rbsValue) > 140) {
      setShowHighBSOptions(true);
    } else {
      setShowHighBSOptions(false);
      setShowReferralField(false);
    }
  }, [rbsValue]);

  const handleRbsOptionChange = (e) => {
    setRbsOption(e.target.value);
    handleInputChange(e);
  };

  const handleRbsValueChange = (e) => {
    setRbsValue(e.target.value);
    handleInputChange(e);
  };

  const handleHighBSActionChange = (e) => {
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
      maxWidth: "300px",
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
        <label style={styles.label}>Known case of DM *</label>
        <select
          name="knownDM"
          value={formData.knownDM}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes and on Treatment</option>
          <option value="2">Yes and Not on Treatment</option>
          <option value="3">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Blood Sugar Type *</label>
        <select
          name="rbsOption"
          value={rbsOption}
          onChange={handleRbsOptionChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="fasting">Fasting</option>
          <option value="pp">Post Prandial (PP)</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          {rbsOption ? `${rbsOption.charAt(0).toUpperCase() + rbsOption.slice(1)} Blood Sugar (mg/dL)` : "Blood Sugar (mg/dL)"} *
        </label>
        <input
          type="number"
          name="rbsValue"
          value={rbsValue}
          onChange={handleRbsValueChange}
          required
          style={styles.input}
        />
      </div>

      {showHighBSOptions && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Action for High Blood Sugar *</label>
          <select
            name="highBSAction"
            value={formData.highBSAction}
            onChange={handleHighBSActionChange}
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
          <label style={styles.label}>Referred Centre for DM *</label>
          <input
            type="text"
            name="referredCentreDM"
            value={formData.referredCentreDM}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>
          DM Confirmed at PHC/CHC/DH and Date *
        </label>
        <input
          type="date"
          name="dmConfirmed"
          value={formData.dmConfirmed}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default DMAssessment;
