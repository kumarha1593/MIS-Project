import React, { useState, useEffect } from "react";

const CervicalCancerAssessment = ({ formData, handleInputChange }) => {
  const [bleedingQuestions, setBleedingQuestions] = useState({
    bleedingBetweenPeriods: formData.bleedingBetweenPeriods || "",
    bleedingAfterMenopause: formData.bleedingAfterMenopause || "",
    bleedingAfterIntercourse: formData.bleedingAfterIntercourse || "",
    foulSmellingDischarge: formData.foulSmellingDischarge || "",
  });

  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    const {
      bleedingBetweenPeriods,
      bleedingAfterMenopause,
      bleedingAfterIntercourse,
      foulSmellingDischarge,
    } = bleedingQuestions;

    // If any of the bleeding-related questions are "Yes", show referral field
    if (
      bleedingBetweenPeriods === "Yes" ||
      bleedingAfterMenopause === "Yes" ||
      bleedingAfterIntercourse === "Yes" ||
      foulSmellingDischarge === "Yes"
    ) {
      setShowReferralField(true);
    } else {
      setShowReferralField(false);
    }
  }, [bleedingQuestions]);

  const handleBleedingChange = (e) => {
    const { name, value } = e.target;
    setBleedingQuestions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    handleInputChange(e);
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
        <label style={styles.label}>Known case of Cervical Cancer *</label>
        <select
          name="knownCervicalCancer"
          value={formData.knownCervicalCancer}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Yes, and on treatment</option>
          <option value="2">Yes, but not on treatment</option>
          <option value="3">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Bleeding between periods *</label>
        <select
          name="bleedingBetweenPeriods"
          value={bleedingQuestions.bleedingBetweenPeriods}
          onChange={handleBleedingChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Bleeding after menopause *</label>
        <select
          name="bleedingAfterMenopause"
          value={bleedingQuestions.bleedingAfterMenopause}
          onChange={handleBleedingChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Bleeding after intercourse *</label>
        <select
          name="bleedingAfterIntercourse"
          value={bleedingQuestions.bleedingAfterIntercourse}
          onChange={handleBleedingChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Foul-smelling vaginal discharge *</label>
        <select
          name="foulSmellingDischarge"
          value={bleedingQuestions.foulSmellingDischarge}
          onChange={handleBleedingChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {showReferralField && (
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Referred Centre for Cervical Cancer *
          </label>
          <input
            type="text"
            name="referredCentreCervicalCancer"
            value={formData.referredCentreCervicalCancer}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>VIA Date of Appointment *</label>
        <input
          type="date"
          name="viaAppointmentDate"
          value={formData.viaAppointmentDate}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>VIA +/- *</label>
        <select
          name="viaResult"
          value={formData.viaResult}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      </div>

      {formData.viaResult === "Positive" && (
        <div style={styles.formGroup}>
          <label style={styles.label}>
            If VIA+, name of the referred centre *
          </label>
          <input
            type="text"
            name="referredCentreVIA"
            value={formData.referredCentreVIA}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
      )}
    </div>
  );
};

export default CervicalCancerAssessment;
