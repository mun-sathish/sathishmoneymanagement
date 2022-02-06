import React from "react";
import { Form, Input, Button } from "antd";
import { postDeposit, fetchWallet, fetchUserInfo } from "../utils/function";
import { LoadingOutlined } from "@ant-design/icons";
import { RouteComponentProps } from "react-router-dom";
import { AxiosResponse, AxiosError } from "axios";
import {
    IGetWalletResponse,
    IPostTransactionResponse,
    ILoginAPIResponse,
} from "../types/interfaces/api-response";
import { IPostDepositFnInput } from "../types/interfaces/generic";
import { Store } from "antd/lib/form/interface";
import { EUserRole } from "../types/enums/generic";

const fieldNames = {
    deposit: "deposit",
    comments: "comments",
};

interface IProps extends RouteComponentProps {}

interface IState {
    wallet: IGetWalletResponse | undefined;
    walletLoading: boolean;
    postingData: boolean;
}

export default class Deposit extends React.Component<IProps, IState> {
    formRef = React.createRef<any>(); //TODO: Find what should come instead of any

    state: IState = {
        wallet: undefined,
        walletLoading: false,
        postingData: false,
    };

    fetchWallet = (): void => {
        fetchWallet()
            .then((response: AxiosResponse<IGetWalletResponse>) => {
                this.setState({ walletLoading: false, wallet: response.data });
            })
            .catch((err: AxiosError<any>) => {
                console.log("err occured while fetching wallet", err);
                this.setState({ walletLoading: false });
            });
    };

    componentWillMount() {
        this.setState({ walletLoading: true });
        this.fetchWallet();
    }

    handleSubmit = (values: Store): void => {
        this.setState({ postingData: true });
        postDeposit(values as IPostDepositFnInput)
            .then((response: AxiosResponse<IPostTransactionResponse>) => {
                this.setState({ postingData: false });
                this.fetchWallet();
                this.formRef &&
                    this.formRef.current &&
                    this.formRef.current.resetFields();
            })
            .catch((err: AxiosError<any>) => {
                console.log("err: While posting transaction data", err);
                alert("Transaction failed");
                this.setState({ postingData: false });
            });
    };

    render() {
        let userLoginData: null | ILoginAPIResponse = fetchUserInfo();
        if (!userLoginData || !this.formRef) {
            return <div></div>;
        }
        return (
            <div
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Form
                    ref={this.formRef}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={this.handleSubmit}
                    size={"large"}
                >
                    <Form.Item label="Wallet Balance">
                        {this.state.walletLoading && !this.state.wallet && (
                            <LoadingOutlined />
                        )}
                        {!this.state.walletLoading && this.state.wallet && (
                            <div>
                                <h1 style={{ color: "#66bb6a" }}>
                                    &#8377;{this.state.wallet.balance}
                                    <span
                                        style={{
                                            fontWeight: "normal",
                                            fontSize: "16px",
                                            color: "lightgrey",
                                            alignContent: "center",
                                        }}
                                    >
                                        {" "}
                                        ({this.state.wallet.wallet_name})
                                    </span>
                                </h1>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Please enter deposit amount",
                            },
                        ]}
                        label="Add Money"
                        name={fieldNames.deposit}
                    >
                        <Input placeholder="Enter Amount" type="number" />
                    </Form.Item>

                    <Form.Item label="Comments" name={fieldNames.comments}>
                        <Input.TextArea placeholder="Enter Something like... Milk & Veg, etc.." />
                    </Form.Item>

                    <Form.Item wrapperCol={{ md: { offset: 4, span: 8 } }}>
                        <Button
                            disabled={userLoginData.role !== EUserRole.ADMIN}
                            loading={this.state.postingData}
                            type="primary"
                            htmlType="submit"
                            style={{ width: "100%" }}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
