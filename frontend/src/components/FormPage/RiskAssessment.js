import React from "react";

const RiskAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>Risk Assessment</h2>
    <div className="form-group">
      <label>Age *</label>
      <select
        name="age"
        value={formData.age}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="0">30-39 years</option>
        <option value="1">40-49 years</option>
        <option value="2">50-59 years</option>
        <option value="3">60 years or above</option>
      </select>
    </div>
    <div className="form-group">
      <label>Tobacco Use *</label>
      <select
        name="tobacco"
        value={formData.tobacco}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="0">Never</option>
        <option value="1">Used to consume in the past/ Sometimes now</option>
        <option value="2">Daily</option>
      </select>
    </div>
    <div className="form-group">
      <label>Alcohol Consumption *</label>
      <select
        name="alcohol"
        value={formData.alcohol}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>
    </div>
    <div className="form-group">
      <label>Waist Circumference (Female) *</label>
      <select
        name="waistFemale"
        value={formData.waistFemale}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="0">80 cm or less</option>
        <option value="1">81-90 cm</option>
        <option value="2">More than 90 cm</option>
      </select>
    </div>
    <div className="form-group">
      <label>Waist Circumference (Male) *</label>
      <select
        name="waistMale"
        value={formData.waistMale}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="0">90 cm or less</option>
        <option value="1">91-100 cm</option>
        <option value="2">More than 100 cm</option>
      </select>
    </div>
    <div className="form-group">
      <label>Physical Activity *</label>
      <select
        name="physicalActivity"
        value={formData.physicalActivity}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="0">At least 150 minutes in a week</option>
        <option value="1">Less than 150 minutes in a week</option>
      </select>
    </div>
    <div className="form-group">
      <label>Family History of Diabetes *</label>
      <select
        name="familyHistory"
        value={formData.familyHistory}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>
    </div>
    <div className="form-group">
      <label>Risk Score *</label>
      <input
        type="number"
        name="riskScore"
        value={formData.riskScore}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
);

export default RiskAssessment;
