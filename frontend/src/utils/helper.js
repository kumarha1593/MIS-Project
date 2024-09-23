import * as Yup from 'yup';

export const ROLE_TYPE = {
    STATE_COORDINATOR: 'SC',
    ASSISTANT_STATE_COORDINATOR: 'ASC',
    ZONAL_MANAGER: 'ZM',
    SUPER_VISOR: 'SV',
    FIELD_COORDINATOR: 'FC'
};

export const governmentIdOptions = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'driving', label: 'Driving License' },
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
    government_id: Yup.string().required('Government id is required'),
    user_role_type: Yup.string().required('User role is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    phone_number: Yup.string().required('Phone number is required').min(10, 'Phone number must be exactly 10 digits'),
});
