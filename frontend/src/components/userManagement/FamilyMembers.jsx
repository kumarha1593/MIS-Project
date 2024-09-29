import React from 'react'
import { allParameters } from '../../utils/helper'

const FamilyMembers = ({ data }) => {
    return (
        <div className="fm-item-container">
            <table className="fm-item-table">
                <thead>
                    <tr>
                        {allParameters?.map((parameter, paramIdx) => (
                            <th key={paramIdx}>{parameter?.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((mem, memIdx) => (
                        <tr key={memIdx}>
                            {allParameters?.map((item, dataIdx) => {
                                let details = mem;
                                if (item?.key === 'dob' && mem?.dob) {
                                    const date = new Date(mem?.dob);
                                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                    const readableDate = date.toLocaleDateString('en-US', options);
                                    details.dob = readableDate
                                }
                                return (
                                    <td key={dataIdx}>{mem?.[item?.key] || 'Not filled'}</td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default FamilyMembers