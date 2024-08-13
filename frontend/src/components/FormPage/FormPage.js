import React, { useState } from "react";
import "./FormPage.css";

const FormPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    // Page 1: Health Profile Form
    patientName: "",
    identifier: "",
    cardNumber: "",
    dob: "",
    sex: "",
    phone: "",
    address: "",
    insurance: "",
    disability: "",

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
  });

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validatePage = (page) => {
    switch (page) {
      case 1:
        return (
          formData.patientName &&
          formData.identifier &&
          formData.cardNumber &&
          formData.dob &&
          formData.sex &&
          formData.phone &&
          formData.address &&
          formData.insurance &&
          formData.disability
        );
      case 2:
        return (
          formData.height &&
          formData.weight &&
          formData.bmi &&
          formData.temp &&
          formData.spo2
        );
      case 3:
        return (
          formData.knownHTN &&
          formData.bp &&
          formData.highBPAction &&
          formData.referredCentreHTN &&
          formData.htnConfirmed
        );
      case 4:
        return (
          formData.knownDM &&
          formData.rbs &&
          formData.highBSAction &&
          formData.referredCentreDM &&
          formData.fasting &&
          formData.pp &&
          formData.random &&
          formData.dmConfirmed
        );
      case 5:
        return (
          formData.age &&
          formData.tobacco &&
          formData.alcohol &&
          formData.waistFemale &&
          formData.waistMale &&
          formData.physicalActivity &&
          formData.familyHistory &&
          formData.riskScore
        );
      case 6:
        return Object.values(formData.oralCancer).every(
          (value) => value !== ""
        );
      case 7:
        return Object.values(formData.breastCancer).every(
          (value) => value !== ""
        );
      case 8:
        return Object.values(formData.cervicalCancer).every(
          (value) => value !== ""
        );
      case 9:
        return Object.values(formData.cvd).every((value) => value !== "");
      case 10:
        return Object.values(formData.postStroke).every(
          (value) => value !== ""
        );
      case 11:
        return Object.values(formData.ckd).every((value) => value !== "");
      case 12:
        return Object.values(formData.copdTb).every((value) => value !== "");
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validatePage(currentPage)) {
      if (currentPage < 12) {
        setCurrentPage(currentPage + 1);
      } else {
        console.log("Final Form Data: ", formData);
        // Submit form or take appropriate action
      }
    } else {
      alert("Please fill all fields before proceeding.");
    }
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
          <div className="form-section">
            <h2>Health Profile Form</h2>
            <div className="form-group">
              <label>Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Identifier *</label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Card Number *</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Sex *</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Insurance *</label>
              <input
                type="text"
                name="insurance"
                value={formData.insurance}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Disability *</label>
              <input
                type="text"
                name="disability"
                value={formData.disability}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h2>Health Measurements</h2>
            <div className="form-group">
              <label>Height (cm) *</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>BMI *</label>
              <input
                type="number"
                name="bmi"
                value={formData.bmi}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Temperature (°C) *</label>
              <input
                type="number"
                name="temp"
                value={formData.temp}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>SpO2 (%) *</label>
              <input
                type="number"
                name="spo2"
                value={formData.spo2}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h2>HTN (Hypertension) Assessment</h2>
            <div className="form-group">
              <label>Known case of HTN *</label>
              <select
                name="knownHTN"
                value={formData.knownHTN}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Pressure (mmHg) *</label>
              <input
                type="text"
                name="bp"
                value={formData.bp}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Action for high BP *</label>
              <select
                name="highBPAction"
                value={formData.highBPAction}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="medication">Medication</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <div className="form-group">
              <label>Referred Centre for HTN *</label>
              <input
                type="text"
                name="referredCentreHTN"
                value={formData.referredCentreHTN}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>HTN Confirmed Date *</label>
              <input
                type="date"
                name="htnConfirmed"
                value={formData.htnConfirmed}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h2>DM (Diabetes Mellitus) Assessment</h2>
            <div className="form-group">
              <label>Known case of DM *</label>
              <select
                name="knownDM"
                value={formData.knownDM}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Random Blood Sugar (mg/dL) *</label>
              <input
                type="number"
                name="rbs"
                value={formData.rbs}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Action for high BS *</label>
              <select
                name="highBSAction"
                value={formData.highBSAction}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="medication">Medication</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <div className="form-group">
              <label>Referred Centre for DM *</label>
              <input
                type="text"
                name="referredCentreDM"
                value={formData.referredCentreDM}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fasting Blood Sugar (mg/dL) *</label>
              <input
                type="number"
                name="fasting"
                value={formData.fasting}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Post Prandial Blood Sugar (mg/dL) *</label>
              <input
                type="number"
                name="pp"
                value={formData.pp}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Random Blood Sugar (mg/dL) *</label>
              <input
                type="number"
                name="random"
                value={formData.random}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>DM Confirmed Date *</label>
              <input
                type="date"
                name="dmConfirmed"
                value={formData.dmConfirmed}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="form-section">
            <h2>Risk Assessment</h2>
            <div className="form-group">
              <label>Age *</label>
              <select
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="0">30-39 years</option>
                <option value="1">40-49 years</option>
                <option value="2">50-59 years</option>
                <option value="3">60 years or above</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tobacco Use *</label>
              <select
                name="tobacco"
                value={formData.tobacco}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="0">Never</option>
                <option value="1">
                  Used to consume in the past/ Sometimes now
                </option>
                <option value="2">Daily</option>
              </select>
            </div>
            <div className="form-group">
              <label>Alcohol Consumption *</label>
              <select
                name="alcohol"
                value={formData.alcohol}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div className="form-group">
              <label>Waist Circumference (Female) *</label>
              <select
                name="waistFemale"
                value={formData.waistFemale}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="0">80 cm or less</option>
                <option value="1">81-90 cm</option>
                <option value="2">More than 90 cm</option>
              </select>
            </div>
            <div className="form-group">
              <label>Waist Circumference (Male) *</label>
              <select
                name="waistMale"
                value={formData.waistMale}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="0">90 cm or less</option>
                <option value="1">91-100 cm</option>
                <option value="2">More than 100 cm</option>
              </select>
            </div>
            <div className="form-group">
              <label>Physical Activity *</label>
              <select
                name="physicalActivity"
                value={formData.physicalActivity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="0">At least 150 minutes in a week</option>
                <option value="1">Less than 150 minutes in a week</option>
              </select>
            </div>
            <div className="form-group">
              <label>Family History of Diabetes *</label>
              <select
                name="familyHistory"
                value={formData.familyHistory}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div className="form-group">
              <label>Risk Score *</label>
              <input
                type="number"
                name="riskScore"
                value={formData.riskScore}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="form-section">
            <h2>Oral Cancer Assessment</h2>
            <div className="form-group">
              <label>Known case of Oral cancer *</label>
              <input
                type="text"
                name="knownCase"
                value={formData.oralCancer.knownCase}
                onChange={(e) => handleInputChange(e, "oralCancer")}
                required
              />
            </div>
            <div className="form-group">
              <label>Treatment Status *</label>
              <input
                type="text"
                name="treatmentStatus"
                value={formData.oralCancer.treatmentStatus}
                onChange={(e) => handleInputChange(e, "oralCancer")}
                required
              />
            </div>
            <div className="form-group">
              <label>Difficulty in opening mouth *</label>
              <select
                name="difficultyOpeningMouth"
                value={formData.oralCancer.difficultyOpeningMouth}
                onChange={(e) => handleInputChange(e, "oralCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {/* Add more fields for oral cancer assessment */}
          </div>
        );
      // Continue with cases 7 to 12 following the same pattern
      case 7:
        return (
          <div className="form-section">
            <h2>Breast Cancer Assessment</h2>
            <div className="form-group">
              <label>Known case of Breast cancer *</label>
              <input
                type="text"
                name="knownCase"
                value={formData.breastCancer.knownCase}
                onChange={(e) => handleInputChange(e, "breastCancer")}
                required
              />
            </div>
            <div className="form-group">
              <label>Treatment Status *</label>
              <input
                type="text"
                name="treatmentStatus"
                value={formData.breastCancer.treatmentStatus}
                onChange={(e) => handleInputChange(e, "breastCancer")}
                required
              />
            </div>
            <div className="form-group">
              <label>Lump in the breast *</label>
              <select
                name="lumpInBreast"
                value={formData.breastCancer.lumpInBreast}
                onChange={(e) => handleInputChange(e, "breastCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood stained discharge from the nipple *</label>
              <select
                name="bloodStainedDischarge"
                value={formData.breastCancer.bloodStainedDischarge}
                onChange={(e) => handleInputChange(e, "breastCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Change in shape and size of breast *</label>
              <select
                name="changeInShape"
                value={formData.breastCancer.changeInShape}
                onChange={(e) => handleInputChange(e, "breastCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Suspected for breast cancer *</label>
              <select
                name="suspectedBreastCancer"
                value={formData.breastCancer.suspectedBreastCancer}
                onChange={(e) => handleInputChange(e, "breastCancer")}
                required
              >
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="2">No</option>
              </select>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="form-section">
            <h2>Cervical Cancer Assessment</h2>
            <div className="form-group">
              <label>Known case of cervical cancer *</label>
              <input
                type="text"
                name="knownCase"
                value={formData.cervicalCancer.knownCase}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              />
            </div>
            <div className="form-group">
              <label>Treatment Status *</label>
              <input
                type="text"
                name="treatmentStatus"
                value={formData.cervicalCancer.treatmentStatus}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              />
            </div>
            <div className="form-group">
              <label>Bleeding between periods *</label>
              <select
                name="bleedingBetweenPeriods"
                value={formData.cervicalCancer.bleedingBetweenPeriods}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Bleeding after menopause *</label>
              <select
                name="bleedingAfterMenopause"
                value={formData.cervicalCancer.bleedingAfterMenopause}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Bleeding after intercourse *</label>
              <select
                name="bleedingAfterIntercourse"
                value={formData.cervicalCancer.bleedingAfterIntercourse}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Foul smelling vaginal discharge *</label>
              <select
                name="foulSmellingDischarge"
                value={formData.cervicalCancer.foulSmellingDischarge}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>VIA Date *</label>
              <input
                type="date"
                name="viaDate"
                value={formData.cervicalCancer.viaDate}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              />
            </div>
            <div className="form-group">
              <label>VIA Result *</label>
              <select
                name="viaResult"
                value={formData.cervicalCancer.viaResult}
                onChange={(e) => handleInputChange(e, "cervicalCancer")}
                required
              >
                <option value="">Select</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="form-section">
            <h2>Cardiovascular Disease (CVD) Assessment</h2>
            <div className="form-group">
              <label>Known case of Heart disease *</label>
              <select
                name="knownHeartDisease"
                value={formData.cvd.knownHeartDisease}
                onChange={(e) => handleInputChange(e, "cvd")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Heart Sound *</label>
              <select
                name="heartSound"
                value={formData.cvd.heartSound}
                onChange={(e) => handleInputChange(e, "cvd")}
                required
              >
                <option value="">Select</option>
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>
            <div className="form-group">
              <label>Heart disease symptom *</label>
              <select
                name="heartDiseaseSymptom"
                value={formData.cvd.heartDiseaseSymptom}
                onChange={(e) => handleInputChange(e, "cvd")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Teleconsultation done *</label>
              <select
                name="teleconsultationDone"
                value={formData.cvd.teleconsultationDone}
                onChange={(e) => handleInputChange(e, "cvd")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Referral done *</label>
              <select
                name="referralDone"
                value={formData.cvd.referralDone}
                onChange={(e) => handleInputChange(e, "cvd")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Name of the centre referred *</label>
              <input
                type="text"
                name="referredCenter"
                value={formData.cvd.referredCenter}
                onChange={(e) => handleInputChange(e, "cvd")}
                required
              />
            </div>
          </div>
        );
      case 10:
        return (
          <div className="form-section">
            <h2>Post Stroke Assessment</h2>
            <div className="form-group">
              <label>History of stroke *</label>
              <select
                name="historyOfStroke"
                value={formData.postStroke.historyOfStroke}
                onChange={(e) => handleInputChange(e, "postStroke")}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of stroke *</label>
              <input
                type="date"
                name="strokeDate"
                value={formData.postStroke.strokeDate}
                onChange={(e) => handleInputChange(e, "postStroke")}
                required
              />
            </div>
            <div className="form-group">
              <label>Present condition *</label>
              <select
                name="presentCondition"
                value={formData.postStroke.presentCondition}
                onChange={(e) => handleInputChange(e, "postStroke")}
                required
              >
                <option value="">Select</option>
                <option value="1">Recovered</option>
                <option value="2">Not recovered</option>
                <option value="3">Need Physiotherapy</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stroke sign/symptoms *</label>
              <select
                name="strokeSignSymptoms"
                value={formData.postStroke.strokeSignSymptoms}
                onChange={(e) => handleInputChange(e, "postStroke")}
                required
              >
                <option value="">Select</option>
                <option value="1">Teleconsultation</option>
                <option value="2">Referral</option>
              </select>
            </div>
            <div className="form-group">
              <label>Name of the centre referred *</label>
              <input
                type="text"
                name="referredCenter"
                value={formData.postStroke.referredCenter}
                onChange={(e) => handleInputChange(e, "postStroke")}
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      {renderFormPage()}
      <div className="button-group">
        {currentPage > 1 && (
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
        )}
        <button onClick={handleNext}>
          {currentPage === 12 ? "Submit" : "Save & Next"}
        </button>
      </div>
    </div>
  );
};

export default FormPage;
