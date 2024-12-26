import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import "./FamilyDetails.css";
import AddMember from "./AddMember";

const FamilyDetails = () => {
  const { headId } = useParams();
  const navigate = useNavigate();
  const [familyData, setFamilyData] = useState({ head: null, members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchFamilyData = async () => {
    try {
      const membersResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/family-members?head_id=${headId}&includeHead=true`
      );
      if (membersResponse.data.success) {
        const allMembers = membersResponse.data.data;
        const head =
          allMembers.find((member) => member.id === parseInt(headId)) || null;
        const otherMembers = allMembers.filter(
          (member) => member.id !== parseInt(headId)
        );

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
      setError(
        "Error fetching family data: " +
        (error.response?.data?.message || error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyData();
  }, [headId]);

  const handleCompleteForm = (fm_id, item) => {
    localStorage.setItem("current_fm_id", fm_id);
    navigate("/FormPage", {
      state: {
        data: item
      }
    });
  };

  const handleAddMember = () => {
    setShowModal(true);
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
            <th>Relation</th>
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
                    onClick={() => handleCompleteForm(familyData.head.id, familyData?.head)}
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
                    onClick={() => handleCompleteForm(member.id, member)}
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

      <div onClick={handleAddMember} className="add-member-container">
        <FaPlusCircle className="add-member-icon" />
        <span>Add New Family Member</span>
      </div>

      {showModal && (
        <AddMember
          onDismiss={() => setShowModal(false)}
          headId={headId}
          onDone={() => {
            setShowModal(false);
            fetchFamilyData()
          }}
        />
      )}
    </div>
  );
};

export default FamilyDetails;
