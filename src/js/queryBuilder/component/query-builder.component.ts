import * as angular from "angular";
import {QUERY_OPERATORS, QUERY_CONDITIONS} from "../constants/query.conditions";
import {QUERY_INTERFACE} from "../constants/query.interface";

/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;
declare let Array: any;
declare let String: any;


String.prototype.replaceAt = function (index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
};

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
};

class QueryBuilderCtrl implements ng.IComponentController {


    static $inject: Array<string> = ['$element', '$scope'];


    public maxChips = 1;
    public multi = false;

    public operators = QUERY_OPERATORS;
    public conditions: Array<any> = [];
    public group: any;
    public queryString: string;
    public fieldValue: string;
    public fieldName: string;


    //output
    private onDelete: any;
    private onUpdate: any;

    //trackers
    private $event: any = "";
    private $queryString: string = "";
    private $outputUpdate: boolean = false;
    private $countCondition: number;
    private $timeoutPromise: any;


    constructor(private $element, private $scope: ng.IScope) {
        let self: any = this;

        Object.keys(QUERY_CONDITIONS).forEach(function (k) {
            self.conditions.push(QUERY_CONDITIONS[k])
        })

    }

    $onInit() {
        if (!this.group) this.group = angular.copy(QUERY_INTERFACE.filters);

        if (!this.fieldValue)
            this.fieldValue = 'value';

        if (!this.fieldName)
            this.fieldName = 'name';

        this.onGroupChange();
    }


    $doCheck() {


        /*
         This will be trigger when the output string is changes from outside source
         other than query builder
         */
        if (!angular.equals(this.queryString, this.$queryString)) {
            let self: any = this;
            this.$queryString = this.queryString;
            clearTimeout(this.$timeoutPromise);

            this.$timeoutPromise = setTimeout(() => {
                self.$outputUpdate = true;
                let obj = self.parseQuery(self.queryString);
                let group = angular.toJson(obj);
                // if ((angular.toJson(self.group)).indexOf(group.slice(0, group.length - 2)) !== 0) {
                self.group = JSON.parse(group);
                self.onGroupChange();
                self.$scope.$digest();
                // }
            }, 500);

        }

    };


    /**
     * It will take the query string and split into a simple single layer array to be evalualated
     * later to build the JSON filters based on the parameters
     * @param query
     */
    private split_string(query: string) {
        if (!query)return;


        let words = (query.trim()).split(/ /g);
        //array element to keep single
        let conditions: any = ["(", ")"];
        let qArr = [];
        let string = "";

        /*
         Build all the single words conditions to keep in single array element
         */
        this.conditions.map(function (c) {
            let defaultCase = Array.isArray(c.symbol) ? c.symbol : [c.symbol];
            let lowerCase = defaultCase.map((o) => {
                return o.toLowerCase();
            });
            conditions = conditions.concat(defaultCase, lowerCase);
        });

        //todo:refactor reusable operators array
        this.operators.map(function (c) {
            let defaultCase = Array.isArray(c.name) ? c.name : [c.name];
            let lowerCase = defaultCase.map((o) => {
                return o.toLowerCase();
            });
            conditions = conditions.concat(defaultCase, lowerCase);
        });

        conditions = conditions.unique();

        // let testWords  = (words)=>{
        /*
         This loop will handle the conditions
         */
        var i = 0;
        let handler = []; //this should reset on push to qArr
        do {
            if (words[i]) {
                if (conditions.indexOf(words[i].toLowerCase()) < 0) {
                    let regex = /^and|AND|or|OR$`/g;
                    let cond = regex.exec(words[i]);
                    /*
                     Testing for condition where the user started typing
                     AND and OR uncomplete and define its group since its a broken word
                     */
                    if (cond) {
                        handler.push(string);
                        handler.push(words[i])
                    } else {
                        string += " " + words[i];
                    }

                } else if (["(", ")"].indexOf(words[i].trim()) !== -1) {
                    handler.push(string);
                    string = "";
                    handler.push(words[i]);
                } else {
                    let regex = /(["'`])(\\?.)*?\1/g;

                    let value = regex.exec(string);
                    if (value) {
                        handler.push(value.input);
                    } else {
                        handler.push(string);
                    }

                    //push the condition being evalualated
                    if (words[i]) handler.push(words[i]);
                    if (handler.length > 3) {
                        qArr = qArr.concat(handler)
                        handler = [];
                    }

                    string = "";
                }
            } else {
                handler.push(string);
            }
            i++;
        } while (i <= words.length);

        //wrapping last array string
        qArr = qArr.concat(handler)
        //clean empty strings
        qArr = qArr.filter(function (o) {
            return o !== ""
        });

        /*
         Split strings with parenthesis
         */
        let _split = () => {
            let cQarr = qArr.slice(0); //lets copy
            qArr.forEach(function (o, i) {
                let regex = /\(|\)/g;
                let m = o.length > 1 ? regex.exec(o) : null;
                if (m) {
                    //push the match
                    qArr.splice(m[0] === "(" ? i : i + 1, 0, m[0]);
                    //remove the match
                    let string = o.replaceAt(m.index, "");
                    //replace the string
                    qArr.splice(m[0] === ")" ? i : i + 1, 1, string);

                }
            });

            if (qArr.length !== cQarr.length) _split();
        };
        _split();
        //clean strings
        qArr = qArr.map(function (o) {
            return o.trim()
        });


        return qArr;

    }


    private parseQuery(queryString: string) {
        let self: any = this;
        //take the string and break into array
        let queryArray: Array<string> = this.split_string(queryString);

        let operators = [];
        /*
         Build the needed operators from the CONST
         */
        this.operators.map(function (c) {
            let defaultCase = Array.isArray(c.name) ? c.name : [c.name];
            let lowerCase = defaultCase.map((o) => {
                return o.toLowerCase();
            });
            operators = operators.concat(lowerCase);
        });

        let conditions = [];
        /*
         Build a reference value of the QUERY_CONDITION constants
         */
        Object.keys(QUERY_CONDITIONS).forEach(function (k) {
            let symbol = QUERY_CONDITIONS[k].symbol;
            conditions.push({
                symbol: Array.isArray(symbol) ? symbol : [symbol],
                value : QUERY_CONDITIONS[k].value
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
            let regex = /(["'`])(\\?.)*?\1/g
            let val = regex.exec(exp[2]);
            let value = val ? exp[2].substring(1, exp[2].length - 1) : exp[2];
            let desc = regex.exec(exp[0]);
            let description = desc ? exp[0].substring(1, exp[0].length - 1) : exp[0];

            Object.assign(expressions, {
                values  : [],
                field   : self.fields.find(function (o) {
                    return description === o[self.fieldName];
                }),
                operator: conditions.find((o) => {
                    return o.symbol.indexOf(exp[1]) !== -1
                }).value
            });

            // expressions.field[self.fieldName] = description;
            expressions.values.push(value);
            //remove any empty strings
            expressions.values = expressions.values.filter(function (o) {
                return o !== "" && o !== "``"
            });


            return expressions;
        };


        let group = newGroup();
        let parseIt = (group, arr: Array<string>) => {

            let expressions = [];
            if (!arr)return;

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

                    let reg = /(\()?(?:[^()]+|\([^)]+\))+(\)?)/;
                    let m = reg.exec(arr.join(" "));
                    if (m) {

                        let balance = (m[0] as any).replaceAt(0, "");
                        balance = balance.replaceAt(balance.length - 1, "");

                        let newStr = ((arr.join(" ")).replace(balance, "")).replace(/\(\)/, "");
                        //since of array reference add unidentified index to keep the same loop in order
                        arr = ["$$QueryBuilder"].concat(this.split_string(newStr.trim()) || []);
                        let handler = this.split_string(balance) || [];
                        handler = handler.filter((o) => {
                            return o.trim();
                        });
                        expressions = [];
                        parseIt(_group, handler);
                    }

                } else if (txt === ")") {
                    //defining the end of the group
                } else if (operators.indexOf(txt.toLowerCase()) === -1) {
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

        };

        parseIt(group, queryArray);
        return group;
    }


    /**
     * Will take the query string and stringify
     * @param group
     * @returns {Array}
     */
    private stringifyQuery(group: any) {
        let self: any = this;

        if (!group) return;
        var str = [];
        angular.forEach(group.expressions, function (o, i) {
            if (o.type === 'condition') {
                var values = o.values[0] ? o.values.join(", ") : "";
                if (!o.field || !o.field[self.fieldName])return;
                if (i !== 0) str.push(group.op)

                str.push(o.field[self.fieldName]);

                let condition = self.conditions.find(function (q) {
                    return o.operator === q.value;
                }).symbol;

                str.push(Array.isArray(condition) ? condition[0] : condition);

                let ticks = "`";
                if (values) str.push(self.$outputUpdate ? values : ticks + values + ticks);

            } else {
                var comp = self.stringifyQuery(o);
                if (comp.length) {
                    if (str.length) str.push(group.op);
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


    onConditionChange(rule: any, e?: any) {
        this.$event = 'onConditionChange';
        this.setOperator(rule.operator);
        this.onGroupChange();
    };


    onGroupChange(e?: any) {
        clearTimeout(this.$timeoutPromise);

        let self: any = this;

        this.$event = e || 'onGroupChange';

        let conditions = [];
        let values = [];
        this.group.expressions.forEach(function (o, i) {
            if (o.type !== 'condition')return;
            conditions.push(o);
            let hasValue: boolean = o.values ? o.values[0] : false;
            let hasOperand: boolean = o.field ? o.field[self.fieldValue] : false;
            if (hasValue && hasOperand) values.push(i)
        });

        this.setFieldsDescription(this.group);
        this.trigger('onUpdate');

        /*
         Add a new row for new field entry
         */
        if (conditions.length > 0 && values.length === conditions.length) {
            this.AddCondition(values[values.length - 1] + 1);
        } else if (conditions.length == 0) {
            this.AddCondition(0);
        }

    }


    private setFieldsDescription(group) {
        let self: any = this;
        group.expressions.forEach(function (o, i) {
            !function (obj) {
                if (obj.type === 'condition') {
                    let test = self.fields.map(function (o) {
                        if (obj.field && obj.field[self.fieldValue] === o[self.fieldValue]) {
                            return obj.field = o;
                        } else if (obj.field && obj.field[self.fieldName] === o[self.fieldName]) {
                            return obj.field = o;
                        }
                    });
                } else {
                    obj = self.setFieldsDescription(obj)
                }
            }(o)
        });
    };

    AddCondition(idx?: number) {
        let self: any = this;

        var condition = angular.copy(QUERY_INTERFACE.filters.expressions[0], {
            $$indeed: self.$countCondition,
            values  : []
        });

        if (idx > -1) {
            self.group.expressions.splice(idx, 0, condition);
        } else {
            self.group.expressions.push(condition);
        }

    }

    AddGroup(e?: any) {
        this.$event = 'AddGroup';
        this.group.expressions.push(angular.copy(QUERY_INTERFACE.filters));
    }

    RemoveGroup(e?: any) {
        this.$event = 'RemoveGroup';

        let self: any = this;
        this.onDelete({
            $event: {
                group: self.group
            }
        })
    }

    RemoveCondition(idx: number, e?: any) {
        this.$event = 'RemoveCondition';
        let self: any = this;
        this.$countCondition = 0;
        this.group.expressions.map(function (o) {
            if (o.type === 'condition') self.$countCondition++;
        });
        if (self.$countCondition === 1)return;
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
        this.trigger('onUpdate');
    }


    trigger(event: string) {
        let self: any = this;
        let string: Array<string> = this.stringifyQuery(this.group);
        //update both if updated from object
        this.$queryString = this.queryString = string.join(' ');

        this.$outputUpdate = false;

        this[event]({
            $event: {
                group : JSON.parse(angular.toJson(self.group)),
                string: self.queryString
            }
        })

    }

    $onDestroy() {
        clearTimeout(this.$timeoutPromise);
    }
}


require('./query.less');

export class QueryBuilder implements ng.IComponentOptions {
    public bindings: any;
    public template: any;
    public controller: any;


    constructor() {
        this.bindings = {
            onDelete   : '&',
            onUpdate   : '&',
            fieldValue : '@?',
            fieldName  : '@?',
            queryString: '=?',
            $$index    : '<',
            group      : '=',
            fields     : '<'
        };

        this.template = require('!!raw!./query-builder.component.html');
        this.controller = QueryBuilderCtrl;
    }
}


// WEBPACK FOOTER //
// ./~/angular1-template-loader!./src/js/queryBuilder/component/query-builder.component.ts



// WEBPACK FOOTER //
// ./~/angular1-template-loader!./src/js/queryBuilder/component/query-builder.component.ts