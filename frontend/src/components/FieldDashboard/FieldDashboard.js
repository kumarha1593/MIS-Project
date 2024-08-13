import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FieldDashboard.css";
import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FieldDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    district: "",
    village: "",
    healthFacility: "",
    moName: "",
    ashaName: "",
    midoriStaff: "",
  });

  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHeadData, setNewHeadData] = useState({
    headOfFamily: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getUserDetails"
        );
        setFormData({
          district: response.data.district,
          village: response.data.village,
          healthFacility: response.data.healthFacility,
          moName: response.data.moName || "",
          ashaName: response.data.ashaName || "",
          midoriStaff: response.data.midoriStaff || "",
        });

        const tableResponse = await axios.get(
          "http://localhost:5000/api/getFamilyData"
        );
        setTableData(tableResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    console.log("Updated data:", formData);
    // Implement the logic to update the user details in the backend
    setIsEditing(false);
  };

  const handleAddFamilyMember = (id) => {
    navigate("/FormPage", { state: { familyId: id } });
  };

  const handleAddRow = () => {
    setShowModal(true);
  };

  const handleModalInputChange = (e) => {
    setNewHeadData({ ...newHeadData, [e.target.name]: e.target.value });
  };

  const handleSaveAndContinue = () => {
    // Here you would typically save the new head data to your backend
    console.log("New head data:", newHeadData);
    setShowModal(false);
    navigate("/FormPage", { state: { newHead: newHeadData } });
  };

  return (
    <div className="next-page-container">
      <div className="info-box">
        <div className="info-header">
          <h3>User Details</h3>
          <FaPencilAlt className="edit-icon" onClick={handleEditToggle} />
        </div>
        <div className="info-line">
          <span className="info-item">District: {formData.district}</span>
          {isEditing && (
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="input-field"
            />
          )}
        </div>
        <div className="info-line">
          <span className="info-item">Village: {formData.village}</span>
          {isEditing && (
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleInputChange}
              className="input-field"
            />
          )}
        </div>
        <div className="info-line">
          <span className="info-item">
            Health Facility: {formData.healthFacility}
          </span>
          {isEditing && (
            <input
              type="text"
              name="healthFacility"
              value={formData.healthFacility}
              onChange={handleInputChange}
              className="input-field"
            />
          )}
        </div>
        <div className="info-line">
          <span className="info-item">Name of MO: {formData.moName}</span>
          {isEditing && (
            <input
              type="text"
              name="moName"
              value={formData.moName}
              onChange={handleInputChange}
              className="input-field"
            />
          )}
        </div>
        <div className="info-line">
          <span className="info-item">Name of Asha: {formData.ashaName}</span>
          {isEditing && (
            <input
              type="text"
              name="ashaName"
              value={formData.ashaName}
              onChange={handleInputChange}
              className="input-field"
            />
          )}
        </div>
        <div className="info-line">
          <span className="info-item">
            Midori Staff: {formData.midoriStaff}
          </span>
          {isEditing && (
            <input
              type="text"
              name="midoriStaff"
              value={formData.midoriStaff}
              onChange={handleInputChange}
              className="input-field"
            />
          )}
        </div>
        {isEditing && (
          <button onClick={handleUpdate} className="update-button">
            Update
          </button>
        )}
      </div>

      <table className="family-table">
        <thead>
          <tr>
            <th>Head of Family Name</th>
            <th>Number of Family Members</th>
            <th>Phone Number</th>
            <th>Add Member</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.headOfFamily}</td>
              <td>{row.familyMembers}</td>
              <td>{row.phoneNumber}</td>
              <td>
                <FaPlusCircle
                  className="add-member-icon"
                  onClick={() => handleAddFamilyMember(row.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleAddRow} className="add-row-button">
        Add New Head
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Head of Family</h2>
            <input
              type="text"
              name="headOfFamily"
              value={newHeadData.headOfFamily}
              onChange={handleModalInputChange}
              placeholder="Head of Family Name"
            />
            <input
              type="text"
              name="phoneNumber"
              value={newHeadData.phoneNumber}
              onChange={handleModalInputChange}
              placeholder="Phone Number"
            />
            <button onClick={handleSaveAndContinue}>Save & Continue</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldDashboard;
