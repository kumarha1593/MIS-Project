import React from 'react'

const OverviewCard = ({ title, data, style }) => {
    return (
        <div style={style} className="card">
            <div className="card-title">{title}</div>
            <div style={{ padding: '15px' }}>
                {data?.map((item, idx) => {
                    return (
                        <div className='content-wrap' key={idx} >
                            <div className="card-content">{item?.label || ''}</div>
                            <div className="card-value">{item?.value || ': 0'}</div>
                        </div>
                    )
                })}
            </div>
        </div>

    )
}

export default OverviewCard