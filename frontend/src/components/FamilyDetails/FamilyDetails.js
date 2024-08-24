import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import "./FamilyDetails.css";

const FamilyDetails = () => {
  const navigate = useNavigate();
  const [familiesData, setFamiliesData] = useState([]);

  useEffect(() => {
    // Fetch all families data from backend
    // For now, we'll use dummy data
    setFamiliesData([
      {
        id: 1,
        headOfFamily: "John Doe",
        members: [
          { id: 1, name: "John Doe", status: "Active" },
          { id: 2, name: "Alice Doe", status: "Active" },
          { id: 3, name: "Bob Doe", status: "Inactive" },
        ],
      },
      {
        id: 2,
        headOfFamily: "Jane Smith",
        members: [
          { id: 4, name: "Jane Smith", status: "Active" },
          { id: 5, name: "Tom Smith", status: "Active" },
        ],
      },
    ]);
  }, []);

  const handleAddMember = (headOfFamily) => {
    navigate("/FormPage", { state: { headOfFamily } });
  };

  return (
    <div className="family-details-container">
      <h2>All Families and Members</h2>
      {familiesData.map((family) => (
        <div key={family.id} className="family-section">
          <h3>{family.headOfFamily}'s Family</h3>
          <table className="family-members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {family.members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="add-member-container">
            <FaPlusCircle
              className="add-member-icon"
              onClick={() => handleAddMember(family.headOfFamily)}
            />
            <span>Add New Family Member</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FamilyDetails;
