import React from "react";

const PostStrokeAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>Post Stroke Assessment</h2>
    <div className="form-group">
      <label>History of Stroke *</label>
      <select
        name="historyOfStroke"
        value={formData.postStroke.historyOfStroke}
        onChange={(e) => handleInputChange(e, "postStroke")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Date of Stroke</label>
      <input
        type="date"
        name="dateOfStroke"
        value={formData.postStroke.dateOfStroke}
        onChange={(e) => handleInputChange(e, "postStroke")}
      />
    </div>
    <div className="form-group">
      <label>Present Condition *</label>
      <select
        name="presentCondition"
        value={formData.postStroke.presentCondition}
        onChange={(e) => handleInputChange(e, "postStroke")}
        required
      >
        <option value="">Select</option>
        <option value="Recovered">Recovered</option>
        <option value="Not recovered">Not recovered</option>
        <option value="Need Physiotherapy">Need Physiotherapy</option>
      </select>
    </div>
    <div className="form-group">
      <label>If positive for Stroke Symptoms, Action Taken *</label>
      <select
        name="strokeSymptomsAction"
        value={formData.postStroke.strokeSymptomsAction}
        onChange={(e) => handleInputChange(e, "postStroke")}
        required
      >
        <option value="">Select</option>
        <option value="Teleconsultation">Teleconsultation</option>
        <option value="Referral">Referral</option>
      </select>
    </div>
    <div className="form-group">
      <label>Name of the Centre Referred</label>
      <input
        type="text"
        name="referredCenter"
        value={formData.postStroke.referredCenter}
        onChange={(e) => handleInputChange(e, "postStroke")}
      />
    </div>
  </div>
);

export default PostStrokeAssessment;
