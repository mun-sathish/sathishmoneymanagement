import React from "react";
import {
    Switch,
    Route,
    Link
} from "react-router-dom";
import { AppstoreAddOutlined, TransactionOutlined, DollarCircleOutlined, SlackOutlined, ManOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Deposit from "../pages/Deposit";
import Transaction from "../pages/Transaction";
import Expense from "../pages/Expense";
import Login from "../pages/Login";
import { LOCATION } from "../utils/constants";

const MenuLinks = (props) => {
    let isLogin = window.location.href.includes(LOCATION.LOGIN);
    let defaultKey = '1';
    if(window.location.href.includes(LOCATION.TRANSACTION))
        defaultKey = '2';
    else if(window.location.href.includes(LOCATION.DEPOSIT))
        defaultKey = '3';
    return isLogin ?
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1"><SlackOutlined style={{ fontSize: 25 }} /></Menu.Item>
        </Menu>
        :
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[defaultKey]}>
            <Menu.Item key="1"><Link to={LOCATION.EXPENSE}><AppstoreAddOutlined style={{ fontSize: 25 }} /></Link></Menu.Item>
            <Menu.Item key="2"><Link to={LOCATION.TRANSACTION}><TransactionOutlined style={{ fontSize: 25 }} /></Link></Menu.Item>
            <Menu.Item key="3"><Link to={LOCATION.DEPOSIT}><DollarCircleOutlined style={{ fontSize: 25 }} /></Link></Menu.Item>
            <Menu.Item key="4"><Link to={LOCATION.LOGIN} onClick={() => {
                localStorage.removeItem("loginUser");
                window.location.reload();
            }}><ManOutlined style={{ fontSize: 25 }} /></Link></Menu.Item>
        </Menu>
}
const AppRouter = (props) => {
    return (
        <Switch>
            <Route exact  path={LOCATION.EXPENSE} component={Expense} />
            <Route path={LOCATION.TRANSACTION} component={Transaction} />
            <Route path={LOCATION.DEPOSIT} component={Deposit} />
            <Route path={LOCATION.LOGIN}  component={(children) => <Login forceUpdatePage={props.forceUpdatePage} {...children} />} />
        </Switch>
    )
}


export default AppRouter;
export { MenuLinks };