import React from "react";
// import "./ReviewPage.css";

const ReviewPage = ({ formData }) => {
  return (
    <div className="review-page">
      <h2>Review Your Submission</h2>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key} className="review-item">
          <h3>{key}</h3>
          {typeof value === "object" ? (
            Object.entries(value).map(([subKey, subValue]) => (
              <p key={subKey}>
                {subKey}: {subValue || "Not provided"}
              </p>
            ))
          ) : (
            <p>
              {key}: {value || "Not provided"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewPage;
