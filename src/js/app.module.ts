'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";

export module App {
    require("css/styles.less");

    export let app: any = angular.module('app', [
         'ui.router'
        , 'ngSanitize'
        , 'oc.lazyLoad'
        , require('./core').name
    ]);

    app.config(RouteProvider);




}


