import React from 'react';

import ManageDash from '../../routes/manage';
import Header from '../Header/Header';

export default () => {
    return (
        <>
            <Header />
            <div style={{paddingTop: 100, width: '100%', textAlign: 'center', backgroundColor: '#2b2924'}}>
                <ManageDash />
            </div>
        </>
    )
}