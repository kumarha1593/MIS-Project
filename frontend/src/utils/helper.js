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

export const allParameters = [
    { label: "Family Member's Name", value: "family_members_name" },
    { label: "Field Coordinator Name", value: "field_coordinator_name" },
    { label: "District", value: "district" },
    { label: "Village", value: "village" },
    { label: "PI Name", value: "pi_name" },
    { label: "PI Identifier", value: "pi_identifier" },
    { label: "PI Card Number", value: "pi_card_number" },
    { label: "PI Date of Birth", value: "pi_dob" },
    { label: "PI Sex", value: "pi_sex" },
    { label: "PI Telephone Number", value: "pi_tel_no" },
    { label: "PI Address", value: "pi_address" },
    { label: "PI State Health Insurance", value: "pi_state_health_insurance" },
    { label: "PI State Health Insurance Remark", value: "pi_state_health_insurance_remark" },
    { label: "PI Disability", value: "pi_disability" },
    { label: "PI Disability Remark", value: "pi_disability_remark" },
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
    { label: "Age", value: "age" },
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
    { label: "Known Case of DM/HTN", value: "known_case_dm_htn" },
    { label: "Teleconsultation", value: "teleconsultation" },
    { label: "Prescription Given", value: "prescription_given" },
    { label: "Other Advices", value: "other_advices" },
    { label: "Remarks", value: "remarks" },
    { label: "ABHA ID Status", value: "abha_id_status" },
];  