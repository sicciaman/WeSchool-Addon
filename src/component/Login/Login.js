import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { Form, Input, Button} from "antd";
import app from "../../firebase";

import { AuthContext } from "../Auth/Auth";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


const Login = ({ history }) => {
    const [fail, setFail] = useState(false);

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
        <div style={{width: 450, textAlign: 'center', margin: 'auto', paddingTop: 90}}>
            <h2 style={{marginLeft: 135}}>Login</h2>
            <Form
                {...layout}
                name="basic"
                onFinish={handleLogin}
                onFinishFailed={loginFailed}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Inserisci la tua e-mail!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Inserisci la tua password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
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