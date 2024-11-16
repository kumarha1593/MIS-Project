import React, { useState, useEffect } from "react";
import axios from "axios";

const CVDAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    known_case: "",
    heart_sound: "",
    symptom: "",
    cvd_date: "",
    suspected_cvd: "",
    teleconsultation: "",
    referral: "",
    referral_centre: "",
  });

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showReferralCentre, setShowReferralCentre] = useState(false);

  const fetchCVDData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/cvd-assessment/${currentFmId}`
      );
      if (response.data.success) {
        const fetchedData = response.data.data;
        if (fetchedData.cvd_date) {
          fetchedData.cvd_date = new Date(fetchedData.cvd_date)
            .toISOString()
            .split("T")[0];
        }
        setFormData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching CVD assessment:", error);
    }
  };

  useEffect(() => {
    if (currentFmId) {
      fetchCVDData();
    }
  }, [currentFmId]);

  useEffect(() => {
    setShowAdditionalFields(
      formData.heart_sound === "Abnormal" || formData.symptom === "Yes"
    );
  }, [formData.heart_sound, formData.symptom]);

  useEffect(() => {
    setShowReferralCentre(formData.referral === "Yes");
  }, [formData.referral]);

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      console.log("Sending data to backend:", formData); // Add this line
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/cvd-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("CVD Assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      console.error("Error saving CVD assessment:", error);
      alert("Failed to save CVD assessment. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
          <label style={styles.label}>Known Case *</label>
          <select
            id="known_case"
            name="known_case"
            value={formData.known_case}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes and on treatment">Yes and on treatment</option>
            <option value="Yes and not on treatment">
              Yes and not on treatment
            </option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Heart Sound</label>
          <select
            id="heart_sound"
            name="heart_sound"
            value={formData.heart_sound}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Normal">Normal</option>
            <option value="Abnormal">Abnormal</option>
            <option value="Not Done">Not Done</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Symptom</label>
          <select
            id="symptom"
            name="symptom"
            value={formData.symptom}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>CVD Date</label>
          <input
            type="date"
            id="cvd_date"
            name="cvd_date"
            value={formData.cvd_date}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Suspected CVD</label>
          <select
            id="suspected_cvd"
            name="suspected_cvd"
            value={formData.suspected_cvd}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {showAdditionalFields && (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Teleconsultation *</label>
              <select
                id="teleconsultation"
                name="teleconsultation"
                value={formData.teleconsultation}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Referral *</label>
              <select
                id="referral"
                name="referral"
                value={formData.referral}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {showReferralCentre && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Referral Centre *</label>
                <input
                  type="text"
                  id="referral_centre"
                  name="referral_centre"
                  value={formData.referral_centre}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            )}
          </>
        )}
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

export default CVDAssessment;
