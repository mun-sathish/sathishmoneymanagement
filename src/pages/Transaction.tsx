import { DeleteTwoTone, EuroTwoTone, FireTwoTone } from "@ant-design/icons";
import { Button, Collapse, Empty, Popconfirm, Table, Tag } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import {
  ExpandableConfig,
  Key,
  SorterResult,
  TableCurrentDataSource,
} from "antd/lib/table/interface";
import { AxiosResponse } from "axios";
import moment from "moment";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import CustomDatePickerComponent from "../components/CustomDatePickerComponent";
import TransactionLineChart from "../components/TransactionLineChart";
import { ETransactionType, EUserRole } from "../types/enums/generic";
import {
  IGetTransactionResponse,
  ILoginAPIResponse,
} from "../types/interfaces/api-response";
import * as Constants from "../utils/constants";
import {
  fetchTransaction,
  fetchUserInfo,
  revertTransaction,
} from "../utils/function";
import { transformToChart } from "../utils/generic-util";

interface IProps extends RouteComponentProps {}

type IDataSet = {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
};



interface IState {
  currentTableViewTotalAmt: number;
  dateFilterDropdownVisible: boolean;
  windowWidth: number;
  currentViewTableData: Array<IGetTransactionResponse>;
  tableData: Array<IGetTransactionResponse>;
  tableProps: {
    footer(): JSX.Element;
    loading: boolean;
    ellipsis?: boolean;
    yScroll?: boolean;
    pagination: false | TablePaginationConfig;
    size: SizeType;
    expandable: ExpandableConfig<IGetTransactionResponse>;
    hasData: boolean;
    bottom: "bottomRight";
  };
}

const expandable: ExpandableConfig<IGetTransactionResponse> = {
  expandedRowRender: (record) => (
    <p>
      {record.comments && record.comments !== "undefined"
        ? <pre>{record.comments}</pre>
        : "No Comments Provided"}
    </p>
  ),
};
const pagination: false | TablePaginationConfig = { position: ["bottomRight"] };

export default class Transaction extends React.Component<IProps, IState> {
  state: IState = {
    currentTableViewTotalAmt: 0,
    windowWidth: Number.MAX_VALUE,
    dateFilterDropdownVisible: false,
    currentViewTableData: [],
    tableData: [],
    tableProps: {
      footer: () => (
        <h4>Total amt is: {this.state.currentTableViewTotalAmt}</h4>
      ),
      loading: true,
      // ellipsis: true, //(make true for lesser width, else false)
      // yScroll: true, // make false lesser width, else true
      pagination,
      size: "middle",
      expandable,
      hasData: true,
      bottom: "bottomRight",
    },
  };

  fetchTransaction = (): void => {
    this.setState({
      tableProps: { ...this.state.tableProps, loading: true },
    });
    fetchTransaction()
      .then((response: AxiosResponse<IGetTransactionResponse[]>) => {
        let modifiedData: IGetTransactionResponse[] = response.data.map(
          (item) => ({
            ...item,
            key: item.transaction_id,
          })
        );
        this.setState(
          {
            tableData: modifiedData,
            currentViewTableData: modifiedData,
            tableProps: {
              ...this.state.tableProps,
              loading: false,
            },
          },
          () => this.calculateTotalAmount(this.state.tableData)
        );
      })
      .catch((err) => {
        console.log("err occured while fetching wallet", err);
        this.setState({
          tableProps: { ...this.state.tableProps, loading: false },
        });
      });
  };

  onChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, Key[] | null>,
    sorter:
      | SorterResult<IGetTransactionResponse>
      | SorterResult<IGetTransactionResponse>[],
    extra: TableCurrentDataSource<IGetTransactionResponse>
  ) => {
    let sourceArr: IGetTransactionResponse[] = extra.currentDataSource || [];
    this.setState({ currentViewTableData: sourceArr });
    this.calculateTotalAmount(sourceArr);
  };

  fetchAmount = (sourceArr: IGetTransactionResponse): number =>
    sourceArr.type === ETransactionType.WITHDRAWAL
      ? -sourceArr.amount
      : sourceArr.amount;

  calculateTotalAmount = (sourceArr: Array<IGetTransactionResponse>): void => {
    let totalAmount: number = 0;
    if (sourceArr.length === 1) {
      totalAmount = this.fetchAmount(sourceArr[0]);
    } else if (sourceArr.length > 1) {
      sourceArr.forEach((item) => {
        totalAmount = totalAmount + this.fetchAmount(item);
      });
    }
    this.setState({ currentTableViewTotalAmt: totalAmount });
  };

  onResize = (): void => {
    this.setState({ windowWidth: 0 });
    let windowWidth: number =
      typeof window !== "undefined" ? window.innerWidth : Number.MAX_VALUE;
    this.setState({ windowWidth });
  };

  componentWillMount() {
    this.fetchTransaction();
  }

  componentDidMount() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  render() {
    let userLoginData: null | ILoginAPIResponse = fetchUserInfo();
    if (!userLoginData) {
      return <div></div>;
    }

    const columns: ColumnsType<IGetTransactionResponse> = [
      {
        title: "Type",
        dataIndex: "type",
        filters: [
          {
            text: <FireTwoTone style={{ fontSize: 20 }} twoToneColor="red" />,
            value: "W",
          },
          {
            text: (
              <EuroTwoTone style={{ fontSize: 20 }} twoToneColor="#52c41a" />
            ),
            value: "D",
          },
        ],
        onFilter: (value, record) =>
          record.type.indexOf(value as ETransactionType) === 0,
        render: (text, record, index) => {
          let viewText = <div />;
          if (text === "W")
            viewText = (
              <FireTwoTone style={{ fontSize: 25 }} twoToneColor="red" />
            );
          if (text === "D")
            viewText = (
              <EuroTwoTone style={{ fontSize: 25 }} twoToneColor="#52c41a" />
            );
          return viewText;
        },
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
      {
        title: "Date",
        dataIndex: "created",
        render: (text, record, index) => {
          return <div>{moment(text).format("llll")}</div>;
        },
        sorter: (a, b) =>
          new Date(a.created).getTime() - new Date(b.created).getTime(),
        defaultSortOrder: "descend",
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <CustomDatePickerComponent
            setSelectedKeys={setSelectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
          />
        ),
        onFilter: (value, record) => {
          let startDayMoment: moment.Moment | null =
            // @ts-ignore
            value.startDayMoment;
          // @ts-ignore
          let endDayMoment: moment.Moment | null = value.endDayMoment;
          if (startDayMoment && endDayMoment) {
            return (
              new Date(record.created).getTime() -
                startDayMoment.toDate().getTime() >=
                0 &&
              new Date(record.created).getTime() -
                endDayMoment.toDate().getTime() <=
                0
            );
          } else {
            return true;
          }
        },
        filterDropdownVisible: this.state.dateFilterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) =>
          this.setState({ dateFilterDropdownVisible: visible }),
      },
      {
        title: "Owner",
        dataIndex: "created_by_name",
        render: (text, record, index) => {
          return <div>{text}</div>;
        },
        sorter: (a, b) => a.created_by_name.localeCompare(b.created_by_name),
      },
      {
        title: "Category",
        dataIndex: "category",
        filters: Constants.CATEGORIES.map((item) => ({
          text: item.name,
          value: item.name,
        })),
        onFilter: (value, record) =>
          record.category?.indexOf((value || "") as string) === 0,
        sorter: (a, b) => a.category.localeCompare(b.category),
        render: (text, record, index) => {
          let category = Constants.CATEGORIES.filter((i) => i.name === text)[0];
          return category ? (
            <Tag color={category.color}>{category.name}</Tag>
          ) : (
            <Tag color="default" >{text}</Tag>
          );
        },
      },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (text, record, index) => {
          return (
            <div>
              <h3
                style={{
                  color:
                    record.type === ETransactionType.WITHDRAWAL
                      ? "#b71c1c"
                      : "#66bb6a",
                }}
              >
                {record.type === ETransactionType.WITHDRAWAL ? "" : "+"} &#8377;
                {text}/-
              </h3>
              <span style={{ color: "#90a4ae", fontSize: 10 }}>
                Closing Balance: &#8377;{record.closing_balance}
              </span>
            </div>
          );
        },
        sorter: (a, b) => this.fetchAmount(a) - this.fetchAmount(b),
      },
      {
        title: "",
        key: "action",
        render: (text, record) => (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              revertTransaction(record.transaction_id)
                .then((res) => this.fetchTransaction())
                .catch((err) =>
                  console.log(
                    "err While reverting transaction: " + record.transaction_id,
                    err
                  )
                );
            }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <DeleteTwoTone />
          </Popconfirm>
        ),
      },
    ];

    if (userLoginData.role !== EUserRole.ADMIN) columns.pop(); // removing last action column for non admin user

    const { yScroll, ...tableProps } = this.state.tableProps;
    const scroll: { x?: number; y?: number } = {};
    if (yScroll) {
      scroll.y = 240;
    }

    const tableColumns: ColumnsType<IGetTransactionResponse> = columns.map(
      (item) => ({
        ...item,
        ellipsis: tableProps.ellipsis,
      })
    );

    return (
      <div>
        {this.state.windowWidth <= 480 ? (
          <Empty
            image={
              "https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            }
            imageStyle={{
              height: 60,
            }}
            description={<span>Potrait Screen is not supportted</span>}
          >
            <Button type="primary">Rotate Now</Button>
          </Empty>
        ) : (
          <>
            <Collapse bordered={false} defaultActiveKey={["1"]}>
              <CollapsePanel header="Table" key="1">
                <div onMouseDown={(e) => e.preventDefault()}>
                  <Table
                    {...this.state.tableProps}
                    pagination={{
                      position: [this.state.tableProps.bottom],
                      pageSize: 10,
                    }}
                    columns={tableColumns}
                    dataSource={tableProps.hasData ? this.state.tableData : []}
                    scroll={scroll}
                    // onChange={this.onChange}
                  />
                </div>
              </CollapsePanel>
              <CollapsePanel header="Line Chart" key="2">
                <TransactionLineChart
                  data={transformToChart(this.state.currentViewTableData)}
                />
              </CollapsePanel>
            </Collapse>
          </>
        )}
      </div>
    );
  }
}
