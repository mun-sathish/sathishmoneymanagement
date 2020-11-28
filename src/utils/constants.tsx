import { ICategories, IAmount } from "../types/interfaces/generic";

export const mdColors = [
  "#F44336",
  "#E57373",
  "#EF5350",
  "#F44336",
  "#E53935",
  "#D32F2F",
  "#C62828",
  "#B71C1C",
  "#FF8A80",
  "#FF5252",
  "#FF1744",
  "#D50000",
  "#E91E63",
  "#F06292",
  "#EC407A",
  "#E91E63",
  "#D81B60",
  "#C2185B",
  "#AD1457",
  "#880E4F",
  "#FF4081",
  "#F50057",
  "#C51162",
  "#9C27B0",
  "#AB47BC",
  "#9C27B0",
  "#8E24AA",
  "#7B1FA2",
  "#6A1B9A",
  "#4A148C",
  "#E040FB",
  "#D500F9",
  "#AA00FF",
  "#673AB7",
  "#9575CD",
  "#7E57C2",
  "#673AB7",
  "#5E35B1",
  "#512DA8",
  "#4527A0",
  "#311B92",
  "#651FFF",
  "#6200EA",
  "#3F51B5",
  "#5C6BC0",
  "#3F51B5",
  "#3949AB",
  "#303F9F",
  "#283593",
  "#1A237E",
  "#304FFE",
  "#2196F3",
  "#64B5F6",
  "#42A5F5",
  "#2196F3",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
  "#0D47A1",
  "#448AFF",
  "#2979FF",
  "#2962FF",
  "#03A9F4",
  "#0288D1",
  "#0277BD",
  "#01579B",
  "#40C4FF",
  "#00B0FF",
  "#0091EA",
  "#00BCD4",
  "#00ACC1",
  "#0097A7",
  "#00838F",
  "#006064",
  "#80CBC4",
  "#4DB6AC",
  "#26A69A",
  "#009688",
  "#00897B",
  "#00796B",
  "#00695C",
  "#004D40",
  "#00BFA5",
  "#4CAF50",
  "#81C784",
  "#66BB6A",
  "#4CAF50",
  "#43A047",
  "#388E3C",
  "#2E7D32",
  "#1B5E20",
  "#00C853",
  "#8BC34A",
  "#7CB342",
  "#689F38",
  "#558B2F",
  "#33691E",
  "#D4E157",
  "#CDDC39",
  "#C0CA33",
  "#AFB42B",
  "#9E9D24",
  "#827717",
  "#F9A825",
  "#F57F17",
  "#FF6F00",
  "#FFE57F",
  "#FFD740",
  "#FFC400",
  "#FFAB00",
  "#FF9800",
  "#FF9800",
  "#FB8C00",
  "#F57C00",
  "#EF6C00",
  "#E65100",
  "#FFD180",
  "#FFAB40",
  "#FF9100",
  "#FF6D00",
  "#FF5722",
  "#FF7043",
  "#FF5722",
  "#F4511E",
  "#E64A19",
  "#D84315",
  "#BF360C",
  "#FF9E80",
  "#FF6E40",
  "#FF3D00",
  "#DD2C00",
  "#795548",
  "#795548",
  "#6D4C41",
  "#5D4037",
  "#4E342E",
  "#3E2723",
  "#37474F",
  "#263238",
];

export const generateRandomNumber = (min: number = 0, max: number = 122) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const CATEGORIES: ICategories[] = [
  { name: "DAILY", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "VEGETABLES", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "NON-VEG", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "FRUITS", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "PROVISION", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "MEDICINE", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "SNACKS", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "AMWAY", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "MOBILE-RECHARGE", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "INTERNET", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "RESTAURANT", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "ELECTRONIC", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "PETROL", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "TRAVEL", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "GAS", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "D-MART", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "CLOTHES", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "PROFESSIONAL", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "MISCELLANEOUS", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "SHORTAGE", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "HOUSE-SHIFTING", color: mdColors[generateRandomNumber(0, 122)] },
];

const AMOUNT: IAmount[] = [
  { name: "10", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "20", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "50", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "100", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "200", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "500", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "-20", color: mdColors[generateRandomNumber(0, 122)] },
  { name: "-50", color: mdColors[generateRandomNumber(0, 122)] },
];

const BASE_URI = "https://spendable-length.000webhostapp.com";
const URLS = {
  LOGIN: BASE_URI + "/login.php",
  GET_WALLET: BASE_URI + "/getWallet.php",
  POST_TRANSACTION: BASE_URI + "/postTransaction.php",
  GET_TRANSACTION: BASE_URI + "/getTransaction.php",
  REVERT_TRANSACTION: BASE_URI + "/revertTransaction.php",
};

enum LOCATION {
  LOGIN = "/login",
  EXPENSE = "/",
  DEPOSIT = "/deposit",
  TRANSACTION = "/transaction",
}

export { CATEGORIES, AMOUNT, URLS, LOCATION };
