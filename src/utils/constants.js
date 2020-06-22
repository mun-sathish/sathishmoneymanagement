const CATEGORIES = [
    { name: "DAILY", color: "gold"},
    { name: "VEGETABLES", color: "purple"},
    { name: "NON-VEG", color: "green"},
    { name: "FRUITS", color: "red"},
    { name: "PROVISION", color: "magenta"},
    { name: "MEDICINE", color: "volcano"},
    { name: "SNACKS", color: "geekblue"},
    { name: "AMWAY", color: "volcano"},
    { name: "MOBILE-RECHARGE", color: "green"},
    { name: "INTERNET", color: "red"},
    { name: "RESTAURANT", color: "gold"},
    { name: "ELECTRONIC", color: "volcano"},
    { name: "PETROL", color: "gold"},
    { name: "TRAVEL", color: "pink"},
    { name: "GAS", color: "orange"},
    { name: "D-MART", color: "geekblue"},
    { name: "SHORTAGE", color: "red"},
]

const AMOUNT = [
    { name: "10", color: "magenta"},
    { name: "20", color: "green"},
    { name: "50", color: "red"},
    { name: "100", color: "purple"},
    { name: "200", color: "blue"},
    { name: "500", color: "green"},
    { name: "-20", color: "red"},
    { name: "-50", color: "red"},
]

const BASE_URI = "https://spendable-length.000webhostapp.com";
const URLS = {
    LOGIN: BASE_URI + "/login.php",
    GET_WALLET: BASE_URI + "/getWallet.php",
    POST_TRANSACTION: BASE_URI + "/postTransaction.php",
    GET_TRANSACTION: BASE_URI + "/getTransaction.php",
    REVERT_TRANSACTION: BASE_URI + "/revertTransaction.php",
}

const LOCATION = {
    LOGIN: "/login",
    EXPENSE: "/",
    DEPOSIT: "/deposit",
    TRANSACTION: "/transaction",
}

export { CATEGORIES, AMOUNT, URLS, LOCATION }