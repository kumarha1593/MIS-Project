import React from "react";

const CKDAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>Chronic Kidney Disease (CKD) Assessment</h2>
    <div className="form-group">
      <label>Known case of CKD *</label>
      <select
        name="knownCKD"
        value={formData.ckd.knownCKD}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes, on treatment">Yes, on treatment</option>
        <option value="Yes, not on treatment">Yes, not on treatment</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>History of CKD/Stone *</label>
      <select
        name="historyCKDStone"
        value={formData.ckd.historyCKDStone}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Age (Above 50) *</label>
      <input
        type="number"
        name="age"
        value={formData.ckd.age}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      />
    </div>
    <div className="form-group">
      <label>Hypertension Patient *</label>
      <select
        name="hypertensionPatient"
        value={formData.ckd.hypertensionPatient}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Diabetes Patient *</label>
      <select
        name="diabetesPatient"
        value={formData.ckd.diabetesPatient}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Swelling on Face and Leg *</label>
      <select
        name="swellingFaceLeg"
        value={formData.ckd.swellingFaceLeg}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>History of NSAIDS/Over the Counter Drug *</label>
      <select
        name="historyNSAIDS"
        value={formData.ckd.historyNSAIDS}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Risk Assessment *</label>
      <select
        name="ckdRiskAssessment"
        value={formData.ckd.ckdRiskAssessment}
        onChange={(e) => handleInputChange(e, "ckd")}
        required
      >
        <option value="">Select</option>
        <option value="1">Risk</option>
        <option value="2">No Risk</option>
      </select>
    </div>
  </div>
);

export default CKDAssessment;
