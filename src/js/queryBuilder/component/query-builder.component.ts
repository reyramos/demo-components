import * as angular from "angular";
import {QUERY_OPERATORS, QUERY_CONDITIONS} from "../constants/query.conditions";
import {QUERY_INTERFACE} from "../constants/query.interface";

/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;


class QueryBuilderCtrl implements ng.IComponentController {


    static $inject: Array<string> = ['$element']

    private onDelete: any;
    private onUpdate: any;
    private _queryString: string;
    private _group: any;
    private _operators = QUERY_OPERATORS.map(function (o) {
        return o.name;
    });


    public maxChips = 1;
    public multi = false;

    public operators = QUERY_OPERATORS;
    public conditions: Array<any> = [];
    public group: any;
    public queryString: string;


    private countCondition: number;

    constructor(private $element) {
        let self: any = this;

        Object.keys(QUERY_CONDITIONS).forEach(function (k) {
            self.conditions.push(QUERY_CONDITIONS[k])
        })

    }

    $onInit() {
        if (!this.group)this.group = angular.copy(QUERY_INTERFACE.filters);
        this.onGroupChange();
    }


    $doCheck() {
        if (!angular.equals(this.queryString, this._queryString)) {
            this._queryString = this.queryString;
            // this.split_string(this.queryString);
        }

    };


    /**
     * It will take the query string and split into a simple single layer array to be evalualated
     * later to build the JSON filters based on the parameters
     * @param query
     */
    private split_string(query: string) {
        if (!query)return;


        let words = query.split(/ /g);
        //array element to keep single
        let conditions = ["(", ")"];
        let handler = [];
        let string = "";

        /*
         Build all the single words conditions to keep in single array element
         */
        this.conditions.map(function (c) {
            conditions = conditions.concat(Array.isArray(c.symbol) ? c.symbol : [c.symbol]);
        });

        this.operators.map(function (c) {
            conditions = conditions.concat(Array.isArray(c.name) ? c.name : [c.name]);
        });

        /*
         This loop will handle the conditions
         */
        var i = 0;
        do {
            if (words[i] && conditions.indexOf(words[i]) === -1) {
                string += " " + words[i];
            } else {
                handler.push(string.trim());
                string = "";
                if (words[i])handler.push(words[i]);
            }
            i++;
        } while (i <= words.length);

        //clean empty strings
        handler = handler.filter(function (o) {
            return o !== ""
        });

        this.parseCondition(handler);

    }


    private parseCondition(queryArray: Array<string>) {
        let self: any = this;
        let operators = [];
        /*
         Build the needed operators from the CONST
         */
        this.operators.map(function (c) {
            operators = operators.concat(Array.isArray(c.name) ? c.name : [c.name]);
        });
        let conditions = [];
        /*
         Build a reference value of the QUERY_CONDITION constants
         */
        Object.keys(QUERY_CONDITIONS).forEach(function (k) {
            let symbol = QUERY_CONDITIONS[k].symbol;
            conditions.push({
                symbol: Array.isArray(symbol) ? symbol : [symbol],
                value: QUERY_CONDITIONS[k].value
            })
        });

        let newGroup = () => {
            let filters: any = angular.copy(QUERY_INTERFACE.filters);

            Object.assign(filters, {
                expressions: []
            });

            return filters;

        };

        let newCondition = (exp: Array<string>) => {
            let expressions: any = angular.copy(QUERY_INTERFACE.filters.expressions[0]);
            // (["'`])(?:(?=(\\?))\2.)*?\1
            const regex = /(["'`])(\\?.)*?\1/g; //remove any 'wrapping' ticks from the string
            let value = regex.exec(exp[2]);
            let desc = regex.exec(exp[0]);

            Object.assign(expressions, {
                values: [],
                field: {
                    description: desc ? exp[0].substring(1, exp[0].length - 1) : exp[0]
                },
                operator: conditions.find((o) => {
                    return o.symbol.indexOf(exp[1]) !== -1
                }).value
            });


            expressions.values.push(value ? exp[2].substring(1, exp[2].length - 1) : exp[2]);
            return expressions;
        };

        let group = newGroup();
        let parseIt = (group, arr: Array<string>) => {

            let expressions = [];

            for (let i = 0; i < arr.length; i++) {
                let txt = arr[i];
                if (txt === "$$QueryBuilder")return;
                if (txt === "(") {
                    //defining the start of the group
                    let _group = newGroup();
                    group.expressions.push(_group);
                    //clean empty strings
                    arr = arr.filter(function (o) {
                        return o !== "$$QueryBuilder"
                    });
                    //remove the first
                    arr.splice(0, 1);
                    //array reference
                    let handler = arr;
                    let hL = handler.length; //or 10
                    while (hL--) {
                        if (handler[hL] === ")") {
                            handler = handler.slice(0, hL);
                            arr.splice(0, hL);
                            break;
                        }
                    }
                    expressions = [];
                    parseIt(_group, handler);
                } else if (txt === ")") {
                    //defining the end of the group
                } else if (operators.indexOf(txt) === -1) {
                    //this is a condition
                    expressions.push(txt);
                    if (expressions.length === 3) group.expressions.push(newCondition(expressions));
                } else {
                    group.op = txt;
                    expressions = [];
                }

                //unique identifier
                arr[i] = "$$QueryBuilder";
            }

            return false;

        };

        parseIt(group, queryArray);
        //update on filters
        this.onUpdate({
            $event: {
                group: group,
                string: self.queryString
            }
        });

        this.group = group;
        this.onGroupChange();
    }


    private computed(group: any, op?: string) {
        let self: any = this;

        if (!group) return;
        var str = [];
        angular.forEach(group.expressions, function (o, i) {

            if (o.type === 'condition') {
                var values = o.values[0] ? o.values.join(", ") : "";
                if (!o.field || !o.field.description)return;
                if (i !== 0)str.push(group.op)

                str.push(o.field.description);

                let condition = self.conditions.find(function (q) {
                    return o.operator === q.value;
                }).symbol;

                str.push(Array.isArray(condition) ? condition[0] : condition);
                str.push("`" + values + "`");

            } else {
                var comp = self.computed(o);
                if (comp.length) {
                    if (str.length)str.push(group.op);
                    if (comp.length > 3) {
                        comp.unshift("(");
                        comp.push(")");
                    }
                    str = str.concat(comp);
                }

            }
        });

        return str

    }


    private setOperator(operator: string) {
        let self: any = this;

        switch (operator) {
            case QUERY_CONDITIONS.IN.value:
                self.multi = true;
                self.maxChips = 9999;
                break;
            case QUERY_CONDITIONS.BETWEEN.value:
                self.multi = true;
                self.maxChips = 2;
                break;
            default:
                self.multi = false;
                self.maxChips = 1;
                break;
        }
    }


    onConditionChange(rule: any) {
        this.setOperator(rule.operator);
        this.onGroupChange();
    };


    onGroupChange(e?: any) {
        let self: any = this;

        let conditions = [];
        let values = [];
        this.group.expressions.forEach(function (o, i) {
            if (o.type !== 'condition')return;
            conditions.push(o);
            let hasValue: boolean = o.values ? o.values[0] : false;
            let hasOperand: boolean = o.field ? o.field.name : false;
            if (hasValue && hasOperand)values.push(i)
        });

        if (conditions.length > 0 && values.length === conditions.length) {
            this.AddCondition(values[values.length - 1] + 1);
        } else if (conditions.length == 0) {
            this.AddCondition(0);
        }

        //update on filters
        this.onUpdate({
            $event: {
                group: self.group
            }
        });

        //update on string/ after we have received the description from fields
        let string: Array<string> = this.computed(this.group);
        this.queryString = string.join(' ');

         this.onUpdate({
                $event: {
                    string: self.queryString,
                }
            });

    }

    AddCondition(idx?: number) {
        let self: any = this;

        var condition = angular.copy(QUERY_INTERFACE.filters.expressions[0], {
            $$indeed: self.countCondition,
            values: []
        });

        if (idx > -1) {
            self.group.expressions.splice(idx, 0, condition);
        } else {
            self.group.expressions.push(condition);
        }

    }

    AddGroup() {
        this.group.expressions.push(angular.copy(QUERY_INTERFACE.filters));
    }

    RemoveGroup() {
        let self: any = this;
        this.onDelete({
            $event: {
                group: self.group
            }
        })
    }

    RemoveCondition(idx: number) {
        let self: any = this;
        this.countCondition = 0;
        this.group.expressions.map(function (o) {
            if (o.type === 'condition')self.countCondition++;
        });
        if (self.countCondition === 1)return;
        self.group.expressions.splice(idx, 1);
        this.onGroupChange();
    }


    /**
     * OUTPUT
     */
    onDeleteGroup(e: any) {
        let self: any = this;
        let gCopy = this.group.expressions.slice(0);
        gCopy.forEach(function (o, i) {
            if (o.$$hashKey === e.group.$$hashKey && o.$$indeed === e.group.$$indeed)
                self.group.expressions.splice(i, 1)
        });

        this.onGroupChange();
    }

    onUpdateGroup(e: any) {
        let self: any = this;
        let string: Array<string> = this.computed(this.group);

        this.onUpdate({
            $event: {
                group: self.group,
                string: string.join(' ')
            }
        })
    }
}


require('./query.less');

export class QueryBuilder implements ng.IComponentOptions {
    public bindings: any;
    public template: any;
    public controller: any;


    constructor() {
        this.bindings = {
            onDelete: '&',
            onUpdate: '&',
            queryString: '=',
            $$index: '<',
            group: '=',
            fields: '<'
        };

        this.template = require('./query-builder.component.html');
        this.controller = QueryBuilderCtrl;
    }
}
