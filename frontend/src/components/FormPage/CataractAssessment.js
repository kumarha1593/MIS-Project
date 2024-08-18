import React from "react";

const CataractAssessment = ({ formData, handleInputChange }) => (
  <div className="assessment-section">
    <h3>Cataract Assessment</h3>
    <div className="form-group">
      <label>Do you have cloudy or blurred vision? *</label>
      <select
        name="cloudyVision"
        value={formData.cataract.cloudyVision}
        onChange={(e) => handleInputChange(e, "cataract")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Pain or redness in eyes lasting for more than a week *</label>
      <select
        name="eyePain"
        value={formData.cataract.eyePain}
        onChange={(e) => handleInputChange(e, "cataract")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Cataract Assessment Result *</label>
      <select
        name="cataractResult"
        value={formData.cataract.cataractResult}
        onChange={(e) => handleInputChange(e, "cataract")}
        required
      >
        <option value="">Select</option>
        <option value="1">Suspected</option>
        <option value="2">Not Suspected</option>
      </select>
    </div>
  </div>
);

export default CataractAssessment;
