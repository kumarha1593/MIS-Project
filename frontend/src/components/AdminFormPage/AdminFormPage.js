import React, { useEffect, useState } from 'react';
import styles from './AdminFormPage.module.css';
import TextInput from '../global/TextInput';
import SelectInput from '../global/SelectInput';
import { getRoleLabel, getRoleValue, governmentIdOptions, ROLE_TYPE, roleOptions, setUpperLevelParams, validateAdminForm } from '../../utils/helper';
import ButtonLoader from '../global/ButtonLoader';
import defaultInstance from '../../axiosHelper';
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import { IoArrowBack } from "react-icons/io5";

const AdminFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    verification_id_type: '',
    verification_id: '',
    email: '',
    phone_number: '',
    password: '',
    role: '',
    user_id: '',
  });

  const location = useLocation();
  const stateParams = location?.state;
  const editData = stateParams?.form_data || null;
  const isEdit = stateParams?.type == 'EDIT' ? true : false;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [reportingManager, setReportingManager] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'role') {
      setTimeout(() => fetchUsers(value), 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedData = await validateAdminForm.validate(formData, { abortEarly: false });
      const apiPayload = {
        ...validatedData,
        name: `${validatedData.first_name} ${validatedData.last_name}`,
        role: getRoleLabel(validatedData.role || ROLE_TYPE.STATE_COORDINATOR),
      };
      delete apiPayload.first_name;
      delete apiPayload.last_name;

      let apiUrl = API_ENDPOINTS.USERS;
      let response = null;

      if (isEdit) {
        apiUrl = `${API_ENDPOINTS.USERS}${editData?.id}/`;
      }

      setIsLoading(true);
      response = isEdit ? await defaultInstance.patch(apiUrl, apiPayload) : await defaultInstance.post(apiUrl, apiPayload);
      setIsLoading(false);
      if (response?.data?.success) {
        alert(isEdit ? 'User updated successfully!' : 'User created successfully!')
        navigate('/admin-home');
      }

    } catch (err) {
      setIsLoading(false);
      formatValidationErrors(err);
    }
  };

  const formatValidationErrors = (err) => {
    const formattedErrors = err?.inner?.reduce((acc, item) => {
      acc[item.path] = item.message;
      return acc;
    }, {});
    setErrors(formattedErrors || {});
  };

  const fetchUsers = async (role) => {
    const label = setUpperLevelParams(role);
    if (!label) return;

    try {
      const response = await defaultInstance.get(API_ENDPOINTS.USER_LIST, { params: { user_type: label } });
      if (response?.data?.success) {
        const formattedUsers = response?.data?.data?.map(({ id, name }) => ({
          value: id,
          label: name || '',
        }));
        setReportingManager(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (editData) {
      const roleValue = getRoleValue(editData?.role) || ''
      setFormData({
        first_name: editData?.name?.split(' ')?.[0] || '',
        last_name: editData?.name?.split(' ')?.[1] || '',
        verification_id_type: editData?.verification_id_type || '',
        verification_id: editData?.verification_id || '',
        email: editData?.email || '',
        phone_number: editData?.phone || '',
        role: roleValue || '',
        user_id: editData?.id || '',
        password: editData?.password || '',
      });
      setTimeout(() => {
        if (roleValue) {
          fetchUsers(roleValue);
        }
      }, 500);
    }

  }, [JSON.stringify(editData)])

  return (
    <div className={styles.adminFormContainer}>
      <div className='add-user-header'>
        <IoArrowBack className='back-btn' onClick={() => navigate('/admin-home')} />
        <p>{isEdit ? "Edit User" : "Add New User"}</p>
        <div />
      </div>
      <form noValidate onSubmit={handleSubmit}>
        <TextInput
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          error={errors.first_name}
          required
        />
        <TextInput
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          error={errors.last_name}
          required
        />
        <SelectInput
          label="Verification ID Type"
          name="verification_id_type"
          value={formData.verification_id_type}
          options={governmentIdOptions}
          onChange={handleInputChange}
          error={errors.verification_id_type}
          required
        />
        {formData.verification_id_type && (
          <TextInput
            label="Verification ID"
            name="verification_id"
            value={formData.verification_id}
            onChange={handleInputChange}
            error={errors.verification_id}
            required
          />
        )}
        <TextInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />
        <TextInput
          label="Phone Number"
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          error={errors.phone_number}
          required
        />
        <TextInput
          label="Password"
          type={showPassword ? 'text' : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
          isPassword
          toggleEyeIcon={() => setShowPassword((prevState) => !prevState)}
        />
        <SelectInput
          label="User Role"
          name="role"
          value={formData.role}
          options={roleOptions}
          onChange={handleInputChange}
          error={errors.role}
          required
        />
        {formData.role && formData.role !== ROLE_TYPE.STATE_COORDINATOR && reportingManager.length > 0 && (
          <SelectInput
            label="Reporting Manager"
            name="user_id"
            value={formData.user_id}
            options={reportingManager}
            onChange={handleInputChange}
            error={errors.user_id}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
            style={{ width: 'auto', padding: '0 15px', height: '40px', marginRight: '0px' }}
          >
            {isLoading ? <ButtonLoader /> : isEdit ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormPage;
