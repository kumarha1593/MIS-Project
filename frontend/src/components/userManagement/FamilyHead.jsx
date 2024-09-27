import React from 'react';
import RoleItems from './RoleItems';
import FamilyMembers from './FamilyMembers'
import useManageData from './useManageData';

const FamilyHead = ({ setAddRemarks = () => { }, data }) => {

    const { allData, nextRoleData, toggleVisibility } = useManageData(data, null, false, true);

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
