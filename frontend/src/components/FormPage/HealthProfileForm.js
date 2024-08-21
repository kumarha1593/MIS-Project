import React from "react";

const HealthProfileForm = ({ formData, handleInputChange }) => {
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
    select: {
      padding: "8px",
      width: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "14px",
    },
    conditionalInput: {
      marginTop: "10px",
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
        <label style={styles.label}>Patient Name *</label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Any Identifier (ABHA ID, Aadhar Card, UID, Voter ID) *
        </label>
        <select
          name="identifierType"
          value={formData.identifierType}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="ABHA ID">ABHA ID</option>
          <option value="Aadhar Card">Aadhar Card</option>
          <option value="UID">UID</option>
          <option value="Voter ID">Voter ID</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Card Number *</label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Date of Birth *</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Sex *</label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Telephone No. (self/other - mention relation) *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Address *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>State Health Insurance Schemes *</label>
        <select
          name="insurance"
          value={formData.insurance}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
        {formData.insurance === "Yes" && (
          <input
            type="text"
            name="insuranceDetails"
            placeholder="Specify"
            value={formData.insuranceDetails}
            onChange={handleInputChange}
            style={styles.conditionalInput}
          />
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Is this person having any known disability? *
        </label>
        <select
          name="disability"
          value={formData.disability}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
        {formData.disability === "Yes" && (
          <input
            type="text"
            name="disabilityDetails"
            placeholder="Specify"
            value={formData.disabilityDetails}
            onChange={handleInputChange}
            style={styles.conditionalInput}
          />
        )}
      </div>
    </div>
  );
};

export default HealthProfileForm;
