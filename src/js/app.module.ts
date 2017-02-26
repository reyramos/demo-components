'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";

require("css/styles.less");

let app: any = angular.module('app', [
    'ngSanitize'
    , require('./core').name
]);

app.config(['routeStateProvider', function (states) {
    return new RouteProvider(states);
}]);


require('./components')(app);


module.exports = app;
