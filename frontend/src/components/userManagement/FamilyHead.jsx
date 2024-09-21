import React, { useState } from 'react';
import RoleItems from './RoleItems';
import FamilyMembers from './FamilyMembers'

const FamilyHead = ({ setAddRemarks = () => { } }) => {
    const [data, setData] = useState(Array(10).fill({ name: 'Family Head', is_open: false }));

    const toggleFHVisibility = (fhIdx) => {
        setData((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[fhIdx].is_open = !prev[fhIdx].is_open;
            return newVisibility;
        });
    };

    return (
        <div className='common-left-alignment'>
            {data.map((fh, fhIdx) => (
                <div className="common-container" key={fhIdx}>
                    <RoleItems
                        onClick={() => toggleFHVisibility(fhIdx)}
                        roleItems={{ name: `${fh?.name} ${fhIdx + 1}` }}
                        showAction
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
                    {data[fhIdx]?.is_open && (
                        <div style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                            <FamilyMembers />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FamilyHead;
