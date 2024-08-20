import React, { useState, useEffect } from "react";

const COPDTBAssessment = ({ formData, handleInputChange }) => {
  const [knownRespiratoryDisease, setKnownRespiratoryDisease] = useState(
    formData.knownRespiratoryDisease || ""
  );
  const [showRespiratoryDiseaseField, setShowRespiratoryDiseaseField] =
    useState(false);
  const [showChestSoundOptions, setShowChestSoundOptions] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);
  const [respiratoryConfirmed, setRespiratoryConfirmed] = useState(
    formData.respiratoryConfirmed || ""
  );
  const [showRespiratoryConfirmedDate, setShowRespiratoryConfirmedDate] =
    useState(false);

  useEffect(() => {
    if (knownRespiratoryDisease === "Yes") {
      setShowRespiratoryDiseaseField(true);
    } else {
      setShowRespiratoryDiseaseField(false);
    }
  }, [knownRespiratoryDisease]);

  useEffect(() => {
    if (formData.chestSound === "2") {
      setShowChestSoundOptions(true);
    } else {
      setShowChestSoundOptions(false);
      setShowReferralField(false);
    }
  }, [formData.chestSound]);

  useEffect(() => {
    if (respiratoryConfirmed === "Yes") {
      setShowRespiratoryConfirmedDate(true);
    } else {
      setShowRespiratoryConfirmedDate(false);
    }
  }, [respiratoryConfirmed]);

  const handleKnownRespiratoryDiseaseChange = (e) => {
    setKnownRespiratoryDisease(e.target.value);
    handleInputChange(e);
  };

  const handleChestSoundChange = (e) => {
    handleInputChange(e);

    if (e.target.value === "2") {
      setShowChestSoundOptions(true);
    } else {
      setShowChestSoundOptions(false);
      setShowReferralField(false);
    }
  };

  const handleRespiratoryConfirmedChange = (e) => {
    setRespiratoryConfirmed(e.target.value);
    handleInputChange(e);
  };

  const handleReferralChange = (e) => {
    handleInputChange(e);

    if (e.target.value === "2") {
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
        <label style={styles.label}>
          Known case of chronic respiratory diseases (ASTHMA/COPD/OTHERS) *
        </label>
        <select
          name="knownRespiratoryDisease"
          value={knownRespiratoryDisease}
          onChange={handleKnownRespiratoryDiseaseChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {showRespiratoryDiseaseField && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Specify Respiratory Disease</label>
          <input
            type="text"
            name="respiratoryDisease"
            value={formData.respiratoryDisease}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>Occupational Exposure *</label>
        <select
          name="occupationalExposure"
          value={formData.occupationalExposure}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Crop residue burning</option>
          <option value="2">Burning of garbage</option>
          <option value="3">Working in industries with smoke, gas, dust</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Type of Fuel Used for Cooking *</label>
        <select
          name="fuelForCooking"
          value={formData.fuelForCooking}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Firewood</option>
          <option value="2">Crop Residue</option>
          <option value="3">Cow dung cake</option>
          <option value="4">Coal</option>
          <option value="5">Kerosene</option>
          <option value="6">LPG</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Chest Sound *</label>
        <select
          name="chestSound"
          value={formData.chestSound}
          onChange={handleChestSoundChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="1">Normal</option>
          <option value="2">Abnormal</option>
        </select>
      </div>

      {showChestSoundOptions && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Action for Abnormal Chest Sound *</label>
          <select
            name="chestSoundAction"
            value={formData.chestSoundAction}
            onChange={handleReferralChange}
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
          <label style={styles.label}>Name of the Centre Referred</label>
          <input
            type="text"
            name="referredCentreCOPD"
            value={formData.referredCentreCOPD}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Respiratory/COPD disease confirmed at PHC/CHC/DH *
        </label>
        <select
          name="respiratoryConfirmed"
          value={respiratoryConfirmed}
          onChange={handleRespiratoryConfirmedChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {showRespiratoryConfirmedDate && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Date of Confirmation</label>
          <input
            type="date"
            name="copdConfirmedDate"
            value={formData.copdConfirmedDate}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>Shortness of Breath *</label>
        <select
          name="shortnessOfBreath"
          value={formData.shortnessOfBreath}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Coughing for More Than 2 Weeks *</label>
        <select
          name="coughingMoreThan2Weeks"
          value={formData.coughingMoreThan2Weeks}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Blood in Sputum *</label>
        <select
          name="bloodInSputum"
          value={formData.bloodInSputum}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Fever for More Than 2 Weeks *</label>
        <select
          name="feverMoreThan2Weeks"
          value={formData.feverMoreThan2Weeks}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Loss of Weight *</label>
        <select
          name="lossOfWeight"
          value={formData.lossOfWeight}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Anyone in family currently suffering from TB *
        </label>
        <select
          name="familyMemberSufferingTB"
          value={formData.familyMemberSufferingTB}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>History of TB *</label>
        <select
          name="historyOfTB"
          value={formData.historyOfTB}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );
};

export default COPDTBAssessment;
