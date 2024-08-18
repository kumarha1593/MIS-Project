import React from "react";

const LeprosyAssessment = ({ formData, handleInputChange }) => (
  <div className="assessment-section">
    <h3>Leprosy Assessment</h3>
    <div className="form-group">
      <label>
        Hypopigmented or discolored lesion(s) with loss of sensation *
      </label>
      <select
        name="lesionSensationLoss"
        value={formData.leprosy.lesionSensationLoss}
        onChange={(e) => handleInputChange(e, "leprosy")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Recurrent ulceration on palm or sole *</label>
      <select
        name="ulceration"
        value={formData.leprosy.ulceration}
        onChange={(e) => handleInputChange(e, "leprosy")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Clawing of fingers or tingling/numbness in hands/feet *</label>
      <select
        name="clawingFingers"
        value={formData.leprosy.clawingFingers}
        onChange={(e) => handleInputChange(e, "leprosy")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Inability to close eyelid *</label>
      <select
        name="inabilityToCloseEyelid"
        value={formData.leprosy.inabilityToCloseEyelid}
        onChange={(e) => handleInputChange(e, "leprosy")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Difficulty in holding objects or weakness in feet *</label>
      <select
        name="weaknessFeet"
        value={formData.leprosy.weaknessFeet}
        onChange={(e) => handleInputChange(e, "leprosy")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  </div>
);

export default LeprosyAssessment;
