import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ILineChart } from "../types/interfaces/chart-interface";

interface ITransactionLineChartProps {
  data: ILineChart;
}

const TransactionLineChart: React.FC<ITransactionLineChartProps> = ({
  data,
}) => {
  const [state, setState] = useState(data);
  const [isDisableAll, setisDisableAllState] = useState(false);

  useEffect(() => {
    setState({
      ...data,
      datasets: data.datasets.map((item) => ({
        ...item,
        hidden: isDisableAll,
      })),
    });
  }, [data, isDisableAll]);

  const options = {
    responsive: true, // Make it responsive
    maintainAspectRatio: false, // Don't maintain w/h ratio
  };

  return (
    <div style={{ height: "100vh" }}>
      <Checkbox
        defaultChecked={isDisableAll}
        onChange={(e) => setisDisableAllState(e.target.checked)}
      >
        Is Disable All
      </Checkbox>
      <Line data={state} options={options} />
    </div>
  );
};

export default TransactionLineChart;
export type { ITransactionLineChartProps };
