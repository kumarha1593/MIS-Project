import React from "react";

const HTNAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>Known case of HTN *</label>
      <select
        name="knownHTN"
        value={formData.knownHTN}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Blood Pressure (mmHg) *</label>
      <input
        type="text"
        name="bp"
        value={formData.bp}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Action for high BP *</label>
      <select
        name="highBPAction"
        value={formData.highBPAction}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="medication">Medication</option>
        <option value="referral">Referral</option>
      </select>
    </div>
    <div className="form-group">
      <label>Referred Centre for HTN *</label>
      <input
        type="text"
        name="referredCentreHTN"
        value={formData.referredCentreHTN}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>HTN Confirmed Date *</label>
      <input
        type="date"
        name="htnConfirmed"
        value={formData.htnConfirmed}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
);

export default HTNAssessment;
