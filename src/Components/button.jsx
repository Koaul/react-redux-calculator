import React from 'react';
const button = ({buttons, mathAction}) => (
    <div className = 'button-grid'>
        {
            buttons.map( (item) => {
                return(
                    <div key={Date.now() + Math.random()} 
                    className={item.operator ? 'button-item operator' : item.equalOperator ? 'button-item equal-operator' : 'button-item'} 
                    onClick={() => mathAction(item.text, item.name)}
                    >
                        {item.text}
                    </div>
                )
            })
        }
    </div>
)
export default button