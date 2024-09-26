import React, { useState } from 'react';
import styles from './AdminFormPage.module.css';
import TextInput from '../global/TextInput';
import SelectInput from '../global/SelectInput';
import { getRoleLabel, governmentIdOptions, ROLE_TYPE, roleOptions, setParams, validateAdminForm } from '../../utils/helper';
import ButtonLoader from '../global/ButtonLoader';
import defaultInstance from '../../axiosHelper';
import { useNavigate } from "react-router-dom";

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

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

      setIsLoading(true);
      const response = await defaultInstance.post('users/', apiPayload);
      setIsLoading(false);
      if (response?.data?.success) {
        alert('User create successfully!')
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
    const label = setParams(role);
    if (!label) return;

    try {
      const response = await defaultInstance.get('user-list/', { params: { user_type: label } });
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

  return (
    <div className={styles.adminFormContainer}>
      <h2>Add New User</h2>
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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
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
            style={{ width: 'auto', padding: '0 15px', height: '40px' }}
          >
            {isLoading ? <ButtonLoader /> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormPage;
