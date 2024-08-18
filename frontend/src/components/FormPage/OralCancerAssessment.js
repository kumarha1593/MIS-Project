import React from "react";

const OralCancerAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>Oral Cancer Assessment</h2>
    <div className="form-group">
      <label>Known case of Oral cancer *</label>
      <input
        type="text"
        name="knownCase"
        value={formData.oralCancer.knownCase}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>Treatment Status *</label>
      <input
        type="text"
        name="treatmentStatus"
        value={formData.oralCancer.treatmentStatus}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>Difficulty in opening mouth *</label>
      <select
        name="difficultyOpeningMouth"
        value={formData.oralCancer.difficultyOpeningMouth}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Ulcers in mouth *</label>
      <select
        name="ulcersInMouth"
        value={formData.oralCancer.ulcersInMouth}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Growth in mouth *</label>
      <select
        name="growthInMouth"
        value={formData.oralCancer.growthInMouth}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Sudden voice change *</label>
      <select
        name="suddenVoiceChange"
        value={formData.oralCancer.suddenVoiceChange}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>White/red patch in mouth *</label>
      <select
        name="whiteRedPatch"
        value={formData.oralCancer.whiteRedPatch}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>White/red patch that has not healed for 14 days *</label>
      <select
        name="whiteRedPatchNotHealed"
        value={formData.oralCancer.whiteRedPatchNotHealed}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Pain while chewing *</label>
      <select
        name="painWhileChewing"
        value={formData.oralCancer.painWhileChewing}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Suspected for oral cancer *</label>
      <select
        name="suspectedOralCancer"
        value={formData.oralCancer.suspectedOralCancer}
        onChange={(e) => handleInputChange(e, "oralCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  </div>
);

export default OralCancerAssessment;
