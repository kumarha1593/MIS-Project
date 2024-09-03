import React, { useState, useEffect } from "react";
import axios from "axios";

const ABHAIdStatus = ({ currentFmId }) => {
  const [formData, setFormData] = useState({
    abhaIdStatus: "", // Initialize with an empty string
  });

  useEffect(() => {
    const fetchAbhaIdData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/abhaid-assessment/${currentFmId}`
        );
        if (response.data.success) {
          // Correctly map the data received from the backend to the state
          setFormData({
            abhaIdStatus: response.data.data.abhaid_status || "", // Use the exact field name from the response
          });
        }
      } catch (error) {
        console.error("Error fetching ABHA ID status:", error);
      }
    };

    if (currentFmId) {
      fetchAbhaIdData(); // Fetch data only if `currentFmId` is available
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/abhaid-assessment`,
        {
          fm_id: currentFmId,
          abhaidStatus: formData.abhaIdStatus, // Make sure this matches the backend field
        }
      );
      if (response.data.success) {
        alert("ABHA ID status saved successfully!");
      }
    } catch (error) {
      console.error("Error saving ABHA ID status:", error);
      alert("Failed to save ABHA ID status. Please try again.");
    }
  };

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
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      cursor: "pointer",
      backgroundColor: "#8BC34A",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      marginTop: "20px",
      width: "98%",
    },
  };

  return (
    <div style={styles.formSection}>
      <div style={styles.formGroup}>
        <label style={styles.label}>ABHA ID Status</label>
        <select
          name="abhaIdStatus"
          value={formData.abhaIdStatus} // Ensure this is correctly mapped to the state
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Created">Created</option>
          <option value="Linked">Linked</option>
          <option value="None">None</option>
        </select>
      </div>
      <button type="button" onClick={handleSave} style={styles.button}>
        Save Draft
      </button>
    </div>
  );
};

export default ABHAIdStatus;
