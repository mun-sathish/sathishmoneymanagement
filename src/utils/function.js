import Axios from "axios";
import { URLS } from "./constants";

function fetchUserInfo(hotReload = false) {
    let obj = localStorage.getItem("loginUser");
    if (!obj)
        return null;
    let parsed = JSON.parse(obj);
    if (!parsed)
        return null;
    if (!parsed.user_id)
        return null;
    let queryPararm = `?user_name=${parsed.user_name}&password=${parsed.password}`;
    if (hotReload) {
        Axios.get(URLS.LOGIN + queryPararm).then(response => {
            localStorage.setItem("loginUser", JSON.stringify(response.data))
        }).catch(err => {
            console.log("err occured while fetching user info", err);
            localStorage.removeItem("loginUser");
            window.location.reload();
        })
    }
    return parsed;
}

function postExpense(values) {
    let userData = fetchUserInfo(true);
    let postData = {
        category: values.category,
        amount: values.expense,
        comments: values.comments,
        type: "W",
        wallet_id: userData.wallet_id,
        created: new Date().getTime(),
        created_by: userData.user_id,
    }

    let queryParams = "?";
    Object.keys(postData).forEach(item => {
        queryParams += `${item}=${postData[item]}&`
    })
    queryParams = queryParams.substring(0, queryParams.length - 1);
    return Axios.get(URLS.POST_TRANSACTION + queryParams);
}

function fetchWallet() {
    let userInfo = fetchUserInfo();
    return !userInfo ? Promise.reject("not logged in") :
        Axios.get(`${URLS.GET_WALLET}?wallet_id=${userInfo.wallet_id}`);
}

function revertTransaction(transaction_id) {
    return Axios.get(`${URLS.REVERT_TRANSACTION}?transaction_id=${transaction_id}`);
}

function postDeposit(values) {
    let userData = fetchUserInfo(true);
    let postData = {
        amount: values.deposit,
        comments: values.comments,
        type: "D",
        wallet_id: userData.wallet_id,
        created: new Date().getTime(),
        created_by: userData.user_id,
        deposited_by: userData.user_id
    }

    let queryParams = "?";
    Object.keys(postData).forEach(item => {
        queryParams += `${item}=${postData[item]}&`
    })
    queryParams = queryParams.substring(0, queryParams.length - 1);
    return Axios.get(URLS.POST_TRANSACTION + queryParams);
}


function fetchTransaction() {
    return Axios.get(`${URLS.GET_TRANSACTION}?wallet_id=${fetchUserInfo().wallet_id}`);
}

export { fetchUserInfo, postExpense, fetchWallet, postDeposit, fetchTransaction, revertTransaction }