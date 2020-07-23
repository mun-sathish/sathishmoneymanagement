enum ETransactionType {
    WITHDRAWAL = "W",
    DEPOSIT = "D",
}

enum EUserRole {
    ADMIN = "ADMIN",
    NORMAL = "NORMAL",
}

enum ECustomDatePicker {
    TODAY = "Today",
    THIS_MONTH = "This Month",
    LAST_MONTH = "Last Month",
    LAST_3_MONTHS = "Last 3 Months",
    THIS_YEAR = "This year",
    PICKER = "PICKER",
}

export { ETransactionType, EUserRole, ECustomDatePicker };
