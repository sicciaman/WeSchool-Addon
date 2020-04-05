import React from 'react';

import { Input } from 'antd';

const { TextArea } = Input;

export default ({text, onChange}) => {
    return (
        <div style={{margin: 20}}>
            <p style={{color: '#fff'}}>Inserisci il testo dell'esercizio e inserisci il simbolo <strong>&</strong> dove vuoi inserire un menù a tendina</p>
            <TextArea value={text} onChange={(e) => onChange(e.target.value)} rows={8} style={{width: 500, marginLeft: 20}} />
        </div>
    );
}