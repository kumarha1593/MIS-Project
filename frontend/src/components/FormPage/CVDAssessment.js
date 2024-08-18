import React from "react";

const CVDAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>Cardiovascular Disease (CVD) Assessment</h2>
    <div className="form-group">
      <label>Known case of Heart disease *</label>
      <select
        name="knownHeartDisease"
        value={formData.cvd.knownHeartDisease}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Heart Sound *</label>
      <select
        name="heartSound"
        value={formData.cvd.heartSound}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      >
        <option value="">Select</option>
        <option value="1">Normal</option>
        <option value="2">Abnormal</option>
      </select>
    </div>
    <div className="form-group">
      <label>Abnormal Heart Sound Action *</label>
      <input
        type="text"
        name="abnormalHeartSound"
        value={formData.cvd.abnormalHeartSound}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      />
    </div>
    <div className="form-group">
      <label>Heart disease symptom *</label>
      <select
        name="heartDiseaseSymptom"
        value={formData.cvd.heartDiseaseSymptom}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Teleconsultation done *</label>
      <select
        name="teleconsultationDone"
        value={formData.cvd.teleconsultationDone}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Referral done *</label>
      <select
        name="referralDone"
        value={formData.cvd.referralDone}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Name of the centre referred *</label>
      <input
        type="text"
        name="referredCenter"
        value={formData.cvd.referredCenter}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      />
    </div>
    <div className="form-group">
      <label>Heart disease confirmed *</label>
      <select
        name="heartDiseaseConfirmed"
        value={formData.cvd.heartDiseaseConfirmed}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Suspected for heart disease *</label>
      <select
        name="suspectedHeartDisease"
        value={formData.cvd.suspectedHeartDisease}
        onChange={(e) => handleInputChange(e, "cvd")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  </div>
);

export default CVDAssessment;
