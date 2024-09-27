import { useState, useEffect } from 'react';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import { setLowerLevelParams } from '../../utils/helper';

// Custom hook for managing data state and visibility toggling
const useManageData = (initialData, roleType, isSuperVisor = false, isFamilyHead = false) => {
    const [allData, setAllData] = useState([]);
    const [nextRoleData, setNextRoleData] = useState([]);

    useEffect(() => {
        if (initialData?.length > 0) {
            setAllData(initialData);
        }
    }, [JSON.stringify(initialData)]);

    // Generic function to fetch data from an API endpoint
    const fetchDataFromAPI = async (endpoint, params = {}) => {
        try {
            const response = await defaultInstance.get(endpoint, { params });
            if (response?.data?.success) {
                const list = response?.data?.data?.length > 0 ? response?.data?.data : [];
                return list.map((item) => ({
                    ...item,
                    is_open: false,
                    is_checked: false,
                }));
            }
            return [];
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };

    // Fetch user data by role type
    const getUserDataByRole = async (roleType) => {
        const params = { user_type: setLowerLevelParams(roleType) };
        const list = await fetchDataFromAPI(API_ENDPOINTS.USER_LIST, params);
        setNextRoleData(list);
    };

    // Conditionally fetch data if isSuperVisor is true
    const fetchData = async () => {
        const list = await fetchDataFromAPI(API_ENDPOINTS.FAMILY_HEAD);
        setNextRoleData(list);
    };

    // Conditionally fetch data for family head
    const fetchFamilyData = async (currentItem) => {
        const params = { head_id: currentItem?.id };
        const list = await fetchDataFromAPI(API_ENDPOINTS.FAMILY_DETAILS, params);
        setNextRoleData(list);
    };

    // Toggle visibility and fetch next role data
    const toggleVisibility = (idx, currentItem) => {
        setAllData((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[idx].is_open = !prev[idx].is_open;
            return newVisibility;
        });

        if (isFamilyHead) {
            fetchFamilyData(currentItem);  // Fetch family head data if isFamilyHead is true
        } else if (isSuperVisor) {
            fetchData();  // Fetch family head data for supervisor
        } else {
            getUserDataByRole(roleType);  // Otherwise, fetch data by role type
        }
    };

    return {
        allData,
        nextRoleData,
        toggleVisibility,
    };
};

export default useManageData;
