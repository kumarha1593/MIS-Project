import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from './Filters';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import FamilyMembers from './FamilyMembers';
import moment from 'moment';

const Users = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const currentDate = moment().format('YYYY-MM-DD')

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [allData, setAllData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchMasterList = async () => {
        const params = {
            page_limit: queryParams?.page_limit || 20,
            skip_count: queryParams?.skip_count || 0,
            from_date: queryParams?.from_date || currentDate,
            to_date: queryParams?.to_date || currentDate,
            status: queryParams?.status == "all" ? "" : queryParams?.status ? queryParams?.status : 1,
            risk_score: "",
            case_of_htn: "",
            case_of_dm: "",
            suspected_oral_cancer: "",
            suspected_breast_cancer: "",
            cervical_cancer: "",
            known_cvd: "",
            history_of_stroke: "",
            known_ckd: "",
            cataract_assessment_result: "",
            difficulty_hearing: "",
            abhaid_status: "",
            search_term: queryParams?.search_term || ""
        }
        const response = await defaultInstance.get(API_ENDPOINTS.USER_MASTER_LIST, { params: params });
        if (response?.data?.data?.length > 0 && response?.data?.success) {
            setAllData(response?.data?.data);
            setTotalCount(response?.data?.total_count || 0)
        }
    }

    const handlePaginate = (type) => {
        const { role_type, from_date, to_date, search_term, status, page_limit = 20, skip_count = 0 } = queryParams || {};
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

        navigate(`/users?role_type=${role_type}&from_date=${from_date || currentDate}&to_date=${to_date || currentDate}&search_term=${search_term || ''}&status=${status || 1}&page_limit=${newPageLimit}&skip_count=${newSkipCount}`);
    };


    useEffect(() => {
        fetchMasterList();
    }, [JSON.stringify(queryParams)]);

    return (
        <div className="role-container">
            <Filters
                queryParams={queryParams}
                totalCount={totalCount}
                viewingCount={Number(queryParams?.skip_count) + 20}
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