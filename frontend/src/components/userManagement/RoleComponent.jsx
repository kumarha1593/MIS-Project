import React, { useState } from 'react';
import RoleItems from './RoleItems';

const RoleComponent = ({ roleName, nextRoleComponent: NextRole }) => {
    const [data, setData] = useState(Array(10).fill({ name: roleName, is_open: false, is_checked: false }));

    const toggleVisibility = (idx) => {
        setData((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[idx].is_open = !prev[idx].is_open;
            return newVisibility;
        });
    };

    return (
        <div className="">
            {data?.map((item, idx) => (
                <div className="common-container" key={idx}>
                    <RoleItems
                        onClick={() => toggleVisibility(idx)}
                        roleItems={{ name: `${item?.name} ${idx + 1}` }}
                    />
                    {data[idx]?.is_open && NextRole && (
                        <div className="common-left-alignment">
                            <NextRole />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RoleComponent;
