import React from 'react';

import { Input, Radio } from 'antd';


const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

export default class inputOption extends React.Component {
    constructor(props) {
        super(props);

        this.setRadio = this.setRadio.bind(this);
    }

    setRadio = (e) => {
        this.props.setRadio(e, this.props.i);
    }

    setInput = (e, elem) => {
        this.props.setInput(e, this.props.i, elem)
    }

    render() {
        const index = this.props.i;

        return(
            <div style={{margin: 15}}>
                <h4 style={{color: '#fff'}}>Opzione {index+1}</h4>
                <Radio.Group value={this.props.opt.rightAnswer} onChange={this.setRadio}>
                    <Radio style={radioStyle} value={1}>
                        <Input onChange={e => this.setInput(e, 1)} style={{ width: 100, marginLeft: 10 }} />
                    </Radio>
                    <Radio style={radioStyle} value={2}>
                        <Input onChange={e => this.setInput(e, 2)} style={{ width: 100, marginLeft: 10 }} />
                    </Radio>
                    <Radio style={radioStyle} value={3}>
                        <Input onChange={e => this.setInput(e, 3)} style={{ width: 100, marginLeft: 10 }} />
                    </Radio>
                </Radio.Group>
            </div>
        );
    }
}

