import React, { useState } from 'react';

import dashboard from '../../utility/images/dashboard.svg';
import manage from '../../utility/images/manage.svg';

const normalCard = {
    width: 350, 
    height: 220,
    borderRadius: 25, 
    textAlign: 'center', 
    margin: 25, 
    cursor: 'pointer', 
    boxShadow: '0px 4px 4px rgba(0,0,0,1)',
    backgroundColor: '#fff'
}

const activeCard = {
    width: 350, 
    height: 220,
    borderRadius: 25, 
    textAlign: 'center', 
    margin: 25, 
    cursor: 'pointer', 
    boxShadow: '0px 4px 4px rgba(254,101,79,1)',
    backgroundColor: '#fff'
}

export default ({title, subtitle, dash}) => {
    const [active, setActive] = useState(false);

    return (
        <div 
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            style={active ? activeCard : normalCard}
        >
            <div style={{backgroundImage: 'linear-gradient(to top right, #FED99B, #FED391, #F2A65A, #FE654F)', borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
                <div style={{fontSize: 28, fontWeight: 'bold', color: '#FEFEFF', width: '50%',  marginLeft: 'auto', paddingTop: 5}}>
                    <div>
                        <img src={dash ? dashboard : manage} height='58' width='58'/>
                    </div>
                    {title}
                </div>
            </div>
            <p 
                style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    margin: 15,
                    marginTop: 40,
                    color: '#888',
                    fontSize: 18,
                    }}
            >
                {subtitle}
            </p>
      </div>
    );
}