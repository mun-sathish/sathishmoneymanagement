import { ETransactionType } from "../../types/enums/generic";
import { IGetTransactionResponse } from "../../types/interfaces/api-response";

 /**
 * Pure Utilities: fetchAmount
 */
export const fetchAmount = (sourceArr: IGetTransactionResponse): number =>
    sourceArr.type === ETransactionType.WITHDRAWAL
    ? -sourceArr.amount
    : sourceArr.amount;

/**
 * Pure Utilities: calculateTotalAmount
 */
 export const calculateTotalAmount = (sourceArr: Array<IGetTransactionResponse>): number => {
    let totalAmount: number = 0;
    if (sourceArr.length === 1) {
      totalAmount = fetchAmount(sourceArr[0]);
    } else if (sourceArr.length > 1) {
      sourceArr.forEach((item) => {
        totalAmount = totalAmount + fetchAmount(item);
      });
    }
    return totalAmount;
}