import React, { useState, useEffect } from "react";
import axios from "axios";

const PostStrokeAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    history_of_stroke: "",
    date_of_stroke: "",
    present_condition: "",
    stroke_symptoms_action: "",
    referral_center: "",
  });

  const [showStrokeDetails, setShowStrokeDetails] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  useEffect(() => {
    const fetchPostStrokeData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/post-stroke-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;

          // Format the date to "yyyy-MM-dd"
          if (data.date_of_stroke) {
            data.date_of_stroke = new Date(data.date_of_stroke)
              .toISOString()
              .split("T")[0];
          }

          setFormData(data);

          if (data.history_of_stroke === "yes") {
            setShowStrokeDetails(true);
            if (data.stroke_symptoms_action === "referral") {
              setShowReferralField(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post-stroke assessment:", error);
      }
    };

    if (currentFmId) {
      fetchPostStrokeData();
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "history_of_stroke") {
      setShowStrokeDetails(value === "yes");
      if (value !== "yes") {
        setShowReferralField(false);
      }
    }

    if (name === "stroke_symptoms_action") {
      setShowReferralField(value === "referral");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/post-stroke-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      if (response.data.success) {
        alert("Post-stroke assessment saved successfully!");
      }
    } catch (error) {
      console.error("Error saving post-stroke assessment:", error);
      alert("Failed to save post-stroke assessment. Please try again.");
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
        <label style={styles.label}>History of Stroke *</label>
        <select
          id="history_of_stroke"
          name="history_of_stroke"
          value={formData.history_of_stroke || ""}
          onChange={handleInputChange}
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {showStrokeDetails && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Stroke *</label>
            <input
              type="date"
              id="date_of_stroke"
              name="date_of_stroke"
              value={formData.date_of_stroke || ""}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Present Condition *</label>
            <select
              id="present_condition"
              name="present_condition"
              value={formData.present_condition || ""}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="recovered">Recovered</option>
              <option value="not_recovered">Not recovered</option>
              <option value="need_physiotherapy">Need Physiotherapy</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Action for Stroke Symptoms *</label>
            <select
              id="stroke_symptoms_action"
              name="stroke_symptoms_action"
              value={formData.stroke_symptoms_action || ""}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="referral">Referral</option>
              <option value="teleconsultation">Teleconsultation</option>
            </select>
          </div>

          {showReferralField && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Referred Centre for Stroke *</label>
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
        </>
      )}
      <button type="button" onClick={handleSave}>
        Save Draft
      </button>
    </div>
  );
};

export default PostStrokeAssessment;
