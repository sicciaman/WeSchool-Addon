import React from 'react';

import { HomeOutlined } from '@ant-design/icons';


export default () => {

    return (
        <div style={{
            position: 'fixed',
            top: 15,
            right: 30,
            color: '#1890ff'
        }}>
            <a
                href="/"
            >
                <span>
                    <HomeOutlined style={{fontSize: 45}}/>
                    <p>Home</p>
                </span>
            </a>
            
        </div>
    );

}