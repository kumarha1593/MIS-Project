import React from "react";

const MentalHealthAssessment = ({ formData, handleInputChange }) => {
  // Function to calculate the total mental health score
  const calculateMentalHealthScore = () => {
    return (
      parseInt(formData.mentalHealth.interestPleasure || 0) +
      parseInt(formData.mentalHealth.feelingDown || 0)
    );
  };

  const mentalHealthScore = calculateMentalHealthScore();

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
          name="interestPleasure"
          value={formData.mentalHealth.interestPleasure}
          onChange={(e) => handleInputChange(e, "mentalHealth")}
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
          Feeling down, depressed or hopeless? *
        </label>
        <select
          name="feelingDown"
          value={formData.mentalHealth.feelingDown}
          onChange={(e) => handleInputChange(e, "mentalHealth")}
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
          Mental Health problem detected through questionnaire *
        </label>
        <select
          name="mentalHealthProblem"
          value={formData.mentalHealth.mentalHealthProblem}
          onChange={(e) => handleInputChange(e, "mentalHealth")}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="1">Depression</option>
          <option value="2">Alcohol Dependence</option>
          <option value="3">Common Mental Health</option>
          <option value="4">No</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>History of fits *</label>
        <select
          name="historyOfFits"
          value={formData.mentalHealth.historyOfFits}
          onChange={(e) => handleInputChange(e, "mentalHealth")}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          If detected, Brief intervention given *
        </label>
        <select
          name="briefInterventionGiven"
          value={formData.mentalHealth.briefInterventionGiven}
          onChange={(e) => handleInputChange(e, "mentalHealth")}
          required
          style={styles.select}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      {formData.mentalHealth.briefInterventionGiven === "Yes" && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Type of intervention *</label>
          <select
            name="interventionType"
            value={formData.mentalHealth.interventionType}
            onChange={(e) => handleInputChange(e, "mentalHealth")}
            required
            style={styles.select}
          >
            <option value="">Select</option>
            <option value="1">Counselling</option>
            <option value="2">Dispensing of medication</option>
            <option value="3">Psycho-education</option>
            <option value="4">Others</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default MentalHealthAssessment;
