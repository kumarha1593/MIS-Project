import React from "react";

const ElderlyAssessment = ({ formData, handleInputChange }) => (
  <div className="assessment-section">
    <h3>Elderly Assessment</h3>
    <div className="form-group">
      <label>Do you feel unsteady while standing or walking? *</label>
      <select
        name="unsteadyWalking"
        value={formData.elderly.unsteadyWalking}
        onChange={(e) => handleInputChange(e, "elderly")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Are you suffering from any physical disability? *</label>
      <select
        name="physicalDisability"
        value={formData.elderly.physicalDisability}
        onChange={(e) => handleInputChange(e, "elderly")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Do you need help with everyday activities? *</label>
      <select
        name="helpNeeded"
        value={formData.elderly.helpNeeded}
        onChange={(e) => handleInputChange(e, "elderly")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Do you forget names of near ones or your address? *</label>
      <select
        name="forgetNames"
        value={formData.elderly.forgetNames}
        onChange={(e) => handleInputChange(e, "elderly")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  </div>
);

export default ElderlyAssessment;
