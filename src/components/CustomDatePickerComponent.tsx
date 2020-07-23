import React, { ReactText } from "react";
import { DatePicker } from "antd";

interface IProps {
    setSelectedKeys(data: Array<ReactText>): void;
    clearFilters: (() => void) | undefined;
    confirm(): void;
}

interface IState {}

export default class CustomDatePickerComponent extends React.Component<
    IProps,
    IState
> {
    render() {
        const { setSelectedKeys, clearFilters, confirm } = this.props;
        return (
            <DatePicker.RangePicker
                inputReadOnly={true}
                onChange={(date) => {
                    if (date && date[0] && date[1]) {
                        let startDayMoment: moment.Moment = date[0].startOf(
                            "day"
                        );
                        let endDayMoment: moment.Moment = date[1].endOf("day");
                        setSelectedKeys([
                            // @ts-ignore
                            { startDayMoment, endDayMoment },
                        ]);
                        confirm();
                    } else {
                        setSelectedKeys([
                            // @ts-ignore
                            {
                                startDayMoment: null,
                                endDayMoment: null,
                            },
                        ]);
                        clearFilters && clearFilters();
                    }
                }}
            />
        );
    }
}

// interface ICustomDatePickerProps {
//     elementType: ECustomDatePicker;
//     setSelectedKeys(data: Array<ReactText>): void;
//     clearFilters: (() => void) | undefined;
//     confirm(): void;
// }

// const CustomDatePicker: React.FC<ICustomDatePickerProps> = ({
//     elementType,
//     setSelectedKeys,
//     clearFilters,
//     confirm,
// }) => {
//     // const [rangePickerValue, setRangePickerValue] = useState(undefined);

//     switch (elementType) {
//         case ECustomDatePicker.PICKER:
//             return (
//                 <DatePicker.RangePicker
//                     inputReadOnly={true}
//                     onChange={(date) => {
//                         if (date && date[0] && date[1]) {
//                             let startDayMoment: moment.Moment = date[0].startOf(
//                                 "day"
//                             );
//                             let endDayMoment: moment.Moment = date[1].endOf(
//                                 "day"
//                             );
//                             setSelectedKeys([
//                                 // @ts-ignore
//                                 {
//                                     startDayMoment,
//                                     endDayMoment,
//                                 },
//                             ]);
//                             confirm();
//                         } else {
//                             setSelectedKeys([
//                                 // @ts-ignore
//                                 {
//                                     startDayMoment: null,
//                                     endDayMoment: null,
//                                 },
//                             ]);
//                             clearFilters && clearFilters();
//                         }
//                     }}
//                 />
//             );

//         default:
//             return <div>{elementType}</div>;
//     }
// };
