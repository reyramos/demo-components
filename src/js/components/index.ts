/**
 * Created by reyra on 2/8/2017.
 */


import {Input} from "./input/input.component";
import {Checkbox, Indeterminate} from "./checkbox/checkbox.component";


module.exports = function (app) {


    app.component('eqInput', new Input());
    app.directive('eqIndeterminate', Indeterminate.instance);
    app.component('eqCheckbox', new Checkbox());


};

