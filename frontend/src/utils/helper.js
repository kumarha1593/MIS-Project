import * as Yup from 'yup';
import defaultInstance from '../axiosHelper';
import { API_ENDPOINTS } from './apiEndPoints';
import moment from 'moment';

export const ROLE_TYPE = {
    STATE_COORDINATOR: 'SC',
    ASSISTANT_STATE_COORDINATOR: 'ASC',
    ZONAL_MANAGER: 'ZM',
    SUPER_VISOR: 'SV',
    FIELD_COORDINATOR: 'FC'
};

export const LOGIN_USER_TYPE = {
    NORMAL_USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super-admin',
}

export const governmentIdOptions = [
    { value: 'Aadhar', label: 'Aadhar Card' },
    { value: 'PAN', label: 'PAN Card' },
];

export const extraGovernmentIdOptions = [
    { value: 'License', label: 'License Number' },
    { value: 'Ration', label: 'Ration Card Number' },
    { value: 'Voter', label: 'Voter ID Number' },
];

export const roleOptions = [
    { value: ROLE_TYPE.STATE_COORDINATOR, label: 'State Coordinator', reporting_manager: [] },
    { value: ROLE_TYPE.ASSISTANT_STATE_COORDINATOR, label: 'Assistant State Coordinator', reporting_manager: [{ value: ROLE_TYPE.STATE_COORDINATOR, label: 'State Coordinator', }] },
    { value: ROLE_TYPE.ZONAL_MANAGER, label: 'Zonal Manager', reporting_manager: [{ value: ROLE_TYPE.ASSISTANT_STATE_COORDINATOR, label: 'Assistant State Coordinator' }] },
    { value: ROLE_TYPE.SUPER_VISOR, label: 'Supervisor', reporting_manager: [{ value: ROLE_TYPE.ZONAL_MANAGER, label: 'Zonal Manager', }] },
    { value: ROLE_TYPE.FIELD_COORDINATOR, label: 'Field Coordinator', reporting_manager: [{ value: ROLE_TYPE.SUPER_VISOR, label: 'Supervisor', }] },
];

export const validateAdminForm = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    verification_id_type: Yup.string().required('Verification type is required'),
    verification_id: Yup.string().required('Verification id is required'),
    role: Yup.string().required('User role is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    phone_number: Yup.string().required('Phone number is required').min(10, 'Phone number must be exactly 10 digits'),
});

export const validateFamilyHeadForm = Yup.object().shape({
    name: Yup.string().required('Head of family is required'),
    aadhar: Yup.string().required('Aadhar Number is required'),
    govtId: Yup.string().required('Government id type is required'),
});

export const validateVillageForm = Yup.object().shape({
    village_name: Yup.string().required('Village name is required'),
    village_id: Yup.string().required('Village id is required'),
});

export const validateMemForm = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    aadhar: Yup.string().required('Aadhar is required'),
});


export const getRoleLabel = (role) => roleOptions.find(({ value }) => value === role)?.label || '';
export const getRoleValue = (role) => roleOptions.find(({ label }) => label === role)?.value || '';

export const setUpperLevelParams = (role) => {
    const roleMapping = {
        [ROLE_TYPE.ASSISTANT_STATE_COORDINATOR]: 'State Coordinator',
        [ROLE_TYPE.ZONAL_MANAGER]: 'Assistant State Coordinator',
        [ROLE_TYPE.SUPER_VISOR]: 'Zonal Manager',
        [ROLE_TYPE.FIELD_COORDINATOR]: 'Supervisor',
    };
    return roleMapping[role] || '';
};

export const setLowerLevelParams = (role) => {
    const roleMapping = {
        [ROLE_TYPE.STATE_COORDINATOR]: 'Assistant State Coordinator',
        [ROLE_TYPE.ASSISTANT_STATE_COORDINATOR]: 'Zonal Manager',
        [ROLE_TYPE.ZONAL_MANAGER]: 'Supervisor',
        [ROLE_TYPE.SUPER_VISOR]: 'Field Coordinator',
    };
    return roleMapping[role] || '';
};

export const getUserDataByRole = async (queryParams, successCallBack) => {
    try {
        const params = {
            user_type: setLowerLevelParams(queryParams?.role_type),
            ...queryParams,
        }
        delete params?.role_type;
        const response = await defaultInstance.get(API_ENDPOINTS.USER_LIST, { params: params });
        if (response?.data?.success) {
            const list = response?.data?.data?.length > 0 ? response?.data?.data : []
            list?.map((item) => {
                item.is_open = false;
                item.is_checked = false;
                return item;
            });
            successCallBack(list);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

export const getFilterQuery = (data) => {

    const queryParams = {
        from_date: data?.from_date || moment().format('YYYY-MM-DD'),
        to_date: data?.to_date || moment().format('YYYY-MM-DD'),
        search_term: data?.search_term || '',
        page_limit: data?.page_limit || 50,
        skip_count: data?.skip_count || 0,
        status: data?.status == "all" ? "" : data?.status ? data?.status : 1,
        role_type: data?.role_type || '',
        village: data?.village || '',
        district: data?.district || '',
        health_facility: data?.health_facility || '',
        risk_score: data?.risk_score || '',
        case_of_htn: data?.case_of_htn || '',
        case_of_dm: data?.case_of_dm || '',
        suspected_oral_cancer: data?.suspected_oral_cancer || '',
        suspected_breast_cancer: data?.suspected_breast_cancer || '',
        cervical_cancer: data?.cervical_cancer || '',
        known_cvd: data?.known_cvd || '',
        history_of_stroke: data?.history_of_stroke || '',
        known_ckd: data?.known_ckd || '',
        cataract_assessment_result: data?.cataract_assessment_result || '',
        difficulty_hearing: data?.difficulty_hearing || '',
        leprosy: data?.leprosy || '',
        abhaid_status: data?.abhaid_status || '',
        sex: data?.sex || '',
        age: data?.age || '',
        alcohol_use: data?.alcohol_use || '',
        disability: data?.disability || '',
    }

    const queryString = new URLSearchParams(queryParams).toString();

    return queryString
}


export const getScreeningFilterQuery = (data) => {

    const queryParams = {
        from_date: data?.from_date || moment().format('YYYY-MM-DD'),
        to_date: data?.to_date || moment().format('YYYY-MM-DD'),
        search_term: data?.search_term || '',
        page_limit: data?.page_limit || 400,
        skip_count: data?.skip_count || 0,
        role_type: data?.role_type || '',
    }

    const queryString = new URLSearchParams(queryParams).toString();

    return queryString
}

export const riskScore = [
    { label: 'Select', value: "" },
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
]

export const yesNoOptions = [
    { label: 'Select', value: "" },
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
]

export const AbhaIdStatus = [
    { label: 'Select', value: "" },
    { label: 'None', value: "None" },
    { label: 'Created', value: 'Created' },
    { label: 'Linked', value: 'Linked' },
]

export const occupationalExposure = [
    { label: 'Select', value: "" },
    { label: 'No', value: "No" },
    { label: 'Crop residue burning', value: 'Crop residue burning' },
    { label: 'Burning of garbage/leaves', value: 'Burning of garbage/leaves' },
    { label: 'Working in industries with smoke, gas, and dust exposure', value: 'Working in industries with smoke, gas, and dust exposure' },
]

export const typeOfFuelUsedForCooking = [
    { label: 'Select', value: "" },
    { label: 'Firewood', value: "Firewood" },
    { label: 'Crop Residue', value: "Crop Residue" },
    { label: 'Cow dung cake', value: "Cow dung cake" },
    { label: 'Coal', value: "Coal" },
    { label: 'Kerosene', value: "Kerosene" },
    { label: 'LPG', value: "LPG" },
]

export const sex = [
    { label: 'Select', value: "" },
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
]

export const mentalHealthProblem = [
    { label: 'Select', value: "" },
    { label: 'Depression', value: 'Depression' },
    { label: 'Alcohol dependence', value: 'Alcohol dependence' },
    { label: 'Common Mental Health', value: 'Common Mental Health' },
    { label: 'No', value: 'No' },
]

export const age = [
    { label: 'Select', value: "" },
    { label: '18-29 Years', value: '18-29 years' },
    { label: '30-39 Years', value: '30-39 years' },
    { label: '40-49 Years', value: '40-49 years' },
    { label: '50-59 Years', value: '50-59 years' },
    { label: '60 years or above', value: '60 years or above' },
]
export const tobaccoUse = [
    { label: 'Select', value: "" },
    { label: 'Never', value: 'Never' },
    { label: 'Used to consume in the past/ Sometimes now', value: 'Used to consume in the past/ Sometimes now' },
    { label: 'Daily', value: 'Daily' },
]

export const waistCircumference = [
    { label: 'Select', value: "" },
    { label: '90 cm or less', value: '90 cm or less' },
    { label: '91-100 cm', value: '91-100 cm' },
    { label: 'More than 100 cm', value: 'More than 100 cm' },
]

export const physicalActivity = [
    { label: 'Select', value: "" },
    { label: 'At least 150 minutes in a week', value: 'At least 150 minutes in a week' },
    { label: 'Less than 150 minutes in a week', value: 'Less than 150 minutes in a week' },
]

export const feeling = [
    { value: "", label: "Select" },
    { value: "Not at all", label: "Not at all" },
    { value: "Several days", label: "Several days" },
    { value: "More than half the day", label: "More than half the day" },
    { value: "Nearly every day", label: "Nearly every day" }
]

export const htnOptions = [
    { label: 'Select', value: "" },
    { label: 'Yes and on treatment', value: 'yes and on treatment' },
    { label: 'Yes and not on treatment', value: 'yes and on treatment' },
    { label: 'No', value: 'No' },
]

export const knowCkdOptions = [
    { label: 'Select', value: "" },
    { label: 'Yes, on treatment', value: 'Yes, on treatment' },
    { label: 'Yes, not on treatment', value: 'Yes, not on treatment' },
    { label: 'No', value: 'No' },
]

export const heartSound = [
    { label: 'Select', value: "" },
    { label: 'Normal', value: 'Normal' },
    { label: 'Abnormal', value: 'Abnormal' },
]

export const cataract = [
    { label: 'Select', value: "" },
    { label: 'Suspected', value: 'Suspected' },
    { label: 'Not Suspected', value: 'Not Suspected' },
]

export const identifier = [
    { label: 'Select Identifier', value: "" },
    { label: 'ABHA ID', value: 'ABHA' },
    { label: 'Aadhar Card', value: 'Aadhar' },
    { label: 'Voter ID', value: 'Voter' },
]

export const allParameters = [
    { label: "ID", value: "fm_id" },
    { label: "Field Coordinator Name", value: "field_coordinator_name" },
    { label: "Head of Family Name", value: "head_of_family" },
    { label: "Family Member's Name", value: "pi_name" },
    { label: "District", value: "district" },
    { label: "Health Facility", value: "health_facility" },
    { label: "Village", value: "village", type: 'village' },
    { label: "Screening Date", value: "screening_date", type: 'date' },
    { label: "Identifier", value: "pi_identifier", },
    { label: "Card Number", value: "pi_card_number", },
    { label: "Date of Birth", value: "pi_dob", type: 'date' },
    { label: "Sex", value: "pi_sex", },
    { label: "Telephone Number", value: "pi_tel_no", },
    { label: "Address", value: "pi_address" },
    { label: "State Health Insurance", value: "pi_state_health_insurance", },
    { label: "State Health Insurance Remark", value: "pi_state_health_insurance_remark" },
    { label: "Disability", value: "pi_disability", },
    { label: "Disability Remark", value: "pi_disability_remark" },
    { label: "Height", value: "height" },
    { label: "Weight", value: "weight" },
    { label: "BMI", value: "bmi" },
    { label: "Temperature", value: "temperature" },
    { label: "SpO2", value: "spO2" },
    { label: "Pulse", value: "pulse" },
    { label: "Case of Hypertension", value: "case_of_htn" },
    { label: "Action for High Blood Pressure", value: "action_high_bp" },
    { label: "Referral Center for Hypertension", value: "referral_center_htn" },
    { label: "Upper Blood Pressure", value: "upper_bp" },
    { label: "Lower Blood Pressure", value: "lower_bp" },
    { label: "Case of Diabetes", value: "case_of_dm" },
    { label: "Action for High Blood Sugar", value: "action_high_bs" },
    { label: "Referral Center for Diabetes", value: "referral_center_dm" },
    { label: "Fasting Blood Sugar", value: "fasting_blood_sugar" },
    { label: "Post-Prandial Blood Sugar", value: "post_prandial_blood_sugar" },
    { label: "Random Blood Sugar", value: "random_blood_sugar" },
    { label: "Age", value: "age", },
    { label: "Tobacco Use", value: "tobacco_use" },
    { label: "Alcohol Use", value: "alcohol_use" },
    { label: "Waist (Female)", value: "waist_female" },
    { label: "Waist (Male)", value: "waist_male" },
    { label: "Physical Activity", value: "physical_activity" },
    { label: "Family History of Diabetes", value: "family_diabetes_history" },
    { label: "Risk Score", value: "risk_score" },
    { label: "Known Oral Cancer Case", value: "oc_known_case" },
    { label: "Persistent Ulcer", value: "persistent_ulcer" },
    { label: "Persistent Patch", value: "persistent_patch" },
    { label: "Difficulty Chewing", value: "difficulty_chewing" },
    { label: "Difficulty Opening Mouth", value: "difficulty_opening_mouth" },
    { label: "Growth in Mouth", value: "growth_in_mouth" },
    { label: "Swelling in Neck", value: "swelling_in_neck" },
    { label: "Suspected Oral Cancer", value: "suspected_oral_cancer" },
    { label: "Known Breast Cancer Case", value: "bc_known_case" },
    { label: "Lump in Breast", value: "lump_in_breast" },
    { label: "Blood-Stained Discharge", value: "blood_stained_discharge" },
    { label: "Change in Shape", value: "change_in_shape" },
    { label: "Constant Pain or Swelling", value: "constant_pain_or_swelling" },
    { label: "Redness or Ulcer", value: "redness_or_ulcer" },
    { label: "Suspected Breast Cancer", value: "suspected_breast_cancer" },
    { label: "Known Cervical Cancer Case", value: "cc_known_case" },
    { label: "Bleeding Between Periods", value: "bleeding_between_periods" },
    { label: "Bleeding After Menopause", value: "bleeding_after_menopause" },
    { label: "Bleeding After Intercourse", value: "bleeding_after_intercourse" },
    { label: "Foul-Smelling Discharge", value: "foul_smelling_discharge" },
    { label: "VIA Appointment Date", value: "via_appointment_date" },
    { label: "VIA Result", value: "via_result" },
    { label: "Known Cardiovascular Disease Case", value: "cvd_known_case" },
    { label: "Heart Sound", value: "heart_sound" },
    { label: "Symptom", value: "symptom" },
    { label: "CVD Date", value: "cvd_date" },
    { label: "Suspected Cardiovascular Disease", value: "suspected_cvd" },
    { label: "CVD Teleconsultation", value: "cvd_teleconsultation" },
    { label: "CVD Referral", value: "cvd_referral" },
    { label: "CVD Referral Centre", value: "cvd_referral_centre" },
    { label: "History of Stroke", value: "history_of_stroke" },
    { label: "Stroke Date", value: "stroke_date" },
    { label: "Present Condition", value: "present_condition" },
    { label: "Stroke Sign Action", value: "stroke_sign_action" },
    { label: "Referral Center Name", value: "referral_center_name" },
    { label: "Known CKD Case", value: "known_ckd" },
    { label: "History of CKD Stone", value: "history_ckd_stone" },
    { label: "Age Above 50", value: "age_above_50" },
    { label: "Hypertension Patient", value: "hypertension_patient" },
    { label: "Diabetes Patient", value: "diabetes_patient" },
    { label: "Anemia Patient", value: "anemia_patient" },
    { label: "History of Stroke (CKD)", value: "history_of_stroke_ckd" },
    { label: "Swelling in Face or Leg", value: "swelling_face_leg" },
    { label: "History of NSAIDs Use", value: "history_nsaids" },
    { label: "CKD Risk Score", value: "ckd_risk_score" },
    { label: "Risk Assessment", value: "risk_assessment" },
    { label: "Known CRD Case", value: "known_case_crd" },
    { label: "CRD Specify", value: "crd_specify" },
    { label: "Occupational Exposure", value: "occupational_exposure" },
    { label: "Cooking Fuel Type", value: "cooking_fuel_type" },
    { label: "Chest Sound", value: "chest_sound" },
    { label: "Chest Sound Action", value: "chest_sound_action" },
    { label: "Referral Center Name (Chest)", value: "referral_center_name_ct" },
    { label: "COPD Confirmed", value: "copd_confirmed" },
    { label: "COPD Confirmation Date", value: "copd_confirmation_date" },
    { label: "Shortness of Breath", value: "shortness_of_breath" },
    { label: "Coughing More Than 2 Weeks", value: "coughing_more_than_2_weeks" },
    { label: "Blood in Sputum", value: "blood_in_sputum" },
    { label: "Fever More Than 2 Weeks", value: "fever_more_than_2_weeks" },
    { label: "Night Sweats", value: "night_sweats" },
    { label: "Taking Anti-TB Drugs", value: "taking_anti_tb_drugs" },
    { label: "Family History of TB", value: "family_tb_history" },
    { label: "History of TB", value: "history_of_tb" },
    { label: "Cloudy or Blurred Vision", value: "cloudy_blurred_vision" },
    { label: "Pain or Redness", value: "pain_or_redness" },
    { label: "Cataract Assessment Result", value: "cataract_assessment_result" },
    { label: "Difficulty Hearing", value: "difficulty_hearing" },
    { label: "Hypopigmented Patch", value: "hypopigmented_patch" },
    { label: "Recurrent Ulceration", value: "recurrent_ulceration" },
    { label: "Clawing of Fingers", value: "clawing_of_fingers" },
    { label: "Inability to Close Eyelid", value: "inability_to_close_eyelid" },
    { label: "Difficulty Holding Objects", value: "difficulty_holding_objects" },
    { label: "Unsteady Walking", value: "unsteady_walking" },
    { label: "Physical Disability", value: "physical_disability" },
    { label: "Help from Others", value: "help_from_others" },
    { label: "Forget Names", value: "forget_names" },
    { label: "Little Interest or Pleasure", value: "little_interest_or_pleasure" },
    { label: "Feeling Down or Depressed", value: "feeling_down_or_depressed" },
    { label: "Mental Health Score", value: "mental_health_score" },
    { label: "Mental Health Problem", value: "mental_health_problem" },
    { label: "History of Fits", value: "history_of_fits" },
    { label: "Other Mental Disorder", value: "other_mental_disorder" },
    { label: "Brief Intervention Given", value: "brief_intervention_given" },
    { label: "Intervention Type", value: "intervention_type" },
    { label: "Major NCD Detected", value: "major_ncd_detected" },
    { label: "Any Other Disease Detected", value: "any_other_disease_detected" },
    { label: "Known Case of DM/HTN", value: "known_case_dm_htn", },
    { label: "Teleconsultation", value: "teleconsultation" },
    { label: "Prescription Given", value: "prescription_given" },
    { label: "Other Advices", value: "other_advices" },
    { label: "Remarks", value: "remarks" },
    { label: "ABHA ID Status", value: "abha_id_status" },
];

export const inputFields = [
    { label: "Name", key: "pi_name", type: 'text', required: false, options: [] },
    { label: "Identifier", key: "pi_identifier", type: 'select', options: identifier, required: false },
    { label: "Card Number", key: "pi_card_number", type: 'number', required: false, options: [] },
    { label: "Date of Birth", key: "pi_dob", type: 'date', required: false, options: [] },
    { label: "Sex", key: "pi_sex", type: 'select', options: sex, required: false },
    { label: "Phone Number", key: "pi_tel_no", type: 'number', required: false, options: [] },
    { label: "Address", key: "pi_address", type: 'text', required: false, options: [] },
    { label: "Health Insurance (State/Government/Private)", key: "pi_state_health_insurance", type: 'select', options: yesNoOptions, required: false },
    { label: "Disability", key: "pi_disability", type: 'select', options: yesNoOptions, required: false },
    { label: "Height (cm) *", key: "height", type: 'text', required: true, options: [] },
    { label: "Weight (kg) *", key: "weight", type: 'text', required: true, options: [] },
    { label: "BMI *", key: "bmi", type: 'text', required: true, options: [] },
    { label: "Temperature (°F) *", key: "temperature", type: 'text', required: true, options: [] },
    { label: "SpO2 (%) *", key: "spO2", type: 'text', required: true, options: [] },
    { label: "Pulse (bpm) *", key: "pulse", type: 'text', required: true, options: [] },
    { label: "Known case of HTN *", key: "case_of_htn", type: 'select', options: htnOptions, required: true },
    { label: "Upper BP (mmHg) *", key: "upper_bp", type: 'text', required: true, options: [] },
    { label: "Lower BP (mmHg) *", key: "lower_bp", type: 'text', required: true, options: [] },
    { label: "Known case of DM *", key: "case_of_dm", type: 'select', required: true, options: htnOptions },
    { label: "Fasting Blood Sugar (mg/dL)", key: "fasting_blood_sugar", type: 'text', required: false, options: [] },
    { label: "Post Prandial Blood Sugar (mg/dL)", key: "post_prandial_blood_sugar", type: 'text', required: false, options: [] },
    { label: "Random Blood Sugar (mg/dL)", key: "random_blood_sugar", type: 'text', required: false, options: [] },
    { label: "Age *", key: "age", type: 'select', required: true, options: age },
    { label: "Tobacco Use *", key: "tobacco_use", type: 'select', required: true, options: tobaccoUse },
    { label: "Alcohol Consumption *", key: "alcohol_use", type: 'select', required: true, options: yesNoOptions },
    { label: "Waist Circumference (Male) *", key: "waist_male", type: 'select', required: true, options: waistCircumference },
    { label: "Physical Activity *", key: "physical_activity", type: 'select', required: true, options: physicalActivity },
    { label: "Family History of Diabetes *", key: "family_diabetes_history", type: 'select', required: true, options: yesNoOptions },
    { label: "Risk Score *", key: "risk_score", type: 'select', required: true, options: riskScore },

    // { label: "Known Case *", key: "known_case", type: 'select', required: true, options: htnOptions },

    { label: "Persistent Ulcer *", key: "persistent_ulcer", type: 'select', required: true, options: yesNoOptions },
    { label: "Persistent Patch *", key: "persistent_patch", type: 'select', required: true, options: yesNoOptions },
    { label: "Difficulty Chewing *", key: "difficulty_chewing", type: 'select', required: true, options: yesNoOptions },
    { label: "Difficulty Opening Mouth *", key: "difficulty_opening_mouth", type: 'select', required: true, options: yesNoOptions },
    { label: "Growth in Mouth *", key: "growth_in_mouth", type: 'select', required: true, options: yesNoOptions },

    // { label: "Sudden change in voice *", key: "sudden_change_in_voice", type: 'select', required: true, options: yesNoOptions },

    { label: "Suspected Oral Cancer *", key: "suspected_oral_cancer", type: 'select', required: true, options: yesNoOptions },
    { label: "Lump in Breast *", key: "lump_in_breast", type: 'select', required: true, options: yesNoOptions },
    { label: "Blood-Stained Discharge *", key: "blood_stained_discharge", type: 'select', required: true, options: yesNoOptions },
    { label: "Change in Shape *", key: "change_in_shape", type: 'select', required: true, options: yesNoOptions },
    { label: "Constant Pain or Swelling *", key: "constant_pain_or_swelling", type: 'select', required: true, options: yesNoOptions },
    { label: "Redness or Ulcer *", key: "redness_or_ulcer", type: 'select', required: true, options: yesNoOptions },
    { label: "Suspected Breast Cancer *", key: "suspected_breast_cancer", type: 'select', required: true, options: yesNoOptions },
    { label: "Heart Sound *", key: "heart_sound", type: 'select', required: true, options: heartSound },
    { label: "Symptom *", key: "symptom", type: 'select', required: true, options: yesNoOptions },
    { label: "CVD Date *", key: "cvd_date", type: 'date', required: true, options: [] },
    { label: "Suspected CVD *", key: "suspected_cvd", type: 'select', required: true, options: yesNoOptions },
    { label: "History of Stroke *", key: "history_of_stroke", type: 'select', required: true, options: yesNoOptions },
    { label: "Known case of CKD *", key: "known_ckd", type: 'select', required: true, options: knowCkdOptions },
    { label: "History of CKD/Stone *", key: "history_ckd_stone", type: 'select', required: true, options: yesNoOptions },
    { label: "Age Above 50 *", key: "age_above_50", type: 'select', required: true, options: yesNoOptions },
    { label: "Hypertension Patient *", key: "hypertension_patient", type: 'select', required: true, options: yesNoOptions },
    { label: "Diabetes Patient *", key: "diabetes_patient", type: 'select', required: true, options: yesNoOptions },
    { label: "Anemia Patient *", key: "anemia_patient", type: 'select', required: true, options: yesNoOptions },
    { label: "Swelling on Face and Leg *", key: "swelling_face_leg", type: 'select', required: true, options: yesNoOptions },
    { label: "History of NSAIDS *", key: "history_nsaids", type: 'select', required: true, options: yesNoOptions },
    { label: "Risk Assessment *", key: "risk_assessment", type: 'text', required: true, options: [] },
    { label: "Known case of chronic respiratory diseases (ASTHMA/COPD/OTHERS) *", key: "known_case_crd", type: 'select', required: true, options: yesNoOptions },
    { label: "Occupational Exposure *", key: "occupational_exposure", type: 'select', required: true, options: occupationalExposure },
    { label: "Type of Fuel Used for Cooking *", key: "cooking_fuel_type", type: 'select', required: true, options: typeOfFuelUsedForCooking },
    { label: "Shortness of Breath *", key: "shortness_of_breath", type: 'select', required: true, options: yesNoOptions },
    { label: "Coughing for More Than 2 Weeks *", key: "coughing_more_than_2_weeks", type: 'select', required: true, options: yesNoOptions },
    { label: "Blood in Sputum *", key: "blood_in_sputum", type: 'select', required: true, options: yesNoOptions },
    { label: "Fever for More Than 2 Weeks *", key: "fever_more_than_2_weeks", type: 'select', required: true, options: yesNoOptions },
    { label: "Night Sweats *", key: "night_sweats", type: 'select', required: true, options: yesNoOptions },
    { label: "Are you currently taking anti-TB drugs? *", key: "taking_anti_tb_drugs", type: 'select', required: true, options: yesNoOptions },
    { label: "Anyone in family currently suffering from TB *", key: "family_tb_history", type: 'select', required: true, options: yesNoOptions },
    { label: "History of TB *", key: "history_of_tb", type: 'select', required: true, options: yesNoOptions },
    { label: "Do you have cloudy or blurred vision? *", key: "cloudy_blurred_vision", type: 'select', required: true, options: yesNoOptions },
    { label: "Pain or redness in eyes lasting for more than a week *", key: "pain_or_redness", type: 'select', required: true, options: yesNoOptions },
    { label: "Cataract Assessment Result *", key: "cataract_assessment_result", type: 'select', required: true, options: cataract },
    { label: "Do you have difficulty in hearing? *", key: "difficulty_hearing", type: 'select', required: true, options: yesNoOptions },

    // { label: "Hypopigmented or discolored lesion(s) with loss of sensation *", key: "hypopigmented_or_discolored_lesions_loss_of_sensation", type: 'select', required: true, options: yesNoOptions },

    { label: "Recurrent ulceration on palm or sole *", key: "recurrent_ulceration", type: 'select', required: true, options: yesNoOptions },
    { label: "Clawing of fingers or tingling/numbness in hands/feet *", key: "clawing_of_fingers", type: 'select', required: true, options: yesNoOptions },
    { label: "Inability to close eyelid *", key: "inability_to_close_eyelid", type: 'select', required: true, options: yesNoOptions },
    { label: "Difficulty in holding objects or weakness in feet *", key: "difficulty_holding_objects", type: 'select', required: true, options: yesNoOptions },
    { label: "Do you feel unsteady while standing or walking? *", key: "unsteady_walking", type: 'select', required: true, options: yesNoOptions },
    { label: "Are you suffering from any physical disability? *", key: "physical_disability", type: 'select', required: true, options: yesNoOptions },

    // { label: "Do you need help with everyday activities? *", key: "need_help_with_activities", type: 'select', required: true, options: yesNoOptions },
    // { label: "Do you forget names of near ones or your address? *", key: "forget_names_or_address", type: 'select', required: true, options: yesNoOptions },

    { label: "Little interest or pleasure in doing things? *", key: "little_interest_or_pleasure", type: 'select', required: true, options: feeling },
    { label: "Feeling down, depressed, or hopeless? *", key: "feeling_down_or_depressed", type: 'select', required: true, options: feeling },
    { label: "Mental Health Score:", key: "mental_health_score", type: 'text', required: true, options: [] },
    { label: "Mental Health problem detected through the questionnaire *", key: "mental_health_problem", type: 'select', required: true, options: mentalHealthProblem },
    { label: "History of fits *", key: "history_of_fits", type: 'select', required: true, options: yesNoOptions },
    { label: "Other mental disorder *", key: "other_mental_disorder", type: 'select', required: true, options: yesNoOptions },
    { label: "Brief intervention given? *", key: "brief_intervention_given", type: 'select', required: true, options: yesNoOptions },
    { label: "Major NCD Detected", key: "major_ncd_detected", type: 'text', required: true, options: [] },
    { label: "Any Other Disease Detected", key: "any_other_disease_detected", type: 'text', required: true, options: [] },
    { label: "Known Case of DM with HTN", key: "known_case_dm_htn", type: 'text', required: true, options: [] },
    { label: "Teleconsultation", key: "cvd_teleconsultation", type: 'select', required: true, options: yesNoOptions },
    { label: "Prescription Given", key: "prescription_given", type: 'select', required: true, options: yesNoOptions },
    { label: "Other Advices", key: "other_advices", type: 'text', required: true, options: [] },
    { label: "Remarks", key: "remarks", type: 'text', required: true, options: [] },
    { label: "ABHA ID Status", key: "abha_id_status", type: 'select', required: true, options: AbhaIdStatus },
    { label: "Screening Date", key: "screening_date", type: 'date', required: true, options: [] },
]

export const formFields = {
    "pi_name": "",
    "pi_identifier": "",
    "pi_card_number": "",
    "pi_dob": "",
    "pi_sex": "",
    "pi_tel_no": "",
    "pi_address": "",
    "pi_state_health_insurance": "",
    "pi_disability": "",
    "height": "",
    "weight": "",
    "bmi": "",
    "temperature": "",
    "spO2": "",
    "pulse": "",
    "case_of_htn": "",
    "upper_bp": "",
    "lower_bp": "",
    "case_of_dm": "",
    "fasting_blood_sugar": "",
    "post_prandial_blood_sugar": "",
    "random_blood_sugar": "",
    "age": "",
    "tobacco_use": "",
    "alcohol_use": "",
    "waist_male": "",
    "physical_activity": "",
    "family_diabetes_history": "",
    "risk_score": "",
    "persistent_ulcer": "",
    "persistent_patch": "",
    "difficulty_chewing": "",
    "difficulty_opening_mouth": "",
    "growth_in_mouth": "",
    "suspected_oral_cancer": "",
    "lump_in_breast": "",
    "blood_stained_discharge": "",
    "change_in_shape": "",
    "constant_pain_or_swelling": "",
    "redness_or_ulcer": "",
    "suspected_breast_cancer": "",
    "heart_sound": "",
    "symptom": "",
    "cvd_date": "",
    "suspected_cvd": "",
    "history_of_stroke": "",
    "known_ckd": "",
    "history_ckd_stone": "",
    "age_above_50": "",
    "hypertension_patient": "",
    "diabetes_patient": "",
    "anemia_patient": "",
    "swelling_face_leg": "",
    "history_nsaids": "",
    "risk_assessment": "",
    "known_case_crd": "",
    "occupational_exposure": "",
    "cooking_fuel_type": "",
    "shortness_of_breath": "",
    "coughing_more_than_2_weeks": "",
    "blood_in_sputum": "",
    "fever_more_than_2_weeks": "",
    "night_sweats": "",
    "taking_anti_tb_drugs": "",
    "family_tb_history": "",
    "history_of_tb": "",
    "cloudy_blurred_vision": "",
    "pain_or_redness": "",
    "cataract_assessment_result": "",
    "difficulty_hearing": "",
    "recurrent_ulceration": "",
    "clawing_of_fingers": "",
    "inability_to_close_eyelid": "",
    "difficulty_holding_objects": "",
    "unsteady_walking": "",
    "physical_disability": "",
    "little_interest_or_pleasure": "",
    "feeling_down_or_depressed": "",
    "mental_health_score": "",
    "mental_health_problem": "",
    "history_of_fits": "",
    "other_mental_disorder": "",
    "brief_intervention_given": "",
    "major_ncd_detected": "",
    "any_other_disease_detected": "",
    "known_case_dm_htn": "",
    "cvd_teleconsultation": "",
    "prescription_given": "",
    "other_advices": "",
    "remarks": "",
    "abha_id_status": "",
    "screening_date": ""
}