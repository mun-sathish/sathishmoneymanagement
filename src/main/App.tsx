import { Breadcrumb, Layout, Avatar } from "antd";
import React from "react";
import { HashRouter as Router, RouteComponentProps } from "react-router-dom";
import AppRouter, { MenuLinks } from "../components/router";
import "./App.css";
import { fetchUserInfo } from "../utils/function";
import { LOCATION } from "../utils/constants";
import { ILoginAPIResponse } from "../types/interfaces/api-response";

const { Header, Content, Footer } = Layout;

interface IProps extends RouteComponentProps {}

interface IState {}

export default class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        // console.log("Passkey:" + Hash("SuguVen@123"));
        let data = fetchUserInfo(true);
        if (!data) this.props.history.push("/#" + LOCATION.LOGIN);
    }

    render() {
        let userInfo: null | ILoginAPIResponse = fetchUserInfo();
        return (
            <div>
                <Router>
                    {
                        <Layout className="layout">
                            <Header>
                                <MenuLinks />
                            </Header>
                            <Content style={{ padding: "0 20px" }}>
                                <Breadcrumb style={{ margin: "16px 0" }}>
                                    <Breadcrumb.Item>
                                        <Avatar
                                            src={
                                                userInfo &&
                                                (userInfo.first_name
                                                    .toLowerCase()
                                                    .includes("sugan") ||
                                                    userInfo.first_name
                                                        .toLowerCase()
                                                        .includes("latha"))
                                                    ? "https://images.vexels.com/media/users/3/157837/isolated/preview/db181fb308b9a32197d9c3cadc58c4d3-asymmetric-cut-hair-woman-avatar-by-vexels.png"
                                                    : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                            }
                                        />{" "}
                                        Hey...{" "}
                                        {userInfo
                                            ? `${userInfo.first_name} ${userInfo.last_name}`
                                            : "Guest"}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div className="site-layout-content">
                                    <AppRouter />
                                </div>
                            </Content>
                            <Footer style={{ textAlign: "center" }}>
                                Developed by Sathish
                            </Footer>
                        </Layout>
                    }
                </Router>
            </div>
        );
    }
}
