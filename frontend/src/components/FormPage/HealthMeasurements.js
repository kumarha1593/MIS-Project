import React from "react";

const HealthMeasurements = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>Height (cm) *</label>
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Weight (kg) *</label>
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>BMI *</label>
      <input
        type="number"
        name="bmi"
        value={formData.bmi}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Temperature (°C) *</label>
      <input
        type="number"
        name="temp"
        value={formData.temp}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>SpO2 (%) *</label>
      <input
        type="number"
        name="spo2"
        value={formData.spo2}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
);

export default HealthMeasurements;
