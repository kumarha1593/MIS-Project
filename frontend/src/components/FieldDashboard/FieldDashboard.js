import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FieldDashboard.css";
import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FieldDashboard = () => {
  const [districtInfo, setDistrictInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHeadData, setNewHeadData] = useState({
    headOfFamily: "",
    aadharNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDistrictInfo();
    fetchFamilyMembers();
  }, []);

  const fetchDistrictInfo = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `http://localhost:5001/api/user_district_info/${user_id}`
      );
      setDistrictInfo(response.data);
      setEditableData(response.data);
    } catch (error) {
      console.error("Error fetching district info:", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    const user_id = localStorage.getItem("user_id");
    const currentDate = new Date().toISOString();

    const updatedData = {
      user_id,
      district: editableData.district,
      village: editableData.village,
      health_facility: editableData.health_facility,
      mo_mpw_cho_anu_name: editableData.mo_mpw_cho_anu_name,
      asha_name: editableData.asha_name,
      midori_staff_name: editableData.midori_staff_name,
      date: currentDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/district_info",
        updatedData
      );
      if (response.data.success) {
        setIsEditing(false);
        fetchDistrictInfo(); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
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

  const fetchFamilyMembers = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `http://localhost:5001/api/family-members/${user_id}`
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  const handleSaveAndContinue = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.post(
        "http://localhost:5001/api/family-members",
        {
          fc_id: user_id,
          name: newHeadData.headOfFamily,
          aadhar: newHeadData.aadharNumber,
        }
      );
      if (response.data.success) {
        setShowModal(false);
        fetchFamilyMembers(); // Refresh the table data
        navigate("/FormPage", { state: { familyId: response.data.fm_id } });
      }
    } catch (error) {
      console.error("Error saving new head:", error);
    }
  };

  return (
    <div className="next-page-container">
      <div className="info-box">
        <div className="info-header">
          <h3>Basic Details</h3>
          <FaPencilAlt className="edit-icon" onClick={handleEditToggle} />
        </div>
        {districtInfo && (
          <>
            <div className="info-line">
              <span className="info-item">
                District: {districtInfo.district}
              </span>
              {isEditing && (
                <input
                  type="text"
                  name="district"
                  value={editableData.district}
                  onChange={handleInputChange}
                  className="input-field"
                />
              )}
            </div>
            <div className="info-line">
              <span className="info-item">Village: {districtInfo.village}</span>
              {isEditing && (
                <input
                  type="text"
                  name="village"
                  value={editableData.village}
                  onChange={handleInputChange}
                  className="input-field"
                />
              )}
            </div>
            <div className="info-line">
              <span className="info-item">
                Health Facility: {districtInfo.health_facility}
              </span>
              {isEditing && (
                <input
                  type="text"
                  name="health_facility"
                  value={editableData.health_facility}
                  onChange={handleInputChange}
                  className="input-field"
                />
              )}
            </div>
            <div className="info-line">
              <span className="info-item">
                Name of MO: {districtInfo.mo_mpw_cho_anu_name}
              </span>
              {isEditing && (
                <input
                  type="text"
                  name="mo_mpw_cho_anu_name"
                  value={editableData.mo_mpw_cho_anu_name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              )}
            </div>
            <div className="info-line">
              <span className="info-item">
                Name of Asha: {districtInfo.asha_name}
              </span>
              {isEditing && (
                <input
                  type="text"
                  name="asha_name"
                  value={editableData.asha_name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              )}
            </div>
            <div className="info-line">
              <span className="info-item">
                Midori Staff: {districtInfo.midori_staff_name}
              </span>
              {isEditing && (
                <input
                  type="text"
                  name="midori_staff_name"
                  value={editableData.midori_staff_name}
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
          </>
        )}
      </div>

      <table className="family-table">
        <thead>
          <tr>
            <th>Head of Family Name</th>
            <th>Number of Family Members</th>
            <th>Aadhaar Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.familyMemberCount}</td>
              <td>{row.Aadhar}</td>
              <td>{row.status === 0 ? "Incomplete" : "Complete"}</td>
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
              name="aadharNumber" // Changed from "Aadhaar number" to "aadharNumber"
              value={newHeadData.aadharNumber}
              onChange={handleModalInputChange}
              placeholder="Aadhaar number"
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
