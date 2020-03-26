import React, { useState } from 'react';

const normalCard = {
    width: 300, 
    border: '1px solid #000', 
    borderRadius: 4, 
    textAlign: 'center', 
    margin: 25, 
    cursor: 'pointer', 
    boxShadow: '3px 3px 3px #888888'
}

const activeCard = {
    width: 300, 
    border: '1px solid #000', 
    borderRadius: 4, 
    textAlign: 'center', 
    margin: 25, 
    cursor: 'pointer', 
    boxShadow: '3px 3px 3px #1890ff'
}

export default ({title, subtitle}) => {
    const [active, setActive] = useState(false);

    return (
        <div 
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            style={active ? activeCard : normalCard}
        >
            <h2 
                style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    margin: 15
                }}
            >   
                {title}
            </h2>
            <hr style={{margin: 10, color: '#888'}} />
            <p 
                style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    margin: 15,
                    color: '#888'
                    }}
            >
                {subtitle}
            </p>
      </div>
    );
}