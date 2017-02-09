/**
 * Created by reyra on 2/8/2017.
 */


import {Checkbox, Indeterminate} from "./checkbox/checkbox.component";


module.exports = function (app) {


    app.directive('eqIndeterminate', Indeterminate.instance);
    app.component('eqCheckbox', new Checkbox());


};

