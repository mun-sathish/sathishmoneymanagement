interface ICategories {
    name: string;
    color: string;
}

interface IAmount {
    name: string;
    color: string;
}

interface IPostExpenseFnInput {
    category: string;
    expense: number;
    comments: string;
}

interface IPostDepositFnInput {
    deposit: number;
    comments: string;
}

export type { ICategories, IAmount, IPostExpenseFnInput, IPostDepositFnInput };
