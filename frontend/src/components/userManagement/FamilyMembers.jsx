import React from 'react'
import { allParameters } from '../../utils/helper'

const FamilyMembers = ({ data, onChange, selectedItem, showEditAction }) => {
    return (
        <div className="fm-item-container">
            <table className="fm-item-table">
                <thead>
                    <tr>
                        {showEditAction
                            ?
                            <th style={{ backgroundColor: '#217cc070' }}>Action</th>
                            :
                            null
                        }
                        {allParameters?.map((parameter, paramIdx) => (
                            <th style={{ backgroundColor: '#217cc070', minWidth: '200px' }} key={paramIdx}>{parameter?.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((mem, memIdx) => (
                        <tr key={memIdx}>
                            {showEditAction
                                ?
                                <td>
                                    <div style={{ paddingTop: '5px', justifyContent: 'center' }} className='select-all-checkbox'>
                                        <input
                                            type="checkbox"
                                            id="select_all"
                                            checked={selectedItem?.family_members_name == mem?.family_members_name ? true : false}
                                            onChange={(e) => onChange(mem)}
                                        />
                                    </div>
                                </td>
                                :
                                null
                            }
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
                                    <td style={{ minWidth: '200px' }} key={dataIdx}>{mem?.[item?.value] || 'Not filled'}</td>
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