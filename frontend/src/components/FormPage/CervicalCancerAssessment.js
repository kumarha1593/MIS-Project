import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectAll from "../global/SelectAll";
import ButtonLoader from "../global/ButtonLoader";

const CervicalCancerAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    known_case: "",
    bleeding_between_periods: "",
    bleeding_after_menopause: "",
    bleeding_after_intercourse: "",
    foul_smelling_discharge: "",
    via_appointment_date: "",
    via_result: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchCervicalCancerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/cervical-cancer-assessment/${currentFmId}`
      );
      if (response.data.success) {
        const fetchedData = response.data.data;
        // Format the date to "yyyy-MM-dd"
        if (fetchedData.via_appointment_date) {
          fetchedData.via_appointment_date = new Date(
            fetchedData.via_appointment_date
          )
            .toISOString()
            .split("T")[0];
        }
        setFormData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching cervical cancer assessment:", error);
    }
  };

  useEffect(() => {
    if (currentFmId) {
      fetchCervicalCancerData();
    }
  }, [currentFmId]);

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true)
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/cervical-cancer-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      setIsLoading(false)
      if (response.data.success) {
        alert("Cervical Cancer Assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error saving cervical cancer assessment:", error);
      alert("Failed to save cervical cancer assessment. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectAllChange = (value) => {
    const newValue = value ? "No" : "";  // Set "NO" if true, otherwise empty string
    setFormData({
      known_case: newValue,
      bleeding_between_periods: newValue,
      bleeding_after_menopause: newValue,
      bleeding_after_intercourse: newValue,
      foul_smelling_discharge: newValue,
    });
  };

  return (
    <div style={styles.formSection}>
      <SelectAll
        label='Select All No'
        onChange={handleSelectAllChange}
      />
      <form onSubmit={handleSave}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Known Case *</label>
          <select
            id="known_case"
            name="known_case"
            value={formData.known_case}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes and on treatment">Yes and on treatment</option>
            <option value="Yes and not on treatment">
              Yes and not on treatment
            </option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Bleeding Between Periods</label>
          <select
            id="bleeding_between_periods"
            name="bleeding_between_periods"
            value={formData.bleeding_between_periods}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Bleeding After Menopause</label>
          <select
            id="bleeding_after_menopause"
            name="bleeding_after_menopause"
            value={formData.bleeding_after_menopause}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Bleeding After Intercourse</label>
          <select
            id="bleeding_after_intercourse"
            name="bleeding_after_intercourse"
            value={formData.bleeding_after_intercourse}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Foul Smelling Discharge</label>
          <select
            id="foul_smelling_discharge"
            name="foul_smelling_discharge"
            value={formData.foul_smelling_discharge}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>VIA Appointment Date </label>
          <input
            type="date"
            id="via_appointment_date"
            name="via_appointment_date"
            value={formData.via_appointment_date}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>VIA Result</label>
          <select
            id="via_result"
            name="via_result"
            value={formData.via_result}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
        <footer className="form-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button style={{ height: 40 }} disabled={isLoading} type="submit">
            {isLoading
              ?
              <ButtonLoader />
              :
              'Save & Next'
            }
          </button>
        </footer>
      </form>
    </div>
  );
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
    width: "100%",
  },
};

export default CervicalCancerAssessment;
