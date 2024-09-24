import React, { useState } from 'react';
import styles from './AdminFormPage.module.css';
import TextInput from '../global/TextInput';
import SelectInput from '../global/SelectInput';
import { governmentIdOptions, ROLE_TYPE, roleOptions, validateAdminForm } from '../../utils/helper';
import ButtonLoader from '../global/ButtonLoader';
import defaultInstance from '../../axiosHelper';

const AdminFormPage = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateAdminForm.validate(formData, { abortEarly: false }).then((data) => {
      const apiPayload = { ...data };
      apiPayload.name = `${data?.first_name} ${data?.last_name}`;
      apiPayload.role = getRoleLabel(formData?.role || ROLE_TYPE.STATE_COORDINATOR);
      apiPayload.user_id = 1;
      delete apiPayload.first_name;
      delete apiPayload.last_name;
      setIsLoading(true)
      defaultInstance.post('users/', apiPayload).then((response) => {
        console.log(response, "response");
        setIsLoading(false)
        setErrors({});
      }).catch((error) => { setIsLoading(false) })
    }).catch((err) => {
      setIsLoading(false)
      const formattedErrors = {};
      err?.inner?.forEach((item) => formattedErrors[item.path] = item.message);
      setErrors(formattedErrors)
    });
  };

  const getRoleLabel = (selectedRole) => {
    const selectedRoleOption = roleOptions.find(role => role.value === selectedRole);
    return selectedRoleOption?.label;
  }

  const getReportingManagersForRole = (selectedRole) => {
    const selectedRoleOption = roleOptions.find(role => role.value === selectedRole);
    if (selectedRoleOption && selectedRoleOption?.reporting_manager?.length > 0) {
      return selectedRoleOption?.reporting_manager;
    }
    return [];
  };

  const availableReportingManagers = getReportingManagersForRole(formData.role);

  return (
    <div className={styles.adminFormContainer}>
      <h2>Add New User</h2>
      <form noValidate onSubmit={handleSubmit}>
        <TextInput
          label="First Name"
          name="first_name"
          value={formData?.first_name}
          onChange={handleInputChange}
          error={errors?.first_name}
          required
        />
        <TextInput
          label="Last Name"
          name="last_name"
          value={formData?.last_name}
          onChange={handleInputChange}
          error={errors?.last_name}
          required
        />
        <SelectInput
          label="Verification ID Type"
          name="verification_id_type"
          value={formData?.verification_id_type}
          options={governmentIdOptions}
          onChange={handleInputChange}
          error={errors?.verification_id_type}
          required
        />
        {formData?.verification_id_type && (
          <TextInput
            label="Verification ID"
            name="verification_id"
            value={formData?.verification_id}
            onChange={handleInputChange}
            error={errors?.verification_id}
            required
          />
        )}
        <TextInput
          label="Email"
          type="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />
        <TextInput
          label="Phone Number"
          type="tel"
          name="phone_number"
          value={formData?.phone_number}
          onChange={handleInputChange}
          error={errors?.phone_number}
          required
        />
        <TextInput
          label="Password"
          type="password"
          name="password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
        />
        <SelectInput
          label="User Role"
          name="role"
          value={formData?.role}
          options={roleOptions}
          onChange={handleInputChange}
          error={errors?.role}
          required
        />
        {(formData?.role && availableReportingManagers?.length > 0) && (
          <SelectInput
            label="Reporting Manager"
            name="user_id"
            value={formData?.user_id}
            options={availableReportingManagers}
            onChange={handleInputChange}
            error={errors?.user_id}
          />
        )}
        <div style={{ display: 'flex' }}>
          <button
            type="submit"
            className={styles.submitButton}
            style={{ width: 'auto', padding: '0px 15px', height: '40px', marginLeft: 'auto', marginRight: '0px' }}
          >
            {isLoading
              ?
              <ButtonLoader />
              :
              'Submit'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormPage;
