import React, { useState } from 'react';
import RoleItems from './RoleItems';
import FamilyHead from './FamilyHead';

const FieldCoordinator = ({ setAddRemarks = () => { } }) => {
    const [data, setData] = useState(Array(10).fill({ name: 'Field Coordinator', is_open: false }));

    const toggleFCVisibility = (fcIdx) => {
        setData((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[fcIdx].is_open = !prev[fcIdx].is_open;
            return newVisibility;
        });
    };

    return (
        <div className=''>
            {data.map((fc, fcIdx) => (
                <div className="common-container" key={fcIdx}>
                    <RoleItems
                        onClick={() => toggleFCVisibility(fcIdx)}
                        roleItems={{ name: `${fc?.name} ${fcIdx + 1}` }}
                    />
                    {data[fcIdx]?.is_open && (
                        <>
                            <FamilyHead setAddRemarks={setAddRemarks} />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FieldCoordinator;
