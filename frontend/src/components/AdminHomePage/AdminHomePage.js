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


  const [visibleFCs, setVisibleFCs] = useState(Array(10).fill(false));
  const [visibleFHs, setVisibleFHs] = useState(Array(10).fill(false));

  const toggleFCVisibility = (fcIdx) => {
    setVisibleFCs((prev) => {
      const newVisibility = prev.map(() => false);
      newVisibility[fcIdx] = !prev[fcIdx];
      return newVisibility;
    });
  };

  const toggleFHVisibility = (fhIdx) => {
    setVisibleFHs((prev) => {
      const newVisibility = prev.map(() => false);
      newVisibility[fhIdx] = !prev[fhIdx];
      return newVisibility;
    });
  };


  const containerStyle = {
    cursor: 'pointer',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: '8px',
    padding: '15px 8px',
  }

  const spanStyle = {
    color: 'black',
    fontWeight: 'bold',
  }

  return (
    <div className="admin-home-container">
      <h1 className="welcome-heading">Welcome, Admin</h1>
      <button onClick={handleAddNewUser} className="add-user-button">
        Add New User
      </button>
      {/* <div className="table-container">
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
      </div> */}
      <div className="fc-container">
        {visibleFCs.map((fc, fcIdx) => (
          <div className="fc-item" key={fcIdx}>
            <div style={containerStyle} onClick={() => toggleFCVisibility(fcIdx)}>
              <span style={spanStyle}>
                Field Coordinator {fcIdx + 1}
              </span>
            </div>
            {visibleFCs[fcIdx] && (
              <div className="fh-item-container">
                {visibleFHs.map((fh, fhIdx) => (
                  <div className="fh-item" key={fhIdx}>
                    <div style={containerStyle} onClick={() => toggleFHVisibility(fhIdx)}>
                      <span style={spanStyle} >
                        Family Head {fhIdx + 1}
                      </span>
                    </div>
                    {visibleFHs[fhIdx] && (
                      <div className="fm-item-container">
                        <table className="fm-item-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Role</th>
                              <th>Email</th>
                              {Array(50).fill(null).map((parameter, paramIdx) => (
                                <th key={paramIdx}>Parameter {paramIdx + 1}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array(5).fill(null).map((mem, memIdx) => (
                              <tr key={memIdx}>
                                {Array(53).fill(null).map((data, dataIdx) => (
                                  <td key={dataIdx}>Lorem Ipsum</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomePage;
