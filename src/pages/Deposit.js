import React from "react";
import { Form, Input, Button } from "antd";
import { postDeposit, fetchWallet, fetchUserInfo } from "../utils/function";
import { LoadingOutlined } from "@ant-design/icons";

const fieldNames = {
    deposit: "deposit",
    comments: "comments"
}

export default class Deposit extends React.Component {
    formRef = React.createRef();

    state = {
        wallet: { balance: 0 },
        walletLoading: false,
        postingData: false
    }

    fetchWallet = () => {
        fetchWallet().then(response => {
            console.log(response.data);
            this.setState({ walletLoading: false, wallet: response.data })
        }).catch(err => {
            console.log("err occured while fetching wallet", err);
            this.setState({ walletLoading: false })
        })
    }

    componentWillMount() {
        this.setState({ walletLoading: true })
        this.fetchWallet();
    }

    handleSubmit = (values) => {
        console.log(values);
        this.setState({ postingData: true })
        postDeposit(values)
            .then(response => {
                this.setState({ postingData: false })
                this.formRef.current.resetFields();
                this.fetchWallet();
            }).catch(err => {
                console.log("err: While posting transaction data", err);
                alert("Transaction failed");
                this.setState({ postingData: false })
            })
    }

    render() {
        return (
            <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Form
                    ref={this.formRef}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={this.handleSubmit}
                    size={'large'}
                >
                    <Form.Item label="Wallet Balance"  >
                        {
                            this.state.walletLoading && <LoadingOutlined />
                        }
                        {
                            !this.state.walletLoading &&
                            <div><h1 style={{ color: '#66bb6a' }}>&#8377;{this.state.wallet.balance}<span style={{ fontWeight: 'normal', fontSize: '16px', color: 'lightgrey', alignContent: 'center' }}> ({this.state.wallet.wallet_name})</span></h1></div>
                        }
                    </Form.Item>
                    <Form.Item rules={[
                        {
                            required: true,
                            message: 'Please enter deposit amount',
                        },
                    ]} label="Add Money" name={fieldNames.deposit}>
                        <Input placeholder="Enter Amount" type="number" />
                    </Form.Item>

                    <Form.Item label="Comments" name={fieldNames.comments}>
                        <Input.TextArea placeholder="Enter Something like... Milk & Veg, etc.." />
                    </Form.Item>

                    <Form.Item wrapperCol={{ md: { offset: 4, span: 8 } }} >
                        <Button disabled={fetchUserInfo().role !== "ADMIN"} loading={this.state.postingData} type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}