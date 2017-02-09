'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";


export module App {
    require("css/styles.less");

    export let app: any = angular.module('app', [
        'rx'
        , 'ui.router'
        , 'ngResource'
        , 'ngSanitize'
        , 'ngAnimate'
        , 'oc.lazyLoad'
        , require('./core').name
    ]);

    app.config(RouteProvider);

}


