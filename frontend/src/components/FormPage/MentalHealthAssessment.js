import React from "react";

const MentalHealthAssessment = ({ formData, handleInputChange }) => (
  <div className="assessment-section">
    <h3>Mental Health Assessment</h3>
    <div className="form-group">
      <label>Little interest or pleasure in doing things? *</label>
      <select
        name="interestPleasure"
        value={formData.mentalHealth.interestPleasure}
        onChange={(e) => handleInputChange(e, "mentalHealth")}
        required
      >
        <option value="">Select</option>
        <option value="0">Not at all</option>
        <option value="1">Several days</option>
        <option value="2">More than half the day</option>
        <option value="3">Nearly every day</option>
      </select>
    </div>
    <div className="form-group">
      <label>Feeling down, depressed or hopeless? *</label>
      <select
        name="feelingDown"
        value={formData.mentalHealth.feelingDown}
        onChange={(e) => handleInputChange(e, "mentalHealth")}
        required
      >
        <option value="">Select</option>
        <option value="0">Not at all</option>
        <option value="1">Several days</option>
        <option value="2">More than half the day</option>
        <option value="3">Nearly every day</option>
      </select>
    </div>
    <div className="form-group">
      <label>History of fits *</label>
      <select
        name="historyOfFits"
        value={formData.mentalHealth.historyOfFits}
        onChange={(e) => handleInputChange(e, "mentalHealth")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Mental Health problem detected through questionnaire *</label>
      <select
        name="mentalHealthProblem"
        value={formData.mentalHealth.mentalHealthProblem}
        onChange={(e) => handleInputChange(e, "mentalHealth")}
        required
      >
        <option value="">Select</option>
        <option value="1">Depression</option>
        <option value="2">Alcohol Dependence</option>
        <option value="3">Common Mental Health</option>
        <option value="4">None</option>
      </select>
    </div>
    <div className="form-group">
      <label>If detected, brief intervention given *</label>
      <select
        name="mentalHealthIntervention"
        value={formData.mentalHealth.mentalHealthIntervention}
        onChange={(e) => handleInputChange(e, "mentalHealth")}
        required
      >
        <option value="">Select</option>
        <option value="1">Counseling</option>
        <option value="2">Dispensing of medication</option>
        <option value="3">Psycho-education</option>
        <option value="4">Others</option>
      </select>
    </div>
  </div>
);

export default MentalHealthAssessment;
