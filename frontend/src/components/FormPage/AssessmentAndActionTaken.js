import React from "react";

const AssessmentAndActionTaken = ({ formData, handleInputChange }) => (
  <div className="form-group">
    <h3>Assessment and Action Taken</h3>

    {/* Assessment and Action Taken */}
    <div>
      <label>Assessment and Action Taken</label>
      <textarea
        name="assessmentAction"
        value={formData.assessmentAction}
        onChange={handleInputChange}
        placeholder="Enter assessment and action taken"
        rows="3"
        required
      ></textarea>
    </div>

    {/* Major NCD Detected */}
    <div>
      <label>Major NCD Detected</label>
      <select
        name="majorNCDDetected"
        value={formData.majorNCDDetected}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="1">HTN</option>
        <option value="2">DM</option>
        <option value="3">CVD</option>
        <option value="4">COPD</option>
        <option value="5">Oral CA</option>
        <option value="6">Breast CA</option>
        <option value="7">Cx CA</option>
        <option value="8">Post Stroke</option>
        <option value="9">Mental Health Problem</option>
        <option value="10">CKD</option>
        <option value="11">TB</option>
        <option value="12">Cataract</option>
      </select>
    </div>

    {/* Other Disease Detected */}
    <div>
      <label>Any Other Disease Detected</label>
      <textarea
        name="otherDiseaseDetected"
        value={formData.otherDiseaseDetected}
        onChange={handleInputChange}
        placeholder="Specify any other disease detected"
        rows="2"
      ></textarea>
    </div>

    {/* Known Case of DM with HTN */}
    <div>
      <label>Known Case of DM with HTN</label>
      <select
        name="knownCaseDMWithHTN"
        value={formData.knownCaseDMWithHTN}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="1">Yes</option>
        <option value="2">No</option>
      </select>
    </div>

    {/* Telemedicine */}
    <div>
      <label>Telemedicine</label>
      <select
        name="telemedicine"
        value={formData.telemedicine}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>

    {/* Medicine Distributed */}
    <div>
      <label>Medicine Distributed</label>
      <select
        name="medicineDistributed"
        value={formData.medicineDistributed}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>

    {/* Other Advices */}
    <div>
      <label>Other Advices</label>
      <textarea
        name="otherAdvices"
        value={formData.otherAdvices}
        onChange={handleInputChange}
        placeholder="Enter any other advices"
        rows="3"
      ></textarea>
    </div>

    {/* Remarks */}
    <div>
      <label>Remarks</label>
      <textarea
        name="remarks"
        value={formData.remarks}
        onChange={handleInputChange}
        placeholder="Enter remarks (e.g., referral status, other health observations)"
        rows="3"
      ></textarea>
    </div>
  </div>
);

export default AssessmentAndActionTaken;
