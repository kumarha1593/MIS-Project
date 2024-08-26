import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminFormPage.css';

const AdminFormPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    governmentId: '',
    photo: null,
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to backend)
    console.log(formData);
    // After submission, you might want to navigate back to the admin home page
    navigate('/admin-home');
  };

  const handleBack = () => {
    navigate('/admin-home');
  };

  return (
    <div className="admin-form-container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="governmentId">Government ID</label>
          <select
            id="governmentId"
            name="governmentId"
            value={formData.governmentId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select ID Type</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="pan">PAN Card</option>
            <option value="driving">Driving License</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="photo">Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoUpload}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="field_coordinator">Field Coordinator</option>
            <option value="state_coordinator">State Coordinator</option>
            <option value="assistant_state_coordinator">Assistant State Coordinator</option>
            <option value="zonal_manager">Zonal Manager</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Add User</button>
      </form>
      <button onClick={handleBack} className="back-button">Back</button>
    </div>
  );
};

export default AdminFormPage;