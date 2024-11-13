import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminHomePage.css";
import defaultInstance from "../../axiosHelper";
import { API_ENDPOINTS } from "../../utils/apiEndPoints";
import AddVillage from "./AddVillage";

const AdminHomePage = () => {

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();

  const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

  const [totalCount, setTotalCount] = useState(0);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVillageModal, setShowVillageModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await defaultInstance.get(API_ENDPOINTS.USER_LIST, { params: { ...queryParams } });
      setIsLoading(false)
      if (response?.data?.success) {
        setAllData(response?.data?.data || []);
        setTotalCount(response?.data?.total_count || 0)
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(queryParams)]);

  const markActiveAndInactive = async (user) => {
    try {
      const response = await defaultInstance.patch(`${API_ENDPOINTS.USERS}${user?.id}/`, {
        is_active: user?.is_active === 0 ? 1 : 0
      })
      if (response?.data?.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }


  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file)
      defaultInstance.post(API_ENDPOINTS.IMPORT_MASTER_LIST, fd).then((res) => {
        if (!res?.data?.success) {
          alert(res?.data?.message);
          return
        }
        if (res?.data?.success) {
          fetchUsers();
        }
      }).catch((err) => console.log(err))
    }
  };

  const handlePaginate = (type) => {
    const { page_limit = 50, skip_count = 0 } = queryParams || {};
    const newPageLimit = page_limit;
    let newSkipCount = Number(skip_count);

    if (type === 'N') {
      newSkipCount += 50;
      if (newSkipCount >= totalCount) {
        newSkipCount = totalCount - (totalCount % page_limit);
      }
    } else if (type === 'P') {
      newSkipCount -= 50;
      if (newSkipCount < 0) {
        newSkipCount = 0;
      }
    }

    navigate(`/admin-home?page_limit=${newPageLimit || 50}&skip_count=${newSkipCount || 0}&user_type=all`);
  };

  const viewingCount = Number(queryParams?.skip_count) + 50

  return (
    <div className="admin-home-container">
      <h1 className="welcome-heading">Welcome, Admin</h1>
      <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'flex-end' }}>
        <p style={{ marginRight: '5px' }}>{`Showing ${viewingCount > totalCount ? totalCount : viewingCount} of ${totalCount} results`}</p>
        <button onClick={() => navigate("/admin-form")} className="add-user-button">Add User Manually</button>
        <button onClick={() => fileInputRef?.current?.click()} className="add-user-button">Bulk Import</button>
        <button onClick={() => setShowVillageModal(true)} className="add-user-button">Add Village</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </div>
      <div className="table-container">
        {isLoading ? (
          <div className="loading">Loading data...</div>
        ) : allData?.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>ID</th>
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
                  <td style={{ width: '50px' }}>{user?.id || 'N/A'}</td>
                  <td>{user?.name || 'N/A'}</td>
                  <td>{user?.email || 'N/A'}</td>
                  <td>{user?.phone || 'N/A'}</td>
                  <td>{user?.role || 'N/A'}</td>
                  <td>{user?.verification_id || 'N/A'}</td>
                  <td>{user?.manager_name || 'N/A'}</td>
                  <td>
                    <div className="user-actions">
                      <div onClick={() => navigate("/admin-form", { state: { form_data: user, type: 'EDIT' } })} className="common-actions-btn edit">Edit</div>
                      <div onClick={() => markActiveAndInactive(user)} className={`common-actions-btn delete ${user?.is_active == 1 ? 'warn' : ''}`}>{user?.is_active == 0 ? 'InActive' : 'Active'}</div>
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
      <AddVillage
        visible={showVillageModal}
        onDismiss={() => setShowVillageModal(false)}
      />
      <div className='custom-pagination'>
        <div className="option-container">
          <div onClick={() => handlePaginate('P')} className="option">Previous</div>
          <div onClick={() => handlePaginate('N')} className="option">Next</div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
