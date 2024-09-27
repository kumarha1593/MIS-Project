import React from 'react'

const FamilyMembers = ({ data }) => {
    console.log(data, "Final data")
    return (
        <div className="fm-item-container">
            <table className="fm-item-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        {Array(50).fill(null).map((parameter, paramIdx) => (
                            <th key={paramIdx}>Parameter {paramIdx + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array(5).fill(null).map((mem, memIdx) => (
                        <tr key={memIdx}>
                            {Array(53).fill(null).map((data, dataIdx) => (
                                <td key={dataIdx}>Lorem Ipsum</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default FamilyMembers