/**
 * Created by ramor11 on 1/20/2017.
 */


'use strict';

import * as angular from "angular";
import {InputCtrl} from "../input/input.component";


require('./checkbox.less');

function getSibling(element, key) {
    var sibling = element[0][key + 'Sibling'];
    return sibling?angular.element(sibling[key + 'ElementSibling']):angular.element(element[0]);
}

/**
 * @ngdoc directive
 * @name eqIndeterminate
 * @module
 *
 * @restrict A
 *
 * @requires ngModel
 * @requires eqCheckbox
 *
 * @param {string} - attr.eqIndeterminate Must be a string to $observe the attribute changes
 *
 * @description
 * `<input eq-indeterminate="true">` - The directive template must be inside an input element.
 * The value of eq-indeterminate MUST be a string
 *
 */

/**
 * @ngdoc directive
 * @name eqIndeterminate
 * @module
 *
 * @restrict A
 *
 * @requires ngModel
 * @requires eqCheckbox
 *
 * @param {string} - attr.eqIndeterminate Must be a string to $observe the attribute changes
 *
 * @description
 * `<input eq-indeterminate="true">` - The directive template must be inside an input element.
 * The value of eq-indeterminate MUST be a string
 *
 */

export class Indeterminate implements ng.IDirective {
    public link: (scope: ng.IScope, ele: ng.IAugmentedJQuery, attr: ng.IAttributes) => void;
    public restrict: string = 'A';
    public require: Array<string> = ['ngModel', '^eqCheckbox'];

    public static instance(): ng.IDirective {
        return new Indeterminate();
    }

    constructor() {
        this.link = this.linkFunc;
    }

    public linkFunc(scope: ng.IScope, ele: ng.IAugmentedJQuery, attr: ng.IAttributes) {
        (attr as any).$observe('eqIndeterminate', function (value) {
            (<HTMLInputElement>ele[0]).indeterminate = (scope as any).$eval(value);
        });
    }

}

class CheckboxCtrl extends InputCtrl {

    static $inject = ['$element'];

    public name: string;
    public ngClick: string;
    public type: string = "checkbox";

    private eqCheckboxGroup: any;
    private isParent: any;
    private children: any;
    private indeterminate: boolean;

    private $obj: any = {
        $name: this.name || this.$id
    };

    // private _model: any;

    constructor(protected $element) {
        super($element);
        this.$element = $element;
        if (this.ngClick)throw new Error('To prevent double events, use `ngChange`');
    }

    private extend_model(o) {
        let model: any = angular.copy(o);
        Object.assign(this.$obj, typeof model === 'object' ? model : {model: model});
        return model;
    }


    $onInit() {
        let self: any = this;

        let select: any = this.$element.find('input');
        select.attr("multiple", "")


        this.ngModel.$render = function () {
            self.model = this.$viewValue;
            self._model = self.extend_model(self.model);
            if (self.eqCheckboxGroup) self.eqCheckboxGroup.siblings.push(self);
        };
    };


    $doCheck() {
        //define if this is a parent object
        if (this.isParent === undefined) {
            var ctrl = getSibling(this.$element, 'next').data('$eqCheckboxGroupController');
            if (ctrl) this.isParent = !!ctrl;
            if (this.isParent) this.children = ctrl.siblings;
        }

        if (!angular.equals(this.model, this._model)) {

            if (this.model) this.indeterminate = false;

            this._model = this.extend_model(this.model);

            if (this.eqCheckboxGroup) this._isChild(this.eqCheckboxGroup);

            if (this.isParent) this._isParent();

            this.ngModel.$setViewValue(this.model, 'change');
        }

    };


    private _isChild(item) {
        var parent = item.parent;
        var indeterminate = false;
        var count = 0;
        parent.children.map(function (o) {
            if (o.indeterminate || o.model) indeterminate = true;
            if (o.model) count++;
        });

        parent.indeterminate = indeterminate;
        parent.model = count === parent.children.length;
        if (parent.model) parent.indeterminate = false;
        //check all parents
        if (parent.eqCheckboxGroup) this._isChild(parent.eqCheckboxGroup)
        //force $digest on parent
        parent.ngModel.$setViewValue(parent.model, 'change');
    }


    private _isParent() {
        let self: any = this;
        var itemController = getSibling(this.$element, 'next').data('$eqCheckboxGroupController');
        if (itemController && !this.indeterminate) angular.forEach(itemController.siblings, function (o, i) {
            o.model = self.model;
        });
    }

}


// @Component
export class Checkbox implements ng.IComponentOptions {
    public bindings: any;
    public require: any;
    public controller: any;
    public template: string;
    public transclude: boolean;

    constructor() {
        this.bindings = {
            name       : '<',
            ngClick    : '@', //outputs
            placeholder: '<',
            label      : '<',
            required   : '<',
            note       : '<',
            disabled   : '<'
        };

        this.require = {
            ngModel         : '^',
            eqCheckboxGroup: '^?'
        };

        this.transclude = true;
        this.template = require('!!raw!./checkbox.html');
        this.controller = CheckboxCtrl;

    }
}


class CheckboxGroupCtrl {

    static $inject = ['$element'];

    public parent: any;
    public siblings: Array<any>;

    constructor(private $element) {
        this.parent = getSibling($element, 'previous').data('$eqCheckboxController');
        this.siblings = [];

        if (!this.parent)
            throw new Error('Missing previousSibling `eqCheckbox`');
    }

}


// @Component
export class CheckboxGroup implements ng.IComponentOptions {
    public controller: any;

    constructor() {
        this.controller = CheckboxGroupCtrl;

    }
}
