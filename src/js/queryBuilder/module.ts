/**
 * Created by reyra on 7/12/2016.
 */


"use strict";

import * as angular from "angular";
import {QueryBuilder} from "./component/query-builder.component";
import {QUERY_OPERATORS, QUERY_CONDITIONS} from "./constants/query.conditions";
import {QUERY_INTERFACE} from "./constants/query.interface";

var app = angular.module("app.queryBuilder", []);

require('./controller')(app);

app.component('queryBuilder', new QueryBuilder());
app.constant('QUERY_OPERATORS', QUERY_OPERATORS);
app.constant('QUERY_CONDITIONS', QUERY_CONDITIONS);
app.constant('QUERY_INTERFACE', QUERY_INTERFACE);


module.exports = app;


