import * as Yup from 'yup';
import defaultInstance from '../axiosHelper';
import { API_ENDPOINTS } from './apiEndPoints';

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

export const getUserDataByRole = async (roleType, successCallBack) => {
    try {
        const response = await defaultInstance.get(API_ENDPOINTS.USER_LIST, { params: { user_type: setLowerLevelParams(roleType) } });
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
export const allParameters = [
    {
        "label": "Name",
        "key": "name"
    },
    {
        "label": "Identifier",
        "key": "identifier"
    },
    {
        "label": "Card Number",
        "key": "card_number"
    },
    {
        "label": "Date of Birth",
        "key": "dob"
    },
    {
        "label": "Sex",
        "key": "sex"
    },
    {
        "label": "Telephone Number",
        "key": "tel_no"
    },
    {
        "label": "Address",
        "key": "address"
    },
    {
        "label": "State Health Insurance",
        "key": "state_health_insurance"
    },
    {
        "label": "State Health Insurance Remark",
        "key": "state_health_insurance_remark"
    },
    {
        "label": "Disability",
        "key": "disability"
    },
    {
        "label": "Disability Remark",
        "key": "disability_remark"
    },
    {
        "label": "Height",
        "key": "height"
    },
    {
        "label": "Weight",
        "key": "weight"
    },
    {
        "label": "BMI",
        "key": "bmi"
    },
    {
        "label": "Temperature",
        "key": "temp"
    },
    {
        "label": "SPO2",
        "key": "spO2"
    },
    {
        "label": "Known HTN",
        "key": "case_of_htn"
    },
    {
        "label": "Blood Pressure"
    },
    {
        "label": "High BP Action",
        "key": "action_high_bp"
    },
    {
        "label": "Referred Centre for HTN",
        "key": "referral_center"
    },
    {
        "label": "HTN Confirmed",
        "key": "htn_id"
    },
    {
        "label": "Known DM",
        "key": "case_of_dm"
    },
    {
        "label": "Random Blood Sugar (RBS)",
        "key": "random_blood_sugar"
    },
    {
        "label": "High Blood Sugar Action",
        "key": "action_high_bs"
    },
    {
        "label": "Referred Centre for DM",
        "key": "referral_center"
    },
    {
        "label": "Fasting",
        "key": "fasting_blood_sugar"
    },
    {
        "label": "Post Prandial (PP)",
        "key": "post_prandial_blood_sugar"
    },
    {
        "label": "Random Blood Sugar"
    },
    {
        "label": "DM Confirmed",
        "key": "dm_id"
    },
    {
        "label": "Age",
        "key": "age"
    },
    {
        "label": "Tobacco Use",
        "key": "tobacco_use"
    },
    {
        "label": "Alcohol Use",
        "key": "alcohol_use"
    },
    {
        "label": "Waist (Female)",
        "key": "waist_female"
    },
    {
        "label": "Waist (Male)",
        "key": "waist_male"
    },
    {
        "label": "Physical Activity",
        "key": "physical_activity"
    },
    {
        "label": "Family History",
        "key": "family_diabetes_history"
    },
    {
        "label": "Risk Score",
        "key": "risk_score"
    },
    {
        "label": "Oral Cancer Known Case",
        "key": "known_case"
    },
    {
        "label": "Oral Cancer Treatment Status",
        "key": "persistent_ulcer"
    },
    {
        "label": "Difficulty Opening Mouth",
        "key": "difficulty_opening_mouth"
    },
    {
        "label": "Ulcers in Mouth",
        "key": "persistent_ulcer"
    },
    {
        "label": "Growth in Mouth",
        "key": "growth_in_mouth"
    },
    {
        "label": "Sudden Voice Change",
        "key": "swelling_in_neck"
    },
    {
        "label": "White or Red Patch",
        "key": "suspected_oral_cancer"
    },
    {
        "label": "White or Red Patch Not Healed",
        "key": "persistent_patch"
    },
    {
        "label": "Pain While Chewing",
        "key": "difficulty_chewing"
    },
    {
        "label": "Suspected Oral Cancer",
        "key": "suspected_oral_cancer"
    },
    {
        "label": "Breast Cancer Known Case",
        "key": "known_case"
    },
    {
        "label": "Breast Cancer Treatment Status",
        "key": "persistent_patch"
    },
    {
        "label": "Lump in Breast",
        "key": "lump_in_breast"
    },
    {
        "label": "Blood-Stained Discharge",
        "key": "blood_stained_discharge"
    },
    {
        "label": "Change in Shape",
        "key": "change_in_shape"
    },
    {
        "label": "Constant Pain",
        "key": "constant_pain_or_swelling"
    },
    {
        "label": "Redness of Skin",
        "key": "redness_or_ulcer"
    },
    {
        "label": "Suspected Breast Cancer",
        "key": "suspected_breast_cancer"
    },
    {
        "label": "Cervical Cancer Known Case",
        "key": "known_case_crd"
    },
    {
        "label": "Cervical Cancer Treatment Status",
        "key": "persistent_patch"
    },
    {
        "label": "Bleeding Between Periods",
        "key": "bleeding_between_periods"
    },
    {
        "label": "Bleeding After Menopause",
        "key": "bleeding_after_menopause"
    },
    {
        "label": "Bleeding After Intercourse",
        "key": "bleeding_after_intercourse"
    },
    {
        "label": "Foul-Smelling Discharge",
        "key": "foul_smelling_discharge"
    },
    {
        "label": "Referred Center for Cervical Cancer",
        "key": "referral_centre"
    },
    {
        "label": "VIA Date",
        "key": "via_appointment_date"
    },
    {
        "label": "VIA Result",
        "key": "via_result"
    },
    {
        "label": "VIA Referred Center"
    },
    {
        "label": "Known Heart Disease",
        "key": "known_case"
    },
    {
        "label": "Heart Sound",
        "key": "heart_sound"
    },
    {
        "label": "Abnormal Heart Sound",
        "key": "abnormal_heart_sound"
    },
    {
        "label": "Heart Disease Symptoms",
        "key": "symptom"
    },
    {
        "label": "Teleconsultation Done",
        "key": "teleconsultation"
    },
    {
        "label": "Referral Done",
        "key": "referral"
    },
    {
        "label": "Referred Center for Heart Disease",
        "key": "referral_centre"
    },
    {
        "label": "Heart Disease Confirmed",
        "key": "cvd_date"
    },
    {
        "label": "Suspected Heart Disease",
        "key": "suspected_cvd"
    },
    {
        "label": "History of Stroke",
        "key": "history_of_stroke"
    },
    {
        "label": "Stroke Date",
        "key": "stroke_date"
    },
    {
        "label": "Present Condition",
        "key": "present_condition"
    },
    {
        "label": "Stroke Signs and Symptoms",
        "key": "stroke_sign_action"
    },
    {
        "label": "Referred Center for Stroke",
        "key": "referral_center_name"
    },
    {
        "label": "CKD Known Case",
        "key": "knownCKD"
    },
    {
        "label": "History of CKD",
        "key": "historyCKDStone"
    },
    {
        "label": "Age Above 50 Years",
        "key": "ageAbove50"
    },
    {
        "label": "Hypertension Patient",
        "key": "hypertensionPatient"
    },
    {
        "label": "Diabetes Patient",
        "key": "diabetesPatient"
    },
    {
        "label": "Patient with Anemia",
        "key": "anemiaPatient"
    },
    {
        "label": "History of Stroke or Heart Attack",
        "key": "historyOfStrokeOrHeartAttack"
    },
    {
        "label": "Swelling on Face and Legs",
        "key": "swelling"
    },
    {
        "label": "History of Medication",
        "key": "historyOfMedication"
    },
    {
        "label": "CKD Risk Score",
        "key": "ckd_risk_score"
    },
    {
        "label": "Known Chronic Respiratory Disease",
        "key": "chronic_respiratory_disease"
    },
    {
        "label": "Occupational Exposure",
        "key": "occupational_exposure"
    },
    {
        "label": "Fuel Used for Cooking",
        "key": "fuel_used_for_cooking"
    },
    {
        "label": "Chest Sound",
        "key": "chest_sound"
    },
    {
        "label": "Abnormal Chest Sound Action",
        "key": "abnormal_chest_sound_action"
    },
    {
        "label": "Respiratory Disease Confirmed",
        "key": "respiratory_disease_confirmed"
    },
    {
        "label": "Shortness of Breath",
        "key": "shortness_of_breath"
    },
    {
        "label": "Coughing More Than 2 Weeks",
        "key": "coughing_more_than_2_weeks"
    },
    {
        "label": "Blood in Sputum",
        "key": "blood_in_sputum"
    },
    {
        "label": "Fever for More Than 2 Weeks",
        "key": "fever_for_more_than_2_weeks"
    },
    {
        "label": "Night Sweats",
        "key": "night_sweats"
    },
    {
        "label": "Currently Taking Anti-TB Drugs",
        "key": "taking_anti_tb"
    },
    {
        "label": "Family Member with TB",
        "key": "family_with_tb"
    },
    {
        "label": "History of TB",
        "key": "history_tb"
    },
    {
        "label": "Cloudy Vision",
        "key": "cloudy_vision"
    },
    {
        "label": "Eye Pain",
        "key": "eye_pain"
    },
    {
        "label": "Cataract Result",
        "key": "cataract_result"
    },
    {
        "label": "Hearing Issue",
        "key": "hearing_issue"
    },
    {
        "label": "Leprosy Lesion Sensation Loss",
        "key": "leprosy_lesion_sensation_loss"
    },
    {
        "label": "Leprosy Ulceration",
        "key": "leprosy_ulceration"
    },
    {
        "label": "Leprosy Clawing Fingers",
        "key": "leprosy_clawing_fingers"
    },
    {
        "label": "Leprosy Inability to Close Eyelid",
        "key": "leprosy_inability_close_eyelid"
    },
    {
        "label": "Leprosy Weakness in Feet",
        "key": "leprosy_weakness_in_feet"
    },
    {
        "label": "Unsteady Walking",
        "key": "unsteady_walking"
    },
    {
        "label": "Physical Disability",
        "key": "physical_disability"
    },
    {
        "label": "Help Needed",
        "key": "help_needed"
    },
    {
        "label": "Forget Names",
        "key": "forget_names"
    },
    {
        "label": "Interest or Pleasure",
        "key": "interest_or_pleasure"
    },
    {
        "label": "Feeling Down",
        "key": "feeling_down"
    },
    {
        "label": "History of Fits",
        "key": "history_of_fits"
    },
    {
        "label": "Mental Health Problem",
        "key": "mental_health_problem"
    },
    {
        "label": "Mental Health Intervention",
        "key": "mental_health_intervention"
    },
    {
        "label": "Assessment and Action Taken",
        "key": "action_taken"
    },
    {
        "label": "Major NCD Detected",
        "key": "major_ncd_detected"
    },
    {
        "label": "Other Disease Detected",
        "key": "other_disease_detected"
    },
    {
        "label": "Known Case of DM with HTN",
        "key": "known_case_dm_with_htn"
    },
    {
        "label": "Telemedicine",
        "key": "telemedicine"
    },
    {
        "label": "Medicine Distributed",
        "key": "medicine_distributed"
    },
    {
        "label": "Other Advice",
        "key": "other_advice"
    },
    {
        "label": "ABHA ID Status",
        "key": "abha_id_status"
    }
]