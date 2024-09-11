import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import "./FamilyDetails.css";

const FamilyDetails = () => {
  const { headId } = useParams();
  const navigate = useNavigate();
  const [familyData, setFamilyData] = useState({ head: null, members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    aadharNumber: "",
  });
  const [addMemberError, setAddMemberError] = useState(null);
  const [nameError, setNameError] = useState("");
  const [aadharError, setAadharError] = useState("");

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const headResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/family-members/${headId}`
        );
        console.log("Head response:", headResponse.data);

        console.log(`Fetching members data for headId: ${headId}`);
        const membersResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/family-members?head_id=${headId}&includeHead=true`
        );
        console.log("Members response:", membersResponse.data);

        if (membersResponse.data.success) {
          const allMembers = membersResponse.data.data;
          const head =
            allMembers.find((member) => member.id === parseInt(headId)) || null;
          const otherMembers = allMembers.filter(
            (member) => member.id !== parseInt(headId)
          );

          console.log("Setting family data:", { head, members: otherMembers });

          setFamilyData({
            head: head,
            members: otherMembers,
          });
        } else {
          setError(
            "Failed to fetch family data: " +
              (membersResponse.data.message || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Full error object:", error);
        setError(
          "Error fetching family data: " +
            (error.response?.data?.message || error.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [headId]);

  const handleStatusUpdate = async (memberId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/update-status`,
        {
          memberId,
          status: 1,
        }
      );
      if (response.data.success) {
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCompleteForm = (fm_id) => {
    localStorage.setItem("current_fm_id", fm_id);
    navigate("/FormPage");
  };

  const handleAddMember = () => {
    setShowModal(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setNewMemberData((prevData) => ({ ...prevData, [name]: value }));
      if (!value.trim()) {
        setNameError("Name is required.");
      } else {
        setNameError("");
      }
    } else if (name === "aadharNumber") {
      // Only allow digits
      const numericValue = value.replace(/\D/g, "");
      setNewMemberData((prevData) => ({ ...prevData, [name]: numericValue }));
      if (numericValue.length !== 12) {
        setAadharError("Aadhar number must be 12 digits.");
      } else {
        setAadharError("");
      }
    }
  };

  const handleSubmitNewMember = async () => {
    const user_id = localStorage.getItem("user_id");
    setAddMemberError(null);

    if (!newMemberData.name.trim()) {
      setNameError("Name is required.");
      return;
    }
    if (newMemberData.aadharNumber.length !== 12) {
      setAadharError("Aadhar number must be 12 digits.");
      return;
    }

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

      console.log("Server response:", response.data);

      if (response.data.success) {
        setShowModal(false);
        setNewMemberData({ name: "", aadharNumber: "" });
        setNameError("");
        setAadharError("");
      } else {
        setAddMemberError(
          "Failed to add new family member: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error adding new family member:", error);
      setAddMemberError(
        "Error adding new family member. Please check name and aadhar number (should be unique and 12 digits)."
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="family-details-container">
      <h2>
        {familyData.head
          ? `${familyData.head.name}'s Family Details`
          : "Family Details"}
      </h2>
      <table className="family-members-table">
        <thead>
          <tr>
            <th>Name of Family Member</th>
            <th>Aadhar Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {familyData.head && (
            <tr key={familyData.head.id}>
              <td>{familyData.head.name}</td>
              <td>{familyData.head.Aadhar}</td>
              <td>Head of Family</td>
              <td>
                {familyData.head.status === 0 ? (
                  <button
                    onClick={() => handleCompleteForm(familyData.head.id)}
                    style={{ padding: "3px", backgroundColor: "red" }}
                  >
                    Pending
                  </button>
                ) : (
                  <span style={{ color: "green" }}>Completed</span>
                )}
              </td>
            </tr>
          )}

          {familyData.members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.Aadhar}</td>
              <td>Family Member</td>
              <td>
                {member.status === 0 ? (
                  <button
                    onClick={() => handleCompleteForm(member.id)}
                    style={{ padding: "3px", backgroundColor: "red" }}
                  >
                    Pending
                  </button>
                ) : (
                  <span style={{ color: "green" }}>Completed</span>
                )}
              </td>
            </tr>
          ))}

          {familyData.members.length === 0 && !familyData.head && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
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
            {nameError && <p className="error-message">{nameError}</p>}
            <input
              type="text"
              name="aadharNumber"
              value={newMemberData.aadharNumber}
              onChange={handleModalInputChange}
              placeholder="Aadhar Number"
              maxLength="12"
            />
            {aadharError && <p className="error-message">{aadharError}</p>}
            {addMemberError && (
              <div className="error-message">{addMemberError}</div>
            )}
            <button
              onClick={handleSubmitNewMember}
              disabled={
                !newMemberData.name.trim() ||
                newMemberData.aadharNumber.length !== 12
              }
            >
              Submit
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyDetails;
