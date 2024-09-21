import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHomePage.css";

const AdminHomePage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from backend
    // For now, we'll use dummy data
    setUsers([
      { id: 1, name: "John Doe", role: "User", email: "john@example.com" },
      { id: 2, name: "Jane Smith", role: "Admin", email: "jane@example.com" },
      {
        id: 3,
        name: "Alice Johnson",
        role: "User",
        email: "alice@example.com",
      },
    ]);
  }, []);

  const handleAddNewUser = () => {
    navigate("/admin-form");
  };

  return (
    <div className="admin-home-container">
      <h1 className="welcome-heading">Welcome, Admin</h1>
      <button onClick={handleAddNewUser} className="add-user-button">
        Add New User
      </button>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomePage;