import Axios, { AxiosError, AxiosResponse } from "axios";
import { ETransactionType } from "../types/enums/generic";
import {
    IGetRevertTransactionResponse,
    IGetTransactionResponse,
    IGetWalletResponse,
    ILoginAPIResponse,
    IPostTransactionRequest,
    IPostTransactionResponse,
} from "../types/interfaces/api-response";
import {
    IPostDepositFnInput,
    IPostExpenseFnInput,
} from "../types/interfaces/generic";
import { URLS } from "./constants";

function fetchUserInfo(hotReload: boolean = false): null | ILoginAPIResponse {
    let obj: string | null = localStorage.getItem("loginUser");
    if (!obj) return null;
    let parsed: ILoginAPIResponse = JSON.parse(obj);
    if (!parsed) return null;
    if (!parsed.user_id) return null;
    // let queryPararm: string = `?user_name=${parsed.user_name}&password=${parsed.password}`;
    if (hotReload) {
        Axios.post(URLS.LOGIN, parsed)
            .then((response: AxiosResponse<ILoginAPIResponse>) => {
                localStorage.setItem(
                    "loginUser",
                    JSON.stringify(response.data)
                );
            })
            .catch((err: AxiosError<any>) => {
                console.log("err occured while fetching user info", err);
                localStorage.removeItem("loginUser");
                window.location.reload();
            });
    }
    return parsed;
}

function rejectPromise(msg: string = "Rejected"): Promise<any> {
    return Promise.reject(msg);
}

function postExpense(
    values: IPostExpenseFnInput
): Promise<AxiosResponse<IPostTransactionResponse>> {
    let userData: ILoginAPIResponse | null = fetchUserInfo(true);
    if (!userData) return rejectPromise();
    let postData: IPostTransactionRequest = {
        category: values.category,
        amount: values.expense,
        comments: values.comments,
        type: ETransactionType.WITHDRAWAL,
        wallet_id: userData.wallet_id,
        created: new Date().getTime(),
        created_by: userData.user_id,
        created_by_name: userData.user_name,
    };

    return Axios.post(URLS.POST_TRANSACTION, postData);
}

function fetchWallet(): Promise<AxiosResponse<IGetWalletResponse>> {
    let userInfo: ILoginAPIResponse | null = fetchUserInfo();
    return !userInfo
        ? Promise.reject("not logged in")
        : Axios.get(URLS.GET_WALLET(userInfo.wallet_id));
}

function revertTransaction(
    transaction_id: number
): Promise<AxiosResponse<IGetRevertTransactionResponse>> {
    return Axios.get(URLS.REVERT_TRANSACTION(transaction_id));
}

function postDeposit(
    values: IPostDepositFnInput
): Promise<AxiosResponse<IPostTransactionResponse>> {
    let userData: ILoginAPIResponse | null = fetchUserInfo(true);
    if (!userData) return rejectPromise();
    let postData: IPostTransactionRequest = {
        amount: Number(values.deposit),
        comments: values.comments,
        type: ETransactionType.DEPOSIT,
        wallet_id: userData.wallet_id,
        created: new Date().getTime(),
        created_by: userData.user_id,
        deposited_by: userData.user_id,
        created_by_name: userData.user_name
    };
    return Axios.post(URLS.POST_TRANSACTION, postData);
}

function fetchTransaction(): Promise<AxiosResponse<IGetTransactionResponse[]>> {
    let userData: ILoginAPIResponse | null = fetchUserInfo();
    if (!userData) return rejectPromise();
    return Axios.get(`${URLS.GET_TRANSACTION}?wallet_id=${userData.wallet_id}`);
}

export {
    fetchUserInfo,
    postExpense,
    fetchWallet,
    postDeposit,
    fetchTransaction,
    revertTransaction,
};
