import React from 'react';
import RoleItems from './RoleItems';

const RoleComponent = ({ data, nextRoleData, nextRoleComponent: NextRole, toggleVisibility }) => {

    return (
        <div className="">
            {data?.map((item, idx) => (
                <div className="common-container" key={idx}>
                    <RoleItems
                        onClick={() => toggleVisibility(idx, item)}
                        roleItems={item}
                    />
                    {data[idx]?.is_open && NextRole && (
                        <div className="common-left-alignment">
                            <NextRole data={nextRoleData} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RoleComponent;
