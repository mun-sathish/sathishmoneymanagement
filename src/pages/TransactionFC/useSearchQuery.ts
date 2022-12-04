import { IState } from "./interfaces";
import debounce from 'lodash.debounce';
import { useEffect } from "react";
import { IGetTransactionResponse } from "../../types/interfaces/api-response";
import { calculateTotalAmount } from "./utils";

type ICBProps = (res: IGetTransactionResponse[]) => void;

const fetchData = async (query: string, state: IState, cb: ICBProps) => {
    const newState = state.masterTableData.filter(item => {
        return item.comments.toLowerCase().includes(query.toLowerCase())
    })
    cb(newState);
};

const debouncedFetchData = debounce((query: string, state: IState, cb: ICBProps) => {
    fetchData(query, state, cb);
}, 500);

let prevQuery = "@&*%^!"
export const useSearchQuery = (inputQuery: string, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
    useEffect(() => {
        if(inputQuery === prevQuery || state.tableProps.loading) return;
        prevQuery = inputQuery;
        debouncedFetchData(inputQuery, state, res => {
            setState((prevData) => ({...prevData, tableData: res, currentViewTableData: res,currentTableViewTotalAmt: calculateTotalAmount(res)}))
        });
    }, [inputQuery, setState, state]);

}
