import { Form, Input, Tag, Button, Empty } from "antd";
import React from "react";
import * as Constants from "../utils/constants";
import { postExpense, fetchWallet, fetchUserInfo } from "../utils/function";
import { LoadingOutlined } from "@ant-design/icons";
import {
    IGetWalletResponse,
    IPostTransactionResponse,
    ILoginAPIResponse,
} from "../types/interfaces/api-response";
import { IPostExpenseFnInput } from "../types/interfaces/generic";
import { AxiosResponse, AxiosError } from "axios";
import { Store } from "antd/lib/form/interface";
import { RouteComponentProps } from "react-router-dom";
import { EUserRole } from "../types/enums/generic";
import Loading from "../components/Loading";

const fieldNames = {
    category: "category",
    expense: "expense",
    comments: "comments",
};

interface IProps extends RouteComponentProps {}

interface IState {
    wallet: IGetWalletResponse | undefined;
    walletLoading: boolean;
    postingData: boolean;
}

export default class Expense extends React.Component<IProps, IState> {
    formRef = React.createRef<any>();

    state: IState = {
        wallet: undefined,
        walletLoading: false,
        postingData: false,
    };

    componentWillMount() {
        this.setState({ walletLoading: true });
        this.fetchWallet();
    }

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

    handleSubmit = (values: Store): void => {
        this.setState({ postingData: true });
        postExpense(values as IPostExpenseFnInput)
            .then((response: AxiosResponse<IPostTransactionResponse>) => {
                this.setState({ postingData: false });
                this.formRef.current.resetFields();
                this.fetchWallet();
            })
            .catch((err: AxiosError<any>) => {
                console.log("err: While posting transaction data", err);
                alert(err.response?.data?.message || "Transaction failed");
                this.setState({ postingData: false });
            });
    };

    render() {
        const CategoryTags: JSX.Element[] = Constants.CATEGORIES.map((item) => {
            return (
                <Tag
                    color={item.color}
                    style={{ padding: "0px 10px", margin: "5px" }}
                    onClick={() => {
                        this.formRef.current.setFieldsValue({
                            category: item.name,
                        });
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {item.name}
                </Tag>
            );
        });

        const AmountTags: JSX.Element[] = Constants.AMOUNT.map((item) => {
            return (
                <Tag
                    color={item.color}
                    style={{ padding: "0px 10px", margin: "5px" }}
                    onClick={(e) => {
                        e.preventDefault();
                        let currentExpense: number | string =
                            this.formRef.current.getFieldValue(
                                fieldNames.expense
                            ) || 0;
                        let finalValue =
                            Number(item.name) + Number(currentExpense);
                        this.formRef.current.setFieldsValue({
                            expense: finalValue < 0 ? 0 : finalValue,
                        });
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {item.name}
                </Tag>
            );
        });

        let userLoginData: null | ILoginAPIResponse = fetchUserInfo();
        if (!userLoginData || !this.state.wallet) {
            return <Loading />;
        }

        return this.state.wallet.balance <= 0 ? (
            <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                    height: 60,
                }}
                description={<span>Wallet is Empty</span>}
            >
                <Button
                    type="primary"
                    onClick={() => {
                        this.props.history.push(Constants.LOCATION.DEPOSIT);
                        window.location.reload();
                    }}
                >
                    Deposit Now
                </Button>
            </Empty>
        ) : (
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
                        {this.state.walletLoading && <LoadingOutlined />}
                        {!this.state.walletLoading && (
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
                                message: "Please select Category",
                            },
                        ]}
                        label="Category"
                        name={fieldNames.category}
                    >
                        <Input
                            placeholder="Category"
                            onChange={(e) =>
                                this.formRef.current.setFieldsValue({
                                    [fieldNames.category]: "",
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Shorthands">{CategoryTags}</Form.Item>

                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Please add expense",
                            },
                        ]}
                        label="Expense"
                        name={fieldNames.expense}
                    >
                        <Input placeholder="Enter Amount" type="number" />
                        {/* <InputNumber /> */}
                    </Form.Item>

                    <Form.Item label="Shorthands">{AmountTags}</Form.Item>

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
