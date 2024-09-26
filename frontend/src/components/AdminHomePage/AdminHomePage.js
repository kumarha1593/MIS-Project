import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHomePage.css";
import defaultInstance from "../../axiosHelper";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await defaultInstance.get('user-list/', { params: { user_type: 'State Coordinator' } });
        if (response?.data?.success) {
          setAllData(response?.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="admin-home-container">
      <h1 className="welcome-heading">Welcome, Admin</h1>
      <button onClick={() => navigate("/admin-form")} className="add-user-button">
        Add New User
      </button>
      <div className="table-container">
        {isLoading ? (
          <div className="loading">Loading data...</div>
        ) : allData?.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email ID</th>
                <th>Phone Number</th>
                <th>Role Type</th>
                <th>Verification ID Type</th>
              </tr>
            </thead>
            <tbody>
              {allData?.map((user, idx) => (
                <tr key={idx}>
                  <td>{user?.name || 'N/A'}</td>
                  <td>{user?.email || 'N/A'}</td>
                  <td>{user?.phone || 'N/A'}</td>
                  <td>{user?.role || 'N/A'}</td>
                  <td>{user?.verification_id_type || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <span>Data not found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
