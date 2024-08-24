import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Review.css";

const Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [emptyFields, setEmptyFields] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state && location.state.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  const handleSubmit = () => {
    const empty = Object.entries(formData).flatMap(([key, value]) => {
      if (typeof value === "object") {
        return Object.entries(value)
          .filter(([, v]) => v === "")
          .map(([k]) => `${key}.${k}`);
      }
      return value === "" ? [key] : [];
    });

    if (empty.length > 0) {
      setEmptyFields(empty);
      setShowModal(true);
    } else {
      console.log("Form submitted:", formData);
      // Add your form submission logic here
    }
  };

  const handleBack = () => {
    navigate("/FormPage");
  };

  const renderFormSection = (sectionName, sectionData) => {
    return (
      <div key={sectionName} className="review-section">
        <h3>{sectionName}</h3>
        {Object.entries(sectionData).map(([key, value]) => (
          <div key={`${sectionName}-${key}`} className="review-item">
            <span>{key}:</span>
            <span>{value || "N/A"}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderFormData = () => {
    const sections = [
      {
        name: "Health Profile",
        keys: [
          "patientName",
          "identifier",
          "cardNumber",
          "dob",
          "sex",
          "phone",
          "address",
          "insurance",
          "disability",
        ],
      },
      {
        name: "Health Measurements",
        keys: ["height", "weight", "bmi", "temp", "spo2"],
      },
      {
        name: "HTN Assessment",
        keys: [
          "knownHTN",
          "bp",
          "highBPAction",
          "referredCentreHTN",
          "htnConfirmed",
        ],
      },
      {
        name: "DM Assessment",
        keys: [
          "knownDM",
          "rbs",
          "highBSAction",
          "referredCentreDM",
          "fasting",
          "pp",
          "random",
          "dmConfirmed",
        ],
      },
      {
        name: "Risk Assessment",
        keys: [
          "age",
          "tobacco",
          "alcohol",
          "waistFemale",
          "waistMale",
          "physicalActivity",
          "familyHistory",
          "riskScore",
        ],
      },
      { name: "Oral Cancer Assessment", keys: ["oralCancer"] },
      { name: "Breast Cancer Assessment", keys: ["breastCancer"] },
      { name: "Cervical Cancer Assessment", keys: ["cervicalCancer"] },
      { name: "CVD Assessment", keys: ["cvd"] },
      { name: "Post Stroke Assessment", keys: ["postStroke"] },
      { name: "CKD Assessment", keys: ["ckd"] },
      { name: "COPD/TB Assessment", keys: ["copdTb"] },
      { name: "Cataract Assessment", keys: ["cataract"] },
      { name: "Hearing Issue", keys: ["hearingIssue"] },
      { name: "Leprosy Assessment", keys: ["leprosy"] },
      { name: "Elderly Assessment", keys: ["elderly"] },
      { name: "Mental Health Assessment", keys: ["mentalHealth"] },
      {
        name: "Assessment and Action Taken",
        keys: [
          "assessmentAction",
          "majorNCDDetected",
          "otherDiseaseDetected",
          "knownCaseDMWithHTN",
          "telemedicine",
          "medicineDistributed",
          "otherAdvices",
        ],
      },
      { name: "ABHA ID Status", keys: ["abhaIdStatus"] },
    ];

    return sections.map((section) => {
      const sectionData = section.keys.reduce((acc, key) => {
        if (formData[key]) {
          if (typeof formData[key] === "object") {
            Object.entries(formData[key]).forEach(([subKey, value]) => {
              acc[subKey] = value || "N/A";
            });
          } else {
            acc[key] = formData[key];
          }
        } else {
          acc[key] = "N/A";
        }
        return acc;
      }, {});

      return renderFormSection(section.name, sectionData);
    });
  };

  return (
    <div className="review-page">
      <h1>Review Your Submission</h1>
      {renderFormData()}
      <div className="button-container">
        <button onClick={handleBack} className="back-button">
          Back
        </button>
        <button onClick={handleSubmit} className="submit-button">
          Final Submit
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Please fill all the fields</h2>
            <p>{emptyFields.join(", ")}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
