import { SizeType } from "antd/lib/config-provider/SizeContext";
import { TablePaginationConfig } from "antd/lib/table";
import { ExpandableConfig } from "antd/lib/table/interface";
import { IGetTransactionResponse } from "../../types/interfaces/api-response";

type IDataSet = {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
};


export interface IState {
    currentTableViewTotalAmt: number;
    dateFilterDropdownVisible: boolean;
    windowWidth: number;
    currentViewTableData: Array<IGetTransactionResponse>;
    tableData: Array<IGetTransactionResponse>;
    masterTableData: Array<IGetTransactionResponse>;
    tableProps: {
      footer?: () => JSX.Element;
      loading: boolean;
      ellipsis?: boolean;
      yScroll?: boolean;
      pagination: false | TablePaginationConfig;
      size: SizeType;
      expandable?: ExpandableConfig<IGetTransactionResponse>;
      hasData: boolean;
      bottom: "bottomRight";
    };
  }