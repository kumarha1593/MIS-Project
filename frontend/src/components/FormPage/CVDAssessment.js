import React, { useState, useEffect } from "react";
import axios from "axios";

const CVDAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    known_case: "",
    heart_sound: "",
    symptom: "",
    cvd_date: "",
    suspected_cvd: "",
  });

  const [showAbnormalHeartOptions, setShowAbnormalHeartOptions] =
    useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  const fetchCVDData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/cvd-assessment/${currentFmId}`
      );
      if (response.data.success) {
        const fetchedData = response.data.data;
        // Format the date to "yyyy-MM-dd"
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
    // Show the options if Heart Sound is abnormal or Heart Disease Symptoms are positive
    if (formData.heart_sound === "Abnormal" || formData.symptom === "Yes") {
      setShowAbnormalHeartOptions(true);
    } else {
      setShowAbnormalHeartOptions(false);
      setShowReferralField(false);
    }
  }, [formData.heart_sound, formData.symptom]);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/cvd-assessment",
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("CVD Assessment saved successfully!");
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

  const handleOptionChange = (e) => {
    handleInputChange(e);
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
        <label style={styles.label}>Heart Sound *</label>
        <select
          id="heart_sound"
          name="heart_sound"
          value={formData.heart_sound}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Symptom *</label>
        <select
          id="symptom"
          name="symptom"
          value={formData.symptom}
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
        <label style={styles.label}>CVD Date *</label>
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
        <label style={styles.label}>Suspected CVD *</label>
        <select
          id="suspected_cvd"
          name="suspected_cvd"
          value={formData.suspected_cvd}
          onChange={handleInputChange}
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
            <label style={styles.label}>Teleconsultation Done *</label>
            <select
              id="teleconsultationDone"
              name="teleconsultationDone"
              value={formData.teleconsultationDone || ""}
              onChange={handleOptionChange}
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {showReferralField && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Referral Done *</label>
              <select
                id="referralDone"
                name="referralDone"
                value={formData.referralDone || ""}
                onChange={handleOptionChange}
                style={styles.input}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          )}
        </>
      )}

      <button type="button" onClick={handleSave} style={styles.button}>
        Save CVD Assessment
      </button>
    </div>
  );
};

const styles = {
  formSection: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default CVDAssessment;
