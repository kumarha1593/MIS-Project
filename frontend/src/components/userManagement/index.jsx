import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Filters from './Filters';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import FamilyMembers from './FamilyMembers';
import moment from 'moment';

const Users = () => {

    const location = useLocation();

    const currentDate = moment().format('YYYY-MM-DD')

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [allData, setAllData] = useState([]);

    const getMasterList = async () => {
        const params = {
            page_limit: queryParams?.page_limit || 20,
            skip_count: queryParams?.skip_count || 0,
            from_date: queryParams?.from_date || currentDate,
            to_date: queryParams?.to_date || currentDate,
            status: "",
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
            search_term: ""
        }
        const response = await defaultInstance.get(API_ENDPOINTS.USER_MASTER_LIST, { params: params });
        if (response?.data?.data?.length > 0 && response?.data?.success) {
            setAllData(response?.data?.data)
        }
    }

    useEffect(() => {
        getMasterList();
    }, [JSON.stringify(queryParams)]);

    return (
        <div className="role-container">
            <Filters queryParams={queryParams} />
            <FamilyMembers data={allData} />
        </div>
    )
}

export default Users