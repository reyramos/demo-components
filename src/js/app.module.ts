'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";


export module MyBreyerGuide {
    require("../less/styles.less");

    export let app: any = angular.module('app', [
        'ui.router'
        , 'ngResource'
        , 'ngSanitize'
        , 'oc.lazyLoad'
        , require('./core').name
    ]);

    app.config(RouteProvider);

}


