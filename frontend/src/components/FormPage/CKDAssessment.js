import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CKDAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    knownCKD: "",
    historyCKDStone: "",
    ageAbove50: "",
    hypertensionPatient: "",
    diabetesPatient: "",
    anemiaPatient: "",
    historyOfStroke: "",
    swellingFaceLeg: "",
    historyNSAIDS: "",
    ckdRiskScore: 0,
    riskaAssessment: "",
  });

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

  const handleSubmit = async () => {
    const ckdRiskScore = calculateCKDRiskScore();
    const riskaAssessment = calculateRiskAssessment(ckdRiskScore);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/ckd-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
          ckdRiskScore,
          riskaAssessment,
        }
      );

      if (response.data.success) {
        alert("CKD assessment saved successfully!");
      } else {
        console.error("Server responded with an error:", response.data);
        alert(
          "Failed to save CKD assessment. Please check the console for more details."
        );
      }
    } catch (error) {
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
      <button type="button" onClick={handleSubmit} style={styles.button}>
        Save CKD Assessment
      </button>
    </div>
  );
};

export default CKDAssessment;
