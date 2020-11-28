export interface ILineChartDataSet {
  label: string;
  data: number[];
  fill: boolean;
  hidden?: boolean;
  borderColor: string;
}

export interface ILineChart {
  labels: string[];
  datasets: ILineChartDataSet[];
}
