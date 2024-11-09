import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from './Filters';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import FamilyMembers from './FamilyMembers';
import { getFilterQuery, ROLE_TYPE } from '../../utils/helper';
import UpdateMem from './UpdateMem';

const Users = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [allData, setAllData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showMemModal, setShowMemModal] = useState(false);

    const fetchMasterList = async () => {
        const response = await defaultInstance.get(API_ENDPOINTS.USER_MASTER_LIST, { params: queryParams });
        if (response?.data?.success) {
            setAllData(response?.data?.data?.length > 0 ? response?.data?.data : []);
            setTotalCount(response?.data?.total_count || 0)
        }
    }

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

    const showEditAction = queryParams?.role_type === ROLE_TYPE.ZONAL_MANAGER ? true : false

    return (
        <div className="role-container">
            <Filters
                queryParams={queryParams}
                totalCount={totalCount}
                viewingCount={Number(queryParams?.skip_count) + 50}
                onExport={onExport}
                onEdit={() => setShowMemModal(true)}
                selectedItem={selectedItem}
            />
            <FamilyMembers
                data={allData}
                selectedItem={selectedItem}
                onChange={(mem) => setSelectedItem(selectedItem?.fm_id == mem?.fm_id ? null : mem)}
                showEditAction={showEditAction}
            />
            <div className='custom-pagination'>
                <div className="option-container">
                    <div onClick={() => handlePaginate('P')} className="option">Previous</div>
                    <div onClick={() => handlePaginate('N')} className="option">Next</div>
                </div>
            </div>
            <UpdateMem
                visible={showMemModal}
                onDismiss={() => setShowMemModal(false)}
                data={selectedItem}
                onDone={fetchMasterList}
            />
        </div>
    )
}

export default Users