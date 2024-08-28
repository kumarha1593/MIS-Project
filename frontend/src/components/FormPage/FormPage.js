import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FormPage.css";
import { FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
      // localStorage.removeItem("current_fm_id");
    }
  }, []);

  const fetchPersonalInfo = async (fm_id) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/personal-info/${fm_id}`
      );
      if (response.data.success) {
        const fetchedData = response.data.data;
        // Format the date properly
        const formattedDate = fetchedData.dob
          ? new Date(fetchedData.dob).toISOString().split("T")[0]
          : "";
        setFormData({
          ...fetchedData,
          dob: formattedDate,
        });
      }
    } catch (error) {
      console.error("Error fetching personal information:", error);
    }
  };

  // const handleInputChange = (e, section = null) => {
  //   const { name, value } = e.target;
  //   if (section) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [section]: {
  //         ...prevData[section],
  //         [name]: value,
  //       },
  //     }));
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

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
      navigate("/review", { state: { formData } });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSaveDraft = () => {
    console.log("Saving draft...");
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const renderFormPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <HealthProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return <HealthMeasurements currentFmId={currentFmId} />;
      case 3:
        return <HTNAssessment currentFmId={currentFmId} />;
      case 4:
        return <DMAssessment currentFmId={currentFmId} />;
      case 5:
        return <RiskAssessment currentFmId={currentFmId} />;
      case 6:
        return <OralCancerAssessment currentFmId={currentFmId} />;
      case 7:
        return <BreastCancerAssessment currentFmId={currentFmId} />;
      case 8:
        return <CervicalCancerAssessment currentFmId={currentFmId} />;
      case 9:
        return (
          <CVDAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 10:
        return (
          <PostStrokeAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 11:
        return (
          <CKDAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 12:
        return (
          <COPDTBAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 13:
        return (
          <CataractAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 14:
        return (
          <HearingIssue
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 15:
        return (
          <LeprosyAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 16:
        return (
          <ElderlyAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 17:
        return (
          <MentalHealthAssessment
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 18:
        return (
          <AssessmentAndActionTaken
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 19:
        return (
          <ABHAIdStatus
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
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
      <footer className="form-footer">
        <button onClick={handleBack} disabled={currentPage === 1}>
          Back
        </button>
        {/* <button onClick={handleSaveDraft}>Save Draft</button> */}
        <button onClick={handleNext}>
          {currentPage === 19 ? "Submit" : "Next"}
        </button>
      </footer>
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
