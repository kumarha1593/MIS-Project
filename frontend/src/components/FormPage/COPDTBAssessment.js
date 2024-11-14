import React, { useState, useEffect } from "react";
import axios from "axios";

const COPDTBAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    known_case_crd: "",
    crd_specify: "",
    occupational_exposure: "",
    cooking_fuel_type: "",
    chest_sound: "",
    chest_sound_action: "",
    referral_center_name: "",
    copd_confirmed: "",
    copd_confirmation_date: "",
    shortness_of_breath: "",
    coughing_more_than_2_weeks: "",
    blood_in_sputum: "",
    fever_more_than_2_weeks: "",
    night_sweats: "",
    taking_anti_tb_drugs: "",
    family_tb_history: "",
    history_of_tb: "",
  });

  const [showRespiratoryDiseaseField, setShowRespiratoryDiseaseField] =
    useState(false);
  const [showChestSoundOptions, setShowChestSoundOptions] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);
  const [showRespiratoryConfirmedDate, setShowRespiratoryConfirmedDate] =
    useState(false);

  useEffect(() => {
    const fetchCOPDTBData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/copd-tb-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;

          // Format the date to "yyyy-MM-dd"
          if (data.copd_confirmation_date) {
            data.copd_confirmation_date = new Date(data.copd_confirmation_date)
              .toISOString()
              .split("T")[0];
          }

          setFormData(data);

          if (data.known_case_crd === "Yes") {
            setShowRespiratoryDiseaseField(true);
          }
          if (data.chest_sound === "Abnormal") {
            setShowChestSoundOptions(true);
            if (data.chest_sound_action === "Referral") {
              setShowReferralField(true);
            }
          }
          if (data.copd_confirmed === "Yes") {
            setShowRespiratoryConfirmedDate(true);
          }
        }
      } catch (error) {
        console.error("Error fetching COPD/TB assessment:", error);
      }
    };

    if (currentFmId) {
      fetchCOPDTBData();
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "known_case_crd") {
      setShowRespiratoryDiseaseField(value === "Yes");
    }

    if (name === "chest_sound") {
      if (value === "Abnormal") {
        setShowChestSoundOptions(true);
      } else {
        setShowChestSoundOptions(false);
        setShowReferralField(false);
      }
    }

    if (name === "chest_sound_action") {
      setShowReferralField(value === "Referral");
    }

    if (name === "copd_confirmed") {
      setShowRespiratoryConfirmedDate(value === "Yes");
    }
  };

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/copd-tb-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("COPD/TB assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      console.error("Error saving COPD/TB assessment:", error);
      alert("Failed to save COPD/TB assessment. Please try again.");
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
      <form onSubmit={handleSave}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Known case of chronic respiratory diseases (ASTHMA/COPD/OTHERS) *
          </label>
          <select
            name="known_case_crd"
            value={formData.known_case_crd || ""}
            onChange={handleInputChange}
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
              name="crd_specify"
              value={formData.crd_specify || ""}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Occupational Exposure *</label>
          <select
            name="occupational_exposure"
            value={formData.occupational_exposure || ""}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="No">No</option>
            <option value="Crop residue burning">Crop residue burning</option>
            <option value="Burning of garbage/leaves">
              Burning of garbage/leaves
            </option>
            <option value="Working in industries with smoke, gas, and dust exposure">
              Working in industries with smoke, gas, and dust exposure
            </option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Type of Fuel Used for Cooking *</label>
          <select
            name="cooking_fuel_type"
            value={formData.cooking_fuel_type || ""}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Firewood">Firewood</option>
            <option value="Crop Residue">Crop Residue</option>
            <option value="Cow dung cake">Cow dung cake</option>
            <option value="Coal">Coal</option>
            <option value="Kerosene">Kerosene</option>
            <option value="LPG">LPG</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Chest Sound *</label>
          <select
            name="chest_sound"
            value={formData.chest_sound || ""}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Normal">Normal</option>
            <option value="Abnormal">Abnormal</option>
          </select>
        </div>

        {showChestSoundOptions && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Action for Abnormal Chest Sound *</label>
            <select
              name="chest_sound_action"
              value={formData.chest_sound_action || ""}
              onChange={handleInputChange}
              required
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="Teleconsultation">Teleconsultation</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
        )}

        {showReferralField && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Name of the Centre Referred</label>
            <input
              type="text"
              name="referral_center_name"
              value={formData.referral_center_name || ""}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Respiratory/COPD disease confirmed at PHC/CHC/DH
          </label>
          <select
            name="copd_confirmed"
            value={formData.copd_confirmed || ""}
            onChange={handleInputChange}
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
              name="copd_confirmation_date"
              value={formData.copd_confirmation_date || ""}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
        )}

        {/* Additional questions */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Shortness of Breath *</label>
          <select
            name="shortness_of_breath"
            value={formData.shortness_of_breath || ""}
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
            name="coughing_more_than_2_weeks"
            value={formData.coughing_more_than_2_weeks || ""}
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
            name="blood_in_sputum"
            value={formData.blood_in_sputum || ""}
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
            name="fever_more_than_2_weeks"
            value={formData.fever_more_than_2_weeks || ""}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Night Sweats Field */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Night Sweats *</label>
          <select
            name="night_sweats"
            value={formData.night_sweats || ""}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Taking Anti-TB Drugs Field */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Are you currently taking anti-TB drugs? *
          </label>
          <select
            name="taking_anti_tb_drugs"
            value={formData.taking_anti_tb_drugs || ""}
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
            name="family_tb_history"
            value={formData.family_tb_history || ""}
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
          <label style={styles.label}>History of TB</label>
          <select
            name="history_of_tb"
            value={formData.history_of_tb || ""}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <footer className="form-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="submit">
            Save & Next
          </button>
        </footer>
      </form>
    </div>
  );
};

export default COPDTBAssessment;
