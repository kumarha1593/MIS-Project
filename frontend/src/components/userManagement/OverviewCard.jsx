import React from 'react'

const OverviewCard = ({ title, data, style, values, type }) => {
    return (
        <div style={style} className="card">
            <div className="card-title">{title}</div>
            <div style={{ padding: '15px' }}>
                {data?.map((item, idx) => {
                    return (
                        <div className='content-wrap' key={idx} >
                            <div className="card-content">{type == 'age' ? `${item?.age}:` : item?.label ? item?.label : ''}</div>
                            <div className="card-value">{type == 'age' ? item?.age_count : values?.[item?.key] ? values?.[item?.key] : item?.default_value}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OverviewCard