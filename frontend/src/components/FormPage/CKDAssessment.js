import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ButtonLoader from "../global/ButtonLoader";

const CKDAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    knownCKD: "",
    historyCKDStone: "",
    ageAbove50: "",
    hypertensionPatient: !localStorage.getItem('case_of_htn_data') ? '' : localStorage.getItem('case_of_htn_data') == 'No' ? "No" : "Yes",
    diabetesPatient: !localStorage.getItem('case_of_dm_data') ? "" : localStorage.getItem('case_of_dm_data') == 'No' ? "No" : "Yes",
    anemiaPatient: "",
    historyOfStroke: !localStorage.getItem('history_of_stroke_data') ? '' : localStorage.getItem('history_of_stroke_data') == 'No' ? "No" : "Yes",
    swellingFaceLeg: "",
    historyNSAIDS: "",
    ckdRiskScore: 0,
    riskaAssessment: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateCKDRiskScore = useCallback(() => {
    let score = 0;
    if (
      formData.knownCKD === "Yes, on treatment" ||
      formData.knownCKD === "Yes, not on treatment"
    )
      score += 1;
    if (formData.historyCKDStone === "Yes") score += 1;
    if (formData.ageAbove50 === "Yes") score += 1;
    if (formData.hypertensionPatient === "Yes") score += 1;
    if (formData.diabetesPatient === "Yes") score += 1;
    if (formData.anemiaPatient === "Yes") score += 1;
    if (formData.historyOfStroke === "Yes") score += 1;
    if (formData.swellingFaceLeg === "Yes") score += 1;
    if (formData.historyNSAIDS === "Yes") score += 1;
    return score;
  }, [formData]);

  const calculateRiskAssessment = useCallback((score) => {
    return score >= 5 ? "Risk" : "No Risk";
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const fetchCKDData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/ckd-assessment/${currentFmId}`
      );
      if (response.data.success) {
        const data = response.data.data;
        setFormData({
          knownCKD: data.knownCKD || "",
          historyCKDStone: data.historyCKDStone || "",
          ageAbove50: data.ageAbove50 || "",
          hypertensionPatient: data.hypertensionPatient || "",
          diabetesPatient: data.diabetesPatient || "",
          anemiaPatient: data.anemiaPatient || "",
          historyOfStroke: data.historyOfStroke || "",
          swellingFaceLeg: data.swellingFaceLeg || "",
          historyNSAIDS: data.historyNSAIDS || "",
          ckdRiskScore: data.ckdRiskScore || 0,
          riskaAssessment: data.riskaAssessment || "",
        });
      }
    } catch (error) {
      console.error("Error fetching CKD assessment:", error);
    }
  }, [currentFmId]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const ckdRiskScore = calculateCKDRiskScore();
    const riskaAssessment = calculateRiskAssessment(ckdRiskScore);

    try {
      setIsLoading(true)
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/ckd-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
          ckdRiskScore,
          riskaAssessment,
        }
      );
      setIsLoading(false)
      if (response.data.success) {
        alert("CKD assessment saved successfully!");
        handleNext?.();
      } else {
        console.error("Server responded with an error:", response.data);
        alert(
          "Failed to save CKD assessment. Please check the console for more details."
        );
      }
    } catch (error) {
      setIsLoading(false)
      console.error(
        "Error saving CKD assessment:",
        error.response?.data || error.message
      );
      alert(
        "Failed to save CKD assessment. Please check the console for more details."
      );
    }
  };

  useEffect(() => {
    if (currentFmId) {
      fetchCKDData();
    }

    // Fetch age from local storage and set ageAbove50
    const storedBirthDate = localStorage.getItem("age");
    if (storedBirthDate) {
      const age = calculateAge(storedBirthDate);
      setFormData((prevFormData) => ({
        ...prevFormData,
        ageAbove50: age > 50 ? "Yes" : "No",
      }));
    }
  }, [currentFmId, fetchCKDData]);

  const styles = {
    formSection: { marginBottom: "20px" },
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
    label: { marginBottom: "5px", fontWeight: "bold" },
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
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Known case of CKD *</label>
          <select
            name="knownCKD"
            value={formData.knownCKD}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes, on treatment">Yes, on treatment</option>
            <option value="Yes, not on treatment">Yes, not on treatment</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>History of CKD/Stone *</label>
          <select
            name="historyCKDStone"
            value={formData.historyCKDStone}
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
          <label style={styles.label}>Age Above 50 *</label>
          <select
            name="ageAbove50"
            value={formData.ageAbove50}
            onChange={handleInputChange}
            required
            style={styles.input}
            disabled
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Hypertension Patient *</label>
          <select
            name="hypertensionPatient"
            value={formData.hypertensionPatient}
            onChange={handleInputChange}
            required
            style={styles.input}
            disabled
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Diabetes Patient *</label>
          <select
            name="diabetesPatient"
            value={formData.diabetesPatient}
            onChange={handleInputChange}
            required
            style={styles.input}
            disabled
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Anemia Patient *</label>
          <select
            name="anemiaPatient"
            value={formData.anemiaPatient}
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
          <label style={styles.label}>History of Stroke *</label>
          <select
            name="historyOfStroke"
            value={formData.historyOfStroke}
            onChange={handleInputChange}
            required
            style={styles.input}
            disabled
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Swelling on Face and Leg *</label>
          <select
            name="swellingFaceLeg"
            value={formData.swellingFaceLeg}
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
          <label style={styles.label}>History of NSAIDS *</label>
          <select
            name="historyNSAIDS"
            value={formData.historyNSAIDS}
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
          <label style={styles.label}>Risk Score *</label>
          <input
            type="text"
            name="ckdRiskScore"
            value={calculateCKDRiskScore()}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Risk Assessment *</label>
          <input
            type="text"
            name="riskaAssessment"
            value={calculateRiskAssessment(calculateCKDRiskScore())}
            readOnly
            style={styles.input}
          />
        </div>
        <footer className="form-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button style={{ height: 40 }} disabled={isLoading} type="submit">
            {isLoading
              ?
              <ButtonLoader />
              :
              'Save & Next'
            }
          </button>
        </footer>
      </form>
    </div>
  );
};

export default CKDAssessment;
