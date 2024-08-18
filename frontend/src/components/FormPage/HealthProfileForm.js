import React from "react";

const HealthProfileForm = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>Patient Name *</label>
      <input
        type="text"
        name="patientName"
        value={formData.patientName}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Identifier *</label>
      <input
        type="text"
        name="identifier"
        value={formData.identifier}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Card Number *</label>
      <input
        type="text"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Date of Birth *</label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Sex *</label>
      <select
        name="sex"
        value={formData.sex}
        onChange={handleInputChange}
        required
      >
        <option value="">Select</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="O">Other</option>
      </select>
    </div>
    <div className="form-group">
      <label>Phone *</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Address *</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Insurance *</label>
      <input
        type="text"
        name="insurance"
        value={formData.insurance}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Disability *</label>
      <input
        type="text"
        name="disability"
        value={formData.disability}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
);

export default HealthProfileForm;
