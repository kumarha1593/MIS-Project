import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonLoader from "../global/ButtonLoader";
import { handleInputChangeWithMaxLength } from "../../utils/helper";

const PostStrokeAssessment = ({ currentFmId, handleBack, handleNext }) => {
  const [formData, setFormData] = useState({
    history_of_stroke: "",
    stroke_date: "",
    present_condition: "",
    stroke_sign_action: "",
    referral_center_name: "",
  });

  const [showStrokeDetails, setShowStrokeDetails] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchPostStrokeData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/post-stroke-assessment/${currentFmId}`
        );
        if (response.data.success) {
          const data = response.data.data;

          // Format the date to "yyyy-MM-dd"
          if (data.stroke_date) {
            data.stroke_date = new Date(data.stroke_date)
              .toISOString()
              .split("T")[0];
          }

          setFormData(data);

          if (data.history_of_stroke === "Yes") {
            setShowStrokeDetails(true);
            if (data.stroke_sign_action === "Referral") {
              setShowReferralField(true);
            } else {
              setShowReferralField(false);
            }
          } else {
            setShowStrokeDetails(false);
            setShowReferralField(false);
          }
        }
      } catch (error) {
        console.error("Error fetching post-stroke assessment:", error);
      }
    };

    if (currentFmId) {
      fetchPostStrokeData();
    }
  }, [currentFmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update formData state with the new value
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Conditional logic based on the field being changed
    if (name === "history_of_stroke") {
      setShowStrokeDetails(value === "Yes");
      localStorage.setItem('history_of_stroke_data', value);
      if (value !== "Yes") {
        setShowReferralField(false);
        setFormData((prevState) => ({
          ...prevState,
          stroke_date: "",
          present_condition: "",
          stroke_sign_action: "",
          referral_center_name: "",
        }));
      }
    }

    if (name === "stroke_sign_action") {
      setShowReferralField(value === "Referral");
    }
  };

  const handleSave = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true)
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/post-stroke-assessment`,
        {
          fm_id: currentFmId,
          ...formData,
        }
      );
      setIsLoading(false)
      if (response.data.success) {
        alert("Post-stroke assessment saved successfully!");
        handleNext?.();
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error saving post-stroke assessment:", error);
      alert("Failed to save post-stroke assessment. Please try again.");
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
          <label style={styles.label}>History of Stroke *</label>
          <select
            id="history_of_stroke"
            name="history_of_stroke"
            value={formData.history_of_stroke || ""}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {showStrokeDetails && (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Stroke *</label>
              <input
                type="date"
                id="stroke_date"
                name="stroke_date"
                value={formData.stroke_date || ""}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Present Condition *</label>
              <select
                id="present_condition"
                name="present_condition"
                value={formData.present_condition || ""}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="">Select</option>
                <option value="Recovered">Recovered</option>
                <option value="Not Recovered">Not Recovered</option>
                <option value="Need Physiotherapy">Need Physiotherapy</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Action for Stroke Symptoms *</label>
              <select
                id="stroke_sign_action"
                name="stroke_sign_action"
                value={formData.stroke_sign_action || ""}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="">Select</option>
                <option value="Teleconsultation">Teleconsultation</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            {showReferralField && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Referred Centre for Stroke *</label>
                <input
                  type="text"
                  id="referral_center_name"
                  name="referral_center_name"
                  value={formData.referral_center_name || ""}
                  onChange={(e) => handleInputChangeWithMaxLength(e, 20, handleInputChange)}
                  style={styles.input}
                  required
                />
              </div>
            )}
          </>
        )}
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

export default PostStrokeAssessment;
