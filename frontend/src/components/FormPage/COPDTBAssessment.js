import React from "react";

const COPDTBAssessment = ({ formData, handleInputChange }) => (
  <div className="form-section">
    <h2>COPD/TB Assessment</h2>
    <div className="form-group">
      <label>Known case of Chronic Respiratory Diseases *</label>
      <select
        name="knownRespiratoryDisease"
        value={formData.copdTb.knownRespiratoryDisease}
        onChange={(e) => handleInputChange(e, "copdTb")}
        required
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
    <div className="form-group">
      <label>Specify Respiratory Disease</label>
      <input
        type="text"
        name="respiratoryDisease"
        value={formData.copdTb.respiratoryDisease}
        onChange={(e) => handleInputChange(e, "copdTb")}
      />
    </div>
    <div className="form-group">
      <label>Occupational Exposure *</label>
      <select
        name="occupationalExposure"
        value={formData.copdTb.occupationalExposure}
        onChange={(e) => handleInputChange(e, "copdTb")}
        required
      >
        <option value="">Select</option>
        <option value="1">Crop residue burning</option>
        <option value="2">Burning of garbage</option>
        <option value="3">Industrial exposure (smoke, gas, dust)</option>
      </select>
    </div>
    <div className="form-group">
      <label>Type of Fuel Used for Cooking *</label>
      <select
        name="fuelForCooking"
        value={formData.copdTb.fuelForCooking}
        onChange={(e) => handleInputChange(e, "copdTb")}
        required
      >
        <option value="">Select</option>
        <option value="1">Firewood</option>
        <option value="2">Crop Residue</option>
        <option value="3">Cow dung cake</option>
        <option value="4">Coal</option>
        <option value="5">Kerosene</option>
        <option value="6">LPG</option>
      </select>
    </div>
    <div className="form-group">
      <label>Chest Sound *</label>
      <select
        name="chestSound"
        value={formData.copdTb.chestSound}
        onChange={(e) => handleInputChange(e, "copdTb")}
        required
      >
        <option value="">Select</option>
        <option value="1">Wheezing</option>
        <option value="2">Crepitation</option>
        <option value="3">Normal</option>
      </select>
    </div>
    <div className="form-group">
      <label>If positive for symptoms, Action Taken *</label>
      <select
        name="respiratorySymptomsAction"
        value={formData.copdTb.respiratorySymptomsAction}
        onChange={(e) => handleInputChange(e, "copdTb")}
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
        value={formData.copdTb.referredCenter}
        onChange={(e) => handleInputChange(e, "copdTb")}
      />
    </div>
  </div>
);

export default COPDTBAssessment;
