import React from "react";

const HearingIssue = ({ formData, handleInputChange }) => (
  <div className="form-group">
    <select
      name="hearingIssue"
      value={formData.hearingIssue}
      onChange={(e) => handleInputChange(e)}
      required
    >
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
);

export default HearingIssue;
