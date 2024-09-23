import React, { useState } from 'react';
import styles from './AdminFormPage.module.css';
import TextInput from '../global/TextInput';
import SelectInput from '../global/SelectInput';
import { governmentIdOptions, roleOptions, validateAdminForm } from '../../utils/helper';

const AdminFormPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    government_id: '',
    email: '',
    phone_number: '',
    password: '',
    user_role_type: '',
    reporting_manager: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateAdminForm.validate(formData, { abortEarly: false }).then((data) => {
      console.log(data, "data")
      // need to call api here
    }).catch((err) => {
      const formattedErrors = {};
      err?.inner?.forEach((item) => {
        formattedErrors[item.path] = item.message;
      });
      setErrors(formattedErrors)
    });
  };

  const getReportingManagersForRole = (selectedRole) => {
    const selectedRoleOption = roleOptions.find(role => role.value === selectedRole);
    if (selectedRoleOption && selectedRoleOption.reporting_manager.length > 0) {
      return selectedRoleOption.reporting_manager;
    }
    return [];
  };

  const availableReportingManagers = getReportingManagersForRole(formData.user_role_type);

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
          label="Government ID"
          name="government_id"
          value={formData?.government_id}
          options={governmentIdOptions}
          onChange={handleInputChange}
          error={errors?.government_id}
          required
        />
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
          name="user_role_type"
          value={formData?.user_role_type}
          options={roleOptions}
          onChange={handleInputChange}
          error={errors?.user_role_type}
          required
        />
        {(formData?.user_role_type && availableReportingManagers?.length > 0) && (
          <SelectInput
            label="Reporting Manager"
            name="reporting_manager"
            value={formData?.reporting_manager}
            options={availableReportingManagers}
            onChange={handleInputChange}
            error={errors?.reporting_manager}
          />
        )}
        <button type="submit" className={styles.submitButton}>Add User</button>
      </form>
    </div>
  );
};

export default AdminFormPage;
