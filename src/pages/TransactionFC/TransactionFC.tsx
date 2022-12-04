import { DeleteTwoTone, EuroTwoTone, FireTwoTone } from "@ant-design/icons";
import { Col, Collapse, Input, Popconfirm, Row, Table, Tag } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { ColumnsType, TablePaginationConfig, TableProps } from "antd/lib/table";
import {
  ExpandableConfig
} from "antd/lib/table/interface";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import CustomDatePickerComponent from "../../components/CustomDatePickerComponent";
import TransactionLineChart from "../../components/TransactionLineChart";
import { ETransactionType, EUserRole } from "../../types/enums/generic";
import {
  IGetTransactionResponse,
  ILoginAPIResponse
} from "../../types/interfaces/api-response";
import * as Constants from "../../utils/constants";
import {
  fetchUserInfo,
  revertTransaction
} from "../../utils/function";
import { transformToChart } from "../../utils/generic-util";
import { IState } from "./interfaces";
import { useFetchTransaction } from "./useFetchTransaction";
import { useSearchQuery } from "./useSearchQuery";
import { calculateTotalAmount, fetchAmount } from "./utils";
const { Search } = Input;

export interface IProps extends RouteComponentProps {}

const pagination: false | TablePaginationConfig = { position: ["bottomRight"] };

const TransactionFC: React.FC<IProps> = () => {
    const [searchQuery, setsearchQuery] = useState("");
    
    const [state, setState] = useState<IState>({
        currentTableViewTotalAmt: 0,
        windowWidth: Number.MAX_VALUE,
        dateFilterDropdownVisible: false,
        currentViewTableData: [], // will be set on change of table content as TableData will not get updated based on table filters
        tableData: [], // what is sent to the table. For search: since it's outside, we need to pass the filtered data to the table
        masterTableData: [], // this is set only when api results are returned & then it is used only for reference to text global search 
        tableProps: {
          loading: true,
          // ellipsis: true, //(make true for lesser width, else false)
          // yScroll: true, // make false lesser width, else true
          pagination,
          size: "middle",
          hasData: true,
          bottom: "bottomRight",
        },
    });

    const expandable: ExpandableConfig<IGetTransactionResponse> = useMemo(() => ({
      expandedRowRender: (record) => (
          <p>
          {state.windowWidth <= 480 && (
            <>
              <div>{renderRecordType(record.type)} created by <b>{record.created_by_name}</b></div>
            </>
          )}
          {record.comments && record.comments !== "undefined"
              ? <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'keep-all'}}>{record.comments}</pre>
              : "No Comments Provided"}

              
          </p>
      ),
    }), [state.windowWidth]);

    /**
     * Setting Footer of table props
     */
    useEffect(() => {
      setState((prevData) => ({...prevData, tableProps: {...prevData.tableProps, expandable, footer: () => (
        <h4>Total amt is: {state.currentTableViewTotalAmt}</h4>
      )}}))
    }, [expandable, state.currentTableViewTotalAmt]);

    /**
     * Search Query
     */
    useSearchQuery(searchQuery, state, setState);
    const onChangeInputSearch = (value: string) => {
        setsearchQuery(value)
    }

    /**
     * Utilities: onChange
     */
    const onChange: TableProps<IGetTransactionResponse>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
    ) => {
    let sourceArr: IGetTransactionResponse[] = extra.currentDataSource || [];
    setState((prevData) => ({ ...prevData, currentViewTableData: sourceArr, currentTableViewTotalAmt: calculateTotalAmount(sourceArr) }));
    
    };

   
    /**
     * UseEffect: Resize
     */
    useEffect(() => {
        const onResize = (): void => {
            setState((prevData) => ({ ...prevData, windowWidth: 0 }));
            let windowWidth: number =
              typeof window !== "undefined" ? window.innerWidth : Number.MAX_VALUE;
            setState((prevData) => ({ ...prevData, windowWidth }));
        };

        onResize();
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    
    /**
     * Fetch Transaction on Init
     */
    const fetchTransactionFn = useFetchTransaction(setState);

    /**
     * Rendering Constants
     */
    let userLoginData: null | ILoginAPIResponse = fetchUserInfo();
    if (!userLoginData) {
      return <div></div>;
    }

    const renderRecordType = (type: string) => {
      let viewText = <div />;
      if (type === "W")
        viewText = (
          <FireTwoTone style={{ fontSize: 25 }} twoToneColor="red" />
        );
      if (type === "D")
        viewText = (
          <EuroTwoTone style={{ fontSize: 25 }} twoToneColor="#52c41a" />
        );
      return viewText;
    }
    const columns: ColumnsType<IGetTransactionResponse> = [
      {
        title: "Type",
        dataIndex: "type",
        responsive: ["sm"],
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
          return renderRecordType(text);
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
        filterDropdownVisible: state.dateFilterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) =>
          setState((prevData) => ({ ...prevData, dateFilterDropdownVisible: visible })),
      },
      {
        title: "Owner",
        dataIndex: "created_by_name",
        responsive: ["sm"],
        render: (text, record, index) => {
          return <div>{text}</div>;
        },
        sorter: (a, b) => a.created_by_name.localeCompare(b.created_by_name),
      },
      {
        title: "Category",
        dataIndex: "category",
        filterMode: "tree",
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
        sorter: (a, b) => fetchAmount(a) - fetchAmount(b),
      },
      {
        title: "",
        key: "action",
        responsive:["sm"],
        render: (text, record) => (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              revertTransaction(record.transaction_id)
                .then((res) => fetchTransactionFn())
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

    const { yScroll, ...tableProps } = state.tableProps;
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
          <>
            <Collapse bordered={false} defaultActiveKey={["1"]}>
              <CollapsePanel header="Table" key="1">
                <div onMouseDown={(e) => e.preventDefault()}>
                  <Table
                    {...state.tableProps}
                    pagination={{
                      position: [state.tableProps.bottom],
                      pageSize: 10,
                    }}
                    columns={tableColumns}
                    dataSource={tableProps.hasData ? state.tableData : []}
                    scroll={scroll}
                    onChange={onChange}
                    title={() => 
                    <Row>
                      <Col xl={{span: 6, offset: 18}} md={{span: 12, offset: 12}} xs={{span: 24}}>
                      <Search
                          placeholder="Search"
                          allowClear
                          enterButton="Search"
                          size="middle"
                          onSearch={onChangeInputSearch}
                        />
                      </Col>
                    </Row>}
                  />
                </div>
              </CollapsePanel>
              <CollapsePanel header="Line Chart" key="2">
                <TransactionLineChart
                  data={transformToChart(state.currentViewTableData)}
                />
              </CollapsePanel>
            </Collapse>
          </>
      </div>
    );

    // return (
    //     <div>
    //       {state.windowWidth <= 480 ? (
    //         <Empty
    //           image={
    //             "https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    //           }
    //           imageStyle={{
    //             height: 60,
    //           }}
    //           description={<span>Potrait Screen is not supportted</span>}
    //         >
    //           <Button type="primary">Rotate Now</Button>
    //         </Empty>
    //       ) : (
    //         <>
    //           <Collapse bordered={false} defaultActiveKey={["1"]}>
    //             <CollapsePanel header="Table" key="1">
    //               <div onMouseDown={(e) => e.preventDefault()}>
    //                 <Table
    //                   {...state.tableProps}
    //                   pagination={{
    //                     position: [state.tableProps.bottom],
    //                     pageSize: 10,
    //                   }}
    //                   columns={tableColumns}
    //                   dataSource={tableProps.hasData ? state.tableData : []}
    //                   scroll={scroll}
    //                   onChange={onChange}
    //                   title={() => 
    //                   <Row>
    //                     <Col xl={{span: 6, offset: 18}} md={{span: 12, offset: 12}}>
    //                     <Search
    //                         placeholder="Search"
    //                         allowClear
    //                         enterButton="Search"
    //                         size="middle"
    //                         onSearch={onChangeInputSearch}
    //                       />
    //                     </Col>
    //                   </Row>}
    //                 />
    //               </div>
    //             </CollapsePanel>
    //             <CollapsePanel header="Line Chart" key="2">
    //               <TransactionLineChart
    //                 data={transformToChart(state.currentViewTableData)}
    //               />
    //             </CollapsePanel>
    //           </Collapse>
    //         </>
    //       )}
    //     </div>
    //   );
}

export default TransactionFC;