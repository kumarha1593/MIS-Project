import React from 'react'
import { allParameters } from '../../utils/helper'

const FamilyMembers = ({ data }) => {
    return (
        <div className="fm-item-container">
            <table className="fm-item-table">
                <thead>
                    <tr>
                        {allParameters?.map((parameter, paramIdx) => (
                            <th style={{ backgroundColor: '#217cc070' }} key={paramIdx}>{parameter?.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((mem, memIdx) => (
                        <tr key={memIdx}>
                            {allParameters?.map((item, dataIdx) => {
                                let details = mem;
                                if (item?.value === 'pi_dob' && mem?.pi_dob) {
                                    const date = new Date(mem?.pi_dob);
                                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                    const readableDate = date.toLocaleDateString('en-US', options);
                                    details.pi_dob = readableDate
                                }
                                if (item?.value === 'screening_date' && mem?.screening_date) {
                                    const date = new Date(mem?.screening_date);
                                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                    const readableDate = date.toLocaleDateString('en-US', options);
                                    details.screening_date = readableDate
                                }
                                return (
                                    <td key={dataIdx}>{mem?.[item?.value] || 'Not filled'}</td>
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