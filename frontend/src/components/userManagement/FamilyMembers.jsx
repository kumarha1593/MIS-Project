import React from 'react'
import { allParameters } from '../../utils/helper'
import moment from 'moment';

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
                                            checked={selectedItem?.fm_id == mem?.fm_id ? true : false}
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
                                    details.pi_dob = moment(mem?.pi_dob).format('MMMM D, YYYY');
                                }
                                if (item?.value === 'screening_date' && mem?.screening_date) {
                                    details.screening_date = moment(mem?.screening_date).format('MMMM D, YYYY');
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