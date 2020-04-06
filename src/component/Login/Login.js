import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { Form, Input, Button} from "antd";
import app from "../../firebase";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { AuthContext } from "../Auth/Auth";

const defaultButton = {
    color: '#fff',
    backgroundImage: 'linear-gradient(to right top, #faad148f, #ff7875, #ff4d4f, rgb(254, 101, 79))',
    border: 'none',
    fontSize: '1.5em',
    width: 250,
    height: 55,
    fontWeight: 'bold'
}

const activeButton = {
    color: '#fff',
    backgroundImage: 'linear-gradient(to right top, #faad148f, #ff7875, #ff4d4f, rgb(254, 101, 79))',
    border: 'none',
    fontSize: '1.5em',
    width: 270,
    height: 60,
    fontWeight: 'bold'
}

const Login = ({ history }) => {
    const [fail, setFail] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);

    const handleLogin = useCallback(
        async event => {
          try {
            await app
              .auth()
              .signInWithEmailAndPassword(event.email, event.password);
            history.push("/");
          } catch (error) {
            alert(error);
          }
        },
        [history]
    );

    const loginFailed = () => {
        setFail(true);
    }

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div style={{width: 350, textAlign: 'center', margin: 'auto', paddingTop: 90}}>
            <h1 style={{color: '#fff'}}>Login</h1>
            <Form
                name="normal_login"
                className="login-form"
                onFinish={handleLogin}
                onFinishFailed={loginFailed}
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Inserisci la tua e-mail!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email"/>
                </Form.Item>

                <Form.Item
                    name="password"                   
                    rules={[{ required: true, message: 'Inserisci la tua password!' }]}
                >
                    <Input 
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button 
                        onMouseEnter={() => setButtonActive(true)}
                        onMouseLeave={() => setButtonActive(false)}
                        style={buttonActive ? activeButton : defaultButton}
                        type="primary" 
                        htmlType="submit" 
                        className="login-form-button"
                    >
                        Accedi
                    </Button>
                </Form.Item>
            </Form>
            {
                fail ?
                (<p style={{color: 'red', marginTop: 20}}><strong>Accesso non riuscito. Ritenta</strong></p>) : (null)
            }
        </div>
    )
}

export default withRouter(Login);