import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FieldDashboard.css";
import { FaPencilAlt, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchableDropdown from '../global/SearchableDropdown';
import AddFamilyHead from "../global/AddFamilyHead";
import defaultInstance from "../../axiosHelper";
import { API_ENDPOINTS } from "../../utils/apiEndPoints";
import { defaultDistrict } from "../../utils/helper";

const FieldDashboard = () => {
  const [districtInfo, setDistrictInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [specificDate, setSpecificDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null); // Add this line
  const [villageOptions, setVillageOptions] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    fetchDistrictInfo();
    fetchFamilyMembers();
    fetchVillages()
  }, []);

  const fetchVillages = async () => {
    const response = await defaultInstance.get(API_ENDPOINTS.VILLAGE_LIST);
    if (response?.data?.success) {
      const villages = response?.data?.data?.map(({ village_id, name }) => ({
        value: village_id,
        label: name,
      }));
      setVillageOptions(villages)
    }
  }

  const fetchDistrictInfo = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/user_district_info/${user_id}`
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
    const {
      district,
      village,
      health_facility,
      mo_mpw_cho_anu_name,
      asha_name,
      midori_staff_name
    } = editableData;

    const areFieldsValid = [district, village, health_facility, mo_mpw_cho_anu_name, asha_name].every(Boolean);

    if (!areFieldsValid) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const user_id = localStorage.getItem("user_id");
      const currentDate = new Date().toISOString();

      const updatedData = {
        user_id,
        district,
        village,
        health_facility,
        mo_mpw_cho_anu_name,
        asha_name,
        midori_staff_name,
        date: currentDate,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/district_info`,
        updatedData
      );

      if (response.data.success) {
        setIsEditing(false);
        fetchDistrictInfo();
      }

    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const fetchFamilyMembers = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/family-members/${user_id}`
      );
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  const applyFilters = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/filtered-family-members/${user_id}`,
        {
          params: {
            fromDate: fromDate ? fromDate.toISOString().split("T")[0] : null,
            toDate: toDate ? toDate.toISOString().split("T")[0] : null,
            specificDate: specificDate
              ? specificDate.toISOString().split("T")[0]
              : null,
            searchTerm,
            statusFilter,
          },
        }
      );
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleAddRow = () => {
    if (!districtInfo?.village) {
      alert('Please complete the village information first!')
      return
    }
    setShowModal(true);
  };

  const handleRowClick = (id) => {
    if (!districtInfo?.village) {
      alert('Please complete the village information first!')
      return
    }
    navigate(`/family-details/${id}`);
  };

  const handleCompleteForm = (fm_id) => {
    if (!districtInfo?.village) {
      alert('Please complete the village information first!')
      return
    }
    localStorage.setItem("current_fm_id", fm_id);
    navigate("/FormPage");
  };

  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
    setSpecificDate(null);
    setStatusFilter(null);
    setSearchTerm("");
    fetchFamilyMembers(); // Reset to original data
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
                <SearchableDropdown
                  showLabelOnly={true}
                  options={defaultDistrict}
                  onSelect={(data) => {
                    setTimeout(() => {
                      setEditableData({
                        ...editableData,
                        ['district']: data?.label || '',
                      });
                    }, 500);
                  }}
                  placeholder=""
                  style={{ maxWidth: '300px' }}
                  value={editableData?.district || ''}
                />
              )}
            </div>
            <div className="info-line">
              <span className="info-item">Village: {districtInfo.village}</span>
              {isEditing && (
                <SearchableDropdown
                  options={villageOptions}
                  onSelect={(data) => {
                    setTimeout(() => {
                      setEditableData({
                        ...editableData,
                        ['village']: `${data?.label} / ${data?.value}`,
                      });
                    }, 500);
                  }}
                  placeholder=""
                  style={{ maxWidth: '300px' }}
                  value={editableData?.village || ''}
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
                Name of MO/CHO/ANM: {districtInfo.mo_mpw_cho_anu_name}
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
            </div>
            {isEditing && (
              <button onClick={handleUpdate} className="update-button">
                Update
              </button>
            )}
          </>
        )}
      </div>
      <div className="filter-add-container">
        <div className="filter-container">
          <button onClick={handleFilterClick} className="filter-button">
            <FaFilter /> Filter
          </button>
          {showFilterDropdown && (
            <div className="filter-dropdown">
              <div className="filter-option">
                <label>From Date:</label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  placeholderText="Select From Date"
                />
              </div>
              <div className="filter-option">
                <label>To Date:</label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  placeholderText="Select To Date"
                />
              </div>
              {/* <div className="filter-option">
                <label>Specific Date:</label>
                <DatePicker
                  selected={specificDate}
                  onChange={(date) => setSpecificDate(date)}
                  placeholderText="Select Specific Date"
                />
              </div> */}
              <div className="filter-option">
                <label>Status:</label>
                <select
                  value={statusFilter || ""}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="filter-option">
                <label>Search:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or Aadhaar"
                />
              </div>
              <div className="filter-actions">
                <button onClick={applyFilters}>Apply Filters</button>
                <button onClick={resetFilters}>Reset Filters</button>
              </div>
            </div>
          )}
        </div>

        <button onClick={handleAddRow} className="add-row-button">
          Add New Head
        </button>
      </div>

      <table className="family-table">
        <thead>
          <tr>
            <th>Family Head Name</th>
            <th className="family-members">No. of Family Members</th>
            <th>Aadhaar Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              <td style={{ cursor: 'pointer' }} onClick={() => handleRowClick(row.id)}>{row.name}</td>
              <td>{row.familyMemberCount + 1}</td>
              <td>{row.Aadhar}</td>
              <td>
                {row.status === 0 ? (
                  <button
                    onClick={() => handleCompleteForm(row.id)}
                    style={{ padding: "3px", backgroundColor: "red", cursor: 'pointer' }}
                  >
                    Pending
                  </button>
                ) : (
                  <span style={{ color: "green" }}>Completed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <AddFamilyHead
          onDismiss={() => setShowModal(false)}
          onDone={(response) => {
            setShowModal(false)
            fetchFamilyMembers();
            navigate("/FieldDashboard", {
              state: { familyId: response?.data?.fm_id },
            });
          }}
        />
      )}
    </div>
  );
};

export default FieldDashboard;
