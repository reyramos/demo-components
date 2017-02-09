/**
 * Created by ramor11 on 12/8/2016.
 */


export const QUERY_OPERATORS: Array<any> = [{name: 'AND'}, {name: 'OR'}];


export const QUERY_CONDITIONS: any = {
    EQUAL: {
        name: "Equal",
        value: "EQ",
        symbol: ["equal", "=="], //THIS CAN BE AN ARRAY OF POSSIBLE SYMBOLS
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME', 'STRING']
    },
    NOT_EQUAL: {
        name: "Not Equal",
        value: "NE",
        symbol: "not_equal", //THIS CAN BE AN ARRAY OF POSSIBLE SYMBOLS
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME', 'STRING']
    },
    GREATER_THAN: {
        name: "Greater Than",
        value: "GT",
        symbol: "greater_than",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME']
    },
    GREATER_EQUAL: {
        name: "Greater or Equal",
        value: "GE",
        symbol: "greater_or_equal",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME']
    },
    LESS_THAN: {
        name: "Less Than",
        value: "LT",
        symbol: "less_than",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME']
    },
    LESS_EQUAL: {
        name: "Less or Equal",
        value: "LE",
        symbol: "less_or_equal",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME']
    },
    IN: {
        name: "In",
        value: "IN",
        symbol: "in",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME', 'STRING'],
        limit: -1
    },
    BETWEEN: {
        name: "Between",
        value: "BETWEEN",
        symbol: "between",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME'],
        limit: 2
    },
    CONTAINS: {
        name: "Contains",
        value: "CONTAINS",
        symbol: "contains",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME', 'STRING']
    },
    NOT_CONTAINS: {
        name: "Not Contains",
        value: "NOT_CONTAINS",
        symbol: "not_contains",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME', 'STRING']
    },
    STARTS_WITH: {
        name: "Starts With",
        value: "STARTS_WITH",
        symbol: "starts_with",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME', 'STRING']
    },
    ENDS_WITH: {
        name: "Ends With",
        value: "ENDS_WITH",
        symbol: "ends_with",
        allowed: ['INTEGER', 'NUMBER', 'CURRENCY', 'DATETIME', 'STRING']
    }
};

