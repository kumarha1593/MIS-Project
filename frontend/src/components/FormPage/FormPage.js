import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FormPage.css";
import { FaList } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import HealthProfileForm from "./HealthProfileForm";
import HealthMeasurements from "./HealthMeasurements";
import HTNAssessment from "./HTNAssessment";
import DMAssessment from "./DMAssessment";
import RiskAssessment from "./RiskAssessment";
import OralCancerAssessment from "./OralCancerAssessment";
import BreastCancerAssessment from "./BreastCancerAssessment";
import CervicalCancerAssessment from "./CervicalCancerAssessment";
import CVDAssessment from "./CVDAssessment";
import PostStrokeAssessment from "./PostStrokeAssessment";
import CKDAssessment from "./CKDAssessment";
import COPDTBAssessment from "./COPDTBAssessment";
import CataractAssessment from "./CataractAssessment";
import HearingIssue from "./HearingIssueComponent";
import LeprosyAssessment from "./LeprosyAssessment";
import ElderlyAssessment from "./ElderlyAssessment";
import MentalHealthAssessment from "./MentalHealthAssessment";
import AssessmentAndActionTaken from "./AssessmentAndActionTaken";
import ABHAIdStatus from "./ABHAIdStatus";

const FormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentFmId, setCurrentFmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Page 1: Health Profile Form
    name: "",
    identifier: "",
    card_number: "",
    dob: "",
    sex: "",
    tel_no: "",
    address: "",
    state_health_insurance: "",
    state_health_insurance_remark: "",
    disability: "",
    disability_remark: "",

    // Page 2: Health Measurements
    height: "",
    weight: "",
    bmi: "",
    temp: "",
    spo2: "",

    // Page 3: HTN Assessment
    knownHTN: "",
    bp: "",
    highBPAction: "",
    referredCentreHTN: "",
    htnConfirmed: "",

    // Page 4: DM Assessment
    knownDM: "",
    rbs: "",
    highBSAction: "",
    referredCentreDM: "",
    fasting: "",
    pp: "",
    random: "",
    dmConfirmed: "",

    // Page 5: Risk Assessment
    age: "",
    tobacco: "",
    alcohol: "",
    waistFemale: "",
    waistMale: "",
    physicalActivity: "",
    familyHistory: "",
    riskScore: "",

    // Page 6: Oral Cancer Assessment
    oralCancer: {
      knownCase: "",
      treatmentStatus: "",
      difficultyOpeningMouth: "",
      ulcersInMouth: "",
      growthInMouth: "",
      suddenVoiceChange: "",
      whiteRedPatch: "",
      whiteRedPatchNotHealed: "",
      painWhileChewing: "",
      suspectedOralCancer: "",
    },

    // Page 7: Breast Cancer Assessment
    breastCancer: {
      knownCase: "",
      treatmentStatus: "",
      lumpInBreast: "",
      bloodStainedDischarge: "",
      changeInShape: "",
      constantPain: "",
      rednessOfSkin: "",
      suspectedBreastCancer: "",
    },

    // Page 8: Cervical Cancer Assessment
    cervicalCancer: {
      knownCase: "",
      treatmentStatus: "",
      bleedingBetweenPeriods: "",
      bleedingAfterMenopause: "",
      bleedingAfterIntercourse: "",
      foulSmellingDischarge: "",
      referredCenter: "",
      viaDate: "",
      viaResult: "",
      viaReferredCenter: "",
    },

    // Page 9: CVD Assessment
    cvd: {
      knownHeartDisease: "",
      heartSound: "",
      abnormalHeartSound: "",
      heartDiseaseSymptom: "",
      teleconsultationDone: "",
      referralDone: "",
      referredCenter: "",
      heartDiseaseConfirmed: "",
      suspectedHeartDisease: "",
    },

    // Page 10: Post Stroke Assessment
    postStroke: {
      historyOfStroke: "",
      strokeDate: "",
      presentCondition: "",
      strokeSignSymptoms: "",
      referredCenter: "",
    },

    // Page 11: CKD Assessment
    ckd: {
      knownCase: "",
      historyOfCKD: "",
      above50Years: "",
      hypertensionPatient: "",
      diabetesPatient: "",
      patientWithAnemia: "",
      historyOfStrokeHeartAttack: "",
      swellingOnFaceAndLeg: "",
      historyOfMedication: "",
      riskScore: "",
    },

    // Page 12: COPD/TB Assessment
    copdTb: {
      knownChronicRespiratoryDisease: "",
      occupationalExposure: "",
      fuelUsedForCooking: "",
      chestSound: "",
      abnormalChestSoundAction: "",
      respiratoryDiseaseConfirmed: "",
      shortnessOfBreath: "",
      coughingMoreThan2Weeks: "",
      bloodInSputum: "",
      feverForMoreThan2Weeks: "",
      nightSweats: "",
      currentlyTakingAntiTBDrugs: "",
      familyMemberWithTB: "",
      historyOfTB: "",
    },
    cataract: {
      cloudyVision: "", // Case 13
      eyePain: "",
      cataractResult: "",
    },
    abhaIdStatus: "", // Case 19
    // Case 14: Hearing Issue
    hearingIssue: "",

    // Case 15: Leprosy Assessment
    leprosy: {
      lesionSensationLoss: "",
      ulceration: "",
      clawingFingers: "",
      inabilityToCloseEyelid: "",
      weaknessFeet: "",
    },

    // Case 16: Elderly Assessment
    elderly: {
      unsteadyWalking: "",
      physicalDisability: "",
      helpNeeded: "",
      forgetNames: "",
    },

    // Case 17: Mental Health Assessment
    mentalHealth: {
      interestPleasure: "",
      feelingDown: "",
      historyOfFits: "",
      mentalHealthProblem: "",
      mentalHealthIntervention: "",
    },

    // Case 18: Assessment and Action Taken
    assessmentAction: "",
    majorNCDDetected: "",
    otherDiseaseDetected: "",
    knownCaseDMWithHTN: "",
    telemedicine: "",
    medicineDistributed: "",
    otherAdvices: "",
  });

  const sections = [
    "Health Profile",
    "Health Measurements",
    "HTN Assessment",
    "DM Assessment",
    "Risk Assessment",
    "Oral Cancer",
    "Breast Cancer",
    "Cervical Cancer",
    "CVD Assessment",
    "Post Stroke",
    "CKD Assessment",
    "COPD/TB",
    "Cataract",
    "Hearing Issue",
    "Leprosy",
    "Elderly",
    "Mental Health",
    "Assessment and Action Taken",
    "ABHA ID Status",
  ];

  useEffect(() => {
    const fm_id = localStorage.getItem("current_fm_id");
    if (fm_id) {
      setCurrentFmId(fm_id);
      fetchPersonalInfo(fm_id);
    }
  }, []);

  const fetchPersonalInfo = async (fm_id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/personal-info/${fm_id}`
      );
      if (response.data.success) {
        const fetchedData = response.data.data;
        const formattedDate = fetchedData.dob
          ? new Date(fetchedData.dob).toISOString().split("T")[0]
          : "";
        const cardData = location?.state?.data?.Aadhar ? location?.state?.data?.Aadhar : fetchedData?.card_number ? fetchedData?.card_number : ''
        const identifier = location?.state?.data?.identifier ? location?.state?.data?.identifier : fetchedData?.identifier ? fetchedData?.identifier : ''
        setFormData({ ...fetchedData, dob: formattedDate, card_number: cardData, identifier: identifier });
        localStorage.setItem("sex", fetchedData.sex);
        localStorage.setItem("age", fetchedData.dob);
      }
    } catch (error) {
      console.error("Error fetching personal information:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentPage < 19) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/review", { state: { currentFmId } });
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setIsSidebarOpen(false);
  };

  const renderFormPage = () => {
    const sex = localStorage.getItem("sex");
    switch (currentPage) {
      case 1:
        return (
          <HealthProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleNext={() => {
              const fm_id = localStorage.getItem("current_fm_id");
              if (fm_id) {
                setCurrentFmId(fm_id);
                fetchPersonalInfo(fm_id);
              }
              setTimeout(() => {
                setCurrentPage(currentPage + 1);
              }, 300);
            }}
          />
        );
      case 2:
        return <HealthMeasurements
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 3:
        return <HTNAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 4:
        return <DMAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 5:
        return <RiskAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 6:
        return <OralCancerAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 7:
        return <BreastCancerAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 8:
        return (sex == "female" || sex == "F") ? (
          <CervicalCancerAssessment
            handleBack={handleBack}
            handleNext={handleNext}
            currentFmId={currentFmId}
          />
        ) : (
          <div>
            <div>Cervical Cancer Assessment is not applicable.</div>
            <footer className="form-footer">
              <button onClick={handleBack}>
                Back
              </button>
              <button onClick={handleNext}>
                Save & Next
              </button>
            </footer>
          </div>
        );
      case 9:
        return <CVDAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 10:
        return <PostStrokeAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 11:
        return <CKDAssessment
          handleBack={handleBack}
          handleNext={handleNext}
          currentFmId={currentFmId}
        />;
      case 12:
        return <COPDTBAssessment
          handleBack={handleBack}
          handleNext={handleNext}
          currentFmId={currentFmId}
        />;
      case 13:
        return <CataractAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 14:
        return <HearingIssue
          handleBack={handleBack}
          handleNext={handleNext}
          currentFmId={currentFmId}
        />;
      case 15:
        return <LeprosyAssessment
          handleBack={handleBack}
          handleNext={handleNext}
          currentFmId={currentFmId}
        />;
      case 16:
        return <ElderlyAssessment
          currentFmId={currentFmId}
          handleBack={handleBack}
          handleNext={handleNext}
        />;
      case 17:
        return <MentalHealthAssessment
          handleBack={handleBack}
          handleNext={handleNext}
          currentFmId={currentFmId}
        />;
      case 18:
        return <AssessmentAndActionTaken
          handleBack={handleBack}
          handleNext={handleNext}
          currentFmId={currentFmId}
        />;
      case 19:
        return <ABHAIdStatus
          handleBack={handleBack}
          handleNext={handleNext}
          currentFmId={currentFmId}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="form-page">
      <div className="form-icon" onClick={toggleSidebar}>
        <FaList />
      </div>
      <main className="form-content">
        <h2>{sections[currentPage - 1]}</h2>
        {renderFormPage()}
      </main>
      <h5 className="page-no">Page {currentPage}</h5>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sections={sections}
        currentSection={sections[currentPage - 1]}
        onSectionChange={(section) => {
          handlePageChange(sections.indexOf(section) + 1);
          setIsSidebarOpen(false);
        }}
      />
    </div>
  );
};

export default FormPage;
