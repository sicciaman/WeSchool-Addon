import React, { useState } from 'react';

const normalCard = {
    width: 310, 
    height: 190,
    borderRadius: 25, 
    textAlign: 'center', 
    margin: 25, 
    cursor: 'pointer', 
    boxShadow: '0px 4px 4px rgba(0,0,0,1)',
    backgroundColor: '#fff'
}

const activeCard = {
    width: 310, 
    height: 190,
    borderRadius: 25, 
    textAlign: 'center', 
    margin: 25, 
    cursor: 'pointer', 
    boxShadow: '0px 4px 4px rgba(254,101,79,1)',
    backgroundColor: '#fff'
}

export default ({title, subtitle, icon}) => {
    const [active, setActive] = useState(false);

    return (
        <div 
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            style={active ? activeCard : normalCard}
        >
            <div style={{backgroundImage: 'linear-gradient(to top right, #FED99B, #FED391, #F2A65A, #FE654F)', borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
                <div style={{fontSize: 22, fontWeight: 'bold', color: '#FEFEFF', margin: 'auto 20px', height: 80, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',}}>
                    {
                        icon ? (
                            <div style={{marginTop: 7}}>
                                <img src={icon ? icon : null} height='38' width='38'/>
                            </div>
                        ) : <div style={{width: 38, height: 38}}></div>
                    }    
                    {title}
                </div>
            </div>   
            <div 
                style={{
                    margin: 15,
                    marginTop: 40,
                    color: '#888',
                    fontSize: 18,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    }}
            >
                {subtitle}
            </div>
      </div>
    );
}