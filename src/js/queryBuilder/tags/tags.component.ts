/**
 * Created by reyra on 1/31/2017.
 */
require('bootstrap-tagsinput/src/bootstrap-tagsinput');
require('bootstrap-tagsinput/src/bootstrap-tagsinput.css');

import * as angular from "angular";

class TagsComponentCtrl implements ng.IComponentController {

    placeholder: string;
    type: string;
    name: string;
    note: string;
    autocomplete: any;
    select: any;
    options: any;
    form: any;
    typeaheadSource: any;
    ngModel: any;
    model: any;

    private Timeout: any;
    private hidden: any;
    private _model: any;

    static $inject: Array<string> = ['utilities', '$element'];

    constructor(protected utilities, protected $element) {
        this.select = $($element.find('input[type="text"]')[0]);
        this.hidden = angular.element($element.find('input[type="hidden"]')).controller('ngModel');

    }


    $onInit() {
        let self: any = this;
        this.ngModel.$render = function () {
            let _his: any = this;

            self.model = !Array.isArray(this.$viewValue) ? [] : this.$viewValue.slice(0);

            self.select.tagsinput(self.options || '' || {
                    itemValue  : self.itemvalue,
                    itemText   : self.itemtext,
                    confirmKeys: self.confirmkeys ? JSON.parse(self.confirmkeys) : [13],
                    tagClass   : typeof self.tagClass === "function" ? self.tagClass : function (item) {
                            return self.tagclass;
                        }
                });


            self.model.forEach((m)=> {
                self.select.tagsinput('add', m);
            });

            self.select.on('itemAdded', function (event) {
                if (self.model.indexOf(event.item) === -1)
                    self.model.push(event.item);
            });

            self.select.on('itemRemoved', function (event) {
                let idx = self.model.indexOf(event.item);
                if (idx !== -1) self.model.splice(idx, 1);
            });

        };


        console.log(this);

    }


    $doCheck() {
        if (!angular.equals(this.model, this._model)) {
            this._model = angular.copy(this.model);
            this.form[this.name].$invalid = !this.model.length;
            this.ngModel.$invalid = !this.model.length;
            this.form[this.name].$valid = !!this.model.length;
            this.ngModel.$valid = !!this.model.length;
            this.ngModel.$setValidity("tags-invalid", !!this.model.length);
            this.ngModel.$setViewValue(this.model, 'change');
            // this.utilities.safeApply();
        }
    };

    $postLink() {
        let self: any = this;
        setTimeout(() => {
            let input = self.$element.find('input');
            input[0].placeholder = self.placeholder;
        }, 1)
    }

    $onDestroy() {
        clearTimeout(this.Timeout);
    }
}

require('./tags.less');

export class TagsComponent implements ng.IComponentOptions {
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
            placeholder    : '<',
            label          : '<',
            name           : '<',
            required       : '<',
            note           : '<',
            disabled       : '<',
            options        : '<',
            typeaheadSource: "<",
            tagclass       : "<",
            itemvalue      : "@",
            itemtext       : "@",
            confirmKeys    : "@"
        };

        this.template = require('./tags.html');
        this.controller = TagsComponentCtrl
    }
}
