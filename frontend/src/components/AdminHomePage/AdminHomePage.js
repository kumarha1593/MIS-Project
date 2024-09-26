import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHomePage.css";
import defaultInstance from "../../axiosHelper";
import { API_ENDPOINTS } from "../../utils/apiEndPoints";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await defaultInstance.get(API_ENDPOINTS.USER_LIST, { params: { user_type: 'all' } });
        setIsLoading(false)
        if (response?.data?.success) {
          setAllData(response?.data?.data || []);
        }
      } catch (error) {
        setIsLoading(false);
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
                <th>Aadhar</th>
                <th>Reporting Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allData?.map((user, idx) => (
                <tr key={idx}>
                  <td>{user?.name || 'N/A'}</td>
                  <td>{user?.email || 'N/A'}</td>
                  <td>{user?.phone || 'N/A'}</td>
                  <td>{user?.role || 'N/A'}</td>
                  <td>{user?.verification_id || 'N/A'}</td>
                  <td>N/A</td>
                  <td>
                    <div className="user-actions">
                      <div onClick={() => navigate("/admin-form", { state: { form_data: user, type: 'EDIT' } })} className="common-actions-btn edit">Edit</div>
                      <div onClick={() => alert('To be implemented!')} className="common-actions-btn delete">In Active</div>
                    </div>
                  </td>
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
