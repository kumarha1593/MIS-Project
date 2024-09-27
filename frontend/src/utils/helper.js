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
