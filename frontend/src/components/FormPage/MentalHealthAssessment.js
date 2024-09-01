import React, { useState, useEffect } from "react";
import axios from "axios";

const MentalHealthAssessment = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    littleInterestOrPleasure: "",
    feelingDownOrDepressed: "",
    mentalHealthProblem: "",
    historyOfFits: "",
    otherMentalDisorder: "",
    briefIntervention: "",
    interventionType: "",
  });

  const [mentalHealthScore, setMentalHealthScore] = useState(0);

  useEffect(() => {
    const fetchMentalHealthData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/mental-health-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;

          setFormData({
            littleInterestOrPleasure: data.little_interest_or_pleasure || "",
            feelingDownOrDepressed: data.feeling_down_or_depressed || "",
            mentalHealthProblem: data.mental_health_problem || "",
            historyOfFits: data.history_of_fits || "",
            otherMentalDisorder: data.other_mental_disorder || "",
            briefIntervention: data.brief_intervention_given || "", // Updated to match schema
            interventionType: data.intervention_type || "",
          });

          const score =
            (parseInt(data.little_interest_or_pleasure) || 0) +
            (parseInt(data.feeling_down_or_depressed) || 0);
          setMentalHealthScore(score);
        }
      } catch (error) {
        console.error("Error fetching mental health assessment:", error);
      }
    };

    if (currentFmId) {
      fetchMentalHealthData();
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (
      name === "littleInterestOrPleasure" ||
      name === "feelingDownOrDepressed"
    ) {
      const newScore =
        (name === "littleInterestOrPleasure"
          ? parseInt(value || 0)
          : parseInt(formData.littleInterestOrPleasure || 0)) +
        (name === "feelingDownOrDepressed"
          ? parseInt(value || 0)
          : parseInt(formData.feelingDownOrDepressed || 0));
      setMentalHealthScore(newScore);
    }
  };

  const handleSave = async () => {
    console.log("Data being sent to backend:", {
      fm_id: currentFmId,
      little_interest_or_pleasure: formData.littleInterestOrPleasure,
      feeling_down_or_depressed: formData.feelingDownOrDepressed,
      mental_health_score: mentalHealthScore,
      mental_health_problem: formData.mentalHealthProblem,
      history_of_fits: formData.historyOfFits,
      other_mental_disorder: formData.otherMentalDisorder,
      brief_intervention_given: formData.briefIntervention,
      intervention_type: formData.interventionType,
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/mental-health-assessment`,
        {
          fm_id: currentFmId,
          little_interest_or_pleasure: formData.littleInterestOrPleasure,
          feeling_down_or_depressed: formData.feelingDownOrDepressed,
          mental_health_score: mentalHealthScore,
          mental_health_problem: formData.mentalHealthProblem,
          history_of_fits: formData.historyOfFits,
          other_mental_disorder: formData.otherMentalDisorder,
          brief_intervention_given: formData.briefIntervention,
          intervention_type: formData.interventionType,
        }
      );
      if (response.data.success) {
        alert("Mental health assessment saved successfully!");
      } else {
        console.error("Server responded with an error:", response.data);
        alert("Failed to save Mental Health assessment. Please try again.");
      }
    } catch (error) {
      console.error("Error saving mental health assessment:", error);
      alert("Failed to save mental health assessment. Please try again.");
    }
  };

  const styles = {
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
      fontSize: "14px",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
    },
    warning: {
      color: "red",
      fontWeight: "bold",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.formGroup}>
      <p>
        Over the last 2 weeks, how often have you been bothered by the following
        problems? (Anyone with total score greater than 3 from below given
        questions, refer to CHO/MO)
      </p>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Little interest or pleasure in doing things? *
        </label>
        <select
          name="littleInterestOrPleasure"
          value={formData.littleInterestOrPleasure || ""}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="0">Not at all</option>
          <option value="1">Several days</option>
          <option value="2">More than half the day</option>
          <option value="3">Nearly every day</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Feeling down, depressed, or hopeless? *
        </label>
        <select
          name="feelingDownOrDepressed"
          value={formData.feelingDownOrDepressed || ""}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="0">Not at all</option>
          <option value="1">Several days</option>
          <option value="2">More than half the day</option>
          <option value="3">Nearly every day</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Mental Health Score:</label>
        <input
          type="text"
          value={mentalHealthScore}
          readOnly
          style={styles.input}
        />
        {mentalHealthScore > 3 && (
          <p style={styles.warning}>
            Score is greater than 3. Please refer to CHO/MO.
          </p>
        )}
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Mental Health problem detected through the questionnaire *
        </label>
        <select
          name="mentalHealthProblem"
          value={formData.mentalHealthProblem || ""}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="Depression">Depression</option>
          <option value="Alcohol dependence">Alcohol dependence</option>
          <option value="Common Mental Health">Common Mental Health</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>History of fits *</label>
        <select
          name="historyOfFits"
          value={formData.historyOfFits || ""}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Other mental disorder *</label>
        <select
          name="otherMentalDisorder"
          value={formData.otherMentalDisorder || ""}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Brief intervention given? *</label>
        <select
          name="mentalHealthProblemDetected"
          value={formData.mentalHealthProblemDetected || ""}
          onChange={handleInputChange}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {formData.mentalHealthProblemDetected === "Yes" && (
        <div style={styles.formGroup}>
          <label style={styles.label}>
            If detected, Brief intervention given *
          </label>
          <select
            name="briefIntervention"
            value={formData.briefIntervention || ""}
            onChange={handleInputChange}
            required
            style={styles.select}
          >
            <option value="">Select</option>
            <option value="Counselling">Counselling</option>
            <option value="Dispensing of medication">
              Dispensing of medication
            </option>
            <option value="Psycho-education">Psycho-education</option>
            <option value="Others">Others</option>
          </select>
        </div>
      )}

      <button type="button" onClick={handleSave}>
        Save Draft
      </button>
    </div>
  );
};

export default MentalHealthAssessment;
