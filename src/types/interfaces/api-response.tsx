import { ETransactionType, EUserRole } from "../enums/generic";

interface ILoginAPIResponse {
    user_id: number;
    user_name: string;
    first_name: string;
    last_name: string;
    password: string;
    created: number;
    last_updated: number;
    last_accessed: number;
    is_deleted: number;
    role: EUserRole;
    wallet_id: number;
}

interface IPostTransactionRequest {
    category?: string;
    amount: number;
    comments: string;
    type: ETransactionType;
    wallet_id: number;
    created: number;
    created_by: number;
    deposited_by?: number;
}

interface IPostTransactionResponse {
    success: string;
}

interface IGetWalletResponse {
    wallet_id: number;
    wallet_name: string;
    balance: number;
    created: number;
    last_updated: number;
    is_deleted: number;
}

interface IGetRevertTransactionResponse {
    success: string;
}

interface IGetTransactionResponse {
    key?: number; // Local JSX map purpose
    transaction_id: number;
    wallet_id: number;
    category: string;
    type: ETransactionType;
    comments: string;
    created: number;
    created_by: number;
    deposited_by: number;
    amount: number;
    closing_balance: number;
    is_deleted: number;
    created_by_name: string;
}

export type {
    ILoginAPIResponse,
    IPostTransactionResponse,
    IPostTransactionRequest,
    IGetWalletResponse,
    IGetRevertTransactionResponse,
    IGetTransactionResponse,
};
