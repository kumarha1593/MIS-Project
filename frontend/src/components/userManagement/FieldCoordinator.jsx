import React from 'react';
import RoleItems from './RoleItems';
import FamilyHead from './FamilyHead';

const FieldCoordinator = ({ setAddRemarks = () => { }, data, toggleVisibility, nextRoleData }) => {
    return (
        <div className=''>
            {data.map((fc, fcIdx) => (
                <div className="common-container" key={fcIdx}>
                    <RoleItems
                        onClick={() => toggleVisibility(fcIdx, fc)}
                        roleItems={fc}
                    />
                    {data[fcIdx]?.is_open && (
                        <>
                            <FamilyHead
                                data={nextRoleData}
                                setAddRemarks={setAddRemarks}
                            />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FieldCoordinator;
