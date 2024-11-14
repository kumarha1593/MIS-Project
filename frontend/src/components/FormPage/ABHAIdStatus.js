import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const ABHAIdStatus = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    abhaIdStatus: "",
    screeningDate: "",
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

    const fetchScreeningDate = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/family-member-date/${currentFmId}`
        );
        if (response.data.success) {
          const dateStr = response.data.data.date;
          if (dateStr) {
            setFormData((prevState) => ({
              ...prevState,
              screeningDate: dateStr,
            }));
          }
          // If dateStr is null or empty, do not update screeningDate
        }
      } catch (error) {
        console.error("Error fetching Screening Date:", error);
      }
    };

    if (currentFmId) {
      fetchAbhaIdData();
      fetchScreeningDate();
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      // Save ABHA ID status
      const abhaResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/abhaid-assessment`,
        {
          fm_id: currentFmId,
          abhaidStatus: formData.abhaIdStatus,
        }
      );

      let dateResponse = { data: { success: true } }; // Default response
      // Save Screening Date only if it's not empty
      if (formData.screeningDate && formData.screeningDate.trim() !== "") {
        dateResponse = await axios.post(
          `${process.env.REACT_APP_BASE_URL}api/family-member-date/${currentFmId}`,
          {
            date: formData.screeningDate,
          }
        );
      }

      if (abhaResponse.data.success && dateResponse.data.success) {
        alert("Data saved successfully!");
        handleNext?.()
      } else {
        alert("Failed to save some data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
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
      <form onSubmit={handleSave}>
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

        <div style={styles.formGroup}>
          <label style={styles.label}>Screening Date</label>
          <input
            type="date"
            name="screeningDate"
            value={formData.screeningDate}
            onChange={(evt) => {
              const today = moment();
              const pastYear = moment().subtract(1, 'year');
              const selectedMoment = moment(evt.target?.value);
              if (selectedMoment.isBetween(pastYear, today, undefined, '[]')) {
                handleInputChange(evt)
              } else {
                alert('Please select a date within the past year.');
              }
            }}
            style={styles.input}
            required
          />
        </div>
        <footer className="form-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="submit">
            Submit
          </button>
        </footer>
      </form>
    </div>
  );
};

export default ABHAIdStatus;
