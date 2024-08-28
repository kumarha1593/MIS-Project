import React from "react";
import { useEffect } from "react";
import axios from "axios";

const HealthProfileForm = ({ formData, handleInputChange, currentFmId }) => {
  const styles = {
    formSection: {
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "8px",
      width: "100%",
      boxSizing: "border-box",
      fontSize: "14px",
    },
    select: {
      padding: "8px",
      width: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "14px",
    },
    conditionalInput: {
      marginTop: "10px",
      padding: "8px",
      width: "100%",
      boxSizing: "border-box",
      fontSize: "14px",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
    },
  };

  const handleSave = async () => {
    try {
      const fm_id = localStorage.getItem("current_fm_id");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/personal-info`,
        {
          fm_id,
          name: formData.name,
          identifier: formData.identifier,
          card_number: formData.card_number,
          dob: formData.dob,
          sex: formData.sex,
          tel_no: formData.tel_no,
          address: formData.address,
          state_health_insurance: formData.state_health_insurance,
          state_health_insurance_remark: formData.state_health_insurance_remark,
          disability: formData.disability,
          disability_remark: formData.disability_remark,
        }
      );

      if (response.data.success) {
        alert("Personal information saved successfully!");
      }
    } catch (error) {
      console.error("Error saving personal information:", error);
      alert("Failed to save personal information. Please try again.");
    }
  };

  const handleVisibility = () => {
    const insuranceRemarkField = document.getElementById(
      "state_health_insurance_remark"
    );
    const disabilityRemarkField = document.getElementById("disability_remark");

    if (formData.state_health_insurance !== "yes") {
      insuranceRemarkField.style.display = "none";
    } else {
      insuranceRemarkField.style.display = "block";
    }

    if (formData.disability !== "yes") {
      disabilityRemarkField.style.display = "none";
    } else {
      disabilityRemarkField.style.display = "block";
    }
  };

  // UseEffect to set visibility based on the initial formData
  useEffect(() => {
    handleVisibility();
  }, [formData.state_health_insurance, formData.disability]);

  return (
    <div style={styles.formSection}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="identifier">
          Identifier
        </label>
        <select
          id="identifier"
          name="identifier"
          value={formData.identifier || ""}
          onChange={handleInputChange}
        >
          <option value="">Select Identifier</option>
          <option value="ABHA">ABHA ID</option>
          <option value="Aadhar">Aadhar Card</option>
          <option value="UID">UID</option>
          <option value="Voter">Voter ID</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Card Number</label>
        <input
          type="text"
          name="card_number"
          value={formData.card_number || ""}
          onChange={handleInputChange}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob || ""}
          onChange={handleInputChange}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="sex">
          Sex
        </label>
        <select
          id="sex"
          name="sex"
          value={formData.sex || ""}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Others</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Phone Number</label>
        <input
          type="tel"
          name="tel_no"
          value={formData.tel_no || ""}
          onChange={handleInputChange}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Address</label>
        <textarea
          name="address"
          value={formData.address || ""}
          onChange={handleInputChange}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="state_health_insurance">
          State Health Insurance
        </label>
        <select
          id="state_health_insurance"
          name="state_health_insurance"
          value={formData.state_health_insurance || ""}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup} id="state_health_insurance_remark">
        <label style={styles.label}>State Health Insurance Remark</label>
        <textarea
          name="state_health_insurance_remark"
          value={formData.state_health_insurance_remark || ""}
          onChange={handleInputChange}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="disability">
          Disability
        </label>
        <select
          id="disability"
          name="disability"
          value={formData.disability || ""}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup} id="disability_remark">
        <label style={styles.label}>Disability Remark</label>
        <textarea
          name="disability_remark"
          value={formData.disability_remark || ""}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSave}>Save Draft</button>
    </div>
  );
};

export default HealthProfileForm;
