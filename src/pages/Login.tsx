import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Axios, { AxiosResponse, AxiosError } from "axios";
import { URLS, LOCATION } from "../utils/constants";
import SHA256 from "../utils/hashing";
import { RouteComponentProps } from "react-router-dom";
import { Store } from "antd/lib/form/interface";
import { ILoginAPIResponse } from "../types/interfaces/api-response";
interface IProps extends RouteComponentProps {}

interface IState {
    loading: boolean;
    invalidCreds: boolean;
}

export default class Login extends React.Component<IProps, IState> {
    state: IState = {
        loading: false,
        invalidCreds: false,
    };

    onFinish = (formValues: Store) => {
        let values = formValues as { username: string; password: string };
        this.setState({ invalidCreds: false, loading: true });
        console.log("Received values of form: ", values);
        let queryPararm = `?user_name=${values.username}&password=${SHA256(
            values.password
        )}`;
        Axios.get(URLS.LOGIN + queryPararm)
            .then((response: AxiosResponse<ILoginAPIResponse>) => {
                this.setState({ loading: false, invalidCreds: false });
                localStorage.setItem(
                    "loginUser",
                    JSON.stringify(response.data)
                );
                this.props.history.push(LOCATION.EXPENSE);
                window.location.reload();
            })
            .catch((err: AxiosError<any>) => {
                console.log("err", err);
                this.setState({ invalidCreds: true, loading: false });
            });
    };

    render() {
        return (
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinish}
            >
                {this.state.invalidCreds && (
                    <h5 style={{ color: "red" }}>Invalid Username/Password</h5>
                )}
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Username!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Password!",
                        },
                    ]}
                >
                    <Input.Password
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button
                        loading={this.state.loading}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
