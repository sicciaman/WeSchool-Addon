import React from 'react';

export default ({ setField, label }) => {
    return (
        <>
            <h3 style={{lineHeight: '40px', color: '#fff'}}>{label}</h3>
            <input onChange={setField} style={{margin: 10}} />
        </>
    );
}