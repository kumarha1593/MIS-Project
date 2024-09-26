import React, { useEffect, useState } from 'react';
import RoleItems from './RoleItems';
import FamilyMembers from './FamilyMembers'
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';

const FamilyHead = ({ setAddRemarks = () => { }, data }) => {

    const [allData, setAllData] = useState([]);
    const [nextRoleData, setNextRoleData] = useState([]);

    useEffect(() => {
        if (data?.length > 0) {
            setAllData(data)
        }
    }, [JSON.stringify(data)])

    const toggleVisibility = (idx, currentItem) => {
        setAllData((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[idx].is_open = !prev[idx].is_open;
            return newVisibility;
        });
        fetchData(currentItem)
    };

    const fetchData = async (currentItem) => {
        try {
            const response = await defaultInstance.get(API_ENDPOINTS.FAMILY_DETAILS, { params: { head_id: currentItem?.id } });
            if (response?.data?.success) {
                const list = response?.data?.data?.length > 0 ? response?.data?.data : []
                list?.map((item) => {
                    item.is_open = false;
                    item.is_checked = false;
                    return item;
                });
                setNextRoleData(list);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return (
        <div className='common-left-alignment'>
            {allData?.map((fh, fhIdx) => (
                <div className="common-container" key={fhIdx}>
                    <RoleItems
                        onClick={() => toggleVisibility(fhIdx, fh)}
                        roleItems={fh}
                        // showAction
                        onAction={(type) => {
                            if (type === 'REMARKS') {
                                setAddRemarks(true)
                            }
                            if (type === 'APPROVE') {
                                alert('Approve success!')
                                // Approve logic
                            }
                        }}
                    />
                    {allData[fhIdx]?.is_open && (
                        <div style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                            <FamilyMembers
                                data={nextRoleData}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FamilyHead;
