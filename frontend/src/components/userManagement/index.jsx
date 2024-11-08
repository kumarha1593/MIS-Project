import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from './Filters';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import FamilyMembers from './FamilyMembers';
import { getFilterQuery } from '../../utils/helper';

const Users = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [allData, setAllData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchMasterList = async () => {
        const response = await defaultInstance.get(API_ENDPOINTS.USER_MASTER_LIST, { params: queryParams });
        if (response?.data?.success) {
            setAllData(response?.data?.data?.length > 0 ? response?.data?.data : []);
            setTotalCount(response?.data?.total_count || 0)
        }
    }

    const handlePaginate = (type) => {
        const { page_limit = 20, skip_count = 0 } = queryParams || {};
        const newPageLimit = page_limit;
        let newSkipCount = Number(skip_count);

        if (type === 'N') {
            newSkipCount += 20;
            if (newSkipCount >= totalCount) {
                newSkipCount = totalCount - (totalCount % page_limit);
            }
        } else if (type === 'P') {
            newSkipCount -= 20;
            if (newSkipCount < 0) {
                newSkipCount = 0;
            }
        }

        const queryString = getFilterQuery({ ...queryParams, page_limit: newPageLimit, skip_count: newSkipCount })

        navigate(`/users?${queryString}`);
    };

    const onExport = async () => {
        const response = await defaultInstance.get(API_ENDPOINTS.EXPORT_MASTER_LIST, { params: queryParams });
        const blob = new Blob([response?.data], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = "data.csv";
        link.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        fetchMasterList();
    }, [JSON.stringify(queryParams)]);

    return (
        <div className="role-container">
            <Filters
                queryParams={queryParams}
                totalCount={totalCount}
                viewingCount={Number(queryParams?.skip_count) + 20}
                onExport={onExport}
            />
            <FamilyMembers data={allData} />
            <div className='custom-pagination'>
                <div class="option-container">
                    <div onClick={() => handlePaginate('P')} class="option">Previous</div>
                    <div onClick={() => handlePaginate('N')} class="option">Next</div>
                </div>
            </div>
        </div>
    )
}

export default Users