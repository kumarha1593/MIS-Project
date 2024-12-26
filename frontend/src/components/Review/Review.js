import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Review.css";
import ButtonLoader from "../global/ButtonLoader";
import defaultInstance from "../../axiosHelper";
import { API_ENDPOINTS } from "../../utils/apiEndPoints";

const Review = () => {
  const location = useLocation();
  const { currentFmId } = location.state || {};
  const navigate = useNavigate();
  const [allAssessmentsData, setAllAssessmentsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(currentFmId ? true : false);

  const allAssessments = async () => {
    const response = await defaultInstance.get(`${API_ENDPOINTS.ALL_ASSESSMENTS}${currentFmId}`);
    setFetching(false)
    if (response?.data?.success) {
      setAllAssessmentsData(response?.data?.data)
    }
  }

  useEffect(() => {
    if (currentFmId)
      allAssessments();
  }, [currentFmId]);

  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${process.env.REACT_APP_BASE_URL}api/final-submit`, {
        fm_id: currentFmId,
      });
      setIsLoading(false)
      alert("Data submitted successfully!");
      navigate("/FieldDashboard");
    } catch (error) {
      setIsLoading(false)
      alert("Failed to submit data. Please try again.");
    }
  };

  if (fetching) {
    return (<div style={{ width: '100%', height: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
      <img style={{ width: 50, height: 50 }} src='./loading.gif' alt='loading' />
    </div>)
  }

  if (!allAssessmentsData) return <div>Error fetching data</div>;

  const {
    personal_info: personalInfo,
    health_measurements: healthProfile,
    htn_assessment: htnAssessment,
    dm_assessment: dmAssessment,
    risk_assessment: riskAssessment,
    oral_cancer_assessment: oralCancerAssessment,
    breast_cancer_assessment: breastCancerAssessment,
    cervical_cancer_assessment: cervicalCancerAssessment,
    cvd_assessment: cvdAssessment,
    post_stroke_assessment: postStrokeAssessment,
    ckd_assessment: ckdAssessment,
    copdTB_assessment: copdTbAssessment,
    cataract_assessment: cataractAssessment,
    hearing_issue_assessment: hearingIssueAssessment,
    leprosy_assessment: leprosyAssessment,
    elderly_assessment: elderlyAssessment,
    mental_health_assessment: mentalHealthAssessment,
    assessment_and_action_taken: assessmentAndActionTaken,
    abhaid_status: abhaIdStatus,
  } = allAssessmentsData

  return (
    <div className="review-page">
      <h1>Review Your Submission</h1>
      <div>
        <h2>Health Profile</h2>
        <p>Name: {personalInfo?.name || "Not filled"}</p>
        <p>Identifier: {personalInfo?.identifier || "Not filled"}</p>
        <p>Card Number: {personalInfo?.card_number || "Not filled"}</p>
        <p>Date of Birth: {personalInfo?.dob || "Not filled"}</p>
        <p>Sex: {personalInfo?.sex || "Not filled"}</p>
        <p>Telephone Number: {personalInfo?.tel_no || "Not filled"}</p>
        <p>Address: {personalInfo?.address || "Not filled"}</p>
        <p>
          Health Insurance (State/Government/Private):{" "}
          {personalInfo?.state_health_insurance || "Not filled"}
        </p>
        <p>Disability: {personalInfo?.disability || "Not filled"}</p>
      </div>

      <h2>Health Measurements</h2>
      <div>
        <p>
          <strong>Height:</strong> {healthProfile?.height ?? "Not Filled"}
        </p>
        <p>
          <strong>Weight:</strong> {healthProfile?.weight ?? "Not Filled"}
        </p>
        <p>
          <strong>BMI:</strong> {healthProfile?.bmi ?? "Not Filled"}
        </p>
        <p>
          <strong>Temperature:</strong> {healthProfile?.temp ?? "Not Filled"}
        </p>
        <p>
          <strong>SpO2:</strong> {healthProfile?.spO2 ?? "Not Filled"}
        </p>
        <p>
          <strong>Pulse:</strong> {healthProfile?.pulse ?? "Not Filled"}
        </p>
      </div>

      <h2>HTN Assessment</h2>
      <div>
        <p>
          <strong>Case of HTN:</strong>{" "}
          {htnAssessment?.case_of_htn || "Not Filled"}
        </p>
        <p>
          <strong>Upper BP (mmHg):</strong>{" "}
          {htnAssessment?.upper_bp || "Not Filled"}
        </p>
        <p>
          <strong>Lower BP (mmHg):</strong>{" "}
          {htnAssessment?.lower_bp || "Not Filled"}
        </p>
        <p>
          <strong>Action High BP:</strong>{" "}
          {htnAssessment?.action_high_bp || "Not Filled"}
        </p>
        <p>
          <strong>Referral Center:</strong>{" "}
          {htnAssessment?.referral_center || "Not Filled"}
        </p>
      </div>
      <h2>DM Assessment</h2>
      <div>
        <p>
          <strong>Case of DM:</strong>{" "}
          {dmAssessment?.case_of_dm || "Not Filled"}
        </p>
        <p>
          <strong>Fasting Blood Sugar (mg/dL):</strong>{" "}
          {dmAssessment?.fasting_blood_sugar || "Not Filled"}
        </p>
        <p>
          <strong>Post Prandial Blood Sugar (mg/dL):</strong>{" "}
          {dmAssessment?.post_prandial_blood_sugar || "Not Filled"}
        </p>
        <p>
          <strong>Random Blood Sugar (mg/dL):</strong>{" "}
          {dmAssessment?.random_blood_sugar || "Not Filled"}
        </p>
        <p>
          <strong>Action High BS:</strong>{" "}
          {dmAssessment?.action_high_bs || "Not Filled"}
        </p>
        <p>
          <strong>Referral Center:</strong>{" "}
          {dmAssessment?.referral_center || "Not Filled"}
        </p>
      </div>

      <h2>Risk Assessment</h2>
      <div>
        <p>
          <strong>Age:</strong> {riskAssessment?.age || "Not Filled"}
        </p>
        <p>
          <strong>Tobacco Use:</strong>{" "}
          {riskAssessment?.tobacco_use || "Not Filled"}
        </p>
        <p>
          <strong>Alcohol Use:</strong>{" "}
          {riskAssessment?.alcohol_use || "Not Filled"}
        </p>
        {personalInfo?.sex === "female" && (
          <p>
            <strong>Waist Circumference (Female):</strong>{" "}
            {riskAssessment?.waist_female || "Not Filled"}
          </p>
        )}

        {personalInfo?.sex === "male" && (
          <p>
            <strong>Waist Circumference (Male):</strong>{" "}
            {riskAssessment?.waist_male || "Not Filled"}
          </p>
        )}
        <p>
          <strong>Physical Activity:</strong>{" "}
          {riskAssessment?.physical_activity || "Not Filled"}
        </p>
        <p>
          <strong>Family Diabetes History:</strong>{" "}
          {riskAssessment?.family_diabetes_history || "Not Filled"}
        </p>
        <p>
          <strong>Risk:</strong>{" "}
          {riskAssessment?.risk_score > 5 ? "High" : "Low" || "Not Filled"}
        </p>
      </div>

      <h2>Oral Cancer Assessment</h2>
      <div>
        <p>
          <strong>Known Case:</strong>{" "}
          {oralCancerAssessment?.known_case || "Not Filled"}
        </p>
        <p>
          <strong>Persistent Ulcer:</strong>{" "}
          {oralCancerAssessment?.persistent_ulcer || "Not Filled"}
        </p>
        <p>
          <strong>Persistent Patch:</strong>{" "}
          {oralCancerAssessment?.persistent_patch || "Not Filled"}
        </p>
        <p>
          <strong>Difficulty Chewing:</strong>{" "}
          {oralCancerAssessment?.difficulty_chewing || "Not Filled"}
        </p>
        <p>
          <strong>Difficulty Opening Mouth:</strong>{" "}
          {oralCancerAssessment?.difficulty_opening_mouth || "Not Filled"}
        </p>
        <p>
          <strong>Growth in Mouth:</strong>{" "}
          {oralCancerAssessment?.growth_in_mouth || "Not Filled"}
        </p>
        <p>
          <strong>Sudden change in voice:</strong>{" "}
          {oralCancerAssessment?.swelling_in_neck || "Not Filled"}
        </p>
        <p>
          <strong>Suspected Oral Cancer:</strong>{" "}
          {oralCancerAssessment?.suspected_oral_cancer || "Not Filled"}
        </p>
      </div>

      <h2>Breast Cancer Assessment</h2>
      <div>
        <p>
          <strong>Known Case:</strong>{" "}
          {breastCancerAssessment?.known_case || "Not Filled"}
        </p>
        <p>
          <strong>Lump in Breast:</strong>{" "}
          {breastCancerAssessment?.lump_in_breast || "Not Filled"}
        </p>
        <p>
          <strong>Blood-Stained Discharge:</strong>{" "}
          {breastCancerAssessment?.blood_stained_discharge || "Not Filled"}
        </p>
        <p>
          <strong>Change in Shape:</strong>{" "}
          {breastCancerAssessment?.change_in_shape || "Not Filled"}
        </p>
        <p>
          <strong>Constant Pain or Swelling:</strong>{" "}
          {breastCancerAssessment?.constant_pain_or_swelling || "Not Filled"}
        </p>
        <p>
          <strong>Redness or Ulcer:</strong>{" "}
          {breastCancerAssessment?.redness_or_ulcer || "Not Filled"}
        </p>
        <p>
          <strong>Suspected Breast Cancer:</strong>{" "}
          {breastCancerAssessment?.suspected_breast_cancer || "Not Filled"}
        </p>
      </div>

      {personalInfo?.sex !== "male" && (
        <>
          <h2>Cervical Cancer Assessment</h2>
          <div>
            <p>
              <strong>Known Case:</strong>{" "}
              {cervicalCancerAssessment?.known_case || "Not Filled"}
            </p>
            <p>
              <strong>Bleeding Between Periods:</strong>{" "}
              {cervicalCancerAssessment?.bleeding_between_periods ||
                "Not Filled"}
            </p>
            <p>
              <strong>Bleeding After Menopause:</strong>{" "}
              {cervicalCancerAssessment?.bleeding_after_menopause ||
                "Not Filled"}
            </p>
            <p>
              <strong>Bleeding After Intercourse:</strong>{" "}
              {cervicalCancerAssessment?.bleeding_after_intercourse ||
                "Not Filled"}
            </p>
            <p>
              <strong>Foul-Smelling Discharge:</strong>{" "}
              {cervicalCancerAssessment?.foul_smelling_discharge ||
                "Not Filled"}
            </p>
            <p>
              <strong>VIA Appointment Date:</strong>{" "}
              {cervicalCancerAssessment?.via_appointment_date || "Not Filled"}
            </p>
            <p>
              <strong>VIA Result:</strong>{" "}
              {cervicalCancerAssessment?.via_result || "Not Filled"}
            </p>
          </div>
        </>
      )}

      <h2>CVD Assessment</h2>
      <div>
        <p>
          <strong>Known Case:</strong>{" "}
          {cvdAssessment?.known_case || "Not Filled"}
        </p>
        <p>
          <strong>Heart Sound:</strong>{" "}
          {cvdAssessment?.heart_sound || "Not Filled"}
        </p>
        <p>
          <strong>Symptom:</strong> {cvdAssessment?.symptom || "Not Filled"}
        </p>
        <p>
          <strong>CVD Date:</strong> {cvdAssessment?.cvd_date || "Not Filled"}
        </p>
        <p>
          <strong>Suspected CVD:</strong>{" "}
          {cvdAssessment?.suspected_cvd || "Not Filled"}
        </p>
        <p>
          <strong>Teleconsultation:</strong>{" "}
          {cvdAssessment?.teleconsultation || "Not Filled"}
        </p>
        <p>
          <strong>Referral:</strong> {cvdAssessment?.referral || "Not Filled"}
        </p>
        <p>
          <strong>Referral Centre:</strong>{" "}
          {cvdAssessment?.referral_centre || "Not Filled"}
        </p>
      </div>

      <h2>Post Stroke Assessment</h2>
      <div>
        <p>
          <strong>History of Stroke:</strong>{" "}
          {postStrokeAssessment?.history_of_stroke || "Not Filled"}
        </p>
        <p>
          <strong>Stroke Date:</strong>{" "}
          {postStrokeAssessment?.stroke_date || "Not Filled"}
        </p>
        <p>
          <strong>Present Condition:</strong>{" "}
          {postStrokeAssessment?.present_condition || "Not Filled"}
        </p>
        <p>
          <strong>Stroke Sign Action:</strong>{" "}
          {postStrokeAssessment?.stroke_sign_action || "Not Filled"}
        </p>
        <p>
          <strong>Referral Center Name:</strong>{" "}
          {postStrokeAssessment?.referral_center_name || "Not Filled"}
        </p>
      </div>

      <h2>CKD Assessment</h2>
      <div>
        <p>
          <strong>Known CKD:</strong> {ckdAssessment?.knownCKD || "Not Filled"}
        </p>
        <p>
          <strong>History of CKD Stone:</strong>{" "}
          {ckdAssessment?.historyCKDStone || "Not Filled"}
        </p>
        <p>
          <strong>Age Above 50:</strong>{" "}
          {ckdAssessment?.ageAbove50 || "Not Filled"}
        </p>
        <p>
          <strong>Hypertension Patient:</strong>{" "}
          {ckdAssessment?.hypertensionPatient || "Not Filled"}
        </p>
        <p>
          <strong>Diabetes Patient:</strong>{" "}
          {ckdAssessment?.diabetesPatient || "Not Filled"}
        </p>
        <p>
          <strong>Anemia Patient:</strong>{" "}
          {ckdAssessment?.anemiaPatient || "Not Filled"}
        </p>
        <p>
          <strong>History of Stroke:</strong>{" "}
          {ckdAssessment?.historyOfStroke || "Not Filled"}
        </p>
        <p>
          <strong>Swelling Face/Leg:</strong>{" "}
          {ckdAssessment?.swellingFaceLeg || "Not Filled"}
        </p>
        <p>
          <strong>History of NSAIDS:</strong>{" "}
          {ckdAssessment?.historyNSAIDS || "Not Filled"}
        </p>
        <p>
          <strong>CKD Risk Score:</strong>{" "}
          {ckdAssessment?.ckdRiskScore || "Not Filled"}
        </p>
        <p>
          <strong>Risk Assessment:</strong>{" "}
          {ckdAssessment?.riskaAssessment || "Not Filled"}
        </p>
      </div>

      <h2>COPD/TB Assessment</h2>
      <div>
        <p>
          <strong>Known Case CRD:</strong>{" "}
          {copdTbAssessment?.known_case_crd || "Not Filled"}
        </p>
        <p>
          <strong>CRD Specify:</strong>{" "}
          {copdTbAssessment?.crd_specify || "Not Filled"}
        </p>
        <p>
          <strong>Occupational Exposure:</strong>{" "}
          {copdTbAssessment?.occupational_exposure || "Not Filled"}
        </p>
        <p>
          <strong>Cooking Fuel Type:</strong>{" "}
          {copdTbAssessment?.cooking_fuel_type || "Not Filled"}
        </p>
        <p>
          <strong>Chest Sound:</strong>{" "}
          {copdTbAssessment?.chest_sound || "Not Filled"}
        </p>
        <p>
          <strong>Chest Sound Action:</strong>{" "}
          {copdTbAssessment?.chest_sound_action || "Not Filled"}
        </p>
        <p>
          <strong>Referral Center Name:</strong>{" "}
          {copdTbAssessment?.referral_center_name || "Not Filled"}
        </p>
        <p>
          <strong>COPD Confirmed:</strong>{" "}
          {copdTbAssessment?.copd_confirmed || "Not Filled"}
        </p>
        <p>
          <strong>COPD Confirmation Date:</strong>{" "}
          {copdTbAssessment?.copd_confirmation_date || "Not Filled"}
        </p>
        <p>
          <strong>Shortness of Breath:</strong>{" "}
          {copdTbAssessment?.shortness_of_breath || "Not Filled"}
        </p>
        <p>
          <strong>Coughing More Than 2 Weeks:</strong>{" "}
          {copdTbAssessment?.coughing_more_than_2_weeks || "Not Filled"}
        </p>
        <p>
          <strong>Blood in Sputum:</strong>{" "}
          {copdTbAssessment?.blood_in_sputum || "Not Filled"}
        </p>
        <p>
          <strong>Fever More Than 2 Weeks:</strong>{" "}
          {copdTbAssessment?.fever_more_than_2_weeks || "Not Filled"}
        </p>
        <p>
          <strong>Night Sweats:</strong>{" "}
          {copdTbAssessment?.night_sweats || "Not Filled"}
        </p>
        <p>
          <strong>Taking Anti-TB Drugs:</strong>{" "}
          {copdTbAssessment?.taking_anti_tb_drugs || "Not Filled"}
        </p>
        <p>
          <strong>Family TB History:</strong>{" "}
          {copdTbAssessment?.family_tb_history || "Not Filled"}
        </p>
        <p>
          <strong>History of TB:</strong>{" "}
          {copdTbAssessment?.history_of_tb || "Not Filled"}
        </p>
      </div>

      <h2>Cataract Assessment</h2>
      <div>
        <p>
          <strong>Cloudy/Blurred Vision:</strong>{" "}
          {cataractAssessment?.cloudy_blurred_vision || "Not Filled"}
        </p>
        <p>
          <strong>Pain or Redness:</strong>{" "}
          {cataractAssessment?.pain_or_redness || "Not Filled"}
        </p>
        <p>
          <strong>Cataract Assessment Result:</strong>{" "}
          {cataractAssessment?.cataract_assessment_result || "Not Filled"}
        </p>
      </div>

      <h2>Hearing Issue</h2>
      <div>
        <p>
          <strong>Difficulty Hearing:</strong>{" "}
          {hearingIssueAssessment?.difficulty_hearing || "Not Filled"}
        </p>
      </div>

      <h2>Leprosy Assessment</h2>
      <div>
        <p>
          <strong>Hypopigmented Patch:</strong>{" "}
          {leprosyAssessment?.hypopigmented_patch || "Not Filled"}
        </p>
        <p>
          <strong>Recurrent Ulceration:</strong>{" "}
          {leprosyAssessment?.recurrent_ulceration || "Not Filled"}
        </p>
        <p>
          <strong>Clawing of Fingers:</strong>{" "}
          {leprosyAssessment?.clawing_of_fingers || "Not Filled"}
        </p>
        <p>
          <strong>Inability to Close Eyelid:</strong>{" "}
          {leprosyAssessment?.inability_to_close_eyelid || "Not Filled"}
        </p>
        <p>
          <strong>Difficulty Holding Objects:</strong>{" "}
          {leprosyAssessment?.difficulty_holding_objects || "Not Filled"}
        </p>
      </div>

      <h2>Elderly Assessment</h2>
      <div>
        <p>
          <strong>Unsteady Walking:</strong>{" "}
          {elderlyAssessment?.unsteady_walking || "Not Filled"}
        </p>
        <p>
          <strong>Physical Disability:</strong>{" "}
          {elderlyAssessment?.physical_disability || "Not Filled"}
        </p>
        <p>
          <strong>Help from Others:</strong>{" "}
          {elderlyAssessment?.help_from_others || "Not Filled"}
        </p>
        <p>
          <strong>Forget Names:</strong>{" "}
          {elderlyAssessment?.forget_names || "Not Filled"}
        </p>
      </div>

      <h2>Mental Health Assessment</h2>
      <div>
        <p>
          <strong>Little Interest or Pleasure:</strong>{" "}
          {mentalHealthAssessment?.little_interest_or_pleasure || "Not Filled"}
        </p>
        <p>
          <strong>Feeling Down or Depressed:</strong>{" "}
          {mentalHealthAssessment?.feeling_down_or_depressed || "Not Filled"}
        </p>
        <p>
          <strong>Mental Health Score:</strong>{" "}
          {mentalHealthAssessment?.mental_health_score || "Not Filled"}
        </p>
        <p>
          <strong>Mental Health Problem:</strong>{" "}
          {mentalHealthAssessment?.mental_health_problem || "Not Filled"}
        </p>
        <p>
          <strong>History of Fits:</strong>{" "}
          {mentalHealthAssessment?.history_of_fits || "Not Filled"}
        </p>
        <p>
          <strong>Other Mental Disorder:</strong>{" "}
          {mentalHealthAssessment?.other_mental_disorder || "Not Filled"}
        </p>
        <p>
          <strong>Brief Intervention Given:</strong>{" "}
          {mentalHealthAssessment?.brief_intervention_given || "Not Filled"}
        </p>
        <p>
          <strong>Intervention Type:</strong>{" "}
          {mentalHealthAssessment?.intervention_type || "Not Filled"}
        </p>
      </div>

      <h2>Assessment and Action Taken</h2>
      <div>
        <p>
          <strong>Major NCD Detected:</strong>{" "}
          {assessmentAndActionTaken?.majorNCDDetected || "Not Filled"}
        </p>
        <p>
          <strong>Any Other Disease Detected:</strong>{" "}
          {assessmentAndActionTaken?.anyOtherDiseaseDetected || "Not Filled"}
        </p>
        <p>
          <strong>Known Case DM/HTN:</strong>{" "}
          {assessmentAndActionTaken?.knownCaseDMWithHTN || "Not Filled"}
        </p>
        <p>
          <strong>Teleconsultation:</strong>{" "}
          {assessmentAndActionTaken?.teleconsultation || "Not Filled"}
        </p>
        <p>
          <strong>Prescription Given:</strong>{" "}
          {assessmentAndActionTaken?.prescriptionGiven || "Not Filled"}
        </p>
        <p>
          <strong>Other Advices:</strong>{" "}
          {assessmentAndActionTaken?.otherAdvices || "Not Filled"}
        </p>
        <p>
          <strong>Remarks:</strong>{" "}
          {assessmentAndActionTaken?.remarks || "Not Filled"}
        </p>
      </div>

      <h2>ABHA ID Status</h2>
      <div>
        <p>
          <strong>ABHA ID Status:</strong>{" "}
          {abhaIdStatus?.abhaid_status || "Not Filled"}
        </p>
      </div>
      <div className="button-container">
        <button onClick={() => navigate("/FormPage")} className="back-button">
          Back
        </button>
        <button type="button" className="submit-button" onClick={handleFinalSubmit} style={{ height: 40 }} disabled={isLoading}>
          {isLoading
            ?
            <ButtonLoader />
            :
            'Final Submit'
          }
        </button>
      </div>
    </div>
  );
};

export default Review;
