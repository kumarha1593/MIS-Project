import React from "react";

const CervicalCancerAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>Cervical Cancer Assessment</h2>
    <div className="form-group">
      <label>Known case of cervical cancer *</label>
      <input
        type="text"
        name="knownCase"
        value={formData.cervicalCancer.knownCase}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>Treatment Status *</label>
      <input
        type="text"
        name="treatmentStatus"
        value={formData.cervicalCancer.treatmentStatus}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>Bleeding between periods *</label>
      <select
        name="bleedingBetweenPeriods"
        value={formData.cervicalCancer.bleedingBetweenPeriods}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Bleeding after menopause *</label>
      <select
        name="bleedingAfterMenopause"
        value={formData.cervicalCancer.bleedingAfterMenopause}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Bleeding after intercourse *</label>
      <select
        name="bleedingAfterIntercourse"
        value={formData.cervicalCancer.bleedingAfterIntercourse}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Foul smelling vaginal discharge *</label>
      <select
        name="foulSmellingDischarge"
        value={formData.cervicalCancer.foulSmellingDischarge}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Referred Center *</label>
      <input
        type="text"
        name="referredCenter"
        value={formData.cervicalCancer.referredCenter}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>VIA Date *</label>
      <input
        type="date"
        name="viaDate"
        value={formData.cervicalCancer.viaDate}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      />
    </div>
    <div className="form-group">
      <label>VIA Result *</label>
      <select
        name="viaResult"
        value={formData.cervicalCancer.viaResult}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      >
        <option value="">Select</option>
        <option value="Positive">Positive</option>
        <option value="Negative">Negative</option>
      </select>
    </div>
    <div className="form-group">
      <label>VIA Referred Center *</label>
      <input
        type="text"
        name="viaReferredCenter"
        value={formData.cervicalCancer.viaReferredCenter}
        onChange={(e) => handleInputChange(e, "cervicalCancer")}
        required
      />
    </div>
  </div>
);

export default CervicalCancerAssessment;
