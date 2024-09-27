import React, { useState, useEffect } from "react";
import axios from "axios";

const DMAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    case_of_dm: "",
    fasting_blood_sugar: "",
    post_prandial_blood_sugar: "",
    random_blood_sugar: "",
    action_high_bs: "",
    referral_center: "",
  });

  const [showHighBSOptions, setShowHighBSOptions] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    const fetchDmData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/dm-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;
          setFormData(data);
          checkHighBloodSugar(data);
        }
      } catch (error) {
        console.error("Error fetching DM assessment:", error);
      }
    };

    if (currentFmId) {
      fetchDmData();
    }
  }, [currentFmId]);

  const checkHighBloodSugar = (data) => {
    const fasting = parseFloat(data.fasting_blood_sugar);
    const postPrandial = parseFloat(data.post_prandial_blood_sugar);
    const random = parseFloat(data.random_blood_sugar);

    const isHighBS =
      (!isNaN(fasting) && fasting >= 126) ||
      (!isNaN(postPrandial) && postPrandial >= 200) ||
      (!isNaN(random) && random > 140);

    setShowHighBSOptions(isHighBS);
    setShowReferralField(data.action_high_bs === "referral");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    if (
      name === "fasting_blood_sugar" ||
      name === "post_prandial_blood_sugar" ||
      name === "random_blood_sugar"
    ) {
      checkHighBloodSugar(updatedFormData);
    }

    if (name === "action_high_bs") {
      setShowReferralField(value === "referral");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/dm-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("DM assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving DM assessment:", error);
      alert("Failed to save DM assessment. Please try again.");
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
        <label style={styles.label}>Known case of DM *</label>
        <select
          id="case_of_dm"
          name="case_of_dm"
          value={formData.case_of_dm || ""}
          onChange={handleInputChange}
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="yes and on treatment">Yes and on Treatment</option>
          <option value="yes and not on treatment">
            Yes and Not on Treatment
          </option>
          <option value="No">No</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Fasting Blood Sugar (mg/dL)</label>
        <input
          type="number"
          id="fasting_blood_sugar"
          name="fasting_blood_sugar"
          value={formData.fasting_blood_sugar || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Post Prandial Blood Sugar (mg/dL)</label>
        <input
          type="number"
          id="post_prandial_blood_sugar"
          name="post_prandial_blood_sugar"
          value={formData.post_prandial_blood_sugar || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Random Blood Sugar (mg/dL)</label>
        <input
          type="number"
          id="random_blood_sugar"
          name="random_blood_sugar"
          value={formData.random_blood_sugar || ""}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      {showHighBSOptions && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Action for High Blood Sugar *</label>
          <select
            id="action_high_bs"
            name="action_high_bs"
            value={formData.action_high_bs || ""}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="referral">Referral</option>
            <option value="teleconsultation">Teleconsultation</option>
          </select>
        </div>
      )}

      {showReferralField && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Referred Centre for DM *</label>
          <input
            type="text"
            id="referral_center"
            name="referral_center"
            value={formData.referral_center || ""}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
      )}

      <button type="button" onClick={handleSave} style={styles.button}>
        Save Draft
      </button>
    </div>
  );
};

export default DMAssessment;
