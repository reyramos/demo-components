/**
 * Created by reyra on 1/9/2017.
 */
import * as angular from "angular";

"use strict";


export class InputCtrl implements ng.IComponentController {


    public require: boolean;
    public disabled: boolean;
    public $id: string;
    public label: string;
    public required: boolean;
    public datalist: any;
    public ngModel: any;
    public model: any;
    public name: any;
    protected _model: any;

    static $inject = ['$element'];

    constructor(protected $element) {
        this.$id = this.getUniqueId();
        if (!this.required) this.required = false;
        if (!this.name) this.name = this.$id;
    }


    private getUniqueId() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Date.now().toString()
    }

    $onInit() {
        let self: any = this;
        this.datalist = this.getUniqueId();
        this.ngModel.$render = function () {
            self.model = this.$viewValue;
        };

    };


    $doCheck() {
        if (!angular.equals(this.model, this._model)) {
            this._model = angular.copy(this.model);
            this.ngModel.$setViewValue(this.model, 'change');
        }
    };

}

// @Component
export class Input implements ng.IComponentOptions {
    public bindings: any;
    public require: any;
    public controller: any;
    public template: string;

    constructor() {
        this.require = {
            ngModel: '^',
            form   : '^^'
        };

        this.bindings = {
            placeholder : '<',
            label       : '<',
            type        : '@',
            name        : '<',
            required    : '<',
            note        : '<',
            disabled    : '<',
            autocomplete: '='
        };

        this.template = require('./input.component.html');
        this.controller = InputCtrl;
    }
}
