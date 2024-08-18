import React from 'react';

const BreastCancerAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>Breast Cancer Assessment</h2>
    <div className="form-group">
      <label>Known case of Breast cancer *</label>
      <input
        type="text"
        name="knownCase"
        value={formData.breastCancer.knownCase}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>Treatment Status *</label>
      <input
        type="text"
        name="treatmentStatus"
        value={formData.breastCancer.treatmentStatus}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>Lump in the breast *</label>
      <select
        name="lumpInBreast"
        value={formData.breastCancer.lumpInBreast}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Blood stained discharge from the nipple *</label>
      <select
        name="bloodStainedDischarge"
        value={formData.breastCancer.bloodStainedDischarge}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Change in shape and size of breast *</label>
      <select
        name="changeInShape"
        value={formData.breastCancer.changeInShape}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Constant pain in breast *</label>
      <select
        name="constantPain"
        value={formData.breastCancer.constantPain}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Redness of skin *</label>
      <select
        name="rednessOfSkin"
        value={formData.breastCancer.rednessOfSkin}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Suspected for breast cancer *</label>
      <select
        name="suspectedBreastCancer"
        value={formData.breastCancer.suspectedBreastCancer}
        onChange={(e) => handleInputChange(e, "breastCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  </div>
);

export default BreastCancerAssessment;