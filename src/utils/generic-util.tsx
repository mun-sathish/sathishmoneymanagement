import { IGetTransactionResponse } from "../types/interfaces/api-response";
import {
  ILineChart,
  ILineChartDataSet,
} from "../types/interfaces/chart-interface";
import moment from "moment";
import * as Constants from "./constants";

export const mergeArrayWithObject = <T extends Record<string, unknown>>(
  arr: T[],
  obj: T,
  objKey: string
) => arr && arr.map((t) => (t[objKey] === obj[objKey] ? obj : t));

export const transformToChart = (
  data: IGetTransactionResponse[]
): ILineChart => {
  /** TimeStamp */
  let labels: string[] = [];

  /** label: categories, data: amount */
  let datasets: ILineChartDataSet[] = [];

  data.sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  );

  type ICustomDataCategory = {
    month: string;
    amount: number;
  };

  type ICustomData = {
    // key: data.category
    [name: string]: ICustomDataCategory[];
  };

  let customData: ICustomData = {};

  data.forEach((item) => {
    const createdMonth = moment(item.created).format("MMMM YYYY");

    if (customData[item.category]) {
      let existingCustomDataCategory: ICustomDataCategory[] =
        customData[item.category];

      let existingMonth = existingCustomDataCategory.filter(
        (existingCustomDataCategoryItem) =>
          existingCustomDataCategoryItem.month === createdMonth
      )[0];

      let data: ICustomDataCategory;
      if (existingMonth) {
        existingMonth.amount = existingMonth.amount + item.amount;
        customData[item.category] = mergeArrayWithObject<ICustomDataCategory>(
          customData[item.category],
          existingMonth,
          "month"
        );
      } else {
        data = {
          month: createdMonth,
          amount: item.amount,
        };
        customData[item.category].push(data);
      }
    } else {
      customData[item.category] = [];
      let data: ICustomDataCategory = {
        month: createdMonth,
        amount: item.amount,
      };
      customData[item.category].push(data);
    }
  });

  Object.keys(customData).forEach((item) => {
    customData[item].forEach((customItem) => {
      if (labels.indexOf(customItem.month) < 0) {
        labels.push(customItem.month);
      }
    });
  });

  Object.keys(customData).forEach((item) => {
    let datasetArrayData: number[] = [];
    customData[item].forEach((customItem) => {
      datasetArrayData[labels.indexOf(customItem.month)] = customItem.amount;
    });

    let categoryInstance = Constants.CATEGORIES.filter(
      (categoryItem) => categoryItem.name === item
    )[0];
    let dataset: ILineChartDataSet = {
      label: item ? item : "DEPOSIT",
      data: datasetArrayData,
      fill: false,
      borderColor: categoryInstance
        ? categoryInstance.color
        : Constants.mdColors[Constants.generateRandomNumber()],
    };
    datasets.push(dataset);
  });

  console.log("labels", JSON.stringify(labels));
  console.log("datasets", JSON.stringify(datasets));

  return {
    labels,
    datasets,
  };
};
