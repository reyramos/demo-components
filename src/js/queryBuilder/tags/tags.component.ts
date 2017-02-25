/**
 * Created by reyra on 1/31/2017.
 */
require('bootstrap-tagsinput/src/bootstrap-tagsinput');
require('bootstrap-tagsinput/src/bootstrap-tagsinput.css');

import * as angular from "angular";

class TagsComponentCtrl implements ng.IComponentController {

    public placeholder: string;
    public type: string;
    public name: string;
    public note: string;
    public autocomplete: any;
    public select: any;
    public options: any;
    public form: any;
    public typeaheadSource: any;
    public ngModel: any;
    public model: any = [];
    public $id: string;
    public label: string;
    public required: boolean;
    public ngChange: any;
    public tags: any;

    private $tags: any;
    private Timeout: any;
    private TagsTimeout: any;
    private hidden: any;
    private $model: any = [];

    static $inject: Array<string> = ['$element'];

    constructor(protected $element) {

        this.$id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Date.now().toString();


        this.select = $($element.find('input[type="text"]')[0]);
        this.hidden = angular.element($element.find('input[type="hidden"]')).controller('ngModel');
    }


    private RenderInit() {
        let self: any = this;
        self.select.tagsinput(self.options || '' || {
                itemValue: self.itemvalue,
                itemText: self.itemtext,
                confirmKeys: self.confirmkeys ? JSON.parse(self.confirmkeys) : [13],
                tagClass: typeof self.tagClass === "function" ? self.tagClass : function (item) {
                    return self.tagclass;
                }
            });


        if (self.model.length)
            self.model.forEach((m)=> {
                self.select.tagsinput('add', m);
            });

        self.select.on('itemAdded', function (event) {
            if (self.model.indexOf(event.item) === -1) {
                self.model.push(event.item);
                self.CheckModel()
            }
        });

        self.select.on('itemRemoved', function (event) {
            let idx = self.model.indexOf(event.item);
            if (idx !== -1) self.model.splice(idx, 1);
            self.CheckModel()
        });
    }

    $onInit() {
        let self: any = this;

        if (!this.name) this.name = this.$id;
        if (!this.required) this.required = false;

        if (this.ngModel)this.ngModel.$render = function () {
            self.model = !Array.isArray(this.$viewValue) ? [] : this.$viewValue.slice(0);
            self.RenderInit();
        };
    }

    private CheckModel() {
        let self: any = this;


        if (!angular.equals(this.model, this.$model)) {

            this.$model = angular.copy(this.model);
            this.ngModel.$setValidity("tags-invalid", !!this.model.length);
            this.ngModel.$setViewValue(this.model, 'change');

            self.select.tagsinput('removeAll');
            self.model.forEach((m)=> {
                self.select.tagsinput('add', m);
            });

            this.ngChange({
                $event: {
                    $element: self.$element,
                    model: self.model
                }
            })
        }
    }

    $doCheck() {
        let self: any = this;

        this.CheckModel();
    };

    $postLink() {
        let self: any = this;
        setTimeout(() => {
            let input = self.$element.find('input');
            input[0].placeholder = self.placeholder || "";
        }, 1)
    }

    $onDestroy() {
        clearTimeout(this.Timeout);
        clearTimeout(this.TagsTimeout);
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
            ngModel: '^?',
            form: '^^?'
        };

        this.bindings = {
            ngChange: '&',
            placeholder: '<',
            label: '<',
            name: '<',
            required: '<',
            note: '<',
            disabled: '<',
            options: '<',
            typeaheadSource: "<",
            tagclass: "<",
            itemvalue: "@",
            itemtext: "@",
            confirmKeys: "@"
        };

        this.template = require('./tags.html');
        this.controller = TagsComponentCtrl
    }
}
