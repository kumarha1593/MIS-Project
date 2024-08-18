import React from "react";

const DMAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>DM (Diabetes Mellitus) Assessment</h2>
    <div className="form-group">
      <label>Known case of DM *</label>
      <select
        name="knownDM"
        value={formData.knownDM}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Random Blood Sugar (mg/dL) *</label>
      <input
        type="number"
        name="rbs"
        value={formData.rbs}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Action for high BS *</label>
      <select
        name="highBSAction"
        value={formData.highBSAction}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="medication">Medication</option>
        <option value="referral">Referral</option>
      </select>
    </div>
    <div className="form-group">
      <label>Referred Centre for DM *</label>
      <input
        type="text"
        name="referredCentreDM"
        value={formData.referredCentreDM}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Fasting Blood Sugar (mg/dL) *</label>
      <input
        type="number"
        name="fasting"
        value={formData.fasting}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Post Prandial Blood Sugar (mg/dL) *</label>
      <input
        type="number"
        name="pp"
        value={formData.pp}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Random Blood Sugar (mg/dL) *</label>
      <input
        type="number"
        name="random"
        value={formData.random}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>DM Confirmed Date *</label>
      <input
        type="date"
        name="dmConfirmed"
        value={formData.dmConfirmed}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
);

export default DMAssessment;
