import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHomePage.css";
import SuperVisor from "./SuperVisor";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const handleAddNewUser = () => {
    navigate("/admin-form");
  };

  return (
    <div className="admin-home-container">
      <h1 className="welcome-heading">Welcome, Admin</h1>
      <button onClick={handleAddNewUser} className="add-user-button">
        Add New User
      </button>
      <div className="fc-container">
        <SuperVisor />
      </div>
    </div>
  );
};

export default AdminHomePage;
