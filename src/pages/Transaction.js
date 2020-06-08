import React from "react";
import { Table, DatePicker, Tag, Popconfirm, Empty, Button } from 'antd';
import * as Constants from '../utils/constants';
import { FireTwoTone, EuroTwoTone, DeleteTwoTone } from "@ant-design/icons";
import moment from 'moment';
import { fetchTransaction, revertTransaction, fetchUserInfo } from "../utils/function";

const { RangePicker } = DatePicker;

// let data = [
//     {
//         transactionId: 12321,
//         created: 1590848457000,
//         category: "PROVISION",
//         comments: "This is kept for milk and choclate",
//         type: "W",
//         closingBalance: 200,
//         amount: 100,
//         createdBy: {
//             id: 12312,
//             name: "Sathish"
//         }
//     },
//     {
//         transactionId: 127683,
//         created: 1590720618000,
//         category: "TEST",
//         closingBalance: 1000,
//         comments: "This is added from Sathish account",
//         type: "W",
//         amount: 1000,
//         createdBy: {
//             id: 12312,
//             name: "Sathish"
//         }
//     },
//     {
//         transactionId: 1123623,
//         created: 1590762078000,
//         category: "INTERNET",
//         closingBalance: 1000,
//         comments: "This is added from Sathish account",
//         type: "D",
//         amount: 1000,
//         createdBy: {
//             id: 12312,
//             name: "Sathish"
//         }
//     },
//     {
//         transactionId: 12433,
//         created: 1590762057000,
//         category: "INTERNET",
//         closingBalance: 1000,
//         comments: "This is added from Sathish account",
//         type: "W",
//         amount: 20,
//         createdBy: {
//             id: 12312,
//             name: "Sathish"
//         }
//     },
//     {
//         transactionId: 11223,
//         created: 1590762057000,
//         category: "INTERNET",
//         closingBalance: 5000,
//         comments: "This is added from Sathish account",
//         type: "D",
//         amount: 2000,
//         createdBy: {
//             id: 12312,
//             name: "Sugnathi V"
//         }
//     }
// ];

// data = data.map(item => ({ ...item, key: item.transactionId }));

const expandable = { expandedRowRender: record => <p>{record.comments && record.comments !== "undefined" ? record.comments : "No Comments Provided"}</p> };
const pagination = { position: 'bottom' };

export default class Transaction extends React.Component {

    state = {
        currentTableViewTotalAmt: 0,
        dateFilterDropdownVisible: false,
        tableData: [],
        tableProps: {
            footer: () => <h4>Total amt is: {this.state.currentTableViewTotalAmt}</h4>,
            loading: true,
            // ellipsis: true, //(make true for lesser width, else false)
            // yScroll: true, // make false lesser width, else true 
            pagination,
            size: 'default',
            expandable,
            hasData: true,
            bottom: 'bottomRight',
        }
    };


    fetchTransaction = () => {
        this.setState({ tableProps: { ...this.state.tableProps, loading: true } })
        fetchTransaction().then(response => {
            let modifiedData = response.data.map(item => ({ ...item, key: item.transaction_id }));
            this.setState({ tableData: modifiedData, tableProps: { ...this.state.tableProps, loading: false } }, () => this.calculateTotalAmount(this.state.tableData));
        }).catch(err => {
            console.log("err occured while fetching wallet", err);
            this.setState({ tableProps: { ...this.state.tableProps, loading: false } })
        })
    }

    onChange = (pagination, filters, sorter, extra) => {
        let sourceArr = extra.currentDataSource || [];
        this.calculateTotalAmount(sourceArr)
    }

    fetchAmount = (sourceArr) => sourceArr.type === "W" ? -sourceArr.amount : sourceArr.amount;

    calculateTotalAmount = (sourceArr) => {
        let totalAmount = 0;
        if (sourceArr.length === 1) {
            totalAmount = this.fetchAmount(sourceArr[0])
        }
        else if (sourceArr.length > 1) {
            sourceArr.forEach(item => {
                totalAmount = totalAmount + this.fetchAmount(item);
            })
        }
        this.setState({ currentTableViewTotalAmt: totalAmount })
    }

    getWindowWidth = () => {
        return Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
        );
    }

    onResize = () => {
        this.setState({
            width: this.getWindowWidth()
        });
    }

    componentWillMount() {
        this.fetchTransaction();
        this.setState({
            width: this.getWindowWidth()
        });
    }
    componentDidMount() {
        window.addEventListener("resize", this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    render() {
        const columns = [
            {
                title: 'Type',
                dataIndex: 'type',
                filters: [
                    {
                        text: <FireTwoTone style={{ fontSize: 20 }} twoToneColor="red" />,
                        value: "W"
                    },
                    {
                        text: <EuroTwoTone style={{ fontSize: 20 }} twoToneColor="#52c41a" />,
                        value: "D"
                    }
                ],
                onFilter: (value, record) => record.type.indexOf(value) === 0,
                render: (text, record, index) => {
                    let viewText = <div />;
                    if (text === "W") viewText = <FireTwoTone style={{ fontSize: 25 }} twoToneColor="red" />
                    if (text === "D") viewText = <EuroTwoTone style={{ fontSize: 25 }} twoToneColor="#52c41a" />;
                    return viewText;
                },
                sorter: (a, b) => a.type.localeCompare(b.type),
            },
            {
                title: 'Date',
                dataIndex: 'created',
                render: (text, record, index) => {
                    return <div>{moment(text).format('llll')}</div>;
                },
                sorter: (a, b) => new Date(a.created) - new Date(b.created),
                defaultSortOrder: 'descend',
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => <RangePicker onChange={(date) => {
                    if (date) {
                        let startDayMoment = date[0].startOf('day');
                        let endDayMoment = date[1].endOf('day');
                        setSelectedKeys([{ startDayMoment, endDayMoment }])
                        confirm();
                    } else {
                        setSelectedKeys([{ startDayMoment: null, endDayMoment: null }])
                        clearFilters();
                    }
                }} />,
                onFilter: (value, record) => {
                    const { startDayMoment, endDayMoment } = value;
                    if (startDayMoment && endDayMoment) {
                        return new Date(record.created) - startDayMoment.toDate() >= 0 && new Date(record.created) - endDayMoment.toDate() <= 0
                    } else {
                        return true;
                    }

                },
                filterDropdownVisible: this.state.dateFilterDropdownVisible,
                onFilterDropdownVisibleChange: visible => this.setState({ dateFilterDropdownVisible: visible }),
            },
            {
                title: 'Owner',
                dataIndex: 'created_by_name',
                render: (text, record, index) => {
                    return <div>{text}</div>;
                },
                sorter: (a, b) => a.created_by_name.localeCompare(b.created_by_name),
            },
            {
                title: 'Category',
                dataIndex: 'category',
                filters: Constants.CATEGORIES.map(item => ({ text: item.name, value: item.name })),
                onFilter: (value, record) => record.category.indexOf(value) === 0,
                sorter: (a, b) => a.category.localeCompare(b.category),
                render: (text, record, index) => {
                    let category = Constants.CATEGORIES.filter(i => i.name === text)[0];
                    return category ? <Tag color={category.color}>{category.name}</Tag> : <div>{text.name}</div>;
                }
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                render: (text, record, index) => {
                    return (
                        <div>
                            <h3 style={{ color: record.type === "W" ? "#b71c1c" : "#66bb6a" }}>{record.type === "W" ? "" : "+"} &#8377;{text}/-</h3>
                            <span style={{ color: "#90a4ae", fontSize: 10 }}>Closing Balance: &#8377;{record.closing_balance}</span>
                        </div>
                    )
                },
                sorter: (a, b) => this.fetchAmount(a) - this.fetchAmount(b),
            },
            {
                title: '',
                key: 'action',
                render: (text, record) => (
                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={() => {
                            revertTransaction(record.transaction_id).then(res => this.fetchTransaction()).catch(err => console.log("err While reverting transaction: " + record.transaction_id, err));
                        }}
                        onCancel={() => { }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteTwoTone />
                    </Popconfirm>
                ),
            }
        ];

        if (fetchUserInfo().role !== "ADMIN")
            columns.pop(); // removing last action column for non admin user

        const { xScroll, yScroll, ...tableProps } = this.state.tableProps;
        const scroll = {};
        if (yScroll) {
            scroll.y = 240;
        }
        if (xScroll) {
            scroll.x = '100vw';
        }

        const tableColumns = columns.map(item => ({ ...item, ellipsis: tableProps.ellipsis }));
        if (xScroll === 'fixed') {
            tableColumns[0].fixed = true;
            tableColumns[tableColumns.length - 1].fixed = 'right';
        }
        return (

            <div>
                {
                    this.state.width < 480 ?
                        <Empty
                            image={"https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"}
                            imageStyle={{
                                height: 60,
                            }}
                            description={
                                <span>
                                    Potrait Screen is not supportted
                        </span>
                            }
                        >
                            <Button type="primary">Rotate Now</Button>
                        </Empty>
                        :
                        <Table
                            {...this.state.tableProps}
                            pagination={{ position: [this.state.tableProps.bottom], pageSize: 10 }}
                            columns={tableColumns}
                            dataSource={tableProps.hasData ? this.state.tableData : null}
                            scroll={scroll}
                            onChange={this.onChange}
                            onMouseDown={(e) => e.preventDefault()}
                        />
                }

            </div>
        );
    }

}