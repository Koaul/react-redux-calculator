import React from 'react'

const display = ({value}) => (
    <div className="display">
        <span className="display-header">Calculator</span>
        <div className="display-value">{value}</div>
    </div>
)
export default display;