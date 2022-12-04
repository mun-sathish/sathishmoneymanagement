import { AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import { IGetTransactionResponse } from "../../types/interfaces/api-response";
import { fetchTransaction } from "../../utils/function";
import { IState } from "./interfaces";
import { calculateTotalAmount } from "./utils";

export const useFetchTransaction = (setState: React.Dispatch<React.SetStateAction<IState>>) => {

    const fetchTransactionFn = useCallback((): void => {
        setState((prevData) => ({
            ...prevData,
            tableProps: { ...prevData.tableProps, loading: true },
          }));
        fetchTransaction()
          .then((response: AxiosResponse<IGetTransactionResponse[]>) => {
            let modifiedData: IGetTransactionResponse[] = response.data.map(
              (item) => ({
                ...item,
                key: item.transaction_id,
              })
            );
            setState((prevData) => ({
                ...prevData,
                tableData: modifiedData,
                currentViewTableData: modifiedData,
                masterTableData: modifiedData,
                currentTableViewTotalAmt: calculateTotalAmount(modifiedData),
                tableProps: {
                  ...prevData.tableProps,
                  loading: false,
                },
              })
            );
            
          })
          .catch((err: unknown) => {
            console.log("err occured while fetching wallet", err);
            setState((prevData) => ({
                ...prevData,
                tableProps: { ...prevData.tableProps, loading: false },
              }));
          });
      }, [setState]);


      useEffect(() => {
        fetchTransactionFn();
    }, [fetchTransactionFn]);

    return fetchTransactionFn;
}