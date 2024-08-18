import React from "react";

const ABHAIdStatus = ({ formData, handleInputChange }) => (
  <div className="form-group">
    <label>ABHA ID Status</label>
    <select
      name="abhaIdStatus"
      value={formData.abhaIdStatus}
      onChange={handleInputChange}
      required
    >
      <option value="">Select</option>
      <option value="1">Created</option>
      <option value="2">Linked</option>
      <option value="3">None</option>
    </select>
  </div>
);

export default ABHAIdStatus;
