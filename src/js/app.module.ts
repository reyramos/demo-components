'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";

export module App {
    require("css/styles.less");

    export let app: any = angular.module('app', [
        'rx'
        , 'ui.router'
        , 'ngSanitize'
        , 'oc.lazyLoad'
        , require('./core').name
    ]);

    app.config(['routeStateProvider', function(states){
        return new RouteProvider(states);
    }]);


    require('./components')(app);


}


