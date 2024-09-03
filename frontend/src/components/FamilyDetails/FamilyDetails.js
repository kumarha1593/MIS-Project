import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import "./FamilyDetails.css";

const FamilyDetails = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const [familyData, setFamilyData] = useState({
    headOfFamily: location.state?.headOfFamily || "Unknown",
    members: [],
  });
  const [headId, setHeadId] = useState(location.state?.headId);

  const [showModal, setShowModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    aadharNumber: "",
  });

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/family-members/${headId}`
        );

        setFamilyData((prevData) => ({
          ...prevData,
          members: response.data,
        }));
      } catch (error) {
        console.error("Error fetching family members:", error);
      }
    };

    if (headId) {
      fetchFamilyMembers();
    }
  }, [headId]);

  const handleAddMember = () => {
    setShowModal(true);
  };

  const handleModalInputChange = (e) => {
    setNewMemberData({ ...newMemberData, [e.target.name]: e.target.value });
  };

  const handleSubmitNewMember = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/family-members`,
        {
          fc_id: user_id,
          name: newMemberData.name,
          aadhar: newMemberData.aadharNumber,
          head_id: headId,
        }
      );
      if (response.data.success) {
        setShowModal(false);
        // Refresh the family members list
        const updatedMembers = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/family-members/${headId}`
        );
        setFamilyData((prevData) => ({
          ...prevData,
          members: updatedMembers.data,
        }));
      }
    } catch (error) {
      console.error("Error adding new family member:", error);
    }
  };

  return (
    <div className="family-details-container">
      <h2>{familyData.headOfFamily}'s Family Details</h2>
      <table className="family-members-table">
        <thead>
          <tr>
            <th>Name of Family Member</th>
            <th>Aadhar Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {familyData.members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.Aadhar}</td>
              <td>{member.status === 0 ? "Pending" : "Completed"}</td>
            </tr>
          ))}
          {familyData.members.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No family members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="add-member-container">
        <FaPlusCircle className="add-member-icon" onClick={handleAddMember} />
        <span>Add New Family Member</span>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Family Member</h2>
            <input
              type="text"
              name="name"
              value={newMemberData.name}
              onChange={handleModalInputChange}
              placeholder="Family Member's Name"
            />
            <input
              type="text"
              name="aadharNumber"
              value={newMemberData.aadharNumber}
              onChange={handleModalInputChange}
              placeholder="Aadhar Number"
            />
            <button onClick={handleSubmitNewMember}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyDetails;
