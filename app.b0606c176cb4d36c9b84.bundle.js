webpackJsonp([1,3],{

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by reyra on 1/9/2017.
 */

const angular = __webpack_require__(3);
"use strict";
class InputCtrl {
    constructor($element) {
        this.$element = $element;
        this.$id = this.getUniqueId();
        if (!this.required) this.required = false;
        if (!this.name) this.name = this.$id;
    }
    getUniqueId() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Date.now().toString();
    }
    $onInit() {
        let self = this;
        this.datalist = this.getUniqueId();
        this.ngModel.$render = function () {
            self.model = this.$viewValue;
        };
    }

    $doCheck() {
        if (!angular.equals(this.model, this._model)) {
            this._model = angular.copy(this.model);
            this.ngModel.$setViewValue(this.model, 'change');
        }
    }
}
InputCtrl.$inject = ['$element'];
exports.InputCtrl = InputCtrl;
// @Component
class Input {
    constructor() {
        this.require = {
            ngModel: '^',
            form: '^^'
        };
        this.bindings = {
            placeholder: '<',
            label: '<',
            type: '@',
            name: '<',
            required: '<',
            note: '<',
            disabled: '<',
            autocomplete: '='
        };
        this.template = __webpack_require__(57);
        this.controller = InputCtrl;
    }
}
exports.Input = Input;

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const angular = __webpack_require__(3);
const routes_1 = __webpack_require__(53);
var App;
(function (App) {
    __webpack_require__(56);
    App.app = angular.module('app', ['rx', 'ui.router', 'ngSanitize', 'oc.lazyLoad', __webpack_require__(47).name]);
    App.app.config(routes_1.RouteProvider);
    __webpack_require__(45)(App.app);
})(App = exports.App || (exports.App = {}));

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

/**
 * # Main Application bootstrap file
 *
 * Allows main Application to be bootloaded. This separate file is required in
 * order to properly isolate angular logic from requirejs module loading
 */
(function (angular) {
	'use strict';
	angular.bootstrap(document, ['app'], {
		// strictDi: true
	});
})(window.angular);


/***/ }),

/***/ 15:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf";

/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/font-awesome/fonts/fontawesome-webfont.ttf";

/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

module.exports =
	"/*! X-editable - v1.5.1 \n* In-place editing with Twitter Bootstrap, jQuery UI or pure jQuery\n* http://github.com/vitalets/x-editable\n* Copyright (c) 2013 Vitaliy Potapov; Licensed MIT */\n.editableform {\n    margin-bottom: 0; /* overwrites bootstrap margin */\n}\n\n.editableform .control-group {\n    margin-bottom: 0; /* overwrites bootstrap margin */\n    white-space: nowrap; /* prevent wrapping buttons on new line */\n    line-height: 20px; /* overwriting bootstrap line-height. See #133 */\n}\n\n/* \n  BS3 width:1005 for inputs breaks editable form in popup \n  See: https://github.com/vitalets/x-editable/issues/393\n*/\n.editableform .form-control {\n    width: auto;\n}\n\n.editable-buttons {\n   display: inline-block; /* should be inline to take effect of parent's white-space: nowrap */\n   vertical-align: top;\n   margin-left: 7px;\n   /* inline-block emulation for IE7*/\n   zoom: 1; \n   *display: inline;\n}\n\n.editable-buttons.editable-buttons-bottom {\n   display: block; \n   margin-top: 7px;\n   margin-left: 0;\n}\n\n.editable-input {\n    vertical-align: top; \n    display: inline-block; /* should be inline to take effect of parent's white-space: nowrap */\n    width: auto; /* bootstrap-responsive has width: 100% that breakes layout */\n    white-space: normal; /* reset white-space decalred in parent*/\n   /* display-inline emulation for IE7*/\n   zoom: 1; \n   *display: inline;   \n}\n\n.editable-buttons .editable-cancel {\n   margin-left: 7px; \n}\n\n/*for jquery-ui buttons need set height to look more pretty*/\n.editable-buttons button.ui-button-icon-only {\n   height: 24px; \n   width: 30px;\n}\n\n.editableform-loading {\n    background: url("+__webpack_require__(183)+") center center no-repeat;  \n    height: 25px;\n    width: auto; \n    min-width: 25px; \n}\n\n.editable-inline .editableform-loading {\n    background-position: left 5px;      \n}\n\n .editable-error-block {\n    max-width: 300px;\n    margin: 5px 0 0 0;\n    width: auto;\n    white-space: normal;\n}\n\n/*add padding for jquery ui*/\n.editable-error-block.ui-state-error {\n    padding: 3px;  \n}  \n\n.editable-error {\n   color: red;  \n}\n\n/* ---- For specific types ---- */\n\n.editableform .editable-date {\n    padding: 0; \n    margin: 0;\n    float: left;\n}\n\n/* move datepicker icon to center of add-on button. See https://github.com/vitalets/x-editable/issues/183 */\n.editable-inline .add-on .icon-th {\n   margin-top: 3px;\n   margin-left: 1px; \n}\n\n\n/* checklist vertical alignment */\n.editable-checklist label input[type=\"checkbox\"], \n.editable-checklist label span {\n    vertical-align: middle;\n    margin: 0;\n}\n\n.editable-checklist label {\n    white-space: nowrap; \n}\n\n/* set exact width of textarea to fit buttons toolbar */\n.editable-wysihtml5 {\n    width: 566px; \n    height: 250px; \n}\n\n/* clear button shown as link in date inputs */\n.editable-clear {\n   clear: both;\n   font-size: 0.9em;\n   text-decoration: none;\n   text-align: right;\n}\n\n/* IOS-style clear button for text inputs */\n.editable-clear-x {\n   background: url("+__webpack_require__(182)+") center center no-repeat;\n   display: block;\n   width: 13px;    \n   height: 13px;\n   position: absolute;\n   opacity: 0.6;\n   z-index: 100;\n   \n   top: 50%;\n   right: 6px;\n   margin-top: -6px;\n   \n}\n\n.editable-clear-x:hover {\n   opacity: 1;\n}\n\n.editable-pre-wrapped {\n   white-space: pre-wrap;\n}\n.editable-container.editable-popup {\n    max-width: none !important; /* without this rule poshytip/tooltip does not stretch */\n}  \n\n.editable-container.popover {\n    width: auto; /* without this rule popover does not stretch */\n}\n\n.editable-container.editable-inline {\n    display: inline-block; \n    vertical-align: middle;\n    width: auto;\n    /* inline-block emulation for IE7*/\n    zoom: 1; \n    *display: inline;    \n}\n\n.editable-container.ui-widget {\n   font-size: inherit;  /* jqueryui widget font 1.1em too big, overwrite it */\n   z-index: 9990; /* should be less than select2 dropdown z-index to close dropdown first when click */\n}\n.editable-click, \na.editable-click, \na.editable-click:hover {\n    text-decoration: none;\n    border-bottom: dashed 1px #0088cc;\n}\n\n.editable-click.editable-disabled, \na.editable-click.editable-disabled, \na.editable-click.editable-disabled:hover {\n   color: #585858;  \n   cursor: default;\n   border-bottom: none;\n}\n\n.editable-empty, .editable-empty:hover, .editable-empty:focus{\n  font-style: italic; \n  color: #DD1144;  \n  /* border-bottom: none; */\n  text-decoration: none;\n}\n\n.editable-unsaved {\n  font-weight: bold; \n}\n\n.editable-unsaved:after {\n/*    content: '*'*/\n}\n\n.editable-bg-transition {\n  -webkit-transition: background-color 1400ms ease-out;\n  -moz-transition: background-color 1400ms ease-out;\n  -o-transition: background-color 1400ms ease-out;\n  -ms-transition: background-color 1400ms ease-out;\n  transition: background-color 1400ms ease-out;  \n}\n\n/*see https://github.com/vitalets/x-editable/issues/139 */\n.form-horizontal .editable\n{ \n    padding-top: 5px;\n    display:inline-block;\n}\n\n\n/*!\n * Datepicker for Bootstrap\n *\n * Copyright 2012 Stefan Petre\n * Improvements by Andrew Rowls\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n */\n.datepicker {\n  padding: 4px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  direction: ltr;\n  /*.dow {\n\t\tborder-top: 1px solid #ddd !important;\n\t}*/\n\n}\n.datepicker-inline {\n  width: 220px;\n}\n.datepicker.datepicker-rtl {\n  direction: rtl;\n}\n.datepicker.datepicker-rtl table tr td span {\n  float: right;\n}\n.datepicker-dropdown {\n  top: 0;\n  left: 0;\n}\n.datepicker-dropdown:before {\n  content: '';\n  display: inline-block;\n  border-left: 7px solid transparent;\n  border-right: 7px solid transparent;\n  border-bottom: 7px solid #ccc;\n  border-bottom-color: rgba(0, 0, 0, 0.2);\n  position: absolute;\n  top: -7px;\n  left: 6px;\n}\n.datepicker-dropdown:after {\n  content: '';\n  display: inline-block;\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #ffffff;\n  position: absolute;\n  top: -6px;\n  left: 7px;\n}\n.datepicker > div {\n  display: none;\n}\n.datepicker.days div.datepicker-days {\n  display: block;\n}\n.datepicker.months div.datepicker-months {\n  display: block;\n}\n.datepicker.years div.datepicker-years {\n  display: block;\n}\n.datepicker table {\n  margin: 0;\n}\n.datepicker td,\n.datepicker th {\n  text-align: center;\n  width: 20px;\n  height: 20px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  border: none;\n}\n.table-striped .datepicker table tr td,\n.table-striped .datepicker table tr th {\n  background-color: transparent;\n}\n.datepicker table tr td.day:hover {\n  background: #eeeeee;\n  cursor: pointer;\n}\n.datepicker table tr td.old,\n.datepicker table tr td.new {\n  color: #999999;\n}\n.datepicker table tr td.disabled,\n.datepicker table tr td.disabled:hover {\n  background: none;\n  color: #999999;\n  cursor: default;\n}\n.datepicker table tr td.today,\n.datepicker table tr td.today:hover,\n.datepicker table tr td.today.disabled,\n.datepicker table tr td.today.disabled:hover {\n  background-color: #fde19a;\n  background-image: -moz-linear-gradient(top, #fdd49a, #fdf59a);\n  background-image: -ms-linear-gradient(top, #fdd49a, #fdf59a);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fdd49a), to(#fdf59a));\n  background-image: -webkit-linear-gradient(top, #fdd49a, #fdf59a);\n  background-image: -o-linear-gradient(top, #fdd49a, #fdf59a);\n  background-image: linear-gradient(top, #fdd49a, #fdf59a);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fdd49a', endColorstr='#fdf59a', GradientType=0);\n  border-color: #fdf59a #fdf59a #fbed50;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #000;\n}\n.datepicker table tr td.today:hover,\n.datepicker table tr td.today:hover:hover,\n.datepicker table tr td.today.disabled:hover,\n.datepicker table tr td.today.disabled:hover:hover,\n.datepicker table tr td.today:active,\n.datepicker table tr td.today:hover:active,\n.datepicker table tr td.today.disabled:active,\n.datepicker table tr td.today.disabled:hover:active,\n.datepicker table tr td.today.active,\n.datepicker table tr td.today:hover.active,\n.datepicker table tr td.today.disabled.active,\n.datepicker table tr td.today.disabled:hover.active,\n.datepicker table tr td.today.disabled,\n.datepicker table tr td.today:hover.disabled,\n.datepicker table tr td.today.disabled.disabled,\n.datepicker table tr td.today.disabled:hover.disabled,\n.datepicker table tr td.today[disabled],\n.datepicker table tr td.today:hover[disabled],\n.datepicker table tr td.today.disabled[disabled],\n.datepicker table tr td.today.disabled:hover[disabled] {\n  background-color: #fdf59a;\n}\n.datepicker table tr td.today:active,\n.datepicker table tr td.today:hover:active,\n.datepicker table tr td.today.disabled:active,\n.datepicker table tr td.today.disabled:hover:active,\n.datepicker table tr td.today.active,\n.datepicker table tr td.today:hover.active,\n.datepicker table tr td.today.disabled.active,\n.datepicker table tr td.today.disabled:hover.active {\n  background-color: #fbf069 \\9;\n}\n.datepicker table tr td.today:hover:hover {\n  color: #000;\n}\n.datepicker table tr td.today.active:hover {\n  color: #fff;\n}\n.datepicker table tr td.range,\n.datepicker table tr td.range:hover,\n.datepicker table tr td.range.disabled,\n.datepicker table tr td.range.disabled:hover {\n  background: #eeeeee;\n  -webkit-border-radius: 0;\n  -moz-border-radius: 0;\n  border-radius: 0;\n}\n.datepicker table tr td.range.today,\n.datepicker table tr td.range.today:hover,\n.datepicker table tr td.range.today.disabled,\n.datepicker table tr td.range.today.disabled:hover {\n  background-color: #f3d17a;\n  background-image: -moz-linear-gradient(top, #f3c17a, #f3e97a);\n  background-image: -ms-linear-gradient(top, #f3c17a, #f3e97a);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f3c17a), to(#f3e97a));\n  background-image: -webkit-linear-gradient(top, #f3c17a, #f3e97a);\n  background-image: -o-linear-gradient(top, #f3c17a, #f3e97a);\n  background-image: linear-gradient(top, #f3c17a, #f3e97a);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f3c17a', endColorstr='#f3e97a', GradientType=0);\n  border-color: #f3e97a #f3e97a #edde34;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  -webkit-border-radius: 0;\n  -moz-border-radius: 0;\n  border-radius: 0;\n}\n.datepicker table tr td.range.today:hover,\n.datepicker table tr td.range.today:hover:hover,\n.datepicker table tr td.range.today.disabled:hover,\n.datepicker table tr td.range.today.disabled:hover:hover,\n.datepicker table tr td.range.today:active,\n.datepicker table tr td.range.today:hover:active,\n.datepicker table tr td.range.today.disabled:active,\n.datepicker table tr td.range.today.disabled:hover:active,\n.datepicker table tr td.range.today.active,\n.datepicker table tr td.range.today:hover.active,\n.datepicker table tr td.range.today.disabled.active,\n.datepicker table tr td.range.today.disabled:hover.active,\n.datepicker table tr td.range.today.disabled,\n.datepicker table tr td.range.today:hover.disabled,\n.datepicker table tr td.range.today.disabled.disabled,\n.datepicker table tr td.range.today.disabled:hover.disabled,\n.datepicker table tr td.range.today[disabled],\n.datepicker table tr td.range.today:hover[disabled],\n.datepicker table tr td.range.today.disabled[disabled],\n.datepicker table tr td.range.today.disabled:hover[disabled] {\n  background-color: #f3e97a;\n}\n.datepicker table tr td.range.today:active,\n.datepicker table tr td.range.today:hover:active,\n.datepicker table tr td.range.today.disabled:active,\n.datepicker table tr td.range.today.disabled:hover:active,\n.datepicker table tr td.range.today.active,\n.datepicker table tr td.range.today:hover.active,\n.datepicker table tr td.range.today.disabled.active,\n.datepicker table tr td.range.today.disabled:hover.active {\n  background-color: #efe24b \\9;\n}\n.datepicker table tr td.selected,\n.datepicker table tr td.selected:hover,\n.datepicker table tr td.selected.disabled,\n.datepicker table tr td.selected.disabled:hover {\n  background-color: #9e9e9e;\n  background-image: -moz-linear-gradient(top, #b3b3b3, #808080);\n  background-image: -ms-linear-gradient(top, #b3b3b3, #808080);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#b3b3b3), to(#808080));\n  background-image: -webkit-linear-gradient(top, #b3b3b3, #808080);\n  background-image: -o-linear-gradient(top, #b3b3b3, #808080);\n  background-image: linear-gradient(top, #b3b3b3, #808080);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#b3b3b3', endColorstr='#808080', GradientType=0);\n  border-color: #808080 #808080 #595959;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td.selected:hover,\n.datepicker table tr td.selected:hover:hover,\n.datepicker table tr td.selected.disabled:hover,\n.datepicker table tr td.selected.disabled:hover:hover,\n.datepicker table tr td.selected:active,\n.datepicker table tr td.selected:hover:active,\n.datepicker table tr td.selected.disabled:active,\n.datepicker table tr td.selected.disabled:hover:active,\n.datepicker table tr td.selected.active,\n.datepicker table tr td.selected:hover.active,\n.datepicker table tr td.selected.disabled.active,\n.datepicker table tr td.selected.disabled:hover.active,\n.datepicker table tr td.selected.disabled,\n.datepicker table tr td.selected:hover.disabled,\n.datepicker table tr td.selected.disabled.disabled,\n.datepicker table tr td.selected.disabled:hover.disabled,\n.datepicker table tr td.selected[disabled],\n.datepicker table tr td.selected:hover[disabled],\n.datepicker table tr td.selected.disabled[disabled],\n.datepicker table tr td.selected.disabled:hover[disabled] {\n  background-color: #808080;\n}\n.datepicker table tr td.selected:active,\n.datepicker table tr td.selected:hover:active,\n.datepicker table tr td.selected.disabled:active,\n.datepicker table tr td.selected.disabled:hover:active,\n.datepicker table tr td.selected.active,\n.datepicker table tr td.selected:hover.active,\n.datepicker table tr td.selected.disabled.active,\n.datepicker table tr td.selected.disabled:hover.active {\n  background-color: #666666 \\9;\n}\n.datepicker table tr td.active,\n.datepicker table tr td.active:hover,\n.datepicker table tr td.active.disabled,\n.datepicker table tr td.active.disabled:hover {\n  background-color: #006dcc;\n  background-image: -moz-linear-gradient(top, #0088cc, #0044cc);\n  background-image: -ms-linear-gradient(top, #0088cc, #0044cc);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#0088cc), to(#0044cc));\n  background-image: -webkit-linear-gradient(top, #0088cc, #0044cc);\n  background-image: -o-linear-gradient(top, #0088cc, #0044cc);\n  background-image: linear-gradient(top, #0088cc, #0044cc);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);\n  border-color: #0044cc #0044cc #002a80;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td.active:hover,\n.datepicker table tr td.active:hover:hover,\n.datepicker table tr td.active.disabled:hover,\n.datepicker table tr td.active.disabled:hover:hover,\n.datepicker table tr td.active:active,\n.datepicker table tr td.active:hover:active,\n.datepicker table tr td.active.disabled:active,\n.datepicker table tr td.active.disabled:hover:active,\n.datepicker table tr td.active.active,\n.datepicker table tr td.active:hover.active,\n.datepicker table tr td.active.disabled.active,\n.datepicker table tr td.active.disabled:hover.active,\n.datepicker table tr td.active.disabled,\n.datepicker table tr td.active:hover.disabled,\n.datepicker table tr td.active.disabled.disabled,\n.datepicker table tr td.active.disabled:hover.disabled,\n.datepicker table tr td.active[disabled],\n.datepicker table tr td.active:hover[disabled],\n.datepicker table tr td.active.disabled[disabled],\n.datepicker table tr td.active.disabled:hover[disabled] {\n  background-color: #0044cc;\n}\n.datepicker table tr td.active:active,\n.datepicker table tr td.active:hover:active,\n.datepicker table tr td.active.disabled:active,\n.datepicker table tr td.active.disabled:hover:active,\n.datepicker table tr td.active.active,\n.datepicker table tr td.active:hover.active,\n.datepicker table tr td.active.disabled.active,\n.datepicker table tr td.active.disabled:hover.active {\n  background-color: #003399 \\9;\n}\n.datepicker table tr td span {\n  display: block;\n  width: 23%;\n  height: 54px;\n  line-height: 54px;\n  float: left;\n  margin: 1%;\n  cursor: pointer;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n.datepicker table tr td span:hover {\n  background: #eeeeee;\n}\n.datepicker table tr td span.disabled,\n.datepicker table tr td span.disabled:hover {\n  background: none;\n  color: #999999;\n  cursor: default;\n}\n.datepicker table tr td span.active,\n.datepicker table tr td span.active:hover,\n.datepicker table tr td span.active.disabled,\n.datepicker table tr td span.active.disabled:hover {\n  background-color: #006dcc;\n  background-image: -moz-linear-gradient(top, #0088cc, #0044cc);\n  background-image: -ms-linear-gradient(top, #0088cc, #0044cc);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#0088cc), to(#0044cc));\n  background-image: -webkit-linear-gradient(top, #0088cc, #0044cc);\n  background-image: -o-linear-gradient(top, #0088cc, #0044cc);\n  background-image: linear-gradient(top, #0088cc, #0044cc);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);\n  border-color: #0044cc #0044cc #002a80;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td span.active:hover,\n.datepicker table tr td span.active:hover:hover,\n.datepicker table tr td span.active.disabled:hover,\n.datepicker table tr td span.active.disabled:hover:hover,\n.datepicker table tr td span.active:active,\n.datepicker table tr td span.active:hover:active,\n.datepicker table tr td span.active.disabled:active,\n.datepicker table tr td span.active.disabled:hover:active,\n.datepicker table tr td span.active.active,\n.datepicker table tr td span.active:hover.active,\n.datepicker table tr td span.active.disabled.active,\n.datepicker table tr td span.active.disabled:hover.active,\n.datepicker table tr td span.active.disabled,\n.datepicker table tr td span.active:hover.disabled,\n.datepicker table tr td span.active.disabled.disabled,\n.datepicker table tr td span.active.disabled:hover.disabled,\n.datepicker table tr td span.active[disabled],\n.datepicker table tr td span.active:hover[disabled],\n.datepicker table tr td span.active.disabled[disabled],\n.datepicker table tr td span.active.disabled:hover[disabled] {\n  background-color: #0044cc;\n}\n.datepicker table tr td span.active:active,\n.datepicker table tr td span.active:hover:active,\n.datepicker table tr td span.active.disabled:active,\n.datepicker table tr td span.active.disabled:hover:active,\n.datepicker table tr td span.active.active,\n.datepicker table tr td span.active:hover.active,\n.datepicker table tr td span.active.disabled.active,\n.datepicker table tr td span.active.disabled:hover.active {\n  background-color: #003399 \\9;\n}\n.datepicker table tr td span.old,\n.datepicker table tr td span.new {\n  color: #999999;\n}\n.datepicker th.datepicker-switch {\n  width: 145px;\n}\n.datepicker thead tr:first-child th,\n.datepicker tfoot tr th {\n  cursor: pointer;\n}\n.datepicker thead tr:first-child th:hover,\n.datepicker tfoot tr th:hover {\n  background: #eeeeee;\n}\n.datepicker .cw {\n  font-size: 10px;\n  width: 12px;\n  padding: 0 2px 0 5px;\n  vertical-align: middle;\n}\n.datepicker thead tr:first-child th.cw {\n  cursor: default;\n  background-color: transparent;\n}\n.input-append.date .add-on i,\n.input-prepend.date .add-on i {\n  display: block;\n  cursor: pointer;\n  width: 16px;\n  height: 16px;\n}\n.input-daterange input {\n  text-align: center;\n}\n.input-daterange input:first-child {\n  -webkit-border-radius: 3px 0 0 3px;\n  -moz-border-radius: 3px 0 0 3px;\n  border-radius: 3px 0 0 3px;\n}\n.input-daterange input:last-child {\n  -webkit-border-radius: 0 3px 3px 0;\n  -moz-border-radius: 0 3px 3px 0;\n  border-radius: 0 3px 3px 0;\n}\n.input-daterange .add-on {\n  display: inline-block;\n  width: auto;\n  min-width: 16px;\n  height: 18px;\n  padding: 4px 5px;\n  font-weight: normal;\n  line-height: 18px;\n  text-align: center;\n  text-shadow: 0 1px 0 #ffffff;\n  vertical-align: middle;\n  background-color: #eeeeee;\n  border: 1px solid #ccc;\n  margin-left: -5px;\n  margin-right: -5px;\n}\n";

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
  Loki IndexedDb Adapter (need to include this script to use it)

  Console Usage can be used for management/diagnostic, here are a few examples :
  adapter.getDatabaseList(); // with no callback passed, this method will log results to console
  adapter.saveDatabase('UserDatabase', JSON.stringify(myDb));
  adapter.loadDatabase('UserDatabase'); // will log the serialized db to console
  adapter.deleteDatabase('UserDatabase');
*/

(function (root, factory) {
    if (true) {
        // AMD
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.LokiIndexedAdapter = factory();
    }
}(this, function () {
  return (function() {

    /**
     * Loki persistence adapter class for indexedDb.
     *     This class fulfills abstract adapter interface which can be applied to other storage methods. 
     *     Utilizes the included LokiCatalog app/key/value database for actual database persistence.
     *     Indexeddb is highly async, but this adapter has been made 'console-friendly' as well.
     *     Anywhere a callback is omitted, it should return results (if applicable) to console.
     *     IndexedDb storage is provided per-domain, so we implement app/key/value database to 
     *     allow separate contexts for separate apps within a domain.
     *
     * @example
     * var idbAdapter = new LokiIndexedAdapter('finance');
     *
     * @constructor LokiIndexedAdapter
     *
     * @param {string} appname - (Optional) Application name context can be used to distinguish subdomains, 'loki' by default
     */
    function LokiIndexedAdapter(appname)
    {
      this.app = 'loki';

      if (typeof (appname) !== 'undefined')
      {
        this.app = appname;
      }

      // keep reference to catalog class for base AKV operations
      this.catalog = null;

      if (!this.checkAvailability()) {
        throw new Error('indexedDB does not seem to be supported for your environment');
      }
    }

    /**
     * Used to check if adapter is available
     *
     * @returns {boolean} true if indexeddb is available, false if not.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.checkAvailability = function()
    {
      if (typeof indexedDB !== 'undefined' && indexedDB) return true;

      return false;
    };

    /**
     * Retrieves a serialized db string from the catalog.
     *
     * @example
     * // LOAD
     * var idbAdapter = new LokiIndexedAdapter('finance');
     * var db = new loki('test', { adapter: idbAdapter });
     *   db.loadDatabase(function(result) {
     *   console.log('done');
     * });
     *
     * @param {string} dbname - the name of the database to retrieve.
     * @param {function} callback - callback should accept string param containing serialized db string.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.loadDatabase = function(dbname, callback)
    {
      var appName = this.app;
      var adapter = this;

      // lazy open/create db reference so dont -need- callback in constructor
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.loadDatabase(dbname, callback);
        });

        return;
      }

      // lookup up db string in AKV db
      this.catalog.getAppKey(appName, dbname, function(result) {
        if (typeof (callback) === 'function') {
          if (result.id === 0) {
            callback(null);
            return;
          }
          callback(result.val);
        }
        else {
          // support console use of api
          console.log(result.val);
        }
      });
    };

    // alias
    LokiIndexedAdapter.prototype.loadKey = LokiIndexedAdapter.prototype.loadDatabase;

    /**
     * Saves a serialized db to the catalog.
     *
     * @example
     * // SAVE : will save App/Key/Val as 'finance'/'test'/{serializedDb}
     * var idbAdapter = new LokiIndexedAdapter('finance');
     * var db = new loki('test', { adapter: idbAdapter });
     * var coll = db.addCollection('testColl');
     * coll.insert({test: 'val'});
     * db.saveDatabase();  // could pass callback if needed for async complete
     *
     * @param {string} dbname - the name to give the serialized database within the catalog.
     * @param {string} dbstring - the serialized db string to save.
     * @param {function} callback - (Optional) callback passed obj.success with true or false
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.saveDatabase = function(dbname, dbstring, callback)
    {
      var appName = this.app;
      var adapter = this;

      function saveCallback(result) {
        if (result && result.success === true) {
          callback(null);
        }
        else {
          callback(new Error("Error saving database"));
        }
      }

      // lazy open/create db reference so dont -need- callback in constructor
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          // now that catalog has been initialized, set (add/update) the AKV entry
          cat.setAppKey(appName, dbname, dbstring, saveCallback);
        });

        return;
      }

      // set (add/update) entry to AKV database
      this.catalog.setAppKey(appName, dbname, dbstring, saveCallback);
    };

    // alias
    LokiIndexedAdapter.prototype.saveKey = LokiIndexedAdapter.prototype.saveDatabase;

    /**
     * Deletes a serialized db from the catalog.
     *
     * @example
     * // DELETE DATABASE
     * // delete 'finance'/'test' value from catalog
     * idbAdapter.deleteDatabase('test', function {
     *   // database deleted
     * });
     *
     * @param {string} dbname - the name of the database to delete from the catalog.
     * @param {function=} callback - (Optional) executed on database delete
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.deleteDatabase = function(dbname, callback)
    {
      var appName = this.app;
      var adapter = this;

      // lazy open/create db reference and pass callback ahead
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.deleteDatabase(dbname, callback);
        });

        return;
      }

      // catalog was already initialized, so just lookup object and delete by id
      this.catalog.getAppKey(appName, dbname, function(result) {
        var id = result.id;

        if (id !== 0) {
          adapter.catalog.deleteAppKey(id);
        }

        if (typeof (callback) === 'function') {
          callback();
        }
      });
    };

    // alias
    LokiIndexedAdapter.prototype.deleteKey = LokiIndexedAdapter.prototype.deleteDatabase;

    /**
     * Removes all database partitions and pages with the base filename passed in.
     * This utility method does not (yet) guarantee async deletions will be completed before returning
     *
     * @param {string} dbname - the base filename which container, partitions, or pages are derived
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.deleteDatabasePartitions = function(dbname) {
      var self=this;
      this.getDatabaseList(function(result) {
        result.forEach(function(str) {
          if (str.startsWith(dbname)) {
            self.deleteDatabase(str);
          }
        });
      });
    };

    /**
     * Retrieves object array of catalog entries for current app.
     *
     * @example
     * idbAdapter.getDatabaseList(function(result) {
     *   // result is array of string names for that appcontext ('finance')
     *   result.forEach(function(str) {
     *     console.log(str);
     *   });
     * });
     *
     * @param {function} callback - should accept array of database names in the catalog for current app.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.getDatabaseList = function(callback)
    {
      var appName = this.app;
      var adapter = this;

      // lazy open/create db reference so dont -need- callback in constructor
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.getDatabaseList(callback);
        });

        return;
      }

      // catalog already initialized
      // get all keys for current appName, and transpose results so just string array
      this.catalog.getAppKeys(appName, function(results) {
        var names = [];

        for(var idx = 0; idx < results.length; idx++) {
          names.push(results[idx].key);
        }

        if (typeof (callback) === 'function') {
          callback(names);
        }
        else {
          names.forEach(function(obj) {
            console.log(obj);
          });
        }
      });
    };

    // alias
    LokiIndexedAdapter.prototype.getKeyList = LokiIndexedAdapter.prototype.getDatabaseList;

    /**
     * Allows retrieval of list of all keys in catalog along with size
     *
     * @param {function} callback - (Optional) callback to accept result array.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.getCatalogSummary = function(callback)
    {
      var appName = this.app;
      var adapter = this;

      // lazy open/create db reference
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.getCatalogSummary(callback);
        });

        return;
      }

      // catalog already initialized
      // get all keys for current appName, and transpose results so just string array
      this.catalog.getAllKeys(function(results) {
        var entries = [];
        var obj,
          size,
          oapp,
          okey,
          oval;

        for(var idx = 0; idx < results.length; idx++) {
          obj = results[idx];
          oapp = obj.app || '';
          okey = obj.key || '';
          oval = obj.val || '';

          // app and key are composited into an appkey column so we will mult by 2
          size = oapp.length * 2 + okey.length * 2 + oval.length + 1;

          entries.push({ "app": obj.app, "key": obj.key, "size": size });
        }

        if (typeof (callback) === 'function') {
          callback(entries);
        }
        else {
          entries.forEach(function(obj) {
            console.log(obj);
          });
        }
      });
    };

    /**
     * LokiCatalog - underlying App/Key/Value catalog persistence
     *    This non-interface class implements the actual persistence.
     *    Used by the IndexedAdapter class.
     */
    function LokiCatalog(callback)
    {
      this.db = null;
      this.initializeLokiCatalog(callback);
    }

    LokiCatalog.prototype.initializeLokiCatalog = function(callback) {
      var openRequest = indexedDB.open('LokiCatalog', 1);
      var cat = this;

      // If database doesn't exist yet or its version is lower than our version specified above (2nd param in line above)
      openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
        if (thisDB.objectStoreNames.contains('LokiAKV')) {
          thisDB.deleteObjectStore('LokiAKV');
        }

        if(!thisDB.objectStoreNames.contains('LokiAKV')) {
          var objectStore = thisDB.createObjectStore('LokiAKV', { keyPath: 'id', autoIncrement:true });
          objectStore.createIndex('app', 'app', {unique:false});
          objectStore.createIndex('key', 'key', {unique:false});
          // hack to simulate composite key since overhead is low (main size should be in val field)
          // user (me) required to duplicate the app and key into comma delimited appkey field off object
          // This will allow retrieving single record with that composite key as well as
          // still supporting opening cursors on app or key alone
          objectStore.createIndex('appkey', 'appkey', {unique:true});
        }
      };

      openRequest.onsuccess = function(e) {
        cat.db = e.target.result;

        if (typeof (callback) === 'function') callback(cat);
      };

      openRequest.onerror = function(e) {
        throw e;
      };
    };

    LokiCatalog.prototype.getAppKey = function(app, key, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var index = store.index('appkey');
      var appkey = app + "," + key;
      var request = index.get(appkey);

      request.onsuccess = (function(usercallback) {
        return function(e) {
          var lres = e.target.result;

          if (lres === null || typeof(lres) === 'undefined') {
            lres = {
              id: 0,
              success: false
            };
          }

          if (typeof(usercallback) === 'function') {
            usercallback(lres);
          }
          else {
            console.log(lres);
          }
        };
      })(callback);

      request.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback({ id: 0, success: false });
          }
          else {
            throw e;
          }
        };
      })(callback);
    };

    LokiCatalog.prototype.getAppKeyById = function (id, callback, data) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var request = store.get(id);

      request.onsuccess = (function(data, usercallback){
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback(e.target.result, data);
          }
          else {
            console.log(e.target.result);
          }
        };
      })(data, callback);
    };

    LokiCatalog.prototype.setAppKey = function (app, key, val, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readwrite');
      var store = transaction.objectStore('LokiAKV');
      var index = store.index('appkey');
      var appkey = app + "," + key;
      var request = index.get(appkey);

      // first try to retrieve an existing object by that key
      // need to do this because to update an object you need to have id in object, otherwise it will append id with new autocounter and clash the unique index appkey
      request.onsuccess = function(e) {
        var res = e.target.result;

        if (res === null || res === undefined) {
          res = {
            app:app,
            key:key,
            appkey: app + ',' + key,
            val:val
          };
        }
        else {
          res.val = val;
        }

        var requestPut = store.put(res);

        requestPut.onerror = (function(usercallback) {
          return function(e) {
            if (typeof(usercallback) === 'function') {
              usercallback({ success: false });
            }
            else {
              console.error('LokiCatalog.setAppKey (set) onerror');
              console.error(request.error);
            }
          };

        })(callback);

        requestPut.onsuccess = (function(usercallback) {
          return function(e) {
            if (typeof(usercallback) === 'function') {
              usercallback({ success: true });
            }
          };
        })(callback);
      };

      request.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback({ success: false });
          }
          else {
            console.error('LokiCatalog.setAppKey (get) onerror');
            console.error(request.error);
          }
        };
      })(callback);
    };

    LokiCatalog.prototype.deleteAppKey = function (id, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readwrite');
      var store = transaction.objectStore('LokiAKV');
      var request = store.delete(id);

      request.onsuccess = (function(usercallback) {
        return function(evt) {
          if (typeof(usercallback) === 'function') usercallback({ success: true });
        };
      })(callback);

      request.onerror = (function(usercallback) {
        return function(evt) {
          if (typeof(usercallback) === 'function') {
            usercallback(false);
          }
          else {
            console.error('LokiCatalog.deleteAppKey raised onerror');
            console.error(request.error);
          }
        };
      })(callback);
    };

    LokiCatalog.prototype.getAppKeys = function(app, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var index = store.index('app');

      // We want cursor to all values matching our (single) app param
      var singleKeyRange = IDBKeyRange.only(app);

      // To use one of the key ranges, pass it in as the first argument of openCursor()/openKeyCursor()
      var cursor = index.openCursor(singleKeyRange);

      // cursor internally, pushing results into this.data[] and return
      // this.data[] when done (similar to service)
      var localdata = [];

      cursor.onsuccess = (function(data, callback) {
        return function(e) {
          var cursor = e.target.result;
          if (cursor) {
            var currObject = cursor.value;

            data.push(currObject);

            cursor.continue();
          }
          else {
            if (typeof(callback) === 'function') {
              callback(data);
            }
            else {
              console.log(data);
            }
          }
        };
      })(localdata, callback);

      cursor.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback(null);
          }
          else {
            console.error('LokiCatalog.getAppKeys raised onerror');
            console.error(e);
          }
        };
      })(callback);

    };

    // Hide 'cursoring' and return array of { id: id, key: key }
    LokiCatalog.prototype.getAllKeys = function (callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var cursor = store.openCursor();

      var localdata = [];

      cursor.onsuccess = (function(data, callback) {
        return function(e) {
          var cursor = e.target.result;
          if (cursor) {
            var currObject = cursor.value;

            data.push(currObject);

            cursor.continue();
          }
          else {
            if (typeof(callback) === 'function') {
              callback(data);
            }
            else {
              console.log(data);
            }
          }
        };
      })(localdata, callback);

      cursor.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') usercallback(null);
        };
      })(callback);

    };

    return LokiIndexedAdapter;

  }());
}));


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff";

/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * LokiJS
 * @author Joe Minichino <joe.minichino@gmail.com>
 *
 * A lightweight document oriented javascript database
 */
(function (root, factory) {
  if (true) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.loki = factory();
  }
}(this, function () {

  return (function () {
    'use strict';

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    var Utils = {
      copyProperties: function (src, dest) {
        var prop;
        for (prop in src) {
          dest[prop] = src[prop];
        }
      },
      // used to recursively scan hierarchical transform step object for param substitution
      resolveTransformObject: function (subObj, params, depth) {
        var prop,
          pname;

        if (typeof depth !== 'number') {
          depth = 0;
        }

        if (++depth >= 10) return subObj;

        for (prop in subObj) {
          if (typeof subObj[prop] === 'string' && subObj[prop].indexOf("[%lktxp]") === 0) {
            pname = subObj[prop].substring(8);
            if (params.hasOwnProperty(pname)) {
              subObj[prop] = params[pname];
            }
          } else if (typeof subObj[prop] === "object") {
            subObj[prop] = Utils.resolveTransformObject(subObj[prop], params, depth);
          }
        }

        return subObj;
      },
      // top level utility to resolve an entire (single) transform (array of steps) for parameter substitution
      resolveTransformParams: function (transform, params) {
        var idx,
          clonedStep,
          resolvedTransform = [];

        if (typeof params === 'undefined') return transform;

        // iterate all steps in the transform array
        for (idx = 0; idx < transform.length; idx++) {
          // clone transform so our scan and replace can operate directly on cloned transform
          clonedStep = JSON.parse(JSON.stringify(transform[idx]));
          resolvedTransform.push(Utils.resolveTransformObject(clonedStep, params));
        }

        return resolvedTransform;
      }
    };

    /** Helper function for determining 'less-than' conditions for ops, sorting, and binary indices.
     *     In the future we might want $lt and $gt ops to use their own functionality/helper.
     *     Since binary indices on a property might need to index [12, NaN, new Date(), Infinity], we
     *     need this function (as well as gtHelper) to always ensure one value is LT, GT, or EQ to another.
     */
    function ltHelper(prop1, prop2, equal) {
      var cv1, cv2;

      // 'falsy' and Boolean handling
      if (!prop1 || !prop2 || prop1 === true || prop2 === true) {
        if ((prop1 === true || prop1 === false) && (prop2 === true || prop2 === false)) {
          if (equal) {
            return prop1 === prop2;
          } else {
            if (prop1) {
              return false;
            } else {
              return prop2;
            }
          }
        }

        if (prop2 === undefined || prop2 === null || prop1 === true || prop2 === false) {
          return equal;
        }
        if (prop1 === undefined || prop1 === null || prop1 === false || prop2 === true) {
          return true;
        }
      }

      if (prop1 === prop2) {
        return equal;
      }

      if (prop1 < prop2) {
        return true;
      }

      if (prop1 > prop2) {
        return false;
      }

      // not strict equal nor less than nor gt so must be mixed types, convert to string and use that to compare
      cv1 = prop1.toString();
      cv2 = prop2.toString();

      if (cv1 == cv2) {
        return equal;
      }

      if (cv1 < cv2) {
        return true;
      }

      return false;
    }

    function gtHelper(prop1, prop2, equal) {
      var cv1, cv2;

      // 'falsy' and Boolean handling
      if (!prop1 || !prop2 || prop1 === true || prop2 === true) {
        if ((prop1 === true || prop1 === false) && (prop2 === true || prop2 === false)) {
          if (equal) {
            return prop1 === prop2;
          } else {
            if (prop1) {
              return !prop2;
            } else {
              return false;
            }
          }
        }

        if (prop1 === undefined || prop1 === null || prop1 === false || prop2 === true) {
          return equal;
        }
        if (prop2 === undefined || prop2 === null || prop1 === true || prop2 === false) {
          return true;
        }
      }

      if (prop1 === prop2) {
        return equal;
      }

      if (prop1 > prop2) {
        return true;
      }

      if (prop1 < prop2) {
        return false;
      }

      // not strict equal nor less than nor gt so must be mixed types, convert to string and use that to compare
      cv1 = prop1.toString();
      cv2 = prop2.toString();

      if (cv1 == cv2) {
        return equal;
      }

      if (cv1 > cv2) {
        return true;
      }

      return false;
    }

    function sortHelper(prop1, prop2, desc) {
      if (prop1 === prop2) {
        return 0;
      }

      if (ltHelper(prop1, prop2, false)) {
        return (desc) ? (1) : (-1);
      }

      if (gtHelper(prop1, prop2, false)) {
        return (desc) ? (-1) : (1);
      }

      // not lt, not gt so implied equality-- date compatible
      return 0;
    }

    /**
     * compoundeval() - helper function for compoundsort(), performing individual object comparisons
     *
     * @param {array} properties - array of property names, in order, by which to evaluate sort order
     * @param {object} obj1 - first object to compare
     * @param {object} obj2 - second object to compare
     * @returns {integer} 0, -1, or 1 to designate if identical (sortwise) or which should be first
     */
    function compoundeval(properties, obj1, obj2) {
      var res = 0;
      var prop, field;
      for (var i = 0, len = properties.length; i < len; i++) {
        prop = properties[i];
        field = prop[0];
        res = sortHelper(obj1[field], obj2[field], prop[1]);
        if (res !== 0) {
          return res;
        }
      }
      return 0;
    }

    /**
     * dotSubScan - helper function used for dot notation queries.
     *
     * @param {object} root - object to traverse
     * @param {array} paths - array of properties to drill into
     * @param {function} fun - evaluation function to test with
     * @param {any} value - comparative value to also pass to (compare) fun
     * @param {number} poffset - index of the item in 'paths' to start the sub-scan from
     */
    function dotSubScan(root, paths, fun, value, poffset) {
      var pathOffset = poffset || 0;
      var path = paths[pathOffset];
      if (root === undefined || root === null || !hasOwnProperty.call(root, path)) {
        return false;
      }

      var valueFound = false;
      var element = root[path];
      if (pathOffset + 1 >= paths.length) {
        // if we have already expanded out the dot notation,
        // then just evaluate the test function and value on the element
        valueFound = fun(element, value);
      } else if (Array.isArray(element)) {
        for (var index = 0, len = element.length; index < len; index += 1) {
          valueFound = dotSubScan(element[index], paths, fun, value, pathOffset + 1);
          if (valueFound === true) {
            break;
          }
        }
      } else {
        valueFound = dotSubScan(element, paths, fun, value, pathOffset + 1);
      }

      return valueFound;
    }

    function containsCheckFn(a) {
      if (typeof a === 'string' || Array.isArray(a)) {
        return function (b) {
          return a.indexOf(b) !== -1;
        };
      } else if (typeof a === 'object' && a !== null) {
        return function (b) {
          return hasOwnProperty.call(a, b);
        };
      }
      return null;
    }

    function doQueryOp(val, op) {
      for (var p in op) {
        if (hasOwnProperty.call(op, p)) {
          return LokiOps[p](val, op[p]);
        }
      }
      return false;
    }

    var LokiOps = {
      // comparison operators
      // a is the value in the collection
      // b is the query value
      $eq: function (a, b) {
        return a === b;
      },

      // abstract/loose equality
      $aeq: function (a, b) {
        return a == b;
      },

      $ne: function (a, b) {
        // ecma 5 safe test for NaN
        if (b !== b) {
          // ecma 5 test value is not NaN
          return (a === a);
        }

        return a !== b;
      },

      $dteq: function (a, b) {
        if (ltHelper(a, b, false)) {
          return false;
        }
        return !gtHelper(a, b, false);
      },

      $gt: function (a, b) {
        return gtHelper(a, b, false);
      },

      $gte: function (a, b) {
        return gtHelper(a, b, true);
      },

      $lt: function (a, b) {
        return ltHelper(a, b, false);
      },

      $lte: function (a, b) {
        return ltHelper(a, b, true);
      },

      // ex : coll.find({'orderCount': {$between: [10, 50]}});
      $between: function (a, vals) {
        if (a === undefined || a === null) return false;
        return (gtHelper(a, vals[0], true) && ltHelper(a, vals[1], true));
      },

      $in: function (a, b) {
        return b.indexOf(a) !== -1;
      },

      $nin: function (a, b) {
        return b.indexOf(a) === -1;
      },

      $keyin: function (a, b) {
        return a in b;
      },

      $nkeyin: function (a, b) {
        return !(a in b);
      },

      $definedin: function (a, b) {
        return b[a] !== undefined;
      },

      $undefinedin: function (a, b) {
        return b[a] === undefined;
      },

      $regex: function (a, b) {
        return b.test(a);
      },

      $containsString: function (a, b) {
        return (typeof a === 'string') && (a.indexOf(b) !== -1);
      },

      $containsNone: function (a, b) {
        return !LokiOps.$containsAny(a, b);
      },

      $containsAny: function (a, b) {
        var checkFn = containsCheckFn(a);
        if (checkFn !== null) {
          return (Array.isArray(b)) ? (b.some(checkFn)) : (checkFn(b));
        }
        return false;
      },

      $contains: function (a, b) {
        var checkFn = containsCheckFn(a);
        if (checkFn !== null) {
          return (Array.isArray(b)) ? (b.every(checkFn)) : (checkFn(b));
        }
        return false;
      },

      $type: function (a, b) {
        var type = typeof a;
        if (type === 'object') {
          if (Array.isArray(a)) {
            type = 'array';
          } else if (a instanceof Date) {
            type = 'date';
          }
        }
        return (typeof b !== 'object') ? (type === b) : doQueryOp(type, b);
      },

      $size: function (a, b) {
        if (Array.isArray(a)) {
          return (typeof b !== 'object') ? (a.length === b) : doQueryOp(a.length, b);
        }
        return false;
      },

      $len: function (a, b) {
        if (typeof a === 'string') {
          return (typeof b !== 'object') ? (a.length === b) : doQueryOp(a.length, b);
        }
        return false;
      },

      $where: function (a, b) {
        return b(a) === true;
      },

      // field-level logical operators
      // a is the value in the collection
      // b is the nested query operation (for '$not')
      //   or an array of nested query operations (for '$and' and '$or')
      $not: function (a, b) {
        return !doQueryOp(a, b);
      },

      $and: function (a, b) {
        for (var idx = 0, len = b.length; idx < len; idx += 1) {
          if (!doQueryOp(a, b[idx])) {
            return false;
          }
        }
        return true;
      },

      $or: function (a, b) {
        for (var idx = 0, len = b.length; idx < len; idx += 1) {
          if (doQueryOp(a, b[idx])) {
            return true;
          }
        }
        return false;
      }
    };

    // making indexing opt-in... our range function knows how to deal with these ops :
    var indexedOpsList = ['$eq', '$aeq', '$dteq', '$gt', '$gte', '$lt', '$lte', '$in', '$between'];

    function clone(data, method) {
      var cloneMethod = method || 'parse-stringify',
        cloned;

      switch (cloneMethod) {
      case "parse-stringify":
        cloned = JSON.parse(JSON.stringify(data));
        break;
      case "jquery-extend-deep":
        cloned = jQuery.extend(true, {}, data);
        break;
      case "shallow":
        cloned = Object.create(data.prototype || null);
        Object.keys(data).map(function (i) {
          cloned[i] = data[i];
        });
        break;
      default:
        break;
      }

      return cloned;
    }

    function cloneObjectArray(objarray, method) {
      var i,
        result = [];

      if (method == "parse-stringify") {
        return clone(objarray, method);
      }

      i = objarray.length - 1;

      for (; i <= 0; i--) {
        result.push(clone(objarray[i], method));
      }

      return result;
    }

    function localStorageAvailable() {
      try {
        return (window && window.localStorage !== undefined && window.localStorage !== null);
      } catch (e) {
        return false;
      }
    }


    /**
     * LokiEventEmitter is a minimalist version of EventEmitter. It enables any
     * constructor that inherits EventEmitter to emit events and trigger
     * listeners that have been added to the event through the on(event, callback) method
     *
     * @constructor LokiEventEmitter
     */
    function LokiEventEmitter() {}

    /**
     * @prop {hashmap} events - a hashmap, with each property being an array of callbacks
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.events = {};

    /**
     * @prop {boolean} asyncListeners - boolean determines whether or not the callbacks associated with each event
     * should happen in an async fashion or not
     * Default is false, which means events are synchronous
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.asyncListeners = false;

    /**
     * on(eventName, listener) - adds a listener to the queue of callbacks associated to an event
     * @param {string|string[]} eventName - the name(s) of the event(s) to listen to
     * @param {function} listener - callback function of listener to attach
     * @returns {int} the index of the callback in the array of listeners for a particular event
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.on = function (eventName, listener) {
      var event;
      var self = this;

      if (Array.isArray(eventName)) {
        eventName.forEach(function(currentEventName) {
          self.on(currentEventName, listener);
        });
        return listener;
      }

      event = this.events[eventName];
      if (!event) {
        event = this.events[eventName] = [];
      }
      event.push(listener);
      return listener;
    };

    /**
     * emit(eventName, data) - emits a particular event
     * with the option of passing optional parameters which are going to be processed by the callback
     * provided signatures match (i.e. if passing emit(event, arg0, arg1) the listener should take two parameters)
     * @param {string} eventName - the name of the event
     * @param {object=} data - optional object passed with the event
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.emit = function (eventName, data) {
      var self = this;
      if (eventName && this.events[eventName]) {
        this.events[eventName].forEach(function (listener) {
          if (self.asyncListeners) {
            setTimeout(function () {
              listener(data);
            }, 1);
          } else {
            listener(data);
          }

        });
      } else {
        throw new Error('No event ' + eventName + ' defined');
      }
    };

    /**
     * Alias of LokiEventEmitter.prototype.on
     * addListener(eventName, listener) - adds a listener to the queue of callbacks associated to an event
     * @param {string|string[]} eventName - the name(s) of the event(s) to listen to
     * @param {function} listener - callback function of listener to attach
     * @returns {int} the index of the callback in the array of listeners for a particular event
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.addListener = LokiEventEmitter.prototype.on;

    /**
     * removeListener() - removes the listener at position 'index' from the event 'eventName'
     * @param {string|string[]} eventName - the name(s) of the event(s) which the listener is attached to
     * @param {function} listener - the listener callback function to remove from emitter
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.removeListener = function (eventName, listener) {
      var self = this;
      if (Array.isArray(eventName)) {
        eventName.forEach(function(currentEventName) {
          self.removeListener(currentEventName, listen);
        });
      }

      if (this.events[eventName]) {
        var listeners = this.events[eventName];
        listeners.splice(listeners.indexOf(listener), 1);
      }
    };

    /**
     * Loki: The main database class
     * @constructor Loki
     * @implements LokiEventEmitter
     * @param {string} filename - name of the file to be saved to
     * @param {object=} options - (Optional) config options object
     * @param {string} options.env - override environment detection as 'NODEJS', 'BROWSER', 'CORDOVA'
     * @param {boolean} options.verbose - enable console output (default is 'false')
     * @param {boolean} options.autosave - enables autosave
     * @param {int} options.autosaveInterval - time interval (in milliseconds) between saves (if dirty)
     * @param {boolean} options.autoload - enables autoload on loki instantiation
     * @param {function} options.autoloadCallback - user callback called after database load
     * @param {adapter} options.adapter - an instance of a loki persistence adapter
     * @param {string} options.serializationMethod - ['normal', 'pretty', 'destructured']
     * @param {string} options.destructureDelimiter - string delimiter used for destructured serialization
     */
    function Loki(filename, options) {
      this.filename = filename || 'loki.db';
      this.collections = [];

      // persist version of code which created the database to the database.
      // could use for upgrade scenarios
      this.databaseVersion = 1.1;
      this.engineVersion = 1.1;

      // autosave support (disabled by default)
      // pass autosave: true, autosaveInterval: 6000 in options to set 6 second autosave
      this.autosave = false;
      this.autosaveInterval = 5000;
      this.autosaveHandle = null;

      this.options = {};

      // currently keeping persistenceMethod and persistenceAdapter as loki level properties that
      // will not or cannot be deserialized.  You are required to configure persistence every time
      // you instantiate a loki object (or use default environment detection) in order to load the database anyways.

      // persistenceMethod could be 'fs', 'localStorage', or 'adapter'
      // this is optional option param, otherwise environment detection will be used
      // if user passes their own adapter we will force this method to 'adapter' later, so no need to pass method option.
      this.persistenceMethod = null;

      // retain reference to optional (non-serializable) persistenceAdapter 'instance'
      this.persistenceAdapter = null;

      // enable console output if verbose flag is set (disabled by default)
      this.verbose = options && options.hasOwnProperty('verbose') ? options.verbose : false;

      this.events = {
        'init': [],
        'loaded': [],
        'flushChanges': [],
        'close': [],
        'changes': [],
        'warning': []
      };

      var getENV = function () {
        // if (typeof global !== 'undefined' && (global.android || global.NSObject)) {
        //   //If no adapter is set use the default nativescript adapter
        //   if (!options.adapter) {
        //     var LokiNativescriptAdapter = require('./loki-nativescript-adapter');
        //     options.adapter=new LokiNativescriptAdapter();
        //   }
        //   return 'NATIVESCRIPT'; //nativescript
        // }

        if (typeof window === 'undefined') {
          return 'NODEJS';
        }

        if (typeof global !== 'undefined' && global.window) {
          return 'NODEJS'; //node-webkit
        }

        if (typeof document !== 'undefined') {
          if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
            return 'CORDOVA';
          }
          return 'BROWSER';
        }
        return 'CORDOVA';
      };

      // refactored environment detection due to invalid detection for browser environments.
      // if they do not specify an options.env we want to detect env rather than default to nodejs.
      // currently keeping two properties for similar thing (options.env and options.persistenceMethod)
      //   might want to review whether we can consolidate.
      if (options && options.hasOwnProperty('env')) {
        this.ENV = options.env;
      } else {
        this.ENV = getENV();
      }

      // not sure if this is necessary now that i have refactored the line above
      if (this.ENV === 'undefined') {
        this.ENV = 'NODEJS';
      }

      //if (typeof (options) !== 'undefined') {
      this.configureOptions(options, true);
      //}

      this.on('init', this.clearChanges);

    }

    // db class is an EventEmitter
    Loki.prototype = new LokiEventEmitter();
    Loki.prototype.constructor = Loki;

    // experimental support for browserify's abstract syntax scan to pick up dependency of indexed adapter.
    // Hopefully, once this hits npm a browserify require of lokijs should scan the main file and detect this indexed adapter reference.
    Loki.prototype.getIndexedAdapter = function () {
      var adapter;

      if (true) {
        adapter = __webpack_require__(179);
      }

      return adapter;
    };


    /**
     * Allows reconfiguring database options
     *
     * @param {object} options - configuration options to apply to loki db object
     * @param {string} options.env - override environment detection as 'NODEJS', 'BROWSER', 'CORDOVA'
     * @param {boolean} options.verbose - enable console output (default is 'false')
     * @param {boolean} options.autosave - enables autosave
     * @param {int} options.autosaveInterval - time interval (in milliseconds) between saves (if dirty)
     * @param {boolean} options.autoload - enables autoload on loki instantiation
     * @param {function} options.autoloadCallback - user callback called after database load
     * @param {adapter} options.adapter - an instance of a loki persistence adapter
     * @param {string} options.serializationMethod - ['normal', 'pretty', 'destructured']
     * @param {string} options.destructureDelimiter - string delimiter used for destructured serialization
     * @param {boolean} initialConfig - (internal) true is passed when loki ctor is invoking
     * @memberof Loki
     */
    Loki.prototype.configureOptions = function (options, initialConfig) {
      var defaultPersistence = {
          'NODEJS': 'fs',
          'BROWSER': 'localStorage',
          'CORDOVA': 'localStorage'
        },
        persistenceMethods = {
          'fs': LokiFsAdapter,
          'localStorage': LokiLocalStorageAdapter
        };

      this.options = {};

      this.persistenceMethod = null;
      // retain reference to optional persistence adapter 'instance'
      // currently keeping outside options because it can't be serialized
      this.persistenceAdapter = null;

      // process the options
      if (typeof (options) !== 'undefined') {
        this.options = options;

        if (this.options.hasOwnProperty('persistenceMethod')) {
          // check if the specified persistence method is known
          if (typeof (persistenceMethods[options.persistenceMethod]) == 'function') {
            this.persistenceMethod = options.persistenceMethod;
            this.persistenceAdapter = new persistenceMethods[options.persistenceMethod]();
          }
          // should be throw an error here, or just fall back to defaults ??
        }

        // if user passes adapter, set persistence mode to adapter and retain persistence adapter instance
        if (this.options.hasOwnProperty('adapter')) {
          this.persistenceMethod = 'adapter';
          this.persistenceAdapter = options.adapter;
          this.options.adapter = null;
        }


        // if they want to load database on loki instantiation, now is a good time to load... after adapter set and before possible autosave initiation
        if (options.autoload && initialConfig) {
          // for autoload, let the constructor complete before firing callback
          var self = this;
          setTimeout(function () {
            self.loadDatabase(options, options.autoloadCallback);
          }, 1);
        }

        if (this.options.hasOwnProperty('autosaveInterval')) {
          this.autosaveDisable();
          this.autosaveInterval = parseInt(this.options.autosaveInterval, 10);
        }

        if (this.options.hasOwnProperty('autosave') && this.options.autosave) {
          this.autosaveDisable();
          this.autosave = true;

          if (this.options.hasOwnProperty('autosaveCallback')) {
            this.autosaveEnable(options, options.autosaveCallback);
          } else {
            this.autosaveEnable();
          }
        }
      } // end of options processing

      // ensure defaults exists for options which were not set
      if (!this.options.hasOwnProperty('serializationMethod')) {
        this.options.serializationMethod = 'normal';
      }

      // ensure passed or default option exists
      if (!this.options.hasOwnProperty('destructureDelimiter')) {
        this.options.destructureDelimiter = '$<\n';
      }

      // if by now there is no adapter specified by user nor derived from persistenceMethod: use sensible defaults
      if (this.persistenceAdapter === null) {
        this.persistenceMethod = defaultPersistence[this.ENV];
        if (this.persistenceMethod) {
          this.persistenceAdapter = new persistenceMethods[this.persistenceMethod]();
        }
      }

    };

    /**
     * Copies 'this' database into a new Loki instance. Object references are shared to make lightweight.
     *
     * @param {object} options - apply or override collection level settings
     * @param {bool} options.removeNonSerializable - nulls properties not safe for serialization.
     * @memberof Loki
     */
    Loki.prototype.copy = function(options) {
      var databaseCopy = new Loki(this.filename);
      var clen, idx;

      options = options || {};

      // currently inverting and letting loadJSONObject do most of the work
      databaseCopy.loadJSONObject(this, { retainDirtyFlags: true });

      // since our JSON serializeReplacer is not invoked for reference database adapters, this will let us mimic
      if(options.hasOwnProperty("removeNonSerializable") && options.removeNonSerializable === true) {
        databaseCopy.autosaveHandle = null;
        databaseCopy.persistenceAdapter = null;

        clen = databaseCopy.collections.length;
        for (idx=0; idx<clen; idx++) {
          databaseCopy.collections[idx].constraints = null;
          databaseCopy.collections[idx].ttl = null;
        }
      }
      
      return databaseCopy;
    };

    /**
     * Shorthand method for quickly creating and populating an anonymous collection.
     *    This collection is not referenced internally so upon losing scope it will be garbage collected.
     *
     * @example
     * var results = new loki().anonym(myDocArray).find({'age': {'$gt': 30} });
     *
     * @param {Array} docs - document array to initialize the anonymous collection with
     * @param {object} options - configuration object, see {@link Loki#addCollection} options
     * @returns {Collection} New collection which you can query or chain
     * @memberof Loki
     */
    Loki.prototype.anonym = function (docs, options) {
      var collection = new Collection('anonym', options);
      collection.insert(docs);

      if (this.verbose)
        collection.console = console;

      return collection;
    };

    /**
     * Adds a collection to the database.
     * @param {string} name - name of collection to add
     * @param {object=} options - (optional) options to configure collection with.
     * @param {array} options.unique - array of property names to define unique constraints for
     * @param {array} options.exact - array of property names to define exact constraints for
     * @param {array} options.indices - array property names to define binary indexes for
     * @param {boolean} options.asyncListeners - default is false
     * @param {boolean} options.disableChangesApi - default is true
     * @param {boolean} options.autoupdate - use Object.observe to update objects automatically (default: false)
     * @param {boolean} options.clone - specify whether inserts and queries clone to/from user
     * @param {string} options.cloneMethod - 'parse-stringify' (default), 'jquery-extend-deep', 'shallow'
     * @param {int} options.ttlInterval - time interval for clearing out 'aged' documents; not set by default.
     * @returns {Collection} a reference to the collection which was just added
     * @memberof Loki
     */
    Loki.prototype.addCollection = function (name, options) {
      var collection = new Collection(name, options);
      this.collections.push(collection);

      if (this.verbose)
        collection.console = console;

      return collection;
    };

    Loki.prototype.loadCollection = function (collection) {
      if (!collection.name) {
        throw new Error('Collection must have a name property to be loaded');
      }
      this.collections.push(collection);
    };

    /**
     * Retrieves reference to a collection by name.
     * @param {string} collectionName - name of collection to look up
     * @returns {Collection} Reference to collection in database by that name, or null if not found
     * @memberof Loki
     */
    Loki.prototype.getCollection = function (collectionName) {
      var i,
        len = this.collections.length;

      for (i = 0; i < len; i += 1) {
        if (this.collections[i].name === collectionName) {
          return this.collections[i];
        }
      }

      // no such collection
      this.emit('warning', 'collection ' + collectionName + ' not found');
      return null;
    };

    Loki.prototype.listCollections = function () {

      var i = this.collections.length,
        colls = [];

      while (i--) {
        colls.push({
          name: this.collections[i].name,
          type: this.collections[i].objType,
          count: this.collections[i].data.length
        });
      }
      return colls;
    };

    /**
     * Removes a collection from the database.
     * @param {string} collectionName - name of collection to remove
     * @memberof Loki
     */
    Loki.prototype.removeCollection = function (collectionName) {
      var i,
        len = this.collections.length;

      for (i = 0; i < len; i += 1) {
        if (this.collections[i].name === collectionName) {
          var tmpcol = new Collection(collectionName, {});
          var curcol = this.collections[i];
          for (var prop in curcol) {
            if (curcol.hasOwnProperty(prop) && tmpcol.hasOwnProperty(prop)) {
              curcol[prop] = tmpcol[prop];
            }
          }
          this.collections.splice(i, 1);
          return;
        }
      }
    };

    Loki.prototype.getName = function () {
      return this.name;
    };

    /**
     * serializeReplacer - used to prevent certain properties from being serialized
     *
     */
    Loki.prototype.serializeReplacer = function (key, value) {
      switch (key) {
      case 'autosaveHandle':
      case 'persistenceAdapter':
      case 'constraints':
      case 'ttl':
        return null;
      default:
        return value;
      }
    };

    /**
     * Serialize database to a string which can be loaded via {@link Loki#loadJSON}
     *
     * @returns {string} Stringified representation of the loki database.
     * @memberof Loki
     */
    Loki.prototype.serialize = function (options) {
      options = options || {};

      if (!options.hasOwnProperty("serializationMethod")) {
        options.serializationMethod = this.options.serializationMethod;
      }

      switch(options.serializationMethod) {
        case "normal": return JSON.stringify(this, this.serializeReplacer);
        case "pretty": return JSON.stringify(this, this.serializeReplacer, 2);
        case "destructured": return this.serializeDestructured(); // use default options
        default: return JSON.stringify(this, this.serializeReplacer);
      }
    };

    // alias of serialize
    Loki.prototype.toJson = Loki.prototype.serialize;

    /**
     * Destructured JSON serialization routine to allow alternate serialization methods.
     * Internally, Loki supports destructuring via loki "serializationMethod' option and 
     * the optional LokiPartitioningAdapter class. It is also available if you wish to do 
     * your own structured persistence or data exchange.
     *
     * @param {object=} options - output format options for use externally to loki
     * @param {bool=} options.partitioned - (default: false) whether db and each collection are separate
     * @param {int=} options.partition - can be used to only output an individual collection or db (-1)
     * @param {bool=} options.delimited - (default: true) whether subitems are delimited or subarrays
     * @param {string=} options.delimiter - override default delimiter
     *
     * @returns {string|array} A custom, restructured aggregation of independent serializations.
     * @memberof Loki
     */
    Loki.prototype.serializeDestructured = function(options) {
      var idx, sidx, result, resultlen;
      var reconstruct = [];
      var dbcopy;

      options = options || {};

      if (!options.hasOwnProperty("partitioned")) {
        options.partitioned = false;
      }

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("delimiter")) {
        options.delimiter = this.options.destructureDelimiter;
      }

      // 'partitioned' along with 'partition' of 0 or greater is a request for single collection serialization
      if (options.partitioned === true && options.hasOwnProperty("partition") && options.partition >= 0) {
        return this.serializeCollection({
          delimited: options.delimited,
          delimiter: options.delimiter,
          collectionIndex: options.partition
        });
      }

      // not just an individual collection, so we will need to serialize db container via shallow copy
      dbcopy = new Loki(this.filename);
      dbcopy.loadJSONObject(this);

      for(idx=0; idx < dbcopy.collections.length; idx++) {
        dbcopy.collections[idx].data = [];
      }

      // if we -only- wanted the db container portion, return it now
      if (options.partitioned === true && options.partition === -1) {
        // since we are deconstructing, override serializationMethod to normal for here
        return dbcopy.serialize({
          serializationMethod: "normal"
        });
      }

      // at this point we must be deconstructing the entire database
      // start by pushing db serialization into first array element
      reconstruct.push(dbcopy.serialize({
          serializationMethod: "normal"
      }));

      dbcopy = null;

      // push collection data into subsequent elements
      for(idx=0; idx < this.collections.length; idx++) {
        result = this.serializeCollection({
          delimited: options.delimited,
          delimiter: options.delimiter,
          collectionIndex: idx
        });

        // NDA : Non-Delimited Array : one iterable concatenated array with empty string collection partitions
        if (options.partitioned === false && options.delimited === false) {
          if (!Array.isArray(result)) {
            throw new Error("a nondelimited, non partitioned collection serialization did not return an expected array");
          }

          // Array.concat would probably duplicate memory overhead for copying strings.
          // Instead copy each individually, and clear old value after each copy.
          // Hopefully this will allow g.c. to reduce memory pressure, if needed.
          resultlen = result.length;

          for (sidx=0; sidx < resultlen; sidx++) {
            reconstruct.push(result[sidx]);
            result[sidx] = null;
          }

          reconstruct.push("");
        }
        else {
          reconstruct.push(result);
        }
      }

      // Reconstruct / present results according to four combinations : D, DA, NDA, NDAA
      if (options.partitioned) {
        // DA : Delimited Array of strings [0] db [1] collection [n] collection { partitioned: true, delimited: true }
        // useful for simple future adaptations of existing persistence adapters to save collections separately
        if (options.delimited) {
          return reconstruct;
        }
        // NDAA : Non-Delimited Array with subArrays. db at [0] and collection subarrays at [n] { partitioned: true, delimited : false }
        // This format might be the most versatile for 'rolling your own' partitioned sync or save.
        // Memory overhead can be reduced by specifying a specific partition, but at this code path they did not, so its all.
        else {
          return reconstruct;
        }
      }
      else {
        // D : one big Delimited string { partitioned: false, delimited : true }
        // This is the method Loki will use internally if 'destructured'.
        // Little memory overhead improvements but does not require multiple asynchronous adapter call scheduling
        if (options.delimited) {
          // indicate no more collections
          reconstruct.push("");

          return reconstruct.join(options.delimiter);
        }
        // NDA : Non-Delimited Array : one iterable array with empty string collection partitions { partitioned: false, delimited: false }
        // This format might be best candidate for custom synchronous syncs or saves
        else {
          // indicate no more collections
          reconstruct.push("");

          return reconstruct;
        }
      }

      reconstruct.push("");

      return reconstruct.join(delim);
    };

    /**
     * Utility method to serialize a collection in a 'destructured' format
     *
     * @param {object} options - used to determine output of method
     * @param {int=} options.delimited - whether to return single delimited string or an array
     * @param {string=} options.delimiter - (optional) if delimited, this is delimiter to use
     * @param {int} options.collectionIndex -  specify which collection to serialize data for
     *
     * @returns {string|array} A custom, restructured aggregation of independent serializations for a single collection.
     * @memberof Loki
     */
    Loki.prototype.serializeCollection = function(options) {
      var doccount,
        docidx,
        resultlines = [];

      options = options || {};

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("collectionIndex")) {
        throw new Error("serializeCollection called without 'collectionIndex' option");
      }

      doccount = this.collections[options.collectionIndex].data.length;

      resultlines = [];

      for(docidx=0; docidx<doccount; docidx++) {
        resultlines.push(JSON.stringify(this.collections[options.collectionIndex].data[docidx]));
      }

      // D and DA
      if (options.delimited) {
         // indicate no more documents in collection (via empty delimited string)
        resultlines.push("");

        return resultlines.join(options.delimiter);
      }
      else {
        // NDAA and NDA
        return resultlines;
      }
    };

    /**
     * Destructured JSON deserialization routine to minimize memory overhead.
     * Internally, Loki supports destructuring via loki "serializationMethod' option and 
     * the optional LokiPartitioningAdapter class. It is also available if you wish to do 
     * your own structured persistence or data exchange.
     *
     * @param {string|array} destructuredSource - destructured json or array to deserialize from
     * @param {object=} options - source format options
     * @param {bool=} options.partitioned - (default: false) whether db and each collection are separate
     * @param {int=} options.partition - can be used to deserialize only a single partition
     * @param {bool=} options.delimited - (default: true) whether subitems are delimited or subarrays
     * @param {string=} options.delimiter - override default delimiter
     *
     * @returns {object|array} An object representation of the deserialized database, not yet applied to 'this' db or document array
     * @memberof Loki
     */
    Loki.prototype.deserializeDestructured = function(destructuredSource, options) {
      var workarray=[];
      var len, cdb;
      var idx, collIndex=0, collCount, lineIndex=1, done=false;
      var currLine, currObject;

      options = options || {};

      if (!options.hasOwnProperty("partitioned")) {
        options.partitioned = false;
      }

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("delimiter")) {
        options.delimiter = this.options.destructureDelimiter;
      }

      // Partitioned
      // DA : Delimited Array of strings [0] db [1] collection [n] collection { partitioned: true, delimited: true }
      // NDAA : Non-Delimited Array with subArrays. db at [0] and collection subarrays at [n] { partitioned: true, delimited : false }
      // -or- single partition
      if (options.partitioned) {
        // handle single partition
        if (options.hasOwnProperty('partition')) {
          // db only
          if (options.partition === -1) {
            cdb = JSON.parse(destructuredSource[0]);

            return cdb;
          }

          // single collection, return doc array
          return this.deserializeCollection(destructuredSource[options.partition+1], options);
        }

        // Otherwise we are restoring an entire partitioned db
        cdb = JSON.parse(destructuredSource[0]);
        collCount = cdb.collections.length;
        for(collIndex=0; collIndex<collCount; collIndex++) {
          // attach each collection docarray to container collection data, add 1 to collection array index since db is at 0
          cdb.collections[collIndex].data = this.deserializeCollection(destructuredSource[collIndex+1], options);
        }

        return cdb;
      }

      // Non-Partitioned
      // D : one big Delimited string { partitioned: false, delimited : true }
      // NDA : Non-Delimited Array : one iterable array with empty string collection partitions { partitioned: false, delimited: false }

      // D
      if (options.delimited) {
        workarray = destructuredSource.split(options.delimiter);
        destructuredSource = null; // lower memory pressure
        len = workarray.length;

        if (len === 0) {
          return null;
        }
      }
      // NDA
      else {
        workarray = destructuredSource;
      }

      // first line is database and collection shells
      cdb = JSON.parse(workarray[0]);
      collCount = cdb.collections.length;
      workarray[0] = null;

      while (!done) {
        currLine = workarray[lineIndex];

        // empty string indicates either end of collection or end of file
        if (workarray[lineIndex] === "") {
          // if no more collections to load into, we are done
          if (++collIndex > collCount) {
            done = true;
          }
        }
        else {
          currObject = JSON.parse(workarray[lineIndex]);
          cdb.collections[collIndex].data.push(currObject);
        }

        // lower memory pressure and advance iterator
        workarray[lineIndex++] = null;
      }

      return cdb;
    };

    /**
     * Deserializes a destructured collection.
     *
     * @param {string|array} destructuredSource - destructured representation of collection to inflate
     * @param {object} options - used to describe format of destructuredSource input
     * @param {int} options.delimited - whether source is delimited string or an array
     * @param {string} options.delimiter - (optional) if delimited, this is delimiter to use
     *
     * @returns {array} an array of documents to attach to collection.data.
     * @memberof Loki
     */
    Loki.prototype.deserializeCollection = function(destructuredSource, options) {
      var workarray=[];
      var idx, len;

      options = options || {};

      if (!options.hasOwnProperty("partitioned")) {
        options.partitioned = false;
      }

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("delimiter")) {
        options.delimiter = this.options.destructureDelimiter;
      }

      if (options.delimited) {
        workarray = destructuredSource.split(options.delimiter);
        workarray.pop();
      }
      else {
        workarray = destructuredSource;
      }

      len = workarray.length;
      for (idx=0; idx < len; idx++) {
        workarray[idx] = JSON.parse(workarray[idx]);
      }

      return workarray;
    };

    /**
     * Inflates a loki database from a serialized JSON string
     *
     * @param {string} serializedDb - a serialized loki database string
     * @param {object} options - apply or override collection level settings
     * @memberof Loki
     */
    Loki.prototype.loadJSON = function (serializedDb, options) {
      var dbObject;
      if (serializedDb.length === 0) {
        dbObject = {};
      } else {
        // using option defined in instantiated db not what was in serialized db
        switch (this.options.serializationMethod) {
          case "normal":
          case "pretty": dbObject = JSON.parse(serializedDb); break;
          case "destructured": dbObject = this.deserializeDestructured(serializedDb); break;
          default:  dbObject = JSON.parse(serializedDb); break;
        }
      }

      this.loadJSONObject(dbObject, options);
    };

    /**
     * Inflates a loki database from a JS object
     *
     * @param {object} dbObject - a serialized loki database string
     * @param {object} options - apply or override collection level settings
     * @param {bool?} options.retainDirtyFlags - whether collection dirty flags will be preserved
     * @memberof Loki
     */
    Loki.prototype.loadJSONObject = function (dbObject, options) {
      var i = 0,
        len = dbObject.collections ? dbObject.collections.length : 0,
        coll,
        copyColl,
        clen,
        j,
        loader,
        collObj;

      this.name = dbObject.name;

      // restore database version
      this.databaseVersion = 1.0;
      if (dbObject.hasOwnProperty('databaseVersion')) {
        this.databaseVersion = dbObject.databaseVersion;
      }

      this.collections = [];

      function makeLoader(coll) {
        var collOptions = options[coll.name];
        var inflater;

        if(collOptions.proto) {
          inflater = collOptions.inflate || Utils.copyProperties;

          return function(data) {
            var collObj = new(collOptions.proto)();
            inflater(data, collObj);
            return collObj;
          };
        }

        return collOptions.inflate;
      }

      for (i; i < len; i += 1) {
        coll = dbObject.collections[i];
        copyColl = this.addCollection(coll.name);

        copyColl.adaptiveBinaryIndices = coll.hasOwnProperty('adaptiveBinaryIndices')?(coll.adaptiveBinaryIndices === true): false;
        copyColl.transactional = coll.transactional;
        copyColl.asyncListeners = coll.asyncListeners;
        copyColl.disableChangesApi = coll.disableChangesApi;
        copyColl.cloneObjects = coll.cloneObjects;
        copyColl.cloneMethod = coll.cloneMethod || "parse-stringify";
        copyColl.autoupdate = coll.autoupdate;
        copyColl.changes = coll.changes;

        if (options && options.retainDirtyFlags === true) {
          copyColl.dirty = coll.dirty;
        }
        else {
          copyColl.dirty = false;
        }

        // load each element individually
        clen = coll.data.length;
        j = 0;
        if (options && options.hasOwnProperty(coll.name)) {
          loader = makeLoader(coll);

          for (j; j < clen; j++) {
            collObj = loader(coll.data[j]);
            copyColl.data[j] = collObj;
            copyColl.addAutoUpdateObserver(collObj);
          }
        } else {

          for (j; j < clen; j++) {
            copyColl.data[j] = coll.data[j];
            copyColl.addAutoUpdateObserver(copyColl.data[j]);
          }
        }

        copyColl.maxId = (coll.data.length === 0) ? 0 : coll.maxId;
        copyColl.idIndex = coll.idIndex;
        if (typeof (coll.binaryIndices) !== 'undefined') {
          copyColl.binaryIndices = coll.binaryIndices;
        }
        if (typeof coll.transforms !== 'undefined') {
          copyColl.transforms = coll.transforms;
        }

        copyColl.ensureId();

        // regenerate unique indexes
        copyColl.uniqueNames = [];
        if (coll.hasOwnProperty("uniqueNames")) {
          copyColl.uniqueNames = coll.uniqueNames;
          for (j = 0; j < copyColl.uniqueNames.length; j++) {
            copyColl.ensureUniqueIndex(copyColl.uniqueNames[j]);
          }
        }

        // in case they are loading a database created before we added dynamic views, handle undefined
        if (typeof (coll.DynamicViews) === 'undefined') continue;

        // reinflate DynamicViews and attached Resultsets
        for (var idx = 0; idx < coll.DynamicViews.length; idx++) {
          var colldv = coll.DynamicViews[idx];

          var dv = copyColl.addDynamicView(colldv.name, colldv.options);
          dv.resultdata = colldv.resultdata;
          dv.resultsdirty = colldv.resultsdirty;
          dv.filterPipeline = colldv.filterPipeline;

          dv.sortCriteria = colldv.sortCriteria;
          dv.sortFunction = null;

          dv.sortDirty = colldv.sortDirty;
          dv.resultset.filteredrows = colldv.resultset.filteredrows;
          dv.resultset.searchIsChained = colldv.resultset.searchIsChained;
          dv.resultset.filterInitialized = colldv.resultset.filterInitialized;

          dv.rematerialize({
            removeWhereFilters: true
          });
        }
      }
    };

    /**
     * Emits the close event. In autosave scenarios, if the database is dirty, this will save and disable timer.
     * Does not actually destroy the db.
     *
     * @param {function=} callback - (Optional) if supplied will be registered with close event before emitting.
     * @memberof Loki
     */
    Loki.prototype.close = function (callback) {
      // for autosave scenarios, we will let close perform final save (if dirty)
      // For web use, you might call from window.onbeforeunload to shutdown database, saving pending changes
      if (this.autosave) {
        this.autosaveDisable();
        if (this.autosaveDirty()) {
          this.saveDatabase(callback);
          callback = undefined;
        }
      }

      if (callback) {
        this.on('close', callback);
      }
      this.emit('close');
    };

    /**-------------------------+
    | Changes API               |
    +--------------------------*/

    /**
     * The Changes API enables the tracking the changes occurred in the collections since the beginning of the session,
     * so it's possible to create a differential dataset for synchronization purposes (possibly to a remote db)
     */

    /**
     * (Changes API) : takes all the changes stored in each
     * collection and creates a single array for the entire database. If an array of names
     * of collections is passed then only the included collections will be tracked.
     *
     * @param {array=} optional array of collection names. No arg means all collections are processed.
     * @returns {array} array of changes
     * @see private method createChange() in Collection
     * @memberof Loki
     */
    Loki.prototype.generateChangesNotification = function (arrayOfCollectionNames) {
      function getCollName(coll) {
        return coll.name;
      }
      var changes = [],
        selectedCollections = arrayOfCollectionNames || this.collections.map(getCollName);

      this.collections.forEach(function (coll) {
        if (selectedCollections.indexOf(getCollName(coll)) !== -1) {
          changes = changes.concat(coll.getChanges());
        }
      });
      return changes;
    };

    /**
     * (Changes API) - stringify changes for network transmission
     * @returns {string} string representation of the changes
     * @memberof Loki
     */
    Loki.prototype.serializeChanges = function (collectionNamesArray) {
      return JSON.stringify(this.generateChangesNotification(collectionNamesArray));
    };

    /**
     * (Changes API) : clears all the changes in all collections.
     * @memberof Loki
     */
    Loki.prototype.clearChanges = function () {
      this.collections.forEach(function (coll) {
        if (coll.flushChanges) {
          coll.flushChanges();
        }
      });
    };

    /*------------------+
    | PERSISTENCE       |
    -------------------*/

    /** there are two build in persistence adapters for internal use
     * fs             for use in Nodejs type environments
     * localStorage   for use in browser environment
     * defined as helper classes here so its easy and clean to use
     */

    /**
     * In in-memory persistence adapter for an in-memory database.  
     * This simple 'key/value' adapter is intended for unit testing and diagnostics.
     *
     * @constructor LokiMemoryAdapter
     */
    function LokiMemoryAdapter() {
      this.hashStore = {};
    }

    /**
     * Loads a serialized database from its in-memory store.
     * (Loki persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {function} callback - adapter callback to return load result to caller
     * @memberof LokiMemoryAdapter
     */
    LokiMemoryAdapter.prototype.loadDatabase = function (dbname, callback) {
      if (this.hashStore.hasOwnProperty(dbname)) {
        callback(this.hashStore[dbname].value);
      }
      else {
        callback (new Error("unable to load database, " + dbname + " was not found in memory adapter"));
      }
    };

    /**
     * Saves a serialized database to its in-memory store.
     * (Loki persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {function} callback - adapter callback to return load result to caller
     * @memberof LokiMemoryAdapter
     */
    LokiMemoryAdapter.prototype.saveDatabase = function (dbname, dbstring, callback) {
      var saveCount = (this.hashStore.hasOwnProperty(dbname)?this.hashStore[dbname].savecount:0);

      this.hashStore[dbname] = {
        savecount: saveCount+1,
        lastsave: new Date(),
        value: dbstring 
      };

      callback();
    };

    /**
     * An adapter for adapters.  Converts a non reference mode adapter into a reference mode adapter
     * which can perform destructuring and partioning.  Each collection will be stored in its own key/save and
     * only dirty collections will be saved.  If you  turn on paging with default page size of 25megs and save
     * a 75 meg collection it should use up roughly 3 save slots (key/value pairs sent to inner adapter). 
     * A dirty collection that spans three pages will save all three pages again
     * Paging mode was added mainly because Chrome has issues saving 'too large' of a string within a 
     * single indexeddb row.  If a single document update causes the collection to be flagged as dirty, all
     * of that collection's pages will be written on next save.
     *
     * @param {object} adapter - reference to a 'non-reference' mode loki adapter instance.
     * @param {object=} options - configuration options for partitioning and paging
     * @param {bool} options.paging - (default: false) set to true to enable paging collection data.
     * @param {int} options.pageSize - (default : 25MB) you can use this to limit size of strings passed to inner adapter.
     * @param {string} options.delimiter - allows you to override the default delimeter
     * @constructor LokiPartitioningAdapter
     */
    function LokiPartitioningAdapter(adapter, options) {
      this.mode = "reference";
      this.adapter = null;
      this.options = options || {};
      this.dbref = null;
      this.dbname = "";
      this.pageIterator = {};

      // verify user passed an appropriate adapter
      if (adapter) {
        if (adapter.mode === "reference") {
          throw new Error("LokiPartitioningAdapter cannot be instantiated with a reference mode adapter");
        }
        else {
          this.adapter = adapter;
        }
      }
      else {
        throw new Error("LokiPartitioningAdapter requires a (non-reference mode) adapter on construction");
      }

      // set collection paging defaults
      if (!this.options.hasOwnProperty("paging")) {
        this.options.paging = false;
      }

      // default to page size of 25 megs (can be up to your largest serialized object size larger than this)
      if (!this.options.hasOwnProperty("pageSize")) {
        this.options.pageSize = 25*1024*1024;
      }

      if (!this.options.hasOwnProperty("delimiter")) {
        this.options.delimiter = '$<\n';
      }
    }

    /**
     * Loads a database which was partitioned into several key/value saves.
     * (Loki persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {function} callback - adapter callback to return load result to caller
     * @memberof LokiPartitioningAdapter
     */
    LokiPartitioningAdapter.prototype.loadDatabase = function (dbname, callback) {
      var self=this;
      this.dbname = dbname;
      this.dbref = new Loki(dbname);

      // load the db container (without data)
      this.adapter.loadDatabase(dbname, function(result) {
        if (typeof result !== "string") {
          callback(new Error("LokiPartitioningAdapter received an unexpected response from inner adapter loadDatabase()"));
        }

        // I will want to use loki destructuring helper methods so i will inflate into typed instance
        var db = JSON.parse(result);
        self.dbref.loadJSONObject(db);
        db = null;

        var clen = self.dbref.collections.length;

        if (self.dbref.collections.length === 0) {
          callback(self.dbref);
          return;
        }

        self.pageIterator = {
          collection: 0,
          pageIndex: 0
        };

        self.loadNextPartition(0, function() {
          callback(self.dbref);
        });
      });
    };

    /**
     * Used to sequentially load each collection partition, one at a time.
     *
     * @param {int} partition - ordinal collection position to load next
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.loadNextPartition = function(partition, callback) {
      var keyname = this.dbname + "." + partition;
      var self=this;

      if (this.options.paging === true) {
        this.pageIterator.pageIndex = 0;
        this.loadNextPage(callback);
        return;
      }

      this.adapter.loadDatabase(keyname, function(result) {
        var data = self.dbref.deserializeCollection(result, { delimited: true, collectionIndex: partition });
        self.dbref.collections[partition].data = data;

        if (++partition < self.dbref.collections.length) {
          self.loadNextPartition(partition, callback);
        }
        else {
          callback();
        }
      });
    };

    /**
     * Used to sequentially load the next page of collection partition, one at a time.
     *
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.loadNextPage = function(callback) {
      // calculate name for next saved page in sequence
      var keyname = this.dbname + "." + this.pageIterator.collection + "." + this.pageIterator.pageIndex;
      var self=this;

      // load whatever page is next in sequence
      this.adapter.loadDatabase(keyname, function(result) {
        var data = result.split(self.options.delimiter);
        result = ""; // free up memory now that we have split it into array
        var dlen = data.length;
        var idx;

        // detect if last page by presence of final empty string element and remove it if so
        var isLastPage = (data[dlen-1] === "");
        if (isLastPage) {
          data.pop();
          dlen = data.length;
          // empty collections are just a delimiter meaning two blank items
          if (data[dlen-1] === "" && dlen === 1) {
            data.pop();
            dlen = data.length;
          }
        }

        // convert stringified array elements to object instances and push to collection data
        for(idx=0; idx < dlen; idx++) {
          self.dbref.collections[self.pageIterator.collection].data.push(JSON.parse(data[idx]));
          data[idx] = null;
        }
        data = [];

        // if last page, we are done with this partition
        if (isLastPage) {

          // if there are more partitions, kick off next partition load
          if (++self.pageIterator.collection < self.dbref.collections.length) {
            self.loadNextPartition(self.pageIterator.collection, callback);
          }
          else {
            callback();
          }
        }
        else {
          self.pageIterator.pageIndex++;
          self.loadNextPage(callback);
        }
      });
    };

    /**
     * Saves a database by partioning into separate key/value saves.
     * (Loki 'reference mode' persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {object} dbref - reference to database which we will partition and save.
     * @param {function} callback - adapter callback to return load result to caller
     *
     * @memberof LokiPartitioningAdapter     
     */
    LokiPartitioningAdapter.prototype.exportDatabase = function(dbname, dbref, callback) {
      var self=this;
      var idx, clen = dbref.collections.length;

      this.dbref = dbref;
      this.dbname = dbname;

      // queue up dirty partitions to be saved
      this.dirtyPartitions = [-1];
      for(idx=0; idx<clen; idx++) {
        if (dbref.collections[idx].dirty) {
          this.dirtyPartitions.push(idx);
        }
      }

      this.saveNextPartition(function(err) {
        callback(err);
      });
    };

    /**
     * Helper method used internally to save each dirty collection, one at a time.
     *
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.saveNextPartition = function(callback) {
      var self=this;
      var partition = this.dirtyPartitions.shift();
      var keyname = this.dbname + ((partition===-1)?"":("." + partition));

      // if we are doing paging and this is collection partition
      if (this.options.paging && partition !== -1) {
        this.pageIterator = {
          collection: partition,
          docIndex: 0,
          pageIndex: 0
        };

        // since saveNextPage recursively calls itself until done, our callback means this whole paged partition is finished
        this.saveNextPage(function(err) {
          if (self.dirtyPartitions.length === 0) {
            callback(err);
          }
          else {
            self.saveNextPartition(callback);
          }
        });
        return;
      }

      // otherwise this is 'non-paged' partioning...
      var result = this.dbref.serializeDestructured({
        partitioned : true,
        delimited: true,
        partition: partition
      });

      this.adapter.saveDatabase(keyname, result, function(err) {
        if (err) {
          callback(err);
          return;
        }

        if (self.dirtyPartitions.length === 0) {
          callback(null);
        }
        else {
          self.saveNextPartition(callback);
        }
      });
    };

    /**
     * Helper method used internally to generate and save the next page of the current (dirty) partition.
     *
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.saveNextPage = function(callback) {
      var self=this;
      var coll = this.dbref.collections[this.pageIterator.collection];
      var keyname = this.dbname + "." + this.pageIterator.collection + "." + this.pageIterator.pageIndex;
      var pageLen=0,
        cdlen = coll.data.length,
        delimlen = this.options.delimiter.length;
      var serializedObject = "",
        pageBuilder = "";
      var doneWithPartition=false,
        doneWithPage=false;

      var pageSaveCallback = function(err) {
        pageBuilder = "";

        if (err) {
          callback(err);
        }

        // update meta properties then continue process by invoking callback
        if (doneWithPartition) {
          callback(null);
        }
        else {
          self.pageIterator.pageIndex++;
          self.saveNextPage(callback);
        }
      };

      if (coll.data.length === 0) {
        doneWithPartition = true;
      }

      while (true) {
        if (!doneWithPartition) {
          // serialize object
          serializedObject = JSON.stringify(coll.data[this.pageIterator.docIndex]);
          pageBuilder += serializedObject;
          pageLen += serializedObject.length;

          // if no more documents in collection to add, we are done with partition
          if (++this.pageIterator.docIndex >= cdlen) doneWithPartition = true;
        }
        // if our current page is bigger than defined pageSize, we are done with page
        if (pageLen >= this.options.pageSize) doneWithPage = true;

        // if not done with current page, need delimiter before next item
        // if done with partition we also want a delmiter to indicate 'end of pages' final empty row
        if (!doneWithPage || doneWithPartition) {
          pageBuilder += this.options.delimiter;
          pageLen += delimlen;
        }

        // if we are done with page save it and pass off to next recursive call or callback
        if (doneWithPartition || doneWithPage) {
          this.adapter.saveDatabase(keyname, pageBuilder, pageSaveCallback);
          return;
        }
      }
    };

    /**
     * A loki persistence adapter which persists using node fs module
     * @constructor LokiFsAdapter
     */
    function LokiFsAdapter() {
      this.fs = __webpack_require__(186);
    }

    /**
     * loadDatabase() - Load data from file, will throw an error if the file does not exist
     * @param {string} dbname - the filename of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiFsAdapter
     */
    LokiFsAdapter.prototype.loadDatabase = function loadDatabase(dbname, callback) {
      var self = this;

      this.fs.stat(dbname, function (err, stats) {
        if (!err && stats.isFile()) {
          self.fs.readFile(dbname, {
            encoding: 'utf8'
          }, function readFileCallback(err, data) {
            if (err) {
              callback(new Error(err));
            } else {
              callback(data);
            }
          });
        }
        else {
          callback(null);
        }
      });
    };

    /**
     * saveDatabase() - save data to file, will throw an error if the file can't be saved
     * might want to expand this to avoid dataloss on partial save
     * @param {string} dbname - the filename of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiFsAdapter
     */
    LokiFsAdapter.prototype.saveDatabase = function saveDatabase(dbname, dbstring, callback) {
      var self = this;
      var tmpdbname = dbname + '~';
      this.fs.writeFile(tmpdbname, dbstring, function writeFileCallback(err) {
        if (err) {
          callback(new Error(err));
        } else {
          self.fs.rename(tmpdbname,dbname,callback);
        }
      });
    };

    /**
     * deleteDatabase() - delete the database file, will throw an error if the
     * file can't be deleted
     * @param {string} dbname - the filename of the database to delete
     * @param {function} callback - the callback to handle the result
     * @memberof LokiFsAdapter
     */
    LokiFsAdapter.prototype.deleteDatabase = function deleteDatabase(dbname, callback) {
      this.fs.unlink(dbname, function deleteDatabaseCallback(err) {
        if (err) {
          callback(new Error(err));
        } else {
          callback();
        }
      });
    };


    /**
     * A loki persistence adapter which persists to web browser's local storage object
     * @constructor LokiLocalStorageAdapter
     */
    function LokiLocalStorageAdapter() {}

    /**
     * loadDatabase() - Load data from localstorage
     * @param {string} dbname - the name of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiLocalStorageAdapter
     */
    LokiLocalStorageAdapter.prototype.loadDatabase = function loadDatabase(dbname, callback) {
      if (localStorageAvailable()) {
        callback(localStorage.getItem(dbname));
      } else {
        callback(new Error('localStorage is not available'));
      }
    };

    /**
     * saveDatabase() - save data to localstorage, will throw an error if the file can't be saved
     * might want to expand this to avoid dataloss on partial save
     * @param {string} dbname - the filename of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiLocalStorageAdapter
     */
    LokiLocalStorageAdapter.prototype.saveDatabase = function saveDatabase(dbname, dbstring, callback) {
      if (localStorageAvailable()) {
        localStorage.setItem(dbname, dbstring);
        callback(null);
      } else {
        callback(new Error('localStorage is not available'));
      }
    };

    /**
     * deleteDatabase() - delete the database from localstorage, will throw an error if it
     * can't be deleted
     * @param {string} dbname - the filename of the database to delete
     * @param {function} callback - the callback to handle the result
     * @memberof LokiLocalStorageAdapter
     */
    LokiLocalStorageAdapter.prototype.deleteDatabase = function deleteDatabase(dbname, callback) {
      if (localStorageAvailable()) {
        localStorage.removeItem(dbname);
        callback(null);
      } else {
        callback(new Error('localStorage is not available'));
      }
    };

    /**
     * Handles loading from file system, local storage, or adapter (indexeddb)
     *    This method utilizes loki configuration options (if provided) to determine which
     *    persistence method to use, or environment detection (if configuration was not provided).
     *
     * @param {object} options - not currently used (remove or allow overrides?)
     * @param {function=} callback - (Optional) user supplied async callback / error handler
     * @memberof Loki
     */
    Loki.prototype.loadDatabase = function (options, callback) {
      var cFun = callback || function (err, data) {
          if (err) {
            throw err;
          }
        },
        self = this;

      // the persistenceAdapter should be present if all is ok, but check to be sure.
      if (this.persistenceAdapter !== null) {

        this.persistenceAdapter.loadDatabase(this.filename, function loadDatabaseCallback(dbString) {
          if (typeof (dbString) === 'string') {
            var parseSuccess = false;
            try {
              self.loadJSON(dbString, options || {});
              parseSuccess = true;
            } catch (err) {
              cFun(err);
            }
            if (parseSuccess) {
              cFun(null);
              self.emit('loaded', 'database ' + self.filename + ' loaded');
            }
          } else {
            // if adapter has returned an js object (other than null or error) attempt to load from JSON object
            if (typeof (dbString) === "object" && dbString !== null && !(dbString instanceof Error)) {
              self.loadJSONObject(dbString, options || {});
              cFun(null); // return null on success
              self.emit('loaded', 'database ' + self.filename + ' loaded');
            } else {
              // error from adapter (either null or instance of error), pass on to 'user' callback
              cFun(dbString);
            }
          }
        });

      } else {
        cFun(new Error('persistenceAdapter not configured'));
      }
    };

    /**
     * Handles saving to file system, local storage, or adapter (indexeddb)
     *    This method utilizes loki configuration options (if provided) to determine which
     *    persistence method to use, or environment detection (if configuration was not provided).
     *
     * @param {function=} callback - (Optional) user supplied async callback / error handler
     * @memberof Loki
     */
    Loki.prototype.saveDatabase = function (callback) {
      var cFun = callback || function (err) {
          if (err) {
            throw err;
          }
          return;
        },
        self = this;

      // the persistenceAdapter should be present if all is ok, but check to be sure.
      if (this.persistenceAdapter !== null) {
        // check if the adapter is requesting (and supports) a 'reference' mode export
        if (this.persistenceAdapter.mode === "reference" && typeof this.persistenceAdapter.exportDatabase === "function") {
          // filename may seem redundant but loadDatabase will need to expect this same filename
          this.persistenceAdapter.exportDatabase(this.filename, this.copy({removeNonSerializable:true}), function exportDatabaseCallback(err) {
            self.autosaveClearFlags();
            cFun(err);
          });
        }
        // otherwise just pass the serialized database to adapter
        else {
          this.persistenceAdapter.saveDatabase(this.filename, self.serialize(), function saveDatabasecallback(err) {
            self.autosaveClearFlags();
            cFun(err);
          });
        }
      } else {
        cFun(new Error('persistenceAdapter not configured'));
      }
    };

    // alias
    Loki.prototype.save = Loki.prototype.saveDatabase;

    /**
     * Handles deleting a database from file system, local
     *    storage, or adapter (indexeddb)
     *    This method utilizes loki configuration options (if provided) to determine which
     *    persistence method to use, or environment detection (if configuration was not provided).
     *
     * @param {object} options - not currently used (remove or allow overrides?)
     * @param {function=} callback - (Optional) user supplied async callback / error handler
     * @memberof Loki
     */
    Loki.prototype.deleteDatabase = function (options, callback) {
      var cFun = callback || function (err, data) {
        if (err) {
          throw err;
        }
      };

      // the persistenceAdapter should be present if all is ok, but check to be sure.
      if (this.persistenceAdapter !== null) {
        this.persistenceAdapter.deleteDatabase(this.filename, function deleteDatabaseCallback(err) {
          cFun(err);
        });
      } else {
        cFun(new Error('persistenceAdapter not configured'));
      }
    };

    /**
     * autosaveDirty - check whether any collections are 'dirty' meaning we need to save (entire) database
     *
     * @returns {boolean} - true if database has changed since last autosave, false if not.
     */
    Loki.prototype.autosaveDirty = function () {
      for (var idx = 0; idx < this.collections.length; idx++) {
        if (this.collections[idx].dirty) {
          return true;
        }
      }

      return false;
    };

    /**
     * autosaveClearFlags - resets dirty flags on all collections.
     *    Called from saveDatabase() after db is saved.
     *
     */
    Loki.prototype.autosaveClearFlags = function () {
      for (var idx = 0; idx < this.collections.length; idx++) {
        this.collections[idx].dirty = false;
      }
    };

    /**
     * autosaveEnable - begin a javascript interval to periodically save the database.
     *
     * @param {object} options - not currently used (remove or allow overrides?)
     * @param {function=} callback - (Optional) user supplied async callback
     */
    Loki.prototype.autosaveEnable = function (options, callback) {
      this.autosave = true;

      var delay = 5000,
        self = this;

      if (typeof (this.autosaveInterval) !== 'undefined' && this.autosaveInterval !== null) {
        delay = this.autosaveInterval;
      }

      this.autosaveHandle = setInterval(function autosaveHandleInterval() {
        // use of dirty flag will need to be hierarchical since mods are done at collection level with no visibility of 'db'
        // so next step will be to implement collection level dirty flags set on insert/update/remove
        // along with loki level isdirty() function which iterates all collections to see if any are dirty

        if (self.autosaveDirty()) {
          self.saveDatabase(callback);
        }
      }, delay);
    };

    /**
     * autosaveDisable - stop the autosave interval timer.
     *
     */
    Loki.prototype.autosaveDisable = function () {
      if (typeof (this.autosaveHandle) !== 'undefined' && this.autosaveHandle !== null) {
        clearInterval(this.autosaveHandle);
        this.autosaveHandle = null;
      }
    };


    /**
     * Resultset class allowing chainable queries.  Intended to be instanced internally.
     *    Collection.find(), Collection.where(), and Collection.chain() instantiate this.
     *
     * @example
     *    mycollection.chain()
     *      .find({ 'doors' : 4 })
     *      .where(function(obj) { return obj.name === 'Toyota' })
     *      .data();
     *
     * @constructor Resultset
     * @param {Collection} collection - The collection which this Resultset will query against.
     * @param {Object=} options - Object containing one or more options.
     * @param {string} options.queryObj - Optional mongo-style query object to initialize resultset with.
     * @param {function} options.queryFunc - Optional javascript filter function to initialize resultset with.
     * @param {bool} options.firstOnly - Optional boolean used by collection.findOne().
     */
    function Resultset(collection, options) {
      options = options || {};

      options.queryObj = options.queryObj || null;
      options.queryFunc = options.queryFunc || null;
      options.firstOnly = options.firstOnly || false;

      // retain reference to collection we are querying against
      this.collection = collection;

      // if chain() instantiates with null queryObj and queryFunc, so we will keep flag for later
      this.searchIsChained = (!options.queryObj && !options.queryFunc);
      this.filteredrows = [];
      this.filterInitialized = false;

      // if user supplied initial queryObj or queryFunc, apply it
      if (typeof (options.queryObj) !== "undefined" && options.queryObj !== null) {
        return this.find(options.queryObj, options.firstOnly);
      }
      if (typeof (options.queryFunc) !== "undefined" && options.queryFunc !== null) {
        return this.where(options.queryFunc);
      }

      // otherwise return unfiltered Resultset for future filtering
      return this;
    }

    /**
     * reset() - Reset the resultset to its initial state.
     *
     * @returns {Resultset} Reference to this resultset, for future chain operations.
     */
    Resultset.prototype.reset = function () {
      if (this.filteredrows.length > 0) {
        this.filteredrows = [];
      }
      this.filterInitialized = false;
      return this;
    };

    /**
     * toJSON() - Override of toJSON to avoid circular references
     *
     */
    Resultset.prototype.toJSON = function () {
      var copy = this.copy();
      copy.collection = null;
      return copy;
    };

    /**
     * Allows you to limit the number of documents passed to next chain operation.
     *    A resultset copy() is made to avoid altering original resultset.
     *
     * @param {int} qty - The number of documents to return.
     * @returns {Resultset} Returns a copy of the resultset, limited by qty, for subsequent chain ops.
     * @memberof Resultset
     */
    Resultset.prototype.limit = function (qty) {
      // if this is chained resultset with no filters applied, we need to populate filteredrows first
      if (this.searchIsChained && !this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var rscopy = new Resultset(this.collection);
      rscopy.filteredrows = this.filteredrows.slice(0, qty);
      rscopy.filterInitialized = true;
      return rscopy;
    };

    /**
     * Used for skipping 'pos' number of documents in the resultset.
     *
     * @param {int} pos - Number of documents to skip; all preceding documents are filtered out.
     * @returns {Resultset} Returns a copy of the resultset, containing docs starting at 'pos' for subsequent chain ops.
     * @memberof Resultset
     */
    Resultset.prototype.offset = function (pos) {
      // if this is chained resultset with no filters applied, we need to populate filteredrows first
      if (this.searchIsChained && !this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var rscopy = new Resultset(this.collection);
      rscopy.filteredrows = this.filteredrows.slice(pos);
      rscopy.filterInitialized = true;
      return rscopy;
    };

    /**
     * copy() - To support reuse of resultset in branched query situations.
     *
     * @returns {Resultset} Returns a copy of the resultset (set) but the underlying document references will be the same.
     * @memberof Resultset
     */
    Resultset.prototype.copy = function () {
      var result = new Resultset(this.collection);

      if (this.filteredrows.length > 0) {
        result.filteredrows = this.filteredrows.slice();
      }
      result.filterInitialized = this.filterInitialized;

      return result;
    };

    /**
     * Alias of copy()
     * @memberof Resultset
     */
    Resultset.prototype.branch = Resultset.prototype.copy;

    /**
     * transform() - executes a named collection transform or raw array of transform steps against the resultset.
     *
     * @param transform {(string|array)} - name of collection transform or raw transform array
     * @param parameters {object=} - (Optional) object property hash of parameters, if the transform requires them.
     * @returns {Resultset} either (this) resultset or a clone of of this resultset (depending on steps)
     * @memberof Resultset
     */
    Resultset.prototype.transform = function (transform, parameters) {
      var idx,
        step,
        rs = this;

      // if transform is name, then do lookup first
      if (typeof transform === 'string') {
        if (this.collection.transforms.hasOwnProperty(transform)) {
          transform = this.collection.transforms[transform];
        }
      }

      // either they passed in raw transform array or we looked it up, so process
      if (typeof transform !== 'object' || !Array.isArray(transform)) {
        throw new Error("Invalid transform");
      }

      if (typeof parameters !== 'undefined') {
        transform = Utils.resolveTransformParams(transform, parameters);
      }

      for (idx = 0; idx < transform.length; idx++) {
        step = transform[idx];

        switch (step.type) {
        case "find":
          rs.find(step.value);
          break;
        case "where":
          rs.where(step.value);
          break;
        case "simplesort":
          rs.simplesort(step.property, step.desc);
          break;
        case "compoundsort":
          rs.compoundsort(step.value);
          break;
        case "sort":
          rs.sort(step.value);
          break;
        case "limit":
          rs = rs.limit(step.value);
          break; // limit makes copy so update reference
        case "offset":
          rs = rs.offset(step.value);
          break; // offset makes copy so update reference
        case "map":
          rs = rs.map(step.value);
          break;
        case "eqJoin":
          rs = rs.eqJoin(step.joinData, step.leftJoinKey, step.rightJoinKey, step.mapFun);
          break;
          // following cases break chain by returning array data so make any of these last in transform steps
        case "mapReduce":
          rs = rs.mapReduce(step.mapFunction, step.reduceFunction);
          break;
          // following cases update documents in current filtered resultset (use carefully)
        case "update":
          rs.update(step.value);
          break;
        case "remove":
          rs.remove();
          break;
        default:
          break;
        }
      }

      return rs;
    };

    /**
     * User supplied compare function is provided two documents to compare. (chainable)
     * @example
     *    rslt.sort(function(obj1, obj2) {
     *      if (obj1.name === obj2.name) return 0;
     *      if (obj1.name > obj2.name) return 1;
     *      if (obj1.name < obj2.name) return -1;
     *    });
     *
     * @param {function} comparefun - A javascript compare function used for sorting.
     * @returns {Resultset} Reference to this resultset, sorted, for future chain operations.
     * @memberof Resultset
     */
    Resultset.prototype.sort = function (comparefun) {
      // if this is chained resultset with no filters applied, just we need to populate filteredrows first
      if (this.searchIsChained && !this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var wrappedComparer =
        (function (userComparer, data) {
          return function (a, b) {
            return userComparer(data[a], data[b]);
          };
        })(comparefun, this.collection.data);

      this.filteredrows.sort(wrappedComparer);

      return this;
    };

    /**
     * Simpler, loose evaluation for user to sort based on a property name. (chainable).
     *    Sorting based on the same lt/gt helper functions used for binary indices.
     *
     * @param {string} propname - name of property to sort by.
     * @param {bool=} isdesc - (Optional) If true, the property will be sorted in descending order
     * @returns {Resultset} Reference to this resultset, sorted, for future chain operations.
     * @memberof Resultset
     */
    Resultset.prototype.simplesort = function (propname, isdesc) {
      // if this is chained resultset with no filters applied, just we need to populate filteredrows first
      if (this.searchIsChained && !this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      if (typeof (isdesc) === 'undefined') {
        isdesc = false;
      }

      var wrappedComparer =
        (function (prop, desc, data) {
          return function (a, b) {
            return sortHelper(data[a][prop], data[b][prop], desc);
          };
        })(propname, isdesc, this.collection.data);

      this.filteredrows.sort(wrappedComparer);

      return this;
    };

    /**
     * Allows sorting a resultset based on multiple columns.
     * @example
     * // to sort by age and then name (both ascending)
     * rs.compoundsort(['age', 'name']);
     * // to sort by age (ascending) and then by name (descending)
     * rs.compoundsort(['age', ['name', true]);
     *
     * @param {array} properties - array of property names or subarray of [propertyname, isdesc] used evaluate sort order
     * @returns {Resultset} Reference to this resultset, sorted, for future chain operations.
     * @memberof Resultset
     */
    Resultset.prototype.compoundsort = function (properties) {
      if (properties.length === 0) {
        throw new Error("Invalid call to compoundsort, need at least one property");
      }

      var prop;
      if (properties.length === 1) {
        prop = properties[0];
        if (Array.isArray(prop)) {
          return this.simplesort(prop[0], prop[1]);
        }
        return this.simplesort(prop, false);
      }

      // unify the structure of 'properties' to avoid checking it repeatedly while sorting
      for (var i = 0, len = properties.length; i < len; i += 1) {
        prop = properties[i];
        if (!Array.isArray(prop)) {
          properties[i] = [prop, false];
        }
      }

      // if this is chained resultset with no filters applied, just we need to populate filteredrows first
      if (this.searchIsChained && !this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var wrappedComparer =
        (function (props, data) {
          return function (a, b) {
            return compoundeval(props, data[a], data[b]);
          };
        })(properties, this.collection.data);

      this.filteredrows.sort(wrappedComparer);

      return this;
    };

    /**
     * findOr() - oversee the operation of OR'ed query expressions.
     *    OR'ed expression evaluation runs each expression individually against the full collection,
     *    and finally does a set OR on each expression's results.
     *    Each evaluation can utilize a binary index to prevent multiple linear array scans.
     *
     * @param {array} expressionArray - array of expressions
     * @returns {Resultset} this resultset for further chain ops.
     */
    Resultset.prototype.findOr = function (expressionArray) {
      var fr = null,
        fri = 0,
        frlen = 0,
        docset = [],
        idxset = [],
        idx = 0,
        origCount = this.count();

      // If filter is already initialized, then we query against only those items already in filter.
      // This means no index utilization for fields, so hopefully its filtered to a smallish filteredrows.
      for (var ei = 0, elen = expressionArray.length; ei < elen; ei++) {
        // we need to branch existing query to run each filter separately and combine results
        fr = this.branch().find(expressionArray[ei]).filteredrows;
        frlen = fr.length;
        // if the find operation did not reduce the initial set, then the initial set is the actual result
        if (frlen === origCount) {
          return this;
        }

        // add any document 'hits'
        for (fri = 0; fri < frlen; fri++) {
          idx = fr[fri];
          if (idxset[idx] === undefined) {
            idxset[idx] = true;
            docset.push(idx);
          }
        }
      }

      this.filteredrows = docset;
      this.filterInitialized = true;

      return this;
    };
    Resultset.prototype.$or = Resultset.prototype.findOr;

    /**
     * findAnd() - oversee the operation of AND'ed query expressions.
     *    AND'ed expression evaluation runs each expression progressively against the full collection,
     *    internally utilizing existing chained resultset functionality.
     *    Only the first filter can utilize a binary index.
     *
     * @param {array} expressionArray - array of expressions
     * @returns {Resultset} this resultset for further chain ops.
     */
    Resultset.prototype.findAnd = function (expressionArray) {
      // we have already implementing method chaining in this (our Resultset class)
      // so lets just progressively apply user supplied and filters
      for (var i = 0, len = expressionArray.length; i < len; i++) {
        if (this.count() === 0) {
          return this;
        }
        this.find(expressionArray[i]);
      }
      return this;
    };
    Resultset.prototype.$and = Resultset.prototype.findAnd;

    /**
     * Used for querying via a mongo-style query object.
     *
     * @param {object} query - A mongo-style query object used for filtering current results.
     * @param {boolean=} firstOnly - (Optional) Used by collection.findOne()
     * @returns {Resultset} this resultset for further chain ops.
     * @memberof Resultset
     */
    Resultset.prototype.find = function (query, firstOnly) {
      if (this.collection.data.length === 0) {
        if (this.searchIsChained) {
          this.filteredrows = [];
          this.filterInitialized = true;
          return this;
        }
        return [];
      }

      var queryObject = query || 'getAll',
        p,
        property,
        queryObjectOp,
        operator,
        value,
        key,
        searchByIndex = false,
        result = [],
        index = null;

      // if this was note invoked via findOne()
      firstOnly = firstOnly || false;

      if (typeof queryObject === 'object') {
        for (p in queryObject) {
          if (hasOwnProperty.call(queryObject, p)) {
            property = p;
            queryObjectOp = queryObject[p];
            break;
          }
        }
      }

      // apply no filters if they want all
      if (!property || queryObject === 'getAll') {
        // coll.find(), coll.findOne(), coll.chain().find().data() all path here

        if (firstOnly) {
          return (this.collection.data.length > 0)?this.collection.data[0]: null;
        }

        return (this.searchIsChained) ? (this) : (this.collection.data.slice());
      }

      // injecting $and and $or expression tree evaluation here.
      if (property === '$and' || property === '$or') {
        if (this.searchIsChained) {
          this[property](queryObjectOp);

          // for chained find with firstonly,
          if (firstOnly && this.filteredrows.length > 1) {
            this.filteredrows = this.filteredrows.slice(0, 1);
          }

          return this;
        } else {
          // our $and operation internally chains filters
          result = this.collection.chain()[property](queryObjectOp).data();

          // if this was coll.findOne() return first object or empty array if null
          // since this is invoked from a constructor we can't return null, so we will
          // make null in coll.findOne();
          if (firstOnly) {
            return (result.length === 0) ? ([]) : (result[0]);
          }

          // not first only return all results
          return result;
        }
      }

      // see if query object is in shorthand mode (assuming eq operator)
      if (queryObjectOp === null || (typeof queryObjectOp !== 'object' || queryObjectOp instanceof Date)) {
        operator = '$eq';
        value = queryObjectOp;
      } else if (typeof queryObjectOp === 'object') {
        for (key in queryObjectOp) {
          if (hasOwnProperty.call(queryObjectOp, key)) {
            operator = key;
            value = queryObjectOp[key];
            break;
          }
        }
      } else {
        throw new Error('Do not know what you want to do.');
      }

      // for regex ops, precompile
      if (operator === '$regex') {
        if (Array.isArray(value)) {
          value = new RegExp(value[0], value[1]);
        } else if (!(value instanceof RegExp)) {
          value = new RegExp(value);
        }
      }

      // if user is deep querying the object such as find('name.first': 'odin')
      var usingDotNotation = (property.indexOf('.') !== -1);

      // if an index exists for the property being queried against, use it
      // for now only enabling for non-chained query (who's set of docs matches index)
      // or chained queries where it is the first filter applied and prop is indexed
      var doIndexCheck = !usingDotNotation &&
        (!this.searchIsChained || !this.filterInitialized);

      if (doIndexCheck && this.collection.binaryIndices[property] &&
        indexedOpsList.indexOf(operator) !== -1) {
        // this is where our lazy index rebuilding will take place
        // basically we will leave all indexes dirty until we need them
        // so here we will rebuild only the index tied to this property
        // ensureIndex() will only rebuild if flagged as dirty since we are not passing force=true param
        if (this.collection.adaptiveBinaryIndices !== true) {
          this.collection.ensureIndex(property);
        }

        searchByIndex = true;
        index = this.collection.binaryIndices[property];
      }

      // the comparison function
      var fun = LokiOps[operator];

      // "shortcut" for collection data
      var t = this.collection.data;
      // filter data length
      var i = 0,
        len = 0;

      // Query executed differently depending on :
      //    - whether it is chained or not
      //    - whether the property being queried has an index defined
      //    - if chained, we handle first pass differently for initial filteredrows[] population
      //
      // For performance reasons, each case has its own if block to minimize in-loop calculations

      // If not a chained query, bypass filteredrows and work directly against data
      if (!this.searchIsChained) {
        if (!searchByIndex) {
          i = t.length;

          if (firstOnly) {
            if (usingDotNotation) {
              property = property.split('.');
              while (i--) {
                if (dotSubScan(t[i], property, fun, value)) {
                  return (t[i]);
                }
              }
            } else {
              while (i--) {
                if (fun(t[i][property], value)) {
                  return (t[i]);
                }
              }
            }

            return [];
          }

          // if using dot notation then treat property as keypath such as 'name.first'.
          // currently supporting dot notation for non-indexed conditions only
          if (usingDotNotation) {
            property = property.split('.');
            while (i--) {
              if (dotSubScan(t[i], property, fun, value)) {
                result.push(t[i]);
              }
            }
          } else {
            while (i--) {
              if (fun(t[i][property], value)) {
                result.push(t[i]);
              }
            }
          }
        } else {
          // searching by binary index via calculateRange() utility method
          var seg = this.collection.calculateRange(operator, property, value);

          // not chained so this 'find' was designated in Resultset constructor
          // so return object itself
          if (firstOnly) {
            if (seg[1] !== -1) {
              return t[index.values[seg[0]]];
            }
            return [];
          }

          if (operator !== '$in') {
            for (i = seg[0]; i <= seg[1]; i++) {
              result.push(t[index.values[i]]);
            }
          } else {
            for (i = 0, len = seg.length; i < len; i++) {
              result.push(t[index.values[seg[i]]]);
            }
          }
        }

        // not a chained query so return result as data[]
        return result;
      }


      // Otherwise this is a chained query

      var filter, rowIdx = 0;

      // If the filteredrows[] is already initialized, use it
      if (this.filterInitialized) {
        filter = this.filteredrows;
        i = filter.length;

        // currently supporting dot notation for non-indexed conditions only
        if (usingDotNotation) {
          property = property.split('.');
          while (i--) {
            rowIdx = filter[i];
            if (dotSubScan(t[rowIdx], property, fun, value)) {
              result.push(rowIdx);
            }
          }
        } else {
          while (i--) {
            rowIdx = filter[i];
            if (fun(t[rowIdx][property], value)) {
              result.push(rowIdx);
            }
          }
        }
      }
      // first chained query so work against data[] but put results in filteredrows
      else {
        // if not searching by index
        if (!searchByIndex) {
          i = t.length;

          if (usingDotNotation) {
            property = property.split('.');
            while (i--) {
              if (dotSubScan(t[i], property, fun, value)) {
                result.push(i);
              }
            }
          } else {
            while (i--) {
              if (fun(t[i][property], value)) {
                result.push(i);
              }
            }
          }
        } else {
          // search by index
          var segm = this.collection.calculateRange(operator, property, value);

          if (operator !== '$in') {
            for (i = segm[0]; i <= segm[1]; i++) {
              result.push(index.values[i]);
            }
          } else {
            for (i = 0, len = segm.length; i < len; i++) {
              result.push(index.values[segm[i]]);
            }
          }
        }

        this.filterInitialized = true; // next time work against filteredrows[]
      }

      this.filteredrows = result;
      return this;
    };


    /**
     * where() - Used for filtering via a javascript filter function.
     *
     * @param {function} fun - A javascript function used for filtering current results by.
     * @returns {Resultset} this resultset for further chain ops.
     * @memberof Resultset
     */
    Resultset.prototype.where = function (fun) {
      var viewFunction,
        result = [];

      if ('function' === typeof fun) {
        viewFunction = fun;
      } else {
        throw new TypeError('Argument is not a stored view or a function');
      }
      try {
        // if not a chained query then run directly against data[] and return object []
        if (!this.searchIsChained) {
          var i = this.collection.data.length;

          while (i--) {
            if (viewFunction(this.collection.data[i]) === true) {
              result.push(this.collection.data[i]);
            }
          }

          // not a chained query so returning result as data[]
          return result;
        }
        // else chained query, so run against filteredrows
        else {
          // If the filteredrows[] is already initialized, use it
          if (this.filterInitialized) {
            var j = this.filteredrows.length;

            while (j--) {
              if (viewFunction(this.collection.data[this.filteredrows[j]]) === true) {
                result.push(this.filteredrows[j]);
              }
            }

            this.filteredrows = result;

            return this;
          }
          // otherwise this is initial chained op, work against data, push into filteredrows[]
          else {
            var k = this.collection.data.length;

            while (k--) {
              if (viewFunction(this.collection.data[k]) === true) {
                result.push(k);
              }
            }

            this.filteredrows = result;
            this.filterInitialized = true;

            return this;
          }
        }
      } catch (err) {
        throw err;
      }
    };

    /**
     * count() - returns the number of documents in the resultset.
     *
     * @returns {number} The number of documents in the resultset.
     * @memberof Resultset
     */
    Resultset.prototype.count = function () {
      if (this.searchIsChained && this.filterInitialized) {
        return this.filteredrows.length;
      }
      return this.collection.count();
    };

    /**
     * Terminates the chain and returns array of filtered documents
     *
     * @param {object=} options - allows specifying 'forceClones' and 'forceCloneMethod' options.
     * @param {boolean} options.forceClones - Allows forcing the return of cloned objects even when
     *        the collection is not configured for clone object.
     * @param {string} options.forceCloneMethod - Allows overriding the default or collection specified cloning method.
     *        Possible values include 'parse-stringify', 'jquery-extend-deep', and 'shallow'
     *
     * @returns {array} Array of documents in the resultset
     * @memberof Resultset
     */
    Resultset.prototype.data = function (options) {
      var result = [],
        data = this.collection.data,
        len,
        i,
        method;

      options = options || {};

      // if this is chained resultset with no filters applied, just return collection.data
      if (this.searchIsChained && !this.filterInitialized) {
        if (this.filteredrows.length === 0) {
          // determine whether we need to clone objects or not
          if (this.collection.cloneObjects || options.forceClones) {
            len = data.length;
            method = options.forceCloneMethod || this.collection.cloneMethod;

            for (i = 0; i < len; i++) {
              result.push(clone(data[i], method));
            }
            return result;
          }
          // otherwise we are not cloning so return sliced array with same object references
          else {
            return data.slice();
          }
        } else {
          // filteredrows must have been set manually, so use it
          this.filterInitialized = true;
        }
      }

      var fr = this.filteredrows;
      len = fr.length;

      if (this.collection.cloneObjects || options.forceClones) {
        method = options.forceCloneMethod || this.collection.cloneMethod;
        for (i = 0; i < len; i++) {
          result.push(clone(data[fr[i]], method));
        }
      } else {
        for (i = 0; i < len; i++) {
          result.push(data[fr[i]]);
        }
      }
      return result;
    };

    /**
     * Used to run an update operation on all documents currently in the resultset.
     *
     * @param {function} updateFunction - User supplied updateFunction(obj) will be executed for each document object.
     * @returns {Resultset} this resultset for further chain ops.
     * @memberof Resultset
     */
    Resultset.prototype.update = function (updateFunction) {

      if (typeof (updateFunction) !== "function") {
        throw new TypeError('Argument is not a function');
      }

      // if this is chained resultset with no filters applied, we need to populate filteredrows first
      if (this.searchIsChained && !this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var len = this.filteredrows.length,
        rcd = this.collection.data;

      for (var idx = 0; idx < len; idx++) {
        // pass in each document object currently in resultset to user supplied updateFunction
        updateFunction(rcd[this.filteredrows[idx]]);

        // notify collection we have changed this object so it can update meta and allow DynamicViews to re-evaluate
        this.collection.update(rcd[this.filteredrows[idx]]);
      }

      return this;
    };

    /**
     * Removes all document objects which are currently in resultset from collection (as well as resultset)
     *
     * @returns {Resultset} this (empty) resultset for further chain ops.
     * @memberof Resultset
     */
    Resultset.prototype.remove = function () {

      // if this is chained resultset with no filters applied, we need to populate filteredrows first
      if (this.searchIsChained && !this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      this.collection.remove(this.data());

      this.filteredrows = [];

      return this;
    };

    /**
     * data transformation via user supplied functions
     *
     * @param {function} mapFunction - this function accepts a single document for you to transform and return
     * @param {function} reduceFunction - this function accepts many (array of map outputs) and returns single value
     * @returns {value} The output of your reduceFunction
     * @memberof Resultset
     */
    Resultset.prototype.mapReduce = function (mapFunction, reduceFunction) {
      try {
        return reduceFunction(this.data().map(mapFunction));
      } catch (err) {
        throw err;
      }
    };

    /**
     * eqJoin() - Left joining two sets of data. Join keys can be defined or calculated properties
     * eqJoin expects the right join key values to be unique.  Otherwise left data will be joined on the last joinData object with that key
     * @param {Array} joinData - Data array to join to.
     * @param {(string|function)} leftJoinKey - Property name in this result set to join on or a function to produce a value to join on
     * @param {(string|function)} rightJoinKey - Property name in the joinData to join on or a function to produce a value to join on
     * @param {function=} mapFun - (Optional) A function that receives each matching pair and maps them into output objects - function(left,right){return joinedObject}
     * @returns {Resultset} A resultset with data in the format [{left: leftObj, right: rightObj}]
     * @memberof Resultset
     */
    Resultset.prototype.eqJoin = function (joinData, leftJoinKey, rightJoinKey, mapFun) {

      var leftData = [],
        leftDataLength,
        rightData = [],
        rightDataLength,
        key,
        result = [],
        leftKeyisFunction = typeof leftJoinKey === 'function',
        rightKeyisFunction = typeof rightJoinKey === 'function',
        joinMap = {};

      //get the left data
      leftData = this.data();
      leftDataLength = leftData.length;

      //get the right data
      if (joinData instanceof Resultset) {
        rightData = joinData.data();
      } else if (Array.isArray(joinData)) {
        rightData = joinData;
      } else {
        throw new TypeError('joinData needs to be an array or result set');
      }
      rightDataLength = rightData.length;

      //construct a lookup table

      for (var i = 0; i < rightDataLength; i++) {
        key = rightKeyisFunction ? rightJoinKey(rightData[i]) : rightData[i][rightJoinKey];
        joinMap[key] = rightData[i];
      }

      if (!mapFun) {
        mapFun = function (left, right) {
          return {
            left: left,
            right: right
          };
        };
      }

      //Run map function over each object in the resultset
      for (var j = 0; j < leftDataLength; j++) {
        key = leftKeyisFunction ? leftJoinKey(leftData[j]) : leftData[j][leftJoinKey];
        result.push(mapFun(leftData[j], joinMap[key] || {}));
      }

      //return return a new resultset with no filters
      this.collection = new Collection('joinData');
      this.collection.insert(result);
      this.filteredrows = [];
      this.filterInitialized = false;

      return this;
    };

    Resultset.prototype.map = function (mapFun) {
      var data = this.data().map(mapFun);
      //return return a new resultset with no filters
      this.collection = new Collection('mappedData');
      this.collection.insert(data);
      this.filteredrows = [];
      this.filterInitialized = false;

      return this;
    };

    /**
     * DynamicView class is a versatile 'live' view class which can have filters and sorts applied.
     *    Collection.addDynamicView(name) instantiates this DynamicView object and notifies it
     *    whenever documents are add/updated/removed so it can remain up-to-date. (chainable)
     *
     * @example
     * var mydv = mycollection.addDynamicView('test');  // default is non-persistent
     * mydv.applyFind({ 'doors' : 4 });
     * mydv.applyWhere(function(obj) { return obj.name === 'Toyota'; });
     * var results = mydv.data();
     *
     * @constructor DynamicView
     * @implements LokiEventEmitter
     * @param {Collection} collection - A reference to the collection to work against
     * @param {string} name - The name of this dynamic view
     * @param {object=} options - (Optional) Pass in object with 'persistent' and/or 'sortPriority' options.
     * @param {boolean} options.persistent - indicates if view is to main internal results array in 'resultdata'
     * @param {string} options.sortPriority - 'passive' (sorts performed on call to data) or 'active' (after updates)
     * @param {number} options.minRebuildInterval - minimum rebuild interval (need clarification to docs here)
     * @see {@link Collection#addDynamicView} to construct instances of DynamicView
     */
    function DynamicView(collection, name, options) {
      this.collection = collection;
      this.name = name;
      this.rebuildPending = false;
      this.options = options || {};

      if (!this.options.hasOwnProperty('persistent')) {
        this.options.persistent = false;
      }

      // 'persistentSortPriority':
      // 'passive' will defer the sort phase until they call data(). (most efficient overall)
      // 'active' will sort async whenever next idle. (prioritizes read speeds)
      if (!this.options.hasOwnProperty('sortPriority')) {
        this.options.sortPriority = 'passive';
      }

      if (!this.options.hasOwnProperty('minRebuildInterval')) {
        this.options.minRebuildInterval = 1;
      }

      this.resultset = new Resultset(collection);
      this.resultdata = [];
      this.resultsdirty = false;

      this.cachedresultset = null;

      // keep ordered filter pipeline
      this.filterPipeline = [];

      // sorting member variables
      // we only support one active search, applied using applySort() or applySimpleSort()
      this.sortFunction = null;
      this.sortCriteria = null;
      this.sortDirty = false;

      // for now just have 1 event for when we finally rebuilt lazy view
      // once we refactor transactions, i will tie in certain transactional events

      this.events = {
        'rebuild': []
      };
    }

    DynamicView.prototype = new LokiEventEmitter();


    /**
     * rematerialize() - intended for use immediately after deserialization (loading)
     *    This will clear out and reapply filterPipeline ops, recreating the view.
     *    Since where filters do not persist correctly, this method allows
     *    restoring the view to state where user can re-apply those where filters.
     *
     * @param {Object=} options - (Optional) allows specification of 'removeWhereFilters' option
     * @returns {DynamicView} This dynamic view for further chained ops.
     * @memberof DynamicView
     * @fires DynamicView.rebuild
     */
    DynamicView.prototype.rematerialize = function (options) {
      var fpl,
        fpi,
        idx;

      options = options || {};

      this.resultdata = [];
      this.resultsdirty = true;
      this.resultset = new Resultset(this.collection);

      if (this.sortFunction || this.sortCriteria) {
        this.sortDirty = true;
      }

      if (options.hasOwnProperty('removeWhereFilters')) {
        // for each view see if it had any where filters applied... since they don't
        // serialize those functions lets remove those invalid filters
        fpl = this.filterPipeline.length;
        fpi = fpl;
        while (fpi--) {
          if (this.filterPipeline[fpi].type === 'where') {
            if (fpi !== this.filterPipeline.length - 1) {
              this.filterPipeline[fpi] = this.filterPipeline[this.filterPipeline.length - 1];
            }

            this.filterPipeline.length--;
          }
        }
      }

      // back up old filter pipeline, clear filter pipeline, and reapply pipeline ops
      var ofp = this.filterPipeline;
      this.filterPipeline = [];

      // now re-apply 'find' filterPipeline ops
      fpl = ofp.length;
      for (idx = 0; idx < fpl; idx++) {
        this.applyFind(ofp[idx].val);
      }

      // during creation of unit tests, i will remove this forced refresh and leave lazy
      this.data();

      // emit rebuild event in case user wants to be notified
      this.emit('rebuild', this);

      return this;
    };

    /**
     * branchResultset() - Makes a copy of the internal resultset for branched queries.
     *    Unlike this dynamic view, the branched resultset will not be 'live' updated,
     *    so your branched query should be immediately resolved and not held for future evaluation.
     *
     * @param {(string|array=)} transform - Optional name of collection transform, or an array of transform steps
     * @param {object=} parameters - optional parameters (if optional transform requires them)
     * @returns {Resultset} A copy of the internal resultset for branched queries.
     * @memberof DynamicView
     */
    DynamicView.prototype.branchResultset = function (transform, parameters) {
      var rs = this.resultset.branch();

      if (typeof transform === 'undefined') {
        return rs;
      }

      return rs.transform(transform, parameters);
    };

    /**
     * toJSON() - Override of toJSON to avoid circular references
     *
     */
    DynamicView.prototype.toJSON = function () {
      var copy = new DynamicView(this.collection, this.name, this.options);

      copy.resultset = this.resultset;
      copy.resultdata = []; // let's not save data (copy) to minimize size
      copy.resultsdirty = true;
      copy.filterPipeline = this.filterPipeline;
      copy.sortFunction = this.sortFunction;
      copy.sortCriteria = this.sortCriteria;
      copy.sortDirty = this.sortDirty;

      // avoid circular reference, reapply in db.loadJSON()
      copy.collection = null;

      return copy;
    };

    /**
     * removeFilters() - Used to clear pipeline and reset dynamic view to initial state.
     *     Existing options should be retained.
     * @memberof DynamicView
     */
    DynamicView.prototype.removeFilters = function () {
      this.rebuildPending = false;
      this.resultset.reset();
      this.resultdata = [];
      this.resultsdirty = false;

      this.cachedresultset = null;

      // keep ordered filter pipeline
      this.filterPipeline = [];

      // sorting member variables
      // we only support one active search, applied using applySort() or applySimpleSort()
      this.sortFunction = null;
      this.sortCriteria = null;
      this.sortDirty = false;
    };

    /**
     * applySort() - Used to apply a sort to the dynamic view
     * @example
     * dv.applySort(function(obj1, obj2) {
     *   if (obj1.name === obj2.name) return 0;
     *   if (obj1.name > obj2.name) return 1;
     *   if (obj1.name < obj2.name) return -1;
     * });
     *
     * @param {function} comparefun - a javascript compare function used for sorting
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applySort = function (comparefun) {
      this.sortFunction = comparefun;
      this.sortCriteria = null;

      this.queueSortPhase();

      return this;
    };

    /**
     * applySimpleSort() - Used to specify a property used for view translation.
     * @example
     * dv.applySimpleSort("name");
     *
     * @param {string} propname - Name of property by which to sort.
     * @param {boolean=} isdesc - (Optional) If true, the sort will be in descending order.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applySimpleSort = function (propname, isdesc) {
      this.sortCriteria = [
        [propname, isdesc || false]
      ];
      this.sortFunction = null;

      this.queueSortPhase();

      return this;
    };

    /**
     * applySortCriteria() - Allows sorting a resultset based on multiple columns.
     * @example
     * // to sort by age and then name (both ascending)
     * dv.applySortCriteria(['age', 'name']);
     * // to sort by age (ascending) and then by name (descending)
     * dv.applySortCriteria(['age', ['name', true]);
     * // to sort by age (descending) and then by name (descending)
     * dv.applySortCriteria(['age', true], ['name', true]);
     *
     * @param {array} properties - array of property names or subarray of [propertyname, isdesc] used evaluate sort order
     * @returns {DynamicView} Reference to this DynamicView, sorted, for future chain operations.
     * @memberof DynamicView
     */
    DynamicView.prototype.applySortCriteria = function (criteria) {
      this.sortCriteria = criteria;
      this.sortFunction = null;

      this.queueSortPhase();

      return this;
    };

    /**
     * startTransaction() - marks the beginning of a transaction.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.startTransaction = function () {
      this.cachedresultset = this.resultset.copy();

      return this;
    };

    /**
     * commit() - commits a transaction.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.commit = function () {
      this.cachedresultset = null;

      return this;
    };

    /**
     * rollback() - rolls back a transaction.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.rollback = function () {
      this.resultset = this.cachedresultset;

      if (this.options.persistent) {
        // for now just rebuild the persistent dynamic view data in this worst case scenario
        // (a persistent view utilizing transactions which get rolled back), we already know the filter so not too bad.
        this.resultdata = this.resultset.data();

        this.emit('rebuild', this);
      }

      return this;
    };


    /**
     * Implementation detail.
     * _indexOfFilterWithId() - Find the index of a filter in the pipeline, by that filter's ID.
     *
     * @param {(string|number)} uid - The unique ID of the filter.
     * @returns {number}: index of the referenced filter in the pipeline; -1 if not found.
     */
    DynamicView.prototype._indexOfFilterWithId = function (uid) {
      if (typeof uid === 'string' || typeof uid === 'number') {
        for (var idx = 0, len = this.filterPipeline.length; idx < len; idx += 1) {
          if (uid === this.filterPipeline[idx].uid) {
            return idx;
          }
        }
      }
      return -1;
    };

    /**
     * Implementation detail.
     * _addFilter() - Add the filter object to the end of view's filter pipeline and apply the filter to the resultset.
     *
     * @param {object} filter - The filter object. Refer to applyFilter() for extra details.
     */
    DynamicView.prototype._addFilter = function (filter) {
      this.filterPipeline.push(filter);
      this.resultset[filter.type](filter.val);
    };

    /**
     * reapplyFilters() - Reapply all the filters in the current pipeline.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.reapplyFilters = function () {
      this.resultset.reset();

      this.cachedresultset = null;
      if (this.options.persistent) {
        this.resultdata = [];
        this.resultsdirty = true;
      }

      var filters = this.filterPipeline;
      this.filterPipeline = [];

      for (var idx = 0, len = filters.length; idx < len; idx += 1) {
        this._addFilter(filters[idx]);
      }

      if (this.sortFunction || this.sortCriteria) {
        this.queueSortPhase();
      } else {
        this.queueRebuildEvent();
      }

      return this;
    };

    /**
     * applyFilter() - Adds or updates a filter in the DynamicView filter pipeline
     *
     * @param {object} filter - A filter object to add to the pipeline.
     *    The object is in the format { 'type': filter_type, 'val', filter_param, 'uid', optional_filter_id }
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applyFilter = function (filter) {
      var idx = this._indexOfFilterWithId(filter.uid);
      if (idx >= 0) {
        this.filterPipeline[idx] = filter;
        return this.reapplyFilters();
      }

      this.cachedresultset = null;
      if (this.options.persistent) {
        this.resultdata = [];
        this.resultsdirty = true;
      }

      this._addFilter(filter);

      if (this.sortFunction || this.sortCriteria) {
        this.queueSortPhase();
      } else {
        this.queueRebuildEvent();
      }

      return this;
    };

    /**
     * applyFind() - Adds or updates a mongo-style query option in the DynamicView filter pipeline
     *
     * @param {object} query - A mongo-style query object to apply to pipeline
     * @param {(string|number)=} uid - Optional: The unique ID of this filter, to reference it in the future.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applyFind = function (query, uid) {
      this.applyFilter({
        type: 'find',
        val: query,
        uid: uid
      });
      return this;
    };

    /**
     * applyWhere() - Adds or updates a javascript filter function in the DynamicView filter pipeline
     *
     * @param {function} fun - A javascript filter function to apply to pipeline
     * @param {(string|number)=} uid - Optional: The unique ID of this filter, to reference it in the future.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applyWhere = function (fun, uid) {
      this.applyFilter({
        type: 'where',
        val: fun,
        uid: uid
      });
      return this;
    };

    /**
     * removeFilter() - Remove the specified filter from the DynamicView filter pipeline
     *
     * @param {(string|number)} uid - The unique ID of the filter to be removed.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.removeFilter = function (uid) {
      var idx = this._indexOfFilterWithId(uid);
      if (idx < 0) {
        throw new Error("Dynamic view does not contain a filter with ID: " + uid);
      }

      this.filterPipeline.splice(idx, 1);
      this.reapplyFilters();
      return this;
    };

    /**
     * count() - returns the number of documents representing the current DynamicView contents.
     *
     * @returns {number} The number of documents representing the current DynamicView contents.
     * @memberof DynamicView
     */
    DynamicView.prototype.count = function () {
      if (this.options.persistent) {
        return this.resultdata.length;
      }
      return this.resultset.count();
    };

    /**
     * data() - resolves and pending filtering and sorting, then returns document array as result.
     *
     * @returns {array} An array of documents representing the current DynamicView contents.
     * @memberof DynamicView
     */
    DynamicView.prototype.data = function () {
      // using final sort phase as 'catch all' for a few use cases which require full rebuild
      if (this.sortDirty || this.resultsdirty) {
        this.performSortPhase({
          suppressRebuildEvent: true
        });
      }
      return (this.options.persistent) ? (this.resultdata) : (this.resultset.data());
    };

    /**
     * queueRebuildEvent() - When the view is not sorted we may still wish to be notified of rebuild events.
     *     This event will throttle and queue a single rebuild event when batches of updates affect the view.
     */
    DynamicView.prototype.queueRebuildEvent = function () {
      if (this.rebuildPending) {
        return;
      }
      this.rebuildPending = true;

      var self = this;
      setTimeout(function () {
        if (self.rebuildPending) {
          self.rebuildPending = false;
          self.emit('rebuild', self);
        }
      }, this.options.minRebuildInterval);
    };

    /**
     * queueSortPhase : If the view is sorted we will throttle sorting to either :
     *    (1) passive - when the user calls data(), or
     *    (2) active - once they stop updating and yield js thread control
     */
    DynamicView.prototype.queueSortPhase = function () {
      // already queued? exit without queuing again
      if (this.sortDirty) {
        return;
      }
      this.sortDirty = true;

      var self = this;
      if (this.options.sortPriority === "active") {
        // active sorting... once they are done and yield js thread, run async performSortPhase()
        setTimeout(function () {
          self.performSortPhase();
        }, this.options.minRebuildInterval);
      } else {
        // must be passive sorting... since not calling performSortPhase (until data call), lets use queueRebuildEvent to
        // potentially notify user that data has changed.
        this.queueRebuildEvent();
      }
    };

    /**
     * performSortPhase() - invoked synchronously or asynchronously to perform final sort phase (if needed)
     *
     */
    DynamicView.prototype.performSortPhase = function (options) {
      // async call to this may have been pre-empted by synchronous call to data before async could fire
      if (!this.sortDirty && !this.resultsdirty) {
        return;
      }

      options = options || {};

      if (this.sortDirty) {
        if (this.sortFunction) {
          this.resultset.sort(this.sortFunction);
        } else if (this.sortCriteria) {
          this.resultset.compoundsort(this.sortCriteria);
        }

        this.sortDirty = false;
      }

      if (this.options.persistent) {
        // persistent view, rebuild local resultdata array
        this.resultdata = this.resultset.data();
        this.resultsdirty = false;
      }

      if (!options.suppressRebuildEvent) {
        this.emit('rebuild', this);
      }
    };

    /**
     * evaluateDocument() - internal method for (re)evaluating document inclusion.
     *    Called by : collection.insert() and collection.update().
     *
     * @param {int} objIndex - index of document to (re)run through filter pipeline.
     * @param {bool} isNew - true if the document was just added to the collection.
     */
    DynamicView.prototype.evaluateDocument = function (objIndex, isNew) {
      // if no filter applied yet, the result 'set' should remain 'everything'
      if (!this.resultset.filterInitialized) {
        if (this.options.persistent) {
          this.resultdata = this.resultset.data();
        }
        // need to re-sort to sort new document
        if (this.sortFunction || this.sortCriteria) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }
        return;
      }

      var ofr = this.resultset.filteredrows;
      var oldPos = (isNew) ? (-1) : (ofr.indexOf(+objIndex));
      var oldlen = ofr.length;

      // creating a 1-element resultset to run filter chain ops on to see if that doc passes filters;
      // mostly efficient algorithm, slight stack overhead price (this function is called on inserts and updates)
      var evalResultset = new Resultset(this.collection);
      evalResultset.filteredrows = [objIndex];
      evalResultset.filterInitialized = true;
      var filter;
      for (var idx = 0, len = this.filterPipeline.length; idx < len; idx++) {
        filter = this.filterPipeline[idx];
        evalResultset[filter.type](filter.val);
      }

      // not a true position, but -1 if not pass our filter(s), 0 if passed filter(s)
      var newPos = (evalResultset.filteredrows.length === 0) ? -1 : 0;

      // wasn't in old, shouldn't be now... do nothing
      if (oldPos === -1 && newPos === -1) return;

      // wasn't in resultset, should be now... add
      if (oldPos === -1 && newPos !== -1) {
        ofr.push(objIndex);

        if (this.options.persistent) {
          this.resultdata.push(this.collection.data[objIndex]);
        }

        // need to re-sort to sort new document
        if (this.sortFunction || this.sortCriteria) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }

        return;
      }

      // was in resultset, shouldn't be now... delete
      if (oldPos !== -1 && newPos === -1) {
        if (oldPos < oldlen - 1) {
          ofr.splice(oldPos, 1);

          if (this.options.persistent) {
            this.resultdata.splice(oldPos, 1);
          }
        } else {
          ofr.length = oldlen - 1;

          if (this.options.persistent) {
            this.resultdata.length = oldlen - 1;
          }
        }

        // in case changes to data altered a sort column
        if (this.sortFunction || this.sortCriteria) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }

        return;
      }

      // was in resultset, should still be now... (update persistent only?)
      if (oldPos !== -1 && newPos !== -1) {
        if (this.options.persistent) {
          // in case document changed, replace persistent view data with the latest collection.data document
          this.resultdata[oldPos] = this.collection.data[objIndex];
        }

        // in case changes to data altered a sort column
        if (this.sortFunction || this.sortCriteria) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }

        return;
      }
    };

    /**
     * removeDocument() - internal function called on collection.delete()
     */
    DynamicView.prototype.removeDocument = function (objIndex) {
      // if no filter applied yet, the result 'set' should remain 'everything'
      if (!this.resultset.filterInitialized) {
        if (this.options.persistent) {
          this.resultdata = this.resultset.data();
        }
        // in case changes to data altered a sort column
        if (this.sortFunction || this.sortCriteria) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }
        return;
      }

      var ofr = this.resultset.filteredrows;
      var oldPos = ofr.indexOf(+objIndex);
      var oldlen = ofr.length;
      var idx;

      if (oldPos !== -1) {
        // if not last row in resultdata, swap last to hole and truncate last row
        if (oldPos < oldlen - 1) {
          ofr[oldPos] = ofr[oldlen - 1];
          ofr.length = oldlen - 1;

          if (this.options.persistent) {
            this.resultdata[oldPos] = this.resultdata[oldlen - 1];
            this.resultdata.length = oldlen - 1;
          }
        }
        // last row, so just truncate last row
        else {
          ofr.length = oldlen - 1;

          if (this.options.persistent) {
            this.resultdata.length = oldlen - 1;
          }
        }

        // in case changes to data altered a sort column
        if (this.sortFunction || this.sortCriteria) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }
      }

      // since we are using filteredrows to store data array positions
      // if they remove a document (whether in our view or not),
      // we need to adjust array positions -1 for all document array references after that position
      oldlen = ofr.length;
      for (idx = 0; idx < oldlen; idx++) {
        if (ofr[idx] > objIndex) {
          ofr[idx]--;
        }
      }
    };

    /**
     * mapReduce() - data transformation via user supplied functions
     *
     * @param {function} mapFunction - this function accepts a single document for you to transform and return
     * @param {function} reduceFunction - this function accepts many (array of map outputs) and returns single value
     * @returns The output of your reduceFunction
     * @memberof DynamicView
     */
    DynamicView.prototype.mapReduce = function (mapFunction, reduceFunction) {
      try {
        return reduceFunction(this.data().map(mapFunction));
      } catch (err) {
        throw err;
      }
    };


    /**
     * Collection class that handles documents of same type
     * @constructor Collection
     * @implements LokiEventEmitter
     * @param {string} name - collection name
     * @param {(array|object)=} options - (optional) array of property names to be indicized OR a configuration object
     * @param {array} options.unique - array of property names to define unique constraints for
     * @param {array} options.exact - array of property names to define exact constraints for
     * @param {array} options.indices - array property names to define binary indexes for
     * @param {boolean} options.adaptiveBinaryIndices - collection indices will be actively rebuilt rather than lazily (default: true)
     * @param {boolean} options.asyncListeners - default is false
     * @param {boolean} options.disableChangesApi - default is true
     * @param {boolean} options.autoupdate - use Object.observe to update objects automatically (default: false)
     * @param {boolean} options.clone - specify whether inserts and queries clone to/from user
     * @param {string} options.cloneMethod - 'parse-stringify' (default), 'jquery-extend-deep', 'shallow'
     * @param {int} options.ttlInterval - time interval for clearing out 'aged' documents; not set by default.
     * @see {@link Loki#addCollection} for normal creation of collections
     */
    function Collection(name, options) {
      // the name of the collection

      this.name = name;
      // the data held by the collection
      this.data = [];
      this.idIndex = []; // index of id
      this.binaryIndices = {}; // user defined indexes
      this.constraints = {
        unique: {},
        exact: {}
      };

      // unique contraints contain duplicate object references, so they are not persisted.
      // we will keep track of properties which have unique contraint applied here, and regenerate on load
      this.uniqueNames = [];

      // transforms will be used to store frequently used query chains as a series of steps
      // which itself can be stored along with the database.
      this.transforms = {};

      // the object type of the collection
      this.objType = name;

      // in autosave scenarios we will use collection level dirty flags to determine whether save is needed.
      // currently, if any collection is dirty we will autosave the whole database if autosave is configured.
      // defaulting to true since this is called from addCollection and adding a collection should trigger save
      this.dirty = true;

      // private holders for cached data
      this.cachedIndex = null;
      this.cachedBinaryIndex = null;
      this.cachedData = null;
      var self = this;

      /* OPTIONS */
      options = options || {};

      // exact match and unique constraints
      if (options.hasOwnProperty('unique')) {
        if (!Array.isArray(options.unique)) {
          options.unique = [options.unique];
        }
        options.unique.forEach(function (prop) {
          self.uniqueNames.push(prop); // used to regenerate on subsequent database loads
          self.constraints.unique[prop] = new UniqueIndex(prop);
        });
      }

      if (options.hasOwnProperty('exact')) {
        options.exact.forEach(function (prop) {
          self.constraints.exact[prop] = new ExactIndex(prop);
        });
      }

      // if set to true we will optimally keep indices 'fresh' during insert/update/remove ops (never dirty/never needs rebuild)
      // if you frequently intersperse insert/update/remove ops between find ops this will likely be significantly faster option.
      this.adaptiveBinaryIndices = options.hasOwnProperty('adaptiveBinaryIndices') ? options.adaptiveBinaryIndices : true;

      // is collection transactional
      this.transactional = options.hasOwnProperty('transactional') ? options.transactional : false;

      // options to clone objects when inserting them
      this.cloneObjects = options.hasOwnProperty('clone') ? options.clone : false;

      // default clone method (if enabled) is parse-stringify
      this.cloneMethod = options.hasOwnProperty('cloneMethod') ? options.cloneMethod : "parse-stringify";

      // option to make event listeners async, default is sync
      this.asyncListeners = options.hasOwnProperty('asyncListeners') ? options.asyncListeners : false;

      // disable track changes
      this.disableChangesApi = options.hasOwnProperty('disableChangesApi') ? options.disableChangesApi : true;

      // option to observe objects and update them automatically, ignored if Object.observe is not supported
      this.autoupdate = options.hasOwnProperty('autoupdate') ? options.autoupdate : false;

      //option to activate a cleaner daemon - clears "aged" documents at set intervals.
      this.ttl = {
        age: null,
        ttlInterval: null,
        daemon: null
      };
      this.setTTL(options.ttl || -1, options.ttlInterval);

      // currentMaxId - change manually at your own peril!
      this.maxId = 0;

      this.DynamicViews = [];

      // events
      this.events = {
        'insert': [],
        'update': [],
        'pre-insert': [],
        'pre-update': [],
        'close': [],
        'flushbuffer': [],
        'error': [],
        'delete': [],
        'warning': []
      };

      // changes are tracked by collection and aggregated by the db
      this.changes = [];

      // initialize the id index
      this.ensureId();
      var indices = [];
      // initialize optional user-supplied indices array ['age', 'lname', 'zip']
      if (options && options.indices) {
        if (Object.prototype.toString.call(options.indices) === '[object Array]') {
          indices = options.indices;
        } else if (typeof options.indices === 'string') {
          indices = [options.indices];
        } else {
          throw new TypeError('Indices needs to be a string or an array of strings');
        }
      }

      for (var idx = 0; idx < indices.length; idx++) {
        this.ensureIndex(indices[idx]);
      }

      function observerCallback(changes) {

        var changedObjects = typeof Set === 'function' ? new Set() : [];

        if (!changedObjects.add)
          changedObjects.add = function (object) {
            if (this.indexOf(object) === -1)
              this.push(object);
            return this;
          };

        changes.forEach(function (change) {
          changedObjects.add(change.object);
        });

        changedObjects.forEach(function (object) {
          if (!hasOwnProperty.call(object, '$loki'))
            return self.removeAutoUpdateObserver(object);
          try {
            self.update(object);
          } catch (err) {}
        });
      }

      this.observerCallback = observerCallback;

      /*
       * This method creates a clone of the current status of an object and associates operation and collection name,
       * so the parent db can aggregate and generate a changes object for the entire db
       */
      function createChange(name, op, obj) {
        self.changes.push({
          name: name,
          operation: op,
          obj: JSON.parse(JSON.stringify(obj))
        });
      }

      // clear all the changes
      function flushChanges() {
        self.changes = [];
      }

      this.getChanges = function () {
        return self.changes;
      };

      this.flushChanges = flushChanges;

      /**
       * If the changes API is disabled make sure only metadata is added without re-evaluating everytime if the changesApi is enabled
       */
      function insertMeta(obj) {
        if (!obj) {
          return;
        }
        if (!obj.meta) {
          obj.meta = {};
        }

        obj.meta.created = (new Date()).getTime();
        obj.meta.revision = 0;
      }

      function updateMeta(obj) {
        if (!obj) {
          return;
        }
        obj.meta.updated = (new Date()).getTime();
        obj.meta.revision += 1;
      }

      function createInsertChange(obj) {
        createChange(self.name, 'I', obj);
      }

      function createUpdateChange(obj) {
        createChange(self.name, 'U', obj);
      }

      function insertMetaWithChange(obj) {
        insertMeta(obj);
        createInsertChange(obj);
      }

      function updateMetaWithChange(obj) {
        updateMeta(obj);
        createUpdateChange(obj);
      }


      /* assign correct handler based on ChangesAPI flag */
      var insertHandler, updateHandler;

      function setHandlers() {
        insertHandler = self.disableChangesApi ? insertMeta : insertMetaWithChange;
        updateHandler = self.disableChangesApi ? updateMeta : updateMetaWithChange;
      }

      setHandlers();

      this.setChangesApi = function (enabled) {
        self.disableChangesApi = !enabled;
        setHandlers();
      };
      /**
       * built-in events
       */
      this.on('insert', function insertCallback(obj) {
        insertHandler(obj);
      });

      this.on('update', function updateCallback(obj) {
        updateHandler(obj);
      });

      this.on('delete', function deleteCallback(obj) {
        if (!self.disableChangesApi) {
          createChange(self.name, 'R', obj);
        }
      });

      this.on('warning', function (warning) {
        self.console.warn(warning);
      });
      // for de-serialization purposes
      flushChanges();
    }

    Collection.prototype = new LokiEventEmitter();

    Collection.prototype.console = {
      log: function () {},
      warn: function () {},
      error: function () {},
    };

    Collection.prototype.addAutoUpdateObserver = function (object) {
      if (!this.autoupdate || typeof Object.observe !== 'function')
        return;

      Object.observe(object, this.observerCallback, ['add', 'update', 'delete', 'reconfigure', 'setPrototype']);
    };

    Collection.prototype.removeAutoUpdateObserver = function (object) {
      if (!this.autoupdate || typeof Object.observe !== 'function')
        return;

      Object.unobserve(object, this.observerCallback);
    };

    /**
     * Adds a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {array} transform - an array of transformation 'step' objects to save into the collection
     * @memberof Collection
     */
    Collection.prototype.addTransform = function (name, transform) {
      if (this.transforms.hasOwnProperty(name)) {
        throw new Error("a transform by that name already exists");
      }

      this.transforms[name] = transform;
    };

    /**
     * Updates a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {object} transform - a transformation object to save into collection
     * @memberof Collection
     */
    Collection.prototype.setTransform = function (name, transform) {
      this.transforms[name] = transform;
    };

    /**
     * Removes a named collection transform from the collection
     * @param {string} name - name of collection transform to remove
     * @memberof Collection
     */
    Collection.prototype.removeTransform = function (name) {
      delete this.transforms[name];
    };

    Collection.prototype.byExample = function (template) {
      var k, obj, query;
      query = [];
      for (k in template) {
        if (!template.hasOwnProperty(k)) continue;
        query.push((
          obj = {},
          obj[k] = template[k],
          obj
        ));
      }
      return {
        '$and': query
      };
    };

    Collection.prototype.findObject = function (template) {
      return this.findOne(this.byExample(template));
    };

    Collection.prototype.findObjects = function (template) {
      return this.find(this.byExample(template));
    };

    /*----------------------------+
    | TTL daemon                  |
    +----------------------------*/
    Collection.prototype.ttlDaemonFuncGen = function () {
      var collection = this;
      var age = this.ttl.age;
      return function ttlDaemon() {
        var now = Date.now();
        var toRemove = collection.chain().where(function daemonFilter(member) {
          var timestamp = member.meta.updated || member.meta.created;
          var diff = now - timestamp;
          return age < diff;
        });
        toRemove.remove();
      };
    };

    Collection.prototype.setTTL = function (age, interval) {
      if (age < 0) {
        clearInterval(this.ttl.daemon);
      } else {
        this.ttl.age = age;
        this.ttl.ttlInterval = interval;
        this.ttl.daemon = setInterval(this.ttlDaemonFuncGen(), interval);
      }
    };

    /*----------------------------+
    | INDEXING                    |
    +----------------------------*/

    /**
     * create a row filter that covers all documents in the collection
     */
    Collection.prototype.prepareFullDocIndex = function () {
      var len = this.data.length;
      var indexes = new Array(len);
      for (var i = 0; i < len; i += 1) {
        indexes[i] = i;
      }
      return indexes;
    };

    /**
     * Will allow reconfiguring certain collection options.
     * @param {boolean} options.adaptiveBinaryIndices - collection indices will be actively rebuilt rather than lazily
     * @memberof Collection
     */
    Collection.prototype.configureOptions = function (options) {
      options = options || {};

      if (options.hasOwnProperty('adaptiveBinaryIndices')) {
        this.adaptiveBinaryIndices = options.adaptiveBinaryIndices;

        // if switching to adaptive binary indices, make sure none are 'dirty'
        if (this.adaptiveBinaryIndices) {
          this.ensureAllIndexes();
        }
      }
    };

    /**
     * Ensure binary index on a certain field
     * @param {string} property - name of property to create binary index on
     * @param {boolean=} force - (Optional) flag indicating whether to construct index immediately
     * @memberof Collection
     */
    Collection.prototype.ensureIndex = function (property, force) {
      // optional parameter to force rebuild whether flagged as dirty or not
      if (typeof (force) === 'undefined') {
        force = false;
      }

      if (property === null || property === undefined) {
        throw new Error('Attempting to set index without an associated property');
      }

      if (this.binaryIndices[property] && !force) {
        if (!this.binaryIndices[property].dirty) return;
      }

      var index = {
        'name': property,
        'dirty': true,
        'values': this.prepareFullDocIndex()
      };
      this.binaryIndices[property] = index;

      var wrappedComparer =
        (function (p, data) {
          return function (a, b) {
            var objAp = data[a][p],
              objBp = data[b][p];
            if (objAp !== objBp) {
              if (ltHelper(objAp, objBp, false)) return -1;
              if (gtHelper(objAp, objBp, false)) return 1;
            }
            return 0;
          };
        })(property, this.data);

      index.values.sort(wrappedComparer);
      index.dirty = false;

      this.dirty = true; // for autosave scenarios
    };

    Collection.prototype.getSequencedIndexValues = function (property) {
      var idx, idxvals = this.binaryIndices[property].values;
      var result = "";

      for (idx = 0; idx < idxvals.length; idx++) {
        result += " [" + idx + "] " + this.data[idxvals[idx]][property];
      }

      return result;
    };

    Collection.prototype.ensureUniqueIndex = function (field) {
      var index = this.constraints.unique[field];
      if (!index) {
        // keep track of new unique index for regenerate after database (re)load.
        if (this.uniqueNames.indexOf(field) == -1) {
          this.uniqueNames.push(field);
        }
      }

      // if index already existed, (re)loading it will likely cause collisions, rebuild always
      this.constraints.unique[field] = index = new UniqueIndex(field);
      this.data.forEach(function (obj) {
        index.set(obj);
      });
      return index;
    };

    /**
     * Ensure all binary indices
     */
    Collection.prototype.ensureAllIndexes = function (force) {
      var key, bIndices = this.binaryIndices;
      for (key in bIndices) {
        if (hasOwnProperty.call(bIndices, key)) {
          this.ensureIndex(key, force);
        }
      }
    };

    Collection.prototype.flagBinaryIndexesDirty = function () {
      var key, bIndices = this.binaryIndices;
      for (key in bIndices) {
        if (hasOwnProperty.call(bIndices, key)) {
          bIndices[key].dirty = true;
        }
      }
    };

    Collection.prototype.flagBinaryIndexDirty = function (index) {
      if (this.binaryIndices[index])
        this.binaryIndices[index].dirty = true;
    };

    /**
     * Quickly determine number of documents in collection (or query)
     * @param {object=} query - (optional) query object to count results of
     * @returns {number} number of documents in the collection
     * @memberof Collection
     */
    Collection.prototype.count = function (query) {
      if (!query) {
        return this.data.length;
      }

      return this.chain().find(query).filteredrows.length;
    };

    /**
     * Rebuild idIndex
     */
    Collection.prototype.ensureId = function () {
      var len = this.data.length,
        i = 0;

      this.idIndex = [];
      for (i; i < len; i += 1) {
        this.idIndex.push(this.data[i].$loki);
      }
    };

    /**
     * Rebuild idIndex async with callback - useful for background syncing with a remote server
     */
    Collection.prototype.ensureIdAsync = function (callback) {
      this.async(function () {
        this.ensureId();
      }, callback);
    };

    /**
     * Add a dynamic view to the collection
     * @param {string} name - name of dynamic view to add
     * @param {object=} options - (optional) options to configure dynamic view with
     * @param {boolean} options.persistent - indicates if view is to main internal results array in 'resultdata'
     * @param {string} options.sortPriority - 'passive' (sorts performed on call to data) or 'active' (after updates)
     * @param {number} options.minRebuildInterval - minimum rebuild interval (need clarification to docs here)
     * @returns {DynamicView} reference to the dynamic view added
     * @memberof Collection
     **/

    Collection.prototype.addDynamicView = function (name, options) {
      var dv = new DynamicView(this, name, options);
      this.DynamicViews.push(dv);

      return dv;
    };

    /**
     * Remove a dynamic view from the collection
     * @param {string} name - name of dynamic view to remove
     * @memberof Collection
     **/
    Collection.prototype.removeDynamicView = function (name) {
      for (var idx = 0; idx < this.DynamicViews.length; idx++) {
        if (this.DynamicViews[idx].name === name) {
          this.DynamicViews.splice(idx, 1);
        }
      }
    };

    /**
     * Look up dynamic view reference from within the collection
     * @param {string} name - name of dynamic view to retrieve reference of
     * @returns {DynamicView} A reference to the dynamic view with that name
     * @memberof Collection
     **/
    Collection.prototype.getDynamicView = function (name) {
      for (var idx = 0; idx < this.DynamicViews.length; idx++) {
        if (this.DynamicViews[idx].name === name) {
          return this.DynamicViews[idx];
        }
      }

      return null;
    };

    /**
     * Applies a 'mongo-like' find query object and passes all results to an update function.
     * For filter function querying you should migrate to [updateWhere()]{@link Collection#updateWhere}.
     *
     * @param {object|function} filterObject - 'mongo-like' query object (or deprecated filterFunction mode)
     * @param {function} updateFunction - update function to run against filtered documents
     * @memberof Collection
     */
    Collection.prototype.findAndUpdate = function (filterObject, updateFunction) {
      if (typeof (filterObject) === "function") {
        this.updateWhere(filterObject, updateFunction);
      }
      else {
        this.chain().find(filterObject).update(updateFunction);
      }
    };

    /**
     * Applies a 'mongo-like' find query object removes all documents which match that filter.
     *
     * @param {object} filterObject - 'mongo-like' query object
     * @memberof Collection
     */
    Collection.prototype.findAndRemove = function(filterObject) {
      this.chain().find(filterObject).remove();
    };

    /**
     * Adds object(s) to collection, ensure object(s) have meta properties, clone it if necessary, etc.
     * @param {(object|array)} doc - the document (or array of documents) to be inserted
     * @returns {(object|array)} document or documents inserted
     * @memberof Collection
     */
    Collection.prototype.insert = function (doc) {
      if (!Array.isArray(doc)) {
        return this.insertOne(doc);
      }

      // holder to the clone of the object inserted if collections is set to clone objects
      var obj;
      var results = [];

      this.emit('pre-insert', doc);
      for (var i = 0, len = doc.length; i < len; i++) {
        obj = this.insertOne(doc[i], true);
        if (!obj) {
          return undefined;
        }
        results.push(obj);
      }
      this.emit('insert', doc);
      return results.length === 1 ? results[0] : results;
    };

    /**
     * Adds a single object, ensures it has meta properties, clone it if necessary, etc.
     * @param {object} doc - the document to be inserted
     * @param {boolean} bulkInsert - quiet pre-insert and insert event emits
     * @returns {object} document or 'undefined' if there was a problem inserting it
     * @memberof Collection
     */
    Collection.prototype.insertOne = function (doc, bulkInsert) {
      var err = null;
      var returnObj;

      if (typeof doc !== 'object') {
        err = new TypeError('Document needs to be an object');
      } else if (doc === null) {
        err = new TypeError('Object cannot be null');
      }

      if (err !== null) {
        this.emit('error', err);
        throw err;
      }

      // if configured to clone, do so now... otherwise just use same obj reference
      var obj = this.cloneObjects ? clone(doc, this.cloneMethod) : doc;

      if (typeof obj.meta === 'undefined') {
        obj.meta = {
          revision: 0,
          created: 0
        };
      }

      // if cloning, give user back clone of 'cloned' object with $loki and meta
      returnObj = this.cloneObjects ? clone(obj, this.cloneMethod) : obj;

      // allow pre-insert to modify actual collection reference even if cloning
      if (!bulkInsert) {
        this.emit('pre-insert', obj);
      }
      if (!this.add(obj)) {
        return undefined;
      }

      this.addAutoUpdateObserver(returnObj);
      if (!bulkInsert) {
        this.emit('insert', returnObj);
      }
      return returnObj;
    };

    /**
     * Empties the collection.
     * @memberof Collection
     */
    Collection.prototype.clear = function () {
      this.data = [];
      this.idIndex = [];
      this.binaryIndices = {};
      this.cachedIndex = null;
      this.cachedBinaryIndex = null;
      this.cachedData = null;
      this.maxId = 0;
      this.DynamicViews = [];
      this.dirty = true;
    };

    /**
     * Updates an object and notifies collection that the document has changed.
     * @param {object} doc - document to update within the collection
     * @memberof Collection
     */
    Collection.prototype.update = function (doc) {
      if (Array.isArray(doc)) {
        var k = 0,
          len = doc.length;
        for (k; k < len; k += 1) {
          this.update(doc[k]);
        }
        return;
      }

      // verify object is a properly formed document
      if (!hasOwnProperty.call(doc, '$loki')) {
        throw new Error('Trying to update unsynced document. Please save the document first by using insert() or addMany()');
      }
      try {
        this.startTransaction();
        var arr = this.get(doc.$loki, true),
          oldInternal,   // ref to existing obj
          newInternal, // ref to new internal obj
          position,
          self = this;

        if (!arr) {
          throw new Error('Trying to update a document not in collection.');
        }

        oldInternal = arr[0]; // -internal- obj ref
        position = arr[1]; // position in data array

        // if configured to clone, do so now... otherwise just use same obj reference
        newInternal = this.cloneObjects ? clone(doc, this.cloneMethod) : doc;

        this.emit('pre-update', doc);

        Object.keys(this.constraints.unique).forEach(function (key) {
          self.constraints.unique[key].update(oldInternal, newInternal);
        });

        // operate the update
        this.data[position] = newInternal;

        if (newInternal !== doc) {
          this.addAutoUpdateObserver(doc);
        }

        // now that we can efficiently determine the data[] position of newly added document,
        // submit it for all registered DynamicViews to evaluate for inclusion/exclusion
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].evaluateDocument(position, false);
        }

        var key;
        if (this.adaptiveBinaryIndices) {
          // for each binary index defined in collection, immediately update rather than flag for lazy rebuild
          var bIndices = this.binaryIndices;
          for (key in bIndices) {
            this.adaptiveBinaryIndexUpdate(position, key);
          }
        }
        else {
          this.flagBinaryIndexesDirty();
        }

        this.idIndex[position] = newInternal.$loki;
        //this.flagBinaryIndexesDirty();

        this.commit();
        this.dirty = true; // for autosave scenarios

        this.emit('update', doc, this.cloneObjects ? clone(oldInternal, this.cloneMethod) : null);
        return doc;
      } catch (err) {
        this.rollback();
        this.console.error(err.message);
        this.emit('error', err);
        throw (err); // re-throw error so user does not think it succeeded
      }
    };

    /**
     * Add object to collection
     */
    Collection.prototype.add = function (obj) {
      // if parameter isn't object exit with throw
      if ('object' !== typeof obj) {
        throw new TypeError('Object being added needs to be an object');
      }
      // if object you are adding already has id column it is either already in the collection
      // or the object is carrying its own 'id' property.  If it also has a meta property,
      // then this is already in collection so throw error, otherwise rename to originalId and continue adding.
      if (typeof (obj.$loki) !== 'undefined') {
        throw new Error('Document is already in collection, please use update()');
      }

      /*
       * try adding object to collection
       */
      try {
        this.startTransaction();
        this.maxId++;

        if (isNaN(this.maxId)) {
          this.maxId = (this.data[this.data.length - 1].$loki + 1);
        }

        obj.$loki = this.maxId;
        obj.meta.version = 0;

        var key, constrUnique = this.constraints.unique;
        for (key in constrUnique) {
          if (hasOwnProperty.call(constrUnique, key)) {
            constrUnique[key].set(obj);
          }
        }

        // add new obj id to idIndex
        this.idIndex.push(obj.$loki);

        // add the object
        this.data.push(obj);

        var addedPos = this.data.length - 1;

        // now that we can efficiently determine the data[] position of newly added document,
        // submit it for all registered DynamicViews to evaluate for inclusion/exclusion
        var dvlen = this.DynamicViews.length;
        for (var i = 0; i < dvlen; i++) {
          this.DynamicViews[i].evaluateDocument(addedPos, true);
        }

        if (this.adaptiveBinaryIndices) {
          // for each binary index defined in collection, immediately update rather than flag for lazy rebuild
          var bIndices = this.binaryIndices;
          for (key in bIndices) {
            this.adaptiveBinaryIndexInsert(addedPos, key);
          }
        }
        else {
          this.flagBinaryIndexesDirty();
        }

        this.commit();
        this.dirty = true; // for autosave scenarios

        return (this.cloneObjects) ? (clone(obj, this.cloneMethod)) : (obj);
      } catch (err) {
        this.rollback();
        this.console.error(err.message);
        this.emit('error', err);
        throw (err); // re-throw error so user does not think it succeeded
      }
    };

    /**
     * Applies a filter function and passes all results to an update function.
     *
     * @param {function} filterFunction - filter function whose results will execute update
     * @param {function} updateFunction - update function to run against filtered documents
     * @memberof Collection
     */
    Collection.prototype.updateWhere = function(filterFunction, updateFunction) {
      var results = this.where(filterFunction),
        i = 0,
        obj;
      try {
        for (i; i < results.length; i++) {
          obj = updateFunction(results[i]);
          this.update(obj);
        }

      } catch (err) {
        this.rollback();
        this.console.error(err.message);
      }
    };

    /**
     * Remove all documents matching supplied filter function.
     * For 'mongo-like' querying you should migrate to [findAndRemove()]{@link Collection#findAndRemove}.
     * @param {function|object} query - query object to filter on
     * @memberof Collection
     */
    Collection.prototype.removeWhere = function (query) {
      var list;
      if (typeof query === 'function') {
        list = this.data.filter(query);
        this.remove(list);
      } else {
        this.chain().find(query).remove();
      }
    };

    Collection.prototype.removeDataOnly = function () {
      this.remove(this.data.slice());
    };

    /**
     * Remove a document from the collection
     * @param {object} doc - document to remove from collection
     * @memberof Collection
     */
    Collection.prototype.remove = function (doc) {
      if (typeof doc === 'number') {
        doc = this.get(doc);
      }

      if ('object' !== typeof doc) {
        throw new Error('Parameter is not an object');
      }
      if (Array.isArray(doc)) {
        var k = 0,
          len = doc.length;
        for (k; k < len; k += 1) {
          this.remove(doc[k]);
        }
        return;
      }

      if (!hasOwnProperty.call(doc, '$loki')) {
        throw new Error('Object is not a document stored in the collection');
      }

      try {
        this.startTransaction();
        var arr = this.get(doc.$loki, true),
          // obj = arr[0],
          position = arr[1];
        var self = this;
        Object.keys(this.constraints.unique).forEach(function (key) {
          if (doc[key] !== null && typeof doc[key] !== 'undefined') {
            self.constraints.unique[key].remove(doc[key]);
          }
        });
        // now that we can efficiently determine the data[] position of newly added document,
        // submit it for all registered DynamicViews to remove
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].removeDocument(position);
        }

        if (this.adaptiveBinaryIndices) {
          // for each binary index defined in collection, immediately update rather than flag for lazy rebuild
          var key, bIndices = this.binaryIndices;
          for (key in bIndices) {
            this.adaptiveBinaryIndexRemove(position, key);
          }
        }
        else {
          this.flagBinaryIndexesDirty();
        }

        this.data.splice(position, 1);
        this.removeAutoUpdateObserver(doc);

        // remove id from idIndex
        this.idIndex.splice(position, 1);

        this.commit();
        this.dirty = true; // for autosave scenarios
        this.emit('delete', arr[0]);
        delete doc.$loki;
        delete doc.meta;
        return doc;

      } catch (err) {
        this.rollback();
        this.console.error(err.message);
        this.emit('error', err);
        return null;
      }
    };

    /*---------------------+
    | Finding methods     |
    +----------------------*/

    /**
     * Get by Id - faster than other methods because of the searching algorithm
     * @param {int} id - $loki id of document you want to retrieve
     * @param {boolean} returnPosition - if 'true' we will return [object, position]
     * @returns {(object|array|null)} Object reference if document was found, null if not,
     *     or an array if 'returnPosition' was passed.
     * @memberof Collection
     */
    Collection.prototype.get = function (id, returnPosition) {
      var retpos = returnPosition || false,
        data = this.idIndex,
        max = data.length - 1,
        min = 0,
        mid = (min + max) >> 1;

      id = typeof id === 'number' ? id : parseInt(id, 10);

      if (isNaN(id)) {
        throw new TypeError('Passed id is not an integer');
      }

      while (data[min] < data[max]) {
        mid = (min + max) >> 1;

        if (data[mid] < id) {
          min = mid + 1;
        } else {
          max = mid;
        }
      }

      if (max === min && data[min] === id) {
        if (retpos) {
          return [this.data[min], min];
        }
        return this.data[min];
      }
      return null;

    };

    /**
     * Perform binary range lookup for the data[dataPosition][binaryIndexName] property value
     *    Since multiple documents may contain the same value (which the index is sorted on),
     *    we hone in on range and then linear scan range to find exact index array position.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.getBinaryIndexPosition = function(dataPosition, binaryIndexName) {
      var val = this.data[dataPosition][binaryIndexName];
      var index = this.binaryIndices[binaryIndexName].values;

      // i think calculateRange can probably be moved to collection
      // as it doesn't seem to need resultset.  need to verify
      //var rs = new Resultset(this, null, null);
      var range = this.calculateRange("$eq", binaryIndexName, val);

      if (range[0] === 0 && range[1] === -1) {
        // uhoh didn't find range
        return null;
      }

      var min = range[0];
      var max = range[1];

      // narrow down the sub-segment of index values
      // where the indexed property value exactly matches our
      // value and then linear scan to find exact -index- position
      for(var idx = min; idx <= max; idx++) {
        if (index[idx] === dataPosition) return idx;
      }

      // uhoh
      return null;
    };

    /**
     * Adaptively insert a selected item to the index.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.adaptiveBinaryIndexInsert = function(dataPosition, binaryIndexName) {
      var index = this.binaryIndices[binaryIndexName].values;
      var val = this.data[dataPosition][binaryIndexName];
      //var rs = new Resultset(this, null, null);
      var idxPos = this.calculateRangeStart(binaryIndexName, val);

      // insert new data index into our binary index at the proper sorted location for relevant property calculated by idxPos.
      // doing this after adjusting dataPositions so no clash with previous item at that position.
      this.binaryIndices[binaryIndexName].values.splice(idxPos, 0, dataPosition);
    };

    /**
     * Adaptively update a selected item within an index.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.adaptiveBinaryIndexUpdate = function(dataPosition, binaryIndexName) {
      // linear scan needed to find old position within index unless we optimize for clone scenarios later
      // within (my) node 5.6.0, the following for() loop with strict compare is -much- faster than indexOf()
      var idxPos,
        index = this.binaryIndices[binaryIndexName].values,
        len=index.length;

      for(idxPos=0; idxPos < len; idxPos++) {
        if (index[idxPos] === dataPosition) break;
      }

      //var idxPos = this.binaryIndices[binaryIndexName].values.indexOf(dataPosition);
      this.binaryIndices[binaryIndexName].values.splice(idxPos, 1);

      //this.adaptiveBinaryIndexRemove(dataPosition, binaryIndexName, true);
      this.adaptiveBinaryIndexInsert(dataPosition, binaryIndexName);
    };

    /**
     * Adaptively remove a selected item from the index.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.adaptiveBinaryIndexRemove = function(dataPosition, binaryIndexName, removedFromIndexOnly) {
      var idxPos = this.getBinaryIndexPosition(dataPosition, binaryIndexName);
      var index = this.binaryIndices[binaryIndexName].values;
      var len,
        idx;

      if (idxPos === null) {
        // throw new Error('unable to determine binary index position');
        return null;
      }

      // remove document from index
      this.binaryIndices[binaryIndexName].values.splice(idxPos, 1);

      // if we passed this optional flag parameter, we are calling from adaptiveBinaryIndexUpdate,
      // in which case data positions stay the same.
      if (removedFromIndexOnly === true) {
        return;
      }

      // since index stores data array positions, if we remove a document
      // we need to adjust array positions -1 for all document positions greater than removed position
      len = index.length;
      for (idx = 0; idx < len; idx++) {
        if (index[idx] > dataPosition) {
          index[idx]--;
        }
      }
    };

    /**
     * Internal method used for index maintenance.  Given a prop (index name), and a value
     * (which may or may not yet exist) this will find the proper location where it can be added.
     */
    Collection.prototype.calculateRangeStart = function (prop, val) {
      var rcd = this.data;
      var index = this.binaryIndices[prop].values;
      var min = 0;
      var max = index.length - 1;
      var mid = 0;

      if (index.length === 0) {
        return 0;
      }

      var minVal = rcd[index[min]][prop];
      var maxVal = rcd[index[max]][prop];

      // hone in on start position of value
      while (min < max) {
        mid = (min + max) >> 1;

        if (ltHelper(rcd[index[mid]][prop], val, false)) {
          min = mid + 1;
        } else {
          max = mid;
        }
      }

      var lbound = min;

      if (ltHelper(rcd[index[lbound]][prop], val, false)) {
        return lbound+1;
      }
      else {
        return lbound;
      }
    };

    /**
     * Internal method used for indexed $between.  Given a prop (index name), and a value
     * (which may or may not yet exist) this will find the final position of that upper range value.
     */
    Collection.prototype.calculateRangeEnd = function (prop, val) {
      var rcd = this.data;
      var index = this.binaryIndices[prop].values;
      var min = 0;
      var max = index.length - 1;
      var mid = 0;

      if (index.length === 0) {
        return 0;
      }

      var minVal = rcd[index[min]][prop];
      var maxVal = rcd[index[max]][prop];

      // hone in on start position of value
      while (min < max) {
        mid = (min + max) >> 1;

        if (ltHelper(val, rcd[index[mid]][prop], false)) {
          max = mid;
        } else {
          min = mid + 1;
        }
      }

      var ubound = max;

      if (gtHelper(rcd[index[ubound]][prop], val, false)) {
        return ubound-1;
      }
      else {
        return ubound;
      }
    };

    /**
     * calculateRange() - Binary Search utility method to find range/segment of values matching criteria.
     *    this is used for collection.find() and first find filter of resultset/dynview
     *    slightly different than get() binary search in that get() hones in on 1 value,
     *    but we have to hone in on many (range)
     * @param {string} op - operation, such as $eq
     * @param {string} prop - name of property to calculate range for
     * @param {object} val - value to use for range calculation.
     * @returns {array} [start, end] index array positions
     */
    Collection.prototype.calculateRange = function (op, prop, val) {
      var rcd = this.data;
      var index = this.binaryIndices[prop].values;
      var min = 0;
      var max = index.length - 1;
      var mid = 0;

      // when no documents are in collection, return empty range condition
      if (rcd.length === 0) {
        return [0, -1];
      }
      
      var minVal = rcd[index[min]][prop];
      var maxVal = rcd[index[max]][prop];

      // if value falls outside of our range return [0, -1] to designate no results
      switch (op) {
      case '$eq':
      case '$aeq':
        if (ltHelper(val, minVal, false) || gtHelper(val, maxVal, false)) {
          return [0, -1];
        }
        break;
      case '$dteq':
        if (ltHelper(val, minVal, false) || gtHelper(val, maxVal, false)) {
          return [0, -1];
        }
        break;
      case '$gt':
        if (gtHelper(val, maxVal, true)) {
          return [0, -1];
        }
        break;
      case '$gte':
        if (gtHelper(val, maxVal, false)) {
          return [0, -1];
        }
        break;
      case '$lt':
        if (ltHelper(val, minVal, true)) {
          return [0, -1];
        }
        if (ltHelper(maxVal, val, false)) {
          return [0, rcd.length - 1];
        }
        break;
      case '$lte':
        if (ltHelper(val, minVal, false)) {
          return [0, -1];
        }
        if (ltHelper(maxVal, val, true)) {
          return [0, rcd.length - 1];
        }
        break;
      case '$between':
        return ([this.calculateRangeStart(prop, val[0]), this.calculateRangeEnd(prop, val[1])]);
      case '$in':
        var idxset = [],
          segResult = [];
        // query each value '$eq' operator and merge the seqment results.
        for (var j = 0, len = val.length; j < len; j++) {
            var seg = this.calculateRange('$eq', prop, val[j]);

            for (var i = seg[0]; i <= seg[1]; i++) {
                if (idxset[i] === undefined) {
                    idxset[i] = true;
                    segResult.push(i);
                }
            }
        }
        return segResult;
      }

      // hone in on start position of value
      while (min < max) {
        mid = (min + max) >> 1;

        if (ltHelper(rcd[index[mid]][prop], val, false)) {
          min = mid + 1;
        } else {
          max = mid;
        }
      }

      var lbound = min;

      // do not reset min, as the upper bound cannot be prior to the found low bound
      max = index.length - 1;

      // hone in on end position of value
      while (min < max) {
        mid = (min + max) >> 1;

        if (ltHelper(val, rcd[index[mid]][prop], false)) {
          max = mid;
        } else {
          min = mid + 1;
        }
      }

      var ubound = max;

      var lval = rcd[index[lbound]][prop];
      var uval = rcd[index[ubound]][prop];

      switch (op) {
      case '$eq':
        if (lval !== val) {
          return [0, -1];
        }
        if (uval !== val) {
          ubound--;
        }

        return [lbound, ubound];
      case '$dteq':
        if (lval > val || lval < val) {
          return [0, -1];
        }
        if (uval > val || uval < val) {
          ubound--;
        }

        return [lbound, ubound];


      case '$gt':
        if (ltHelper(uval, val, true)) {
          return [0, -1];
        }

        return [ubound, rcd.length - 1];

      case '$gte':
        if (ltHelper(lval, val, false)) {
          return [0, -1];
        }

        return [lbound, rcd.length - 1];

      case '$lt':
        if (lbound === 0 && ltHelper(lval, val, false)) {
          return [0, 0];
        }
        return [0, lbound - 1];

      case '$lte':
        if (uval !== val) {
          ubound--;
        }

        if (ubound === 0 && ltHelper(uval, val, false)) {
          return [0, 0];
        }
        return [0, ubound];

      default:
        return [0, rcd.length - 1];
      }
    };

    /**
     * Retrieve doc by Unique index
     * @param {string} field - name of uniquely indexed property to use when doing lookup
     * @param {value} value - unique value to search for
     * @returns {object} document matching the value passed
     * @memberof Collection
     */
    Collection.prototype.by = function (field, value) {
      var self;
      if (value === undefined) {
        self = this;
        return function (value) {
          return self.by(field, value);
        };
      }

      var result = this.constraints.unique[field].get(value);
      if (!this.cloneObjects) {
        return result;
      } else {
        return clone(result, this.cloneMethod);
      }
    };

    /**
     * Find one object by index property, by property equal to value
     * @param {object} query - query object used to perform search with
     * @returns {(object|null)} First matching document, or null if none
     * @memberof Collection
     */
    Collection.prototype.findOne = function (query) {
      query = query || {};

      // Instantiate Resultset and exec find op passing firstOnly = true param
      var result = new Resultset(this, {
        queryObj: query,
        firstOnly: true
      });

      if (Array.isArray(result) && result.length === 0) {
        return null;
      } else {
        if (!this.cloneObjects) {
          return result;
        } else {
          return clone(result, this.cloneMethod);
        }
      }
    };

    /**
     * Chain method, used for beginning a series of chained find() and/or view() operations
     * on a collection.
     *
     * @param {array} transform - Ordered array of transform step objects similar to chain
     * @param {object} parameters - Object containing properties representing parameters to substitute
     * @returns {Resultset} (this) resultset, or data array if any map or join functions where called
     * @memberof Collection
     */
    Collection.prototype.chain = function (transform, parameters) {
      var rs = new Resultset(this);

      if (typeof transform === 'undefined') {
        return rs;
      }

      return rs.transform(transform, parameters);
    };

    /**
     * Find method, api is similar to mongodb.
     * for more complex queries use [chain()]{@link Collection#chain} or [where()]{@link Collection#where}.
     * @example {@tutorial Query Examples}
     * @param {object} query - 'mongo-like' query object
     * @returns {array} Array of matching documents
     * @memberof Collection
     */
    Collection.prototype.find = function (query) {
      if (typeof (query) === 'undefined') {
        query = 'getAll';
      }

      var results = new Resultset(this, {
        queryObj: query
      });
      if (!this.cloneObjects) {
        return results;
      } else {
        return cloneObjectArray(results, this.cloneMethod);
      }
    };

    /**
     * Find object by unindexed field by property equal to value,
     * simply iterates and returns the first element matching the query
     */
    Collection.prototype.findOneUnindexed = function (prop, value) {
      var i = this.data.length,
        doc;
      while (i--) {
        if (this.data[i][prop] === value) {
          doc = this.data[i];
          return doc;
        }
      }
      return null;
    };

    /**
     * Transaction methods
     */

    /** start the transation */
    Collection.prototype.startTransaction = function () {
      if (this.transactional) {
        this.cachedData = clone(this.data, this.cloneMethod);
        this.cachedIndex = this.idIndex;
        this.cachedBinaryIndex = this.binaryIndices;

        // propagate startTransaction to dynamic views
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].startTransaction();
        }
      }
    };

    /** commit the transation */
    Collection.prototype.commit = function () {
      if (this.transactional) {
        this.cachedData = null;
        this.cachedIndex = null;
        this.cachedBinaryIndex = null;

        // propagate commit to dynamic views
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].commit();
        }
      }
    };

    /** roll back the transation */
    Collection.prototype.rollback = function () {
      if (this.transactional) {
        if (this.cachedData !== null && this.cachedIndex !== null) {
          this.data = this.cachedData;
          this.idIndex = this.cachedIndex;
          this.binaryIndices = this.cachedBinaryIndex;
        }

        // propagate rollback to dynamic views
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].rollback();
        }
      }
    };

    // async executor. This is only to enable callbacks at the end of the execution.
    Collection.prototype.async = function (fun, callback) {
      setTimeout(function () {
        if (typeof fun === 'function') {
          fun();
          callback();
        } else {
          throw new TypeError('Argument passed for async execution is not a function');
        }
      }, 0);
    };

    /**
     * Query the collection by supplying a javascript filter function.
     * @example
     * var results = coll.where(function(obj) {
     *   return obj.legs === 8;
     * });
     *
     * @param {function} fun - filter function to run against all collection docs
     * @returns {array} all documents which pass your filter function
     * @memberof Collection
     */
    Collection.prototype.where = function (fun) {
      var results = new Resultset(this, {
        queryFunc: fun
      });
      if (!this.cloneObjects) {
        return results;
      } else {
        return cloneObjectArray(results, this.cloneMethod);
      }
    };

    /**
     * Map Reduce operation
     *
     * @param {function} mapFunction - function to use as map function
     * @param {function} reduceFunction - function to use as reduce function
     * @returns {data} The result of your mapReduce operation
     * @memberof Collection
     */
    Collection.prototype.mapReduce = function (mapFunction, reduceFunction) {
      try {
        return reduceFunction(this.data.map(mapFunction));
      } catch (err) {
        throw err;
      }
    };

    /**
     * Join two collections on specified properties
     *
     * @param {array} joinData - array of documents to 'join' to this collection
     * @param {string} leftJoinProp - property name in collection
     * @param {string} rightJoinProp - property name in joinData
     * @param {function=} mapFun - (Optional) map function to use
     * @returns {Resultset} Result of the mapping operation
     * @memberof Collection
     */
    Collection.prototype.eqJoin = function (joinData, leftJoinProp, rightJoinProp, mapFun) {
      // logic in Resultset class
      return new Resultset(this).eqJoin(joinData, leftJoinProp, rightJoinProp, mapFun);
    };

    /* ------ STAGING API -------- */
    /**
     * stages: a map of uniquely identified 'stages', which hold copies of objects to be
     * manipulated without affecting the data in the original collection
     */
    Collection.prototype.stages = {};

    /**
     * (Staging API) create a stage and/or retrieve it
     * @memberof Collection
     */
    Collection.prototype.getStage = function (name) {
      if (!this.stages[name]) {
        this.stages[name] = {};
      }
      return this.stages[name];
    };
    /**
     * a collection of objects recording the changes applied through a commmitStage
     */
    Collection.prototype.commitLog = [];

    /**
     * (Staging API) create a copy of an object and insert it into a stage
     * @memberof Collection
     */
    Collection.prototype.stage = function (stageName, obj) {
      var copy = JSON.parse(JSON.stringify(obj));
      this.getStage(stageName)[obj.$loki] = copy;
      return copy;
    };

    /**
     * (Staging API) re-attach all objects to the original collection, so indexes and views can be rebuilt
     * then create a message to be inserted in the commitlog
     * @param {string} stageName - name of stage
     * @param {string} message
     * @memberof Collection
     */
    Collection.prototype.commitStage = function (stageName, message) {
      var stage = this.getStage(stageName),
        prop,
        timestamp = new Date().getTime();

      for (prop in stage) {

        this.update(stage[prop]);
        this.commitLog.push({
          timestamp: timestamp,
          message: message,
          data: JSON.parse(JSON.stringify(stage[prop]))
        });
      }
      this.stages[stageName] = {};
    };

    Collection.prototype.no_op = function () {
      return;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.extract = function (field) {
      var i = 0,
        len = this.data.length,
        isDotNotation = isDeepProperty(field),
        result = [];
      for (i; i < len; i += 1) {
        result.push(deepProperty(this.data[i], field, isDotNotation));
      }
      return result;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.max = function (field) {
      return Math.max.apply(null, this.extract(field));
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.min = function (field) {
      return Math.min.apply(null, this.extract(field));
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.maxRecord = function (field) {
      var i = 0,
        len = this.data.length,
        deep = isDeepProperty(field),
        result = {
          index: 0,
          value: undefined
        },
        max;

      for (i; i < len; i += 1) {
        if (max !== undefined) {
          if (max < deepProperty(this.data[i], field, deep)) {
            max = deepProperty(this.data[i], field, deep);
            result.index = this.data[i].$loki;
          }
        } else {
          max = deepProperty(this.data[i], field, deep);
          result.index = this.data[i].$loki;
        }
      }
      result.value = max;
      return result;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.minRecord = function (field) {
      var i = 0,
        len = this.data.length,
        deep = isDeepProperty(field),
        result = {
          index: 0,
          value: undefined
        },
        min;

      for (i; i < len; i += 1) {
        if (min !== undefined) {
          if (min > deepProperty(this.data[i], field, deep)) {
            min = deepProperty(this.data[i], field, deep);
            result.index = this.data[i].$loki;
          }
        } else {
          min = deepProperty(this.data[i], field, deep);
          result.index = this.data[i].$loki;
        }
      }
      result.value = min;
      return result;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.extractNumerical = function (field) {
      return this.extract(field).map(parseBase10).filter(Number).filter(function (n) {
        return !(isNaN(n));
      });
    };

    /**
     * Calculates the average numerical value of a property
     *
     * @param {string} field - name of property in docs to average
     * @returns {number} average of property in all docs in the collection
     * @memberof Collection
     */
    Collection.prototype.avg = function (field) {
      return average(this.extractNumerical(field));
    };

    /**
     * Calculate standard deviation of a field
     * @memberof Collection
     * @param {string} field
     */
    Collection.prototype.stdDev = function (field) {
      return standardDeviation(this.extractNumerical(field));
    };

    /**
     * @memberof Collection
     * @param {string} field
     */
    Collection.prototype.mode = function (field) {
      var dict = {},
        data = this.extract(field);
      data.forEach(function (obj) {
        if (dict[obj]) {
          dict[obj] += 1;
        } else {
          dict[obj] = 1;
        }
      });
      var max,
        prop, mode;
      for (prop in dict) {
        if (max) {
          if (max < dict[prop]) {
            mode = prop;
          }
        } else {
          mode = prop;
          max = dict[prop];
        }
      }
      return mode;
    };

    /**
     * @memberof Collection
     * @param {string} field - property name
     */
    Collection.prototype.median = function (field) {
      var values = this.extractNumerical(field);
      values.sort(sub);

      var half = Math.floor(values.length / 2);

      if (values.length % 2) {
        return values[half];
      } else {
        return (values[half - 1] + values[half]) / 2.0;
      }
    };

    /**
     * General utils, including statistical functions
     */
    function isDeepProperty(field) {
      return field.indexOf('.') !== -1;
    }

    function parseBase10(num) {
      return parseFloat(num, 10);
    }

    function isNotUndefined(obj) {
      return obj !== undefined;
    }

    function add(a, b) {
      return a + b;
    }

    function sub(a, b) {
      return a - b;
    }

    function median(values) {
      values.sort(sub);
      var half = Math.floor(values.length / 2);
      return (values.length % 2) ? values[half] : ((values[half - 1] + values[half]) / 2.0);
    }

    function average(array) {
      return (array.reduce(add, 0)) / array.length;
    }

    function standardDeviation(values) {
      var avg = average(values);
      var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      return stdDev;
    }

    function deepProperty(obj, property, isDeep) {
      if (isDeep === false) {
        // pass without processing
        return obj[property];
      }
      var pieces = property.split('.'),
        root = obj;
      while (pieces.length > 0) {
        root = root[pieces.shift()];
      }
      return root;
    }

    function binarySearch(array, item, fun) {
      var lo = 0,
        hi = array.length,
        compared,
        mid;
      while (lo < hi) {
        mid = (lo + hi) >> 1;
        compared = fun.apply(null, [item, array[mid]]);
        if (compared === 0) {
          return {
            found: true,
            index: mid
          };
        } else if (compared < 0) {
          hi = mid;
        } else {
          lo = mid + 1;
        }
      }
      return {
        found: false,
        index: hi
      };
    }

    function BSonSort(fun) {
      return function (array, item) {
        return binarySearch(array, item, fun);
      };
    }

    function KeyValueStore() {}

    KeyValueStore.prototype = {
      keys: [],
      values: [],
      sort: function (a, b) {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
      },
      setSort: function (fun) {
        this.bs = new BSonSort(fun);
      },
      bs: function () {
        return new BSonSort(this.sort);
      },
      set: function (key, value) {
        var pos = this.bs(this.keys, key);
        if (pos.found) {
          this.values[pos.index] = value;
        } else {
          this.keys.splice(pos.index, 0, key);
          this.values.splice(pos.index, 0, value);
        }
      },
      get: function (key) {
        return this.values[binarySearch(this.keys, key, this.sort).index];
      }
    };

    function UniqueIndex(uniqueField) {
      this.field = uniqueField;
      this.keyMap = {};
      this.lokiMap = {};
    }
    UniqueIndex.prototype.keyMap = {};
    UniqueIndex.prototype.lokiMap = {};
    UniqueIndex.prototype.set = function (obj) {
      var fieldValue = obj[this.field];
      if (fieldValue !== null && typeof (fieldValue) !== 'undefined') {
        if (this.keyMap[fieldValue]) {
          throw new Error('Duplicate key for property ' + this.field + ': ' + fieldValue);
        } else {
          this.keyMap[fieldValue] = obj;
          this.lokiMap[obj.$loki] = fieldValue;
        }
      }
    };
    UniqueIndex.prototype.get = function (key) {
      return this.keyMap[key];
    };

    UniqueIndex.prototype.byId = function (id) {
      return this.keyMap[this.lokiMap[id]];
    };
    /**
     * Updates a document's unique index given an updated object.
     * @param  {Object} obj Original document object
     * @param  {Object} doc New document object (likely the same as obj)
     */
    UniqueIndex.prototype.update = function (obj, doc) {
      if (this.lokiMap[obj.$loki] !== doc[this.field]) {
        var old = this.lokiMap[obj.$loki];
        this.set(doc);
        // make the old key fail bool test, while avoiding the use of delete (mem-leak prone)
        this.keyMap[old] = undefined;
      } else {
        this.keyMap[obj[this.field]] = doc;
      }
    };
    UniqueIndex.prototype.remove = function (key) {
      var obj = this.keyMap[key];
      if (obj !== null && typeof obj !== 'undefined') {
        this.keyMap[key] = undefined;
        this.lokiMap[obj.$loki] = undefined;
      } else {
        throw new Error('Key is not in unique index: ' + this.field);
      }
    };
    UniqueIndex.prototype.clear = function () {
      this.keyMap = {};
      this.lokiMap = {};
    };

    function ExactIndex(exactField) {
      this.index = {};
      this.field = exactField;
    }

    // add the value you want returned to the key in the index
    ExactIndex.prototype = {
      set: function add(key, val) {
        if (this.index[key]) {
          this.index[key].push(val);
        } else {
          this.index[key] = [val];
        }
      },

      // remove the value from the index, if the value was the last one, remove the key
      remove: function remove(key, val) {
        var idxSet = this.index[key];
        for (var i in idxSet) {
          if (idxSet[i] == val) {
            idxSet.splice(i, 1);
          }
        }
        if (idxSet.length < 1) {
          this.index[key] = undefined;
        }
      },

      // get the values related to the key, could be more than one
      get: function get(key) {
        return this.index[key];
      },

      // clear will zap the index
      clear: function clear(key) {
        this.index = {};
      }
    };

    function SortedIndex(sortedField) {
      this.field = sortedField;
    }

    SortedIndex.prototype = {
      keys: [],
      values: [],
      // set the default sort
      sort: function (a, b) {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
      },
      bs: function () {
        return new BSonSort(this.sort);
      },
      // and allow override of the default sort
      setSort: function (fun) {
        this.bs = new BSonSort(fun);
      },
      // add the value you want returned  to the key in the index
      set: function (key, value) {
        var pos = binarySearch(this.keys, key, this.sort);
        if (pos.found) {
          this.values[pos.index].push(value);
        } else {
          this.keys.splice(pos.index, 0, key);
          this.values.splice(pos.index, 0, [value]);
        }
      },
      // get all values which have a key == the given key
      get: function (key) {
        var bsr = binarySearch(this.keys, key, this.sort);
        if (bsr.found) {
          return this.values[bsr.index];
        } else {
          return [];
        }
      },
      // get all values which have a key < the given key
      getLt: function (key) {
        var bsr = binarySearch(this.keys, key, this.sort);
        var pos = bsr.index;
        if (bsr.found) pos--;
        return this.getAll(key, 0, pos);
      },
      // get all values which have a key > the given key
      getGt: function (key) {
        var bsr = binarySearch(this.keys, key, this.sort);
        var pos = bsr.index;
        if (bsr.found) pos++;
        return this.getAll(key, pos, this.keys.length);
      },

      // get all vals from start to end
      getAll: function (key, start, end) {
        var results = [];
        for (var i = start; i < end; i++) {
          results = results.concat(this.values[i]);
        }
        return results;
      },
      // just in case someone wants to do something smart with ranges
      getPos: function (key) {
        return binarySearch(this.keys, key, this.sort);
      },
      // remove the value from the index, if the value was the last one, remove the key
      remove: function (key, value) {
        var pos = binarySearch(this.keys, key, this.sort).index;
        var idxSet = this.values[pos];
        for (var i in idxSet) {
          if (idxSet[i] == value) idxSet.splice(i, 1);
        }
        if (idxSet.length < 1) {
          this.keys.splice(pos, 1);
          this.values.splice(pos, 1);
        }
      },
      // clear will zap the index
      clear: function () {
        this.keys = [];
        this.values = [];
      }
    };


    Loki.LokiOps = LokiOps;
    Loki.Collection = Collection;
    Loki.KeyValueStore = KeyValueStore;
    Loki.LokiMemoryAdapter = LokiMemoryAdapter;
    Loki.LokiPartitioningAdapter = LokiPartitioningAdapter;
    Loki.LokiLocalStorageAdapter = LokiLocalStorageAdapter;
    Loki.LokiFsAdapter = LokiFsAdapter;
    Loki.persistenceAdapters = {
      fs: LokiFsAdapter,
      localStorage: LokiLocalStorageAdapter
    };
    return Loki;
  }());

}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(0)))

/***/ }),

/***/ 181:
/***/ (function(module, exports) {

module.exports = "[\n    {\n        \"type\":\"Executive\",\n        \"name\":\"Ann Brown\",\n        \"title\":\"CEO\",\n        \"phone\":\"(512)456-5555\",\n        \"ext\":\"\",\n        \"fax\":\"(512)456-5555\",\n        \"email\":\"Executive\"\n    },\n    {\n        \"type\":\"Executive\",\n        \"name\":\"Ann Brown\",\n        \"title\":\"CEO\",\n        \"phone\":\"(512)456-5555\",\n        \"ext\":\"\",\n        \"fax\":\"(512)456-5555\",\n        \"email\":\"Executive\"\n    },\n    {\n        \"type\":\"Inmar\",\n        \"name\":\"Mary Smith\",\n        \"title\":\"Lorem Ipsum\",\n        \"phone\":\"(512)456-5555\",\n        \"ext\":\"\",\n        \"fax\":\"(512)456-5555\",\n        \"email\":\"Immar Ar\"\n    },\n    {\n        \"type\":\"Executive\",\n        \"name\":\"John Doe\",\n        \"title\":\"Dolor Sit\",\n        \"phone\":\"(512)456-5555\",\n        \"ext\":\"\",\n        \"fax\":\"(512)456-5555\",\n        \"email\":\"Daily\"\n    },\n    {\n        \"type\":\"Daily\",\n        \"name\":\"John Doe\",\n        \"title\":\"Dolor Sit amet\",\n        \"phone\":\"(512)456-5555\",\n        \"ext\":\"\",\n        \"fax\":\"(512)456-5555\",\n        \"email\":\"Daily\"\n    },\n    {\n        \"type\":\"Other\",\n        \"name\":\"John Doe\",\n        \"title\":\"Lorem Ipsum\",\n        \"phone\":\"(512)456-5555\",\n        \"ext\":\"\",\n        \"fax\":\"(512)456-5555\",\n        \"email\":\"Other\"\n    }\n]\n"

/***/ }),

/***/ 182:
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAQAAADY4iz3AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAAA0AAAANABzi0JoAAAEFSURBVBjTNdC/alNhAIbx3/edpGeQlJqElIihpqKYpfYPyRXoUEe33pdXUOjolqXQG2glUnDQkkKVgIRoIDQIpsnJ6ZD2Wd/lfZ5gxYZXqgrmxq7cQkDijabgkaW+vjzBri0hlYFUFlQVjaJNzzmu/D5oBFrJqPNpA03laItS+Pi6XL/cf1c8b6/Xjl6m8CI4VKCVfOk8qViKk+FOb5Djf1SA79lRz1JcLj5cDnKwFi2glZzsi8RC921j9fUuGlMK5+1SdTJ8f/pvXK5/3UthHP1imnevJ8Od3tm8fTH9+/lmBj8DDjwjNXvwWg2+JRhJPM0eUmTkrv2QP+ap2FYTZf7om8A9PrJPoYpSXtIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTEtMDItMTRUMTE6MTI6MTUrMDI6MDD7C2qGAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDExLTAyLTE0VDExOjEyOjE1KzAyOjAwilbSOgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII="

/***/ }),

/***/ 183:
/***/ (function(module, exports) {

module.exports = "data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPDw8IqKiuDg4EZGRnp6egAAAFhYWCQkJKysrL6+vhQUFJycnAQEBDY2NmhoaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFdyAgAgIJIeWoAkRCCMdBkKtIHIngyMKsErPBYbADpkSCwhDmQCBethRB6Vj4kFCkQPG4IlWDgrNRIwnO4UKBXDufzQvDMaoSDBgFb886MiQadgNABAokfCwzBA8LCg0Egl8jAggGAA1kBIA1BAYzlyILczULC2UhACH5BAkKAAAALAAAAAAQABAAAAV2ICACAmlAZTmOREEIyUEQjLKKxPHADhEvqxlgcGgkGI1DYSVAIAWMx+lwSKkICJ0QsHi9RgKBwnVTiRQQgwF4I4UFDQQEwi6/3YSGWRRmjhEETAJfIgMFCnAKM0KDV4EEEAQLiF18TAYNXDaSe3x6mjidN1s3IQAh+QQJCgAAACwAAAAAEAAQAAAFeCAgAgLZDGU5jgRECEUiCI+yioSDwDJyLKsXoHFQxBSHAoAAFBhqtMJg8DgQBgfrEsJAEAg4YhZIEiwgKtHiMBgtpg3wbUZXGO7kOb1MUKRFMysCChAoggJCIg0GC2aNe4gqQldfL4l/Ag1AXySJgn5LcoE3QXI3IQAh+QQJCgAAACwAAAAAEAAQAAAFdiAgAgLZNGU5joQhCEjxIssqEo8bC9BRjy9Ag7GILQ4QEoE0gBAEBcOpcBA0DoxSK/e8LRIHn+i1cK0IyKdg0VAoljYIg+GgnRrwVS/8IAkICyosBIQpBAMoKy9dImxPhS+GKkFrkX+TigtLlIyKXUF+NjagNiEAIfkECQoAAAAsAAAAABAAEAAABWwgIAICaRhlOY4EIgjH8R7LKhKHGwsMvb4AAy3WODBIBBKCsYA9TjuhDNDKEVSERezQEL0WrhXucRUQGuik7bFlngzqVW9LMl9XWvLdjFaJtDFqZ1cEZUB0dUgvL3dgP4WJZn4jkomWNpSTIyEAIfkECQoAAAAsAAAAABAAEAAABX4gIAICuSxlOY6CIgiD8RrEKgqGOwxwUrMlAoSwIzAGpJpgoSDAGifDY5kopBYDlEpAQBwevxfBtRIUGi8xwWkDNBCIwmC9Vq0aiQQDQuK+VgQPDXV9hCJjBwcFYU5pLwwHXQcMKSmNLQcIAExlbH8JBwttaX0ABAcNbWVbKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICSRBlOY7CIghN8zbEKsKoIjdFzZaEgUBHKChMJtRwcWpAWoWnifm6ESAMhO8lQK0EEAV3rFopIBCEcGwDKAqPh4HUrY4ICHH1dSoTFgcHUiZjBhAJB2AHDykpKAwHAwdzf19KkASIPl9cDgcnDkdtNwiMJCshACH5BAkKAAAALAAAAAAQABAAAAV3ICACAkkQZTmOAiosiyAoxCq+KPxCNVsSMRgBsiClWrLTSWFoIQZHl6pleBh6suxKMIhlvzbAwkBWfFWrBQTxNLq2RG2yhSUkDs2b63AYDAoJXAcFRwADeAkJDX0AQCsEfAQMDAIPBz0rCgcxky0JRWE1AmwpKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICKZzkqJ4nQZxLqZKv4NqNLKK2/Q4Ek4lFXChsg5ypJjs1II3gEDUSRInEGYAw6B6zM4JhrDAtEosVkLUtHA7RHaHAGJQEjsODcEg0FBAFVgkQJQ1pAwcDDw8KcFtSInwJAowCCA6RIwqZAgkPNgVpWndjdyohACH5BAkKAAAALAAAAAAQABAAAAV5ICACAimc5KieLEuUKvm2xAKLqDCfC2GaO9eL0LABWTiBYmA06W6kHgvCqEJiAIJiu3gcvgUsscHUERm+kaCxyxa+zRPk0SgJEgfIvbAdIAQLCAYlCj4DBw0IBQsMCjIqBAcPAooCBg9pKgsJLwUFOhCZKyQDA3YqIQAh+QQJCgAAACwAAAAAEAAQAAAFdSAgAgIpnOSonmxbqiThCrJKEHFbo8JxDDOZYFFb+A41E4H4OhkOipXwBElYITDAckFEOBgMQ3arkMkUBdxIUGZpEb7kaQBRlASPg0FQQHAbEEMGDSVEAA1QBhAED1E0NgwFAooCDWljaQIQCE5qMHcNhCkjIQAh+QQJCgAAACwAAAAAEAAQAAAFeSAgAgIpnOSoLgxxvqgKLEcCC65KEAByKK8cSpA4DAiHQ/DkKhGKh4ZCtCyZGo6F6iYYPAqFgYy02xkSaLEMV34tELyRYNEsCQyHlvWkGCzsPgMCEAY7Cg04Uk48LAsDhRA8MVQPEF0GAgqYYwSRlycNcWskCkApIyEAOwAAAAAAAAAAAA=="

/***/ }),

/***/ 184:
/***/ (function(module, exports) {

module.exports = function (app) {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name reyramos.utilities
	 *
	 *
	 * @description
	 * A factory, to provide useful utilities within the Application
	 *
	 */

	app.factory('utilities', UtilitiesFactory);

	UtilitiesFactory.$inject = ['$location', '$rootScope', '$document'];

	/**
	 * @ngdoc object
	 * @name reyramos.utilities.utilities
	 *
	 *
	 * @description
	 * A factory, to provide useful utilities within the Application
	 *
	 */
	function UtilitiesFactory($location, $rootScope, $document) {

		String.prototype.capitalize = function () {
			return this.replace(/(?:^|\s)\S/g, function (a) {
				return a.toUpperCase();
			});
		};

		var utilities = {},
			_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


		utilities.getArgs = function () {
			var a = [];
			for (var i in arguments) a.push(arguments[i]);
			return a;
		};


		utilities.addEvent = function (elem, type, eventHandle) {
			if (elem == null || typeof(elem) == 'undefined') return;
			if (elem.addEventListener) {
				elem.addEventListener(type, eventHandle, false);
			} else if (elem.attachEvent) {
				elem.attachEvent("on" + type, eventHandle);
			} else {
				elem["on" + type] = eventHandle;
			}
		}

		utilities.jsonParse = function (obj) {

			if (typeof (obj) !== "object") {
				try {
					return JSON.parse(obj)
				} catch (e) {
					console.error('ERROR: Cannot parse a non JSON string')
				}
			}

			return obj
		}

		utilities.isNumeric = function (num) {
			return !isNaN(num) ? Number(num) : num;
		};

		utilities.getUniqueId = function () {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Date.now().toString()
		}

		utilities.strcasecmp = function (f_string1, f_string2) {
			//  discuss at: http://phpjs.org/functions/strcasecmp/
			// original by: Martijn Wieringa
			// bugfixed by: Onno Marsman
			//   example 1: strcasecmp('Hello', 'hello');
			//   returns 1: 0

			var string1 = String(f_string1 + '').toLowerCase();
			var string2 = String(f_string2 + '').toLowerCase();
			if (string1 > string2) {
				return 1;
			} else if (string1 == string2) {
				return 0;
			}
			return -1;
		}

		utilities.scrub = function (obj) {
			Object.keys(obj).forEach(function (key) {
				if (typeof obj[key] === 'object')
					scrub(obj[key])
				if (utilities.empty(obj[key]))
					delete obj[key];
			});
			return obj;
		}

		utilities.safeApply = function (fn) {
			var phase = $rootScope.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				$rootScope.$apply(fn);
			}
		};


		/**
		 * Test the validity of an object key in reference
		 * Example
		 * old way of doing things
		 * if(obj.key.exist)
		 *
		 * new way : getObjData(obj, 'key.exist'); return boolean
		 *
		 * @param obj
		 * @param string
		 * @returns {boolean}
		 */
		utilities.getObjData = function (obj, string) {

			if (typeof string !== 'string')return false;

			var re = /\[|\]|\./g,
				jsonParts = string.trim().split(re),
				result = "";

			jsonParts = jsonParts.filter(function (v) {
				return v !== ''
			});


			if (obj && jsonParts.length > 0 && obj.hasOwnProperty(jsonParts[0])) {
				result = obj[jsonParts[0]];
				jsonParts.splice(0, 1);
				if (jsonParts.length > 0)
					result = utilities.getObjData(result, jsonParts.join('.'));
			}

			return result;
		}


		utilities.findElement = function (string) {
			return angular.element($document[0].querySelector(string))
		};


		utilities.getPosition = function (ele) {
			var rect = null;
			try {
				rect = ele.getBoundingClientRect();

			} catch (e) {
				rect = ele[0].getBoundingClientRect();
			}

			var rectTop = rect.top + window.pageYOffset - document.documentElement.clientTop;
			var rectLeft = rect.left + window.pageXOffset - document.documentElement.clientLeft;

			return {top: rectTop, left: rectLeft};

		}


		utilities.getDocumentHeight = function () {
			if (document.viewport && document.viewport.getHeight() > 0) {
				return document.viewport.getHeight();
			}
			if (document.all) {
				return document.body.offsetHeight;
			}
			if (document.layers) {
				return window.innerHeight;
			}
			if (document.getElementById) {
				return window.innerHeight;
			}
			return 0;
		}

		utilities.getDocumentWidth = function () {
			if (document.viewport && document.viewport.getWidth() > 0) {
				return document.viewport.getWidth();
			}
			if (document.all) {
				return document.body.offsetWidth;
			}
			if (document.layers) {
				return window.innerWidth;
			}
			if (document.getElementById) {
				return window.innerWidth;
			}
			return 0;
		}

		utilities.isIE8orlower = function () {

			var msg = "0";
			var ver = this.getInternetExplorerVersion();
			if (ver > -1) {
				if (ver >= 9.0)
					msg = 0
				else
					msg = 1;
			}
			return msg;
			// alert(msg);
		}


		///**
		// * @ngdoc method
		// * @name utilities#path
		// * @methodOf reyramos.utilities.utilities
		// * @kind function
		// *
		// * @description
		// * Functionality of Angular $location.path() to add the necessary prefix
		// * base on html5mode(true|false)
		// *
		// * @param {string} route - change angular path
		// */
		//utilities.path = function (route) {
		//
		//	var path = (!$location['$$html5']) ? "/#" + route : (route ? route : "");
		//	$location.path(path)
		//
		//}

		/**
		 * @ngdoc method
		 * @name utilities#getBoolean
		 * @methodOf reyramos.utilities.utilities
		 * @kind function
		 *
		 * @description
		 * Return configSetting from init request call
		 *
		 * @param {Object} value to test
		 * @returns {boolean} return a true or false
		 */
		utilities.getBoolean = function (value) {
			if (typeof value == 'undefined') {
				value = false;
			}

			if (typeof value != 'boolean') {
				switch (value.toString().toLowerCase()) {
					case 'true':
					case 'yes':
					case 'ok':
					case '1':
						value = true;
						break;

					case 'false':
					case 'no':
					case 'failed':
					case '0':
						value = false;
						break;

					default:
						value = new Boolean(value).valueOf();
						break
				}
			}
			return value;
		}


		/**
		 * @ngdoc function
		 * @name utilities#arrayUnique
		 * @methodOf reyramos.utilities.utilities
		 *
		 * @description
		 * Send a mix array of values to get unique array by key
		 *
		 * @param {Object|Array} array todo more notes
		 * @returns {Object|Array} array todo more notes
		 */
		utilities.arrayUnique = function (array) {
			var a = array.concat();
			for (var i = 0; i < a.length; ++i) {
				for (var j = i + 1; j < a.length; ++j) {
					if (a[i] === a[j]) {
						a.splice(j--, 1);
					}
				}
			}
			return a;
		}
		/**
		 * @ngdoc function
		 * @name utilities#arrayIntersection
		 * @methodOf reyramos.utilities.utilities
		 *
		 * @description
		 * Merge two array into one
		 *
		 * @param {ArrayObject|Array} x todo more notes
		 * @param {ArrayObject|Array} y todo more notes
		 * @returns {ArrayObject|Array} get one array
		 */
		utilities.arrayIntersection = function (x, y) {
			var ret = [];
			for (var i = 0; i < x.length; i++) {
				for (var z = 0; z < y.length; z++) {
					if (x[i] == y[z]) {
						ret.push(i);
						break;
					}
				}
			}
			return ret;
		}
		/**
		 * @ngdoc function
		 * @name utilities#isEmpty
		 * @methodOf reyramos.utilities.utilities
		 *
		 * @description
		 * This function checks if an object is empty
		 *
		 * EXAMPLE USES:
		 * isEmpty("") // True
		 * isEmpty([]) // True
		 * isEmpty({}) // True
		 * isEmpty({length: 0, custom_property: []}) // True
		 * isEmpty("Hello") // False
		 * isEmpty([1,2,3]) // False
		 * isEmpty({test: 1}) // False
		 * isEmpty({length: 3, custom_property: [1,2,3]}) // False
		 *
		 * @returns {boolean} boolean
		 */
		utilities.isEmpty = function (object) {

			// null and undefined are empty
			if (object === null || typeof(object) == 'undefined') {
				return true;
			}

			// Assume if it has a length property with a non-zero value
			// that that property is correct.
			if (Object.keys(object).length && Object.keys(object).length > 0) {
				return false;
			}
			if (Object.keys(object).length === 0) {
				return true;
			}
			for (var key in object) {
				if (hasOwnProperty.call(object, key)) {
					return false;
				}
			}
			// Doesn't handle toString and toValue enumeration bugs in IE < 9
			return true;
		}

		/**
		 * @ngdoc function
		 * @name utilities#isEmpty
		 * @methodOf ngGoodies.utilities.utilities
		 *
		 * @description
		 * This function checks if an object is empty
		 *
		 * EXAMPLE USES:
		 * isEmpty("") // True
		 * isEmpty([]) // True
		 * isEmpty({}) // True
		 * isEmpty({length: 0, custom_property: []}) // True
		 * isEmpty("Hello") // False
		 * isEmpty([1,2,3]) // False
		 * isEmpty({test: 1}) // False
		 * isEmpty({length: 3, custom_property: [1,2,3]}) // False
		 *
		 * @returns {boolean} boolean
		 */
		utilities.empty = function (mixed_var) {
			//  discuss at: http://phpjs.org/functions/empty/
			// original by: Philippe Baumann
			//    input by: Onno Marsman
			//    input by: LH
			//    input by: Stoyan Kyosev (http://www.svest.org/)
			// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Onno Marsman
			// improved by: Francesco
			// improved by: Marc Jansen
			// improved by: Rafal Kukawski
			//   example 1: empty(null);
			//   returns 1: true
			//   example 2: empty(undefined);
			//   returns 2: true
			//   example 3: empty([]);
			//   returns 3: true
			//   example 4: empty({});
			//   returns 4: true
			//   example 5: empty({'aFunc' : function () { alert('humpty'); } });
			//   returns 5: false

			var undef, key, i, len;
			var emptyValues = [undef, null, false, 0, '', '0'];

			for (i = 0, len = emptyValues.length; i < len; i++) {
				if (mixed_var === emptyValues[i]) {
					return true;
				}
			}

			if (typeof mixed_var === 'object') {
				for (key in mixed_var) {
					// TODO: should we check for own properties only?
					//if (mixed_var.hasOwnProperty(key)) {
					return false;
					//}
				}
				return true;
			}

			return false;
		}
		/**
		 * @ngdoc function
		 * @name utilities#isValidEmail
		 * @methodOf reyramos.utilities.utilities
		 *
		 * @description
		 * Test if email send passes regular expression if its a valid email
		 *
		 * @returns {boolean} boolean
		 */
		utilities.isValidEmail = function (email) {
			var re =
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}

		/**
		 * This function is here to deal with an issue that
		 *
		 TEMPORARY FIX, angular.copy() is supposed to strip out the hashKey values, but currently is not.
		 There is a pull request,
		 https://github.com/angular/angular.js/pull/2423
		 https://github.com/angular/angular.js/pull/2382
		 *
		 */
		function isWindow(obj) {
			return obj && obj.document && obj.location && obj.alert && obj.setInterval;
		}


		function isScope(obj) {
			return obj && obj.$evalAsync && obj.$watch;
		}


		/**
		 * @ngdoc function
		 * @name utilities#utf8_encode
		 * @methodOf reyramos.utilities.utilities
		 *
		 * @description
		 * Return UTF8 of a string
		 * Taken from http://phpjs.org/functions/utf8_encode/
		 *
		 * @param {String} argString todo more notes
		 * @returns {String} argString todo more notes
		 */
		utilities.utf8_encode = function (argString) {
			if (argString === null || typeof argString === "undefined") {
				return "";
			}

			var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			var utftext = '',
				start, end, stringl = 0;

			start = end = 0;
			stringl = string.length;
			for (var n = 0; n < stringl; n++) {
				var c1 = string.charCodeAt(n);
				var enc = null;

				if (c1 < 128) {
					end++;
				} else if (c1 > 127 && c1 < 2048) {
					enc = String.fromCharCode(
						(c1 >> 6) | 192, (c1 & 63) | 128
					);
				} else if (c1 & 0xF800 != 0xD800) {
					enc = String.fromCharCode(
						(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
					);
				} else { // surrogate pairs
					if (c1 & 0xFC00 != 0xD800) {
						throw new RangeError("Unmatched trail surrogate at " + n);
					}
					var c2 = string.charCodeAt(++n);
					if (c2 & 0xFC00 != 0xDC00) {
						throw new RangeError("Unmatched lead surrogate at " + (n - 1));
					}
					c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
					enc = String.fromCharCode(
						(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (
						c1 & 63) | 128
					);
				}
				if (enc !== null) {
					if (end > start) {
						utftext += string.slice(start, end);
					}
					utftext += enc;
					start = end = n + 1;
				}
			}

			if (end > start) {
				utftext += string.slice(start, stringl);
			}

			return utftext;
		}


		/**
		 * @ngdoc function
		 * @name utilities#preventDefault
		 * @methodOf reyramos.utilities.utilities
		 *
		 * @description
		 * Stops event.stopPropagation() for the passing element
		 *
		 * @param {element} event todo more notes
		 */
		utilities.preventDefault = function (event) {

			event.preventDefault();

			if (event && event.stopPropagation) {
				event.stopPropagation();
			} else {
				event = window.event;
				event.cancelBubble = true;
			}
		}
		utilities.str_replace = function (search, replace, subject, count) {
			//  discuss at: http://phpjs.org/functions/str_replace/
			// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Gabriel Paderni
			// improved by: Philip Peterson
			// improved by: Simon Willison (http://simonwillison.net)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Onno Marsman
			// improved by: Brett Zamir (http://brett-zamir.me)
			//  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
			// bugfixed by: Anton Ongson
			// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// bugfixed by: Oleg Eremeev
			//    input by: Onno Marsman
			//    input by: Brett Zamir (http://brett-zamir.me)
			//    input by: Oleg Eremeev
			//        note: The count parameter must be passed as a string in order
			//        note: to find a global variable in which the result will be given
			//   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
			//   returns 1: 'Kevin.van.Zonneveld'
			//   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
			//   returns 2: 'hemmo, mars'
			// bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
			//   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
			//   returns 3: 'AxDxAxDx'
			// bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca) Corrected count
			//   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , 'cnt');
			//   returns 4: 'xSyFxSyF' // cnt = 0 (incorrect before fix)
			//   returns 4: 'xSyFxSyF' // cnt = 4 (correct after fix)

			var i = 0,
				j = 0,
				temp = '',
				repl = '',
				sl = 0,
				fl = 0,
				f = [].concat(search),
				r = [].concat(replace),
				s = subject,
				ra = Object.prototype.toString.call(r) === '[object Array]',
				sa = Object.prototype.toString.call(s) === '[object Array]';
			s = [].concat(s);

			if (typeof(search) === 'object' && typeof(replace) === 'string') {
				temp = replace;
				replace = new Array();
				for (i = 0; i < search.length; i += 1) {
					replace[i] = temp;
				}
				temp = '';
				r = [].concat(replace);
				ra = Object.prototype.toString.call(r) === '[object Array]';
			}

			if (count) {
				this.window[count] = 0;
			}

			for (i = 0, sl = s.length; i < sl; i++) {
				if (s[i] === '') {
					continue;
				}
				for (j = 0, fl = f.length; j < fl; j++) {
					temp = s[i] + '';
					repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
					s[i] = (temp).split(f[j]).join(repl);
					if (count) {
						this.window[count] += ((temp.split(f[j])).length - 1);
					}
				}
			}
			return sa ? s : s[0];
		}


		// public method for encoding
		utilities.encode = function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			input = this.utf8_encode(input);

			while (i < input.length) {

				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4);

			}

			return output;
		}

		utilities.decode = function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {

				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

			}

			output = this.utf8_decode(output);

			return output;

		}
		utilities.basename = function (path, suffix) {
			//  discuss at: http://phpjs.org/functions/basename/
			// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Ash Searle (http://hexmen.com/blog/)
			// improved by: Lincoln Ramsay
			// improved by: djmix
			// improved by: Dmitry Gorelenkov
			//   example 1: basename('/www/site/home.htm', '.htm');
			//   returns 1: 'home'
			//   example 2: basename('ecra.php?p=1');
			//   returns 2: 'ecra.php?p=1'
			//   example 3: basename('/some/path/');
			//   returns 3: 'path'
			//   example 4: basename('/some/path_ext.ext/','.ext');
			//   returns 4: 'path_ext'

			var b = path;
			var lastChar = b.charAt(b.length - 1);

			if (lastChar === '/' || lastChar === '\\') {
				b = b.slice(0, -1);
			}

			b = b.replace(/^.*[\/\\]/g, '');

			if (typeof suffix === 'string' && b.substr(b.length - suffix.length) ==
				suffix) {
				b = b.substr(0, b.length - suffix.length);
			}

			return b;
		}

		utilities.grep = function (elems, callback, invert) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		}


		utilities.pathinfo = function (path, options) {
			//  discuss at: http://phpjs.org/functions/pathinfo/
			// original by: Nate
			//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Brett Zamir (http://brett-zamir.me)
			// improved by: Dmitry Gorelenkov
			//    input by: Timo
			//        note: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
			//        note: The way the bitwise arguments are handled allows for greater flexibility
			//        note: & compatability. We might even standardize this code and use a similar approach for
			//        note: other bitwise PHP functions
			//        note: php.js tries very hard to stay away from a core.js file with global dependencies, because we like
			//        note: that you can just take a couple of functions and be on your way.
			//        note: But by way we implemented this function, if you want you can still declare the PATHINFO_*
			//        note: yourself, and then you can use: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
			//        note: which makes it fully compliant with PHP syntax.
			//  depends on: basename
			//   example 1: pathinfo('/www/htdocs/index.html', 1);
			//   returns 1: '/www/htdocs'
			//   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME');
			//   returns 2: 'index.html'
			//   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION');
			//   returns 3: 'html'
			//   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME');
			//   returns 4: 'index'
			//   example 5: pathinfo('/www/htdocs/index.html', 2 | 4);
			//   returns 5: {basename: 'index.html', extension: 'html'}
			//   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL');
			//   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
			//   example 7: pathinfo('/www/htdocs/index.html');
			//   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}

			var opt = '',
				real_opt = '',
				optName = '',
				optTemp = 0,
				tmp_arr = {},
				cnt = 0,
				i = 0;
			var have_basename = false,
				have_extension = false,
				have_filename = false;

			// Input defaulting & sanitation
			if (!path) {
				return false;
			}
			if (!options) {
				options = 'PATHINFO_ALL';
			}

			// Initialize binary arguments. Both the string & integer (constant) input is
			// allowed
			var OPTS = {
				'PATHINFO_DIRNAME': 1,
				'PATHINFO_BASENAME': 2,
				'PATHINFO_EXTENSION': 4,
				'PATHINFO_FILENAME': 8,
				'PATHINFO_ALL': 0
			};
			// PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
			for (optName in OPTS) {
				if (OPTS.hasOwnProperty(optName)) {
					OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
				}
			}
			if (typeof options !== 'number') {
				// Allow for a single string or an array of string flags
				options = [].concat(options);
				for (i = 0; i < options.length; i++) {
					// Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
					if (OPTS[options[i]]) {
						optTemp = optTemp | OPTS[options[i]];
					}
				}
				options = optTemp;
			}

			// Internal Functions
			var __getExt = function (path) {
				var str = path + '';
				var dotP = str.lastIndexOf('.') + 1;
				return !dotP ? false : dotP !== str.length ? str.substr(dotP) : '';
			};

			// Gather path infos
			if (options & OPTS.PATHINFO_DIRNAME) {
				var dirName = path.replace(/\\/g, '/')
					.replace(/\/[^\/]*\/?$/, ''); // dirname
				tmp_arr.dirname = dirName === path ? '.' : dirName;
			}

			if (options & OPTS.PATHINFO_BASENAME) {
				if (false === have_basename) {
					have_basename = this.basename(path);
				}
				tmp_arr.basename = have_basename;
			}

			if (options & OPTS.PATHINFO_EXTENSION) {
				if (false === have_basename) {
					have_basename = this.basename(path);
				}
				if (false === have_extension) {
					have_extension = __getExt(have_basename);
				}
				if (false !== have_extension) {
					tmp_arr.extension = have_extension;
				}
			}

			if (options & OPTS.PATHINFO_FILENAME) {
				if (false === have_basename) {
					have_basename = this.basename(path);
				}
				if (false === have_extension) {
					have_extension = __getExt(have_basename);
				}
				if (false === have_filename) {
					have_filename = have_basename.slice(0, have_basename.length - (
							have_extension ? have_extension.length + 1 :
								have_extension === false ? 0 : 1));
				}

				tmp_arr.filename = have_filename;
			}

			// If array contains only 1 element: return string
			cnt = 0;
			for (opt in tmp_arr) {
				if (tmp_arr.hasOwnProperty(opt)) {
					cnt++;
					real_opt = opt;
				}
			}
			if (cnt === 1) {
				return tmp_arr[real_opt];
			}

			// Return full-blown array
			return tmp_arr;
		}


		/**
		 * @ngdoc function
		 * @name utilities#md5
		 * @methodOf reyramos.utilities.utilities
		 *
		 * @description
		 * Create MD5 string
		 *
		 * @param {String} argString todo more notes
		 * @returns {String} argString todo more notes
		 *
		 */
		utilities.md5 = function (str) {
			var xl;

			var rotateLeft = function (lValue, iShiftBits) {
				return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
			};

			var addUnsigned = function (lX, lY) {
				var lX4, lY4, lX8, lY8, lResult;
				lX8 = (lX & 0x80000000);
				lY8 = (lY & 0x80000000);
				lX4 = (lX & 0x40000000);
				lY4 = (lY & 0x40000000);
				lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
				if (lX4 & lY4) {
					return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
				}
				if (lX4 | lY4) {
					if (lResult & 0x40000000) {
						return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
					} else {
						return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
					}
				} else {
					return (lResult ^ lX8 ^ lY8);
				}
			};

			var _F = function (x, y, z) {
				return (x & y) | ((~x) & z);
			};
			var _G = function (x, y, z) {
				return (x & z) | (y & (~z));
			};
			var _H = function (x, y, z) {
				return (x ^ y ^ z);
			};
			var _I = function (x, y, z) {
				return (y ^ (x | (~z)));
			};

			var _FF = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var _GG = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var _HH = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var _II = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var convertToWordArray = function (str) {
				var lWordCount;
				var lMessageLength = str.length;
				var lNumberOfWords_temp1 = lMessageLength + 8;
				var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (
					lNumberOfWords_temp1 % 64)) / 64;
				var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
				var lWordArray = new Array(lNumberOfWords - 1);
				var lBytePosition = 0;
				var lByteCount = 0;
				while (lByteCount < lMessageLength) {
					lWordCount = (lByteCount - (lByteCount % 4)) / 4;
					lBytePosition = (lByteCount % 4) * 8;
					lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(
						lByteCount) << lBytePosition));
					lByteCount++;
				}
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 <<
					lBytePosition);
				lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
				lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
				return lWordArray;
			};

			var wordToHex = function (lValue) {
				var wordToHexValue = "",
					wordToHexValue_temp = "",
					lByte, lCount;
				for (lCount = 0; lCount <= 3; lCount++) {
					lByte = (lValue >>> (lCount * 8)) & 255;
					wordToHexValue_temp = "0" + lByte.toString(16);
					wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(
							wordToHexValue_temp.length - 2, 2);
				}
				return wordToHexValue;
			};

			var x = [],
				k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
				S12 = 12,
				S13 = 17,
				S14 = 22,
				S21 = 5,
				S22 = 9,
				S23 = 14,
				S24 = 20,
				S31 = 4,
				S32 = 11,
				S33 = 16,
				S34 = 23,
				S41 = 6,
				S42 = 10,
				S43 = 15,
				S44 = 21;

			str = this.utf8_encode(str);
			x = convertToWordArray(str);
			a = 0x67452301;
			b = 0xEFCDAB89;
			c = 0x98BADCFE;
			d = 0x10325476;

			xl = x.length;
			for (k = 0; k < xl; k += 16) {
				AA = a;
				BB = b;
				CC = c;
				DD = d;
				a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
				d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
				c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
				b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
				a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
				d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
				c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
				b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
				a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
				d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
				c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
				b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
				a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
				d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
				c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
				b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
				a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
				d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
				c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
				b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
				a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
				d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
				c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
				b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
				a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
				d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
				c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
				b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
				a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
				d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
				c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
				b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
				a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
				d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
				c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
				b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
				a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
				d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
				c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
				b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
				a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
				d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
				c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
				b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
				a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
				d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
				c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
				b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
				a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
				d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
				c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
				b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
				a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
				d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
				c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
				b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
				a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
				d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
				c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
				b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
				a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
				d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
				c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
				b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
				a = addUnsigned(a, AA);
				b = addUnsigned(b, BB);
				c = addUnsigned(c, CC);
				d = addUnsigned(d, DD);
			}

			var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

			return temp.toLowerCase();
		}

		/**
		 * @ngdoc method
		 * @name utilities#utf8_encode
		 * @methodOf reyramos.utilities.utilities
		 * @kind function
		 *
		 * @description
		 * Return UTF8 of a string
		 * Taken from http://phpjs.org/functions/utf8_encode/
		 *
		 * @param {String} argString todo more notes
		 * @returns {String} argString todo more notes
		 */
		utilities.utf8_decode = function (str_data) {
			//  discuss at: http://phpjs.org/functions/utf8_decode/
			// original by: Webtoolkit.info (http://www.webtoolkit.info/)
			//    input by: Aman Gupta
			//    input by: Brett Zamir (http://brett-zamir.me)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Norman "zEh" Fuchs
			// bugfixed by: hitwork
			// bugfixed by: Onno Marsman
			// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// bugfixed by: kirilloid
			// bugfixed by: w35l3y (http://www.wesley.eti.br)
			//   example 1: utf8_decode('Kevin van Zonneveld');
			//   returns 1: 'Kevin van Zonneveld'

			var tmp_arr = [],
				i = 0,
				c1 = 0,
				seqlen = 0;

			str_data += '';

			while (i < str_data.length) {
				c1 = str_data.charCodeAt(i) & 0xFF;
				seqlen = 0;

				// http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
				if (c1 <= 0xBF) {
					c1 = (c1 & 0x7F);
					seqlen = 1;
				} else if (c1 <= 0xDF) {
					c1 = (c1 & 0x1F);
					seqlen = 2;
				} else if (c1 <= 0xEF) {
					c1 = (c1 & 0x0F);
					seqlen = 3;
				} else {
					c1 = (c1 & 0x07);
					seqlen = 4;
				}

				for (var ai = 1; ai < seqlen; ++ai) {
					c1 = ((c1 << 0x06) | (str_data.charCodeAt(ai + i) & 0x3F));
				}

				if (seqlen == 4) {
					c1 -= 0x10000;
					tmp_arr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)), String
						.fromCharCode(0xDC00 | (c1 & 0x3FF)));
				} else {
					tmp_arr.push(String.fromCharCode(c1));
				}

				i += seqlen;
			}

			return tmp_arr.join("");
		}

		/**
		 * @ngdoc method
		 * @name utilities#utf8_encode
		 * @methodOf reyramos.utilities.utilities
		 * @kind function
		 *
		 * @description
		 * Return UTF8 of a string
		 * Taken from http://phpjs.org/functions/utf8_encode/
		 *
		 * @param {String} argString todo more notes
		 * @returns {String} argString todo more notes
		 */
		utilities.utf8_encode = function (argString) {
			if (argString === null || typeof argString === "undefined") {
				return "";
			}

			var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			var utftext = '',
				start, end, stringl = 0;

			start = end = 0;
			stringl = string.length;
			for (var n = 0; n < stringl; n++) {
				var c1 = string.charCodeAt(n);
				var enc = null;

				if (c1 < 128) {
					end++;
				} else if (c1 > 127 && c1 < 2048) {
					enc = String.fromCharCode(
						(c1 >> 6) | 192, (c1 & 63) | 128
					);
				} else if (c1 & 0xF800 != 0xD800) {
					enc = String.fromCharCode(
						(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
					);
				} else { // surrogate pairs
					if (c1 & 0xFC00 != 0xD800) {
						throw new RangeError("Unmatched trail surrogate at " + n);
					}
					var c2 = string.charCodeAt(++n);
					if (c2 & 0xFC00 != 0xDC00) {
						throw new RangeError("Unmatched lead surrogate at " + (n - 1));
					}
					c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
					enc = String.fromCharCode(
						(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (
						c1 & 63) | 128
					);
				}
				if (enc !== null) {
					if (end > start) {
						utftext += string.slice(start, end);
					}
					utftext += enc;
					start = end = n + 1;
				}
			}

			if (end > start) {
				utftext += string.slice(start, stringl);
			}

			return utftext;
		}


		return utilities;

	}

};


/***/ }),

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ramor11 on 8/8/2016.
 */

module.exports = function (app) {

	"use strict";

	/**
	 * @ngdoc overview
	 * @name common.loki
	 *
	 * @description
	 * <https://rawgit.com/techfort/LokiJS/master/jsdoc/index.html>
	 */

	app.config(['LokiProvider', function (loki) {
		loki.setKey('demo.db');
	}]).provider('Loki', StorageProvider);

	function StorageProvider() {

		this.KeyStorage = 'app.db';
		var _defaultCollection = 'settings';


		this.options = {
			env: 'BROWSER',
			// autosave: true
		};

		this.setKey = function (key) {
			if (key)this.KeyStorage = key;
			ngOnInit.apply(this, []);
		};


		function ngOnInit() {
			return _Loki.apply(this, []).then(function (data) {
				var self = this,
					_getCollection = data.db.getCollection,
					getCollection = function (string) {
						return typeof string === 'undefined' ? function () {
							self.collection = _getCollection(_defaultCollection);
						}() : _getCollection.apply(data.db, [string]);
					};

				data.db.getCollection = getCollection;
				// onInit = null;
			}.bind(this));
		}


		function _Loki() {
			var _this = this;
			return new Promise(function (resolve, reject) {
				_this.db = function (e) {
					var loki = __webpack_require__(180);
					return new loki(_this.KeyStorage, _this.options);
				}();

				reload.apply(_this, []).then(function () {
					_this.collection = _this.db.getCollection(_defaultCollection);
					if (!_this.collection)addCollection.apply(_this, []);
					resolve(_this);
				}).catch(function (e) {
					// create collection
					_this.db.addCollection(_defaultCollection);
					// save and create file
					_this.db.saveDatabase();

					resolve(_this);
				});

				function addCollection() {
					// create collection
					this.db.addCollection(_defaultCollection);
					// save and create file
					this.db.saveDatabase();
					this.collection = this.db.getCollection(_defaultCollection);
					this.loaded = true;
				}

			});

			function reload() {
				var _this = this;
				return new Promise(function (resolve, reject) {
					_this.loaded = false;
					_this.db.loadDatabase({}, function (e) {
						if (e) {
							reject(e);
						} else {
							_this.loaded = true;
							resolve(_this);
						}
					}.bind(_this));

				});
			};

		}


		this.$get = [function () {
			var _this = this,
				service = {
					getCollection: function (name) {
						return name ? _this.db.getCollection(name) || function () {
							var collection = _this.db.addCollection(name, _this.options);
							_this.db.saveDatabase();
							return collection;
						}() : _this.collection;
					},
					saveDatabase: function () {
						return new Promise(function (resolve) {
							service.db.saveDatabase(resolve);
						})
					},
					db: _this.db
				};

			return service;
		}]

	}

};


/***/ }),

/***/ 186:
/***/ (function(module, exports) {

module.exports = {};

/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2";

/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/font-awesome/fonts/fontawesome-webfont.woff";

/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/font-awesome/fonts/fontawesome-webfont.woff2";

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,bW9kdWxlLmV4cG9ydHMgPSAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJ6ZEdGdVpHRnNiMjVsUFNKdWJ5SS9QZ284SVVSUFExUlpVRVVnYzNabklGQlZRa3hKUXlBaUxTOHZWek5ETHk5RVZFUWdVMVpISURFdU1TOHZSVTRpSUNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk5SGNtRndhR2xqY3k5VFZrY3ZNUzR4TDBSVVJDOXpkbWN4TVM1a2RHUWlJRDRLUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaVBnbzhiV1YwWVdSaGRHRStQQzl0WlhSaFpHRjBZVDRLUEdSbFpuTStDanhtYjI1MElHbGtQU0puYkhsd2FHbGpiMjV6WDJoaGJHWnNhVzVuYzNKbFozVnNZWElpSUdodmNtbDZMV0ZrZGkxNFBTSXhNakF3SWlBK0NqeG1iMjUwTFdaaFkyVWdkVzVwZEhNdGNHVnlMV1Z0UFNJeE1qQXdJaUJoYzJObGJuUTlJamsyTUNJZ1pHVnpZMlZ1ZEQwaUxUSTBNQ0lnTHo0S1BHMXBjM05wYm1jdFoyeDVjR2dnYUc5eWFYb3RZV1IyTFhnOUlqVXdNQ0lnTHo0S1BHZHNlWEJvSUdodmNtbDZMV0ZrZGkxNFBTSXdJaUF2UGdvOFoyeDVjR2dnYUc5eWFYb3RZV1IyTFhnOUlqUXdNQ0lnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlBaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSXFJaUJrUFNKTk5qQXdJREV4TURCeE1UVWdNQ0F6TkNBdE1TNDFkRE13SUMwekxqVnNNVEVnTFRGeE1UQWdMVElnTVRjdU5TQXRNVEF1TlhRM0xqVWdMVEU0TGpWMkxUSXlOR3d4TlRnZ01UVTRjVGNnTnlBeE9DQTRkREU1SUMwMmJERXdOaUF0TVRBMmNUY2dMVGdnTmlBdE1UbDBMVGdnTFRFNGJDMHhOVGdnTFRFMU9HZ3lNalJ4TVRBZ01DQXhPQzQxSUMwM0xqVjBNVEF1TlNBdE1UY3VOWEUySUMwME1TQTJJQzAzTlhFd0lDMHhOU0F0TVM0MUlDMHpOSFF0TXk0MUlDMHpNR3d0TVNBdE1URnhMVElnTFRFd0lDMHhNQzQxSUMweE55NDFkQzB4T0M0MUlDMDNMalZvTFRJeU5Hd3hOVGdnTFRFMU9DQnhOeUF0TnlBNElDMHhPSFF0TmlBdE1UbHNMVEV3TmlBdE1UQTJjUzA0SUMwM0lDMHhPU0F0Tm5RdE1UZ2dPR3d0TVRVNElERTFPSFl0TWpJMGNUQWdMVEV3SUMwM0xqVWdMVEU0TGpWMExURTNMalVnTFRFd0xqVnhMVFF4SUMwMklDMDNOU0F0Tm5FdE1UVWdNQ0F0TXpRZ01TNDFkQzB6TUNBekxqVnNMVEV4SURGeExURXdJRElnTFRFM0xqVWdNVEF1TlhRdE55NDFJREU0TGpWMk1qSTBiQzB4TlRnZ0xURTFPSEV0TnlBdE55QXRNVGdnTFRoMExURTVJRFpzTFRFd05pQXhNRFp4TFRjZ09DQXROaUF4T1hRNElERTRiREUxT0NBeE5UaG9MVEl5TkhFdE1UQWdNQ0F0TVRndU5TQTNMalVnZEMweE1DNDFJREUzTGpWeExUWWdOREVnTFRZZ056VnhNQ0F4TlNBeExqVWdNelIwTXk0MUlETXdiREVnTVRGeE1pQXhNQ0F4TUM0MUlERTNMalYwTVRndU5TQTNMalZvTWpJMGJDMHhOVGdnTVRVNGNTMDNJRGNnTFRnZ01UaDBOaUF4T1d3eE1EWWdNVEEyY1RnZ055QXhPU0EyZERFNElDMDRiREUxT0NBdE1UVTRkakl5TkhFd0lERXdJRGN1TlNBeE9DNDFkREUzTGpVZ01UQXVOWEUwTVNBMklEYzFJRFo2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUt5SWdaRDBpVFRRMU1DQXhNVEF3YURJd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNelV3YURNMU1IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNakF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMHpOVEIyTFRNMU1IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TWpBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXpOVEJvTFRNMU1IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNakF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOU0JvTXpVd2RqTTFNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFlUQTdJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFlUVTdJaUJrUFNKTk9ESTFJREV4TURCb01qVXdjVEV3SURBZ01USXVOU0F0TlhRdE5TNDFJQzB4TTJ3dE16WTBJQzB6TmpSeExUWWdMVFlnTFRFeElDMHhPR2d5TmpoeE1UQWdNQ0F4TXlBdE5uUXRNeUF0TVRSc0xURXlNQ0F0TVRZd2NTMDJJQzA0SUMweE9DQXRNVFIwTFRJeUlDMDJhQzB4TWpWMkxURXdNR2d5TnpWeE1UQWdNQ0F4TXlBdE5uUXRNeUF0TVRSc0xURXlNQ0F0TVRZd2NTMDJJQzA0SUMweE9DQXRNVFIwTFRJeUlDMDJhQzB4TWpWMkxURTNOSEV3SUMweE1TQXROeTQxSUMweE9DNDFkQzB4T0M0MUlDMDNMalZvTFRFME9IRXRNVEVnTUNBdE1UZ3VOU0EzTGpWMExUY3VOU0F4T0M0MWRqRTNOQ0JvTFRJM05YRXRNVEFnTUNBdE1UTWdOblF6SURFMGJERXlNQ0F4TmpCeE5pQTRJREU0SURFMGRESXlJRFpvTVRJMWRqRXdNR2d0TWpjMWNTMHhNQ0F3SUMweE15QTJkRE1nTVRSc01USXdJREUyTUhFMklEZ2dNVGdnTVRSME1qSWdObWd4TVRoeExUVWdNVElnTFRFeElERTRiQzB6TmpRZ016WTBjUzA0SURnZ0xUVXVOU0F4TTNReE1pNDFJRFZvTWpVd2NUSTFJREFnTkRNZ0xURTRiREUyTkNBdE1UWTBjVGdnTFRnZ01UZ2dMVGgwTVRnZ09Hd3hOalFnTVRZMGNURTRJREU0SURReklERTRlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVESXdNREE3SWlCb2IzSnBlaTFoWkhZdGVEMGlOalV3SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRNakF3TVRzaUlHaHZjbWw2TFdGa2RpMTRQU0l4TXpBd0lpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40TWpBd01qc2lJR2h2Y21sNkxXRmtkaTE0UFNJMk5UQWlJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNneU1EQXpPeUlnYUc5eWFYb3RZV1IyTFhnOUlqRXpNREFpSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzZ3lNREEwT3lJZ2FHOXlhWG90WVdSMkxYZzlJalF6TXlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplREl3TURVN0lpQm9iM0pwZWkxaFpIWXRlRDBpTXpJMUlpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40TWpBd05qc2lJR2h2Y21sNkxXRmtkaTE0UFNJeU1UWWlJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNneU1EQTNPeUlnYUc5eWFYb3RZV1IyTFhnOUlqSXhOaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVESXdNRGc3SWlCb2IzSnBlaTFoWkhZdGVEMGlNVFl5SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRNakF3T1RzaUlHaHZjbWw2TFdGa2RpMTRQU0l5TmpBaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2d5TURCaE95SWdhRzl5YVhvdFlXUjJMWGc5SWpjeUlpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40TWpBeVpqc2lJR2h2Y21sNkxXRmtkaTE0UFNJeU5qQWlJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNneU1EVm1PeUlnYUc5eWFYb3RZV1IyTFhnOUlqTXlOU0lnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVESXdZV003SWlCa1BTSk5OelEwSURFeE9UaHhNalF5SURBZ016VTBJQzB4T0RseE5qQWdMVEV3TkNBMk5pQXRNakE1YUMweE9ERnhNQ0EwTlNBdE1UY3VOU0E0TWk0MWRDMDBNeTQxSURZeExqVjBMVFU0SURRd0xqVjBMVFl3TGpVZ01qUjBMVFV4TGpVZ055NDFjUzB4T1NBd0lDMDBNQzQxSUMwMUxqVjBMVFE1TGpVZ0xUSXdMalYwTFRVeklDMHpPSFF0TkRrZ0xUWXlMalYwTFRNNUlDMDRPUzQxYURNM09Xd3RNVEF3SUMweE1EQm9MVE13TUhFdE5pQXROVEFnTFRZZ0xURXdNR2cwTURac0xURXdNQ0F0TVRBd2FDMHpNREJ4T1NBdE56UWdNek1nTFRFek1uUTFNaTQxSUMwNU1YUTJNUzQxSUMwMU5DNDFkRFU1SUMweU9TQjBORGNnTFRjdU5YRXlNaUF3SURVd0xqVWdOeTQxZERZd0xqVWdNalF1TlhRMU9DQTBNWFEwTXk0MUlEWXhkREUzTGpVZ09EQm9NVGMwY1Mwek1DQXRNVGN4SUMweE1qZ2dMVEkzT0hFdE1UQTNJQzB4TVRjZ0xUSTNOQ0F0TVRFM2NTMHlNRFlnTUNBdE16STBJREUxT0hFdE16WWdORGdnTFRZNUlERXpNM1F0TkRVZ01qQTBhQzB5TVRkc01UQXdJREV3TUdneE1USnhNU0EwTnlBMklERXdNR2d0TWpFNGJERXdNQ0F4TURCb01UTTBjVEl3SURnM0lEVXhJREUxTXk0MWREWXlJREV3TXk0MWNURXhOeUF4TkRFZ01qazNJREUwTVhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2d5TUdKa095SWdaRDBpVFRReU9DQXhNakF3YURNMU1IRTJOeUF3SURFeU1DQXRNVE4wT0RZZ0xUTXhkRFUzSUMwME9TNDFkRE0xSUMwMU5pNDFkREUzSUMwMk5DNDFkRFl1TlNBdE5qQXVOWFF3TGpVZ0xUVTNkaTB4Tmk0MWRpMHhOaTQxY1RBZ0xUTTJJQzB3TGpVZ0xUVTNkQzAyTGpVZ0xUWXhkQzB4TnlBdE5qVjBMVE0xSUMwMU4zUXROVGNnTFRVd0xqVjBMVGcySUMwek1TNDFkQzB4TWpBZ0xURXphQzB4Tnpoc0xUSWdMVEV3TUdneU9EaHhNVEFnTUNBeE15QXROblF0TXlBdE1UUnNMVEV5TUNBdE1UWXdjUzAySUMwNElDMHhPQ0F0TVRSMExUSXlJQzAyYUMweE16aDJMVEUzTlhFd0lDMHhNU0F0TlM0MUlDMHhPQ0IwTFRFMUxqVWdMVGRvTFRFME9YRXRNVEFnTUNBdE1UY3VOU0EzTGpWMExUY3VOU0F4Tnk0MWRqRTNOV2d0TWpZM2NTMHhNQ0F3SUMweE15QTJkRE1nTVRSc01USXdJREUyTUhFMklEZ2dNVGdnTVRSME1qSWdObWd4TVRkMk1UQXdhQzB5TmpkeExURXdJREFnTFRFeklEWjBNeUF4Tkd3eE1qQWdNVFl3Y1RZZ09DQXhPQ0F4TkhReU1pQTJhREV4TjNZME56VnhNQ0F4TUNBM0xqVWdNVGN1TlhReE55NDFJRGN1TlhwTk5qQXdJREV3TURCMkxUTXdNR2d5TUROeE5qUWdNQ0E0Tmk0MUlETXpkREl5TGpVZ01URTVjVEFnT0RRZ0xUSXlMalVnTVRFMmRDMDROaTQxSURNeWFDMHlNRE42SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRNakl4TWpzaUlHUTlJazB5TlRBZ056QXdhRGd3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1qQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMwNE1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakl3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRNak14WWpzaUlHUTlJazB4TURBd0lERXlNREIyTFRFMU1IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TlRCMkxURXdNSEV3SUMwNU1TQXRORGt1TlNBdE1UWTFMalYwTFRFek1DNDFJQzB4TURrdU5YRTRNU0F0TXpVZ01UTXdMalVnTFRFd09TNDFkRFE1TGpVZ0xURTJOUzQxZGkweE5UQm9OVEJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRFMU1HZ3RPREF3ZGpFMU1IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWb05UQjJNVFV3Y1RBZ09URWdORGt1TlNBeE5qVXVOWFF4TXpBdU5TQXhNRGt1TlhFdE9ERWdNelVnTFRFek1DNDFJREV3T1M0MUlIUXRORGt1TlNBeE5qVXVOWFl4TURCb0xUVXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl4TlRCb09EQXdlazAwTURBZ01UQXdNSFl0TVRBd2NUQWdMVFl3SURNeUxqVWdMVEV3T1M0MWREZzNMalVnTFRjekxqVnhNamdnTFRFeUlEUTBJQzB6TjNReE5pQXROVFYwTFRFMklDMDFOWFF0TkRRZ0xUTTNjUzAxTlNBdE1qUWdMVGczTGpVZ0xUY3pMalYwTFRNeUxqVWdMVEV3T1M0MWRpMHhOVEJvTkRBd2RqRTFNSEV3SURZd0lDMHpNaTQxSURFd09TNDFkQzA0Tnk0MUlEY3pMalZ4TFRJNElERXlJQzAwTkNBek4zUXRNVFlnTlRWME1UWWdOVFYwTkRRZ016Y2djVFUxSURJMElEZzNMalVnTnpNdU5YUXpNaTQxSURFd09TNDFkakV3TUdndE5EQXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVESTFabU03SWlCb2IzSnBlaTFoWkhZdGVEMGlOVEF3SWlCa1BTSk5NQ0F3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplREkyTURFN0lpQmtQU0pOTlRBeklERXdPRGx4TVRFd0lEQWdNakF3TGpVZ0xUVTVMalYwTVRNMExqVWdMVEUxTmk0MWNUUTBJREUwSURrd0lERTBjVEV5TUNBd0lESXdOU0F0T0RZdU5YUTROU0F0TWpBMkxqVnhNQ0F0TVRJeElDMDROU0F0TWpBM0xqVjBMVEl3TlNBdE9EWXVOV2d0TnpVd2NTMDNPU0F3SUMweE16VXVOU0ExTjNRdE5UWXVOU0F4TXpkeE1DQTJPU0EwTWk0MUlERXlNaTQxZERFd09DNDFJRFkzTGpWeExUSWdNVElnTFRJZ016ZHhNQ0F4TlRNZ01UQTRJREkyTUM0MWRESTJNQ0F4TURjdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNneU5tWmhPeUlnWkQwaVRUYzNOQ0F4TVRrekxqVnhNVFlnTFRrdU5TQXlNQzQxSUMweU4zUXROUzQxSUMwek15NDFiQzB4TXpZZ0xURTROMncwTmpjZ0xUYzBObWd6TUhFeU1DQXdJRE0xSUMweE9DNDFkREUxSUMwek9TNDFkaTAwTW1ndE1USXdNSFkwTW5Fd0lESXhJREUxSURNNUxqVjBNelVnTVRndU5XZ3pNR3cwTmpnZ056UTJiQzB4TXpVZ01UZ3pjUzB4TUNBeE5pQXROUzQxSURNMGRESXdMalVnTWpoME16UWdOUzQxZERJNElDMHlNQzQxYkRFeE1TQXRNVFE0YkRFeE1pQXhOVEJ4T1NBeE5pQXlOeUF5TUM0MWRETTBJQzAxZWswMk1EQWdNakF3YURNM04yd3RNVGd5SURFeE1td3RNVGsxSURVek5IWXROalEyZWlBaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2d5TnpBNU95SWdaRDBpVFRJMUlERXhNREJvTVRFMU1IRXhNQ0F3SURFeUxqVWdMVFYwTFRVdU5TQXRNVE5zTFRVMk5DQXROVFkzY1MwNElDMDRJQzB4T0NBdE9IUXRNVGdnT0d3dE5UWTBJRFUyTjNFdE9DQTRJQzAxTGpVZ01UTjBNVEl1TlNBMWVrMHhPQ0E0T0RKc01qWTBJQzB5TmpSeE9DQXRPQ0E0SUMweE9IUXRPQ0F0TVRoc0xUSTJOQ0F0TWpZMGNTMDRJQzA0SUMweE15QXROUzQxZEMwMUlERXlMalYyTlRVd2NUQWdNVEFnTlNBeE1pNDFkREV6SUMwMUxqVjZUVGt4T0NBMk1UaHNNalkwSURJMk5IRTRJRGdnTVRNZ05TNDFkRFVnTFRFeUxqVjJMVFUxTUhFd0lDMHhNQ0F0TlNBdE1USXVOWFF0TVRNZ05TNDFJR3d0TWpZMElESTJOSEV0T0NBNElDMDRJREU0ZERnZ01UaDZUVGd4T0NBME9ESnNNelkwSUMwek5qUnhPQ0F0T0NBMUxqVWdMVEV6ZEMweE1pNDFJQzAxYUMweE1UVXdjUzB4TUNBd0lDMHhNaTQxSURWME5TNDFJREV6YkRNMk5DQXpOalJ4T0NBNElERTRJRGgwTVRnZ0xUaHNNVFkwSUMweE5qUnhPQ0F0T0NBeE9DQXRPSFF4T0NBNGJERTJOQ0F4TmpSeE9DQTRJREU0SURoME1UZ2dMVGg2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRNamN3WmpzaUlHUTlJazB4TURFeElERXlNVEJ4TVRrZ01DQXpNeUF0TVROc01UVXpJQzB4TlROeE1UTWdMVEUwSURFeklDMHpNM1F0TVRNZ0xUTXpiQzA1T1NBdE9USnNMVEl4TkNBeU1UUnNPVFVnT1RaeE1UTWdNVFFnTXpJZ01UUjZUVEV3TVRNZ09EQXdiQzAyTVRVZ0xUWXhOR3d0TWpFMElESXhOR3cyTVRRZ05qRTBlazB6TVRjZ09UWnNMVE16TXlBdE1URXliREV4TUNBek16VjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQXdNVHNpSUdROUlrMDNNREFnTmpVd2RpMDFOVEJvTWpVd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMDFNR2d0T0RBd2RqVXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5XZ3lOVEIyTlRVd2JDMDFNREFnTlRVd2FERXlNREI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEF3TWpzaUlHUTlJazB6TmpnZ01UQXhOMncyTkRVZ01UWXpjVE01SURFMUlEWXpJREIwTWpRZ0xUUTVkaTA0TXpGeE1DQXROVFVnTFRReExqVWdMVGsxTGpWMExURXhNUzQxSUMwMk15NDFjUzAzT1NBdE1qVWdMVEUwTnlBdE5DNDFkQzA0TmlBM05YUXlOUzQxSURFeE1TNDFkREV5TWk0MUlEZ3ljVGN5SURJMElERXpPQ0E0ZGpVeU1Xd3ROakF3SUMweE5UVjJMVFl3Tm5Fd0lDMDBNaUF0TkRRZ0xUa3dkQzB4TURrZ0xUWTVjUzAzT1NBdE1qWWdMVEUwTnlBdE5TNDFkQzA0TmlBM05TNDFkREkxTGpVZ01URXhMalYwTVRJeUxqVWdPREl1TlhFM01pQXlOQ0F4TXpnZ04zWTJNemx4TUNBek9DQXhOQzQxSURVNUlIUTFNeTQxSURNMGVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVd01ETTdJaUJrUFNKTk5UQXdJREV4T1RGeE1UQXdJREFnTVRreElDMHpPWFF4TlRZdU5TQXRNVEEwTGpWME1UQTBMalVnTFRFMU5pNDFkRE01SUMweE9URnNMVEVnTFRKc01TQXROWEV3SUMweE5ERWdMVGM0SUMweU5qSnNNamMxSUMweU56UnhNak1nTFRJMklESXlMalVnTFRRMExqVjBMVEl5TGpVZ0xUUXlMalZzTFRVNUlDMDFPSEV0TWpZZ0xUSXdJQzAwTmk0MUlDMHlNSFF0TXprdU5TQXlNR3d0TWpjMUlESTNOSEV0TVRFNUlDMDNOeUF0TWpZeElDMDNOMnd0TlNBeGJDMHlJQzB4Y1MweE1EQWdNQ0F0TVRreElETTVkQzB4TlRZdU5TQXhNRFF1TlhRdE1UQTBMalVnTVRVMkxqVjBMVE01SURFNU1TQjBNemtnTVRreGRERXdOQzQxSURFMU5pNDFkREUxTmk0MUlERXdOQzQxZERFNU1TQXpPWHBOTlRBd0lERXdNakp4TFRnNElEQWdMVEUyTWlBdE5ETjBMVEV4TnlBdE1URTNkQzAwTXlBdE1UWXlkRFF6SUMweE5qSjBNVEUzSUMweE1UZDBNVFl5SUMwME0zUXhOaklnTkROME1URTNJREV4TjNRME15QXhOakowTFRReklERTJNblF0TVRFM0lERXhOM1F0TVRZeUlEUXplaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXdNRFU3SWlCa1BTSk5OalE1SURrME9YRTBPQ0EyT0NBeE1Ea3VOU0F4TURSME1USXhMalVnTXpndU5YUXhNVGd1TlNBdE1qQjBNVEF5TGpVZ0xUWTBkRGN4SUMweE1EQXVOWFF5TnlBdE1USXpjVEFnTFRVM0lDMHpNeTQxSUMweE1UY3VOWFF0T1RRZ0xURXlOQzQxZEMweE1qWXVOU0F0TVRJM0xqVjBMVEUxTUNBdE1UVXlMalYwTFRFME5pQXRNVGMwY1MwMk1pQTROU0F0TVRRMUxqVWdNVGMwZEMweE5UQWdNVFV5TGpWMExURXlOaTQxSURFeU55NDFkQzA1TXk0MUlERXlOQzQxZEMwek15NDFJREV4Tnk0MWNUQWdOalFnTWpnZ01USXpkRGN6SURFd01DNDFkREV3TkNBMk5IUXhNVGtnTWpBZ2RERXlNQzQxSUMwek9DNDFkREV3TkM0MUlDMHhNRFI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEF3TmpzaUlHUTlJazAwTURjZ09EQXdiREV6TVNBek5UTnhOeUF4T1NBeE55NDFJREU1ZERFM0xqVWdMVEU1YkRFeU9TQXRNelV6YURReU1YRXlNU0F3SURJMElDMDRMalYwTFRFMElDMHlNQzQxYkMwek5ESWdMVEkwT1d3eE16QWdMVFF3TVhFM0lDMHlNQ0F0TUM0MUlDMHlOUzQxZEMweU5DNDFJRFl1Tld3dE16UXpJREkwTm13dE16UXlJQzB5TkRkeExURTNJQzB4TWlBdE1qUXVOU0F0Tmk0MWRDMHdMalVnTWpVdU5Xd3hNekFnTkRBd2JDMHpORGNnTWpVeGNTMHhOeUF4TWlBdE1UUWdNakF1TlhReU15QTRMalZvTkRJNWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVd01EYzdJaUJrUFNKTk5EQTNJRGd3TUd3eE16RWdNelV6Y1RjZ01Ua2dNVGN1TlNBeE9YUXhOeTQxSUMweE9Xd3hNamtnTFRNMU0yZzBNakZ4TWpFZ01DQXlOQ0F0T0M0MWRDMHhOQ0F0TWpBdU5Xd3RNelF5SUMweU5EbHNNVE13SUMwME1ERnhOeUF0TWpBZ0xUQXVOU0F0TWpVdU5YUXRNalF1TlNBMkxqVnNMVE0wTXlBeU5EWnNMVE0wTWlBdE1qUTNjUzB4TnlBdE1USWdMVEkwTGpVZ0xUWXVOWFF0TUM0MUlESTFMalZzTVRNd0lEUXdNR3d0TXpRM0lESTFNWEV0TVRjZ01USWdMVEUwSURJd0xqVjBNak1nT0M0MWFEUXlPWHBOTkRjM0lEY3dNR2d0TWpRd2JERTVOeUF0TVRReWJDMDNOQ0F0TWpJMklHd3hPVE1nTVRNNWJERTVOU0F0TVRRd2JDMDNOQ0F5TWpsc01Ua3lJREUwTUdndE1qTTBiQzAzT0NBeU1URjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQXdPRHNpSUdROUlrMDJNREFnTVRJd01IRXhNalFnTUNBeU1USWdMVGc0ZERnNElDMHlNVEoyTFRJMU1IRXdJQzAwTmlBdE16RWdMVGs0ZEMwMk9TQXROVEoyTFRjMWNUQWdMVEV3SURZZ0xUSXhMalYwTVRVZ0xURTNMalZzTXpVNElDMHlNekJ4T1NBdE5TQXhOU0F0TVRZdU5YUTJJQzB5TVM0MWRpMDVNM0V3SUMweE1DQXROeTQxSUMweE55NDFkQzB4Tnk0MUlDMDNMalZvTFRFeE5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWTVNM0V3SURFd0lEWWdNakV1TlhReE5TQXhOaTQxYkRNMU9DQXlNekJ4T1NBMklERTFJREUzTGpWME5pQXlNUzQxZGpjMWNTMHpPQ0F3SUMwMk9TQTFNaUIwTFRNeElEazRkakkxTUhFd0lERXlOQ0E0T0NBeU1USjBNakV5SURnNGVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVd01EazdJaUJrUFNKTk1qVWdNVEV3TUdneE1UVXdjVEV3SURBZ01UY3VOU0F0Tnk0MWREY3VOU0F0TVRjdU5YWXRNVEExTUhFd0lDMHhNQ0F0Tnk0MUlDMHhOeTQxZEMweE55NDFJQzAzTGpWb0xURXhOVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFl4TURVd2NUQWdNVEFnTnk0MUlERTNMalYwTVRjdU5TQTNMalY2VFRFd01DQXhNREF3ZGkweE1EQm9NVEF3ZGpFd01HZ3RNVEF3ZWswNE56VWdNVEF3TUdndE5UVXdjUzB4TUNBd0lDMHhOeTQxSUMwM0xqVjBMVGN1TlNBdE1UY3VOWFl0TXpVd2NUQWdMVEV3SURjdU5TQXRNVGN1TlhReE55NDFJQzAzTGpWb05UVXdJSEV4TUNBd0lERTNMalVnTnk0MWREY3VOU0F4Tnk0MWRqTTFNSEV3SURFd0lDMDNMalVnTVRjdU5YUXRNVGN1TlNBM0xqVjZUVEV3TURBZ01UQXdNSFl0TVRBd2FERXdNSFl4TURCb0xURXdNSHBOTVRBd0lEZ3dNSFl0TVRBd2FERXdNSFl4TURCb0xURXdNSHBOTVRBd01DQTRNREIyTFRFd01HZ3hNREIyTVRBd2FDMHhNREI2VFRFd01DQTJNREIyTFRFd01HZ3hNREIyTVRBd2FDMHhNREI2VFRFd01EQWdOakF3ZGkweE1EQm9NVEF3ZGpFd01HZ3RNVEF3ZWswNE56VWdOVEF3YUMwMU5UQnhMVEV3SURBZ0xURTNMalVnTFRjdU5YUXROeTQxSUMweE55NDFkaTB6TlRCeE1DQXRNVEFnTnk0MUlDMHhOeTQxSUhReE55NDFJQzAzTGpWb05UVXdjVEV3SURBZ01UY3VOU0EzTGpWME55NDFJREUzTGpWMk16VXdjVEFnTVRBZ0xUY3VOU0F4Tnk0MWRDMHhOeTQxSURjdU5YcE5NVEF3SURRd01IWXRNVEF3YURFd01IWXhNREJvTFRFd01IcE5NVEF3TUNBME1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVEV3TUNBeU1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVEV3TURBZ01qQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXdNVEE3SWlCa1BTSk5OVEFnTVRFd01HZzBNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRRd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TkRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTBNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazAyTlRBZ01URXdNR2cwTURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxUUXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE5EQXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFkwTURBZ2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhwTk5UQWdOVEF3YURRd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXROREF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDBNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpRd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNlRUWTFNQ0ExTURCb05EQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTAwTURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVFF3TUNCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqUXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQXhNVHNpSUdROUlrMDFNQ0F4TVRBd2FESXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TWpBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB5TURCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqSXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVFExTUNBeE1UQXdhREl3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1qQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweU1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakl3TUNCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWswNE5UQWdNVEV3TUdneU1EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVEl3TUhFd0lDMHlNU0F0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3RNakF3Y1MweU1TQXdJQzB6TlM0MUlERTBMalYwTFRFMExqVWdNelV1TlhZeU1EQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMDFNQ0EzTURCb01qQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB5TURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVEl3TUNCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqSXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVFExTUNBM01EQm9NakF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkweU1EQnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRJd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNakF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOT0RVd0lEY3dNR2d5TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxUSXdNQ0J4TUNBdE1qRWdMVEUwTGpVZ0xUTTFMalYwTFRNMUxqVWdMVEUwTGpWb0xUSXdNSEV0TWpFZ01DQXRNelV1TlNBeE5DNDFkQzB4TkM0MUlETTFMalYyTWpBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhwTk5UQWdNekF3YURJd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNakF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMHlNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpJd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNlRUUTFNQ0F6TURCb01qQXdJSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TWpBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB5TURCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqSXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVGcxTUNBek1EQm9NakF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkweU1EQnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRJd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNakF3Y1RBZ01qRWdNVFF1TlNBek5TNDFJSFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEF4TWpzaUlHUTlJazAxTUNBeE1UQXdhREl3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1qQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweU1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakl3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRRMU1DQXhNVEF3YURjd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNakF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDNNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpJd01DQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMDFNQ0EzTURCb01qQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB5TURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVEl3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk1qQXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5YcE5ORFV3SURjd01HZzNNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRJd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TnpBd0lIRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNakF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTlRBZ016QXdhREl3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1qQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweU1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakl3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRRMU1DQXpNREJvTnpBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMHlNREFnY1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDNNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpJd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRBeE16c2lJR1E5SWswME5qVWdORGMzYkRVM01TQTFOekZ4T0NBNElERTRJRGgwTVRjZ0xUaHNNVGMzSUMweE56ZHhPQ0F0TnlBNElDMHhOM1F0T0NBdE1UaHNMVGM0TXlBdE56ZzBjUzAzSUMwNElDMHhOeTQxSUMwNGRDMHhOeTQxSURoc0xUTTROQ0F6T0RSeExUZ2dPQ0F0T0NBeE9IUTRJREUzYkRFM055QXhOemR4TnlBNElERTNJRGgwTVRnZ0xUaHNNVGN4SUMweE56RnhOeUF0TnlBeE9DQXROM1F4T0NBM2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVd01UUTdJaUJrUFNKTk9UQTBJREV3T0ROc01UYzRJQzB4TnpseE9DQXRPQ0E0SUMweE9DNDFkQzA0SUMweE55NDFiQzB5TmpjZ0xUSTJPR3d5TmpjZ0xUSTJPSEU0SUMwM0lEZ2dMVEUzTGpWMExUZ2dMVEU0TGpWc0xURTNPQ0F0TVRjNGNTMDRJQzA0SUMweE9DNDFJQzA0ZEMweE55NDFJRGhzTFRJMk9DQXlOamRzTFRJMk9DQXRNalkzY1MwM0lDMDRJQzB4Tnk0MUlDMDRkQzB4T0M0MUlEaHNMVEUzT0NBeE56aHhMVGdnT0NBdE9DQXhPQzQxZERnZ01UY3VOV3d5TmpjZ01qWTRiQzB5TmpjZ01qWTRjUzA0SURjZ0xUZ2dNVGN1TlhRNElERTRMalZzTVRjNElERTNPSEU0SURnZ01UZ3VOU0E0ZERFM0xqVWdMVGdnYkRJMk9DQXRNalkzYkRJMk9DQXlOamh4TnlBM0lERTNMalVnTjNReE9DNDFJQzAzZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TVRVN0lpQmtQU0pOTlRBM0lERXhOemR4T1RnZ01DQXhPRGN1TlNBdE16Z3VOWFF4TlRRdU5TQXRNVEF6TGpWME1UQXpMalVnTFRFMU5DNDFkRE00TGpVZ0xURTROeTQxY1RBZ0xURTBNU0F0TnpnZ0xUSTJNbXd6TURBZ0xUSTVPWEU0SUMwNElEZ2dMVEU0TGpWMExUZ2dMVEU0TGpWc0xURXdPU0F0TVRBNGNTMDNJQzA0SUMweE55NDFJQzA0ZEMweE9DNDFJRGhzTFRNd01DQXlPVGx4TFRFeE9TQXROemNnTFRJMk1TQXROemR4TFRrNElEQWdMVEU0T0NBek9DNDFkQzB4TlRRdU5TQXhNRE4wTFRFd015QXhOVFF1TlhRdE16Z3VOU0F4T0RoME16Z3VOU0F4T0RjdU5YUXhNRE1nTVRVMExqVWdkREUxTkM0MUlERXdNeTQxZERFNE9DQXpPQzQxZWswMU1EWXVOU0F4TURJemNTMDRPUzQxSURBZ0xURTJOUzQxSUMwME5IUXRNVEl3SUMweE1qQXVOWFF0TkRRZ0xURTJOblEwTkNBdE1UWTFMalYwTVRJd0lDMHhNakIwTVRZMUxqVWdMVFEwZERFMk5pQTBOSFF4TWpBdU5TQXhNakIwTkRRZ01UWTFMalYwTFRRMElERTJOblF0TVRJd0xqVWdNVEl3TGpWMExURTJOaUEwTkhwTk5ESTFJRGt3TUdneE5UQnhNVEFnTUNBeE55NDFJQzAzTGpWME55NDFJQzB4Tnk0MWRpMDNOV2czTlhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRFMU1IRXdJQzB4TUNBdE55NDFJQzB4Tnk0MUlIUXRNVGN1TlNBdE55NDFhQzAzTlhZdE56VnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFhQzB4TlRCeExURXdJREFnTFRFM0xqVWdOeTQxZEMwM0xqVWdNVGN1TlhZM05XZ3ROelZ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFl4TlRCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOV2czTlhZM05YRXdJREV3SURjdU5TQXhOeTQxZERFM0xqVWdOeTQxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TVRZN0lpQmtQU0pOTlRBM0lERXhOemR4T1RnZ01DQXhPRGN1TlNBdE16Z3VOWFF4TlRRdU5TQXRNVEF6TGpWME1UQXpMalVnTFRFMU5DNDFkRE00TGpVZ0xURTROeTQxY1RBZ0xURTBNU0F0TnpnZ0xUSTJNbXd6TURBZ0xUSTVPWEU0SUMwNElEZ2dMVEU0TGpWMExUZ2dMVEU0TGpWc0xURXdPU0F0TVRBNGNTMDNJQzA0SUMweE55NDFJQzA0ZEMweE9DNDFJRGhzTFRNd01DQXlPVGx4TFRFeE9TQXROemNnTFRJMk1TQXROemR4TFRrNElEQWdMVEU0T0NBek9DNDFkQzB4TlRRdU5TQXhNRE4wTFRFd015QXhOVFF1TlhRdE16Z3VOU0F4T0RoME16Z3VOU0F4T0RjdU5YUXhNRE1nTVRVMExqVWdkREUxTkM0MUlERXdNeTQxZERFNE9DQXpPQzQxZWswMU1EWXVOU0F4TURJemNTMDRPUzQxSURBZ0xURTJOUzQxSUMwME5IUXRNVEl3SUMweE1qQXVOWFF0TkRRZ0xURTJOblEwTkNBdE1UWTFMalYwTVRJd0lDMHhNakIwTVRZMUxqVWdMVFEwZERFMk5pQTBOSFF4TWpBdU5TQXhNakIwTkRRZ01UWTFMalYwTFRRMElERTJOblF0TVRJd0xqVWdNVEl3TGpWMExURTJOaUEwTkhwTk16STFJRGd3TUdnek5UQnhNVEFnTUNBeE55NDFJQzAzTGpWME55NDFJQzB4Tnk0MWRpMHhOVEJ4TUNBdE1UQWdMVGN1TlNBdE1UY3VOWFF0TVRjdU5TQXROeTQxYUMwek5UQnhMVEV3SURBZ0xURTNMalVnTnk0MUlIUXROeTQxSURFM0xqVjJNVFV3Y1RBZ01UQWdOeTQxSURFM0xqVjBNVGN1TlNBM0xqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQXhOenNpSUdROUlrMDFOVEFnTVRJd01HZ3hNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRRd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TVRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTBNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazA0TURBZ09UYzFkakUyTm5FeE5qY2dMVFl5SURJM01pQXRNakE1TGpWME1UQTFJQzB6TXpFdU5YRXdJQzB4TVRjZ0xUUTFMalVnTFRJeU5IUXRNVEl6SUMweE9EUXVOWFF0TVRnMExqVWdMVEV5TTNRdE1qSTBJQzAwTlM0MWRDMHlNalFnTkRVdU5TQjBMVEU0TkM0MUlERXlNM1F0TVRJeklERTROQzQxZEMwME5TNDFJREl5TkhFd0lERTROQ0F4TURVZ016TXhMalYwTWpjeUlESXdPUzQxZGkweE5qWnhMVEV3TXlBdE5UVWdMVEUyTlNBdE1UVTFkQzAyTWlBdE1qSXdjVEFnTFRFeE5pQTFOeUF0TWpFMExqVjBNVFUxTGpVZ0xURTFOUzQxZERJeE5DNDFJQzAxTjNReU1UUXVOU0ExTjNReE5UVXVOU0F4TlRVdU5YUTFOeUF5TVRRdU5YRXdJREV5TUNBdE5qSWdNakl3ZEMweE5qVWdNVFUxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TVRnN0lpQmtQU0pOTVRBeU5TQXhNakF3YURFMU1IRXhNQ0F3SURFM0xqVWdMVGN1TlhRM0xqVWdMVEUzTGpWMkxURXhOVEJ4TUNBdE1UQWdMVGN1TlNBdE1UY3VOWFF0TVRjdU5TQXROeTQxYUMweE5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWXhNVFV3Y1RBZ01UQWdOeTQxSURFM0xqVjBNVGN1TlNBM0xqVjZUVGN5TlNBNE1EQm9NVFV3Y1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TnpVd2NUQWdMVEV3SUMwM0xqVWdMVEUzTGpWMExURTNMalVnTFRjdU5XZ3RNVFV3Y1MweE1DQXdJQzB4Tnk0MUlEY3VOWFF0Tnk0MUlERTNMalYyTnpVd0lIRXdJREV3SURjdU5TQXhOeTQxZERFM0xqVWdOeTQxZWswME1qVWdOVEF3YURFMU1IRXhNQ0F3SURFM0xqVWdMVGN1TlhRM0xqVWdMVEUzTGpWMkxUUTFNSEV3SUMweE1DQXROeTQxSUMweE55NDFkQzB4Tnk0MUlDMDNMalZvTFRFMU1IRXRNVEFnTUNBdE1UY3VOU0EzTGpWMExUY3VOU0F4Tnk0MWRqUTFNSEV3SURFd0lEY3VOU0F4Tnk0MWRERTNMalVnTnk0MWVrMHhNalVnTXpBd2FERTFNSEV4TUNBd0lERTNMalVnTFRjdU5YUTNMalVnTFRFM0xqVjJMVEkxTUhFd0lDMHhNQ0F0Tnk0MUlDMHhOeTQxZEMweE55NDFJQzAzTGpWb0xURTFNSEV0TVRBZ01DQXRNVGN1TlNBM0xqVjBMVGN1TlNBeE55NDFJSFl5TlRCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNREU1T3lJZ1pEMGlUVFl3TUNBeE1UYzBjVE16SURBZ056UWdMVFZzTXpnZ0xURTFNbXcxSUMweGNUUTVJQzB4TkNBNU5DQXRNemxzTlNBdE1td3hNelFnT0RCeE5qRWdMVFE0SURFd05DQXRNVEExYkMwNE1DQXRNVE0wYkRNZ0xUVnhNalVnTFRRMElETTVJQzA1TTJ3eElDMDJiREUxTWlBdE16aHhOU0F0TkRNZ05TQXROek54TUNBdE16UWdMVFVnTFRjMGJDMHhOVElnTFRNNGJDMHhJQzAyY1MweE5TQXRORGtnTFRNNUlDMDVNMnd0TXlBdE5XdzRNQ0F0TVRNMGNTMDBPQ0F0TmpFZ0xURXdOQ0F0TVRBMWJDMHhNelFnT0RGc0xUVWdMVE54TFRRMElDMHlOU0F0T1RRZ0xUTTViQzAxSUMweWJDMHpPQ0F0TVRVeElIRXRORE1nTFRVZ0xUYzBJQzAxY1Mwek15QXdJQzAzTkNBMWJDMHpPQ0F4TlRGc0xUVWdNbkV0TkRrZ01UUWdMVGswSURNNWJDMDFJRE5zTFRFek5DQXRPREZ4TFRZd0lEUTRJQzB4TURRZ01UQTFiRGd3SURFek5Hd3RNeUExY1MweU5TQTBOU0F0TXpnZ09UTnNMVElnTm13dE1UVXhJRE00Y1MwMklEUXlJQzAySURjMGNUQWdNek1nTmlBM00yd3hOVEVnTXpoc01pQTJjVEV6SURRNElETTRJRGt6YkRNZ05Xd3RPREFnTVRNMGNUUTNJRFl4SURFd05TQXhNRFZzTVRNeklDMDRNR3cxSURKeE5EVWdNalVnT1RRZ016bHNOU0F4YkRNNElERTFNbkUwTXlBMUlEYzBJRFY2VFRZd01DQTRNVFVnY1MwNE9TQXdJQzB4TlRJZ0xUWXpkQzAyTXlBdE1UVXhMalYwTmpNZ0xURTFNUzQxZERFMU1pQXROak4wTVRVeUlEWXpkRFl6SURFMU1TNDFkQzAyTXlBeE5URXVOWFF0TVRVeUlEWXplaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXdNakE3SWlCa1BTSk5OVEF3SURFek1EQm9NekF3Y1RReElEQWdOekF1TlNBdE1qa3VOWFF5T1M0MUlDMDNNQzQxZGkweE1EQm9NamMxY1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TnpWb0xURXhNREIyTnpWeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOV2d5TnpWMk1UQXdjVEFnTkRFZ01qa3VOU0EzTUM0MWREY3dMalVnTWprdU5YcE5OVEF3SURFeU1EQjJMVEV3TUdnek1EQjJNVEF3YUMwek1EQjZUVEV4TURBZ09UQXdkaTA0TURCeE1DQXROREVnTFRJNUxqVWdMVGN3TGpWMExUY3dMalVnTFRJNUxqVm9MVGN3TUhFdE5ERWdNQ0F0TnpBdU5TQXlPUzQxZEMweU9TNDFJRGN3TGpVZ2RqZ3dNR2c1TURCNlRUTXdNQ0E0TURCMkxUY3dNR2d4TURCMk56QXdhQzB4TURCNlRUVXdNQ0E0TURCMkxUY3dNR2d4TURCMk56QXdhQzB4TURCNlRUY3dNQ0E0TURCMkxUY3dNR2d4TURCMk56QXdhQzB4TURCNlRUa3dNQ0E0TURCMkxUY3dNR2d4TURCMk56QXdhQzB4TURCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRBeU1Uc2lJR1E5SWsweE9DQTJNVGhzTmpJd0lEWXdPSEU0SURjZ01UZ3VOU0EzZERFM0xqVWdMVGRzTmpBNElDMDJNRGh4T0NBdE9DQTFMalVnTFRFemRDMHhNaTQxSUMwMWFDMHhOelYyTFRVM05YRXdJQzB4TUNBdE55NDFJQzB4Tnk0MWRDMHhOeTQxSUMwM0xqVm9MVEkxTUhFdE1UQWdNQ0F0TVRjdU5TQTNMalYwTFRjdU5TQXhOeTQxZGpNM05XZ3RNekF3ZGkwek56VnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFhQzB5TlRCeExURXdJREFnTFRFM0xqVWdOeTQxZEMwM0xqVWdNVGN1TlhZMU56Vm9MVEUzTlhFdE1UQWdNQ0F0TVRJdU5TQTFkRFV1TlNBeE0zb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1ESXlPeUlnWkQwaVRUWXdNQ0F4TWpBd2RpMDBNREJ4TUNBdE5ERWdNamt1TlNBdE56QXVOWFEzTUM0MUlDMHlPUzQxYURNd01IWXROalV3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDRNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFeE1EQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWFEUTFNSHBOTVRBd01DQTRNREJvTFRJMU1IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNalV3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TWpNN0lpQmtQU0pOTmpBd0lERXhOemR4TVRFM0lEQWdNakkwSUMwME5TNDFkREU0TkM0MUlDMHhNak4wTVRJeklDMHhPRFF1TlhRME5TNDFJQzB5TWpSMExUUTFMalVnTFRJeU5IUXRNVEl6SUMweE9EUXVOWFF0TVRnMExqVWdMVEV5TTNRdE1qSTBJQzAwTlM0MWRDMHlNalFnTkRVdU5YUXRNVGcwTGpVZ01USXpkQzB4TWpNZ01UZzBMalYwTFRRMUxqVWdNakkwZERRMUxqVWdNakkwZERFeU15QXhPRFF1TlhReE9EUXVOU0F4TWpOME1qSTBJRFExTGpWNlRUWXdNQ0F4TURJM2NTMHhNVFlnTUNBdE1qRTBMalVnTFRVM2RDMHhOVFV1TlNBdE1UVTFMalYwTFRVM0lDMHlNVFF1TlhRMU55QXRNakUwTGpVZ2RERTFOUzQxSUMweE5UVXVOWFF5TVRRdU5TQXROVGQwTWpFMExqVWdOVGQwTVRVMUxqVWdNVFUxTGpWME5UY2dNakUwTGpWMExUVTNJREl4TkM0MWRDMHhOVFV1TlNBeE5UVXVOWFF0TWpFMExqVWdOVGQ2VFRVeU5TQTVNREJvTlRCeE1UQWdNQ0F4Tnk0MUlDMDNMalYwTnk0MUlDMHhOeTQxZGkweU56Vm9NVGMxY1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TlRCeE1DQXRNVEFnTFRjdU5TQXRNVGN1TlhRdE1UY3VOU0F0Tnk0MWFDMHlOVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFl6TlRCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNREkwT3lJZ1pEMGlUVEV6TURBZ01HZ3ROVE00YkMwME1TQTBNREJvTFRJME1td3ROREVnTFRRd01HZ3ROVE00YkRRek1TQXhNakF3YURJd09Xd3RNakVnTFRNd01HZ3hOakpzTFRJd0lETXdNR2d5TURoNlRUVXhOU0E0TURCc0xUSTNJQzB6TURCb01qSTBiQzB5TnlBek1EQm9MVEUzTUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURJMU95SWdaRDBpVFRVMU1DQXhNakF3YURJd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRORFV3YURFNU1YRXlNQ0F3SURJMUxqVWdMVEV4TGpWMExUY3VOU0F0TWpjdU5Xd3RNekkzSUMwME1EQnhMVEV6SUMweE5pQXRNeklnTFRFMmRDMHpNaUF4Tm13dE16STNJRFF3TUhFdE1UTWdNVFlnTFRjdU5TQXlOeTQxZERJMUxqVWdNVEV1TldneE9URjJORFV3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTVRFeU5TQTBNREJvTlRCeE1UQWdNQ0F4Tnk0MUlDMDNMalYwTnk0MUlDMHhOeTQxZGkwek5UQnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFJR2d0TVRBMU1IRXRNVEFnTUNBdE1UY3VOU0EzTGpWMExUY3VOU0F4Tnk0MWRqTTFNSEV3SURFd0lEY3VOU0F4Tnk0MWRERTNMalVnTnk0MWFEVXdjVEV3SURBZ01UY3VOU0F0Tnk0MWREY3VOU0F0TVRjdU5YWXRNVGMxYURrd01IWXhOelZ4TUNBeE1DQTNMalVnTVRjdU5YUXhOeTQxSURjdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1ESTJPeUlnWkQwaVRUWXdNQ0F4TVRjM2NURXhOeUF3SURJeU5DQXRORFV1TlhReE9EUXVOU0F0TVRJemRERXlNeUF0TVRnMExqVjBORFV1TlNBdE1qSTBkQzAwTlM0MUlDMHlNalIwTFRFeU15QXRNVGcwTGpWMExURTROQzQxSUMweE1qTjBMVEl5TkNBdE5EVXVOWFF0TWpJMElEUTFMalYwTFRFNE5DNDFJREV5TTNRdE1USXpJREU0TkM0MWRDMDBOUzQxSURJeU5IUTBOUzQxSURJeU5IUXhNak1nTVRnMExqVjBNVGcwTGpVZ01USXpkREl5TkNBME5TNDFlazAyTURBZ01UQXlOM0V0TVRFMklEQWdMVEl4TkM0MUlDMDFOM1F0TVRVMUxqVWdMVEUxTlM0MWRDMDFOeUF0TWpFMExqVjBOVGNnTFRJeE5DNDFJSFF4TlRVdU5TQXRNVFUxTGpWME1qRTBMalVnTFRVM2RESXhOQzQxSURVM2RERTFOUzQxSURFMU5TNDFkRFUzSURJeE5DNDFkQzAxTnlBeU1UUXVOWFF0TVRVMUxqVWdNVFUxTGpWMExUSXhOQzQxSURVM2VrMDFNalVnT1RBd2FERTFNSEV4TUNBd0lERTNMalVnTFRjdU5YUTNMalVnTFRFM0xqVjJMVEkzTldneE16ZHhNakVnTUNBeU5pQXRNVEV1TlhRdE9DQXRNamN1Tld3dE1qSXpJQzB5TnpWeExURXpJQzB4TmlBdE16SWdMVEUyZEMwek1pQXhObXd0TWpJeklESTNOWEV0TVRNZ01UWWdMVGdnTWpjdU5YUXlOaUF4TVM0MWFERXpOM1l5TnpWeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOWG9nSWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEF5TnpzaUlHUTlJazAyTURBZ01URTNOM0V4TVRjZ01DQXlNalFnTFRRMUxqVjBNVGcwTGpVZ0xURXlNM1F4TWpNZ0xURTROQzQxZERRMUxqVWdMVEl5TkhRdE5EVXVOU0F0TWpJMGRDMHhNak1nTFRFNE5DNDFkQzB4T0RRdU5TQXRNVEl6ZEMweU1qUWdMVFExTGpWMExUSXlOQ0EwTlM0MWRDMHhPRFF1TlNBeE1qTjBMVEV5TXlBeE9EUXVOWFF0TkRVdU5TQXlNalIwTkRVdU5TQXlNalIwTVRJeklERTROQzQxZERFNE5DNDFJREV5TTNReU1qUWdORFV1TlhwTk5qQXdJREV3TWpkeExURXhOaUF3SUMweU1UUXVOU0F0TlRkMExURTFOUzQxSUMweE5UVXVOWFF0TlRjZ0xUSXhOQzQxZERVM0lDMHlNVFF1TlNCME1UVTFMalVnTFRFMU5TNDFkREl4TkM0MUlDMDFOM1F5TVRRdU5TQTFOM1F4TlRVdU5TQXhOVFV1TlhRMU55QXlNVFF1TlhRdE5UY2dNakUwTGpWMExURTFOUzQxSURFMU5TNDFkQzB5TVRRdU5TQTFOM3BOTmpNeUlEa3hOR3d5TWpNZ0xUSTNOWEV4TXlBdE1UWWdPQ0F0TWpjdU5YUXRNallnTFRFeExqVm9MVEV6TjNZdE1qYzFjVEFnTFRFd0lDMDNMalVnTFRFM0xqVjBMVEUzTGpVZ0xUY3VOV2d0TVRVd2NTMHhNQ0F3SUMweE55NDFJRGN1TlhRdE55NDFJREUzTGpWMk1qYzFhQzB4TXpkeExUSXhJREFnTFRJMklERXhMalYwT0NBeU55NDFiREl5TXlBeU56VnhNVE1nTVRZZ016SWdNVFlnZERNeUlDMHhObm9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNREk0T3lJZ1pEMGlUVEl5TlNBeE1qQXdhRGMxTUhFeE1DQXdJREU1TGpVZ0xUZDBNVEl1TlNBdE1UZHNNVGcySUMwMk5USnhOeUF0TWpRZ055QXRORGwyTFRReU5YRXdJQzB4TWlBdE5DQXRNamQwTFRrZ0xURTNjUzB4TWlBdE5pQXRNemNnTFRab0xURXhNREJ4TFRFeUlEQWdMVEkzSURSMExURTNJRGh4TFRZZ01UTWdMVFlnTXpoc01TQTBNalZ4TUNBeU5TQTNJRFE1YkRFNE5TQTJOVEp4TXlBeE1DQXhNaTQxSURFM2RERTVMalVnTjNwTk9EYzRJREV3TURCb0xUVTFObkV0TVRBZ01DQXRNVGtnTFRkMExURXhJQzB4T0d3dE9EY2dMVFExTUhFdE1pQXRNVEVnTkNBdE1UaDBNVFlnTFRkb01UVXdJSEV4TUNBd0lERTVMalVnTFRkME1URXVOU0F0TVRkc016Z2dMVEUxTW5FeUlDMHhNQ0F4TVM0MUlDMHhOM1F4T1M0MUlDMDNhREkxTUhFeE1DQXdJREU1TGpVZ04zUXhNUzQxSURFM2JETTRJREUxTW5FeUlERXdJREV4TGpVZ01UZDBNVGt1TlNBM2FERTFNSEV4TUNBd0lERTJJRGQwTkNBeE9Hd3RPRGNnTkRVd2NTMHlJREV4SUMweE1TQXhPSFF0TVRrZ04zb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1ESTVPeUlnWkQwaVRUWXdNQ0F4TVRjM2NURXhOeUF3SURJeU5DQXRORFV1TlhReE9EUXVOU0F0TVRJemRERXlNeUF0TVRnMExqVjBORFV1TlNBdE1qSTBkQzAwTlM0MUlDMHlNalIwTFRFeU15QXRNVGcwTGpWMExURTROQzQxSUMweE1qTjBMVEl5TkNBdE5EVXVOWFF0TWpJMElEUTFMalYwTFRFNE5DNDFJREV5TTNRdE1USXpJREU0TkM0MWRDMDBOUzQxSURJeU5IUTBOUzQxSURJeU5IUXhNak1nTVRnMExqVjBNVGcwTGpVZ01USXpkREl5TkNBME5TNDFlazAyTURBZ01UQXlOM0V0TVRFMklEQWdMVEl4TkM0MUlDMDFOM1F0TVRVMUxqVWdMVEUxTlM0MWRDMDFOeUF0TWpFMExqVjBOVGNnTFRJeE5DNDFJSFF4TlRVdU5TQXRNVFUxTGpWME1qRTBMalVnTFRVM2RESXhOQzQxSURVM2RERTFOUzQxSURFMU5TNDFkRFUzSURJeE5DNDFkQzAxTnlBeU1UUXVOWFF0TVRVMUxqVWdNVFUxTGpWMExUSXhOQzQxSURVM2VrMDFOREFnT0RJd2JESTFNeUF0TVRrd2NURTNJQzB4TWlBeE55QXRNekIwTFRFM0lDMHpNR3d0TWpVeklDMHhPVEJ4TFRFMklDMHhNaUF0TWpnZ0xUWXVOWFF0TVRJZ01qWXVOWFkwTURCeE1DQXlNU0F4TWlBeU5pNDFkREk0SUMwMkxqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQXpNRHNpSUdROUlrMDVORGNnTVRBMk1Hd3hNelVnTVRNMWNUY2dOeUF4TWk0MUlEVjBOUzQxSUMweE0zWXRNell5Y1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE16WXljUzB4TVNBd0lDMHhNeUExTGpWME5TQXhNaTQxYkRFek15QXhNek54TFRFd09TQTNOaUF0TWpNNElEYzJjUzB4TVRZZ01DQXRNakUwTGpVZ0xUVTNkQzB4TlRVdU5TQXRNVFUxTGpWMExUVTNJQzB5TVRRdU5YUTFOeUF0TWpFMExqVjBNVFUxTGpVZ0xURTFOUzQxZERJeE5DNDFJQzAxTjNReU1UUXVOU0ExTjNReE5UVXVOU0F4TlRVdU5YUTFOeUF5TVRRdU5XZ3hOVEJ4TUNBdE1URTNJQzAwTlM0MUlDMHlNalFnZEMweE1qTWdMVEU0TkM0MWRDMHhPRFF1TlNBdE1USXpkQzB5TWpRZ0xUUTFMalYwTFRJeU5DQTBOUzQxZEMweE9EUXVOU0F4TWpOMExURXlNeUF4T0RRdU5YUXRORFV1TlNBeU1qUjBORFV1TlNBeU1qUjBNVEl6SURFNE5DNDFkREU0TkM0MUlERXlNM1F5TWpRZ05EVXVOWEV4T1RJZ01DQXpORGNnTFRFeE4zb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1ETXhPeUlnWkQwaVRUazBOeUF4TURZd2JERXpOU0F4TXpWeE55QTNJREV5TGpVZ05YUTFMalVnTFRFemRpMHpOakZ4TUNBdE1URWdMVGN1TlNBdE1UZ3VOWFF0TVRndU5TQXROeTQxYUMwek5qRnhMVEV4SURBZ0xURXpJRFV1TlhRMUlERXlMalZzTVRNMElERXpOSEV0TVRFd0lEYzFJQzB5TXprZ056VnhMVEV4TmlBd0lDMHlNVFF1TlNBdE5UZDBMVEUxTlM0MUlDMHhOVFV1TlhRdE5UY2dMVEl4TkM0MWFDMHhOVEJ4TUNBeE1UY2dORFV1TlNBeU1qUjBNVEl6SURFNE5DNDFkREU0TkM0MUlERXlNM1F5TWpRZ05EVXVOWEV4T1RJZ01DQXpORGNnTFRFeE4zcE5NVEF5TnlBMk1EQm9NVFV3SUhFd0lDMHhNVGNnTFRRMUxqVWdMVEl5TkhRdE1USXpJQzB4T0RRdU5YUXRNVGcwTGpVZ0xURXlNM1F0TWpJMElDMDBOUzQxY1MweE9USWdNQ0F0TXpRNElERXhPR3d0TVRNMElDMHhNelJ4TFRjZ0xUZ2dMVEV5TGpVZ0xUVXVOWFF0TlM0MUlERXlMalYyTXpZd2NUQWdNVEVnTnk0MUlERTRMalYwTVRndU5TQTNMalZvTXpZd2NURXdJREFnTVRJdU5TQXROUzQxZEMwMUxqVWdMVEV5TGpWc0xURXpNeUF0TVRNemNURXhNQ0F0TnpZZ01qUXdJQzAzTm5FeE1UWWdNQ0F5TVRRdU5TQTFOM1F4TlRVdU5TQXhOVFV1TlhRMU55QXlNVFF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURNeU95SWdaRDBpVFRFeU5TQXhNakF3YURFd05UQnhNVEFnTUNBeE55NDFJQzAzTGpWME55NDFJQzB4Tnk0MWRpMHhNVFV3Y1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE1UQTFNSEV0TVRBZ01DQXRNVGN1TlNBM0xqVjBMVGN1TlNBeE55NDFkakV4TlRCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOWHBOTVRBM05TQXhNREF3YUMwNE5UQnhMVEV3SURBZ0xURTNMalVnTFRjdU5YUXROeTQxSUMweE55NDFkaTA0TlRCeE1DQXRNVEFnTnk0MUlDMHhOeTQxZERFM0xqVWdMVGN1TldnNE5UQnhNVEFnTUNBeE55NDFJRGN1TlhRM0xqVWdNVGN1TlhZNE5UQWdjVEFnTVRBZ0xUY3VOU0F4Tnk0MWRDMHhOeTQxSURjdU5YcE5NekkxSURrd01HZzFNSEV4TUNBd0lERTNMalVnTFRjdU5YUTNMalVnTFRFM0xqVjJMVFV3Y1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWTFNSEV3SURFd0lEY3VOU0F4Tnk0MWRERTNMalVnTnk0MWVrMDFNalVnT1RBd2FEUTFNSEV4TUNBd0lERTNMalVnTFRjdU5YUTNMalVnTFRFM0xqVjJMVFV3Y1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE5EVXdjUzB4TUNBd0lDMHhOeTQxSURjdU5YUXROeTQxSURFM0xqVjJOVEFnY1RBZ01UQWdOeTQxSURFM0xqVjBNVGN1TlNBM0xqVjZUVE15TlNBM01EQm9OVEJ4TVRBZ01DQXhOeTQxSUMwM0xqVjBOeTQxSUMweE55NDFkaTAxTUhFd0lDMHhNQ0F0Tnk0MUlDMHhOeTQxZEMweE55NDFJQzAzTGpWb0xUVXdjUzB4TUNBd0lDMHhOeTQxSURjdU5YUXROeTQxSURFM0xqVjJOVEJ4TUNBeE1DQTNMalVnTVRjdU5YUXhOeTQxSURjdU5YcE5OVEkxSURjd01HZzBOVEJ4TVRBZ01DQXhOeTQxSUMwM0xqVjBOeTQxSUMweE55NDFkaTAxTUhFd0lDMHhNQ0F0Tnk0MUlDMHhOeTQxZEMweE55NDFJQzAzTGpWb0xUUTFNSEV0TVRBZ01DQXRNVGN1TlNBM0xqVjBMVGN1TlNBeE55NDFkalV3SUhFd0lERXdJRGN1TlNBeE55NDFkREUzTGpVZ055NDFlazB6TWpVZ05UQXdhRFV3Y1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TlRCeE1DQXRNVEFnTFRjdU5TQXRNVGN1TlhRdE1UY3VOU0F0Tnk0MWFDMDFNSEV0TVRBZ01DQXRNVGN1TlNBM0xqVjBMVGN1TlNBeE55NDFkalV3Y1RBZ01UQWdOeTQxSURFM0xqVjBNVGN1TlNBM0xqVjZUVFV5TlNBMU1EQm9ORFV3Y1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TlRCeE1DQXRNVEFnTFRjdU5TQXRNVGN1TlhRdE1UY3VOU0F0Tnk0MWFDMDBOVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFkxTUNCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOWHBOTXpJMUlETXdNR2cxTUhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRVd2NUQWdMVEV3SUMwM0xqVWdMVEUzTGpWMExURTNMalVnTFRjdU5XZ3ROVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFkxTUhFd0lERXdJRGN1TlNBeE55NDFkREUzTGpVZ055NDFlazAxTWpVZ016QXdhRFExTUhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRVd2NUQWdMVEV3SUMwM0xqVWdMVEUzTGpWMExURTNMalVnTFRjdU5XZ3RORFV3Y1MweE1DQXdJQzB4Tnk0MUlEY3VOWFF0Tnk0MUlERTNMalYyTlRBZ2NUQWdNVEFnTnk0MUlERTNMalYwTVRjdU5TQTNMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEF6TXpzaUlHUTlJazA1TURBZ09EQXdkakl3TUhFd0lEZ3pJQzAxT0M0MUlERTBNUzQxZEMweE5ERXVOU0ExT0M0MWFDMHpNREJ4TFRneUlEQWdMVEUwTVNBdE5UbDBMVFU1SUMweE5ERjJMVEl3TUdndE1UQXdjUzAwTVNBd0lDMDNNQzQxSUMweU9TNDFkQzB5T1M0MUlDMDNNQzQxZGkwMk1EQnhNQ0F0TkRFZ01qa3VOU0F0TnpBdU5YUTNNQzQxSUMweU9TNDFhRGt3TUhFME1TQXdJRGN3TGpVZ01qa3VOWFF5T1M0MUlEY3dMalYyTmpBd2NUQWdOREVnTFRJNUxqVWdOekF1TlhRdE56QXVOU0F5T1M0MWFDMHhNREI2VFRRd01DQTRNREIyTVRVd2NUQWdNakVnTVRVZ016VXVOWFF6TlNBeE5DNDFhREl3TUNCeE1qQWdNQ0F6TlNBdE1UUXVOWFF4TlNBdE16VXVOWFl0TVRVd2FDMHpNREI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEF6TkRzaUlHUTlJazB4TWpVZ01URXdNR2cxTUhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRFd056Vm9MVEV3TUhZeE1EYzFjVEFnTVRBZ055NDFJREUzTGpWME1UY3VOU0EzTGpWNlRURXdOelVnTVRBMU1uRTBJREFnT1NBdE1uRXhOaUF0TmlBeE5pQXRNak4yTFRReU1YRXdJQzAySUMweklDMHhNbkV0TXpNZ0xUVTVJQzAyTmk0MUlDMDVPWFF0TmpVdU5TQXROVGgwTFRVMkxqVWdMVEkwTGpWMExUVXlMalVnTFRZdU5YRXRNallnTUNBdE5UY3VOU0EyTGpWMExUVXlMalVnTVRNdU5YUXROakFnTWpGeExUUXhJREUxSUMwMk15QXlNaTQxZEMwMU55NDFJREUxZEMwMk5TNDFJRGN1TlNCeExUZzFJREFnTFRFMk1DQXROVGR4TFRjZ0xUVWdMVEUxSUMwMWNTMDJJREFnTFRFeElETnhMVEUwSURjZ0xURTBJREl5ZGpRek9IRXlNaUExTlNBNE1pQTVPQzQxZERFeE9TQTBOaTQxY1RJeklESWdORE1nTUM0MWREUXpJQzAzZERNeUxqVWdMVGd1TlhRek9DQXRNVE4wTXpJdU5TQXRNVEZ4TkRFZ0xURTBJRFl6TGpVZ0xUSXhkRFUzSUMweE5IUTJNeTQxSUMwM2NURXdNeUF3SURFNE15QTROM0UzSURnZ01UZ2dPSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNRE0xT3lJZ1pEMGlUVFl3TUNBeE1UYzFjVEV4TmlBd0lESXlOeUF0TkRrdU5YUXhPVEl1TlNBdE1UTXhkREV6TVNBdE1Ua3lMalYwTkRrdU5TQXRNakkzZGkwek1EQnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFhQzAxTUhFdE1UQWdNQ0F0TVRjdU5TQTNMalYwTFRjdU5TQXhOeTQxZGpNd01IRXdJREV5TnlBdE56QXVOU0F5TXpFdU5YUXRNVGcwTGpVZ01UWXhMalYwTFRJME5TQTFOM1F0TWpRMUlDMDFOM1F0TVRnMExqVWdMVEUyTVM0MWRDMDNNQzQxSUMweU16RXVOWFl0TXpBd2NUQWdMVEV3SUMwM0xqVWdMVEUzTGpWMExURTNMalVnTFRjdU5XZ3ROVEFnY1MweE1DQXdJQzB4Tnk0MUlEY3VOWFF0Tnk0MUlERTNMalYyTXpBd2NUQWdNVEUySURRNUxqVWdNakkzZERFek1TQXhPVEl1TlhReE9USXVOU0F4TXpGME1qSTNJRFE1TGpWNlRUSXlNQ0ExTURCb01UWXdjVGdnTUNBeE5DQXROblEySUMweE5IWXRORFl3Y1RBZ0xUZ2dMVFlnTFRFMGRDMHhOQ0F0Tm1ndE1UWXdjUzA0SURBZ0xURTBJRFowTFRZZ01UUjJORFl3Y1RBZ09DQTJJREUwZERFMElEWjZUVGd5TUNBMU1EQm9NVFl3Y1RnZ01DQXhOQ0F0Tm5RMklDMHhOSFl0TkRZd2NUQWdMVGdnTFRZZ0xURTBkQzB4TkNBdE5tZ3RNVFl3Y1MwNElEQWdMVEUwSURaMExUWWdNVFIyTkRZd0lIRXdJRGdnTmlBeE5IUXhOQ0EyZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TXpZN0lpQmtQU0pOTXpJeElEZ3hOR3d5TlRnZ01UY3ljVGtnTmlBeE5TQXlMalYwTmlBdE1UTXVOWFl0TnpVd2NUQWdMVEV3SUMwMklDMHhNeTQxZEMweE5TQXlMalZzTFRJMU9DQXhOekp4TFRJeElERTBJQzAwTmlBeE5HZ3RNalV3Y1MweE1DQXdJQzB4Tnk0MUlEY3VOWFF0Tnk0MUlERTNMalYyTXpVd2NUQWdNVEFnTnk0MUlERTNMalYwTVRjdU5TQTNMalZvTWpVd2NUSTFJREFnTkRZZ01UUjZUVGt3TUNBMk5qaHNNVEl3SURFeU1IRTNJRGNnTVRjZ04zUXhOeUF0TjJ3ek5DQXRNelJ4TnlBdE55QTNJQzB4TjNRdE55QXRNVGRzTFRFeU1DQXRNVEl3YkRFeU1DQXRNVEl3Y1RjZ0xUY2dOeUF0TVRjZ2RDMDNJQzB4TjJ3dE16UWdMVE0wY1MwM0lDMDNJQzB4TnlBdE4zUXRNVGNnTjJ3dE1USXdJREV4T1d3dE1USXdJQzB4TVRseExUY2dMVGNnTFRFM0lDMDNkQzB4TnlBM2JDMHpOQ0F6TkhFdE55QTNJQzAzSURFM2REY2dNVGRzTVRFNUlERXlNR3d0TVRFNUlERXlNSEV0TnlBM0lDMDNJREUzZERjZ01UZHNNelFnTXpSeE55QTRJREUzSURoME1UY2dMVGg2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEF6TnpzaUlHUTlJazB6TWpFZ09ERTBiREkxT0NBeE56SnhPU0EySURFMUlESXVOWFEySUMweE15NDFkaTAzTlRCeE1DQXRNVEFnTFRZZ0xURXpMalYwTFRFMUlESXVOV3d0TWpVNElERTNNbkV0TWpFZ01UUWdMVFEySURFMGFDMHlOVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFl6TlRCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOV2d5TlRCeE1qVWdNQ0EwTmlBeE5IcE5OelkySURrd01HZzBjVEV3SUMweElERTJJQzB4TUhFNU5pQXRNVEk1SURrMklDMHlPVEJ4TUNBdE1UVTBJQzA1TUNBdE1qZ3hjUzAySUMwNUlDMHhOeUF0TVRCc0xUTWdMVEZ4TFRrZ01DQXRNVFlnTmlCc0xUSTVJREl6Y1MwM0lEY2dMVGd1TlNBeE5pNDFkRFF1TlNBeE55NDFjVGN5SURFd015QTNNaUF5TWpseE1DQXhNeklnTFRjNElESXpPSEV0TmlBNElDMDBMalVnTVRoME9TNDFJREUzYkRJNUlESXljVGNnTlNBeE5TQTFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXdNemc3SWlCa1BTSk5PVFkzSURFd01EUm9NM0V4TVNBdE1TQXhOeUF0TVRCeE1UTTFJQzB4TnprZ01UTTFJQzB6T1RaeE1DQXRNVEExSUMwek5DQXRNakEyTGpWMExUazRJQzB4T0RVdU5YRXROeUF0T1NBdE1UY2dMVEV3YUMwemNTMDVJREFnTFRFMklEWnNMVFF5SURNMGNTMDRJRFlnTFRrZ01UWjBOU0F4T0hFeE1URWdNVFV3SURFeE1TQXpNamh4TUNBNU1DQXRNamt1TlNBeE56WjBMVGcwTGpVZ01UVTNjUzAySURrZ0xUVWdNVGwwTVRBZ01UWnNORElnTXpOeE55QTFJREUxSURWNlRUTXlNU0E0TVRSc01qVTRJREUzTW5FNUlEWWdNVFVnTWk0MWREWWdMVEV6TGpWMkxUYzFNSEV3SUMweE1DQXROaUF0TVRNdU5TQjBMVEUxSURJdU5Xd3RNalU0SURFM01uRXRNakVnTVRRZ0xUUTJJREUwYUMweU5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWXpOVEJ4TUNBeE1DQTNMalVnTVRjdU5YUXhOeTQxSURjdU5XZ3lOVEJ4TWpVZ01DQTBOaUF4TkhwTk56WTJJRGt3TUdnMGNURXdJQzB4SURFMklDMHhNSEU1TmlBdE1USTVJRGsySUMweU9UQnhNQ0F0TVRVMElDMDVNQ0F0TWpneGNTMDJJQzA1SUMweE55QXRNVEJzTFRNZ0xURnhMVGtnTUNBdE1UWWdObXd0TWprZ01qTnhMVGNnTnlBdE9DNDFJREUyTGpWME5DNDFJREUzTGpWeE56SWdNVEF6SURjeUlESXlPWEV3SURFek1pQXROemdnTWpNNElIRXROaUE0SUMwMExqVWdNVGd1TlhRNUxqVWdNVFl1Tld3eU9TQXlNbkUzSURVZ01UVWdOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNRE01T3lJZ1pEMGlUVFV3TUNBNU1EQm9NVEF3ZGkweE1EQm9MVEV3TUhZdE1UQXdhQzAwTURCMkxURXdNR2d0TVRBd2RqWXdNR2cxTURCMkxUTXdNSHBOTVRJd01DQTNNREJvTFRJd01IWXRNVEF3YURJd01IWXRNakF3YUMwek1EQjJNekF3YUMweU1EQjJNekF3YUMweE1EQjJNakF3YURZd01IWXROVEF3ZWsweE1EQWdNVEV3TUhZdE16QXdhRE13TUhZek1EQm9MVE13TUhwTk9EQXdJREV4TURCMkxUTXdNR2d6TURCMk16QXdhQzB6TURCNlRUTXdNQ0E1TURCb0xURXdNSFl4TURCb01UQXdkaTB4TURCNlRURXdNREFnT1RBd2FDMHhNREIyTVRBd2FERXdNSFl0TVRBd2VrMHpNREFnTlRBd2FESXdNSFl0TlRBd0lHZ3ROVEF3ZGpVd01HZ3lNREIyTVRBd2FERXdNSFl0TVRBd2VrMDRNREFnTXpBd2FESXdNSFl0TVRBd2FDMHhNREIyTFRFd01HZ3RNakF3ZGpFd01HZ3RNVEF3ZGpFd01HZ3hNREIyTWpBd2FDMHlNREIyTVRBd2FETXdNSFl0TXpBd2VrMHhNREFnTkRBd2RpMHpNREJvTXpBd2RqTXdNR2d0TXpBd2VrMHpNREFnTWpBd2FDMHhNREIyTVRBd2FERXdNSFl0TVRBd2VrMHhNakF3SURJd01HZ3RNVEF3ZGpFd01HZ3hNREIyTFRFd01IcE5OekF3SURCb0xURXdNSFl4TURCb01UQXdkaTB4TURCNlRURXlNREFnTUdndE16QXdkakV3TUdnek1EQjJMVEV3TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURRd095SWdaRDBpVFRFd01DQXlNREJvTFRFd01IWXhNREF3YURFd01IWXRNVEF3TUhwTk16QXdJREl3TUdndE1UQXdkakV3TURCb01UQXdkaTB4TURBd2VrMDNNREFnTWpBd2FDMHlNREIyTVRBd01HZ3lNREIyTFRFd01EQjZUVGt3TUNBeU1EQm9MVEV3TUhZeE1EQXdhREV3TUhZdE1UQXdNSHBOTVRJd01DQXlNREJvTFRJd01IWXhNREF3YURJd01IWXRNVEF3TUhwTk5EQXdJREJvTFRNd01IWXhNREJvTXpBd2RpMHhNREI2VFRZd01DQXdhQzB4TURCMk9URm9NVEF3ZGkwNU1YcE5PREF3SURCb0xURXdNSFk1TVdneE1EQjJMVGt4ZWsweE1UQXdJREJvTFRJd01IWTVNV2d5TURCMkxUa3hlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXdOREU3SWlCa1BTSk5OVEF3SURFeU1EQnNOamd5SUMwMk9ESnhPQ0F0T0NBNElDMHhPSFF0T0NBdE1UaHNMVFEyTkNBdE5EWTBjUzA0SUMwNElDMHhPQ0F0T0hRdE1UZ2dPR3d0TmpneUlEWTRNbXd4SURRM05YRXdJREV3SURjdU5TQXhOeTQxZERFM0xqVWdOeTQxYURRM05IcE5NekU1TGpVZ01UQXlOQzQxY1MweU9TNDFJREk1TGpVZ0xUY3hJREk1TGpWMExUY3hJQzB5T1M0MWRDMHlPUzQxSUMwM01TNDFkREk1TGpVZ0xUY3hMalYwTnpFZ0xUSTVMalYwTnpFZ01qa3VOWFF5T1M0MUlEY3hMalYwTFRJNUxqVWdOekV1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURReU95SWdaRDBpVFRVd01DQXhNakF3YkRZNE1pQXROamd5Y1RnZ0xUZ2dPQ0F0TVRoMExUZ2dMVEU0YkMwME5qUWdMVFEyTkhFdE9DQXRPQ0F0TVRnZ0xUaDBMVEU0SURoc0xUWTRNaUEyT0RKc01TQTBOelZ4TUNBeE1DQTNMalVnTVRjdU5YUXhOeTQxSURjdU5XZzBOelI2VFRnd01DQXhNakF3YkRZNE1pQXROamd5Y1RnZ0xUZ2dPQ0F0TVRoMExUZ2dMVEU0YkMwME5qUWdMVFEyTkhFdE9DQXRPQ0F0TVRnZ0xUaDBMVEU0SURoc0xUVTJJRFUyYkRReU5DQTBNalpzTFRjd01DQTNNREJvTVRVd2VrMHpNVGt1TlNBeE1ESTBMalZ4TFRJNUxqVWdNamt1TlNBdE56RWdNamt1TlhRdE56RWdMVEk1TGpVZ2RDMHlPUzQxSUMwM01TNDFkREk1TGpVZ0xUY3hMalYwTnpFZ0xUSTVMalYwTnpFZ01qa3VOWFF5T1M0MUlEY3hMalYwTFRJNUxqVWdOekV1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURRek95SWdaRDBpVFRNd01DQXhNakF3YURneU5YRTNOU0F3SURjMUlDMDNOWFl0T1RBd2NUQWdMVEkxSUMweE9DQXRORE5zTFRZMElDMDJOSEV0T0NBdE9DQXRNVE1nTFRVdU5YUXROU0F4TWk0MWRqazFNSEV3SURFd0lDMDNMalVnTVRjdU5YUXRNVGN1TlNBM0xqVm9MVGN3TUhFdE1qVWdNQ0F0TkRNZ0xURTRiQzAyTkNBdE5qUnhMVGdnTFRnZ0xUVXVOU0F0TVROME1USXVOU0F0TldnM01EQnhNVEFnTUNBeE55NDFJQzAzTGpWME55NDFJQzB4Tnk0MWRpMDVOVEJ4TUNBdE1UQWdMVGN1TlNBdE1UY3VOWFF0TVRjdU5TQXROeTQxYUMwNE5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWTVOelVnY1RBZ01qVWdNVGdnTkROc01UTTVJREV6T1hFeE9DQXhPQ0EwTXlBeE9Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EUTBPeUlnWkQwaVRUSTFNQ0F4TWpBd2FEZ3dNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TVRFMU1Hd3RORFV3SURRME5Hd3RORFV3SUMwME5EVjJNVEUxTVhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEEwTlRzaUlHUTlJazA0TWpJZ01USXdNR2d0TkRRMGNTMHhNU0F3SUMweE9TQXROeTQxZEMwNUlDMHhOeTQxYkMwM09DQXRNekF4Y1MwM0lDMHlOQ0EzSUMwME5XdzFOeUF0TVRBNGNUWWdMVGtnTVRjdU5TQXRNVFYwTWpFdU5TQXRObWcwTlRCeE1UQWdNQ0F5TVM0MUlEWjBNVGN1TlNBeE5XdzJNaUF4TURoeE1UUWdNakVnTnlBME5Xd3RPRE1nTXpBeGNTMHhJREV3SUMwNUlERTNMalYwTFRFNUlEY3VOWHBOTVRFM05TQTRNREJvTFRFMU1IRXRNVEFnTUNBdE1qRWdMVFl1TlhRdE1UVWdMVEUxTGpWc0xUYzRJQzB4TlRaeExUUWdMVGtnTFRFMUlDMHhOUzQxZEMweU1TQXROaTQxYUMwMU5UQWdjUzB4TUNBd0lDMHlNU0EyTGpWMExURTFJREUxTGpWc0xUYzRJREUxTm5FdE5DQTVJQzB4TlNBeE5TNDFkQzB5TVNBMkxqVm9MVEUxTUhFdE1UQWdNQ0F0TVRjdU5TQXROeTQxZEMwM0xqVWdMVEUzTGpWMkxUWTFNSEV3SUMweE1DQTNMalVnTFRFM0xqVjBNVGN1TlNBdE55NDFhREUxTUhFeE1DQXdJREUzTGpVZ055NDFkRGN1TlNBeE55NDFkakUxTUhFd0lERXdJRGN1TlNBeE55NDFkREUzTGpVZ055NDFhRGMxTUhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRFMU1IRXdJQzB4TUNBM0xqVWdMVEUzTGpWME1UY3VOU0F0Tnk0MWFERTFNSEV4TUNBd0lERTNMalVnTnk0MUlIUTNMalVnTVRjdU5YWTJOVEJ4TUNBeE1DQXROeTQxSURFM0xqVjBMVEUzTGpVZ055NDFlazA0TlRBZ01qQXdhQzAxTURCeExURXdJREFnTFRFNUxqVWdMVGQwTFRFeExqVWdMVEUzYkMwek9DQXRNVFV5Y1MweUlDMHhNQ0F6TGpVZ0xURTNkREUxTGpVZ0xUZG9OakF3Y1RFd0lEQWdNVFV1TlNBM2RETXVOU0F4TjJ3dE16Z2dNVFV5Y1MweUlERXdJQzB4TVM0MUlERTNkQzB4T1M0MUlEZDZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQTBOanNpSUdROUlrMDFNREFnTVRFd01HZ3lNREJ4TlRZZ01DQXhNREl1TlNBdE1qQXVOWFEzTWk0MUlDMDFNSFEwTkNBdE5UbDBNalVnTFRVd0xqVnNOaUF0TWpCb01UVXdjVFF4SURBZ056QXVOU0F0TWprdU5YUXlPUzQxSUMwM01DNDFkaTAyTURCeE1DQXROREVnTFRJNUxqVWdMVGN3TGpWMExUY3dMalVnTFRJNUxqVm9MVEV3TURCeExUUXhJREFnTFRjd0xqVWdNamt1TlhRdE1qa3VOU0EzTUM0MWRqWXdNSEV3SURReElESTVMalVnTnpBdU5YUTNNQzQxSURJNUxqVm9NVFV3Y1RJZ09DQTJMalVnTWpFdU5YUXlOQ0EwT0hRME5TQTJNWFEzTWlBME9IUXhNREl1TlNBeU1TNDFlazA1TURBZ09EQXdkaTB4TURBZ2FERXdNSFl4TURCb0xURXdNSHBOTmpBd0lEY3pNSEV0T1RVZ01DQXRNVFl5TGpVZ0xUWTNMalYwTFRZM0xqVWdMVEUyTWk0MWREWTNMalVnTFRFMk1pNDFkREUyTWk0MUlDMDJOeTQxZERFMk1pNDFJRFkzTGpWME5qY3VOU0F4TmpJdU5YUXROamN1TlNBeE5qSXVOWFF0TVRZeUxqVWdOamN1TlhwTk5qQXdJRFl3TTNFME15QXdJRGN6SUMwek1IUXpNQ0F0TnpOMExUTXdJQzAzTTNRdE56TWdMVE13ZEMwM015QXpNSFF0TXpBZ056TjBNekFnTnpOME56TWdNekI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEEwTnpzaUlHUTlJazAyT0RFZ01URTVPV3d6T0RVZ0xUazVPSEV5TUNBdE5UQWdOakFnTFRreWNURTRJQzB4T1NBek5pNDFJQzB5T1M0MWRESTNMalVnTFRFeExqVnNNVEFnTFRKMkxUWTJhQzAwTVRkMk5qWnhOVE1nTUNBM05TQTBNeTQxZERVZ09EZ3VOV3d0T0RJZ01qSXlhQzB6T1RGeExUVTRJQzB4TkRVZ0xUa3lJQzB5TXpSeExURXhJQzB6TkNBdE5pNDFJQzAxTjNReU5TNDFJQzB6TjNRME5pQXRNakIwTlRVZ0xUWjJMVFkyYUMwek5qVjJOalp4TlRZZ01qUWdPRFFnTlRKeE1USWdNVElnTWpVZ016QXVOWFF5TUNBek1TNDFiRGNnTVROc016azVJREV3TURab09UTjZUVFF4TmlBMU1qRm9NelF3SUd3dE1UWXlJRFExTjNvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURRNE95SWdaRDBpVFRjMU15QTJOREZ4TlNBdE1TQXhOQzQxSUMwMExqVjBNellnTFRFMUxqVjBOVEF1TlNBdE1qWXVOWFExTXk0MUlDMDBNSFExTUM0MUlDMDFOQzQxZERNMUxqVWdMVGN3ZERFMExqVWdMVGczY1RBZ0xUWTNJQzB5Tnk0MUlDMHhNalV1TlhRdE56RXVOU0F0T1RjdU5YUXRPVGd1TlNBdE5qWXVOWFF0TVRBNExqVWdMVFF3TGpWMExURXdNaUF0TVROb0xUVXdNSFk0T1hFME1TQTNJRGN3TGpVZ016SXVOWFF5T1M0MUlEWTFMalYyT0RJM2NUQWdNalFnTFRBdU5TQXpOSFF0TXk0MUlESTBkQzA0TGpVZ01Ua3VOWFF0TVRjZ01UTXVOWFF0TWpnZ01USXVOWFF0TkRJdU5TQXhNUzQxZGpjeElHdzBOekVnTFRGeE5UY2dNQ0F4TVRVdU5TQXRNakF1TlhReE1EZ2dMVFUzZERnd0xqVWdMVGswZERNeElDMHhNalF1TlhFd0lDMDFNU0F0TVRVdU5TQXRPVFl1TlhRdE16Z2dMVGMwTGpWMExUUTFJQzAxTUM0MWRDMHpPQzQxSUMwek1DNDFlazAwTURBZ056QXdhREV6T1hFM09DQXdJREV6TUM0MUlEUTRMalYwTlRJdU5TQXhNakl1TlhFd0lEUXhJQzA0TGpVZ056QXVOWFF0TWprdU5TQTFOUzQxZEMwMk1pNDFJRE01TGpWMExURXdNeTQxSURFekxqVm9MVEV4T0hZdE16VXdlazAwTURBZ01qQXdhREl4Tm5FNE1DQXdJREV5TVNBMU1DNDFkRFF4SURFek1DNDFjVEFnT1RBZ0xUWXlMalVnTVRVMExqVWdkQzB4TlRZdU5TQTJOQzQxYUMweE5UbDJMVFF3TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURRNU95SWdaRDBpVFRnM055QXhNakF3YkRJZ0xUVTNjUzA0TXlBdE1Ua2dMVEV4TmlBdE5EVXVOWFF0TkRBZ0xUWTJMalZzTFRFek1pQXRPRE01Y1MwNUlDMDBPU0F4TXlBdE5qbDBPVFlnTFRJMmRpMDVOMmd0TlRBd2RqazNjVEU0TmlBeE5pQXlNREFnT1Roc01UY3pJRGd6TW5FeklERTNJRE1nTXpCMExURXVOU0F5TWk0MWRDMDVJREUzTGpWMExURXpMalVnTVRJdU5YUXRNakV1TlNBeE1IUXRNallnT0M0MWRDMHpNeTQxSURFd2NTMHhNeUF6SUMweE9TQTFkalUzYURReU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EVXdPeUlnWkQwaVRURXpNREFnT1RBd2FDMDFNSEV3SURJeElDMDBJRE0zZEMwNUxqVWdNall1TlhRdE1UZ2dNVGN1TlhRdE1qSWdNVEYwTFRJNExqVWdOUzQxZEMwek1TQXlkQzB6TnlBd0xqVm9MVEl3TUhZdE9EVXdjVEFnTFRJeUlESTFJQzB6TkM0MWREVXdJQzB4TXk0MWJESTFJQzB5ZGkweE1EQm9MVFF3TUhZeE1EQnhOQ0F3SURFeElEQXVOWFF5TkNBemRETXdJRGQwTWpRZ01UVjBNVEVnTWpRdU5YWTROVEJvTFRJd01IRXRNalVnTUNBdE16Y2dMVEF1TlhRdE16RWdMVEowTFRJNExqVWdMVFV1TlhRdE1qSWdMVEV4ZEMweE9DQXRNVGN1TlhRdE9TNDFJQzB5Tmk0MWRDMDBJQzB6TjJndE5UQjJNekF3SUdneE1EQXdkaTB6TURCNlRURTNOU0F4TURBd2FDMDNOWFl0T0RBd2FEYzFiQzB4TWpVZ0xURTJOMnd0TVRJMUlERTJOMmczTlhZNE1EQm9MVGMxYkRFeU5TQXhOamQ2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEExTVRzaUlHUTlJazB4TVRBd0lEa3dNR2d0TlRCeE1DQXlNU0F0TkNBek4zUXRPUzQxSURJMkxqVjBMVEU0SURFM0xqVjBMVEl5SURFeGRDMHlPQzQxSURVdU5YUXRNekVnTW5RdE16Y2dNQzQxYUMweU1EQjJMVFkxTUhFd0lDMHlNaUF5TlNBdE16UXVOWFExTUNBdE1UTXVOV3d5TlNBdE1uWXRNVEF3YUMwME1EQjJNVEF3Y1RRZ01DQXhNU0F3TGpWME1qUWdNM1F6TUNBM2RESTBJREUxZERFeElESTBMalYyTmpVd2FDMHlNREJ4TFRJMUlEQWdMVE0zSUMwd0xqVjBMVE14SUMweWRDMHlPQzQxSUMwMUxqVjBMVEl5SUMweE1YUXRNVGdnTFRFM0xqVjBMVGt1TlNBdE1qWXVOWFF0TkNBdE16ZG9MVFV3ZGpNd01DQm9NVEF3TUhZdE16QXdlazB4TVRZM0lEVXdiQzB4TmpjZ0xURXlOWFkzTldndE9EQXdkaTAzTld3dE1UWTNJREV5Tld3eE5qY2dNVEkxZGkwM05XZzRNREIyTnpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRBMU1qc2lJR1E5SWswMU1DQXhNVEF3YURZd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNVEF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDJNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNlRUVXdJRGd3TUdneE1EQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB4TURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVEV3TURCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqRXdNQ0J4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazAxTUNBMU1EQm9PREF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkweE1EQnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRnd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNVEF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTlRBZ01qQXdhREV4TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxURXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE1URXdNQ0J4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRBMU16c2lJR1E5SWsweU5UQWdNVEV3TUdnM01EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVEV3TUhFd0lDMHlNU0F0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3ROekF3Y1MweU1TQXdJQzB6TlM0MUlERTBMalYwTFRFMExqVWdNelV1TlhZeE1EQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMDFNQ0E0TURCb01URXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TVRBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB4TVRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXhNREFnY1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTWpVd0lEVXdNR2czTURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxURXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE56QXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl4TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWswMU1DQXlNREJvTVRFd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNVEF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMHhNVEF3SUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk1UQXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EVTBPeUlnWkQwaVRUVXdNQ0E1TlRCMk1UQXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5XZzJNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRFd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TmpBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YcE5NVEF3SURZMU1IWXhNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFhREV3TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxURXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE1UQXdNQ0J4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZWswek1EQWdNelV3ZGpFd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWb09EQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB4TURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVGd3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWNlRUQWdOVEIyTVRBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TldneE1UQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB4TURBZ2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB4TVRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EVTFPeUlnWkQwaVRUVXdJREV4TURCb01URXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TVRBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB4TVRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXhNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazAxTUNBNE1EQm9NVEV3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1UQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweE1UQXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl4TURBZ2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhwTk5UQWdOVEF3YURFeE1EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVEV3TUhFd0lDMHlNU0F0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3RNVEV3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk1UQXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5YcE5OVEFnTWpBd2FERXhNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRFd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TVRFd01DQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakV3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEExTmpzaUlHUTlJazAxTUNBeE1UQXdhREV3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1UQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweE1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakV3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRNMU1DQXhNVEF3YURnd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNVEF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDRNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFd01DQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMDFNQ0E0TURCb01UQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB4TURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVEV3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk1UQXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5YcE5NelV3SURnd01HZzRNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRFd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0T0RBd0lIRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNVEF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTlRBZ05UQXdhREV3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1UQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweE1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakV3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRNMU1DQTFNREJvT0RBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMHhNREFnY1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDRNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNlRUVXdJREl3TUdneE1EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVEV3TUhFd0lDMHlNU0F0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3RNVEF3Y1MweU1TQXdJQzB6TlM0MUlERTBMalYwTFRFMExqVWdNelV1TlhZeE1EQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMHpOVEFnTWpBd2FEZ3dNQ0J4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRFd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0T0RBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXhNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXdOVGM3SWlCa1BTSk5OREF3SURCb0xURXdNSFl4TVRBd2FERXdNSFl0TVRFd01IcE5OVFV3SURFeE1EQm9NVEF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkweE1EQnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRFd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNVEF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTlRVd0lEZ3dNR2cxTURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxURXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE5UQXdJSEV0TWpFZ01DQXRNelV1TlNBeE5DNDFkQzB4TkM0MUlETTFMalYyTVRBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhwTk1qWTNJRFUxTUd3dE1UWTNJQzB4TWpWMk56Vm9MVEl3TUhZeE1EQm9NakF3ZGpjMWVrMDFOVEFnTlRBd2FETXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TVRBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB6TURCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqRXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVFUxTUNBeU1EQm9OakF3SUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1UQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMwMk1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakV3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEExT0RzaUlHUTlJazAxTUNBeE1UQXdhREV3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1UQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweE1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakV3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRrd01DQXdhQzB4TURCMk1URXdNR2d4TURCMkxURXhNREI2VFRVd0lEZ3dNR2cxTURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxURXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE5UQXdJSEV0TWpFZ01DQXRNelV1TlNBeE5DNDFkQzB4TkM0MUlETTFMalYyTVRBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhwTk1URXdNQ0EyTURCb01qQXdkaTB4TURCb0xUSXdNSFl0TnpWc0xURTJOeUF4TWpWc01UWTNJREV5TlhZdE56VjZUVFV3SURVd01HZ3pNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRFd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TXpBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXhNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazAxTUNBeU1EQm9OakF3SUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1UQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMwMk1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakV3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEExT1RzaUlHUTlJazAzTlNBeE1EQXdhRGMxTUhFek1TQXdJRFV6SUMweU1uUXlNaUF0TlROMkxUWTFNSEV3SUMwek1TQXRNaklnTFRVemRDMDFNeUF0TWpKb0xUYzFNSEV0TXpFZ01DQXROVE1nTWpKMExUSXlJRFV6ZGpZMU1IRXdJRE14SURJeUlEVXpkRFV6SURJeWVrMHhNakF3SURNd01Hd3RNekF3SURNd01Hd3pNREFnTXpBd2RpMDJNREI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEEyTURzaUlHUTlJazAwTkNBeE1UQXdhREV4TVRKeE1UZ2dNQ0F6TVNBdE1UTjBNVE1nTFRNeGRpMHhNREV5Y1RBZ0xURTRJQzB4TXlBdE16RjBMVE14SUMweE0yZ3RNVEV4TW5FdE1UZ2dNQ0F0TXpFZ01UTjBMVEV6SURNeGRqRXdNVEp4TUNBeE9DQXhNeUF6TVhRek1TQXhNM3BOTVRBd0lERXdNREIyTFRjek4yd3lORGNnTVRneWJESTVPQ0F0TVRNeGJDMDNOQ0F4TlRac01qa3pJRE14T0d3eU16WWdMVEk0T0hZMU1EQm9MVEV3TURCNlRUTTBNaUE0T0RSeE5UWWdNQ0E1TlNBdE16bDBNemtnTFRrMExqVjBMVE01SUMwNU5YUXRPVFVnTFRNNUxqVjBMVGsxSURNNUxqVjBMVE01SURrMWRETTVJRGswTGpVZ2REazFJRE01ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TmpJN0lpQmtQU0pOTmpRNElERXhOamx4TVRFM0lEQWdNakUySUMwMk1IUXhOVFl1TlNBdE1UWXhkRFUzTGpVZ0xUSXhPSEV3SUMweE1UVWdMVGN3SUMweU5UaHhMVFk1SUMweE1Ea2dMVEUxT0NBdE1qSTFMalYwTFRFME15QXRNVGM1TGpWc0xUVTBJQzAyTW5FdE9TQTRJQzB5TlM0MUlESTBMalYwTFRZekxqVWdOamN1TlhRdE9URWdNVEF6ZEMwNU9DNDFJREV5T0hRdE9UVXVOU0F4TkRoeExUWXdJREV6TWlBdE5qQWdNalE1Y1RBZ09EZ2dNelFnTVRZNUxqVjBPVEV1TlNBeE5ESjBNVE0zSURrMkxqVjBNVFkyTGpVZ016WjZUVFkxTWk0MUlEazNOSEV0T1RFdU5TQXdJQzB4TlRZdU5TQXROalVnZEMwMk5TQXRNVFUzZERZMUlDMHhOVFl1TlhReE5UWXVOU0F0TmpRdU5YUXhOVFl1TlNBMk5DNDFkRFkxSURFMU5pNDFkQzAyTlNBeE5UZDBMVEUxTmk0MUlEWTFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXdOak03SWlCa1BTSk5OakF3SURFeE56ZHhNVEUzSURBZ01qSTBJQzAwTlM0MWRERTROQzQxSUMweE1qTjBNVEl6SUMweE9EUXVOWFEwTlM0MUlDMHlNalIwTFRRMUxqVWdMVEl5TkhRdE1USXpJQzB4T0RRdU5YUXRNVGcwTGpVZ0xURXlNM1F0TWpJMElDMDBOUzQxZEMweU1qUWdORFV1TlhRdE1UZzBMalVnTVRJemRDMHhNak1nTVRnMExqVjBMVFExTGpVZ01qSTBkRFExTGpVZ01qSTBkREV5TXlBeE9EUXVOWFF4T0RRdU5TQXhNak4wTWpJMElEUTFMalY2VFRZd01DQXhOek4yT0RVMGNTMHhNVFlnTUNBdE1qRTBMalVnTFRVM2RDMHhOVFV1TlNBdE1UVTFMalYwTFRVM0lDMHlNVFF1TlhRMU55QXRNakUwTGpVZ2RERTFOUzQxSUMweE5UVXVOWFF5TVRRdU5TQXROVGQ2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEEyTkRzaUlHUTlJazAxTlRRZ01USTVOWEV5TVNBdE56SWdOVGN1TlNBdE1UUXpMalYwTnpZZ0xURXpNSFE0TXlBdE1URTRkRGd5TGpVZ0xURXhOM1EzTUNBdE1URTJkRFE1TGpVZ0xURXlOblF4T0M0MUlDMHhNell1TlhFd0lDMDNNU0F0TWpVdU5TQXRNVE0xZEMwMk9DNDFJQzB4TVRGMExUazVJQzA0TW5RdE1URTRMalVnTFRVMGRDMHhNalV1TlNBdE1qTnhMVGcwSURVZ0xURTJNUzQxSURNMGRDMHhNemt1TlNBM09DNDFkQzA1T1NBeE1qVjBMVE0zSURFMk5DNDFjVEFnTmprZ01UZ2dNVE0yTGpWME5Ea3VOU0F4TWpZdU5YUTJPUzQxSURFeE5pNDFkRGd4TGpVZ01URTNMalYwT0RNdU5TQXhNVGtnZERjMkxqVWdNVE14ZERVNExqVWdNVFF6ZWswek5EUWdOekV3Y1MweU15QXRNek1nTFRRekxqVWdMVGN3TGpWMExUUXdMalVnTFRFd01pNDFkQzB4TnlBdE1USXpjVEVnTFRNM0lERTBMalVnTFRZNUxqVjBNekFnTFRVeWREUXhJQzB6TjNRek9DNDFJQzB5TkM0MWRETXpJQzB4TlhFeU1TQXROeUF6TWlBdE1YUXhNeUF5TW13MklETTBjVElnTVRBZ0xUSXVOU0F5TW5RdE1UTXVOU0F4T1hFdE5TQTBJQzB4TkNBeE1uUXRNamt1TlNBME1DNDFkQzB6TWk0MUlEY3pMalZ4TFRJMklEZzVJRFlnTWpjeGNUSWdNVEVnTFRZZ01URnhMVGdnTVNBdE1UVWdMVEV3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TmpVN0lpQmtQU0pOTVRBd01DQXhNREV6YkRFd09DQXhNVFZ4TWlBeElEVWdNblF4TXlBeWRESXdMalVnTFRGME1qVWdMVGt1TlhReU9DNDFJQzB5TVM0MWNUSXlJQzB5TWlBeU55QXRORE4wTUNBdE16SnNMVFlnTFRFd2JDMHhNRGdnTFRFeE5YcE5NelV3SURFeE1EQm9OREF3Y1RVd0lEQWdNVEExSUMweE0yd3RNVGczSUMweE9EZG9MVE0yT0hFdE5ERWdNQ0F0TnpBdU5TQXRNamt1TlhRdE1qa3VOU0F0TnpBdU5YWXROVEF3Y1RBZ0xUUXhJREk1TGpVZ0xUY3dMalYwTnpBdU5TQXRNamt1TldnMU1EQnhOREVnTUNBM01DNDFJREk1TGpWME1qa3VOU0EzTUM0MWRqRTRNbXd5TURBZ01qQXdkaTB6TXpJZ2NUQWdMVEUyTlNBdE9UTXVOU0F0TWpVM0xqVjBMVEkxTmk0MUlDMDVNaTQxYUMwME1EQnhMVEUyTlNBd0lDMHlOVGN1TlNBNU1pNDFkQzA1TWk0MUlESTFOeTQxZGpRd01IRXdJREUyTlNBNU1pNDFJREkxTnk0MWRESTFOeTQxSURreUxqVjZUVEV3TURrZ09EQXpiQzB6TmpJZ0xUTTJNbXd0TVRZeElDMDFNR3cxTlNBeE56QnNNelUxSURNMU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EWTJPeUlnWkQwaVRUTTFNQ0F4TVRBd2FETTJNWEV0TVRZMElDMHhORFlnTFRJeE5pQXRNakF3YUMweE9UVnhMVFF4SURBZ0xUY3dMalVnTFRJNUxqVjBMVEk1TGpVZ0xUY3dMalYyTFRVd01IRXdJQzAwTVNBeU9TNDFJQzAzTUM0MWREY3dMalVnTFRJNUxqVm9OVEF3Y1RReElEQWdOekF1TlNBeU9TNDFkREk1TGpVZ056QXVOV3d5TURBZ01UVXpkaTB4TUROeE1DQXRNVFkxSUMwNU1pNDFJQzB5TlRjdU5YUXRNalUzTGpVZ0xUa3lMalZvTFRRd01IRXRNVFkxSURBZ0xUSTFOeTQxSURreUxqVjBMVGt5TGpVZ01qVTNMalYyTkRBd2NUQWdNVFkxSURreUxqVWdNalUzTGpWME1qVTNMalVnT1RJdU5Yb2dUVGd5TkNBeE1EY3piRE16T1NBdE16QXhjVGdnTFRjZ09DQXRNVGN1TlhRdE9DQXRNVGN1Tld3dE16UXdJQzB6TURaeExUY2dMVFlnTFRFeUxqVWdMVFIwTFRZdU5TQXhNWFl5TUROeExUSTJJREVnTFRVMExqVWdNSFF0TnpndU5TQXROeTQxZEMwNU1pQXRNVGN1TlhRdE9EWWdMVE0xZEMwM01DQXROVGR4TVRBZ05Ua2dNek1nTVRBNGREVXhMalVnT0RFdU5YUTJOU0ExT0M0MWREWTRMalVnTkRBdU5YUTJOeUF5TkM0MWREVTJJREV6TGpWME5EQWdOQzQxZGpJeE1IRXhJREV3SURZdU5TQXhNaTQxZERFekxqVWdMVFF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURZM095SWdaRDBpVFRNMU1DQXhNVEF3YURNMU1IRTJNQ0F3SURFeU55QXRNak5zTFRFM09DQXRNVGMzYUMwek5EbHhMVFF4SURBZ0xUY3dMalVnTFRJNUxqVjBMVEk1TGpVZ0xUY3dMalYyTFRVd01IRXdJQzAwTVNBeU9TNDFJQzAzTUM0MWREY3dMalVnTFRJNUxqVm9OVEF3Y1RReElEQWdOekF1TlNBeU9TNDFkREk1TGpVZ056QXVOWFkyT1d3eU1EQWdNakF3ZGkweU1UbHhNQ0F0TVRZMUlDMDVNaTQxSUMweU5UY3VOWFF0TWpVM0xqVWdMVGt5TGpWb0xUUXdNSEV0TVRZMUlEQWdMVEkxTnk0MUlEa3lMalYwTFRreUxqVWdNalUzTGpWMk5EQXdjVEFnTVRZMUlEa3lMalVnTWpVM0xqVjBNalUzTGpVZ09USXVOWG9nVFRZME15QTJNemxzTXprMUlETTVOWEUzSURjZ01UY3VOU0EzZERFM0xqVWdMVGRzTVRBeElDMHhNREZ4TnlBdE55QTNJQzB4Tnk0MWRDMDNJQzB4Tnk0MWJDMDFNekVnTFRVek1uRXROeUF0TnlBdE1UY3VOU0F0TjNRdE1UY3VOU0EzYkMweU5EZ2dNalE0Y1MwM0lEY2dMVGNnTVRjdU5YUTNJREUzTGpWc01UQXhJREV3TVhFM0lEY2dNVGN1TlNBM2RERTNMalVnTFRkc01URXhJQzB4TVRGeE9DQXROeUF4T0NBdE4zUXhPQ0EzZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TmpnN0lpQmtQU0pOTXpFNElEa3hPR3d5TmpRZ01qWTBjVGdnT0NBeE9DQTRkREU0SUMwNGJESTJNQ0F0TWpZMGNUY2dMVGdnTkM0MUlDMHhNM1F0TVRJdU5TQXROV2d0TVRjd2RpMHlNREJvTWpBd2RqRTNNM0V3SURFd0lEVWdNVEowTVRNZ0xUVnNNalkwSUMweU5qQnhPQ0F0TnlBNElDMHhOeTQxZEMwNElDMHhOeTQxYkMweU5qUWdMVEkyTlhFdE9DQXROeUF0TVRNZ0xUVjBMVFVnTVRKMk1UY3phQzB5TURCMkxUSXdNR2d4TnpCeE1UQWdNQ0F4TWk0MUlDMDFkQzAwTGpVZ0xURXpiQzB5TmpBZ0xUSTJOSEV0T0NBdE9DQXRNVGdnTFRoMExURTRJRGhzTFRJMk5DQXlOalJ4TFRnZ09DQXROUzQxSURFeklIUXhNaTQxSURWb01UYzFkakl3TUdndE1qQXdkaTB4TnpOeE1DQXRNVEFnTFRVZ0xURXlkQzB4TXlBMWJDMHlOalFnTWpZMWNTMDRJRGNnTFRnZ01UY3VOWFE0SURFM0xqVnNNalkwSURJMk1IRTRJRGNnTVRNZ05YUTFJQzB4TW5ZdE1UY3phREl3TUhZeU1EQm9MVEUzTlhFdE1UQWdNQ0F0TVRJdU5TQTFkRFV1TlNBeE0zb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EWTVPeUlnWkQwaVRUSTFNQ0F4TVRBd2FERXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TkRNNGJEUTJOQ0EwTlROeE1UVWdNVFFnTWpVdU5TQXhNSFF4TUM0MUlDMHlOWFl0TVRBd01IRXdJQzB5TVNBdE1UQXVOU0F0TWpWMExUSTFMalVnTVRCc0xUUTJOQ0EwTlROMkxUUXpPSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE1UQXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl4TURBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURjd095SWdaRDBpVFRVd0lERXhNREJvTVRBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMDBNemhzTkRZMElEUTFNM0V4TlNBeE5DQXlOUzQxSURFd2RERXdMalVnTFRJMWRpMDBNemhzTkRZMElEUTFNM0V4TlNBeE5DQXlOUzQxSURFd2RERXdMalVnTFRJMWRpMHhNREF3Y1RBZ0xUSXhJQzB4TUM0MUlDMHlOWFF0TWpVdU5TQXhNR3d0TkRZMElEUTFNM1l0TkRNNGNUQWdMVEl4SUMweE1DNDFJQzB5TlhRdE1qVXVOU0F4TUd3dE5EWTBJRFExTTNZdE5ETTRjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweE1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5TQjBMVEUwTGpVZ016VXVOWFl4TURBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURjeE95SWdaRDBpVFRFeU1EQWdNVEExTUhZdE1UQXdNSEV3SUMweU1TQXRNVEF1TlNBdE1qVjBMVEkxTGpVZ01UQnNMVFEyTkNBME5UTjJMVFF6T0hFd0lDMHlNU0F0TVRBdU5TQXRNalYwTFRJMUxqVWdNVEJzTFRRNU1pQTBPREJ4TFRFMUlERTBJQzB4TlNBek5YUXhOU0F6Tld3ME9USWdORGd3Y1RFMUlERTBJREkxTGpVZ01UQjBNVEF1TlNBdE1qVjJMVFF6T0d3ME5qUWdORFV6Y1RFMUlERTBJREkxTGpVZ01UQjBNVEF1TlNBdE1qVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQTNNanNpSUdROUlrMHlORE1nTVRBM05HdzRNVFFnTFRRNU9IRXhPQ0F0TVRFZ01UZ2dMVEkyZEMweE9DQXRNalpzTFRneE5DQXRORGs0Y1MweE9DQXRNVEVnTFRNd0xqVWdMVFIwTFRFeUxqVWdNamgyTVRBd01IRXdJREl4SURFeUxqVWdNamgwTXpBdU5TQXROSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNRGN6T3lJZ1pEMGlUVEkxTUNBeE1EQXdhREl3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE9EQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweU1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkamd3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRZMU1DQXhNREF3YURJd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRPREF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMHlNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpnd01DQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVd056UTdJaUJrUFNKTk1URXdNQ0E1TlRCMkxUZ3dNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE9EQXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFk0TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxYURnd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EYzFPeUlnWkQwaVRUVXdNQ0EyTVRKMk5ETTRjVEFnTWpFZ01UQXVOU0F5TlhReU5TNDFJQzB4TUd3ME9USWdMVFE0TUhFeE5TQXRNVFFnTVRVZ0xUTTFkQzB4TlNBdE16VnNMVFE1TWlBdE5EZ3djUzB4TlNBdE1UUWdMVEkxTGpVZ0xURXdkQzB4TUM0MUlESTFkalF6T0d3dE5EWTBJQzAwTlROeExURTFJQzB4TkNBdE1qVXVOU0F0TVRCMExURXdMalVnTWpWMk1UQXdNSEV3SURJeElERXdMalVnTWpWME1qVXVOU0F0TVRCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRBM05qc2lJR1E5SWsweE1EUTRJREV4TURKc01UQXdJREZ4TWpBZ01DQXpOU0F0TVRRdU5YUXhOU0F0TXpVdU5XdzFJQzB4TURBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFiQzB4TURBZ0xURnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFiQzB5SURRek4yd3RORFl6SUMwME5UUnhMVEUwSUMweE5TQXRNalF1TlNBdE1UQXVOWFF0TVRBdU5TQXlOUzQxYkMweUlEUXpOMnd0TkRZeUlDMDBOVFZ4TFRFMUlDMHhOQ0F0TWpVdU5TQXRPUzQxZEMweE1DNDFJREkwTGpWc0xUVWdNVEF3TUhFd0lESXhJREV3TGpVZ01qVXVOWFF5TlM0MUlDMHhNQzQxYkRRMk5pQXRORFV3SUd3dE1pQTBNemh4TUNBeU1DQXhNQzQxSURJMExqVjBNalV1TlNBdE9TNDFiRFEyTmlBdE5EVXhiQzB5SURRek9IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRBM056c2lJR1E5SWswNE5UQWdNVEV3TUdneE1EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVEV3TURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVEV3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk5ETTRiQzAwTmpRZ0xUUTFNM0V0TVRVZ0xURTBJQzB5TlM0MUlDMHhNSFF0TVRBdU5TQXlOWFl4TURBd2NUQWdNakVnTVRBdU5TQXlOWFF5TlM0MUlDMHhNR3cwTmpRZ0xUUTFNM1kwTXpoeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3TnpnN0lpQmtQU0pOTmpnMklERXdPREZzTlRBeElDMDFOREJ4TVRVZ0xURTFJREV3TGpVZ0xUSTJkQzB5Tmk0MUlDMHhNV2d0TVRBME1uRXRNaklnTUNBdE1qWXVOU0F4TVhReE1DNDFJREkyYkRVd01TQTFOREJ4TVRVZ01UVWdNellnTVRWME16WWdMVEUxZWsweE5UQWdOREF3YURFd01EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVEV3TUhFd0lDMHlNU0F0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3RNVEF3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk1UQXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EYzVPeUlnWkQwaVRUZzROU0E1TURCc0xUTTFNaUF0TXpVemJETTFNaUF0TXpVemJDMHhPVGNnTFRFNU9Hd3ROVFV5SURVMU1tdzFOVElnTlRVd2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVd09EQTdJaUJrUFNKTk1UQTJOQ0ExTkRkc0xUVTFNU0F0TlRVeGJDMHhPVGdnTVRrNGJETTFNeUF6TlROc0xUTTFNeUF6TlROc01UazRJREU1T0hvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURneE95SWdaRDBpVFRZd01DQXhNVGMzY1RFeE55QXdJREl5TkNBdE5EVXVOWFF4T0RRdU5TQXRNVEl6ZERFeU15QXRNVGcwTGpWME5EVXVOU0F0TWpJMGRDMDBOUzQxSUMweU1qUjBMVEV5TXlBdE1UZzBMalYwTFRFNE5DNDFJQzB4TWpOMExUSXlOQ0F0TkRVdU5YUXRNakkwSURRMUxqVjBMVEU0TkM0MUlERXlNM1F0TVRJeklERTROQzQxZEMwME5TNDFJREl5TkhRME5TNDFJREl5TkhReE1qTWdNVGcwTGpWME1UZzBMalVnTVRJemRESXlOQ0EwTlM0MWVrMDJOVEFnT1RBd2FDMHhNREJ4TFRJeElEQWdMVE0xTGpVZ0xURTBMalYwTFRFMExqVWdMVE0xTGpWMkxURTFNR2d0TVRVd0lIRXRNakVnTUNBdE16VXVOU0F0TVRRdU5YUXRNVFF1TlNBdE16VXVOWFl0TVRBd2NUQWdMVEl4SURFMExqVWdMVE0xTGpWME16VXVOU0F0TVRRdU5XZ3hOVEIyTFRFMU1IRXdJQzB5TVNBeE5DNDFJQzB6TlM0MWRETTFMalVnTFRFMExqVm9NVEF3Y1RJeElEQWdNelV1TlNBeE5DNDFkREUwTGpVZ016VXVOWFl4TlRCb01UVXdjVEl4SURBZ016VXVOU0F4TkM0MWRERTBMalVnTXpVdU5YWXhNREJ4TUNBeU1TQXRNVFF1TlNBek5TNDFkQzB6TlM0MUlERTBMalZvTFRFMU1IWXhOVEJ4TUNBeU1TQXRNVFF1TlNBek5TNDFkQzB6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEE0TWpzaUlHUTlJazAyTURBZ01URTNOM0V4TVRjZ01DQXlNalFnTFRRMUxqVjBNVGcwTGpVZ0xURXlNM1F4TWpNZ0xURTROQzQxZERRMUxqVWdMVEl5TkhRdE5EVXVOU0F0TWpJMGRDMHhNak1nTFRFNE5DNDFkQzB4T0RRdU5TQXRNVEl6ZEMweU1qUWdMVFExTGpWMExUSXlOQ0EwTlM0MWRDMHhPRFF1TlNBeE1qTjBMVEV5TXlBeE9EUXVOWFF0TkRVdU5TQXlNalIwTkRVdU5TQXlNalIwTVRJeklERTROQzQxZERFNE5DNDFJREV5TTNReU1qUWdORFV1TlhwTk9EVXdJRGN3TUdndE5UQXdjUzB5TVNBd0lDMHpOUzQxSUMweE5DNDFkQzB4TkM0MUlDMHpOUzQxZGkweE1EQnhNQ0F0TWpFZ01UUXVOU0F0TXpVdU5TQjBNelV1TlNBdE1UUXVOV2cxTURCeE1qRWdNQ0F6TlM0MUlERTBMalYwTVRRdU5TQXpOUzQxZGpFd01IRXdJREl4SUMweE5DNDFJRE0xTGpWMExUTTFMalVnTVRRdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EZ3pPeUlnWkQwaVRUWXdNQ0F4TVRjM2NURXhOeUF3SURJeU5DQXRORFV1TlhReE9EUXVOU0F0TVRJemRERXlNeUF0TVRnMExqVjBORFV1TlNBdE1qSTBkQzAwTlM0MUlDMHlNalIwTFRFeU15QXRNVGcwTGpWMExURTROQzQxSUMweE1qTjBMVEl5TkNBdE5EVXVOWFF0TWpJMElEUTFMalYwTFRFNE5DNDFJREV5TTNRdE1USXpJREU0TkM0MWRDMDBOUzQxSURJeU5IUTBOUzQxSURJeU5IUXhNak1nTVRnMExqVjBNVGcwTGpVZ01USXpkREl5TkNBME5TNDFlazAzTkRFdU5TQTVNVE54TFRFeUxqVWdNQ0F0TWpFdU5TQXRPV3d0TVRJd0lDMHhNakJzTFRFeU1DQXhNakJ4TFRrZ09TQXRNakV1TlNBNUlIUXRNakV1TlNBdE9Xd3RNVFF4SUMweE5ERnhMVGtnTFRrZ0xUa2dMVEl4TGpWME9TQXRNakV1Tld3eE1qQWdMVEV5TUd3dE1USXdJQzB4TWpCeExUa2dMVGtnTFRrZ0xUSXhMalYwT1NBdE1qRXVOV3d4TkRFZ0xURTBNWEU1SUMwNUlESXhMalVnTFRsME1qRXVOU0E1YkRFeU1DQXhNakJzTVRJd0lDMHhNakJ4T1NBdE9TQXlNUzQxSUMwNWRESXhMalVnT1d3eE5ERWdNVFF4Y1RrZ09TQTVJREl4TGpWMExUa2dNakV1Tld3dE1USXdJREV5TUd3eE1qQWdNVEl3Y1RrZ09TQTVJREl4TGpWMExUa2dNakV1Tld3dE1UUXhJREUwTVhFdE9TQTVJQzB5TVM0MUlEbDZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQTRORHNpSUdROUlrMDJNREFnTVRFM04zRXhNVGNnTUNBeU1qUWdMVFExTGpWME1UZzBMalVnTFRFeU0zUXhNak1nTFRFNE5DNDFkRFExTGpVZ0xUSXlOSFF0TkRVdU5TQXRNakkwZEMweE1qTWdMVEU0TkM0MWRDMHhPRFF1TlNBdE1USXpkQzB5TWpRZ0xUUTFMalYwTFRJeU5DQTBOUzQxZEMweE9EUXVOU0F4TWpOMExURXlNeUF4T0RRdU5YUXRORFV1TlNBeU1qUjBORFV1TlNBeU1qUjBNVEl6SURFNE5DNDFkREU0TkM0MUlERXlNM1F5TWpRZ05EVXVOWHBOTlRRMklEWXlNMnd0T0RRZ09EVnhMVGNnTnlBdE1UY3VOU0EzZEMweE9DNDFJQzAzYkMweE16a2dMVEV6T1hFdE55QXRPQ0F0TnlBdE1UaDBOeUF0TVRnZ2JESTBNaUF0TWpReGNUY2dMVGdnTVRjdU5TQXRPSFF4Tnk0MUlEaHNNemMxSURNM05YRTNJRGNnTnlBeE55NDFkQzAzSURFNExqVnNMVEV6T1NBeE16bHhMVGNnTnlBdE1UY3VOU0EzZEMweE55NDFJQzAzZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3T0RVN0lpQmtQU0pOTmpBd0lERXhOemR4TVRFM0lEQWdNakkwSUMwME5TNDFkREU0TkM0MUlDMHhNak4wTVRJeklDMHhPRFF1TlhRME5TNDFJQzB5TWpSMExUUTFMalVnTFRJeU5IUXRNVEl6SUMweE9EUXVOWFF0TVRnMExqVWdMVEV5TTNRdE1qSTBJQzAwTlM0MWRDMHlNalFnTkRVdU5YUXRNVGcwTGpVZ01USXpkQzB4TWpNZ01UZzBMalYwTFRRMUxqVWdNakkwZERRMUxqVWdNakkwZERFeU15QXhPRFF1TlhReE9EUXVOU0F4TWpOME1qSTBJRFExTGpWNlRUVTRPQ0E1TkRGeExUSTVJREFnTFRVNUlDMDFMalYwTFRZeklDMHlNQzQxZEMwMU9DQXRNemd1TlhRdE5ERXVOU0F0TmpOMExURTJMalVnTFRnNUxqVWdjVEFnTFRJMUlESXdJQzB5TldneE16RnhNekFnTFRVZ016VWdNVEZ4TmlBeU1DQXlNQzQxSURJNGREUTFMalVnT0hFeU1DQXdJRE14TGpVZ0xURXdMalYwTVRFdU5TQXRNamd1TlhFd0lDMHlNeUF0TnlBdE16UjBMVEkySUMweE9IRXRNU0F3SUMweE15NDFJQzAwZEMweE9TNDFJQzAzTGpWMExUSXdJQzB4TUM0MWRDMHlNaUF0TVRkMExURTRMalVnTFRJMGRDMHhOUzQxSUMwek5YUXRPQ0F0TkRaeExURWdMVGdnTlM0MUlDMHhOaTQxZERJd0xqVWdMVGd1TldneE56TnhOeUF3SURJeUlEaDBNelVnTWpoME16Y3VOU0EwT0hReU9TNDFJRGMwZERFeUlERXdNSEV3SURRM0lDMHhOeUE0TXlCMExUUXlMalVnTlRkMExUVTVMalVnTXpRdU5YUXROalFnTVRoMExUVTVJRFF1TlhwTk5qYzFJRFF3TUdndE1UVXdjUzB4TUNBd0lDMHhOeTQxSUMwM0xqVjBMVGN1TlNBdE1UY3VOWFl0TVRVd2NUQWdMVEV3SURjdU5TQXRNVGN1TlhReE55NDFJQzAzTGpWb01UVXdjVEV3SURBZ01UY3VOU0EzTGpWME55NDFJREUzTGpWMk1UVXdjVEFnTVRBZ0xUY3VOU0F4Tnk0MWRDMHhOeTQxSURjdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1EZzJPeUlnWkQwaVRUWXdNQ0F4TVRjM2NURXhOeUF3SURJeU5DQXRORFV1TlhReE9EUXVOU0F0TVRJemRERXlNeUF0TVRnMExqVjBORFV1TlNBdE1qSTBkQzAwTlM0MUlDMHlNalIwTFRFeU15QXRNVGcwTGpWMExURTROQzQxSUMweE1qTjBMVEl5TkNBdE5EVXVOWFF0TWpJMElEUTFMalYwTFRFNE5DNDFJREV5TTNRdE1USXpJREU0TkM0MWRDMDBOUzQxSURJeU5IUTBOUzQxSURJeU5IUXhNak1nTVRnMExqVjBNVGcwTGpVZ01USXpkREl5TkNBME5TNDFlazAyTnpVZ01UQXdNR2d0TVRVd2NTMHhNQ0F3SUMweE55NDFJQzAzTGpWMExUY3VOU0F0TVRjdU5YWXRNVFV3Y1RBZ0xURXdJRGN1TlNBdE1UY3VOU0IwTVRjdU5TQXROeTQxYURFMU1IRXhNQ0F3SURFM0xqVWdOeTQxZERjdU5TQXhOeTQxZGpFMU1IRXdJREV3SUMwM0xqVWdNVGN1TlhRdE1UY3VOU0EzTGpWNlRUWTNOU0EzTURCb0xUSTFNSEV0TVRBZ01DQXRNVGN1TlNBdE55NDFkQzAzTGpVZ0xURTNMalYyTFRVd2NUQWdMVEV3SURjdU5TQXRNVGN1TlhReE55NDFJQzAzTGpWb056VjJMVEl3TUdndE56VnhMVEV3SURBZ0xURTNMalVnTFRjdU5YUXROeTQxSUMweE55NDFkaTAxTUhFd0lDMHhNQ0EzTGpVZ0xURTNMalYwTVRjdU5TQXROeTQxYURNMU1IRXhNQ0F3SURFM0xqVWdOeTQxZERjdU5TQXhOeTQxZGpVd2NUQWdNVEFnTFRjdU5TQXhOeTQxSUhRdE1UY3VOU0EzTGpWb0xUYzFkakkzTlhFd0lERXdJQzAzTGpVZ01UY3VOWFF0TVRjdU5TQTNMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEE0TnpzaUlHUTlJazAxTWpVZ01USXdNR2d4TlRCeE1UQWdNQ0F4Tnk0MUlDMDNMalYwTnk0MUlDMHhOeTQxZGkweE9UUnhNVEF6SUMweU55QXhOemd1TlNBdE1UQXlMalYwTVRBeUxqVWdMVEUzT0M0MWFERTVOSEV4TUNBd0lERTNMalVnTFRjdU5YUTNMalVnTFRFM0xqVjJMVEUxTUhFd0lDMHhNQ0F0Tnk0MUlDMHhOeTQxZEMweE55NDFJQzAzTGpWb0xURTVOSEV0TWpjZ0xURXdNeUF0TVRBeUxqVWdMVEUzT0M0MWRDMHhOemd1TlNBdE1UQXlMalYyTFRFNU5IRXdJQzB4TUNBdE55NDFJQzB4Tnk0MWRDMHhOeTQxSUMwM0xqVm9MVEUxTUhFdE1UQWdNQ0F0TVRjdU5TQTNMalYwTFRjdU5TQXhOeTQxZGpFNU5DQnhMVEV3TXlBeU55QXRNVGM0TGpVZ01UQXlMalYwTFRFd01pNDFJREUzT0M0MWFDMHhPVFJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFl4TlRCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOV2d4T1RSeE1qY2dNVEF6SURFd01pNDFJREUzT0M0MWRERTNPQzQxSURFd01pNDFkakU1TkhFd0lERXdJRGN1TlNBeE55NDFkREUzTGpVZ055NDFlazAzTURBZ09Ea3pkaTB4TmpoeE1DQXRNVEFnTFRjdU5TQXRNVGN1TlhRdE1UY3VOU0F0Tnk0MWFDMHhOVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFl4TmpoeExUWTRJQzB5TXlBdE1URTVJQzAzTkNCMExUYzBJQzB4TVRsb01UWTRjVEV3SURBZ01UY3VOU0F0Tnk0MWREY3VOU0F0TVRjdU5YWXRNVFV3Y1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE1UWTRjVEl6SUMwMk9DQTNOQ0F0TVRFNWRERXhPU0F0TnpSMk1UWTRjVEFnTVRBZ055NDFJREUzTGpWME1UY3VOU0EzTGpWb01UVXdjVEV3SURBZ01UY3VOU0F0Tnk0MWREY3VOU0F0TVRjdU5YWXRNVFk0Y1RZNElESXpJREV4T1NBM05IUTNOQ0F4TVRsb0xURTJPSEV0TVRBZ01DQXRNVGN1TlNBM0xqVjBMVGN1TlNBeE55NDFkakUxTUhFd0lERXdJRGN1TlNBeE55NDFkREUzTGpVZ055NDFhREUyT0NCeExUSXpJRFk0SUMwM05DQXhNVGwwTFRFeE9TQTNOSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNRGc0T3lJZ1pEMGlUVFl3TUNBeE1UYzNjVEV4TnlBd0lESXlOQ0F0TkRVdU5YUXhPRFF1TlNBdE1USXpkREV5TXlBdE1UZzBMalYwTkRVdU5TQXRNakkwZEMwME5TNDFJQzB5TWpSMExURXlNeUF0TVRnMExqVjBMVEU0TkM0MUlDMHhNak4wTFRJeU5DQXRORFV1TlhRdE1qSTBJRFExTGpWMExURTROQzQxSURFeU0zUXRNVEl6SURFNE5DNDFkQzAwTlM0MUlESXlOSFEwTlM0MUlESXlOSFF4TWpNZ01UZzBMalYwTVRnMExqVWdNVEl6ZERJeU5DQTBOUzQxZWswMk1EQWdNVEF5TjNFdE1URTJJREFnTFRJeE5DNDFJQzAxTjNRdE1UVTFMalVnTFRFMU5TNDFkQzAxTnlBdE1qRTBMalYwTlRjZ0xUSXhOQzQxSUhReE5UVXVOU0F0TVRVMUxqVjBNakUwTGpVZ0xUVTNkREl4TkM0MUlEVTNkREUxTlM0MUlERTFOUzQxZERVM0lESXhOQzQxZEMwMU55QXlNVFF1TlhRdE1UVTFMalVnTVRVMUxqVjBMVEl4TkM0MUlEVTNlazAzTlRrZ09ESXpiRFkwSUMwMk5IRTNJQzAzSURjZ0xURTNMalYwTFRjZ0xURTNMalZzTFRFeU5DQXRNVEkwYkRFeU5DQXRNVEkwY1RjZ0xUY2dOeUF0TVRjdU5YUXROeUF0TVRjdU5Xd3ROalFnTFRZMGNTMDNJQzAzSUMweE55NDFJQzAzZEMweE55NDFJRGRzTFRFeU5DQXhNalJzTFRFeU5DQXRNVEkwY1MwM0lDMDNJQzB4Tnk0MUlDMDNkQzB4Tnk0MUlEZHNMVFkwSURZMElIRXROeUEzSUMwM0lERTNMalYwTnlBeE55NDFiREV5TkNBeE1qUnNMVEV5TkNBeE1qUnhMVGNnTnlBdE55QXhOeTQxZERjZ01UY3VOV3cyTkNBMk5IRTNJRGNnTVRjdU5TQTNkREUzTGpVZ0xUZHNNVEkwSUMweE1qUnNNVEkwSURFeU5IRTNJRGNnTVRjdU5TQTNkREUzTGpVZ0xUZDZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUQTRPVHNpSUdROUlrMDJNREFnTVRFM04zRXhNVGNnTUNBeU1qUWdMVFExTGpWME1UZzBMalVnTFRFeU0zUXhNak1nTFRFNE5DNDFkRFExTGpVZ0xUSXlOSFF0TkRVdU5TQXRNakkwZEMweE1qTWdMVEU0TkM0MWRDMHhPRFF1TlNBdE1USXpkQzB5TWpRZ0xUUTFMalYwTFRJeU5DQTBOUzQxZEMweE9EUXVOU0F4TWpOMExURXlNeUF4T0RRdU5YUXRORFV1TlNBeU1qUjBORFV1TlNBeU1qUjBNVEl6SURFNE5DNDFkREU0TkM0MUlERXlNM1F5TWpRZ05EVXVOWHBOTmpBd0lERXdNamR4TFRFeE5pQXdJQzB5TVRRdU5TQXROVGQwTFRFMU5TNDFJQzB4TlRVdU5YUXROVGNnTFRJeE5DNDFkRFUzSUMweU1UUXVOU0IwTVRVMUxqVWdMVEUxTlM0MWRESXhOQzQxSUMwMU4zUXlNVFF1TlNBMU4zUXhOVFV1TlNBeE5UVXVOWFExTnlBeU1UUXVOWFF0TlRjZ01qRTBMalYwTFRFMU5TNDFJREUxTlM0MWRDMHlNVFF1TlNBMU4zcE5Oemd5SURjNE9Hd3hNRFlnTFRFd05uRTNJQzAzSURjZ0xURTNMalYwTFRjZ0xURTNMalZzTFRNeU1DQXRNekl4Y1MwNElDMDNJQzB4T0NBdE4zUXRNVGdnTjJ3dE1qQXlJREl3TTNFdE9DQTNJQzA0SURFM0xqVjBPQ0F4Tnk0MWJERXdOaUF4TURaeE55QTRJREUzTGpVZ09IUXhOeTQxSUMwNGJEYzVJQzAzT1d3eE9UY2dNVGszY1RjZ055QXhOeTQxSURkME1UY3VOU0F0TjNvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURrd095SWdaRDBpVFRZd01DQXhNVGMzY1RFeE55QXdJREl5TkNBdE5EVXVOWFF4T0RRdU5TQXRNVEl6ZERFeU15QXRNVGcwTGpWME5EVXVOU0F0TWpJMGRDMDBOUzQxSUMweU1qUjBMVEV5TXlBdE1UZzBMalYwTFRFNE5DNDFJQzB4TWpOMExUSXlOQ0F0TkRVdU5YUXRNakkwSURRMUxqVjBMVEU0TkM0MUlERXlNM1F0TVRJeklERTROQzQxZEMwME5TNDFJREl5TkhRME5TNDFJREl5TkhReE1qTWdNVGcwTGpWME1UZzBMalVnTVRJemRESXlOQ0EwTlM0MWVrMDJNREFnTVRBeU4zRXRNVEUySURBZ0xUSXhOQzQxSUMwMU4zUXRNVFUxTGpVZ0xURTFOUzQxZEMwMU55QXRNakUwTGpWeE1DQXRNVEl3SURZMUlDMHlNalVnYkRVNE55QTFPRGR4TFRFd05TQTJOU0F0TWpJMUlEWTFlazA1TmpVZ09ERTViQzAxT0RRZ0xUVTROSEV4TURRZ0xUWXlJREl4T1NBdE5qSnhNVEUySURBZ01qRTBMalVnTlRkME1UVTFMalVnTVRVMUxqVjBOVGNnTWpFMExqVnhNQ0F4TVRVZ0xUWXlJREl4T1hvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURreE95SWdaRDBpVFRNNUlEVTRNbXcxTWpJZ05ESTNjVEUySURFeklESTNMalVnT0hReE1TNDFJQzB5Tm5ZdE1qa3hhRFUxTUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1qQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMwMU5UQjJMVEk1TVhFd0lDMHlNU0F0TVRFdU5TQXRNalowTFRJM0xqVWdPR3d0TlRJeUlEUXlOM0V0TVRZZ01UTWdMVEUySURNeWRERTJJRE15ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V3T1RJN0lpQmtQU0pOTmpNNUlERXdNRGxzTlRJeUlDMDBNamR4TVRZZ0xURXpJREUySUMwek1uUXRNVFlnTFRNeWJDMDFNaklnTFRReU4zRXRNVFlnTFRFeklDMHlOeTQxSUMwNGRDMHhNUzQxSURJMmRqSTVNV2d0TlRVd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXlNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFhRFUxTUhZeU9URnhNQ0F5TVNBeE1TNDFJREkyZERJM0xqVWdMVGg2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEE1TXpzaUlHUTlJazAyT0RJZ01URTJNV3cwTWpjZ0xUVXlNbkV4TXlBdE1UWWdPQ0F0TWpjdU5YUXRNallnTFRFeExqVm9MVEk1TVhZdE5UVXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweU1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkalUxTUdndE1qa3hjUzB5TVNBd0lDMHlOaUF4TVM0MWREZ2dNamN1Tld3ME1qY2dOVEl5Y1RFeklERTJJRE15SURFMmRETXlJQzB4Tm5vaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURrME95SWdaRDBpVFRVMU1DQXhNakF3YURJd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXROVFV3YURJNU1YRXlNU0F3SURJMklDMHhNUzQxZEMwNElDMHlOeTQxYkMwME1qY2dMVFV5TW5FdE1UTWdMVEUySUMwek1pQXRNVFowTFRNeUlERTJiQzAwTWpjZ05USXljUzB4TXlBeE5pQXRPQ0F5Tnk0MWRESTJJREV4TGpWb01qa3hkalUxTUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEE1TlRzaUlHUTlJazAyTXprZ01URXdPV3cxTWpJZ0xUUXlOM0V4TmlBdE1UTWdNVFlnTFRNeWRDMHhOaUF0TXpKc0xUVXlNaUF0TkRJM2NTMHhOaUF0TVRNZ0xUSTNMalVnTFRoMExURXhMalVnTWpaMk1qa3hjUzA1TkNBdE1pQXRNVGd5SUMweU1IUXRNVGN3TGpVZ0xUVXlkQzB4TkRjZ0xUa3lMalYwTFRFd01DNDFJQzB4TXpVdU5YRTFJREV3TlNBeU55QXhPVE11TlhRMk55NDFJREUyTjNReE1UTWdNVE0xZERFMk55QTVNUzQxZERJeU5TNDFJRFF5ZGpJMk1uRXdJREl4SURFeExqVWdNalowTWpjdU5TQXRPSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNRGsyT3lJZ1pEMGlUVGcxTUNBeE1qQXdhRE13TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE16QXdjVEFnTFRJeElDMHhNQzQxSUMweU5YUXRNalF1TlNBeE1Hd3RPVFFnT1RSc0xUSTBPU0F0TWpRNWNTMDRJQzAzSUMweE9DQXROM1F0TVRnZ04yd3RNVEEySURFd05uRXROeUE0SUMwM0lERTRkRGNnTVRoc01qUTVJREkwT1d3dE9UUWdPVFJ4TFRFMElERTBJQzB4TUNBeU5DNDFkREkxSURFd0xqVjZUVE0xTUNBd2FDMHpNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpNd01IRXdJREl4SURFd0xqVWdNalYwTWpRdU5TQXRNVEJzT1RRZ0xUazBiREkwT1NBeU5Ea2djVGdnTnlBeE9DQTNkREU0SUMwM2JERXdOaUF0TVRBMmNUY2dMVGdnTnlBdE1UaDBMVGNnTFRFNGJDMHlORGtnTFRJME9XdzVOQ0F0T1RSeE1UUWdMVEUwSURFd0lDMHlOQzQxZEMweU5TQXRNVEF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTURrM095SWdaRDBpVFRFd01UUWdNVEV5TUd3eE1EWWdMVEV3Tm5FM0lDMDRJRGNnTFRFNGRDMDNJQzB4T0d3dE1qUTVJQzB5TkRsc09UUWdMVGswY1RFMElDMHhOQ0F4TUNBdE1qUXVOWFF0TWpVZ0xURXdMalZvTFRNd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNekF3Y1RBZ01qRWdNVEF1TlNBeU5YUXlOQzQxSUMweE1HdzVOQ0F0T1RSc01qUTVJREkwT1hFNElEY2dNVGdnTjNReE9DQXROM3BOTWpVd0lEWXdNR2d6TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxUTXdNSEV3SUMweU1TQXRNVEF1TlNBdE1qVjBMVEkwTGpVZ01UQnNMVGswSURrMElHd3RNalE1SUMweU5EbHhMVGdnTFRjZ0xURTRJQzAzZEMweE9DQTNiQzB4TURZZ01UQTJjUzAzSURnZ0xUY2dNVGgwTnlBeE9Hd3lORGtnTWpRNWJDMDVOQ0E1TkhFdE1UUWdNVFFnTFRFd0lESTBMalYwTWpVZ01UQXVOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVEF4T3lJZ1pEMGlUVFl3TUNBeE1UYzNjVEV4TnlBd0lESXlOQ0F0TkRVdU5YUXhPRFF1TlNBdE1USXpkREV5TXlBdE1UZzBMalYwTkRVdU5TQXRNakkwZEMwME5TNDFJQzB5TWpSMExURXlNeUF0TVRnMExqVjBMVEU0TkM0MUlDMHhNak4wTFRJeU5DQXRORFV1TlhRdE1qSTBJRFExTGpWMExURTROQzQxSURFeU0zUXRNVEl6SURFNE5DNDFkQzAwTlM0MUlESXlOSFEwTlM0MUlESXlOSFF4TWpNZ01UZzBMalYwTVRnMExqVWdNVEl6ZERJeU5DQTBOUzQxZWswM01EUWdPVEF3YUMweU1EaHhMVEl3SURBZ0xUTXlJQzB4TkM0MWRDMDRJQzB6TkM0MWJEVTRJQzB6TURKeE5DQXRNakFnTWpFdU5TQXRNelF1TlNCME16Y3VOU0F0TVRRdU5XZzFOSEV5TUNBd0lETTNMalVnTVRRdU5YUXlNUzQxSURNMExqVnNOVGdnTXpBeWNUUWdNakFnTFRnZ016UXVOWFF0TXpJZ01UUXVOWHBOTmpjMUlEUXdNR2d0TVRVd2NTMHhNQ0F3SUMweE55NDFJQzAzTGpWMExUY3VOU0F0TVRjdU5YWXRNVFV3Y1RBZ0xURXdJRGN1TlNBdE1UY3VOWFF4Tnk0MUlDMDNMalZvTVRVd2NURXdJREFnTVRjdU5TQTNMalYwTnk0MUlERTNMalYyTVRVd2NUQWdNVEFnTFRjdU5TQXhOeTQxZEMweE55NDFJRGN1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRBeU95SWdaRDBpVFRJMk1DQXhNakF3Y1RrZ01DQXhPU0F0TW5ReE5TQXROR3cxSUMweWNUSXlJQzB4TUNBME5DQXRNak5zTVRrMklDMHhNVGh4TWpFZ0xURXpJRE0ySUMweU5IRXlPU0F0TWpFZ016Y2dMVEV5Y1RFeElERXpJRFE1SURNMWJERTVOaUF4TVRoeE1qSWdNVE1nTkRVZ01qTnhNVGNnTnlBek9DQTNjVEl6SURBZ05EY2dMVEUyTGpWME16Y2dMVE16TGpWc01UTWdMVEUyY1RFMElDMHlNU0F4T0NBdE5EVnNNalVnTFRFeU0ydzRJQzAwTkhFeElDMDVJRGd1TlNBdE1UUXVOWFF4Tnk0MUlDMDFMalZvTmpGeE1UQWdNQ0F4Tnk0MUlDMDNMalYwTnk0MUlDMHhOeTQxZGkwMU1DQnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFhQzAxTUhFdE1UQWdNQ0F0TVRjdU5TQXROeTQxZEMwM0xqVWdMVEUzTGpWMkxURTNOV2d0TkRBd2RqTXdNR2d0TWpBd2RpMHpNREJvTFRRd01IWXhOelZ4TUNBeE1DQXROeTQxSURFM0xqVjBMVEUzTGpVZ055NDFhQzAxTUhFdE1UQWdNQ0F0TVRjdU5TQTNMalYwTFRjdU5TQXhOeTQxZGpVd2NUQWdNVEFnTnk0MUlERTNMalYwTVRjdU5TQTNMalZvTmpGeE1URWdNQ0F4T0NBemREY2dPSEV3SURRZ09TQTFNbXd5TlNBeE1qaHhOU0F5TlNBeE9TQTBOWEV5SURNZ05TQTNkREV6TGpVZ01UVjBNakV1TlNBeE9TNDFkREkyTGpVZ01UVXVOU0IwTWprdU5TQTNlazA1TVRVZ01UQTNPV3d0TVRZMklDMHhOakp4TFRjZ0xUY2dMVFVnTFRFeWRERXlJQzAxYURJeE9YRXhNQ0F3SURFMUlEZDBNaUF4TjJ3dE5URWdNVFE1Y1MweklERXdJQzB4TVNBeE1uUXRNVFVnTFRaNlRUUTJNeUE1TVRkc0xURTNOeUF4TlRkeExUZ2dOeUF0TVRZZ05YUXRNVEVnTFRFeWJDMDFNU0F0TVRRemNTMHpJQzB4TUNBeUlDMHhOM1F4TlNBdE4yZ3lNekZ4TVRFZ01DQXhNaTQxSURWMExUVXVOU0F4TW5wTk5UQXdJREJvTFRNM05YRXRNVEFnTUNBdE1UY3VOU0EzTGpWMExUY3VOU0F4Tnk0MWRqTTNOV2cwTURCMkxUUXdNSHBOTVRFd01DQTBNREIyTFRNM05TQnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFhQzB6TnpWMk5EQXdhRFF3TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRBek95SWdaRDBpVFRFeE5qVWdNVEU1TUhFNElETWdNakVnTFRZdU5YUXhNeUF0TVRjdU5YRXRNaUF0TVRjNElDMHlOQzQxSUMwek1qTXVOWFF0TlRVdU5TQXRNalExTGpWMExUZzNJQzB4TnpRdU5YUXRNVEF5TGpVZ0xURXhPQzQxZEMweE1UZ2dMVFk0TGpWMExURXhPQzQxSUMwek0zUXRNVEl3SUMwMExqVjBMVEV3TlNBNUxqVjBMVGt3SURFMkxqVnhMVFl4SURFeUlDMDNPQ0F4TVhFdE5DQXhJQzB4TWk0MUlEQjBMVE0wSUMweE5DNDFkQzAxTWk0MUlDMDBNQzQxYkMweE5UTWdMVEUxTTNFdE1qWWdMVEkwSUMwek55QXRNVFF1TlhRdE1URWdORE11TlhFd0lEWTBJRFF5SURFd01uRTRJRGdnTlRBdU5TQTBOU0IwTmpZdU5TQTFPSEV4T1NBeE55QXpOU0EwTjNReE15QTJNWEV0T1NBMU5TQXRNVEFnTVRBeUxqVjBOeUF4TVRGME16Y2dNVE13ZERjNElERXlPUzQxY1RNNUlEVXhJRGd3SURnNGREZzVMalVnTmpNdU5YUTVOQzQxSURRMWRERXhNeTQxSURNMmRERXlPU0F6TVhReE5UY3VOU0F6TjNReE9ESWdORGN1TlhwTk1URXhOaUF4TURrNGNTMDRJRGtnTFRJeUxqVWdMVE4wTFRRMUxqVWdMVFV3Y1Mwek9DQXRORGNnTFRFeE9TQXRNVEF6TGpWMExURTBNaUF0T0RrdU5Xd3ROaklnTFRNemNTMDFOaUF0TXpBZ0xURXdNaUF0TlRkMExURXdOQ0F0TmpoMExURXdNaTQxSUMwNE1DNDFkQzA0TlM0MUlDMDVNU0IwTFRZMElDMHhNRFF1TlhFdE1qUWdMVFUySUMwek1TQXRPRFowTWlBdE16SjBNekV1TlNBeE55NDFkRFUxTGpVZ05Ua3VOWEV5TlNBek1DQTVOQ0EzTlM0MWRERXlOUzQxSURjM0xqVjBNVFEzTGpVZ09ERnhOekFnTXpjZ01URTRMalVnTmpsME1UQXlJRGM1TGpWME9Ua2dNVEV4ZERnMkxqVWdNVFE0TGpWeE1qSWdOVEFnTWpRZ05qQjBMVFlnTVRsNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFd05Ec2lJR1E5SWswMk5UTWdNVEl6TVhFdE16a2dMVFkzSUMwMU5DNDFJQzB4TXpGMExURXdMalVnTFRFeE5DNDFkREkwTGpVZ0xUazJMalYwTkRjdU5TQXRPREIwTmpNdU5TQXROakl1TlhRMk9DNDFJQzAwTmk0MWREWTFJQzB6TUhFdE5DQTNJQzB4Tnk0MUlETTFkQzB4T0M0MUlETTVMalYwTFRFM0lETTVMalYwTFRFM0lEUXpkQzB4TXlBME1uUXRPUzQxSURRMExqVjBMVElnTkRKME5DQTBNM1F4TXk0MUlETTVkREl6SURNNExqVnhPVFlnTFRReUlERTJOU0F0TVRBM0xqVjBNVEExSUMweE16aDBOVElnTFRFMU5uUXhNeUF0TVRVNWRDMHhPU0F0TVRRNUxqVnhMVEV6SUMwMU5TQXRORFFnTFRFd05pNDFJSFF0TmpnZ0xUZzNkQzAzT0M0MUlDMDJOQzQxZEMwM01pNDFJQzAwTlhRdE5UTWdMVEl5Y1MwM01pQXRNaklnTFRFeU55QXRNVEZ4TFRNeElEWWdMVEV6SURFNWNUWWdNeUF4TnlBM2NURXpJRFVnTXpJdU5TQXlNWFEwTVNBME5IUXpPQzQxSURZekxqVjBNakV1TlNBNE1TNDFkQzAyTGpVZ09UUXVOWFF0TlRBZ01UQTNkQzB4TURRZ01URTFMalZ4TVRBZ0xURXdOQ0F0TUM0MUlDMHhPRGwwTFRNM0lDMHhOREF1TlhRdE5qVWdMVGt6ZEMwNE5DQXROVEowTFRrekxqVWdMVEV4ZEMwNU5TQXlOQzQxY1MwNE1DQXpOaUF0TVRNeExqVWdNVEUwZEMwMU15NDFJREUzTVhFdE1pQXlNeUF3SURRNUxqVWdkRFF1TlNBMU1pNDFkREV6TGpVZ05UWjBNamN1TlNBMk1IUTBOaUEyTkM0MWREWTVMalVnTmpndU5YRXRPQ0F0TlRNZ0xUVWdMVEV3TWk0MWRERTNMalVnTFRrd2RETTBJQzAyT0M0MWREUTBMalVnTFRNNWREUTVJQzB5Y1RNeElERXpJRE00TGpVZ016WjBMVFF1TlNBMU5YUXRNamtnTmpRdU5YUXRNellnTnpWMExUSTJJRGMxTGpWeExURTFJRGcxSURJZ01UWXhMalYwTlRNdU5TQXhNamd1TlhRNE5TNDFJRGt5TGpWME9UTXVOU0EyTVhRNE1TNDFJREkxTGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFd05Uc2lJR1E5SWswMk1EQWdNVEE1TkhFNE1pQXdJREUyTUM0MUlDMHlNaTQxZERFME1DQXROVGwwTVRFMkxqVWdMVGd5TGpWME9UUXVOU0F0T1RWME5qZ2dMVGsxZERReUxqVWdMVGd5TGpWME1UUWdMVFUzTGpWMExURTBJQzAxTnk0MWRDMDBNeUF0T0RJdU5YUXROamd1TlNBdE9UVjBMVGswTGpVZ0xUazFkQzB4TVRZdU5TQXRPREl1TlhRdE1UUXdJQzAxT1hRdE1UVTVMalVnTFRJeUxqVjBMVEUxT1M0MUlESXlMalYwTFRFME1DQTFPWFF0TVRFMkxqVWdPREl1TlhRdE9UUXVOU0E1TlhRdE5qZ3VOU0E1TlhRdE5ETWdPREl1TlhRdE1UUWdOVGN1TlhReE5DQTFOeTQxZERReUxqVWdPREl1TlhRMk9DQTVOU0IwT1RRdU5TQTVOWFF4TVRZdU5TQTRNaTQxZERFME1DQTFPWFF4TmpBdU5TQXlNaTQxZWswNE9EZ2dPREk1Y1MweE5TQXhOU0F0TVRnZ01USjBOU0F0TWpKeE1qVWdMVFUzSURJMUlDMHhNVGx4TUNBdE1USTBJQzA0T0NBdE1qRXlkQzB5TVRJZ0xUZzRkQzB5TVRJZ09EaDBMVGc0SURJeE1uRXdJRFU1SURJeklERXhOSEU0SURFNUlEUXVOU0F5TW5RdE1UY3VOU0F0TVRKeExUY3dJQzAyT1NBdE1UWXdJQzB4T0RSeExURXpJQzB4TmlBdE1UVWdMVFF3TGpWME9TQXROREl1TlhFeU1pQXRNellnTkRjZ0xUY3hkRGN3SUMwNE1uUTVNaTQxSUMwNE1YUXhNVE1nTFRVNExqVjBNVE16TGpVZ0xUSTBMalVnZERFek15NDFJREkwZERFeE15QTFPQzQxZERreUxqVWdPREV1TlhRM01DQTRNUzQxZERRM0lEY3dMalZ4TVRFZ01UZ2dPU0EwTWk0MWRDMHhOQ0EwTVM0MWNTMDVNQ0F4TVRjZ0xURTJNeUF4T0RsNlRUUTBPQ0EzTWpkc0xUTTFJQzB6Tm5FdE1UVWdMVEUxSUMweE9TNDFJQzB6T0M0MWREUXVOU0F0TkRFdU5YRXpOeUF0TmpnZ09UTWdMVEV4Tm5FeE5pQXRNVE1nTXpndU5TQXRNVEYwTXpZdU5TQXhOMnd6TlNBek5IRXhOQ0F4TlNBeE1pNDFJRE16TGpWMExURTJMalVnTXpNdU5YRXRORFFnTkRRZ0xUZzVJREV4TjNFdE1URWdNVGdnTFRJNElESXdkQzB6TWlBdE1USjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpURXdOanNpSUdROUlrMDFPVElnTUdndE1UUTRiRE14SURFeU1IRXRPVEVnTWpBZ0xURTNOUzQxSURZNExqVjBMVEUwTXk0MUlERXdOaTQxZEMweE1ETXVOU0F4TVRsMExUWTJMalVnTVRFd2RDMHlNaUEzTm5Fd0lESXhJREUwSURVM0xqVjBOREl1TlNBNE1pNDFkRFk0SURrMWREazBMalVnT1RWME1URTJMalVnT0RJdU5YUXhOREFnTlRsME1UWXdMalVnTWpJdU5YRTJNU0F3SURFeU5pQXRNVFZzTXpJZ01USXhhREUwT0hwTk9UUTBJRGMzTUd3ME55QXhPREZ4TVRBNElDMDROU0F4TnpZdU5TQXRNVGt5ZERZNExqVWdMVEUxT1hFd0lDMHlOaUF0TVRrdU5TQXROekYwTFRVNUxqVWdMVEV3TW5RdE9UTWdMVEV4TWlCMExURXlPU0F0TVRBMExqVjBMVEUxT0NBdE56VXVOV3cwTmlBeE56TnhOemNnTkRrZ01UTTJJREV4TjNRNU55QXhNekZ4TVRFZ01UZ2dPU0EwTWk0MWRDMHhOQ0EwTVM0MWNTMDFOQ0EzTUNBdE1UQTNJREV6TUhwTk16RXdJRGd5TkhFdE56QWdMVFk1SUMweE5qQWdMVEU0TkhFdE1UTWdMVEUySUMweE5TQXROREF1TlhRNUlDMDBNaTQxY1RFNElDMHpNQ0F6T1NBdE5qQjBOVGNnTFRjd0xqVjBOelFnTFRjemREa3dJQzAyTVhReE1EVWdMVFF4TGpWc05ERWdNVFUwY1MweE1EY2dNVGdnTFRFM09DNDFJREV3TVM0MWRDMDNNUzQxSURFNU15NDFjVEFnTlRrZ01qTWdNVEUwY1RnZ01Ua2dOQzQxSURJeUlIUXRNVGN1TlNBdE1USjZUVFEwT0NBM01qZHNMVE0xSUMwek5uRXRNVFVnTFRFMUlDMHhPUzQxSUMwek9DNDFkRFF1TlNBdE5ERXVOWEV6TnlBdE5qZ2dPVE1nTFRFeE5uRXhOaUF0TVRNZ016Z3VOU0F0TVRGME16WXVOU0F4TjJ3eE1pQXhNV3d5TWlBNE5td3RNeUEwY1MwME5DQTBOQ0F0T0RrZ01URTNjUzB4TVNBeE9DQXRNamdnTWpCMExUTXlJQzB4TW5vaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRBM095SWdaRDBpVFMwNU1DQXhNREJzTmpReUlERXdOalp4TWpBZ016RWdORGdnTWpndU5YUTBPQ0F0TXpVdU5XdzJORElnTFRFd05UWnhNakVnTFRNeUlEY3VOU0F0TmpjdU5YUXROVEF1TlNBdE16VXVOV2d0TVRJNU5IRXRNemNnTUNBdE5UQXVOU0F6TkhRM0xqVWdOalo2VFRFMU5TQXlNREJvTXpRMWRqYzFjVEFnTVRBZ055NDFJREUzTGpWME1UY3VOU0EzTGpWb01UVXdjVEV3SURBZ01UY3VOU0F0Tnk0MWREY3VOU0F0TVRjdU5YWXROelZvTXpRMWJDMDBORFVnTnpJemVrMDBPVFlnTnpBd2FESXdPSEV5TUNBd0lETXlJQzB4TkM0MWREZ2dMVE0wTGpWc0xUVTRJQzB5TlRJZ2NTMDBJQzB5TUNBdE1qRXVOU0F0TXpRdU5YUXRNemN1TlNBdE1UUXVOV2d0TlRSeExUSXdJREFnTFRNM0xqVWdNVFF1TlhRdE1qRXVOU0F6TkM0MWJDMDFPQ0F5TlRKeExUUWdNakFnT0NBek5DNDFkRE15SURFMExqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpURXdPRHNpSUdROUlrMDJOVEFnTVRJd01IRTJNaUF3SURFd05pQXRORFIwTkRRZ0xURXdObll0TXpNNWJETTJNeUF0TXpJMWNURTFJQzB4TkNBeU5pQXRNemd1TlhReE1TQXRORFF1TlhZdE5ERnhNQ0F0TWpBZ0xURXlJQzB5Tmk0MWRDMHlPU0ExTGpWc0xUTTFPU0F5TkRsMkxUSTJNM0V4TURBZ0xUa3pJREV3TUNBdE1URXpkaTAyTkhFd0lDMHlNU0F0TVRNZ0xUSTVkQzB6TWlBeGJDMHlNRFVnTVRJNGJDMHlNRFVnTFRFeU9IRXRNVGtnTFRrZ0xUTXlJQzB4ZEMweE15QXlPWFkyTkhFd0lESXdJREV3TUNBeE1UTjJNall6YkMwek5Ua2dMVEkwT1hFdE1UY2dMVEV5SUMweU9TQXROUzQxZEMweE1pQXlOaTQxZGpReElIRXdJREl3SURFeElEUTBMalYwTWpZZ016Z3VOV3d6TmpNZ016STFkak16T1hFd0lEWXlJRFEwSURFd05uUXhNRFlnTkRSNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFd09Uc2lJR1E5SWswNE5UQWdNVEl3TUdneE1EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVFV3YURVd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMHhOVEJvTFRFeE1EQjJNVFV3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOV2cxTUhZMU1IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWb01UQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTAxTUdnMU1EQjJOVEJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazB4TVRBd0lEZ3dNSFl0TnpVd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MUlIUXRNelV1TlNBdE1UUXVOV2d0TVRBd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJOelV3YURFeE1EQjZUVEV3TUNBMk1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVE13TUNBMk1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVFV3TUNBMk1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVGN3TUNBMk1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVGt3TUNBMk1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVEV3TUNBME1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVE13TUNBME1EQjJMVEV3TUdneE1EQjJNVEF3YUMweE1EQjZUVFV3TUNBME1EQWdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlazAzTURBZ05EQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlazA1TURBZ05EQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlazB4TURBZ01qQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlazB6TURBZ01qQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlazAxTURBZ01qQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlazAzTURBZ01qQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlazA1TURBZ01qQXdkaTB4TURCb01UQXdkakV3TUdndE1UQXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhNVEE3SWlCa1BTSk5NVEV6TlNBeE1UWTFiREkwT1NBdE1qTXdjVEUxSUMweE5DQXhOU0F0TXpWMExURTFJQzB6Tld3dE1qUTVJQzB5TXpCeExURTBJQzB4TkNBdE1qUXVOU0F0TVRCMExURXdMalVnTWpWMk1UVXdhQzB4TlRsc0xUWXdNQ0F0TmpBd2FDMHlPVEZ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWb01qQTViRFl3TUNBMk1EQm9NalF4ZGpFMU1IRXdJREl4SURFd0xqVWdNalYwTWpRdU5TQXRNVEI2VFRVeU1pQTRNVGxzTFRFME1TQXRNVFF4YkMweE1qSWdNVEl5YUMweU1EbHhMVEl4SURBZ0xUTTFMalVnTVRRdU5TQjBMVEUwTGpVZ016VXVOWFl4TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxYURJNU1YcE5NVEV6TlNBMU5qVnNNalE1SUMweU16QnhNVFVnTFRFMElERTFJQzB6TlhRdE1UVWdMVE0xYkMweU5Ea2dMVEl6TUhFdE1UUWdMVEUwSUMweU5DNDFJQzB4TUhRdE1UQXVOU0F5TlhZeE5UQm9MVEkwTVd3dE1UZ3hJREU0TVd3eE5ERWdNVFF4YkRFeU1pQXRNVEl5YURFMU9YWXhOVEJ4TUNBeU1TQXhNQzQxSURJMWRESTBMalVnTFRFd2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE1URTdJaUJrUFNKTk1UQXdJREV4TURCb01UQXdNSEUwTVNBd0lEY3dMalVnTFRJNUxqVjBNamt1TlNBdE56QXVOWFl0TmpBd2NUQWdMVFF4SUMweU9TNDFJQzAzTUM0MWRDMDNNQzQxSUMweU9TNDFhQzAxT1Rac0xUTXdOQ0F0TXpBd2RqTXdNR2d0TVRBd2NTMDBNU0F3SUMwM01DNDFJREk1TGpWMExUSTVMalVnTnpBdU5YWTJNREJ4TUNBME1TQXlPUzQxSURjd0xqVjBOekF1TlNBeU9TNDFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhNVEk3SWlCa1BTSk5NVFV3SURFeU1EQm9NakF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkweU5UQm9MVE13TUhZeU5UQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMDROVEFnTVRJd01HZ3lNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRJMU1HZ3RNekF3ZGpJMU1IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNlRURXhNREFnT0RBd2RpMHpNREJ4TUNBdE5ERWdMVE1nTFRjM0xqVjBMVEUxSUMwNE9TNDFkQzB6TWlBdE9UWjBMVFU0SUMwNE9YUXRPRGtnTFRjM2RDMHhNamtnTFRVeGRDMHhOelFnTFRJd2RDMHhOelFnTWpBZ2RDMHhNamtnTlRGMExUZzVJRGMzZEMwMU9DQTRPWFF0TXpJZ09UWjBMVEUxSURnNUxqVjBMVE1nTnpjdU5YWXpNREJvTXpBd2RpMHlOVEIyTFRJM2RpMDBNaTQxZERFdU5TQXROREYwTlNBdE16aDBNVEFnTFRNMWRERTJMalVnTFRNd2RESTFMalVnTFRJMExqVjBNelVnTFRFNWREUTJMalVnTFRFeWREWXdJQzAwZERZd0lEUXVOWFEwTmk0MUlERXlMalYwTXpVZ01Ua3VOWFF5TlNBeU5TNDFkREUzSURNd0xqVjBNVEFnTXpWME5TQXpPSFF5SURRd0xqVjBMVEF1TlNBME1uWXlOWFl5TlRCb016QXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhNVE03SWlCa1BTSk5NVEV3TUNBME1URnNMVEU1T0NBdE1UazViQzB6TlRNZ016VXpiQzB6TlRNZ0xUTTFNMnd0TVRrM0lERTVPV3cxTlRFZ05UVXhlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhNVFE3SWlCa1BTSk5NVEV3TVNBM09EbHNMVFUxTUNBdE5UVXhiQzAxTlRFZ05UVXhiREU1T0NBeE9UbHNNelV6SUMwek5UTnNNelV6SURNMU0zb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1URTFPeUlnWkQwaVRUUXdOQ0F4TURBd2FEYzBObkV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TlRVeGFERTFNSEV5TVNBd0lESTFJQzB4TUM0MWRDMHhNQ0F0TWpRdU5Xd3RNak13SUMweU5EbHhMVEUwSUMweE5TQXRNelVnTFRFMWRDMHpOU0F4Tld3dE1qTXdJREkwT1hFdE1UUWdNVFFnTFRFd0lESTBMalYwTWpVZ01UQXVOV2d4TlRCMk5EQXhhQzB6T0RGNlRURXpOU0E1T0RSc01qTXdJQzB5TkRseE1UUWdMVEUwSURFd0lDMHlOQzQxZEMweU5TQXRNVEF1TldndE1UVXdkaTAwTURCb016ZzFiREl4TlNBdE1qQXdhQzAzTlRCeExUSXhJREFnTFRNMUxqVWdNVFF1TlNCMExURTBMalVnTXpVdU5YWTFOVEJvTFRFMU1IRXRNakVnTUNBdE1qVWdNVEF1TlhReE1DQXlOQzQxYkRJek1DQXlORGx4TVRRZ01UVWdNelVnTVRWME16VWdMVEUxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TVRZN0lpQmtQU0pOTlRZZ01USXdNR2c1TkhFeE55QXdJRE14SUMweE1YUXhPQ0F0TWpkc016Z2dMVEUyTW1nNE9UWnhNalFnTUNBek9TQXRNVGd1TlhReE1DQXROREl1Tld3dE1UQXdJQzAwTnpWeExUVWdMVEl4SUMweU55QXROREl1TlhRdE5UVWdMVEl4TGpWb0xUWXpNMncwT0NBdE1qQXdhRFV6TlhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhRdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TlRCMkxUVXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxZEMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTFNR2d0TXpBd2RpMDFNQ0J4TUNBdE1qRWdMVEUwTGpVZ0xUTTFMalYwTFRNMUxqVWdMVEUwTGpWMExUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkalV3YUMwek1YRXRNVGdnTUNBdE16SXVOU0F4TUhRdE1qQXVOU0F4T1d3dE5TQXhNR3d0TWpBeElEazJNV2d0TlRSeExUSXdJREFnTFRNMUlERTBMalYwTFRFMUlETTFMalYwTVRVZ016VXVOWFF6TlNBeE5DNDFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhNVGM3SWlCa1BTSk5NVEl3TUNBeE1EQXdkaTB4TURCb0xURXlNREIyTVRBd2FESXdNSEV3SURReElESTVMalVnTnpBdU5YUTNNQzQxSURJNUxqVm9NekF3Y1RReElEQWdOekF1TlNBdE1qa3VOWFF5T1M0MUlDMDNNQzQxYURVd01IcE5NQ0E0TURCb01USXdNSFl0T0RBd2FDMHhNakF3ZGpnd01Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1URTRPeUlnWkQwaVRUSXdNQ0E0TURCc0xUSXdNQ0F0TkRBd2RqWXdNR2d5TURCeE1DQTBNU0F5T1M0MUlEY3dMalYwTnpBdU5TQXlPUzQxYURNd01IRTBNaUF3SURjeElDMHlPUzQxZERJNUlDMDNNQzQxYURVd01IWXRNakF3YUMweE1EQXdlazB4TlRBd0lEY3dNR3d0TXpBd0lDMDNNREJvTFRFeU1EQnNNekF3SURjd01HZ3hNakF3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TVRrN0lpQmtQU0pOTmpNMUlERXhPRFJzTWpNd0lDMHlORGx4TVRRZ0xURTBJREV3SUMweU5DNDFkQzB5TlNBdE1UQXVOV2d0TVRVd2RpMDJNREZvTVRVd2NUSXhJREFnTWpVZ0xURXdMalYwTFRFd0lDMHlOQzQxYkMweU16QWdMVEkwT1hFdE1UUWdMVEUxSUMwek5TQXRNVFYwTFRNMUlERTFiQzB5TXpBZ01qUTVjUzB4TkNBeE5DQXRNVEFnTWpRdU5YUXlOU0F4TUM0MWFERTFNSFkyTURGb0xURTFNSEV0TWpFZ01DQXRNalVnTVRBdU5YUXhNQ0F5TkM0MWJESXpNQ0F5TkRseE1UUWdNVFVnTXpVZ01UVjBNelVnTFRFMWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE1qQTdJaUJrUFNKTk9UTTJJRGcyTkd3eU5Ea2dMVEl5T1hFeE5DQXRNVFVnTVRRZ0xUTTFMalYwTFRFMElDMHpOUzQxYkMweU5Ea2dMVEl5T1hFdE1UVWdMVEUxSUMweU5TNDFJQzB4TUM0MWRDMHhNQzQxSURJMExqVjJNVFV4YUMwMk1EQjJMVEUxTVhFd0lDMHlNQ0F0TVRBdU5TQXRNalF1TlhRdE1qVXVOU0F4TUM0MWJDMHlORGtnTWpJNWNTMHhOQ0F4TlNBdE1UUWdNelV1TlhReE5DQXpOUzQxYkRJME9TQXlNamx4TVRVZ01UVWdNalV1TlNBeE1DNDFkREV3TGpVZ0xUSTFMalYyTFRFME9XZzJNREIyTVRRNWNUQWdNakVnTVRBdU5TQXlOUzQxZERJMUxqVWdMVEV3TGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFeU1Uc2lJR1E5SWsweE1UWTVJRFF3TUd3dE1UY3lJRGN6TW5FdE5TQXlNeUF0TWpNZ05EVXVOWFF0TXpnZ01qSXVOV2d0TmpjeWNTMHlNQ0F3SUMwek9DQXRNakIwTFRJeklDMDBNV3d0TVRjeUlDMDNNemxvTVRFek9IcE5NVEV3TUNBek1EQm9MVEV3TURCeExUUXhJREFnTFRjd0xqVWdMVEk1TGpWMExUSTVMalVnTFRjd0xqVjJMVEV3TUhFd0lDMDBNU0F5T1M0MUlDMDNNQzQxZERjd0xqVWdMVEk1TGpWb01UQXdNSEUwTVNBd0lEY3dMalVnTWprdU5YUXlPUzQxSURjd0xqVjJNVEF3Y1RBZ05ERWdMVEk1TGpVZ056QXVOWFF0TnpBdU5TQXlPUzQxZWswNE1EQWdNVEF3ZGpFd01HZ3hNREIyTFRFd01HZ3RNVEF3SUhwTk1UQXdNQ0F4TURCMk1UQXdhREV3TUhZdE1UQXdhQzB4TURCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFeU1qc2lJR1E5SWsweE1UVXdJREV4TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxUZzFNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TlhRdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJPRFV3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTVRBd01DQXlNREJzTFRZM05TQXlNREJvTFRNNGJEUTNJQzB5TnpaeE15QXRNVFlnTFRVdU5TQXRNakIwTFRJNUxqVWdMVFJvTFRkb0xUZzBjUzB5TUNBd0lDMHpOQzQxSURFMGRDMHhPQzQxSURNMWNTMDFOU0F6TXpjZ0xUVTFJRE0xTVhZeU5UQjJObkV3SURFMklERWdNak11TlhRMkxqVWdNVFFnZERFM0xqVWdOaTQxYURJd01HdzJOelVnTWpVd2RpMDROVEI2VFRBZ056VXdkaTB5TlRCeExUUWdNQ0F0TVRFZ01DNDFkQzB5TkNBMmRDMHpNQ0F4TlhRdE1qUWdNekIwTFRFeElEUTRMalYyTlRCeE1DQXlOaUF4TUM0MUlEUTJkREkxSURNd2RESTVJREUyZERJMUxqVWdOM29pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVEl6T3lJZ1pEMGlUVFUxTXlBeE1qQXdhRGswY1RJd0lEQWdNamtnTFRFd0xqVjBNeUF0TWprdU5Xd3RNVGdnTFRNM2NUZ3pJQzB4T1NBeE5EUWdMVGd5TGpWME56WWdMVEUwTUM0MWJEWXpJQzB6TWpkc01URTRJQzB4TnpOb01UZHhNVGtnTUNBek15QXRNVFF1TlhReE5DQXRNelYwTFRFeklDMDBNQzQxZEMwek1TQXRNamR4TFRnZ0xUUWdMVEl6SUMwNUxqVjBMVFkxSUMweE9TNDFkQzB4TURNZ0xUSTFkQzB4TXpJdU5TQXRNakIwTFRFMU9DNDFJQzA1Y1MwMU55QXdJQzB4TVRVZ05YUXRNVEEwSURFeWRDMDRPQzQxSURFMUxqVjBMVGN6TGpVZ01UY3VOWFF0TlRRdU5TQXhOblF0TXpVdU5TQXhNbXd0TVRFZ05DQnhMVEU0SURnZ0xUTXhJREk0ZEMweE15QTBNQzQxZERFMElETTFkRE16SURFMExqVm9NVGRzTVRFNElERTNNMncyTXlBek1qZHhNVFVnTnpjZ056WWdNVFF3ZERFME5DQTRNMnd0TVRnZ016SnhMVFlnTVRrZ015NDFJRE15ZERJNExqVWdNVE42VFRRNU9DQXhNVEJ4TlRBZ0xUWWdNVEF5SUMwMmNUVXpJREFnTVRBeUlEWnhMVEV5SUMwME9TQXRNemt1TlNBdE56a3VOWFF0TmpJdU5TQXRNekF1TlhRdE5qTWdNekF1TlhRdE16a2dOemt1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRJME95SWdaRDBpVFRnd01DQTVORFpzTWpJMElEYzRiQzAzT0NBdE1qSTBiREl6TkNBdE5EVnNMVEU0TUNBdE1UVTFiREU0TUNBdE1UVTFiQzB5TXpRZ0xUUTFiRGM0SUMweU1qUnNMVEl5TkNBM09Hd3RORFVnTFRJek5Hd3RNVFUxSURFNE1Hd3RNVFUxSUMweE9EQnNMVFExSURJek5Hd3RNakkwSUMwM09HdzNPQ0F5TWpSc0xUSXpOQ0EwTld3eE9EQWdNVFUxYkMweE9EQWdNVFUxYkRJek5DQTBOV3d0TnpnZ01qSTBiREl5TkNBdE56aHNORFVnTWpNMGJERTFOU0F0TVRnd2JERTFOU0F4T0RCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFeU5Uc2lJR1E5SWswMk5UQWdNVEl3TUdnMU1IRTBNQ0F3SURjd0lDMDBNQzQxZERNd0lDMDROQzQxZGkweE5UQnNMVEk0SUMweE1qVm9Nekk0Y1RRd0lEQWdOekFnTFRRd0xqVjBNekFnTFRnMExqVjJMVEV3TUhFd0lDMDBOU0F0TWprZ0xUYzBiQzB5TXpnZ0xUTTBOSEV0TVRZZ0xUSTBJQzB6T0NBdE5EQXVOWFF0TkRVZ0xURTJMalZvTFRJMU1IRXROeUF3SUMwME1pQXlOWFF0TmpZZ05UQnNMVE14SURJMWFDMDJNWEV0TkRVZ01DQXROekl1TlNBeE9IUXRNamN1TlNBMU4zWTBNREJ4TUNBek5pQXlNQ0EyTTJ3eE5EVWdNVGsyYkRrMklERTVPSEV4TXlBeU9DQXpOeTQxSURRNGREVXhMalVnTWpCNklFMDJOVEFnTVRFd01Hd3RNVEF3SUMweU1USnNMVEUxTUNBdE1qRXpkaTB6TnpWb01UQXdiREV6TmlBdE1UQXdhREl4Tkd3eU5UQWdNemMxZGpFeU5XZ3RORFV3YkRVd0lESXlOWFl4TnpWb0xUVXdlazAxTUNBNE1EQm9NVEF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkwMU1EQnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRFd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJOVEF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVEkyT3lJZ1pEMGlUVFl3TUNBeE1UQXdhREkxTUhFeU15QXdJRFExSUMweE5pNDFkRE00SUMwME1DNDFiREl6T0NBdE16UTBjVEk1SUMweU9TQXlPU0F0TnpSMkxURXdNSEV3SUMwME5DQXRNekFnTFRnMExqVjBMVGN3SUMwME1DNDFhQzB6TWpoeE1qZ2dMVEV4T0NBeU9DQXRNVEkxZGkweE5UQnhNQ0F0TkRRZ0xUTXdJQzA0TkM0MWRDMDNNQ0F0TkRBdU5XZ3ROVEJ4TFRJM0lEQWdMVFV4TGpVZ01qQjBMVE0zTGpVZ05EaHNMVGsySURFNU9Hd3RNVFExSURFNU5uRXRNakFnTWpjZ0xUSXdJRFl6ZGpRd01IRXdJRE01SURJM0xqVWdOVGQwTnpJdU5TQXhPR2cyTVhFeE1qUWdNVEF3SURFek9TQXhNREI2SUUwMU1DQXhNREF3YURFd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXROVEF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMHhNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpVd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNlRUWXpOaUF4TURBd2JDMHhNellnTFRFd01HZ3RNVEF3ZGkwek56VnNNVFV3SUMweU1UTnNNVEF3SUMweU1USm9OVEIyTVRjMWJDMDFNQ0F5TWpWb05EVXdkakV5Tld3dE1qVXdJRE0zTldndE1qRTBlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhNamM3SWlCa1BTSk5NelUySURnM00yd3pOak1nTWpNd2NUTXhJREUySURVeklDMDJiREV4TUNBdE1URXljVEV6SUMweE15QXhNeTQxSUMwek1uUXRNVEV1TlNBdE16UnNMVGcwSUMweE1qRm9NekF5Y1RnMElEQWdNVE00SUMwek9IUTFOQ0F0TVRFd2RDMDFOU0F0TVRFeGRDMHhNemtnTFRNNWFDMHhNRFpzTFRFek1TQXRNek01Y1MwMklDMHlNU0F0TVRrdU5TQXROREYwTFRJNExqVWdMVEl3YUMwek5ESnhMVGNnTUNBdE9UQWdPREYwTFRneklEazBkalV5TlhFd0lERTNJREUwSURNMUxqVjBNamdnTWpndU5YcE5OREF3SURjNU1uWXROVEF6YkRFd01DQXRPRGxvTWpremJERXpNU0F6TXprZ2NUWWdNakVnTVRrdU5TQTBNWFF5T0M0MUlESXdhREl3TTNFeU1TQXdJRE13TGpVZ01qVjBNQzQxSURVd2RDMHpNU0F5TldndE5EVTJhQzAzYUMwMmFDMDFMalYwTFRZZ01DNDFkQzAxSURFdU5YUXROU0F5ZEMwMElESXVOWFF0TkNBMGRDMHlMalVnTkM0MWNTMHhNaUF5TlNBMUlEUTNiREUwTmlBeE9ETnNMVGcySURnemVrMDFNQ0E0TURCb01UQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTAxTURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVEV3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk5UQXdJSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpURXlPRHNpSUdROUlrMDBOelVnTVRFd00yd3pOallnTFRJek1IRXlJQzB4SURZZ0xUTXVOWFF4TkNBdE1UQXVOWFF4T0NBdE1UWXVOWFF4TkM0MUlDMHlNSFEyTGpVZ0xUSXlMalYyTFRVeU5YRXdJQzB4TXlBdE9EWWdMVGswZEMwNU15QXRPREZvTFRNME1uRXRNVFVnTUNBdE1qZ3VOU0F5TUhRdE1Ua3VOU0EwTVd3dE1UTXhJRE16T1dndE1UQTJjUzA0TlNBd0lDMHhNemt1TlNBek9YUXROVFF1TlNBeE1URjBOVFFnTVRFd2RERXpPQ0F6T0dnek1ESnNMVGcxSURFeU1YRXRNVEVnTVRVZ0xURXdMalVnTXpSME1UTXVOU0F6TW13eE1UQWdNVEV5Y1RJeUlESXlJRFV6SURaNlRUTTNNQ0E1TkRWc01UUTJJQzB4T0RNZ2NURTNJQzB5TWlBMUlDMDBOM0V0TWlBdE1pQXRNeTQxSUMwMExqVjBMVFFnTFRSMExUUWdMVEl1TlhRdE5TQXRNblF0TlNBdE1TNDFkQzAySUMwd0xqVm9MVFpvTFRZdU5XZ3RObWd0TkRjMWRpMHhNREJvTWpJeGNURTFJREFnTWprZ0xUSXdkREl3SUMwME1Xd3hNekFnTFRNek9XZ3lPVFJzTVRBMklEZzVkalV3TTJ3dE16UXlJREl6Tm5wTk1UQTFNQ0E0TURCb01UQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTAxTURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVEV3TUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpVZ2RqVXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpURXlPVHNpSUdROUlrMDFOVEFnTVRJNU5IRTNNaUF3SURFeE1TQXROVFYwTXprZ0xURXpPWFl0TVRBMmJETXpPU0F0TVRNeGNUSXhJQzAySURReElDMHhPUzQxZERJd0lDMHlPQzQxZGkwek5ESnhNQ0F0TnlBdE9ERWdMVGt3ZEMwNU5DQXRPRE5vTFRVeU5YRXRNVGNnTUNBdE16VXVOU0F4TkhRdE1qZ3VOU0F5T0d3dE9TQXhOR3d0TWpNd0lETTJNM0V0TVRZZ016RWdOaUExTTJ3eE1USWdNVEV3Y1RFeklERXpJRE15SURFekxqVjBNelFnTFRFeExqVnNNVEl4SUMwNE5IWXpNREp4TUNBNE5DQXpPQ0F4TXpoME1URXdJRFUwZWswMk1EQWdPVGN5ZGpJd00zRXdJREl4SUMweU5TQXpNQzQxZEMwMU1DQXdMalVnZEMweU5TQXRNekYyTFRRMU5uWXROM1l0Tm5ZdE5TNDFkQzB3TGpVZ0xUWjBMVEV1TlNBdE5YUXRNaUF0TlhRdE1pNDFJQzAwZEMwMElDMDBkQzAwTGpVZ0xUSXVOWEV0TWpVZ0xURXlJQzAwTnlBMWJDMHhPRE1nTVRRMmJDMDRNeUF0T0Rac01qTTJJQzB6TXpsb05UQXpiRGc1SURFd01IWXlPVE5zTFRNek9TQXhNekZ4TFRJeElEWWdMVFF4SURFNUxqVjBMVEl3SURJNExqVjZUVFExTUNBeU1EQm9OVEF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkweE1EQnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRVd01DQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakV3TUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEV6TURzaUlHUTlJazB6TlRBZ01URXdNR2cxTURCeE1qRWdNQ0F6TlM0MUlERTBMalYwTVRRdU5TQXpOUzQxZGpFd01IRXdJREl4SUMweE5DNDFJRE0xTGpWMExUTTFMalVnTVRRdU5XZ3ROVEF3Y1MweU1TQXdJQzB6TlM0MUlDMHhOQzQxZEMweE5DNDFJQzB6TlM0MWRpMHhNREJ4TUNBdE1qRWdNVFF1TlNBdE16VXVOWFF6TlM0MUlDMHhOQzQxZWswMk1EQWdNekEyZGkweE1EWnhNQ0F0T0RRZ0xUTTVJQzB4TXpsMExURXhNU0F0TlRWMExURXhNQ0ExTkhRdE16Z2dNVE00ZGpNd01td3RNVEl4SUMwNE5IRXRNVFVnTFRFeUlDMHpOQ0F0TVRFdU5YUXRNeklnTVRNdU5Xd3RNVEV5SURFeE1DQnhMVEl5SURJeUlDMDJJRFV6YkRJek1DQXpOak54TVNBeUlETXVOU0EyZERFd0xqVWdNVE11TlhReE5pNDFJREUzZERJd0lERXpMalYwTWpJdU5TQTJhRFV5TlhFeE15QXdJRGswSUMwNE0zUTRNU0F0T1RCMkxUTTBNbkV3SUMweE5TQXRNakFnTFRJNExqVjBMVFF4SUMweE9TNDFlazB6TURnZ09UQXdiQzB5TXpZZ0xUTXpPV3c0TXlBdE9EWnNNVGd6SURFME5uRXlNaUF4TnlBME55QTFjVElnTFRFZ05DNDFJQzB5TGpWME5DQXROSFF5TGpVZ0xUUjBNaUF0TlhReExqVWdMVFYwTUM0MUlDMDJkaTAxTGpWMkxUWjJMVGQyTFRRMU5uRXdJQzB5TWlBeU5TQXRNekYwTlRBZ01DNDFkREkxSURNd0xqVWdkakl3TTNFd0lERTFJREl3SURJNExqVjBOREVnTVRrdU5Xd3pNemtnTVRNeGRqSTVNMnd0T0RrZ01UQXdhQzAxTURONklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFek1Uc2lJR1E5SWswMk1EQWdNVEUzT0hFeE1UZ2dNQ0F5TWpVZ0xUUTFMalYwTVRnMExqVWdMVEV5TTNReE1qTWdMVEU0TkM0MWREUTFMalVnTFRJeU5YUXRORFV1TlNBdE1qSTFkQzB4TWpNZ0xURTROQzQxZEMweE9EUXVOU0F0TVRJemRDMHlNalVnTFRRMUxqVjBMVEl5TlNBME5TNDFkQzB4T0RRdU5TQXhNak4wTFRFeU15QXhPRFF1TlhRdE5EVXVOU0F5TWpWME5EVXVOU0F5TWpWME1USXpJREU0TkM0MWRERTROQzQxSURFeU0zUXlNalVnTkRVdU5YcE5PVEUwSURZek1td3RNamMxSURJeU0zRXRNVFlnTVRNZ0xUSTNMalVnT0hRdE1URXVOU0F0TWpaMkxURXpOMmd0TWpjMUlIRXRNVEFnTUNBdE1UY3VOU0F0Tnk0MWRDMDNMalVnTFRFM0xqVjJMVEUxTUhFd0lDMHhNQ0EzTGpVZ0xURTNMalYwTVRjdU5TQXROeTQxYURJM05YWXRNVE0zY1RBZ0xUSXhJREV4TGpVZ0xUSTJkREkzTGpVZ09Hd3lOelVnTWpJemNURTJJREV6SURFMklETXlkQzB4TmlBek1ub2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1UTXlPeUlnWkQwaVRUWXdNQ0F4TVRjNGNURXhPQ0F3SURJeU5TQXRORFV1TlhReE9EUXVOU0F0TVRJemRERXlNeUF0TVRnMExqVjBORFV1TlNBdE1qSTFkQzAwTlM0MUlDMHlNalYwTFRFeU15QXRNVGcwTGpWMExURTROQzQxSUMweE1qTjBMVEl5TlNBdE5EVXVOWFF0TWpJMUlEUTFMalYwTFRFNE5DNDFJREV5TTNRdE1USXpJREU0TkM0MWRDMDBOUzQxSURJeU5YUTBOUzQxSURJeU5YUXhNak1nTVRnMExqVjBNVGcwTGpVZ01USXpkREl5TlNBME5TNDFlazAxTmpFZ09EVTFiQzB5TnpVZ0xUSXlNM0V0TVRZZ0xURXpJQzB4TmlBdE16SjBNVFlnTFRNeWJESTNOU0F0TWpJemNURTJJQzB4TXlBeU55NDFJQzA0SUhReE1TNDFJREkyZGpFek4yZ3lOelZ4TVRBZ01DQXhOeTQxSURjdU5YUTNMalVnTVRjdU5YWXhOVEJ4TUNBeE1DQXROeTQxSURFM0xqVjBMVEUzTGpVZ055NDFhQzB5TnpWMk1UTTNjVEFnTWpFZ0xURXhMalVnTWpaMExUSTNMalVnTFRoNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFek16c2lJR1E5SWswMk1EQWdNVEUzT0hFeE1UZ2dNQ0F5TWpVZ0xUUTFMalYwTVRnMExqVWdMVEV5TTNReE1qTWdMVEU0TkM0MWREUTFMalVnTFRJeU5YUXRORFV1TlNBdE1qSTFkQzB4TWpNZ0xURTROQzQxZEMweE9EUXVOU0F0TVRJemRDMHlNalVnTFRRMUxqVjBMVEl5TlNBME5TNDFkQzB4T0RRdU5TQXhNak4wTFRFeU15QXhPRFF1TlhRdE5EVXVOU0F5TWpWME5EVXVOU0F5TWpWME1USXpJREU0TkM0MWRERTROQzQxSURFeU0zUXlNalVnTkRVdU5YcE5PRFUxSURZek9Xd3RNakl6SURJM05YRXRNVE1nTVRZZ0xUTXlJREUyZEMwek1pQXRNVFpzTFRJeU15QXRNamMxY1MweE15QXRNVFlnTFRnZ0xUSTNMalVnZERJMklDMHhNUzQxYURFek4zWXRNamMxY1RBZ0xURXdJRGN1TlNBdE1UY3VOWFF4Tnk0MUlDMDNMalZvTVRVd2NURXdJREFnTVRjdU5TQTNMalYwTnk0MUlERTNMalYyTWpjMWFERXpOM0V5TVNBd0lESTJJREV4TGpWMExUZ2dNamN1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRNME95SWdaRDBpVFRZd01DQXhNVGM0Y1RFeE9DQXdJREl5TlNBdE5EVXVOWFF4T0RRdU5TQXRNVEl6ZERFeU15QXRNVGcwTGpWME5EVXVOU0F0TWpJMWRDMDBOUzQxSUMweU1qVjBMVEV5TXlBdE1UZzBMalYwTFRFNE5DNDFJQzB4TWpOMExUSXlOU0F0TkRVdU5YUXRNakkxSURRMUxqVjBMVEU0TkM0MUlERXlNM1F0TVRJeklERTROQzQxZEMwME5TNDFJREl5TlhRME5TNDFJREl5TlhReE1qTWdNVGcwTGpWME1UZzBMalVnTVRJemRESXlOU0EwTlM0MWVrMDJOelVnT1RBd2FDMHhOVEJ4TFRFd0lEQWdMVEUzTGpVZ0xUY3VOWFF0Tnk0MUlDMHhOeTQxZGkweU56Vm9MVEV6TjNFdE1qRWdNQ0F0TWpZZ0xURXhMalVnZERnZ0xUSTNMalZzTWpJeklDMHlOelZ4TVRNZ0xURTJJRE15SUMweE5uUXpNaUF4Tm13eU1qTWdNamMxY1RFeklERTJJRGdnTWpjdU5YUXRNallnTVRFdU5XZ3RNVE0zZGpJM05YRXdJREV3SUMwM0xqVWdNVGN1TlhRdE1UY3VOU0EzTGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFek5Uc2lJR1E5SWswMk1EQWdNVEUzTm5FeE1UWWdNQ0F5TWpJdU5TQXRORFowTVRnMElDMHhNak11TlhReE1qTXVOU0F0TVRnMGREUTJJQzB5TWpJdU5YUXRORFlnTFRJeU1pNDFkQzB4TWpNdU5TQXRNVGcwZEMweE9EUWdMVEV5TXk0MWRDMHlNakl1TlNBdE5EWjBMVEl5TWk0MUlEUTJkQzB4T0RRZ01USXpMalYwTFRFeU15NDFJREU0TkhRdE5EWWdNakl5TGpWME5EWWdNakl5TGpWME1USXpMalVnTVRnMGRERTROQ0F4TWpNdU5YUXlNakl1TlNBME5ucE5OakkzSURFeE1ERnhMVEUxSUMweE1pQXRNell1TlNBdE1qQXVOWFF0TXpVdU5TQXRNVEowTFRReklDMDRkQzB6T1NBdE5pNDFJSEV0TVRVZ0xUTWdMVFExTGpVZ01IUXRORFV1TlNBdE1uRXRNakFnTFRjZ0xUVXhMalVnTFRJMkxqVjBMVE0wTGpVZ0xUTTBMalZ4TFRNZ0xURXhJRFl1TlNBdE1qSXVOWFE0TGpVZ0xURTRMalZ4TFRNZ0xUTTBJQzB5Tnk0MUlDMDVNWFF0TWprdU5TQXROemx4TFRrZ0xUTTBJRFVnTFRremREZ2dMVGczY1RBZ0xUa2dNVGNnTFRRMExqVjBNVFlnTFRVNUxqVnhNVElnTUNBeU15QXROWFF5TXk0MUlDMHhOWFF4T1M0MUlDMHhOSEV4TmlBdE9DQXpNeUF0TVRWME5EQXVOU0F0TVRWME16UXVOU0F0TVRKeE1qRWdMVGtnTlRJdU5TQXRNekowTmpBZ0xUTTRkRFUzTGpVZ0xURXhJSEUzSUMweE5TQXRNeUF0TXpSMExUSXlMalVnTFRRd2RDMDVMalVnTFRNNGNURXpJQzB5TVNBeU15QXRNelF1TlhReU55NDFJQzB5Tnk0MWRETTJMalVnTFRFNGNUQWdMVGNnTFRNdU5TQXRNVFowTFRNdU5TQXRNVFIwTlNBdE1UZHhNVEEwSUMweUlESXlNU0F4TVRKeE16QWdNamtnTkRZdU5TQTBOM1F6TkM0MUlEUTVkREl4SURZemNTMHhNeUE0SUMwek55QTRMalYwTFRNMklEY3VOWEV0TVRVZ055QXRORGt1TlNBeE5YUXROVEV1TlNBeE9YRXRNVGdnTUNBdE5ERWdMVEF1TlhRdE5ETWdMVEV1TlhRdE5ESWdMVFl1TlhRdE16Z2dMVEUyTGpWeExUVXhJQzB6TlNBdE5qWWdMVEV5SUhFdE5DQXhJQzB6TGpVZ01qVXVOWFF3TGpVZ01qVXVOWEV0TmlBeE15QXRNall1TlNBeE55NDFkQzB5TkM0MUlEWXVOWEV4SURFMUlDMHdMalVnTXpBdU5YUXROeUF5T0hRdE1UZ3VOU0F4TVM0MWRDMHpNU0F0TWpGeExUSXpJQzB5TlNBdE5ESWdOSEV0TVRrZ01qZ2dMVGdnTlRoeE5pQXhOaUF5TWlBeU1uRTJJQzB4SURJMklDMHhMalYwTXpNdU5TQXROSFF4T1M0MUlDMHhNeTQxY1RjZ0xURXlJREU0SUMweU5IUXlNUzQxSUMweU1DNDFkREl3SUMweE5YUXhOUzQxSUMweE1DNDFiRFVnTFROeE1pQXhNaUEzTGpVZ016QXVOWFE0SURNMExqVjBMVEF1TlNBek1uRXRNeUF4T0NBekxqVWdNamtnZERFNElESXlMalYwTVRVdU5TQXlOQzQxY1RZZ01UUWdNVEF1TlNBek5YUTRJRE14ZERFMUxqVWdNakl1TlhRek5DQXlNaTQxY1MwMklERTRJREV3SURNMmNUZ2dNQ0F5TkNBdE1TNDFkREkwTGpVZ0xURXVOWFF5TUNBMExqVjBNakF1TlNBeE5TNDFjUzB4TUNBeU15QXRNekVnTkRJdU5YUXRNemN1TlNBeU9TNDFkQzAwT1NBeU4zUXRORE11TlNBeU0zRXdJREVnTWlBNGRETWdNVEV1TlhReExqVWdNVEF1TlhRdE1TQTVMalYwTFRRdU5TQTBMalZ4TXpFZ0xURXpJRFU0TGpVZ0xURTBMalYwTXpndU5TQXlMalZzTVRJZ05YRTFJREk0SUMwNUxqVWdORFowTFRNMkxqVWdNalIwTFRVd0lERTFJSFF0TkRFZ01qQnhMVEU0SUMwMElDMHpOeUF3ZWswMk1UTWdPVGswY1RBZ0xURTNJRGdnTFRReWRERTNJQzAwTlhRNUlDMHlNM0V0T0NBeElDMHpPUzQxSURVdU5YUXROVEl1TlNBeE1IUXRNemNnTVRZdU5YRXpJREV4SURFMklESTVMalYwTVRZZ01qVXVOWEV4TUNBdE1UQWdNVGtnTFRFd2RERTBJRFowTVRNdU5TQXhOQzQxZERFMkxqVWdNVEl1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRNMk95SWdaRDBpVFRjMU5pQXhNVFUzY1RFMk5DQTVNaUF6TURZZ0xUbHNMVEkxT1NBdE1UTTRiREUwTlNBdE1qTXliREkxTVNBeE1qWnhOaUF0T0RrZ0xUTTBJQzB4TlRZdU5YUXRNVEUzSUMweE1UQXVOWEV0TmpBZ0xUTTBJQzB4TWpjZ0xUTTVMalYwTFRFeU5pQXhOaTQxYkMwMU9UWWdMVFU1Tm5FdE1UVWdMVEUySUMwek5pNDFJQzB4Tm5RdE16WXVOU0F4Tm13dE1URXhJREV4TUhFdE1UVWdNVFVnTFRFMUlETTJMalYwTVRVZ016Y3VOV3cyTURBZ05UazVjUzB6TkNBeE1ERWdOUzQxSURJd01TNDFkREV6TlM0MUlERTFOQzQxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TXpjN0lpQm9iM0pwZWkxaFpIWXRlRDBpTVRJeU1DSWdaRDBpVFRFd01DQXhNVGsyYURFd01EQnhOREVnTUNBM01DNDFJQzB5T1M0MWRESTVMalVnTFRjd0xqVjJMVEV3TUhFd0lDMDBNU0F0TWprdU5TQXROekF1TlhRdE56QXVOU0F0TWprdU5XZ3RNVEF3TUhFdE5ERWdNQ0F0TnpBdU5TQXlPUzQxZEMweU9TNDFJRGN3TGpWMk1UQXdjVEFnTkRFZ01qa3VOU0EzTUM0MWREY3dMalVnTWprdU5YcE5NVEV3TUNBeE1EazJhQzB5TURCMkxURXdNR2d5TURCMk1UQXdlazB4TURBZ056azJhREV3TURCeE5ERWdNQ0EzTUM0MUlDMHlPUzQxZERJNUxqVWdMVGN3TGpWMkxURXdNSEV3SUMwME1TQXRNamt1TlNBdE56QXVOWFF0TnpBdU5TQXRNamt1TldndE1UQXdNQ0J4TFRReElEQWdMVGN3TGpVZ01qa3VOWFF0TWprdU5TQTNNQzQxZGpFd01IRXdJRFF4SURJNUxqVWdOekF1TlhRM01DNDFJREk1TGpWNlRURXhNREFnTmprMmFDMDFNREIyTFRFd01HZzFNREIyTVRBd2VrMHhNREFnTXprMmFERXdNREJ4TkRFZ01DQTNNQzQxSUMweU9TNDFkREk1TGpVZ0xUY3dMalYyTFRFd01IRXdJQzAwTVNBdE1qa3VOU0F0TnpBdU5YUXROekF1TlNBdE1qa3VOV2d0TVRBd01IRXROREVnTUNBdE56QXVOU0F5T1M0MWRDMHlPUzQxSURjd0xqVjJNVEF3Y1RBZ05ERWdNamt1TlNBM01DNDFkRGN3TGpVZ01qa3VOWHBOTVRFd01DQXlPVFpvTFRNd01IWXRNVEF3YURNd01IWXhNREI2SUNJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TXpnN0lpQmtQU0pOTVRVd0lERXlNREJvT1RBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMwNU1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRjd01DQTFNREIyTFRNd01Hd3RNakF3SUMweU1EQjJOVEF3YkMwek5UQWdOVEF3YURrd01Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1UTTVPeUlnWkQwaVRUVXdNQ0F4TWpBd2FESXdNSEUwTVNBd0lEY3dMalVnTFRJNUxqVjBNamt1TlNBdE56QXVOWFl0TVRBd2FETXdNSEUwTVNBd0lEY3dMalVnTFRJNUxqVjBNamt1TlNBdE56QXVOWFl0TkRBd2FDMDFNREIyTVRBd2FDMHlNREIyTFRFd01HZ3ROVEF3ZGpRd01IRXdJRFF4SURJNUxqVWdOekF1TlhRM01DNDFJREk1TGpWb016QXdkakV3TUhFd0lEUXhJREk1TGpVZ056QXVOWFEzTUM0MUlESTVMalY2VFRVd01DQXhNVEF3ZGkweE1EQm9NakF3ZGpFd01HZ3RNakF3ZWsweE1qQXdJRFF3TUhZdE1qQXdjVEFnTFRReElDMHlPUzQxSUMwM01DNDFkQzAzTUM0MUlDMHlPUzQxYUMweE1EQXdJSEV0TkRFZ01DQXROekF1TlNBeU9TNDFkQzB5T1M0MUlEY3dMalYyTWpBd2FERXlNREI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEUwTURzaUlHUTlJazAxTUNBeE1qQXdhRE13TUhFeU1TQXdJREkxSUMweE1DNDFkQzB4TUNBdE1qUXVOV3d0T1RRZ0xUazBiREU1T1NBdE1UazVjVGNnTFRnZ055QXRNVGgwTFRjZ0xURTRiQzB4TURZZ0xURXdObkV0T0NBdE55QXRNVGdnTFRkMExURTRJRGRzTFRFNU9TQXhPVGxzTFRrMElDMDVOSEV0TVRRZ0xURTBJQzB5TkM0MUlDMHhNSFF0TVRBdU5TQXlOWFl6TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWswNE5UQWdNVEl3TUdnek1EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVE13TUhFd0lDMHlNU0F0TVRBdU5TQXRNalYwTFRJMExqVWdNVEJzTFRrMElEazBJR3d0TVRrNUlDMHhPVGx4TFRnZ0xUY2dMVEU0SUMwM2RDMHhPQ0EzYkMweE1EWWdNVEEyY1MwM0lEZ2dMVGNnTVRoME55QXhPR3d4T1RrZ01UazViQzA1TkNBNU5IRXRNVFFnTVRRZ0xURXdJREkwTGpWME1qVWdNVEF1TlhwTk16WTBJRFEzTUd3eE1EWWdMVEV3Tm5FM0lDMDRJRGNnTFRFNGRDMDNJQzB4T0d3dE1UazVJQzB4T1Rsc09UUWdMVGswY1RFMElDMHhOQ0F4TUNBdE1qUXVOWFF0TWpVZ0xURXdMalZvTFRNd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNekF3Y1RBZ01qRWdNVEF1TlNBeU5YUXlOQzQxSUMweE1HdzVOQ0F0T1RSc01UazVJREU1T1NCeE9DQTNJREU0SURkME1UZ2dMVGQ2VFRFd056RWdNamN4YkRrMElEazBjVEUwSURFMElESTBMalVnTVRCME1UQXVOU0F0TWpWMkxUTXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE16QXdjUzB5TVNBd0lDMHlOU0F4TUM0MWRERXdJREkwTGpWc09UUWdPVFJzTFRFNU9TQXhPVGx4TFRjZ09DQXROeUF4T0hRM0lERTRiREV3TmlBeE1EWnhPQ0EzSURFNElEZDBNVGdnTFRkNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFME1Uc2lJR1E5SWswMU9UWWdNVEU1TW5FeE1qRWdNQ0F5TXpFdU5TQXRORGN1TlhReE9UQWdMVEV5TjNReE1qY2dMVEU1TUhRME55NDFJQzB5TXpFdU5YUXRORGN1TlNBdE1qTXhMalYwTFRFeU55QXRNVGt3TGpWMExURTVNQ0F0TVRJM2RDMHlNekV1TlNBdE5EZDBMVEl6TVM0MUlEUTNkQzB4T1RBdU5TQXhNamQwTFRFeU55QXhPVEF1TlhRdE5EY2dNak14TGpWME5EY2dNak14TGpWME1USTNJREU1TUhReE9UQXVOU0F4TWpkME1qTXhMalVnTkRjdU5YcE5OVGsySURFd01UQnhMVEV4TWlBd0lDMHlNRGN1TlNBdE5UVXVOWFF0TVRVeElDMHhOVEYwTFRVMUxqVWdMVEl3Tnk0MWREVTFMalVnTFRJd055NDFJSFF4TlRFZ0xURTFNWFF5TURjdU5TQXROVFV1TlhReU1EY3VOU0ExTlM0MWRERTFNU0F4TlRGME5UVXVOU0F5TURjdU5YUXROVFV1TlNBeU1EY3VOWFF0TVRVeElERTFNWFF0TWpBM0xqVWdOVFV1TlhwTk5EVTBMalVnT1RBMWNUSXlMalVnTUNBek9DNDFJQzB4Tm5ReE5pQXRNemd1TlhRdE1UWWdMVE01ZEMwek9DNDFJQzB4Tmk0MWRDMHpPQzQxSURFMkxqVjBMVEUySURNNWRERTJJRE00TGpWME16Z3VOU0F4Tm5wTk56VTBMalVnT1RBMWNUSXlMalVnTUNBek9DNDFJQzB4Tm5ReE5pQXRNemd1TlhRdE1UWWdMVE01ZEMwek9DQXRNVFl1TlhFdE1UUWdNQ0F0TWprZ01UQnNMVFUxSUMweE5EVWdjVEUzSUMweU15QXhOeUF0TlRGeE1DQXRNellnTFRJMUxqVWdMVFl4TGpWMExUWXhMalVnTFRJMUxqVjBMVFl4TGpVZ01qVXVOWFF0TWpVdU5TQTJNUzQxY1RBZ016SWdNakF1TlNBMU5pNDFkRFV4TGpVZ01qa3VOV3d4TWpJZ01USTJiREVnTVhFdE9TQXhOQ0F0T1NBeU9IRXdJREl6SURFMklETTVkRE00TGpVZ01UWjZUVE0wTlM0MUlEY3dPWEV5TWk0MUlEQWdNemd1TlNBdE1UWjBNVFlnTFRNNExqVjBMVEUySUMwek9DNDFkQzB6T0M0MUlDMHhOblF0TXpndU5TQXhOblF0TVRZZ016Z3VOWFF4TmlBek9DNDFkRE00TGpVZ01UWjZUVGcxTkM0MUlEY3dPWEV5TWk0MUlEQWdNemd1TlNBdE1UWWdkREUySUMwek9DNDFkQzB4TmlBdE16Z3VOWFF0TXpndU5TQXRNVFowTFRNNExqVWdNVFowTFRFMklETTRMalYwTVRZZ016Z3VOWFF6T0M0MUlERTJlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhOREk3SWlCa1BTSk5OVFEySURFM00ydzBOamtnTkRjd2NUa3hJRGt4SURrNUlERTVNbkUzSURrNElDMDFNaUF4TnpVdU5YUXRNVFUwSURrMExqVnhMVEl5SURRZ0xUUTNJRFJ4TFRNMElEQWdMVFkyTGpVZ0xURXdkQzAxTmk0MUlDMHlNM1F0TlRVdU5TQXRNemgwTFRRNElDMDBNUzQxZEMwME9DNDFJQzAwTnk0MWNTMHpOellnTFRNM05TQXRNemt4SUMwek9UQnhMVE13SUMweU55QXRORFVnTFRReExqVjBMVE0zTGpVZ0xUUXhkQzB6TWlBdE5EWXVOWFF0TVRZZ0xUUTNMalYwTFRFdU5TQXROVFl1TlhFNUlDMDJNaUExTXk0MUlDMDVOWFE1T1M0MUlDMHpNM0UzTkNBd0lERXlOU0ExTVd3MU5EZ2dOVFE0SUhFek5pQXpOaUF5TUNBM05YRXROeUF4TmlBdE1qRXVOU0F5Tm5RdE16SXVOU0F4TUhFdE1qWWdNQ0F0TlRBZ0xUSXpjUzB4TXlBdE1USWdMVE01SUMwek9Hd3RNelF4SUMwek16aHhMVEUxSUMweE5TQXRNelV1TlNBdE1UVXVOWFF0TXpRdU5TQXhNeTQxZEMweE5DQXpOQzQxZERFMElETTBMalZ4TXpJM0lETXpNeUF6TmpFZ016WTNjVE0xSURNMUlEWTNMalVnTlRFdU5YUTNPQzQxSURFMkxqVnhNVFFnTUNBeU9TQXRNWEUwTkNBdE9DQTNOQzQxSUMwek5TNDFkRFF6TGpVZ0xUWTRMalZ4TVRRZ0xUUTNJRElnTFRrMkxqVjBMVFEzSUMwNE5DNDFjUzB4TWlBdE1URWdMVE15SUMwek1pQjBMVGM1TGpVZ0xUZ3hkQzB4TVRRdU5TQXRNVEUxZEMweE1qUXVOU0F0TVRJekxqVjBMVEV5TXlBdE1URTVMalYwTFRrMkxqVWdMVGc1ZEMwMU55QXRORFZ4TFRVMklDMHlOeUF0TVRJd0lDMHlOM0V0TnpBZ01DQXRNVEk1SURNeWRDMDVNeUE0T1hFdE5EZ2dOemdnTFRNMUlERTNNM1E0TVNBeE5qTnNOVEV4SURVeE1YRTNNU0EzTWlBeE1URWdPVFp4T1RFZ05UVWdNVGs0SURVMWNUZ3dJREFnTVRVeUlDMHpNM0UzT0NBdE16WWdNVEk1TGpVZ0xURXdNM1EyTmk0MUlDMHhOVFJ4TVRjZ0xUa3pJQzB4TVNBdE1UZ3pMalYwTFRrMElDMHhOVFl1Tld3dE5EZ3lJQzAwTnpZZ2NTMHhOU0F0TVRVZ0xUTTJJQzB4Tm5RdE16Y2dNVFIwTFRFM0xqVWdNelIwTVRRdU5TQXpOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVFF6T3lJZ1pEMGlUVFkwT1NBNU5EbHhORGdnTmpnZ01UQTVMalVnTVRBMGRERXlNUzQxSURNNExqVjBNVEU0TGpVZ0xUSXdkREV3TWk0MUlDMDJOSFEzTVNBdE1UQXdMalYwTWpjZ0xURXlNM0V3SUMwMU55QXRNek11TlNBdE1URTNMalYwTFRrMElDMHhNalF1TlhRdE1USTJMalVnTFRFeU55NDFkQzB4TlRBZ0xURTFNaTQxZEMweE5EWWdMVEUzTkhFdE5qSWdPRFVnTFRFME5TNDFJREUzTkhRdE1UVXdJREUxTWk0MWRDMHhNall1TlNBeE1qY3VOWFF0T1RNdU5TQXhNalF1TlhRdE16TXVOU0F4TVRjdU5YRXdJRFkwSURJNElERXlNM1EzTXlBeE1EQXVOWFF4TURRZ05qUjBNVEU1SURJd0lIUXhNakF1TlNBdE16Z3VOWFF4TURRdU5TQXRNVEEwZWswNE9UWWdPVGN5Y1Mwek15QXdJQzAyTkM0MUlDMHhPWFF0TlRZdU5TQXRORFowTFRRM0xqVWdMVFV6TGpWMExUUXpMalVnTFRRMUxqVjBMVE0zTGpVZ0xURTVkQzB6TmlBeE9YUXROREFnTkRVdU5YUXRORE1nTlRNdU5YUXROVFFnTkRaMExUWTFMalVnTVRseExUWTNJREFnTFRFeU1pNDFJQzAxTlM0MWRDMDFOUzQxSUMweE16SXVOWEV3SUMweU15QXhNeTQxSUMwMU1YUTBOaUF0TmpWME5UY3VOU0F0TmpOME56WWdMVGMxYkRJeUlDMHlNbkV4TlNBdE1UUWdORFFnTFRRMGREVXdMalVnTFRVeGREUTJJQzAwTkhRME1TQXRNelYwTWpNZ0xURXlJSFF5TXk0MUlERXlkRFF5TGpVZ016WjBORFlnTkRSME5USXVOU0ExTW5RME5DQTBNM0UwSURRZ01USWdNVE54TkRNZ05ERWdOak11TlNBMk1uUTFNaUExTlhRME5pQTFOWFF5TmlBME5uUXhNUzQxSURRMGNUQWdOemtnTFRVeklERXpNeTQxZEMweE1qQWdOVFF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRRME95SWdaRDBpVFRjM05pNDFJREV5TVRSeE9UTXVOU0F3SURFMU9TNDFJQzAyTm13eE5ERWdMVEUwTVhFMk5pQXROallnTmpZZ0xURTJNSEV3SUMwME1pQXRNamdnTFRrMUxqVjBMVFl5SUMwNE55NDFiQzB5T1NBdE1qbHhMVE14SURVeklDMDNOeUE1T1d3dE1UZ2dNVGhzT1RVZ09UVnNMVEkwTnlBeU5EaHNMVE00T1NBdE16ZzViREl4TWlBdE1qRXliQzB4TURVZ0xURXdObXd0TVRrZ01UaHNMVEUwTVNBeE5ERnhMVFkySURZMklDMDJOaUF4TlRsME5qWWdNVFU1YkRJNE15QXlPRE54TmpVZ05qWWdNVFU0TGpVZ05qWjZUVFl3TUNBM01EWnNNVEExSURFd05YRXhNQ0F0T0NBeE9TQXRNVGRzTVRReElDMHhOREVnY1RZMklDMDJOaUEyTmlBdE1UVTVkQzAyTmlBdE1UVTViQzB5T0RNZ0xUSTRNM0V0TmpZZ0xUWTJJQzB4TlRrZ0xUWTJkQzB4TlRrZ05qWnNMVEUwTVNBeE5ERnhMVFkySURZMklDMDJOaUF4TlRrdU5YUTJOaUF4TlRrdU5XdzFOU0ExTlhFeU9TQXROVFVnTnpVZ0xURXdNbXd4T0NBdE1UZHNMVGsxSUMwNU5Xd3lORGNnTFRJME9Hd3pPRGtnTXpnNWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE5EVTdJaUJrUFNKTk5qQXpJREV5TURCeE9EVWdNQ0F4TmpJZ0xURTFkREV5TnlBdE16aDBOemtnTFRRNGRESTVJQzAwTm5ZdE9UVXpjVEFnTFRReElDMHlPUzQxSUMwM01DNDFkQzAzTUM0MUlDMHlPUzQxYUMwMk1EQnhMVFF4SURBZ0xUY3dMalVnTWprdU5YUXRNamt1TlNBM01DNDFkamsxTTNFd0lESXhJRE13SURRMkxqVjBPREVnTkRoME1USTVJRE0zTGpWME1UWXpJREUxZWswek1EQWdNVEF3TUhZdE56QXdhRFl3TUhZM01EQm9MVFl3TUhwTk5qQXdJREkxTkhFdE5ETWdNQ0F0TnpNdU5TQXRNekF1TlhRdE16QXVOU0F0TnpNdU5YUXpNQzQxSUMwM015NDFkRGN6TGpVZ0xUTXdMalYwTnpNdU5TQXpNQzQxSUhRek1DNDFJRGN6TGpWMExUTXdMalVnTnpNdU5YUXROek11TlNBek1DNDFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhORFk3SWlCa1BTSk5PVEF5SURFeE9EVnNNamd6SUMweU9ESnhNVFVnTFRFMUlERTFJQzB6Tm5RdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOWFF0TXpVZ01UVnNMVE0ySURNMWJDMHlOemtnTFRJMk4zWXRNekF3YkMweU1USWdNakV3YkMwek1EZ2dMVE13TjJ3dE1qZ3dJQzB5TUROc01qQXpJREk0TUd3ek1EY2dNekE0YkMweU1UQWdNakV5YURNd01Hd3lOamNnTWpjNWJDMHpOU0F6Tm5FdE1UVWdNVFFnTFRFMUlETTFkREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalYwTXpVZ0xURTFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhORGc3SWlCa1BTSk5OekF3SURFeU5EaDJMVGM0Y1RNNElDMDFJRGN5TGpVZ0xURTBMalYwTnpVdU5TQXRNekV1TlhRM01TQXROVE11TlhRMU1pQXRPRFIwTWpRZ0xURXhPQzQxYUMweE5UbHhMVFFnTXpZZ0xURXdMalVnTlRsMExUSXhJRFExZEMwME1DQXpOUzQxZEMwMk5DNDFJREl3TGpWMkxUTXdOMncyTkNBdE1UTnhNelFnTFRjZ05qUWdMVEUyTGpWME56QWdMVE15ZERZM0xqVWdMVFV5TGpWME5EY3VOU0F0T0RCME1qQWdMVEV4TW5Fd0lDMHhNemtnTFRnNUlDMHlNalIwTFRJME5DQXRPVGQyTFRjM2FDMHhNREIyTnpseExURTFNQ0F4TmlBdE1qTTNJREV3TTNFdE5EQWdOREFnTFRVeUxqVWdPVE11TlNCMExURTFMalVnTVRNNUxqVm9NVE01Y1RVZ0xUYzNJRFE0TGpVZ0xURXlOblF4TVRjdU5TQXROalYyTXpNMWJDMHlOeUE0Y1MwME5pQXhOQ0F0TnprZ01qWXVOWFF0TnpJZ016WjBMVFl6SURVeWRDMDBNQ0EzTWk0MWRDMHhOaUE1T0hFd0lEY3dJREkxSURFeU5uUTJOeTQxSURreWREazBMalVnTlRkME1URXdJREkzZGpjM2FERXdNSHBOTmpBd0lEYzFOSFl5TnpSeExUSTVJQzAwSUMwMU1DQXRNVEYwTFRReUlDMHlNUzQxZEMwek1TNDFJQzAwTVM0MWRDMHhNQzQxSUMwMk5YRXdJQzB5T1NBM0lDMDFNQzQxZERFMkxqVWdMVE0wZERJNExqVWdMVEl5TGpWME16RXVOU0F0TVRSME16Y3VOU0F0TVRBZ2NUa2dMVE1nTVRNZ0xUUjZUVGN3TUNBMU5EZDJMVE14TUhFeU1pQXlJRFF5TGpVZ05pNDFkRFExSURFMUxqVjBOREV1TlNBeU4zUXlPU0EwTW5ReE1pQTFPUzQxZEMweE1pNDFJRFU1TGpWMExUTTRJRFEwTGpWMExUVXpJRE14ZEMwMk5pNDFJREkwTGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFME9Uc2lJR1E5SWswMU5qRWdNVEU1TjNFNE5DQXdJREUyTUM0MUlDMDBNSFF4TWpNdU5TQXRNVEE1TGpWME5EY2dMVEUwTnk0MWFDMHhOVE54TUNBME1DQXRNVGt1TlNBM01TNDFkQzAwT1M0MUlEUTRMalYwTFRVNUxqVWdNalowTFRVMUxqVWdPWEV0TXpjZ01DQXROemtnTFRFMExqVjBMVFl5SUMwek5TNDFjUzAwTVNBdE5EUWdMVFF4SUMweE1ERnhNQ0F0TWpZZ01UTXVOU0F0TmpOME1qWXVOU0F0TmpGME16Y2dMVFkyY1RZZ0xUa2dPU0F0TVRSb01qUXhkaTB4TURCb0xURTVOM0U0SUMwMU1DQXRNaTQxSUMweE1UVjBMVE14TGpVZ0xUazFjUzAwTlNBdE5qSWdMVGs1SUMweE1USWdjVE0wSURFd0lEZ3pJREUzTGpWME56RWdOeTQxY1RNeUlERWdNVEF5SUMweE5uUXhNRFFnTFRFM2NUZ3pJREFnTVRNMklETXdiRFV3SUMweE5EZHhMVE14SUMweE9TQXROVGdnTFRNd0xqVjBMVFUxSUMweE5TNDFkQzAwTWlBdE5DNDFkQzAwTmlBdE1DNDFjUzB5TXlBd0lDMDNOaUF4TjNRdE1URXhJRE15TGpWMExUazJJREV4TGpWeExUTTVJQzB6SUMwNE1pQXRNVFowTFRZM0lDMHlOV3d0TWpNZ0xURXhiQzAxTlNBeE5EVnhOQ0F6SURFMklERXhkREUxTGpVZ01UQXVOWFF4TXlBNWRERTFMalVnTVRKME1UUXVOU0F4TkhReE55NDFJREU0TGpWeE5EZ2dOVFVnTlRRZ01USTJMalVnZEMwek1DQXhOREl1TldndE1qSXhkakV3TUdneE5qWnhMVEl6SURRM0lDMDBOQ0F4TURSeExUY2dNakFnTFRFeUlEUXhMalYwTFRZZ05UVXVOWFEySURZMkxqVjBNamt1TlNBM01DNDFkRFU0TGpVZ056RnhPVGNnT0RnZ01qWXpJRGc0ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TlRBN0lpQmtQU0pOTkRBd0lETXdNR2d4TlRCeE1qRWdNQ0F5TlNBdE1URjBMVEV3SUMweU5Xd3RNak13SUMweU5UQnhMVEUwSUMweE5TQXRNelVnTFRFMWRDMHpOU0F4Tld3dE1qTXdJREkxTUhFdE1UUWdNVFFnTFRFd0lESTFkREkxSURFeGFERTFNSFk1TURCb01qQXdkaTA1TURCNlRUa3pOU0F4TVRnMGJESXpNQ0F0TWpRNWNURTBJQzB4TkNBeE1DQXRNalF1TlhRdE1qVWdMVEV3TGpWb0xURTFNSFl0T1RBd2FDMHlNREIyT1RBd2FDMHhOVEJ4TFRJeElEQWdMVEkxSURFd0xqVjBNVEFnTWpRdU5Xd3lNekFnTWpRNWNURTBJREUxSURNMUlERTFkRE0xSUMweE5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1UVXhPeUlnWkQwaVRURXdNREFnTnpBd2FDMHhNREIyTVRBd2FDMHhNREIyTFRFd01HZ3RNVEF3ZGpVd01HZ3pNREIyTFRVd01IcE5OREF3SURNd01HZ3hOVEJ4TWpFZ01DQXlOU0F0TVRGMExURXdJQzB5Tld3dE1qTXdJQzB5TlRCeExURTBJQzB4TlNBdE16VWdMVEUxZEMwek5TQXhOV3d0TWpNd0lESTFNSEV0TVRRZ01UUWdMVEV3SURJMWRESTFJREV4YURFMU1IWTVNREJvTWpBd2RpMDVNREI2VFRnd01TQXhNVEF3ZGkweU1EQm9NVEF3ZGpJd01HZ3RNVEF3ZWsweE1EQXdJRE0xTUd3dE1qQXdJQzB5TlRCb01qQXdkaTB4TURCb0xUTXdNSFl4TlRCc01qQXdJREkxTUdndE1qQXdkakV3TUdnek1EQjJMVEUxTUhvZ0lpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFMU1qc2lJR1E5SWswME1EQWdNekF3YURFMU1IRXlNU0F3SURJMUlDMHhNWFF0TVRBZ0xUSTFiQzB5TXpBZ0xUSTFNSEV0TVRRZ0xURTFJQzB6TlNBdE1UVjBMVE0xSURFMWJDMHlNekFnTWpVd2NTMHhOQ0F4TkNBdE1UQWdNalYwTWpVZ01URm9NVFV3ZGprd01HZ3lNREIyTFRrd01IcE5NVEF3TUNBeE1EVXdiQzB5TURBZ0xUSTFNR2d5TURCMkxURXdNR2d0TXpBd2RqRTFNR3d5TURBZ01qVXdhQzB5TURCMk1UQXdhRE13TUhZdE1UVXdlazB4TURBd0lEQm9MVEV3TUhZeE1EQm9MVEV3TUhZdE1UQXdhQzB4TURCMk5UQXdhRE13TUhZdE5UQXdlazA0TURFZ05EQXdkaTB5TURCb01UQXdkakl3TUdndE1UQXdlaUFpSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVFV6T3lJZ1pEMGlUVFF3TUNBek1EQm9NVFV3Y1RJeElEQWdNalVnTFRFeGRDMHhNQ0F0TWpWc0xUSXpNQ0F0TWpVd2NTMHhOQ0F0TVRVZ0xUTTFJQzB4TlhRdE16VWdNVFZzTFRJek1DQXlOVEJ4TFRFMElERTBJQzB4TUNBeU5YUXlOU0F4TVdneE5UQjJPVEF3YURJd01IWXRPVEF3ZWsweE1EQXdJRGN3TUdndE1UQXdkalF3TUdndE1UQXdkakV3TUdneU1EQjJMVFV3TUhwTk1URXdNQ0F3YUMweE1EQjJNVEF3YUMweU1EQjJOREF3YURNd01IWXROVEF3ZWswNU1ERWdOREF3ZGkweU1EQm9NVEF3ZGpJd01HZ3RNVEF3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TlRRN0lpQmtQU0pOTkRBd0lETXdNR2d4TlRCeE1qRWdNQ0F5TlNBdE1URjBMVEV3SUMweU5Xd3RNak13SUMweU5UQnhMVEUwSUMweE5TQXRNelVnTFRFMWRDMHpOU0F4Tld3dE1qTXdJREkxTUhFdE1UUWdNVFFnTFRFd0lESTFkREkxSURFeGFERTFNSFk1TURCb01qQXdkaTA1TURCNlRURXhNREFnTnpBd2FDMHhNREIyTVRBd2FDMHlNREIyTkRBd2FETXdNSFl0TlRBd2VrMDVNREVnTVRFd01IWXRNakF3YURFd01IWXlNREJvTFRFd01IcE5NVEF3TUNBd2FDMHhNREIyTkRBd2FDMHhNREIyTVRBd2FESXdNSFl0TlRBd2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE5UVTdJaUJrUFNKTk5EQXdJRE13TUdneE5UQnhNakVnTUNBeU5TQXRNVEYwTFRFd0lDMHlOV3d0TWpNd0lDMHlOVEJ4TFRFMElDMHhOU0F0TXpVZ0xURTFkQzB6TlNBeE5Xd3RNak13SURJMU1IRXRNVFFnTVRRZ0xURXdJREkxZERJMUlERXhhREUxTUhZNU1EQm9NakF3ZGkwNU1EQjZUVGt3TUNBeE1EQXdhQzB5TURCMk1qQXdhREl3TUhZdE1qQXdlazB4TURBd0lEY3dNR2d0TXpBd2RqSXdNR2d6TURCMkxUSXdNSHBOTVRFd01DQTBNREJvTFRRd01IWXlNREJvTkRBd2RpMHlNREI2VFRFeU1EQWdNVEF3YUMwMU1EQjJNakF3YURVd01IWXRNakF3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TlRZN0lpQmtQU0pOTkRBd0lETXdNR2d4TlRCeE1qRWdNQ0F5TlNBdE1URjBMVEV3SUMweU5Xd3RNak13SUMweU5UQnhMVEUwSUMweE5TQXRNelVnTFRFMWRDMHpOU0F4Tld3dE1qTXdJREkxTUhFdE1UUWdNVFFnTFRFd0lESTFkREkxSURFeGFERTFNSFk1TURCb01qQXdkaTA1TURCNlRURXlNREFnTVRBd01HZ3ROVEF3ZGpJd01HZzFNREIyTFRJd01IcE5NVEV3TUNBM01EQm9MVFF3TUhZeU1EQm9OREF3ZGkweU1EQjZUVEV3TURBZ05EQXdhQzB6TURCMk1qQXdhRE13TUhZdE1qQXdlazA1TURBZ01UQXdhQzB5TURCMk1qQXdhREl3TUhZdE1qQXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhOVGM3SWlCa1BTSk5NelV3SURFeE1EQm9OREF3Y1RFMk1pQXdJREkxTmlBdE9UTXVOWFE1TkNBdE1qVTJMalYyTFRRd01IRXdJQzB4TmpVZ0xUa3pMalVnTFRJMU55NDFkQzB5TlRZdU5TQXRPVEl1TldndE5EQXdjUzB4TmpVZ01DQXRNalUzTGpVZ09USXVOWFF0T1RJdU5TQXlOVGN1TlhZME1EQnhNQ0F4TmpVZ09USXVOU0F5TlRjdU5YUXlOVGN1TlNBNU1pNDFlazA0TURBZ09UQXdhQzAxTURCeExUUXhJREFnTFRjd0xqVWdMVEk1TGpWMExUSTVMalVnTFRjd0xqVjJMVFV3TUhFd0lDMDBNU0F5T1M0MUlDMDNNQzQxZERjd0xqVWdMVEk1TGpWb05UQXdjVFF4SURBZ056QXVOU0F5T1M0MWRESTVMalVnTnpBdU5TQjJOVEF3Y1RBZ05ERWdMVEk1TGpVZ056QXVOWFF0TnpBdU5TQXlPUzQxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TlRnN0lpQmtQU0pOTXpVd0lERXhNREJvTkRBd2NURTJOU0F3SURJMU55NDFJQzA1TWk0MWREa3lMalVnTFRJMU55NDFkaTAwTURCeE1DQXRNVFkxSUMwNU1pNDFJQzB5TlRjdU5YUXRNalUzTGpVZ0xUa3lMalZvTFRRd01IRXRNVFl6SURBZ0xUSTFOaTQxSURreUxqVjBMVGt6TGpVZ01qVTNMalYyTkRBd2NUQWdNVFl6SURrMElESTFOaTQxZERJMU5pQTVNeTQxZWswNE1EQWdPVEF3YUMwMU1EQnhMVFF4SURBZ0xUY3dMalVnTFRJNUxqVjBMVEk1TGpVZ0xUY3dMalYyTFRVd01IRXdJQzAwTVNBeU9TNDFJQzAzTUM0MWREY3dMalVnTFRJNUxqVm9OVEF3Y1RReElEQWdOekF1TlNBeU9TNDFkREk1TGpVZ056QXVOU0IyTlRBd2NUQWdOREVnTFRJNUxqVWdOekF1TlhRdE56QXVOU0F5T1M0MWVrMDBOREFnTnpjd2JESTFNeUF0TVRrd2NURTNJQzB4TWlBeE55QXRNekIwTFRFM0lDMHpNR3d0TWpVeklDMHhPVEJ4TFRFMklDMHhNaUF0TWpnZ0xUWXVOWFF0TVRJZ01qWXVOWFkwTURCeE1DQXlNU0F4TWlBeU5pNDFkREk0SUMwMkxqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpURTFPVHNpSUdROUlrMHpOVEFnTVRFd01HZzBNREJ4TVRZeklEQWdNalUyTGpVZ0xUazBkRGt6TGpVZ0xUSTFObll0TkRBd2NUQWdMVEUyTlNBdE9USXVOU0F0TWpVM0xqVjBMVEkxTnk0MUlDMDVNaTQxYUMwME1EQnhMVEUyTlNBd0lDMHlOVGN1TlNBNU1pNDFkQzA1TWk0MUlESTFOeTQxZGpRd01IRXdJREUyTXlBNU1pNDFJREkxTmk0MWRESTFOeTQxSURrekxqVjZUVGd3TUNBNU1EQm9MVFV3TUhFdE5ERWdNQ0F0TnpBdU5TQXRNamt1TlhRdE1qa3VOU0F0TnpBdU5YWXROVEF3Y1RBZ0xUUXhJREk1TGpVZ0xUY3dMalYwTnpBdU5TQXRNamt1TldnMU1EQnhOREVnTUNBM01DNDFJREk1TGpWME1qa3VOU0EzTUM0MUlIWTFNREJ4TUNBME1TQXRNamt1TlNBM01DNDFkQzAzTUM0MUlESTVMalY2VFRNMU1DQTNNREJvTkRBd2NUSXhJREFnTWpZdU5TQXRNVEowTFRZdU5TQXRNamhzTFRFNU1DQXRNalV6Y1MweE1pQXRNVGNnTFRNd0lDMHhOM1F0TXpBZ01UZHNMVEU1TUNBeU5UTnhMVEV5SURFMklDMDJMalVnTWpoME1qWXVOU0F4TW5vaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRZd095SWdaRDBpVFRNMU1DQXhNVEF3YURRd01IRXhOalVnTUNBeU5UY3VOU0F0T1RJdU5YUTVNaTQxSUMweU5UY3VOWFl0TkRBd2NUQWdMVEUyTXlBdE9USXVOU0F0TWpVMkxqVjBMVEkxTnk0MUlDMDVNeTQxYUMwME1EQnhMVEUyTXlBd0lDMHlOVFl1TlNBNU5IUXRPVE11TlNBeU5UWjJOREF3Y1RBZ01UWTFJRGt5TGpVZ01qVTNMalYwTWpVM0xqVWdPVEl1TlhwTk9EQXdJRGt3TUdndE5UQXdjUzAwTVNBd0lDMDNNQzQxSUMweU9TNDFkQzB5T1M0MUlDMDNNQzQxZGkwMU1EQnhNQ0F0TkRFZ01qa3VOU0F0TnpBdU5YUTNNQzQxSUMweU9TNDFhRFV3TUhFME1TQXdJRGN3TGpVZ01qa3VOWFF5T1M0MUlEY3dMalVnZGpVd01IRXdJRFF4SUMweU9TNDFJRGN3TGpWMExUY3dMalVnTWprdU5YcE5OVGd3SURZNU0yd3hPVEFnTFRJMU0zRXhNaUF0TVRZZ05pNDFJQzB5T0hRdE1qWXVOU0F0TVRKb0xUUXdNSEV0TWpFZ01DQXRNall1TlNBeE1uUTJMalVnTWpoc01Ua3dJREkxTTNFeE1pQXhOeUF6TUNBeE4zUXpNQ0F0TVRkNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFMk1Uc2lJR1E5SWswMU5UQWdNVEV3TUdnME1EQnhNVFkxSURBZ01qVTNMalVnTFRreUxqVjBPVEl1TlNBdE1qVTNMalYyTFRRd01IRXdJQzB4TmpVZ0xUa3lMalVnTFRJMU55NDFkQzB5TlRjdU5TQXRPVEl1TldndE5EQXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl4TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxYURRMU1IRTBNU0F3SURjd0xqVWdNamt1TlhReU9TNDFJRGN3TGpWMk5UQXdjVEFnTkRFZ0xUSTVMalVnTnpBdU5YUXROekF1TlNBeU9TNDFhQzAwTlRCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqRXdNQ0J4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazB6TXpnZ09EWTNiRE15TkNBdE1qZzBjVEUySUMweE5DQXhOaUF0TXpOMExURTJJQzB6TTJ3dE16STBJQzB5T0RSeExURTJJQzB4TkNBdE1qY2dMVGwwTFRFeElESTJkakUxTUdndE1qVXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl5TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxYURJMU1IWXhOVEJ4TUNBeU1TQXhNU0F5Tm5ReU55QXRPWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVFl5T3lJZ1pEMGlUVGM1TXlBeE1UZ3liRGtnTFRseE9DQXRNVEFnTlNBdE1qZHhMVE1nTFRFeElDMDNPU0F0TWpJMUxqVjBMVGM0SUMweU1qRXVOV3d6TURBZ01YRXlOQ0F3SURNeUxqVWdMVEUzTGpWMExUVXVOU0F0TXpVdU5YRXRNU0F3SUMweE16TXVOU0F0TVRVMWRDMHlOamNnTFRNeE1pNDFkQzB4TXpndU5TQXRNVFl5TGpWeExURXlJQzB4TlNBdE1qWWdMVEUxYUMwNWJDMDVJRGh4TFRrZ01URWdMVFFnTXpKeE1pQTVJRFF5SURFeU15NDFkRGM1SURJeU5DNDFiRE01SURFeE1HZ3RNekF5Y1MweU15QXdJQzB6TVNBeE9YRXRNVEFnTWpFZ05pQTBNWEUzTlNBNE5pQXlNRGt1TlNBeU16Y3VOU0IwTWpJNElESTFOM1E1T0M0MUlERXhNUzQxY1RrZ01UWWdNalVnTVRab09Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1UWXpPeUlnWkQwaVRUTTFNQ0F4TVRBd2FEUXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TVRBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzAwTlRCeExUUXhJREFnTFRjd0xqVWdMVEk1TGpWMExUSTVMalVnTFRjd0xqVjJMVFV3TUhFd0lDMDBNU0F5T1M0MUlDMDNNQzQxZERjd0xqVWdMVEk1TGpWb05EVXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB4TURCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVFF3TUhFdE1UWTFJREFnTFRJMU55NDFJRGt5TGpWMExUa3lMalVnTWpVM0xqVjJOREF3SUhFd0lERTJOU0E1TWk0MUlESTFOeTQxZERJMU55NDFJRGt5TGpWNlRUa3pPQ0E0Tmpkc016STBJQzB5T0RSeE1UWWdMVEUwSURFMklDMHpNM1F0TVRZZ0xUTXpiQzB6TWpRZ0xUSTROSEV0TVRZZ0xURTBJQzB5TnlBdE9YUXRNVEVnTWpaMk1UVXdhQzB5TlRCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqSXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVm9NalV3ZGpFMU1IRXdJREl4SURFeElESTJkREkzSUMwNWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE5qUTdJaUJrUFNKTk56VXdJREV5TURCb05EQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTAwTURCeE1DQXRNakVnTFRFd0xqVWdMVEkxZEMweU5DNDFJREV3YkMweE1Ea2dNVEE1YkMwek1USWdMVE14TW5FdE1UVWdMVEUxSUMwek5TNDFJQzB4TlhRdE16VXVOU0F4Tld3dE1UUXhJREUwTVhFdE1UVWdNVFVnTFRFMUlETTFMalYwTVRVZ016VXVOV3d6TVRJZ016RXliQzB4TURrZ01UQTVjUzB4TkNBeE5DQXRNVEFnTWpRdU5YUXlOU0F4TUM0MWVrMDBOVFlnT1RBd2FDMHhOVFp4TFRReElEQWdMVGN3TGpVZ0xUSTVMalYwTFRJNUxqVWdMVGN3TGpWMkxUVXdNQ0J4TUNBdE5ERWdNamt1TlNBdE56QXVOWFEzTUM0MUlDMHlPUzQxYURVd01IRTBNU0F3SURjd0xqVWdNamt1TlhReU9TNDFJRGN3TGpWMk1UUTRiREl3TUNBeU1EQjJMVEk1T0hFd0lDMHhOalVnTFRrekxqVWdMVEkxTnk0MWRDMHlOVFl1TlNBdE9USXVOV2d0TkRBd2NTMHhOalVnTUNBdE1qVTNMalVnT1RJdU5YUXRPVEl1TlNBeU5UY3VOWFkwTURCeE1DQXhOalVnT1RJdU5TQXlOVGN1TlhReU5UY3VOU0E1TWk0MWFETXdNSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVFkxT3lJZ1pEMGlUVFl3TUNBeE1UZzJjVEV4T1NBd0lESXlOeTQxSUMwME5pNDFkREU0TnlBdE1USTFkREV5TlNBdE1UZzNkRFEyTGpVZ0xUSXlOeTQxZEMwME5pNDFJQzB5TWpjdU5YUXRNVEkxSUMweE9EZDBMVEU0TnlBdE1USTFkQzB5TWpjdU5TQXRORFl1TlhRdE1qSTNMalVnTkRZdU5YUXRNVGczSURFeU5YUXRNVEkxSURFNE4zUXRORFl1TlNBeU1qY3VOWFEwTmk0MUlESXlOeTQxZERFeU5TQXhPRGQwTVRnM0lERXlOWFF5TWpjdU5TQTBOaTQxZWswMk1EQWdNVEF5TW5FdE1URTFJREFnTFRJeE1pQXROVFl1TlhRdE1UVXpMalVnTFRFMU15NDFkQzAxTmk0MUlDMHlNVEowTlRZdU5TQXRNakV5SUhReE5UTXVOU0F0TVRVekxqVjBNakV5SUMwMU5pNDFkREl4TWlBMU5pNDFkREUxTXk0MUlERTFNeTQxZERVMkxqVWdNakV5ZEMwMU5pNDFJREl4TW5RdE1UVXpMalVnTVRVekxqVjBMVEl4TWlBMU5pNDFlazAyTURBZ056azBjVGd3SURBZ01UTTNJQzAxTjNRMU55QXRNVE0zZEMwMU55QXRNVE0zZEMweE16Y2dMVFUzZEMweE16Y2dOVGQwTFRVM0lERXpOM1ExTnlBeE16ZDBNVE0zSURVM2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE5qWTdJaUJrUFNKTk5EVXdJREV5TURCb01qQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB6TlRCb01qUTFjVEl3SURBZ01qVWdMVEV4ZEMwNUlDMHlObXd0TXpneklDMDBNalp4TFRFMElDMHhOU0F0TXpNdU5TQXRNVFYwTFRNeUxqVWdNVFZzTFRNM09TQTBNalp4TFRFeklERTFJQzA0TGpVZ01qWjBNalV1TlNBeE1XZ3lOVEIyTXpVd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhwTk5UQWdNekF3YURFd01EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVEkxTUdndE1URXdNSFl5TlRCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWlCTk9UQXdJREl3TUhZdE5UQm9NVEF3ZGpVd2FDMHhNREI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEUyTnpzaUlHUTlJazAxT0RNZ01URTRNbXd6TnpnZ0xUUXpOWEV4TkNBdE1UVWdPU0F0TXpGMExUSTJJQzB4Tm1ndE1qUTBkaTB5TlRCeE1DQXRNakFnTFRFM0lDMHpOWFF0TXprZ0xURTFhQzB5TURCeExUSXdJREFnTFRNeUlERTBMalYwTFRFeUlETTFMalYyTWpVd2FDMHlOVEJ4TFRJd0lEQWdMVEkxTGpVZ01UWXVOWFE0TGpVZ016RXVOV3d6T0RNZ05ETXhjVEUwSURFMklETXpMalVnTVRkME16TXVOU0F0TVRSNlRUVXdJRE13TUdneE1EQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB5TlRCb0xURXhNREIyTWpVd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhvZ1RUa3dNQ0F5TURCMkxUVXdhREV3TUhZMU1HZ3RNVEF3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4TmpnN0lpQmtQU0pOTXprMklEY3lNMnd6TmprZ016WTVjVGNnTnlBeE55NDFJRGQwTVRjdU5TQXROMnd4TXprZ0xURXpPWEUzSUMwNElEY2dMVEU0TGpWMExUY2dMVEUzTGpWc0xUVXlOU0F0TlRJMWNTMDNJQzA0SUMweE55NDFJQzA0ZEMweE55NDFJRGhzTFRJNU1pQXlPVEZ4TFRjZ09DQXROeUF4T0hRM0lERTRiREV6T1NBeE16bHhPQ0EzSURFNExqVWdOM1F4Tnk0MUlDMDNlazAxTUNBek1EQm9NVEF3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1qVXdhQzB4TVRBd2RqSTFNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVGt3TUNBeU1EQjJMVFV3YURFd01IWTFNQ0JvTFRFd01Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1UWTVPeUlnWkQwaVRURXpOU0F4TURJemJERTBNaUF4TkRKeE1UUWdNVFFnTXpVZ01UUjBNelVnTFRFMGJEYzNJQzAzTjJ3dE1qRXlJQzB5TVRKc0xUYzNJRGMyY1MweE5DQXhOU0F0TVRRZ016WjBNVFFnTXpWNlRUWTFOU0E0TlRWc01qRXdJREl4TUhFeE5DQXhOQ0F5TkM0MUlERXdkREV3TGpVZ0xUSTFiQzB5SUMwMU9UbHhMVEVnTFRJd0lDMHhOUzQxSUMwek5YUXRNelV1TlNBdE1UVnNMVFU1TnlBdE1YRXRNakVnTUNBdE1qVWdNVEF1TlhReE1DQXlOQzQxYkRJd09DQXlNRGhzTFRFMU5DQXhOVFZzTWpFeUlESXhNbnBOTlRBZ016QXdhREV3TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpVZ2RpMHlOVEJvTFRFeE1EQjJNalV3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOT1RBd0lESXdNSFl0TlRCb01UQXdkalV3YUMweE1EQjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpURTNNRHNpSUdROUlrMHpOVEFnTVRJd01HdzFPVGtnTFRKeE1qQWdMVEVnTXpVZ0xURTFMalYwTVRVZ0xUTTFMalZzTVNBdE5UazNjVEFnTFRJeElDMHhNQzQxSUMweU5YUXRNalF1TlNBeE1Hd3RNakE0SURJd09Hd3RNVFUxSUMweE5UUnNMVEl4TWlBeU1USnNNVFUxSURFMU5Hd3RNakV3SURJeE1IRXRNVFFnTVRRZ0xURXdJREkwTGpWME1qVWdNVEF1TlhwTk5USTBJRFV4TW13dE56WWdMVGMzY1MweE5TQXRNVFFnTFRNMklDMHhOSFF0TXpVZ01UUnNMVEUwTWlBeE5ESnhMVEUwSURFMElDMHhOQ0F6TlhReE5DQXpOV3czTnlBM04zcE5OVEFnTXpBd2FERXdNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFJSFF4TkM0MUlDMHpOUzQxZGkweU5UQm9MVEV4TURCMk1qVXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5YcE5PVEF3SURJd01IWXROVEJvTVRBd2RqVXdhQzB4TURCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFM01Uc2lJR1E5SWsweE1qQXdJREV3TTJ3dE5EZ3pJREkzTm13dE16RTBJQzB6T1RsMk5ESXphQzB6T1Rsc01URTVOaUEzT1RaMkxURXdPVFo2VFRRNE15QTBNalIyTFRJek1HdzJPRE1nT1RVemVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE56STdJaUJrUFNKTk1URXdNQ0F4TURBd2RpMDROVEJ4TUNBdE1qRWdMVEUwTGpVZ0xUTTFMalYwTFRNMUxqVWdMVEUwTGpWb0xURTFNSFkwTURCb0xUY3dNSFl0TkRBd2FDMHhOVEJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFd01EQnhNQ0F5TUNBeE5DNDFJRE0xZERNMUxqVWdNVFZvTWpVd2RpMHpNREJvTlRBd2RqTXdNR2d4TURCNlRUY3dNQ0F4TURBd2FDMHhNREIyTWpBd2FERXdNSFl0TWpBd2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE56TTdJaUJrUFNKTk1URXdNQ0F4TURBd2JDMHlJQzB4TkRsc0xUSTVPU0F0TWprNWJDMDVOU0E1TlhFdE9TQTVJQzB5TVM0MUlEbDBMVEl4TGpVZ0xUbHNMVEUwT1NBdE1UUTNhQzB6TVRKMkxUUXdNR2d0TVRVd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXhNREF3Y1RBZ01qQWdNVFF1TlNBek5YUXpOUzQxSURFMWFESTFNSFl0TXpBd2FEVXdNSFl6TURCb01UQXdlazAzTURBZ01UQXdNR2d0TVRBd2RqSXdNR2d4TURCMkxUSXdNSHBOTVRFek1pQTJNemhzTVRBMklDMHhNRFp4TnlBdE55QTNJQzB4Tnk0MWRDMDNJQzB4Tnk0MWJDMDBNakFnTFRReU1YRXRPQ0F0TnlBdE1UZ2dMVGNnZEMweE9DQTNiQzB5TURJZ01qQXpjUzA0SURjZ0xUZ2dNVGN1TlhRNElERTNMalZzTVRBMklERXdObkUzSURnZ01UY3VOU0E0ZERFM0xqVWdMVGhzTnprZ0xUYzViREk1TnlBeU9UZHhOeUEzSURFM0xqVWdOM1F4Tnk0MUlDMDNlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhOelE3SWlCa1BTSk5NVEV3TUNBeE1EQXdkaTB5Tmpsc0xURXdNeUF0TVRBemJDMHhNelFnTVRNMGNTMHhOU0F4TlNBdE16TXVOU0F4Tmk0MWRDMHpOQzQxSUMweE1pNDFiQzB5TmpZZ0xUSTJObWd0TXpJNWRpMDBNREJvTFRFMU1IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNVEF3TUhFd0lESXdJREUwTGpVZ016VjBNelV1TlNBeE5XZ3lOVEIyTFRNd01HZzFNREIyTXpBd2FERXdNSHBOTnpBd0lERXdNREJvTFRFd01IWXlNREJvTVRBd2RpMHlNREI2VFRFeU1ESWdOVGN5YkRjd0lDMDNNSEV4TlNBdE1UVWdNVFVnTFRNMUxqVjBMVEUxSUMwek5TNDFiQzB4TXpFZ0xURXpNU0JzTVRNeElDMHhNekZ4TVRVZ0xURTFJREUxSUMwek5TNDFkQzB4TlNBdE16VXVOV3d0TnpBZ0xUY3djUzB4TlNBdE1UVWdMVE0xTGpVZ0xURTFkQzB6TlM0MUlERTFiQzB4TXpFZ01UTXhiQzB4TXpFZ0xURXpNWEV0TVRVZ0xURTFJQzB6TlM0MUlDMHhOWFF0TXpVdU5TQXhOV3d0TnpBZ056QnhMVEUxSURFMUlDMHhOU0F6TlM0MWRERTFJRE0xTGpWc01UTXhJREV6TVd3dE1UTXhJREV6TVhFdE1UVWdNVFVnTFRFMUlETTFMalYwTVRVZ016VXVOV3czTUNBM01IRXhOU0F4TlNBek5TNDFJREUxZERNMUxqVWdMVEUxYkRFek1TQXRNVE14YkRFek1TQXhNekZ4TVRVZ01UVWdNelV1TlNBeE5TQjBNelV1TlNBdE1UVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpURTNOVHNpSUdROUlrMHhNVEF3SURFd01EQjJMVE13TUdndE16VXdjUzB5TVNBd0lDMHpOUzQxSUMweE5DNDFkQzB4TkM0MUlDMHpOUzQxZGkweE5UQm9MVFV3TUhZdE5EQXdhQzB4TlRCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqRXdNREJ4TUNBeU1DQXhOQzQxSURNMWRETTFMalVnTVRWb01qVXdkaTB6TURCb05UQXdkak13TUdneE1EQjZUVGN3TUNBeE1EQXdhQzB4TURCMk1qQXdhREV3TUhZdE1qQXdlazA0TlRBZ05qQXdhREV3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE1qVXdhREUxTUhFeU1TQXdJREkxSUMweE1DNDFkQzB4TUNBdE1qUXVOU0JzTFRJek1DQXRNak13Y1MweE5DQXRNVFFnTFRNMUlDMHhOSFF0TXpVZ01UUnNMVEl6TUNBeU16QnhMVEUwSURFMElDMHhNQ0F5TkM0MWRESTFJREV3TGpWb01UVXdkakkxTUhFd0lESXhJREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEUzTmpzaUlHUTlJazB4TVRBd0lERXdNREIyTFRRd01Hd3RNVFkxSURFMk5YRXRNVFFnTVRVZ0xUTTFJREUxZEMwek5TQXRNVFZzTFRJMk15QXRNalkxYUMwME1ESjJMVFF3TUdndE1UVXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl4TURBd2NUQWdNakFnTVRRdU5TQXpOWFF6TlM0MUlERTFhREkxTUhZdE16QXdhRFV3TUhZek1EQm9NVEF3ZWswM01EQWdNVEF3TUdndE1UQXdkakl3TUdneE1EQjJMVEl3TUhwTk9UTTFJRFUyTld3eU16QWdMVEl5T1hFeE5DQXRNVFVnTVRBZ0xUSTFMalYwTFRJMUlDMHhNQzQxYUMweE5UQjJMVEkxTUhFd0lDMHlNQ0F0TVRRdU5TQXRNelVnZEMwek5TNDFJQzB4TldndE1UQXdjUzB5TVNBd0lDMHpOUzQxSURFMWRDMHhOQzQxSURNMWRqSTFNR2d0TVRVd2NTMHlNU0F3SUMweU5TQXhNQzQxZERFd0lESTFMalZzTWpNd0lESXlPWEV4TkNBeE5TQXpOU0F4TlhRek5TQXRNVFY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEUzTnpzaUlHUTlJazAxTUNBeE1UQXdhREV4TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxURTFNR2d0TVRJd01IWXhOVEJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazB4TWpBd0lEZ3dNSFl0TlRVd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB4TVRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTFOVEJvTVRJd01IcE5NVEF3SURVd01IWXRNakF3YURRd01IWXlNREJvTFRRd01Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1UYzRPeUlnWkQwaVRUa3pOU0F4TVRZMWJESTBPQ0F0TWpNd2NURTBJQzB4TkNBeE5DQXRNelYwTFRFMElDMHpOV3d0TWpRNElDMHlNekJ4TFRFMElDMHhOQ0F0TWpRdU5TQXRNVEIwTFRFd0xqVWdNalYyTVRVd2FDMDBNREIyTWpBd2FEUXdNSFl4TlRCeE1DQXlNU0F4TUM0MUlESTFkREkwTGpVZ0xURXdlazB5TURBZ09EQXdhQzAxTUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxZEMweE5DNDFJRE0xTGpWMk1UQXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5XZzFNSFl0TWpBd2VrMDBNREFnT0RBd2FDMHhNREIyTWpBd2FERXdNSFl0TWpBd2VrMHhPQ0EwTXpWc01qUTNJREl6TUNCeE1UUWdNVFFnTWpRdU5TQXhNSFF4TUM0MUlDMHlOWFl0TVRVd2FEUXdNSFl0TWpBd2FDMDBNREIyTFRFMU1IRXdJQzB5TVNBdE1UQXVOU0F0TWpWMExUSTBMalVnTVRCc0xUSTBOeUF5TXpCeExURTFJREUwSUMweE5TQXpOWFF4TlNBek5YcE5PVEF3SURNd01HZ3RNVEF3ZGpJd01HZ3hNREIyTFRJd01IcE5NVEF3TUNBMU1EQm9OVEZ4TWpBZ01DQXpOQzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRFd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelF1TlNBdE1UUXVOV2d0TlRGMk1qQXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXhOems3SWlCa1BTSk5PRFl5SURFd056TnNNamMySURFeE5uRXlOU0F4T0NBME15NDFJRGgwTVRndU5TQXROREYyTFRFeE1EWnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRJd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNemszY1MwMElERWdMVEV4SURWMExUSTBJREUzTGpWMExUTXdJREk1ZEMweU5DQTBNblF0TVRFZ05UWXVOWFl6TlRseE1DQXpNU0F4T0M0MUlEWTFkRFF6TGpVZ05USjZUVFUxTUNBeE1qQXdjVEl5SURBZ016UXVOU0F0TVRJdU5YUXhOQzQxSUMweU5DNDFiREVnTFRFemRpMDBOVEJ4TUNBdE1qZ2dMVEV3TGpVZ0xUVTVMalVnZEMweU5TQXROVFowTFRJNUlDMDBOWFF0TWpVdU5TQXRNekV1Tld3dE1UQWdMVEV4ZGkwME5EZHhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRJd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJORFEzY1MwMElEUWdMVEV4SURFeExqVjBMVEkwSURNd0xqVjBMVE13SURRMmRDMHlOQ0ExTlhRdE1URWdOakIyTkRVd2NUQWdNaUF3TGpVZ05TNDFkRFFnTVRKME9DNDFJREUxZERFMExqVWdNVEowTWpJdU5TQTFMalZ4TWpBZ01DQXpNaTQxSUMweE1pNDFkREUwTGpVZ0xUSTBMalZzTXlBdE1UTjJMVE0xTUdneE1EQjJNelV3ZGpVdU5YUXlMalVnTVRJZ2REY2dNVFYwTVRVZ01USjBNalV1TlNBMUxqVnhNak1nTUNBek5TNDFJQzB4TWk0MWRERXpMalVnTFRJMExqVnNNU0F0TVROMkxUTTFNR2d4TURCMk16VXdjVEFnTWlBd0xqVWdOUzQxZERNZ01USjBOeUF4TlhReE5TQXhNblF5TkM0MUlEVXVOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVGd3T3lJZ1pEMGlUVEV5TURBZ01URXdNSFl0TlRaeExUUWdNQ0F0TVRFZ0xUQXVOWFF0TWpRZ0xUTjBMVE13SUMwM0xqVjBMVEkwSUMweE5YUXRNVEVnTFRJMGRpMDRPRGh4TUNBdE1qSWdNalVnTFRNMExqVjBOVEFnTFRFekxqVnNNalVnTFRKMkxUVTJhQzAwTURCMk5UWnhOelVnTUNBNE55NDFJRFl1TlhReE1pNDFJRFF6TGpWMk16azBhQzAxTURCMkxUTTVOSEV3SUMwek55QXhNaTQxSUMwME15NDFkRGczTGpVZ0xUWXVOWFl0TlRab0xUUXdNSFkxTm5FMElEQWdNVEVnTUM0MWRESTBJRE4wTXpBZ055NDFkREkwSURFMWRERXhJREkwZGpnNE9IRXdJREl5SUMweU5TQXpOQzQxZEMwMU1DQXhNeTQxSUd3dE1qVWdNblkxTm1nME1EQjJMVFUyY1MwM05TQXdJQzA0Tnk0MUlDMDJMalYwTFRFeUxqVWdMVFF6TGpWMkxUTTVOR2cxTURCMk16azBjVEFnTXpjZ0xURXlMalVnTkRNdU5YUXRPRGN1TlNBMkxqVjJOVFpvTkRBd2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE9ERTdJaUJrUFNKTk5qYzFJREV3TURCb016YzFjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB4TlRCb0xURXdOV3d0TWprMUlDMDVPSFk1T0d3dE1qQXdJREl3TUdndE5EQXdiREV3TUNBeE1EQm9NemMxZWsweE1EQWdPVEF3YURNd01IRTBNU0F3SURjd0xqVWdMVEk1TGpWME1qa3VOU0F0TnpBdU5YWXROVEF3Y1RBZ0xUUXhJQzB5T1M0MUlDMDNNQzQxZEMwM01DNDFJQzB5T1M0MWFDMHpNREJ4TFRReElEQWdMVGN3TGpVZ01qa3VOWFF0TWprdU5TQTNNQzQxZGpVd01IRXdJRFF4SURJNUxqVWdOekF1TlhRM01DNDFJREk1TGpWNlRURXdNQ0E0TURCMkxUSXdNR2d6TURCMk1qQXdJR2d0TXpBd2VrMHhNVEF3SURVek5Xd3ROREF3SUMweE16TjJNVFl6YkRRd01DQXhNek4yTFRFMk0zcE5NVEF3SURVd01IWXRNakF3YURNd01IWXlNREJvTFRNd01IcE5NVEV3TUNBek9UaDJMVEkwT0hFd0lDMHlNU0F0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3RNemMxYkMweE1EQWdMVEV3TUdndE16YzFiQzB4TURBZ01UQXdhRFF3TUd3eU1EQWdNakF3YURFd05Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1UZ3lPeUlnWkQwaVRURTNJREV3TURkc01UWXlJREUyTW5FeE55QXhOeUEwTUNBeE5IUXpOeUF0TWpKc01UTTVJQzB4T1RSeE1UUWdMVEl3SURFeElDMDBOQzQxZEMweU1DQXROREV1Tld3dE1URTVJQzB4TVRoeE1UQXlJQzB4TkRJZ01qSTRJQzB5TmpoME1qWTNJQzB5TWpkc01URTVJREV4T0hFeE55QXhOeUEwTWk0MUlERTVkRFEwTGpVZ0xURXliREU1TWlBdE1UTTJjVEU1SUMweE5DQXlNaTQxSUMwek55NDFkQzB4TXk0MUlDMDBNQzQxYkMweE5qTWdMVEUyTW5FdE15QXRNU0F0T1M0MUlDMHhkQzB5T1M0MUlESjBMVFEzTGpVZ05uUXROakl1TlNBeE5DNDFkQzAzTnk0MUlESTJMalYwTFRrd0lEUXlMalVnZEMweE1ERXVOU0EyTUhRdE1URXhJRGd6ZEMweE1Ua2dNVEE0TGpWeExUYzBJRGMwSUMweE16TXVOU0F4TlRBdU5YUXRPVFF1TlNBeE16Z3VOWFF0TmpBZ01URTVMalYwTFRNMExqVWdNVEF3ZEMweE5TQTNOQzQxZEMwMExqVWdORGg2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEU0TXpzaUlHUTlJazAyTURBZ01URXdNSEU1TWlBd0lERTNOU0F0TVRBdU5YUXhOREV1TlNBdE1qZDBNVEE0TGpVZ0xUTTJMalYwT0RFdU5TQXROREIwTlRNdU5TQXRNemQwTXpFZ0xUSTNiRGtnTFRFd2RpMHlNREJ4TUNBdE1qRWdMVEUwTGpVZ0xUTXpkQzB6TkM0MUlDMDViQzB5TURJZ016UnhMVEl3SURNZ0xUTTBMalVnTWpCMExURTBMalVnTXpoMk1UUTJjUzB4TkRFZ01qUWdMVE13TUNBeU5IUXRNekF3SUMweU5IWXRNVFEyY1RBZ0xUSXhJQzB4TkM0MUlDMHpPSFF0TXpRdU5TQXRNakJzTFRJd01pQXRNelJ4TFRJd0lDMHpJQzB6TkM0MUlEbDBMVEUwTGpVZ016TjJNakF3Y1RNZ05DQTVMalVnTVRBdU5TQjBNekVnTWpaME5UUWdNemN1TlhRNE1DNDFJRE01TGpWME1UQTVJRE0zTGpWME1UUXhJREkyTGpWME1UYzFJREV3TGpWNlRUWXdNQ0EzT1RWeE5UWWdNQ0E1TnlBdE9TNDFkRFl3SUMweU15NDFkRE13SUMweU9IUXhNaUF0TWpSc01TQXRNVEIyTFRVd2JETTJOU0F0TXpBemNURTBJQzB4TlNBeU5DNDFJQzAwTUhReE1DNDFJQzAwTlhZdE1qRXljVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweE1UQXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl5TVRKeE1DQXlNQ0F4TUM0MUlEUTFkREkwTGpVZ05EQnNNelkxSURNd00zWTFNQ0J4TUNBMElERWdNVEF1TlhReE1pQXlNM1F6TUNBeU9YUTJNQ0F5TWk0MWREazNJREV3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4T0RRN0lpQmtQU0pOTVRFd01DQTNNREJzTFRJd01DQXRNakF3YUMwMk1EQnNMVEl3TUNBeU1EQjJOVEF3YURJd01IWXRNakF3YURJd01IWXlNREJvTWpBd2RpMHlNREJvTWpBd2RqSXdNR2d5TURCMkxUVXdNSHBOTWpVd0lEUXdNR2czTURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMExURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRFeWJERXpOeUF0TVRBd2FDMDVOVEJzTVRNM0lERXdNR2d0TVRKeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVFV3SURFd01HZ3hNVEF3Y1RJeElEQWdNelV1TlNBdE1UUXVOU0IwTVRRdU5TQXRNelV1TlhZdE5UQm9MVEV5TURCMk5UQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeE9EVTdJaUJrUFNKTk56QXdJREV4TURCb0xURXdNSEV0TkRFZ01DQXROekF1TlNBdE1qa3VOWFF0TWprdU5TQXROekF1TlhZdE1UQXdNR2d6TURCMk1UQXdNSEV3SURReElDMHlPUzQxSURjd0xqVjBMVGN3TGpVZ01qa3VOWHBOTVRFd01DQTRNREJvTFRFd01IRXROREVnTUNBdE56QXVOU0F0TWprdU5YUXRNamt1TlNBdE56QXVOWFl0TnpBd2FETXdNSFkzTURCeE1DQTBNU0F0TWprdU5TQTNNQzQxZEMwM01DNDFJREk1TGpWNlRUUXdNQ0F3YUMwek1EQjJOREF3Y1RBZ05ERWdNamt1TlNBM01DNDFkRGN3TGpVZ01qa3VOV2d4TURCeE5ERWdNQ0EzTUM0MUlDMHlPUzQxZERJNUxqVWdMVGN3TGpWMkxUUXdNSG9nSWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEU0TmpzaUlHUTlJazB5TURBZ01URXdNR2czTURCeE1USTBJREFnTWpFeUlDMDRPSFE0T0NBdE1qRXlkaTAxTURCeE1DQXRNVEkwSUMwNE9DQXRNakV5ZEMweU1USWdMVGc0YUMwM01EQnhMVEV5TkNBd0lDMHlNVElnT0RoMExUZzRJREl4TW5ZMU1EQnhNQ0F4TWpRZ09EZ2dNakV5ZERJeE1pQTRPSHBOTVRBd0lEa3dNSFl0TnpBd2FEa3dNSFkzTURCb0xUa3dNSHBOTlRBd0lEY3dNR2d0TWpBd2RpMHhNREJvTWpBd2RpMHpNREJvTFRNd01IWXhNREJvTWpBd2RqRXdNR2d0TWpBd2RqTXdNR2d6TURCMkxURXdNSHBOT1RBd0lEY3dNSFl0TXpBd2JDMHhNREFnTFRFd01HZ3RNakF3ZGpVd01HZ3lNREI2SUUwM01EQWdOekF3ZGkwek1EQm9NVEF3ZGpNd01HZ3RNVEF3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4T0RjN0lpQmtQU0pOTWpBd0lERXhNREJvTnpBd2NURXlOQ0F3SURJeE1pQXRPRGgwT0RnZ0xUSXhNbll0TlRBd2NUQWdMVEV5TkNBdE9EZ2dMVEl4TW5RdE1qRXlJQzA0T0dndE56QXdjUzB4TWpRZ01DQXRNakV5SURnNGRDMDRPQ0F5TVRKMk5UQXdjVEFnTVRJMElEZzRJREl4TW5ReU1USWdPRGg2VFRFd01DQTVNREIyTFRjd01HZzVNREIyTnpBd2FDMDVNREI2VFRVd01DQXpNREJvTFRFd01IWXlNREJvTFRFd01IWXRNakF3YUMweE1EQjJOVEF3YURFd01IWXRNakF3YURFd01IWXlNREJvTVRBd2RpMDFNREI2VFRrd01DQTNNREIyTFRNd01Hd3RNVEF3SUMweE1EQm9MVEl3TUhZMU1EQm9NakF3ZWlCTk56QXdJRGN3TUhZdE16QXdhREV3TUhZek1EQm9MVEV3TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRnNE95SWdaRDBpVFRJd01DQXhNVEF3YURjd01IRXhNalFnTUNBeU1USWdMVGc0ZERnNElDMHlNVEoyTFRVd01IRXdJQzB4TWpRZ0xUZzRJQzB5TVRKMExUSXhNaUF0T0Rob0xUY3dNSEV0TVRJMElEQWdMVEl4TWlBNE9IUXRPRGdnTWpFeWRqVXdNSEV3SURFeU5DQTRPQ0F5TVRKME1qRXlJRGc0ZWsweE1EQWdPVEF3ZGkwM01EQm9PVEF3ZGpjd01HZ3RPVEF3ZWswMU1EQWdOekF3YUMweU1EQjJMVE13TUdneU1EQjJMVEV3TUdndE16QXdkalV3TUdnek1EQjJMVEV3TUhwTk9UQXdJRGN3TUdndE1qQXdkaTB6TURCb01qQXdkaTB4TURCb0xUTXdNSFkxTURCb016QXdkaTB4TURCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFNE9Uc2lJR1E5SWsweU1EQWdNVEV3TUdnM01EQnhNVEkwSURBZ01qRXlJQzA0T0hRNE9DQXRNakV5ZGkwMU1EQnhNQ0F0TVRJMElDMDRPQ0F0TWpFeWRDMHlNVElnTFRnNGFDMDNNREJ4TFRFeU5DQXdJQzB5TVRJZ09EaDBMVGc0SURJeE1uWTFNREJ4TUNBeE1qUWdPRGdnTWpFeWRESXhNaUE0T0hwTk1UQXdJRGt3TUhZdE56QXdhRGt3TUhZM01EQm9MVGt3TUhwTk5UQXdJRFF3TUd3dE16QXdJREUxTUd3ek1EQWdNVFV3ZGkwek1EQjZUVGt3TUNBMU5UQnNMVE13TUNBdE1UVXdkak13TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRrd095SWdaRDBpVFRJd01DQXhNVEF3YURjd01IRXhNalFnTUNBeU1USWdMVGc0ZERnNElDMHlNVEoyTFRVd01IRXdJQzB4TWpRZ0xUZzRJQzB5TVRKMExUSXhNaUF0T0Rob0xUY3dNSEV0TVRJMElEQWdMVEl4TWlBNE9IUXRPRGdnTWpFeWRqVXdNSEV3SURFeU5DQTRPQ0F5TVRKME1qRXlJRGc0ZWsweE1EQWdPVEF3ZGkwM01EQm9PVEF3ZGpjd01HZ3RPVEF3ZWswNU1EQWdNekF3YUMwM01EQjJOVEF3YURjd01IWXROVEF3ZWswNE1EQWdOekF3YUMweE16QnhMVE00SURBZ0xUWTJMalVnTFRRemRDMHlPQzQxSUMweE1EaDBNamNnTFRFd04zUTJPQ0F0TkRKb01UTXdkak13TUhwTk16QXdJRGN3TUhZdE16QXdJR2d4TXpCeE5ERWdNQ0EyT0NBME1uUXlOeUF4TURkMExUSTRMalVnTVRBNGRDMDJOaTQxSURRemFDMHhNekI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEU1TVRzaUlHUTlJazB5TURBZ01URXdNR2czTURCeE1USTBJREFnTWpFeUlDMDRPSFE0T0NBdE1qRXlkaTAxTURCeE1DQXRNVEkwSUMwNE9DQXRNakV5ZEMweU1USWdMVGc0YUMwM01EQnhMVEV5TkNBd0lDMHlNVElnT0RoMExUZzRJREl4TW5ZMU1EQnhNQ0F4TWpRZ09EZ2dNakV5ZERJeE1pQTRPSHBOTVRBd0lEa3dNSFl0TnpBd2FEa3dNSFkzTURCb0xUa3dNSHBOTlRBd0lEY3dNR2d0TWpBd2RpMHhNREJvTWpBd2RpMHpNREJvTFRNd01IWXhNREJvTWpBd2RqRXdNR2d0TWpBd2RqTXdNR2d6TURCMkxURXdNSHBOT1RBd0lETXdNR2d0TVRBd2RqUXdNR2d0TVRBd2RqRXdNR2d5TURCMkxUVXdNSG9nVFRjd01DQXpNREJvTFRFd01IWXhNREJvTVRBd2RpMHhNREI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEU1TWpzaUlHUTlJazB5TURBZ01URXdNR2czTURCeE1USTBJREFnTWpFeUlDMDRPSFE0T0NBdE1qRXlkaTAxTURCeE1DQXRNVEkwSUMwNE9DQXRNakV5ZEMweU1USWdMVGc0YUMwM01EQnhMVEV5TkNBd0lDMHlNVElnT0RoMExUZzRJREl4TW5ZMU1EQnhNQ0F4TWpRZ09EZ2dNakV5ZERJeE1pQTRPSHBOTVRBd0lEa3dNSFl0TnpBd2FEa3dNSFkzTURCb0xUa3dNSHBOTXpBd0lEY3dNR2d5TURCMkxUUXdNR2d0TXpBd2RqVXdNR2d4TURCMkxURXdNSHBOT1RBd0lETXdNR2d0TVRBd2RqUXdNR2d0TVRBd2RqRXdNR2d5TURCMkxUVXdNSHBOTXpBd0lEWXdNSFl0TWpBd2FERXdNSFl5TURCb0xURXdNSG9nVFRjd01DQXpNREJvTFRFd01IWXhNREJvTVRBd2RpMHhNREI2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEU1TXpzaUlHUTlJazB5TURBZ01URXdNR2czTURCeE1USTBJREFnTWpFeUlDMDRPSFE0T0NBdE1qRXlkaTAxTURCeE1DQXRNVEkwSUMwNE9DQXRNakV5ZEMweU1USWdMVGc0YUMwM01EQnhMVEV5TkNBd0lDMHlNVElnT0RoMExUZzRJREl4TW5ZMU1EQnhNQ0F4TWpRZ09EZ2dNakV5ZERJeE1pQTRPSHBOTVRBd0lEa3dNSFl0TnpBd2FEa3dNSFkzTURCb0xUa3dNSHBOTlRBd0lEVXdNR3d0TVRrNUlDMHlNREJvTFRFd01IWTFNR3d4T1RrZ01qQXdkakUxTUdndE1qQXdkakV3TUdnek1EQjJMVE13TUhwTk9UQXdJRE13TUdndE1UQXdkalF3TUdndE1UQXdkakV3TUdneU1EQjJMVFV3TUhwTk56QXhJRE13TUdndE1UQXdJSFl4TURCb01UQXdkaTB4TURCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRFNU5Ec2lJR1E5SWswMk1EQWdNVEU1TVhFeE1qQWdNQ0F5TWprdU5TQXRORGQwTVRnNExqVWdMVEV5Tm5ReE1qWWdMVEU0T0M0MWREUTNJQzB5TWprdU5YUXRORGNnTFRJeU9TNDFkQzB4TWpZZ0xURTRPQzQxZEMweE9EZ3VOU0F0TVRJMmRDMHlNamt1TlNBdE5EZDBMVEl5T1M0MUlEUTNkQzB4T0RndU5TQXhNalowTFRFeU5pQXhPRGd1TlhRdE5EY2dNakk1TGpWME5EY2dNakk1TGpWME1USTJJREU0T0M0MWRERTRPQzQxSURFeU5uUXlNamt1TlNBME4zcE5OakF3SURFd01qRnhMVEV4TkNBd0lDMHlNVEVnTFRVMkxqVjBMVEUxTXk0MUlDMHhOVE11TlhRdE5UWXVOU0F0TWpFeGREVTJMalVnTFRJeE1TQjBNVFV6TGpVZ0xURTFNeTQxZERJeE1TQXROVFl1TlhReU1URWdOVFl1TlhReE5UTXVOU0F4TlRNdU5YUTFOaTQxSURJeE1YUXROVFl1TlNBeU1URjBMVEUxTXk0MUlERTFNeTQxZEMweU1URWdOVFl1TlhwTk9EQXdJRGN3TUdndE16QXdkaTB5TURCb016QXdkaTB4TURCb0xUTXdNR3d0TVRBd0lERXdNSFl5TURCc01UQXdJREV3TUdnek1EQjJMVEV3TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTVRrMU95SWdaRDBpVFRZd01DQXhNVGt4Y1RFeU1DQXdJREl5T1M0MUlDMDBOM1F4T0RndU5TQXRNVEkyZERFeU5pQXRNVGc0TGpWME5EY2dMVEl5T1M0MWRDMDBOeUF0TWpJNUxqVjBMVEV5TmlBdE1UZzRMalYwTFRFNE9DNDFJQzB4TWpaMExUSXlPUzQxSUMwME4zUXRNakk1TGpVZ05EZDBMVEU0T0M0MUlERXlOblF0TVRJMklERTRPQzQxZEMwME55QXlNamt1TlhRME55QXlNamt1TlhReE1qWWdNVGc0TGpWME1UZzRMalVnTVRJMmRESXlPUzQxSURRM2VrMDJNREFnTVRBeU1YRXRNVEUwSURBZ0xUSXhNU0F0TlRZdU5YUXRNVFV6TGpVZ0xURTFNeTQxZEMwMU5pNDFJQzB5TVRGME5UWXVOU0F0TWpFeElIUXhOVE11TlNBdE1UVXpMalYwTWpFeElDMDFOaTQxZERJeE1TQTFOaTQxZERFMU15NDFJREUxTXk0MWREVTJMalVnTWpFeGRDMDFOaTQxSURJeE1YUXRNVFV6TGpVZ01UVXpMalYwTFRJeE1TQTFOaTQxZWswNE1EQWdOekF3ZGkweE1EQnNMVFV3SUMwMU1Hd3hNREFnTFRFd01IWXROVEJvTFRFd01Hd3RNVEF3SURFd01HZ3RNVFV3ZGkweE1EQm9MVEV3TUhZME1EQm9NekF3ZWswMU1EQWdOekF3ZGkweE1EQm9NakF3ZGpFd01HZ3RNakF3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4T1RjN0lpQmtQU0pOTlRBeklERXdPRGx4TVRFd0lEQWdNakF3TGpVZ0xUVTVMalYwTVRNMExqVWdMVEUxTmk0MWNUUTBJREUwSURrd0lERTBjVEV5TUNBd0lESXdOU0F0T0RZdU5YUTROU0F0TWpBM2RDMDROU0F0TWpBM2RDMHlNRFVnTFRnMkxqVm9MVEV5T0hZeU5UQnhNQ0F5TVNBdE1UUXVOU0F6TlM0MWRDMHpOUzQxSURFMExqVm9MVE13TUhFdE1qRWdNQ0F0TXpVdU5TQXRNVFF1TlhRdE1UUXVOU0F0TXpVdU5YWXRNalV3YUMweU1qSnhMVGd3SURBZ0xURXpOaUExTnk0MWRDMDFOaUF4TXpZdU5YRXdJRFk1SURReklERXlNaTQxZERFd09DQTJOeTQxY1MweUlERTVJQzB5SURNM2NUQWdNVEF3SURRNUlERTROU0IwTVRNMElERXpOSFF4T0RVZ05EbDZUVFV5TlNBMU1EQm9NVFV3Y1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TWpjMWFERXpOM0V5TVNBd0lESTJJQzB4TVM0MWRDMDRJQzB5Tnk0MWJDMHlNak1nTFRJME5IRXRNVE1nTFRFMklDMHpNaUF0TVRaMExUTXlJREUyYkMweU1qTWdNalEwY1MweE15QXhOaUF0T0NBeU55NDFkREkySURFeExqVm9NVE0zZGpJM05YRXdJREV3SURjdU5TQXhOeTQxZERFM0xqVWdOeTQxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V4T1RnN0lpQmtQU0pOTlRBeUlERXdPRGx4TVRFd0lEQWdNakF4SUMwMU9TNDFkREV6TlNBdE1UVTJMalZ4TkRNZ01UVWdPRGtnTVRWeE1USXhJREFnTWpBMklDMDROaTQxZERnMklDMHlNRFl1TlhFd0lDMDVPU0F0TmpBZ0xURTRNWFF0TVRVd0lDMHhNVEJzTFRNM09DQXpOakJ4TFRFeklERTJJQzB6TVM0MUlERTJkQzB6TVM0MUlDMHhObXd0TXpneElDMHpOalZvTFRseExUYzVJREFnTFRFek5TNDFJRFUzTGpWMExUVTJMalVnTVRNMkxqVnhNQ0EyT1NBME15QXhNakl1TlhReE1EZ2dOamN1TlhFdE1pQXhPU0F0TWlBek9IRXdJREV3TUNBME9TQXhPRFF1TlhReE16TXVOU0F4TXpSME1UZzBMalVnTkRrdU5Yb2dUVFl6TWlBME5qZHNNakl6SUMweU1qaHhNVE1nTFRFMklEZ2dMVEkzTGpWMExUSTJJQzB4TVM0MWFDMHhNemQyTFRJM05YRXdJQzB4TUNBdE55NDFJQzB4Tnk0MWRDMHhOeTQxSUMwM0xqVm9MVEUxTUhFdE1UQWdNQ0F0TVRjdU5TQTNMalYwTFRjdU5TQXhOeTQxZGpJM05XZ3RNVE0zY1MweU1TQXdJQzB5TmlBeE1TNDFkRGdnTWpjdU5YRXhPVGtnTWpBMElESXlNeUF5TWpoeE1Ua2dNVGtnTXpFdU5TQXhPWFF6TWk0MUlDMHhPWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNVGs1T3lJZ1pEMGlUVGN3TUNBeE1EQjJNVEF3YURRd01Hd3RNamN3SURNd01HZ3hOekJzTFRJM01DQXpNREJvTVRjd2JDMHpNREFnTXpNemJDMHpNREFnTFRNek0yZ3hOekJzTFRJM01DQXRNekF3YURFM01Hd3RNamN3SUMwek1EQm9OREF3ZGkweE1EQm9MVFV3Y1MweU1TQXdJQzB6TlM0MUlDMHhOQzQxZEMweE5DNDFJQzB6TlM0MWRpMDFNR2cwTURCMk5UQnhNQ0F5TVNBdE1UUXVOU0F6TlM0MWRDMHpOUzQxSURFMExqVm9MVFV3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V5TURBN0lpQmtQU0pOTmpBd0lERXhOemx4T1RRZ01DQXhOamN1TlNBdE5UWXVOWFE1T1M0MUlDMHhORFV1TlhFNE9TQXROaUF4TlRBdU5TQXROekV1TlhRMk1TNDFJQzB4TlRVdU5YRXdJQzAyTVNBdE1qa3VOU0F0TVRFeUxqVjBMVGM1TGpVZ0xUZ3lMalZ4T1NBdE1qa2dPU0F0TlRWeE1DQXROelFnTFRVeUxqVWdMVEV5Tmk0MWRDMHhNall1TlNBdE5USXVOWEV0TlRVZ01DQXRNVEF3SURNd2RpMHlOVEZ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRVd2FDMHpNREIyTlRCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZGpJMU1YRXRORFVnTFRNd0lDMHhNREFnTFRNd0lIRXROelFnTUNBdE1USTJMalVnTlRJdU5YUXROVEl1TlNBeE1qWXVOWEV3SURFNElEUWdNemh4TFRRM0lESXhJQzAzTlM0MUlEWTFkQzB5T0M0MUlEazNjVEFnTnpRZ05USXVOU0F4TWpZdU5YUXhNall1TlNBMU1pNDFjVFVnTUNBeU15QXRNbkV3SURJZ0xURWdNVEIwTFRFZ01UTnhNQ0F4TVRZZ09ERXVOU0F4T1RjdU5YUXhPVGN1TlNBNE1TNDFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXlNREU3SWlCa1BTSk5NVEF4TUNBeE1ERXdjVEV4TVNBdE1URXhJREUxTUM0MUlDMHlOakF1TlhRd0lDMHlPVGwwTFRFMU1DNDFJQzB5TmpBdU5YRXRPRE1nTFRneklDMHhPVEV1TlNBdE1USTJMalYwTFRJeE9DNDFJQzAwTXk0MWRDMHlNVGd1TlNBME15NDFkQzB4T1RFdU5TQXhNall1TlhFdE1URXhJREV4TVNBdE1UVXdMalVnTWpZd0xqVjBNQ0F5T1RsME1UVXdMalVnTWpZd0xqVnhPRE1nT0RNZ01Ua3hMalVnTVRJMkxqVjBNakU0TGpVZ05ETXVOWFF5TVRndU5TQXRORE11TlhReE9URXVOU0F0TVRJMkxqVjZUVFEzTmlBeE1EWTFjUzAwSURBZ0xUZ2dMVEZ4TFRFeU1TQXRNelFnTFRJd09TNDFJQzB4TWpJdU5TQjBMVEV5TWk0MUlDMHlNRGt1TlhFdE5DQXRNVElnTWk0MUlDMHlNM1F4T0M0MUlDMHhOR3d6TmlBdE9YRXpJQzB4SURjZ0xURnhNak1nTUNBeU9TQXlNbkV5TnlBNU5pQTVPQ0F4TmpaeE56QWdOekVnTVRZMklEazRjVEV4SURNZ01UY3VOU0F4TXk0MWRETXVOU0F5TWk0MWJDMDVJRE0xY1MweklERXpJQzB4TkNBeE9YRXROeUEwSUMweE5TQTBlazAxTVRJZ09USXdjUzAwSURBZ0xUa2dMVEp4TFRnd0lDMHlOQ0F0TVRNNExqVWdMVGd5TGpWMExUZ3lMalVnTFRFek9DNDFjUzAwSUMweE15QXlJQzB5TkhReE9TQXRNVFJzTXpRZ0xUbHhOQ0F0TVNBNElDMHhjVEl5SURBZ01qZ2dNakVnY1RFNElEVTRJRFU0TGpVZ09UZ3VOWFE1Tnk0MUlEVTRMalZ4TVRJZ015QXhPQ0F4TXk0MWRETWdNakV1Tld3dE9TQXpOWEV0TXlBeE1pQXRNVFFnTVRseExUY2dOQ0F0TVRVZ05IcE5OekU1TGpVZ056RTVMalZ4TFRRNUxqVWdORGt1TlNBdE1URTVMalVnTkRrdU5YUXRNVEU1TGpVZ0xUUTVMalYwTFRRNUxqVWdMVEV4T1M0MWREUTVMalVnTFRFeE9TNDFkREV4T1M0MUlDMDBPUzQxZERFeE9TNDFJRFE1TGpWME5Ea3VOU0F4TVRrdU5YUXRORGt1TlNBeE1Ua3VOWHBOT0RVMUlEVTFNWEV0TWpJZ01DQXRNamdnTFRJeGNTMHhPQ0F0TlRnZ0xUVTRMalVnTFRrNExqVjBMVGs0TGpVZ0xUVTNMalVnY1MweE1TQXROQ0F0TVRjZ0xURTBMalYwTFRNZ0xUSXhMalZzT1NBdE16VnhNeUF0TVRJZ01UUWdMVEU1Y1RjZ0xUUWdNVFVnTFRSeE5DQXdJRGtnTW5FNE1DQXlOQ0F4TXpndU5TQTRNaTQxZERneUxqVWdNVE00TGpWeE5DQXhNeUF0TWk0MUlESTBkQzB4T0M0MUlERTBiQzB6TkNBNWNTMDBJREVnTFRnZ01YcE5NVEF3TUNBMU1UVnhMVEl6SURBZ0xUSTVJQzB5TW5FdE1qY2dMVGsySUMwNU9DQXRNVFkyY1MwM01DQXROekVnTFRFMk5pQXRPVGh4TFRFeElDMHpJQzB4Tnk0MUlDMHhNeTQxZEMwekxqVWdMVEl5TGpWc09TQXRNelZ4TXlBdE1UTWdNVFFnTFRFNWNUY2dMVFFnTVRVZ0xUUWdjVFFnTUNBNElERnhNVEl4SURNMElESXdPUzQxSURFeU1pNDFkREV5TWk0MUlESXdPUzQxY1RRZ01USWdMVEl1TlNBeU0zUXRNVGd1TlNBeE5Hd3RNellnT1hFdE15QXhJQzAzSURGNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRJd01qc2lJR1E5SWswM01EQWdPREF3YURNd01IWXRNemd3YUMweE9EQjJNakF3YUMwek5EQjJMVEl3TUdndE16Z3dkamMxTlhFd0lERXdJRGN1TlNBeE55NDFkREUzTGpVZ055NDFhRFUzTlhZdE5EQXdlazB4TURBd0lEa3dNR2d0TWpBd2RqSXdNSHBOTnpBd0lETXdNR2d4TmpKc0xUSXhNaUF0TWpFeWJDMHlNVElnTWpFeWFERTJNbll5TURCb01UQXdkaTB5TURCNlRUVXlNQ0F3YUMwek9UVnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWXpPVFY2VFRFd01EQWdNakl3ZGkweE9UVnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFhQzB4T1RWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRJd016c2lJR1E5SWswM01EQWdPREF3YURNd01IWXROVEl3YkMwek5UQWdNelV3YkMwMU5UQWdMVFUxTUhZeE1EazFjVEFnTVRBZ055NDFJREUzTGpWME1UY3VOU0EzTGpWb05UYzFkaTAwTURCNlRURXdNREFnT1RBd2FDMHlNREIyTWpBd2VrMDROaklnTWpBd2FDMHhOakoyTFRJd01HZ3RNVEF3ZGpJd01HZ3RNVFl5YkRJeE1pQXlNVEo2VFRRNE1DQXdhQzB6TlRWeExURXdJREFnTFRFM0xqVWdOeTQxZEMwM0xqVWdNVGN1TlhZMU5XZ3pPREIyTFRnd2VrMHhNREF3SURnd2RpMDFOWEV3SUMweE1DQXROeTQxSUMweE55NDFkQzB4Tnk0MUlDMDNMalZvTFRFMU5YWTRNR2d4T0RCNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRJd05Ec2lJR1E5SWsweE1UWXlJRGd3TUdndE1UWXlkaTB5TURCb01UQXdiREV3TUNBdE1UQXdhQzB6TURCMk16QXdhQzB4TmpKc01qRXlJREl4TW5wTk1qQXdJRGd3TUdneU1EQnhNamNnTUNBME1DQXRNblF5T1M0MUlDMHhNQzQxZERJekxqVWdMVE13ZERjZ0xUVTNMalZvTXpBd2RpMHhNREJvTFRZd01Hd3RNakF3SUMwek5UQjJORFV3YURFd01IRXdJRE0ySURjZ05UY3VOWFF5TXk0MUlETXdkREk1TGpVZ01UQXVOWFEwTUNBeWVrMDRNREFnTkRBd2FESTBNR3d0TWpRd0lDMDBNREJvTFRnd01Hd3pNREFnTlRBd2FEVXdNSFl0TVRBd2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeU1EVTdJaUJrUFNKTk5qVXdJREV4TURCb01UQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTAxTUdnMU1IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRNVEF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMHpNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGpFd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWb05UQjJOVEJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazB4TURBd0lEZzFNSFl4TlRCeE5ERWdNQ0EzTUM0MUlDMHlPUzQxZERJNUxqVWdMVGN3TGpWMkxUZ3dNQ0J4TUNBdE5ERWdMVEk1TGpVZ0xUY3dMalYwTFRjd0xqVWdMVEk1TGpWb0xUWXdNSEV0TVNBd0lDMHlNQ0EwYkRJME5pQXlORFpzTFRNeU5pQXpNaloyTXpJMGNUQWdOREVnTWprdU5TQTNNQzQxZERjd0xqVWdNamt1TlhZdE1UVXdjVEFnTFRZeUlEUTBJQzB4TURaME1UQTJJQzAwTkdnek1EQnhOaklnTUNBeE1EWWdORFIwTkRRZ01UQTJlazAwTVRJZ01qVXdiQzB5TVRJZ0xUSXhNbll4TmpKb0xUSXdNSFl4TURCb01qQXdkakUyTW5vaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpBMk95SWdaRDBpVFRRMU1DQXhNVEF3YURFd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXROVEJvTlRCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxURXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE16QXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl4TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxYURVd2RqVXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5YcE5PREF3SURnMU1IWXhOVEJ4TkRFZ01DQTNNQzQxSUMweU9TNDFkREk1TGpVZ0xUY3dMalYyTFRVd01DQm9MVEl3TUhZdE16QXdhREl3TUhFd0lDMHpOaUF0TnlBdE5UY3VOWFF0TWpNdU5TQXRNekIwTFRJNUxqVWdMVEV3TGpWMExUUXdJQzB5YUMwMk1EQnhMVFF4SURBZ0xUY3dMalVnTWprdU5YUXRNamt1TlNBM01DNDFkamd3TUhFd0lEUXhJREk1TGpVZ056QXVOWFEzTUM0MUlESTVMalYyTFRFMU1IRXdJQzAyTWlBME5DQXRNVEEyZERFd05pQXRORFJvTXpBd2NUWXlJREFnTVRBMklEUTBkRFEwSURFd05ucE5NVEl4TWlBeU5UQnNMVEl4TWlBdE1qRXlkakUyTW1ndE1qQXdkakV3TUdneU1EQjJNVFl5ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V5TURrN0lpQmtQU0pOTmpVNElERXhPVGRzTmpNM0lDMHhNVEEwY1RJeklDMHpPQ0EzSUMwMk5TNDFkQzAyTUNBdE1qY3VOV2d0TVRJM05uRXRORFFnTUNBdE5qQWdNamN1TlhRM0lEWTFMalZzTmpNM0lERXhNRFJ4TWpJZ016a2dOVFFnTXpsME5UUWdMVE01ZWswM01EUWdPREF3YUMweU1EaHhMVEl3SURBZ0xUTXlJQzB4TkM0MWRDMDRJQzB6TkM0MWJEVTRJQzB6TURKeE5DQXRNakFnTWpFdU5TQXRNelF1TlhRek55NDFJQzB4TkM0MWFEVTBjVEl3SURBZ016Y3VOU0F4TkM0MWRESXhMalVnTXpRdU5XdzFPQ0F6TURKeE5DQXlNQ0F0T0NBek5DNDFkQzB6TWlBeE5DNDFlazAxTURBZ016QXdkaTB4TURCb01qQXdJSFl4TURCb0xUSXdNSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNakV3T3lJZ1pEMGlUVFF5TlNBeE1UQXdhREkxTUhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRFMU1IRXdJQzB4TUNBdE55NDFJQzB4Tnk0MWRDMHhOeTQxSUMwM0xqVm9MVEkxTUhFdE1UQWdNQ0F0TVRjdU5TQTNMalYwTFRjdU5TQXhOeTQxZGpFMU1IRXdJREV3SURjdU5TQXhOeTQxZERFM0xqVWdOeTQxZWswME1qVWdPREF3YURJMU1IRXhNQ0F3SURFM0xqVWdMVGN1TlhRM0xqVWdMVEUzTGpWMkxURTFNSEV3SUMweE1DQXROeTQxSUMweE55NDFkQzB4Tnk0MUlDMDNMalZvTFRJMU1IRXRNVEFnTUNBdE1UY3VOU0EzTGpWMExUY3VOU0F4Tnk0MWRqRTFNSEV3SURFd0lEY3VOU0F4Tnk0MUlIUXhOeTQxSURjdU5YcE5PREkxSURnd01HZ3lOVEJ4TVRBZ01DQXhOeTQxSUMwM0xqVjBOeTQxSUMweE55NDFkaTB4TlRCeE1DQXRNVEFnTFRjdU5TQXRNVGN1TlhRdE1UY3VOU0F0Tnk0MWFDMHlOVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFl4TlRCeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOWHBOTWpVZ05UQXdhREkxTUhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRFMU1IRXdJQzB4TUNBdE55NDFJQzB4Tnk0MWRDMHhOeTQxSUMwM0xqVm9MVEkxTUhFdE1UQWdNQ0F0TVRjdU5TQTNMalYwTFRjdU5TQXhOeTQxZGpFMU1DQnhNQ0F4TUNBM0xqVWdNVGN1TlhReE55NDFJRGN1TlhwTk5ESTFJRFV3TUdneU5UQnhNVEFnTUNBeE55NDFJQzAzTGpWME55NDFJQzB4Tnk0MWRpMHhOVEJ4TUNBdE1UQWdMVGN1TlNBdE1UY3VOWFF0TVRjdU5TQXROeTQxYUMweU5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWXhOVEJ4TUNBeE1DQTNMalVnTVRjdU5YUXhOeTQxSURjdU5YcE5PREkxSURVd01HZ3lOVEJ4TVRBZ01DQXhOeTQxSUMwM0xqVjBOeTQxSUMweE55NDFkaTB4TlRCeE1DQXRNVEFnTFRjdU5TQXRNVGN1TlhRdE1UY3VOU0F0Tnk0MWFDMHlOVEJ4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOU0IyTVRVd2NUQWdNVEFnTnk0MUlERTNMalYwTVRjdU5TQTNMalY2VFRJMUlESXdNR2d5TlRCeE1UQWdNQ0F4Tnk0MUlDMDNMalYwTnk0MUlDMHhOeTQxZGkweE5UQnhNQ0F0TVRBZ0xUY3VOU0F0TVRjdU5YUXRNVGN1TlNBdE55NDFhQzB5TlRCeExURXdJREFnTFRFM0xqVWdOeTQxZEMwM0xqVWdNVGN1TlhZeE5UQnhNQ0F4TUNBM0xqVWdNVGN1TlhReE55NDFJRGN1TlhwTk5ESTFJREl3TUdneU5UQnhNVEFnTUNBeE55NDFJQzAzTGpWME55NDFJQzB4Tnk0MWRpMHhOVEJ4TUNBdE1UQWdMVGN1TlNBdE1UY3VOWFF0TVRjdU5TQXROeTQxYUMweU5UQnhMVEV3SURBZ0xURTNMalVnTnk0MUlIUXROeTQxSURFM0xqVjJNVFV3Y1RBZ01UQWdOeTQxSURFM0xqVjBNVGN1TlNBM0xqVjZUVGd5TlNBeU1EQm9NalV3Y1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TVRVd2NUQWdMVEV3SUMwM0xqVWdMVEUzTGpWMExURTNMalVnTFRjdU5XZ3RNalV3Y1MweE1DQXdJQzB4Tnk0MUlEY3VOWFF0Tnk0MUlERTNMalYyTVRVd2NUQWdNVEFnTnk0MUlERTNMalYwTVRjdU5TQTNMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEl4TVRzaUlHUTlJazAzTURBZ01USXdNR2d4TURCMkxUSXdNR2d0TVRBd2RpMHhNREJvTXpVd2NUWXlJREFnT0RZdU5TQXRNemt1TlhRdE15NDFJQzA1TkM0MWJDMDJOaUF0TVRNeWNTMDBNU0F0T0RNZ0xUZ3hJQzB4TXpSb0xUYzNNbkV0TkRBZ05URWdMVGd4SURFek5Hd3ROallnTVRNeWNTMHlPQ0ExTlNBdE15NDFJRGswTGpWME9EWXVOU0F6T1M0MWFETTFNSFl4TURCb0xURXdNSFl5TURCb01UQXdkakV3TUdneU1EQjJMVEV3TUhwTk1qVXdJRFF3TUdnM01EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjBMVEUwTGpVZ0xUTTFMalYwTFRNMUxqVWdMVEUwTGpWb0xURXliREV6TnlBdE1UQXdJR2d0T1RVd2JERXpPQ0F4TURCb0xURXpjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFF4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWswMU1DQXhNREJvTVRFd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXROVEJvTFRFeU1EQjJOVEJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXlNVEk3SWlCa1BTSk5OakF3SURFek1EQnhOREFnTUNBMk9DNDFJQzB5T1M0MWRESTRMalVnTFRjd0xqVm9MVEU1TkhFd0lEUXhJREk0TGpVZ056QXVOWFEyT0M0MUlESTVMalY2VFRRME15QXhNVEF3YURNeE5IRXhPQ0F0TXpjZ01UZ2dMVGMxY1RBZ0xUZ2dMVE1nTFRJMWFETXlPSEUwTVNBd0lEUTBMalVnTFRFMkxqVjBMVE13TGpVZ0xUTTRMalZzTFRFM05TQXRNVFExYUMwMk56aHNMVEUzT0NBeE5EVnhMVE0wSURJeUlDMHlPU0F6T0M0MWREUTJJREUyTGpWb016STRjUzB6SURFM0lDMHpJREkxY1RBZ016Z2dNVGdnTnpWNlRUSTFNQ0EzTURCb056QXdjVEl4SURBZ016VXVOU0F0TVRRdU5TQjBNVFF1TlNBdE16VXVOWFF0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3RNVFV3ZGkweU1EQnNNamMxSUMweU1EQm9MVGsxTUd3eU56VWdNakF3ZGpJd01HZ3RNVFV3Y1MweU1TQXdJQzB6TlM0MUlERTBMalYwTFRFMExqVWdNelV1TlhReE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMDFNQ0F4TURCb01URXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TlRCb0xURXlNREIyTlRCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V5TVRNN0lpQmtQU0pOTmpBd0lERXhPREZ4TnpVZ01DQXhNamdnTFRVemREVXpJQzB4TWpoMExUVXpJQzB4TWpoMExURXlPQ0F0TlROMExURXlPQ0ExTTNRdE5UTWdNVEk0ZERVeklERXlPSFF4TWpnZ05UTjZUVFl3TWlBM09UaG9ORFp4TXpRZ01DQTFOUzQxSUMweU9DNDFkREl4TGpVZ0xUZzJMalZ4TUNBdE56WWdNemtnTFRFNE0yZ3RNekkwY1RNNUlERXdOeUF6T1NBeE9ETnhNQ0ExT0NBeU1TNDFJRGcyTGpWME5UWXVOU0F5T0M0MWFEUTFlazB5TlRBZ05EQXdhRGN3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhRdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TVRNZ2JERXpPQ0F0TVRBd2FDMDVOVEJzTVRNM0lERXdNR2d0TVRKeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVFV3SURFd01HZ3hNVEF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkwMU1HZ3RNVEl3TUhZMU1IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRJeE5Ec2lJR1E5SWswMk1EQWdNVE13TUhFME55QXdJRGt5TGpVZ0xUVXpMalYwTnpFZ0xURXlNM1F5TlM0MUlDMHhNak11TlhFd0lDMDNPQ0F0TlRVdU5TQXRNVE16TGpWMExURXpNeTQxSUMwMU5TNDFkQzB4TXpNdU5TQTFOUzQxZEMwMU5TNDFJREV6TXk0MWNUQWdOaklnTXpRZ01UUXpiREUwTkNBdE1UUXpiREV4TVNBeE1URnNMVEUyTXlBeE5qTnhNelFnTWpZZ05qTWdNalo2VFRZd01pQTNPVGhvTkRaeE16UWdNQ0ExTlM0MUlDMHlPQzQxZERJeExqVWdMVGcyTGpWeE1DQXROellnTXprZ0xURTRNMmd0TXpJMGNUTTVJREV3TnlBek9TQXhPRE54TUNBMU9DQXlNUzQxSURnMkxqVjBOVFl1TlNBeU9DNDFhRFExSUhwTk1qVXdJRFF3TUdnM01EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjBMVEUwTGpVZ0xUTTFMalYwTFRNMUxqVWdMVEUwTGpWb0xURXpiREV6T0NBdE1UQXdhQzA1TlRCc01UTTNJREV3TUdndE1USnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRVd0lERXdNR2d4TVRBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMDFNR2d0TVRJd01IWTFNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUSXhOVHNpSUdROUlrMDJNREFnTVRJd01Hd3pNREFnTFRFMk1YWXRNVE01YUMwek1EQnhNQ0F0TlRjZ01UZ3VOU0F0TVRBNGREVXdJQzA1TVM0MWREWXpJQzAzTW5RM01DQXROamN1TlhRMU55NDFJQzAyTVdndE5UTXdjUzAyTUNBNE15QXRPVEF1TlNBeE56Y3VOWFF0TXpBdU5TQXhOemd1TlhRek15QXhOalF1TlhRNE55NDFJREV6T1M0MWRERXlOaUE1Tmk0MWRERTBOUzQxSURReExqVjJMVGs0ZWsweU5UQWdOREF3YURjd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YUXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE1UTnNNVE00SUMweE1EQm9MVGsxTUd3eE16Y2dNVEF3SUdndE1USnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2VFRVd0lERXdNR2d4TVRBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMDFNR2d0TVRJd01IWTFNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUSXhOanNpSUdROUlrMDJNREFnTVRNd01IRTBNU0F3SURjd0xqVWdMVEk1TGpWME1qa3VOU0F0TnpBdU5YWXROemh4TkRZZ0xUSTJJRGN6SUMwM01uUXlOeUF0TVRBd2RpMDFNR2d0TkRBd2RqVXdjVEFnTlRRZ01qY2dNVEF3ZERjeklEY3lkamM0Y1RBZ05ERWdNamt1TlNBM01DNDFkRGN3TGpVZ01qa3VOWHBOTkRBd0lEZ3dNR2cwTURCeE5UUWdNQ0F4TURBZ0xUSTNkRGN5SUMwM00yZ3RNVGN5ZGkweE1EQm9NakF3ZGkweE1EQm9MVEl3TUhZdE1UQXdhREl3TUhZdE1UQXdhQzB5TURCMkxURXdNR2d5TURCeE1DQXRPRE1nTFRVNExqVWdMVEUwTVM0MWRDMHhOREV1TlNBdE5UZ3VOV2d0TkRBd0lIRXRPRE1nTUNBdE1UUXhMalVnTlRndU5YUXROVGd1TlNBeE5ERXVOWFkwTURCeE1DQTRNeUExT0M0MUlERTBNUzQxZERFME1TNDFJRFU0TGpWNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRJeE9Ec2lJR1E5SWsweE5UQWdNVEV3TUdnNU1EQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVFV3TUhFd0lDMHlNU0F0TVRRdU5TQXRNelV1TlhRdE16VXVOU0F0TVRRdU5XZ3RPVEF3Y1MweU1TQXdJQzB6TlM0MUlERTBMalYwTFRFMExqVWdNelV1TlhZMU1EQnhNQ0F5TVNBeE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWVrMHhNalVnTkRBd2FEazFNSEV4TUNBd0lERTNMalVnTFRjdU5YUTNMalVnTFRFM0xqVjJMVFV3Y1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE1qZ3piREl5TkNBdE1qSTBjVEV6SUMweE15QXhNeUF0TXpFdU5YUXRNVE1nTFRNeUlIUXRNekV1TlNBdE1UTXVOWFF0TXpFdU5TQXhNMnd0T0RnZ09EaG9MVFV5Tkd3dE9EY2dMVGc0Y1MweE15QXRNVE1nTFRNeUlDMHhNM1F0TXpJZ01UTXVOWFF0TVRNZ016SjBNVE1nTXpFdU5Xd3lNalFnTWpJMGFDMHlPRGx4TFRFd0lEQWdMVEUzTGpVZ055NDFkQzAzTGpVZ01UY3VOWFkxTUhFd0lERXdJRGN1TlNBeE55NDFkREUzTGpVZ055NDFlazAxTkRFZ016QXdiQzB4TURBZ0xURXdNR2d6TWpSc0xURXdNQ0F4TURCb0xURXlOSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNakU1T3lJZ1pEMGlUVEl3TUNBeE1UQXdhRGd3TUhFNE15QXdJREUwTVM0MUlDMDFPQzQxZERVNExqVWdMVEUwTVM0MWRpMHlNREJvTFRFd01IRXdJRFF4SUMweU9TNDFJRGN3TGpWMExUY3dMalVnTWprdU5XZ3RNalV3Y1MwME1TQXdJQzAzTUM0MUlDMHlPUzQxZEMweU9TNDFJQzAzTUM0MWFDMHhNREJ4TUNBME1TQXRNamt1TlNBM01DNDFkQzAzTUM0MUlESTVMalZvTFRJMU1IRXROREVnTUNBdE56QXVOU0F0TWprdU5YUXRNamt1TlNBdE56QXVOV2d0TVRBd2RqSXdNSEV3SURneklEVTRMalVnTVRReExqVjBNVFF4TGpVZ05UZ3VOWHBOTVRBd0lEWXdNR2d4TURBd2NUUXhJREFnTnpBdU5TQXRNamt1TlNCME1qa3VOU0F0TnpBdU5YWXRNekF3YUMweE1qQXdkak13TUhFd0lEUXhJREk1TGpVZ056QXVOWFEzTUM0MUlESTVMalY2VFRNd01DQXhNREIyTFRVd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB4TURCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqVXdhREl3TUhwTk1URXdNQ0F4TURCMkxUVXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMweE1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkalV3YURJd01Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1qSXhPeUlnWkQwaVRUUTRNQ0F4TVRZMWJEWTRNaUF0TmpnemNUTXhJQzB6TVNBek1TQXROelV1TlhRdE16RWdMVGMxTGpWc0xURXpNU0F0TVRNeGFDMDBPREZzTFRVeE55QTFNVGh4TFRNeUlETXhJQzB6TWlBM05TNDFkRE15SURjMUxqVnNNamsxSURJNU5uRXpNU0F6TVNBM05TNDFJRE14ZERjMkxqVWdMVE14ZWsweE1EZ2dOemswYkRNME1pQXRNelF5YkRNd015QXpNRFJzTFRNME1TQXpOREY2VFRJMU1DQXhNREJvT0RBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMDFNR2d0T1RBd2RqVXdjVEFnTWpFZ01UUXVOU0F6TlM0MWRETTFMalVnTVRRdU5Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1qSXpPeUlnWkQwaVRURXdOVGNnTmpRM2JDMHhPRGtnTlRBMmNTMDRJREU1SUMweU55NDFJRE16ZEMwME1DNDFJREUwYUMwME1EQnhMVEl4SURBZ0xUUXdMalVnTFRFMGRDMHlOeTQxSUMwek0yd3RNVGc1SUMwMU1EWnhMVGdnTFRFNUlERXVOU0F0TXpOME16QXVOU0F0TVRSb05qSTFkaTB4TlRCeE1DQXRNakVnTVRRdU5TQXRNelV1TlhRek5TNDFJQzB4TkM0MWRETTFMalVnTVRRdU5YUXhOQzQxSURNMUxqVjJNVFV3YURFeU5YRXlNU0F3SURNd0xqVWdNVFIwTVM0MUlETXplazA0T1RjZ01HZ3ROVGsxZGpVd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TldnMU1IWTFNQ0J4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFhRFE0ZGpNd01HZ3lNREIyTFRNd01HZzBOM0V5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TlRCb05UQnhNakVnTUNBek5TNDFJQzB4TkM0MWRERTBMalVnTFRNMUxqVjJMVFV3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V5TWpRN0lpQmtQU0pOT1RBd0lEZ3dNR2d6TURCMkxUVTNOWEV3SUMweE1DQXROeTQxSUMweE55NDFkQzB4Tnk0MUlDMDNMalZvTFRNM05YWTFPVEZzTFRNd01DQXpNREIyT0RSeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOV2d6TnpWMkxUUXdNSHBOTVRJd01DQTVNREJvTFRJd01IWXlNREI2VFRRd01DQTJNREJvTXpBd2RpMDFOelZ4TUNBdE1UQWdMVGN1TlNBdE1UY3VOWFF0TVRjdU5TQXROeTQxYUMwMk5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWTVOVEJ4TUNBeE1DQTNMalVnTVRjdU5YUXhOeTQxSURjdU5XZ3pOelYyTFRRd01IcE5OekF3SURjd01HZ3RNakF3ZGpJd01Ib2dJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUSXlOVHNpSUdROUlrMDBPRFFnTVRBNU5XZ3hPVFZ4TnpVZ01DQXhORFlnTFRNeUxqVjBNVEkwSUMwNE5uUTRPUzQxSUMweE1qSXVOWFEwT0M0MUlDMHhOREp4TVRnZ0xURTBJRE0xSUMweU1IRXpNU0F0TVRBZ05qUXVOU0EyTGpWME5ETXVOU0EwT0M0MWNURXdJRE0wSUMweE5TQTNNWEV0TVRrZ01qY2dMVGtnTkROeE5TQTRJREV5TGpVZ01URjBNVGtnTFRGME1qTXVOU0F0TVRaeE5ERWdMVFEwSURNNUlDMHhNRFZ4TFRNZ0xUWXpJQzAwTmlBdE1UQTJMalYwTFRFd05DQXRORE11TldndE5qSnhMVGNnTFRVMUlDMHpOU0F0TVRFM2RDMDFOaUF0TVRBd2JDMHpPU0F0TWpNMGNTMHpJQzB5TUNBdE1qQWdMVE0wTGpVZ2RDMHpPQ0F0TVRRdU5XZ3RNVEF3Y1MweU1TQXdJQzB6TXlBeE5DNDFkQzA1SURNMExqVnNNVElnTnpCeExUUTVJQzB4TkNBdE9URWdMVEUwYUMweE9UVnhMVEkwSURBZ0xUWTFJRGhzTFRFeElDMDJOSEV0TXlBdE1qQWdMVEl3SUMwek5DNDFkQzB6T0NBdE1UUXVOV2d0TVRBd2NTMHlNU0F3SUMwek15QXhOQzQxZEMwNUlETTBMalZzTWpZZ01UVTNjUzA0TkNBM05DQXRNVEk0SURFM05Xd3RNVFU1SURVemNTMHhPU0EzSUMwek15QXlOblF0TVRRZ05EQjJOVEJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFhREV5TkhFeE1TQTROeUExTmlBeE5qWnNMVEV4TVNBNU5TQnhMVEUySURFMElDMHhNaTQxSURJekxqVjBNalF1TlNBNUxqVm9NakF6Y1RFeE5pQXhNREVnTWpVd0lERXdNWHBOTmpjMUlERXdNREJvTFRJMU1IRXRNVEFnTUNBdE1UY3VOU0F0Tnk0MWRDMDNMalVnTFRFM0xqVjJMVFV3Y1RBZ0xURXdJRGN1TlNBdE1UY3VOWFF4Tnk0MUlDMDNMalZvTWpVd2NURXdJREFnTVRjdU5TQTNMalYwTnk0MUlERTNMalYyTlRCeE1DQXhNQ0F0Tnk0MUlERTNMalYwTFRFM0xqVWdOeTQxZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V5TWpZN0lpQmtQU0pOTmpReElEa3dNR3cwTWpNZ01qUTNjVEU1SURnZ05ESWdNaTQxZERNM0lDMHlNUzQxYkRNeUlDMHpPSEV4TkNBdE1UVWdNVEl1TlNBdE16WjBMVEUzTGpVZ0xUTTBiQzB4TXprZ0xURXlNR2d0TXprd2VrMDFNQ0F4TVRBd2FERXdObkUyTnlBd0lERXdNeUF0TVRkME5qWWdMVGN4YkRFd01pQXRNakV5YURneU0zRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXROVEJ4TUNBdE1qRWdMVEUwSUMwME1IUXRNek1nTFRJMmJDMDNNemNnTFRFek1uRXRNak1nTFRRZ0xUUXdJRFowTFRJMklESTFjUzAwTWlBMk55QXRNVEF3SURZM2FDMHpNREJ4TFRZeUlEQWdMVEV3TmlBME5DQjBMVFEwSURFd05uWXlNREJ4TUNBMk1pQTBOQ0F4TURaME1UQTJJRFEwZWsweE56TWdPVEk0YUMwNE1IRXRNVGtnTUNBdE1qZ2dMVEUwZEMwNUlDMHpOWFl0TlRaeE1DQXROVEVnTkRJZ0xUVXhhREV6TkhFeE5pQXdJREl4TGpVZ09IUTFMalVnTWpSeE1DQXhNU0F0TVRZZ05EVjBMVEkzSURVeGNTMHhPQ0F5T0NBdE5ETWdNamg2VFRVMU1DQTNNamR4TFRNeUlEQWdMVFUwTGpVZ0xUSXlMalYwTFRJeUxqVWdMVFUwTGpWME1qSXVOU0F0TlRRdU5YUTFOQzQxSUMweU1pNDFkRFUwTGpVZ01qSXVOWFF5TWk0MUlEVTBMalYwTFRJeUxqVWdOVFF1TlhRdE5UUXVOU0F5TWk0MWVrMHhNekFnTXpnNUlHd3hOVElnTVRNd2NURTRJREU1SURNMElESTBkRE14SUMwekxqVjBNalF1TlNBdE1UY3VOWFF5TlM0MUlDMHlPSEV5T0NBdE16VWdOVEF1TlNBdE5URjBORGd1TlNBdE1UTnNOak1nTld3ME9DQXRNVGM1Y1RFeklDMDJNU0F0TXk0MUlDMDVOeTQxZEMwMk55NDFJQzAzT1M0MWJDMDRNQ0F0TmpseExUUTNJQzAwTUNBdE1UQTVJQzB6TlM0MWRDMHhNRE1nTlRFdU5Xd3RNVE13SURFMU1YRXROREFnTkRjZ0xUTTFMalVnTVRBNUxqVjBOVEV1TlNBeE1ESXVOWHBOTXpnd0lETTNOMnd0TVRBeUlDMDRPSEV0TXpFZ0xUSTNJRElnTFRZMWJETTNJQzAwTTNFeE15QXRNVFVnTWpjdU5TQXRNVGt1TlNCME16RXVOU0EyTGpWc05qRWdOVE54TVRrZ01UWWdNVFFnTkRseExUSWdNakFnTFRFeUlEVTJkQzB4TnlBME5YRXRNVEVnTVRJZ0xURTVJREUwZEMweU15QXRPSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNakkzT3lJZ1pEMGlUVFl5TlNBeE1qQXdhREUxTUhFeE1DQXdJREUzTGpVZ0xUY3VOWFEzTGpVZ0xURTNMalYyTFRFd09YRTNPU0F0TXpNZ01UTXhJQzA0Tnk0MWREVXpJQzB4TWpndU5YRXhJQzAwTmlBdE1UVWdMVGcwTGpWMExUTTVJQzAyTVhRdE5EWWdMVE00ZEMwek9TQXRNakV1Tld3dE1UY2dMVFp4TmlBd0lERTFJQzB4TGpWME16VWdMVGwwTlRBZ0xURTNMalYwTlRNZ0xUTXdkRFV3SUMwME5YUXpOUzQxSUMwMk5IUXhOQzQxSUMwNE5IRXdJQzAxT1NBdE1URXVOU0F0TVRBMUxqVjBMVEk0TGpVZ0xUYzJMalYwTFRRMElDMDFNWFF0TkRrdU5TQXRNekV1TlhRdE5UUXVOU0F0TVRaMExUUTVMalVnTFRZdU5TQjBMVFF6TGpVZ0xURjJMVGMxY1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE1UVXdjUzB4TUNBd0lDMHhOeTQxSURjdU5YUXROeTQxSURFM0xqVjJOelZvTFRFd01IWXROelZ4TUNBdE1UQWdMVGN1TlNBdE1UY3VOWFF0TVRjdU5TQXROeTQxYUMweE5UQnhMVEV3SURBZ0xURTNMalVnTnk0MWRDMDNMalVnTVRjdU5YWTNOV2d0TVRjMWNTMHhNQ0F3SUMweE55NDFJRGN1TlhRdE55NDFJREUzTGpWMk1UVXdjVEFnTVRBZ055NDFJREUzTGpWME1UY3VOU0EzTGpWb056VjJOakF3YUMwM05YRXRNVEFnTUNBdE1UY3VOU0EzTGpWMExUY3VOU0F4Tnk0MWRqRTFNQ0J4TUNBeE1DQTNMalVnTVRjdU5YUXhOeTQxSURjdU5XZ3hOelYyTnpWeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOV2d4TlRCeE1UQWdNQ0F4Tnk0MUlDMDNMalYwTnk0MUlDMHhOeTQxZGkwM05XZ3hNREIyTnpWeE1DQXhNQ0EzTGpVZ01UY3VOWFF4Tnk0MUlEY3VOWHBOTkRBd0lEa3dNSFl0TWpBd2FESTJNM0V5T0NBd0lEUTRMalVnTVRBdU5YUXpNQ0F5TlhReE5TQXlPWFExTGpVZ01qVXVOV3d4SURFd2NUQWdOQ0F0TUM0MUlERXhkQzAySURJMGRDMHhOU0F6TUhRdE16QWdNalIwTFRRNExqVWdNVEZvTFRJMk0zcE5OREF3SURVd01IWXRNakF3YURNMk0zRXlPQ0F3SURRNExqVWdNVEF1TlNCME16QWdNalYwTVRVZ01qbDBOUzQxSURJMUxqVnNNU0F4TUhFd0lEUWdMVEF1TlNBeE1YUXROaUF5TkhRdE1UVWdNekIwTFRNd0lESTBkQzAwT0M0MUlERXhhQzB6TmpONklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRJek1Ec2lJR1E5SWsweU1USWdNVEU1T0dnM09EQnhPRFlnTUNBeE5EY2dMVFl4ZERZeElDMHhORGQyTFRReE5uRXdJQzAxTVNBdE1UZ2dMVEUwTWk0MWRDMHpOaUF0TVRVM0xqVnNMVEU0SUMwMk5uRXRNamtnTFRnM0lDMDVNeTQxSUMweE5EWXVOWFF0TVRRMkxqVWdMVFU1TGpWb0xUVTNNbkV0T0RJZ01DQXRNVFEzSURVNWRDMDVNeUF4TkRkeExUZ2dNamdnTFRJd0lEY3pkQzB6TWlBeE5ETXVOWFF0TWpBZ01UUTVMalYyTkRFMmNUQWdPRFlnTmpFZ01UUTNkREUwTnlBMk1YcE5OakF3SURFd05EVnhMVGN3SURBZ0xURXpNaTQxSUMweE1TNDFkQzB4TURVdU5TQXRNekF1TlhRdE56Z3VOU0F0TkRFdU5TQjBMVFUzSUMwME5YUXRNellnTFRReGRDMHlNQzQxSUMwek1DNDFiQzAySUMweE1td3hOVFlnTFRJME0yZzFOakJzTVRVMklESTBNM0V0TWlBMUlDMDJJREV5TGpWMExUSXdJREk1TGpWMExUTTJMalVnTkRKMExUVTNJRFEwTGpWMExUYzVJRFF5ZEMweE1EVWdNamt1TlhRdE1UTXlMalVnTVRKNlRUYzJNaUEzTUROb0xURTFOMnd4T1RVZ01qWXhlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXlNekU3SWlCa1BTSk5ORGMxSURFek1EQm9NVFV3Y1RFd015QXdJREU0T1NBdE9EWjBPRFlnTFRFNE9YWXROVEF3Y1RBZ0xUUXhJQzAwTWlBdE9ETjBMVGd6SUMwME1tZ3RORFV3Y1MwME1TQXdJQzA0TXlBME1uUXRORElnT0ROMk5UQXdjVEFnTVRBeklEZzJJREU0T1hReE9Ea2dPRFo2VFRjd01DQXpNREIyTFRJeU5YRXdJQzB5TVNBdE1qY2dMVFE0ZEMwME9DQXRNamRvTFRFMU1IRXRNakVnTUNBdE5EZ2dNamQwTFRJM0lEUTRkakl5Tldnek1EQjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUSXpNanNpSUdROUlrMDBOelVnTVRNd01HZzVObkV3SUMweE5UQWdPRGt1TlNBdE1qTTVMalYwTWpNNUxqVWdMVGc1TGpWMkxUUTBObkV3SUMwME1TQXRORElnTFRnemRDMDRNeUF0TkRKb0xUUTFNSEV0TkRFZ01DQXRPRE1nTkRKMExUUXlJRGd6ZGpVd01IRXdJREV3TXlBNE5pQXhPRGwwTVRnNUlEZzJlazAzTURBZ016QXdkaTB5TWpWeE1DQXRNakVnTFRJM0lDMDBPSFF0TkRnZ0xUSTNhQzB4TlRCeExUSXhJREFnTFRRNElESTNkQzB5TnlBME9IWXlNalZvTXpBd2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeU16TTdJaUJrUFNKTk1USTVOQ0EzTmpkc0xUWXpPQ0F0TWpnemJDMHpOemdnTVRjd2JDMDNPQ0F0TmpCMkxUSXlOR3d4TURBZ0xURTFNSFl0TVRrNWJDMHhOVEFnTVRRNGJDMHhOVEFnTFRFME9YWXlNREJzTVRBd0lERTFNSFl5TlRCeE1DQTBJQzB3TGpVZ01UQXVOWFF3SURrdU5YUXhJRGgwTXlBNGREWXVOU0EyYkRRM0lEUXdiQzB4TkRjZ05qVnNOalF5SURJNE0zcE5NVEF3TUNBek9EQnNMVE0xTUNBdE1UWTJiQzB6TlRBZ01UWTJkakUwTjJ3ek5UQWdMVEUyTld3ek5UQWdNVFkxZGkweE5EZDZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUSXpORHNpSUdROUlrMHlOVEFnT0RBd2NUWXlJREFnTVRBMklDMDBOSFEwTkNBdE1UQTJkQzAwTkNBdE1UQTJkQzB4TURZZ0xUUTBkQzB4TURZZ05EUjBMVFEwSURFd05uUTBOQ0F4TURaME1UQTJJRFEwZWswMk5UQWdPREF3Y1RZeUlEQWdNVEEySUMwME5IUTBOQ0F0TVRBMmRDMDBOQ0F0TVRBMmRDMHhNRFlnTFRRMGRDMHhNRFlnTkRSMExUUTBJREV3Tm5RME5DQXhNRFowTVRBMklEUTBlazB4TURVd0lEZ3dNSEUyTWlBd0lERXdOaUF0TkRSME5EUWdMVEV3Tm5RdE5EUWdMVEV3Tm5RdE1UQTJJQzAwTkhRdE1UQTJJRFEwZEMwME5DQXhNRFowTkRRZ01UQTJkREV3TmlBME5Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1qTTFPeUlnWkQwaVRUVTFNQ0F4TVRBd2NUWXlJREFnTVRBMklDMDBOSFEwTkNBdE1UQTJkQzAwTkNBdE1UQTJkQzB4TURZZ0xUUTBkQzB4TURZZ05EUjBMVFEwSURFd05uUTBOQ0F4TURaME1UQTJJRFEwZWswMU5UQWdOekF3Y1RZeUlEQWdNVEEySUMwME5IUTBOQ0F0TVRBMmRDMDBOQ0F0TVRBMmRDMHhNRFlnTFRRMGRDMHhNRFlnTkRSMExUUTBJREV3Tm5RME5DQXhNRFowTVRBMklEUTBlazAxTlRBZ016QXdjVFl5SURBZ01UQTJJQzAwTkhRME5DQXRNVEEyZEMwME5DQXRNVEEyZEMweE1EWWdMVFEwZEMweE1EWWdORFIwTFRRMElERXdOblEwTkNBeE1EWjBNVEEySURRMGVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeU16WTdJaUJrUFNKTk1USTFJREV4TURCb09UVXdjVEV3SURBZ01UY3VOU0F0Tnk0MWREY3VOU0F0TVRjdU5YWXRNVFV3Y1RBZ0xURXdJQzAzTGpVZ0xURTNMalYwTFRFM0xqVWdMVGN1TldndE9UVXdjUzB4TUNBd0lDMHhOeTQxSURjdU5YUXROeTQxSURFM0xqVjJNVFV3Y1RBZ01UQWdOeTQxSURFM0xqVjBNVGN1TlNBM0xqVjZUVEV5TlNBM01EQm9PVFV3Y1RFd0lEQWdNVGN1TlNBdE55NDFkRGN1TlNBdE1UY3VOWFl0TVRVd2NUQWdMVEV3SUMwM0xqVWdMVEUzTGpWMExURTNMalVnTFRjdU5XZ3RPVFV3Y1MweE1DQXdJQzB4Tnk0MUlEY3VOWFF0Tnk0MUlERTNMalYyTVRVd2NUQWdNVEFnTnk0MUlERTNMalVnZERFM0xqVWdOeTQxZWsweE1qVWdNekF3YURrMU1IRXhNQ0F3SURFM0xqVWdMVGN1TlhRM0xqVWdMVEUzTGpWMkxURTFNSEV3SUMweE1DQXROeTQxSUMweE55NDFkQzB4Tnk0MUlDMDNMalZvTFRrMU1IRXRNVEFnTUNBdE1UY3VOU0EzTGpWMExUY3VOU0F4Tnk0MWRqRTFNSEV3SURFd0lEY3VOU0F4Tnk0MWRERTNMalVnTnk0MWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeU16YzdJaUJrUFNKTk16VXdJREV5TURCb05UQXdjVEUyTWlBd0lESTFOaUF0T1RNdU5YUTVOQ0F0TWpVMkxqVjJMVFV3TUhFd0lDMHhOalVnTFRrekxqVWdMVEkxTnk0MWRDMHlOVFl1TlNBdE9USXVOV2d0TlRBd2NTMHhOalVnTUNBdE1qVTNMalVnT1RJdU5YUXRPVEl1TlNBeU5UY3VOWFkxTURCeE1DQXhOalVnT1RJdU5TQXlOVGN1TlhReU5UY3VOU0E1TWk0MWVrMDVNREFnTVRBd01HZ3ROakF3Y1MwME1TQXdJQzAzTUM0MUlDMHlPUzQxZEMweU9TNDFJQzAzTUM0MWRpMDJNREJ4TUNBdE5ERWdNamt1TlNBdE56QXVOWFEzTUM0MUlDMHlPUzQxYURZd01IRTBNU0F3SURjd0xqVWdNamt1TlNCME1qa3VOU0EzTUM0MWRqWXdNSEV3SURReElDMHlPUzQxSURjd0xqVjBMVGN3TGpVZ01qa3VOWHBOTXpVd0lEa3dNR2cxTURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxUTXdNSEV3SUMweU1TQXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE5UQXdjUzB5TVNBd0lDMHpOUzQxSURFMExqVjBMVEUwTGpVZ016VXVOWFl6TURCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWswME1EQWdPREF3ZGkweU1EQm9OREF3ZGpJd01HZ3ROREF3ZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V5TXpnN0lpQmtQU0pOTVRVd0lERXhNREJvTVRBd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YUXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE5UQjJMVEl3TUdnMU1IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YUXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE5UQjJMVEl3TUdnMU1IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YUXRNVFF1TlNBdE16VXVOWFF0TXpVdU5TQXRNVFF1TldndE5UQjJMVEl3TUdnMU1IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YUXRNVFF1TlNBdE16VXVOU0IwTFRNMUxqVWdMVEUwTGpWb0xURXdNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZERFMExqVWdNelV1TlhRek5TNDFJREUwTGpWb05UQjJNakF3YUMwMU1IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjBNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOV2cxTUhZeU1EQm9MVFV3Y1MweU1TQXdJQzB6TlM0MUlERTBMalYwTFRFMExqVWdNelV1TlhReE5DNDFJRE0xTGpWME16VXVOU0F4TkM0MWFEVXdkakl3TUdndE5UQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkREUwTGpVZ016VXVOWFF6TlM0MUlERTBMalY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEl6T1RzaUlHUTlJazAyTlRBZ01URTROM0U0TnlBdE5qY2dNVEU0TGpVZ0xURTFOblF3SUMweE56aDBMVEV4T0M0MUlDMHhOVFZ4TFRnM0lEWTJJQzB4TVRndU5TQXhOVFYwTUNBeE56aDBNVEU0TGpVZ01UVTJlazB6TURBZ09EQXdjVEV5TkNBd0lESXhNaUF0T0RoME9EZ2dMVEl4TW5FdE1USTBJREFnTFRJeE1pQTRPSFF0T0RnZ01qRXllazB4TURBd0lEZ3dNSEV3SUMweE1qUWdMVGc0SUMweU1USjBMVEl4TWlBdE9EaHhNQ0F4TWpRZ09EZ2dNakV5ZERJeE1pQTRPSHBOTXpBd0lEVXdNSEV4TWpRZ01DQXlNVElnTFRnNGREZzRJQzB5TVRKeExURXlOQ0F3SUMweU1USWdPRGgwTFRnNElESXhNbm9nVFRFd01EQWdOVEF3Y1RBZ0xURXlOQ0F0T0RnZ0xUSXhNblF0TWpFeUlDMDRPSEV3SURFeU5DQTRPQ0F5TVRKME1qRXlJRGc0ZWswM01EQWdNVGs1ZGkweE5EUnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalYwTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqRTBNbkUwTUNBdE5DQTBNeUF0TkhFeE55QXdJRFUzSURaNklpQXZQZ284WjJ4NWNHZ2dkVzVwWTI5a1pUMGlKaU40WlRJME1Ec2lJR1E5SWswM05EVWdPRGM0YkRZNUlERTVjVEkxSURZZ05EVWdMVEV5YkRJNU9DQXRNamsxY1RFeElDMHhNU0F4TlNBdE1qWXVOWFF0TWlBdE16QXVOWEV0TlNBdE1UUWdMVEU0SUMweU15NDFkQzB5T0NBdE9TNDFhQzA0Y1RFZ01DQXhJQzB4TTNFd0lDMHlPU0F0TWlBdE5UWjBMVGd1TlNBdE5qSjBMVEl3SUMwMk0zUXRNek1nTFRVemRDMDFNU0F0TXpsMExUY3lMalVnTFRFMGFDMHhORFp4TFRFNE5DQXdJQzB4T0RRZ01qZzRjVEFnTWpRZ01UQWdORGR4TFRJd0lEUWdMVFl5SURSMExUWXpJQzAwY1RFeElDMHlOQ0F4TVNBdE5EZHhNQ0F0TWpnNElDMHhPRFFnTFRJNE9HZ3RNVFF5SUhFdE5EZ2dNQ0F0T0RRdU5TQXlNWFF0TlRZZ05URjBMVE15SURjeExqVjBMVEUySURjMWRDMHpMalVnTmpndU5YRXdJREV6SURJZ01UTm9MVGR4TFRFMUlEQWdMVEkzTGpVZ09TNDFkQzB4T0M0MUlESXpMalZ4TFRZZ01UVWdMVElnTXpBdU5YUXhOU0F5TlM0MWJESTVPQ0F5T1RaeE1qQWdNVGdnTkRZZ01URnNOellnTFRFNWNUSXdJQzAxSURNd0xqVWdMVEl5TGpWME5TNDFJQzB6Tnk0MWRDMHlNaTQxSUMwek1YUXRNemN1TlNBdE5Xd3ROVEVnTVRKc0xURTRNaUF0TVRremFEZzVNV3d0TVRneUlERTVNMnd0TkRRZ0xURXljUzB5TUNBdE5TQXRNemN1TlNBMmRDMHlNaTQxSURNeGREWWdNemN1TlNCME16RWdNakl1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpReE95SWdaRDBpVFRFeU1EQWdPVEF3YUMwMU1IRXdJREl4SUMwMElETTNkQzA1TGpVZ01qWXVOWFF0TVRnZ01UY3VOWFF0TWpJZ01URjBMVEk0TGpVZ05TNDFkQzB6TVNBeWRDMHpOeUF3TGpWb0xUSXdNSFl0T0RVd2NUQWdMVEl5SURJMUlDMHpOQzQxZERVd0lDMHhNeTQxYkRJMUlDMHlkaTB4TURCb0xUUXdNSFl4TURCeE5DQXdJREV4SURBdU5YUXlOQ0F6ZERNd0lEZDBNalFnTVRWME1URWdNalF1TlhZNE5UQm9MVEl3TUhFdE1qVWdNQ0F0TXpjZ0xUQXVOWFF0TXpFZ0xUSjBMVEk0TGpVZ0xUVXVOWFF0TWpJZ0xURXhkQzB4T0NBdE1UY3VOWFF0T1M0MUlDMHlOaTQxZEMwMElDMHpOMmd0TlRCMk16QXdJR2d4TURBd2RpMHpNREI2VFRVd01DQTBOVEJvTFRJMWNUQWdNVFVnTFRRZ01qUXVOWFF0T1NBeE5DNDFkQzB4TnlBM0xqVjBMVEl3SUROMExUSTFJREF1TldndE1UQXdkaTAwTWpWeE1DQXRNVEVnTVRJdU5TQXRNVGN1TlhReU5TNDFJQzAzTGpWb01USjJMVFV3YUMweU1EQjJOVEJ4TlRBZ01DQTFNQ0F5TlhZME1qVm9MVEV3TUhFdE1UY2dNQ0F0TWpVZ0xUQXVOWFF0TWpBZ0xUTjBMVEUzSUMwM0xqVjBMVGtnTFRFMExqVjBMVFFnTFRJMExqVm9MVEkxZGpFMU1HZzFNREIyTFRFMU1Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1qUXlPeUlnWkQwaVRURXdNREFnTXpBd2RqVXdjUzB5TlNBd0lDMDFOU0F6TW5FdE1UUWdNVFFnTFRJMUlETXhkQzB4TmlBeU4yd3ROQ0F4TVd3dE1qZzVJRGMwTjJndE5qbHNMVE13TUNBdE56VTBjUzB4T0NBdE16VWdMVE01SUMwMU5uRXRPU0F0T1NBdE1qUXVOU0F0TVRndU5YUXRNall1TlNBdE1UUXVOV3d0TVRFZ0xUVjJMVFV3YURJM00zWTFNSEV0TkRrZ01DQXROemd1TlNBeU1TNDFkQzB4TVM0MUlEWTNMalZzTmprZ01UYzJhREk1TTJ3Mk1TQXRNVFkyY1RFeklDMHpOQ0F0TXk0MUlDMDJOaTQxZEMwMU5TNDFJQzB6TWk0MWRpMDFNR2d6TVRKNlRUUXhNaUEyT1RGc01UTTBJRE0wTW13eE1qRWdMVE0wTWlCb0xUSTFOWHBOTVRFd01DQXhOVEIyTFRFd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TVRBd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJNVEF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOV2d4TURBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdVeU5ETTdJaUJrUFNKTk5UQWdNVEl3TUdneE1UQXdjVEl4SURBZ016VXVOU0F0TVRRdU5YUXhOQzQxSUMwek5TNDFkaTB4TVRBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB4TVRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWXhNVEF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTmpFeElERXhNVGhvTFRjd2NTMHhNeUF3SUMweE9DQXRNVEpzTFRJNU9TQXROelV6Y1MweE55QXRNeklnTFRNMUlDMDFNWEV0TVRnZ0xURTRJQzAxTmlBdE16UnhMVEV5SUMwMUlDMHhNaUF0TVRoMkxUVXdjVEFnTFRnZ05TNDFJQzB4TkhReE5DNDFJQzAySUdneU56TnhPQ0F3SURFMElEWjBOaUF4TkhZMU1IRXdJRGdnTFRZZ01UUjBMVEUwSURaeExUVTFJREFnTFRjeElESXpjUzB4TUNBeE5DQXdJRE01YkRZeklERTJNMmd5Tmpac05UY2dMVEUxTTNFeE1TQXRNekVnTFRZZ0xUVTFjUzB4TWlBdE1UY2dMVE0ySUMweE4zRXRPQ0F3SUMweE5DQXROblF0TmlBdE1UUjJMVFV3Y1RBZ0xUZ2dOaUF0TVRSME1UUWdMVFpvTXpFemNUZ2dNQ0F4TkNBMmREWWdNVFIyTlRCeE1DQTNJQzAxTGpVZ01UTjBMVEV6TGpVZ04zRXRNVGNnTUNBdE5ESWdNalZ4TFRJMUlESTNJQzAwTUNBMk0yZ3RNV3d0TWpnNElEYzBPSEV0TlNBeE1pQXRNVGtnTVRKNlRUWXpPU0EyTVRFZ2FDMHhPVGRzTVRBeklESTJOSG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNalEwT3lJZ1pEMGlUVEV5TURBZ01URXdNR2d0TVRJd01IWXhNREJvTVRJd01IWXRNVEF3ZWswMU1DQXhNREF3YURRd01IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXRPVEF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMDBNREJ4TFRJeElEQWdMVE0xTGpVZ01UUXVOWFF0TVRRdU5TQXpOUzQxZGprd01IRXdJREl4SURFMExqVWdNelV1TlhRek5TNDFJREUwTGpWNlRUWTFNQ0F4TURBd2FEUXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TkRBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzAwTURBZ2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTBNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazAzTURBZ09UQXdkaTB6TURCb016QXdkak13TUdndE16QXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXlORFU3SWlCa1BTSk5OVEFnTVRJd01HZzBNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRrd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TkRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTVNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazAyTlRBZ056QXdhRFF3TUhFeU1TQXdJRE0xTGpVZ0xURTBMalYwTVRRdU5TQXRNelV1TlhZdE5EQXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMwME1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkalF3TUNCeE1DQXlNU0F4TkM0MUlETTFMalYwTXpVdU5TQXhOQzQxZWswM01EQWdOakF3ZGkwek1EQm9NekF3ZGpNd01HZ3RNekF3ZWsweE1qQXdJREJvTFRFeU1EQjJNVEF3YURFeU1EQjJMVEV3TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpRMk95SWdaRDBpVFRVd0lERXdNREJvTkRBd2NUSXhJREFnTXpVdU5TQXRNVFF1TlhReE5DNDFJQzB6TlM0MWRpMHpOVEJvTVRBd2RqRTFNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVm9OREF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkweE5UQm9NVEF3ZGkweE1EQm9MVEV3TUhZdE1UVXdjVEFnTFRJeElDMHhOQzQxSUMwek5TNDFkQzB6TlM0MUlDMHhOQzQxYUMwME1EQnhMVEl4SURBZ0xUTTFMalVnTVRRdU5YUXRNVFF1TlNBek5TNDFkakUxTUdndE1UQXdkaTB6TlRCeE1DQXRNakVnTFRFMExqVWdMVE0xTGpWMExUTTFMalVnTFRFMExqVm9MVFF3TUNCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqZ3dNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVGN3TUNBM01EQjJMVE13TUdnek1EQjJNekF3YUMwek1EQjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUSTBOenNpSUdROUlrMHhNREFnTUdndE1UQXdkakV5TURCb01UQXdkaTB4TWpBd2VrMHlOVEFnTVRFd01HZzBNREJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRRd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0TkRBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTBNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFlazB6TURBZ01UQXdNSFl0TXpBd2FETXdNSFl6TURCb0xUTXdNSHBOTWpVd0lEVXdNR2c1TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxUUXdNQ0J4TUNBdE1qRWdMVEUwTGpVZ0xUTTFMalYwTFRNMUxqVWdMVEUwTGpWb0xUa3dNSEV0TWpFZ01DQXRNelV1TlNBeE5DNDFkQzB4TkM0MUlETTFMalYyTkRBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpRNE95SWdaRDBpVFRZd01DQXhNVEF3YURFMU1IRXlNU0F3SURNMUxqVWdMVEUwTGpWME1UUXVOU0F0TXpVdU5YWXROREF3Y1RBZ0xUSXhJQzB4TkM0MUlDMHpOUzQxZEMwek5TNDFJQzB4TkM0MWFDMHhOVEIyTFRFd01HZzBOVEJ4TWpFZ01DQXpOUzQxSUMweE5DNDFkREUwTGpVZ0xUTTFMalYyTFRRd01IRXdJQzB5TVNBdE1UUXVOU0F0TXpVdU5YUXRNelV1TlNBdE1UUXVOV2d0T1RBd2NTMHlNU0F3SUMwek5TNDFJREUwTGpWMExURTBMalVnTXpVdU5YWTBNREJ4TUNBeU1TQXhOQzQxSURNMUxqVjBNelV1TlNBeE5DNDFhRE0xTUhZeE1EQm9MVEUxTUhFdE1qRWdNQ0F0TXpVdU5TQXhOQzQxSUhRdE1UUXVOU0F6TlM0MWRqUXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVm9NVFV3ZGpFd01HZ3hNREIyTFRFd01IcE5OREF3SURFd01EQjJMVE13TUdnek1EQjJNekF3YUMwek1EQjZJaUF2UGdvOFoyeDVjR2dnZFc1cFkyOWtaVDBpSmlONFpUSTBPVHNpSUdROUlrMHhNakF3SURCb0xURXdNSFl4TWpBd2FERXdNSFl0TVRJd01IcE5OVFV3SURFeE1EQm9OREF3Y1RJeElEQWdNelV1TlNBdE1UUXVOWFF4TkM0MUlDMHpOUzQxZGkwME1EQnhNQ0F0TWpFZ0xURTBMalVnTFRNMUxqVjBMVE0xTGpVZ0xURTBMalZvTFRRd01IRXRNakVnTUNBdE16VXVOU0F4TkM0MWRDMHhOQzQxSURNMUxqVjJOREF3Y1RBZ01qRWdNVFF1TlNBek5TNDFkRE0xTGpVZ01UUXVOWHBOTmpBd0lERXdNREIyTFRNd01HZ3pNREIyTXpBd2FDMHpNREI2VFRVd0lEVXdNR2c1TURCeE1qRWdNQ0F6TlM0MUlDMHhOQzQxZERFMExqVWdMVE0xTGpWMkxUUXdNQ0J4TUNBdE1qRWdMVEUwTGpVZ0xUTTFMalYwTFRNMUxqVWdMVEUwTGpWb0xUa3dNSEV0TWpFZ01DQXRNelV1TlNBeE5DNDFkQzB4TkM0MUlETTFMalYyTkRBd2NUQWdNakVnTVRRdU5TQXpOUzQxZERNMUxqVWdNVFF1TlhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpVd095SWdaRDBpVFRnMk5TQTFOalZzTFRRNU5DQXRORGswY1MweU15QXRNak1nTFRReElDMHlNM0V0TVRRZ01DQXRNaklnTVRNdU5YUXRPQ0F6T0M0MWRqRXdNREJ4TUNBeU5TQTRJRE00TGpWME1qSWdNVE11TlhFeE9DQXdJRFF4SUMweU0ydzBPVFFnTFRRNU5IRXhOQ0F0TVRRZ01UUWdMVE0xZEMweE5DQXRNelY2SWlBdlBnbzhaMng1Y0dnZ2RXNXBZMjlrWlQwaUppTjRaVEkxTVRzaUlHUTlJazB6TXpVZ05qTTFiRFE1TkNBME9UUnhNamtnTWprZ05UQWdNakF1TlhReU1TQXRORGt1TlhZdE1UQXdNSEV3SUMwME1TQXRNakVnTFRRNUxqVjBMVFV3SURJd0xqVnNMVFE1TkNBME9UUnhMVEUwSURFMElDMHhOQ0F6TlhReE5DQXpOWG9pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNalV5T3lJZ1pEMGlUVEV3TUNBNU1EQm9NVEF3TUhFME1TQXdJRFE1TGpVZ0xUSXhkQzB5TUM0MUlDMDFNR3d0TkRrMElDMDBPVFJ4TFRFMElDMHhOQ0F0TXpVZ0xURTBkQzB6TlNBeE5Hd3RORGswSURRNU5IRXRNamtnTWprZ0xUSXdMalVnTlRCME5Ea3VOU0F5TVhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpVek95SWdaRDBpVFRZek5TQTROalZzTkRrMElDMDBPVFJ4TWprZ0xUSTVJREl3TGpVZ0xUVXdkQzAwT1M0MUlDMHlNV2d0TVRBd01IRXROREVnTUNBdE5Ea3VOU0F5TVhReU1DNDFJRFV3YkRRNU5DQTBPVFJ4TVRRZ01UUWdNelVnTVRSME16VWdMVEUwZWlJZ0x6NEtQR2RzZVhCb0lIVnVhV052WkdVOUlpWWplR1V5TlRRN0lpQmtQU0pOTnpBd0lEYzBNWFl0TVRneWJDMDJPVElnTFRNeU0zWXlNakZzTkRFeklERTVNMnd0TkRFeklERTVNM1l5TWpGNlRURXlNREFnTUdndE9EQXdkakl3TUdnNE1EQjJMVEl3TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpVMU95SWdaRDBpVFRFeU1EQWdPVEF3YUMweU1EQjJMVEV3TUdneU1EQjJMVEV3TUdndE16QXdkak13TUdneU1EQjJNVEF3YUMweU1EQjJNVEF3YURNd01IWXRNekF3ZWswd0lEY3dNR2cxTUhFd0lESXhJRFFnTXpkME9TNDFJREkyTGpWME1UZ2dNVGN1TlhReU1pQXhNWFF5T0M0MUlEVXVOWFF6TVNBeWRETTNJREF1TldneE1EQjJMVFUxTUhFd0lDMHlNaUF0TWpVZ0xUTTBMalYwTFRVd0lDMHhNeTQxYkMweU5TQXRNbll0TVRBd2FEUXdNSFl4TURCeExUUWdNQ0F0TVRFZ01DNDFkQzB5TkNBemRDMHpNQ0EzZEMweU5DQXhOWFF0TVRFZ01qUXVOWFkxTlRCb01UQXdjVEkxSURBZ016Y2dMVEF1TlhRek1TQXRNaUIwTWpndU5TQXROUzQxZERJeUlDMHhNWFF4T0NBdE1UY3VOWFE1TGpVZ0xUSTJMalYwTkNBdE16ZG9OVEIyTXpBd2FDMDRNREIyTFRNd01Ib2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1qVTJPeUlnWkQwaVRUZ3dNQ0EzTURCb0xUVXdjVEFnTWpFZ0xUUWdNemQwTFRrdU5TQXlOaTQxZEMweE9DQXhOeTQxZEMweU1pQXhNWFF0TWpndU5TQTFMalYwTFRNeElESjBMVE0zSURBdU5XZ3RNVEF3ZGkwMU5UQnhNQ0F0TWpJZ01qVWdMVE0wTGpWME5UQWdMVEUwTGpWc01qVWdMVEYyTFRFd01HZ3ROREF3ZGpFd01IRTBJREFnTVRFZ01DNDFkREkwSUROME16QWdOM1F5TkNBeE5YUXhNU0F5TkM0MWRqVTFNR2d0TVRBd2NTMHlOU0F3SUMwek55QXRNQzQxZEMwek1TQXRNblF0TWpndU5TQXROUzQxZEMweU1pQXRNVEYwTFRFNElDMHhOeTQxZEMwNUxqVWdMVEkyTGpWMExUUWdMVE0zYUMwMU1IWXpNREFnYURnd01IWXRNekF3ZWsweE1UQXdJREl3TUdndE1qQXdkaTB4TURCb01qQXdkaTB4TURCb0xUTXdNSFl6TURCb01qQXdkakV3TUdndE1qQXdkakV3TUdnek1EQjJMVE13TUhvaUlDOCtDanhuYkhsd2FDQjFibWxqYjJSbFBTSW1JM2hsTWpVM095SWdaRDBpVFRjd01TQXhNRGs0YURFMk1IRXhOaUF3SURJeElDMHhNWFF0TnlBdE1qTnNMVFEyTkNBdE5EWTBiRFEyTkNBdE5EWTBjVEV5SUMweE1pQTNJQzB5TTNRdE1qRWdMVEV4YUMweE5qQnhMVEV6SURBZ0xUSXpJRGxzTFRRM01TQTBOekZ4TFRjZ09DQXROeUF4T0hRM0lERTRiRFEzTVNBME56RnhNVEFnT1NBeU15QTVlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVHVXlOVGc3SWlCa1BTSk5Nek01SURFd09UaG9NVFl3Y1RFeklEQWdNak1nTFRsc05EY3hJQzAwTnpGeE55QXRPQ0EzSUMweE9IUXROeUF0TVRoc0xUUTNNU0F0TkRjeGNTMHhNQ0F0T1NBdE1qTWdMVGxvTFRFMk1IRXRNVFlnTUNBdE1qRWdNVEYwTnlBeU0ydzBOalFnTkRZMGJDMDBOalFnTkRZMGNTMHhNaUF4TWlBdE55QXlNM1F5TVNBeE1Yb2lJQzgrQ2p4bmJIbHdhQ0IxYm1samIyUmxQU0ltSTNobE1qVTVPeUlnWkQwaVRURXdPRGNnT0RneWNURXhJQzAxSURFeElDMHlNWFl0TVRZd2NUQWdMVEV6SUMwNUlDMHlNMnd0TkRjeElDMDBOekZ4TFRnZ0xUY2dMVEU0SUMwM2RDMHhPQ0EzYkMwME56RWdORGN4Y1MwNUlERXdJQzA1SURJemRqRTJNSEV3SURFMklERXhJREl4ZERJeklDMDNiRFEyTkNBdE5EWTBiRFEyTkNBME5qUnhNVElnTVRJZ01qTWdOM29pSUM4K0NqeG5iSGx3YUNCMWJtbGpiMlJsUFNJbUkzaGxNall3T3lJZ1pEMGlUVFl4T0NBNU9UTnNORGN4SUMwME56RnhPU0F0TVRBZ09TQXRNak4yTFRFMk1IRXdJQzB4TmlBdE1URWdMVEl4ZEMweU15QTNiQzAwTmpRZ05EWTBiQzAwTmpRZ0xUUTJOSEV0TVRJZ0xURXlJQzB5TXlBdE4zUXRNVEVnTWpGMk1UWXdjVEFnTVRNZ09TQXlNMncwTnpFZ05EY3hjVGdnTnlBeE9DQTNkREU0SUMwM2VpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZUdZNFptWTdJaUJrUFNKTk1UQXdNQ0F4TWpBd2NUQWdMVEV5TkNBdE9EZ2dMVEl4TW5RdE1qRXlJQzA0T0hFd0lERXlOQ0E0T0NBeU1USjBNakV5SURnNGVrMDBOVEFnTVRBd01HZ3hNREJ4TWpFZ01DQTBNQ0F0TVRSME1qWWdMVE16YkRjNUlDMHhPVFJ4TlNBeElERTJJRE54TXpRZ05pQTFOQ0E1TGpWME5qQWdOM1EyTlM0MUlERjBOakVnTFRFd2REVTJMalVnTFRJemREUXlMalVnTFRReWRESTVJQzAyTkhRMUlDMDVNblF0TVRrdU5TQXRNVEl4TGpWeExURWdMVGNnTFRNZ0xURTVMalYwTFRFeElDMDFNSFF0TWpBdU5TQXROek4wTFRNeUxqVWdMVGd4TGpWMExUUTJMalVnTFRnemRDMDJOQ0F0TnpBZ2RDMDRNaTQxSUMwMU1IRXRNVE1nTFRVZ0xUUXlJQzAxZEMwMk5TNDFJREl1TlhRdE5EY3VOU0F5TGpWeExURTBJREFnTFRRNUxqVWdMVE11TlhRdE5qTWdMVE11TlhRdE5ETXVOU0EzY1MwMU55QXlOU0F0TVRBMExqVWdOemd1TlhRdE56VWdNVEV4TGpWMExUUTJMalVnTVRFeWRDMHlOaUE1TUd3dE55QXpOWEV0TVRVZ05qTWdMVEU0SURFeE5YUTBMalVnT0RndU5YUXlOaUEyTkhRek9TNDFJRFF6TGpWME5USWdNalV1TlhRMU9DNDFJREV6ZERZeUxqVWdNblExT1M0MUlDMDBMalYwTlRVdU5TQXRPR3d0TVRRM0lERTVNbkV0TVRJZ01UZ2dMVFV1TlNBek1IUXlOeTQxSURFeWVpSWdMejRLUEdkc2VYQm9JSFZ1YVdOdlpHVTlJaVlqZURGbU5URXhPeUlnWkQwaVRUSTFNQ0F4TWpBd2FEWXdNSEV5TVNBd0lETTFMalVnTFRFMExqVjBNVFF1TlNBdE16VXVOWFl0TkRBd2NUQWdMVEl4SUMweE5DNDFJQzB6TlM0MWRDMHpOUzQxSUMweE5DNDFhQzB4TlRCMkxUVXdNR3d0TWpVMUlDMHhOemh4TFRFNUlDMDVJQzB6TWlBdE1YUXRNVE1nTWpsMk5qVXdhQzB4TlRCeExUSXhJREFnTFRNMUxqVWdNVFF1TlhRdE1UUXVOU0F6TlM0MWRqUXdNSEV3SURJeElERTBMalVnTXpVdU5YUXpOUzQxSURFMExqVjZUVFF3TUNBeE1UQXdkaTB4TURCb016QXdkakV3TUdndE16QXdlaUlnTHo0S1BHZHNlWEJvSUhWdWFXTnZaR1U5SWlZamVERm1ObUZoT3lJZ1pEMGlUVEkxTUNBeE1qQXdhRGMxTUhFek9TQXdJRFk1TGpVZ0xUUXdMalYwTXpBdU5TQXRPRFF1TlhZdE9UTXpiQzAzTURBZ0xURXhOM1k1TlRCc05qQXdJREV5TldndE56QXdkaTB4TURBd2FDMHhNREIyTVRBeU5YRXdJREl6SURFMUxqVWdORGwwTXpRdU5TQXlObnBOTlRBd0lEVXlOWFl0TVRBd2JERXdNQ0F5TUhZeE1EQjZJaUF2UGdvOEwyWnZiblErQ2p3dlpHVm1jejQ4TDNOMlp6NGci"

/***/ }),

/***/ 23:
/***/ (function(module, exports) {


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot";

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by ramor11 on 1/20/2017.
 */


const angular = __webpack_require__(3);
const input_component_1 = __webpack_require__(10);
__webpack_require__(61);
function getSibling(element, key) {
    var sibling = element[0][key + 'Sibling'];
    return sibling ? angular.element(sibling[key + 'ElementSibling']) : angular.element(element[0]);
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
class Indeterminate {
    constructor() {
        this.restrict = 'A';
        this.require = ['ngModel', '^eqCheckbox'];
        this.link = this.linkFunc;
    }
    static instance() {
        return new Indeterminate();
    }
    linkFunc(scope, ele, attr) {
        attr.$observe('eqIndeterminate', function (value) {
            ele[0].indeterminate = scope.$eval(value);
        });
    }
}
exports.Indeterminate = Indeterminate;
class CheckboxCtrl extends input_component_1.InputCtrl {
    // private _model: any;
    constructor($element) {
        super($element);
        this.$element = $element;
        this.type = "checkbox";
        this.$obj = {
            $name: this.name || this.$id
        };
        this.$element = $element;
        if (this.ngClick) throw new Error('To prevent double events, use `ngChange`');
    }
    extend_model(o) {
        let model = angular.copy(o);
        Object.assign(this.$obj, typeof model === 'object' ? model : { model: model });
        return model;
    }
    $onInit() {
        let self = this;
        let select = this.$element.find('input');
        select.attr("multiple", "");
        this.ngModel.$render = function () {
            self.model = this.$viewValue;
            self._model = self.extend_model(self.model);
            if (self.eqCheckboxGroup) self.eqCheckboxGroup.siblings.push(self);
        };
    }

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
    }

    _isChild(item) {
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
        if (parent.eqCheckboxGroup) this._isChild(parent.eqCheckboxGroup);
        //force $digest on parent
        parent.ngModel.$setViewValue(parent.model, 'change');
    }
    _isParent() {
        let self = this;
        var itemController = getSibling(this.$element, 'next').data('$eqCheckboxGroupController');
        if (itemController && !this.indeterminate) angular.forEach(itemController.siblings, function (o, i) {
            o.model = self.model;
        });
    }
}
CheckboxCtrl.$inject = ['$element'];
// @Component
class Checkbox {
    constructor() {
        this.bindings = {
            name: '<',
            ngClick: '@',
            placeholder: '<',
            label: '<',
            required: '<',
            note: '<',
            disabled: '<'
        };
        this.require = {
            ngModel: '^',
            eqCheckboxGroup: '^?'
        };
        this.transclude = true;
        this.template = __webpack_require__(60);
        this.controller = CheckboxCtrl;
    }
}
exports.Checkbox = Checkbox;
class CheckboxGroupCtrl {
    constructor($element) {
        this.$element = $element;
        this.parent = getSibling($element, 'previous').data('$eqCheckboxController');
        this.siblings = [];
        if (!this.parent) throw new Error('Missing previousSibling `eqCheckbox`');
    }
}
CheckboxGroupCtrl.$inject = ['$element'];
// @Component
class CheckboxGroup {
    constructor() {
        this.controller = CheckboxGroupCtrl;
    }
}
exports.CheckboxGroup = CheckboxGroup;

/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by reyra on 2/8/2017.
 */


const input_component_1 = __webpack_require__(10);
const checkbox_component_1 = __webpack_require__(44);
module.exports = function (app) {
    app.component('eqInput', new input_component_1.Input());
    app.directive('eqIndeterminate', checkbox_component_1.Indeterminate.instance);
    app.component('eqCheckbox', new checkbox_component_1.Checkbox());
};

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by redroger on 8/5/2015.
 */


const CONTACTS = JSON.parse(__webpack_require__(181));
var ExternalContact;
(function (ExternalContact) {
    ExternalContact.routes = [{
        name: 'ContactsModule',
        parent: "rootBundle.root",
        abstract: true,
        resolve: {
            /**
             * LazyLoad application on needed route
             */
            ModuleResolver: ['jsBundleResolver', function (jsBundleResolver) {
                return jsBundleResolver(function (app, resolve) {
                    __webpack_require__.e/* require.ensure */(0).then((function () {
                        app.register(__webpack_require__(70));
                        resolve();
                    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
                });
            }],
            DatabaseInit: ['DatabaseManager', DatabaseManager => {
                const contacts = CONTACTS;
                let dbManager = DatabaseManager();
                dbManager.Collection = 'contacts';
                return new Promise(resolve => {
                    let results = dbManager.get({}, true);
                    if (results.length) {
                        resolve();
                    } else {
                        dbManager.put(contacts).then(resolve);
                    }
                });
            }]
        }
    }, {
        name: 'externalContacts',
        url: 'external-contacts/',
        parent: 'ContactsModule',
        component: 'exportContacts',
        resolve: {
            contacts: ['DatabaseManager', DatabaseManager => {
                let dbManager = DatabaseManager();
                dbManager.Collection = 'contacts';
                return new Promise(resolve => {
                    let results = dbManager.get({}, true);
                    resolve(results);
                });
            }]
        }
    }];
})(ExternalContact = exports.ExternalContact || (exports.ExternalContact = {}));

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const database_manager_service_1 = __webpack_require__(50);
/**
 * Created by reyra on 1/26/2017.
 */
var app = __webpack_require__(48).app;
__webpack_require__(184)(app);
__webpack_require__(63)(app);
__webpack_require__(64)(app);
__webpack_require__(185)(app);
__webpack_require__(62)(app);
//typescript factory
databaseManager.$inject = ['Loki', '$q'];
function databaseManager(Loki, $q) {
    return () => {
        return new database_manager_service_1.DatabaseManager(Loki, $q);
    };
}
app.factory('DatabaseManager', databaseManager);
module.exports = app;

/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by reyra on 11/6/2016.
 */


const angular_1 = __webpack_require__(3);
exports.app = angular_1.module("app.core", []);

/***/ }),

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Rx) {/**
 * Created by reyra on 10/8/2016.
 */


class EmitterService {
    constructor() {
        this.hasOwnProp = {}.hasOwnProperty;
        this.subjects = {};
    }
    createName(name) {
        return '$' + name;
    }
    emit(name, data) {
        let fnName = this.createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        this.subjects[fnName].onNext(data);
    }

    listen(name, handler) {
        let fnName = this.createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        return this.subjects[fnName].subscribe(handler);
    }

    dispose() {
        if (!this) return;
        let self = this;
        var subjects = this ? this.subjects : {};
        for (var prop in subjects) {
            if (self.hasOwnProp.call(subjects, prop)) {
                subjects[prop].dispose();
            }
        }
        this.subjects = {};
    }
}
exports.EmitterService = EmitterService;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bower_components/font-awesome/fonts/fontawesome-webfont.eot";

/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by reyra on 9/30/2016.
 */


const Emitter_service_1 = __webpack_require__(49);
class DatabaseManager extends Emitter_service_1.EmitterService {
    constructor(Loki, $q) {
        super();
        this.Loki = Loki;
        this.$q = $q;
        this.ignore = ['requestType', 'token', 'last_updated', 'remember'];
    }
    set Collection(name) {
        this.event = name;
        this.collection = this.Loki.getCollection(name);
    }
    get Collection() {
        return this.collection;
    }
    _onLoadStart() {
        let self = this;
        return self.$q(function (resolve) {
            // Future use of loading bar
            // self.loaderService.start({
            //     backdrop: false
            // });
            self.emit('onLoadStart');
            resolve();
        });
    }
    _onLoadComplete() {
        super.emit('onLoadComplete');
        return true;
    }
    notifyCollection(data) {
        super.emit(this.event, data);
        return true;
    }
    destroy() {
        this.dispose();
    }

    onChange(callback) {
        super.listen(this.event, callback);
    }

    onLoadStart(callback) {
        super.listen('onLoadStart', callback);
    }

    onLoadComplete(callback) {
        super.listen('onLoadComplete', callback);
    }

    update(obj) {
        let self = this;
        Object.assign(obj, obj);
        return self.$q((resolve, reject) => {
            self._onLoadStart().then(function () {
                self.collection.update(obj);
                self.Loki.saveDatabase().then(function () {
                    return self.get().then(data => {
                        self.notifyCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete();
                    });
                }.bind(self));
            });
        });
    }

    put(obj) {
        let self = this;
        if (Array.isArray(obj)) {
            obj.forEach(function (o) {
                o.$indeed = Date.now();
            });
        } else {
            obj.$indeed = Date.now();
        }
        return self.$q((resolve, reject) => {
            self._onLoadStart().then(function () {
                self.collection.insert(obj);
                self.Loki.saveDatabase().then(function () {
                    return self.get().then(data => {
                        self.notifyCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete();
                    });
                }.bind(self));
                // self.get(original_object).then(function (data) {
                //     let result = Object.assign({}, data[0], (data[0]));
                //     self.collection.update(result);
                // }, () => {
                //     self.collection.insert(((obj)));
                // }).finally(()=>{
                //     self.Loki.saveDatabase().then(function () {
                //         return self.get().then((data: any) => {
                //             self.notifyCollection(data);
                //             resolve(data);
                //         }, reject).finally(() => {
                //             self._onLoadComplete()
                //         });
                //     }.bind(self));
                // });
            });
        });
    }

    _get(data) {
        return this.$q(function (resolve, reject) {
            data.length ? resolve(data) : reject([]);
        });
    }
    get(query, async) {
        let self = this;
        let data = this.collection.find(query);
        return async ? data : self.$q((resolve, reject) => {
            self._onLoadStart().then(function () {
                self._get(data).then(function (data) {
                    self.notifyCollection(data);
                    resolve(data);
                }, reject).finally(() => {
                    self._onLoadComplete();
                });
            });
        });
    }

    remove(query) {
        let self = this;
        return this.$q(function (resolve, reject) {
            self._onLoadStart().then(function () {
                self.collection.remove(query);
                self.Loki.saveDatabase().then(function () {
                    return self.get().then(data => {
                        self.notifyCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete();
                    });
                });
            });
        });
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n) ? Number(n) : n;
    }
}
DatabaseManager.$inject = ['Loki', '$q'];
exports.DatabaseManager = DatabaseManager;

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Public;
(function (Public) {
    Public.routes = [{
        name: 'rootBundle',
        abstract: true,
        url: "/"
    }, {
        name: 'rootBundle.root',
        template: __webpack_require__(58),
        abstract: true,
        resolve: {
            register: ['jsBundleResolver', function (jsBundleResolver) {
                return jsBundleResolver((app, resolve) => {
                    __webpack_require__.e/* require.ensure */(0/* min-size */).then((function () {
                        app.register(__webpack_require__(71));
                        resolve();
                    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
                });
            }]
        }
    }, {
        name: "root",
        parent: "rootBundle.root",
        component: 'eqHome'
    }, {
        name: "about",
        url: "about/",
        parent: "rootBundle.root",
        component: 'eqAbout'
    }];
})(Public = exports.Public || (exports.Public = {}));

/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by redroger on 8/5/2015.
 */


var QueryBuilder;
(function (QueryBuilder) {
    QueryBuilder.routes = [{
        name: 'QueryBuilder',
        parent: "rootBundle.root",
        abstract: true,
        resolve: {
            /**
             * LazyLoad application on needed route
             */
            ModuleResolver: ['jsBundleResolver', function (jsBundleResolver) {
                return jsBundleResolver(function (app, resolve) {
                    __webpack_require__.e/* require.ensure */(0/* min-size */).then((function () {
                        app.register(__webpack_require__(72));
                        resolve();
                    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
                });
            }]
        }
    }, {
        name: 'queryBuilder',
        url: 'query-builder/',
        parent: 'QueryBuilder',
        template: __webpack_require__(59)
    }];
})(QueryBuilder = exports.QueryBuilder || (exports.QueryBuilder = {}));

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const public_routes_1 = __webpack_require__(51);
const routes_1 = __webpack_require__(52);
const routes_2 = __webpack_require__(46);
/**
 * Created by ramor11 on 4/19/2016.
 */
class RouteProvider {
    constructor(states) {
        this.states = states;
        //public routes no authentication needed
        states.inject(public_routes_1.Public.routes);
        states.inject(routes_1.QueryBuilder.routes);
        states.inject(routes_2.ExternalContact.routes);
    }
}
RouteProvider.$inject = ['routeStateProvider'];
exports.RouteProvider = RouteProvider;

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

module.exports =
	__webpack_require__(176) +
	"/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\n\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\nbody {\n  margin: 0;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline;\n}\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n[hidden],\ntemplate {\n  display: none;\n}\na {\n  background-color: transparent;\n}\na:active,\na:hover {\n  outline: 0;\n}\nabbr[title] {\n  border-bottom: 1px dotted;\n}\nb,\nstrong {\n  font-weight: bold;\n}\ndfn {\n  font-style: italic;\n}\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\nmark {\n  background: #ff0;\n  color: #000;\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\nsup {\n  top: -0.5em;\n}\nsub {\n  bottom: -0.25em;\n}\nimg {\n  border: 0;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\nfigure {\n  margin: 1em 40px;\n}\nhr {\n  box-sizing: content-box;\n  height: 0;\n}\npre {\n  overflow: auto;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0;\n}\nbutton {\n  overflow: visible;\n}\nbutton,\nselect {\n  text-transform: none;\n}\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer;\n}\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\ninput {\n  line-height: normal;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0;\n}\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box;\n}\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\nlegend {\n  border: 0;\n  padding: 0;\n}\ntextarea {\n  overflow: auto;\n}\noptgroup {\n  font-weight: bold;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\ntd,\nth {\n  padding: 0;\n}\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    box-shadow: none !important;\n    text-shadow: none !important;\n  }\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n  a[href]:after {\n    content: \" (\" attr(href) \")\";\n  }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\";\n  }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\";\n  }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n  thead {\n    display: table-header-group;\n  }\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n  img {\n    max-width: 100% !important;\n  }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n  .navbar {\n    display: none;\n  }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important;\n  }\n  .label {\n    border: 1px solid #000;\n  }\n  .table {\n    border-collapse: collapse !important;\n  }\n  .table td,\n  .table th {\n    background-color: #fff !important;\n  }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important;\n  }\n}\n@font-face {\n  font-family: 'Glyphicons Halflings';\n  src: url("+__webpack_require__(4)+");\n  src: url("+__webpack_require__(4)+"?#iefix) format('embedded-opentype'), url("+__webpack_require__(19)+") format('woff2'), url("+__webpack_require__(18)+") format('woff'), url("+__webpack_require__(16)+") format('truetype'), url("+__webpack_require__(22)+"#glyphicons_halflingsregular) format('svg');\n}\n.glyphicon {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.glyphicon-asterisk:before {\n  content: \"\\002a\";\n}\n.glyphicon-plus:before {\n  content: \"\\002b\";\n}\n.glyphicon-euro:before,\n.glyphicon-eur:before {\n  content: \"\\20ac\";\n}\n.glyphicon-minus:before {\n  content: \"\\2212\";\n}\n.glyphicon-cloud:before {\n  content: \"\\2601\";\n}\n.glyphicon-envelope:before {\n  content: \"\\2709\";\n}\n.glyphicon-pencil:before {\n  content: \"\\270f\";\n}\n.glyphicon-glass:before {\n  content: \"\\e001\";\n}\n.glyphicon-music:before {\n  content: \"\\e002\";\n}\n.glyphicon-search:before {\n  content: \"\\e003\";\n}\n.glyphicon-heart:before {\n  content: \"\\e005\";\n}\n.glyphicon-star:before {\n  content: \"\\e006\";\n}\n.glyphicon-star-empty:before {\n  content: \"\\e007\";\n}\n.glyphicon-user:before {\n  content: \"\\e008\";\n}\n.glyphicon-film:before {\n  content: \"\\e009\";\n}\n.glyphicon-th-large:before {\n  content: \"\\e010\";\n}\n.glyphicon-th:before {\n  content: \"\\e011\";\n}\n.glyphicon-th-list:before {\n  content: \"\\e012\";\n}\n.glyphicon-ok:before {\n  content: \"\\e013\";\n}\n.glyphicon-remove:before {\n  content: \"\\e014\";\n}\n.glyphicon-zoom-in:before {\n  content: \"\\e015\";\n}\n.glyphicon-zoom-out:before {\n  content: \"\\e016\";\n}\n.glyphicon-off:before {\n  content: \"\\e017\";\n}\n.glyphicon-signal:before {\n  content: \"\\e018\";\n}\n.glyphicon-cog:before {\n  content: \"\\e019\";\n}\n.glyphicon-trash:before {\n  content: \"\\e020\";\n}\n.glyphicon-home:before {\n  content: \"\\e021\";\n}\n.glyphicon-file:before {\n  content: \"\\e022\";\n}\n.glyphicon-time:before {\n  content: \"\\e023\";\n}\n.glyphicon-road:before {\n  content: \"\\e024\";\n}\n.glyphicon-download-alt:before {\n  content: \"\\e025\";\n}\n.glyphicon-download:before {\n  content: \"\\e026\";\n}\n.glyphicon-upload:before {\n  content: \"\\e027\";\n}\n.glyphicon-inbox:before {\n  content: \"\\e028\";\n}\n.glyphicon-play-circle:before {\n  content: \"\\e029\";\n}\n.glyphicon-repeat:before {\n  content: \"\\e030\";\n}\n.glyphicon-refresh:before {\n  content: \"\\e031\";\n}\n.glyphicon-list-alt:before {\n  content: \"\\e032\";\n}\n.glyphicon-lock:before {\n  content: \"\\e033\";\n}\n.glyphicon-flag:before {\n  content: \"\\e034\";\n}\n.glyphicon-headphones:before {\n  content: \"\\e035\";\n}\n.glyphicon-volume-off:before {\n  content: \"\\e036\";\n}\n.glyphicon-volume-down:before {\n  content: \"\\e037\";\n}\n.glyphicon-volume-up:before {\n  content: \"\\e038\";\n}\n.glyphicon-qrcode:before {\n  content: \"\\e039\";\n}\n.glyphicon-barcode:before {\n  content: \"\\e040\";\n}\n.glyphicon-tag:before {\n  content: \"\\e041\";\n}\n.glyphicon-tags:before {\n  content: \"\\e042\";\n}\n.glyphicon-book:before {\n  content: \"\\e043\";\n}\n.glyphicon-bookmark:before {\n  content: \"\\e044\";\n}\n.glyphicon-print:before {\n  content: \"\\e045\";\n}\n.glyphicon-camera:before {\n  content: \"\\e046\";\n}\n.glyphicon-font:before {\n  content: \"\\e047\";\n}\n.glyphicon-bold:before {\n  content: \"\\e048\";\n}\n.glyphicon-italic:before {\n  content: \"\\e049\";\n}\n.glyphicon-text-height:before {\n  content: \"\\e050\";\n}\n.glyphicon-text-width:before {\n  content: \"\\e051\";\n}\n.glyphicon-align-left:before {\n  content: \"\\e052\";\n}\n.glyphicon-align-center:before {\n  content: \"\\e053\";\n}\n.glyphicon-align-right:before {\n  content: \"\\e054\";\n}\n.glyphicon-align-justify:before {\n  content: \"\\e055\";\n}\n.glyphicon-list:before {\n  content: \"\\e056\";\n}\n.glyphicon-indent-left:before {\n  content: \"\\e057\";\n}\n.glyphicon-indent-right:before {\n  content: \"\\e058\";\n}\n.glyphicon-facetime-video:before {\n  content: \"\\e059\";\n}\n.glyphicon-picture:before {\n  content: \"\\e060\";\n}\n.glyphicon-map-marker:before {\n  content: \"\\e062\";\n}\n.glyphicon-adjust:before {\n  content: \"\\e063\";\n}\n.glyphicon-tint:before {\n  content: \"\\e064\";\n}\n.glyphicon-edit:before {\n  content: \"\\e065\";\n}\n.glyphicon-share:before {\n  content: \"\\e066\";\n}\n.glyphicon-check:before {\n  content: \"\\e067\";\n}\n.glyphicon-move:before {\n  content: \"\\e068\";\n}\n.glyphicon-step-backward:before {\n  content: \"\\e069\";\n}\n.glyphicon-fast-backward:before {\n  content: \"\\e070\";\n}\n.glyphicon-backward:before {\n  content: \"\\e071\";\n}\n.glyphicon-play:before {\n  content: \"\\e072\";\n}\n.glyphicon-pause:before {\n  content: \"\\e073\";\n}\n.glyphicon-stop:before {\n  content: \"\\e074\";\n}\n.glyphicon-forward:before {\n  content: \"\\e075\";\n}\n.glyphicon-fast-forward:before {\n  content: \"\\e076\";\n}\n.glyphicon-step-forward:before {\n  content: \"\\e077\";\n}\n.glyphicon-eject:before {\n  content: \"\\e078\";\n}\n.glyphicon-chevron-left:before {\n  content: \"\\e079\";\n}\n.glyphicon-chevron-right:before {\n  content: \"\\e080\";\n}\n.glyphicon-plus-sign:before {\n  content: \"\\e081\";\n}\n.glyphicon-minus-sign:before {\n  content: \"\\e082\";\n}\n.glyphicon-remove-sign:before {\n  content: \"\\e083\";\n}\n.glyphicon-ok-sign:before {\n  content: \"\\e084\";\n}\n.glyphicon-question-sign:before {\n  content: \"\\e085\";\n}\n.glyphicon-info-sign:before {\n  content: \"\\e086\";\n}\n.glyphicon-screenshot:before {\n  content: \"\\e087\";\n}\n.glyphicon-remove-circle:before {\n  content: \"\\e088\";\n}\n.glyphicon-ok-circle:before {\n  content: \"\\e089\";\n}\n.glyphicon-ban-circle:before {\n  content: \"\\e090\";\n}\n.glyphicon-arrow-left:before {\n  content: \"\\e091\";\n}\n.glyphicon-arrow-right:before {\n  content: \"\\e092\";\n}\n.glyphicon-arrow-up:before {\n  content: \"\\e093\";\n}\n.glyphicon-arrow-down:before {\n  content: \"\\e094\";\n}\n.glyphicon-share-alt:before {\n  content: \"\\e095\";\n}\n.glyphicon-resize-full:before {\n  content: \"\\e096\";\n}\n.glyphicon-resize-small:before {\n  content: \"\\e097\";\n}\n.glyphicon-exclamation-sign:before {\n  content: \"\\e101\";\n}\n.glyphicon-gift:before {\n  content: \"\\e102\";\n}\n.glyphicon-leaf:before {\n  content: \"\\e103\";\n}\n.glyphicon-fire:before {\n  content: \"\\e104\";\n}\n.glyphicon-eye-open:before {\n  content: \"\\e105\";\n}\n.glyphicon-eye-close:before {\n  content: \"\\e106\";\n}\n.glyphicon-warning-sign:before {\n  content: \"\\e107\";\n}\n.glyphicon-plane:before {\n  content: \"\\e108\";\n}\n.glyphicon-calendar:before {\n  content: \"\\e109\";\n}\n.glyphicon-random:before {\n  content: \"\\e110\";\n}\n.glyphicon-comment:before {\n  content: \"\\e111\";\n}\n.glyphicon-magnet:before {\n  content: \"\\e112\";\n}\n.glyphicon-chevron-up:before {\n  content: \"\\e113\";\n}\n.glyphicon-chevron-down:before {\n  content: \"\\e114\";\n}\n.glyphicon-retweet:before {\n  content: \"\\e115\";\n}\n.glyphicon-shopping-cart:before {\n  content: \"\\e116\";\n}\n.glyphicon-folder-close:before {\n  content: \"\\e117\";\n}\n.glyphicon-folder-open:before {\n  content: \"\\e118\";\n}\n.glyphicon-resize-vertical:before {\n  content: \"\\e119\";\n}\n.glyphicon-resize-horizontal:before {\n  content: \"\\e120\";\n}\n.glyphicon-hdd:before {\n  content: \"\\e121\";\n}\n.glyphicon-bullhorn:before {\n  content: \"\\e122\";\n}\n.glyphicon-bell:before {\n  content: \"\\e123\";\n}\n.glyphicon-certificate:before {\n  content: \"\\e124\";\n}\n.glyphicon-thumbs-up:before {\n  content: \"\\e125\";\n}\n.glyphicon-thumbs-down:before {\n  content: \"\\e126\";\n}\n.glyphicon-hand-right:before {\n  content: \"\\e127\";\n}\n.glyphicon-hand-left:before {\n  content: \"\\e128\";\n}\n.glyphicon-hand-up:before {\n  content: \"\\e129\";\n}\n.glyphicon-hand-down:before {\n  content: \"\\e130\";\n}\n.glyphicon-circle-arrow-right:before {\n  content: \"\\e131\";\n}\n.glyphicon-circle-arrow-left:before {\n  content: \"\\e132\";\n}\n.glyphicon-circle-arrow-up:before {\n  content: \"\\e133\";\n}\n.glyphicon-circle-arrow-down:before {\n  content: \"\\e134\";\n}\n.glyphicon-globe:before {\n  content: \"\\e135\";\n}\n.glyphicon-wrench:before {\n  content: \"\\e136\";\n}\n.glyphicon-tasks:before {\n  content: \"\\e137\";\n}\n.glyphicon-filter:before {\n  content: \"\\e138\";\n}\n.glyphicon-briefcase:before {\n  content: \"\\e139\";\n}\n.glyphicon-fullscreen:before {\n  content: \"\\e140\";\n}\n.glyphicon-dashboard:before {\n  content: \"\\e141\";\n}\n.glyphicon-paperclip:before {\n  content: \"\\e142\";\n}\n.glyphicon-heart-empty:before {\n  content: \"\\e143\";\n}\n.glyphicon-link:before {\n  content: \"\\e144\";\n}\n.glyphicon-phone:before {\n  content: \"\\e145\";\n}\n.glyphicon-pushpin:before {\n  content: \"\\e146\";\n}\n.glyphicon-usd:before {\n  content: \"\\e148\";\n}\n.glyphicon-gbp:before {\n  content: \"\\e149\";\n}\n.glyphicon-sort:before {\n  content: \"\\e150\";\n}\n.glyphicon-sort-by-alphabet:before {\n  content: \"\\e151\";\n}\n.glyphicon-sort-by-alphabet-alt:before {\n  content: \"\\e152\";\n}\n.glyphicon-sort-by-order:before {\n  content: \"\\e153\";\n}\n.glyphicon-sort-by-order-alt:before {\n  content: \"\\e154\";\n}\n.glyphicon-sort-by-attributes:before {\n  content: \"\\e155\";\n}\n.glyphicon-sort-by-attributes-alt:before {\n  content: \"\\e156\";\n}\n.glyphicon-unchecked:before {\n  content: \"\\e157\";\n}\n.glyphicon-expand:before {\n  content: \"\\e158\";\n}\n.glyphicon-collapse-down:before {\n  content: \"\\e159\";\n}\n.glyphicon-collapse-up:before {\n  content: \"\\e160\";\n}\n.glyphicon-log-in:before {\n  content: \"\\e161\";\n}\n.glyphicon-flash:before {\n  content: \"\\e162\";\n}\n.glyphicon-log-out:before {\n  content: \"\\e163\";\n}\n.glyphicon-new-window:before {\n  content: \"\\e164\";\n}\n.glyphicon-record:before {\n  content: \"\\e165\";\n}\n.glyphicon-save:before {\n  content: \"\\e166\";\n}\n.glyphicon-open:before {\n  content: \"\\e167\";\n}\n.glyphicon-saved:before {\n  content: \"\\e168\";\n}\n.glyphicon-import:before {\n  content: \"\\e169\";\n}\n.glyphicon-export:before {\n  content: \"\\e170\";\n}\n.glyphicon-send:before {\n  content: \"\\e171\";\n}\n.glyphicon-floppy-disk:before {\n  content: \"\\e172\";\n}\n.glyphicon-floppy-saved:before {\n  content: \"\\e173\";\n}\n.glyphicon-floppy-remove:before {\n  content: \"\\e174\";\n}\n.glyphicon-floppy-save:before {\n  content: \"\\e175\";\n}\n.glyphicon-floppy-open:before {\n  content: \"\\e176\";\n}\n.glyphicon-credit-card:before {\n  content: \"\\e177\";\n}\n.glyphicon-transfer:before {\n  content: \"\\e178\";\n}\n.glyphicon-cutlery:before {\n  content: \"\\e179\";\n}\n.glyphicon-header:before {\n  content: \"\\e180\";\n}\n.glyphicon-compressed:before {\n  content: \"\\e181\";\n}\n.glyphicon-earphone:before {\n  content: \"\\e182\";\n}\n.glyphicon-phone-alt:before {\n  content: \"\\e183\";\n}\n.glyphicon-tower:before {\n  content: \"\\e184\";\n}\n.glyphicon-stats:before {\n  content: \"\\e185\";\n}\n.glyphicon-sd-video:before {\n  content: \"\\e186\";\n}\n.glyphicon-hd-video:before {\n  content: \"\\e187\";\n}\n.glyphicon-subtitles:before {\n  content: \"\\e188\";\n}\n.glyphicon-sound-stereo:before {\n  content: \"\\e189\";\n}\n.glyphicon-sound-dolby:before {\n  content: \"\\e190\";\n}\n.glyphicon-sound-5-1:before {\n  content: \"\\e191\";\n}\n.glyphicon-sound-6-1:before {\n  content: \"\\e192\";\n}\n.glyphicon-sound-7-1:before {\n  content: \"\\e193\";\n}\n.glyphicon-copyright-mark:before {\n  content: \"\\e194\";\n}\n.glyphicon-registration-mark:before {\n  content: \"\\e195\";\n}\n.glyphicon-cloud-download:before {\n  content: \"\\e197\";\n}\n.glyphicon-cloud-upload:before {\n  content: \"\\e198\";\n}\n.glyphicon-tree-conifer:before {\n  content: \"\\e199\";\n}\n.glyphicon-tree-deciduous:before {\n  content: \"\\e200\";\n}\n.glyphicon-cd:before {\n  content: \"\\e201\";\n}\n.glyphicon-save-file:before {\n  content: \"\\e202\";\n}\n.glyphicon-open-file:before {\n  content: \"\\e203\";\n}\n.glyphicon-level-up:before {\n  content: \"\\e204\";\n}\n.glyphicon-copy:before {\n  content: \"\\e205\";\n}\n.glyphicon-paste:before {\n  content: \"\\e206\";\n}\n.glyphicon-alert:before {\n  content: \"\\e209\";\n}\n.glyphicon-equalizer:before {\n  content: \"\\e210\";\n}\n.glyphicon-king:before {\n  content: \"\\e211\";\n}\n.glyphicon-queen:before {\n  content: \"\\e212\";\n}\n.glyphicon-pawn:before {\n  content: \"\\e213\";\n}\n.glyphicon-bishop:before {\n  content: \"\\e214\";\n}\n.glyphicon-knight:before {\n  content: \"\\e215\";\n}\n.glyphicon-baby-formula:before {\n  content: \"\\e216\";\n}\n.glyphicon-tent:before {\n  content: \"\\26fa\";\n}\n.glyphicon-blackboard:before {\n  content: \"\\e218\";\n}\n.glyphicon-bed:before {\n  content: \"\\e219\";\n}\n.glyphicon-apple:before {\n  content: \"\\f8ff\";\n}\n.glyphicon-erase:before {\n  content: \"\\e221\";\n}\n.glyphicon-hourglass:before {\n  content: \"\\231b\";\n}\n.glyphicon-lamp:before {\n  content: \"\\e223\";\n}\n.glyphicon-duplicate:before {\n  content: \"\\e224\";\n}\n.glyphicon-piggy-bank:before {\n  content: \"\\e225\";\n}\n.glyphicon-scissors:before {\n  content: \"\\e226\";\n}\n.glyphicon-bitcoin:before {\n  content: \"\\e227\";\n}\n.glyphicon-btc:before {\n  content: \"\\e227\";\n}\n.glyphicon-xbt:before {\n  content: \"\\e227\";\n}\n.glyphicon-yen:before {\n  content: \"\\00a5\";\n}\n.glyphicon-jpy:before {\n  content: \"\\00a5\";\n}\n.glyphicon-ruble:before {\n  content: \"\\20bd\";\n}\n.glyphicon-rub:before {\n  content: \"\\20bd\";\n}\n.glyphicon-scale:before {\n  content: \"\\e230\";\n}\n.glyphicon-ice-lolly:before {\n  content: \"\\e231\";\n}\n.glyphicon-ice-lolly-tasted:before {\n  content: \"\\e232\";\n}\n.glyphicon-education:before {\n  content: \"\\e233\";\n}\n.glyphicon-option-horizontal:before {\n  content: \"\\e234\";\n}\n.glyphicon-option-vertical:before {\n  content: \"\\e235\";\n}\n.glyphicon-menu-hamburger:before {\n  content: \"\\e236\";\n}\n.glyphicon-modal-window:before {\n  content: \"\\e237\";\n}\n.glyphicon-oil:before {\n  content: \"\\e238\";\n}\n.glyphicon-grain:before {\n  content: \"\\e239\";\n}\n.glyphicon-sunglasses:before {\n  content: \"\\e240\";\n}\n.glyphicon-text-size:before {\n  content: \"\\e241\";\n}\n.glyphicon-text-color:before {\n  content: \"\\e242\";\n}\n.glyphicon-text-background:before {\n  content: \"\\e243\";\n}\n.glyphicon-object-align-top:before {\n  content: \"\\e244\";\n}\n.glyphicon-object-align-bottom:before {\n  content: \"\\e245\";\n}\n.glyphicon-object-align-horizontal:before {\n  content: \"\\e246\";\n}\n.glyphicon-object-align-left:before {\n  content: \"\\e247\";\n}\n.glyphicon-object-align-vertical:before {\n  content: \"\\e248\";\n}\n.glyphicon-object-align-right:before {\n  content: \"\\e249\";\n}\n.glyphicon-triangle-right:before {\n  content: \"\\e250\";\n}\n.glyphicon-triangle-left:before {\n  content: \"\\e251\";\n}\n.glyphicon-triangle-bottom:before {\n  content: \"\\e252\";\n}\n.glyphicon-triangle-top:before {\n  content: \"\\e253\";\n}\n.glyphicon-console:before {\n  content: \"\\e254\";\n}\n.glyphicon-superscript:before {\n  content: \"\\e255\";\n}\n.glyphicon-subscript:before {\n  content: \"\\e256\";\n}\n.glyphicon-menu-left:before {\n  content: \"\\e257\";\n}\n.glyphicon-menu-right:before {\n  content: \"\\e258\";\n}\n.glyphicon-menu-down:before {\n  content: \"\\e259\";\n}\n.glyphicon-menu-up:before {\n  content: \"\\e260\";\n}\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n*:before,\n*:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\nhtml {\n  font-size: 10px;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #333333;\n  background-color: #fff;\n}\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\na {\n  color: #5db0e1;\n  text-decoration: none;\n}\na:hover,\na:focus {\n  color: #268ecc;\n  text-decoration: underline;\n}\na:focus {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\nfigure {\n  margin: 0;\n}\nimg {\n  vertical-align: middle;\n}\n.img-responsive,\n.thumbnail > img,\n.thumbnail a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n.img-rounded {\n  border-radius: 6px;\n}\n.img-thumbnail {\n  padding: 4px;\n  line-height: 1.42857143;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -o-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n  -moz-transition: all 0.2s ease-in-out;\n  -webkit-transition: all 0.2s ease-in-out;\n  display: inline-block;\n  max-width: 100%;\n  height: auto;\n}\n.img-circle {\n  border-radius: 50%;\n}\nhr {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border: 0;\n  border-top: 1px solid #f6f6f6;\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n[role=\"button\"] {\n  cursor: pointer;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n}\nh1 small,\nh2 small,\nh3 small,\nh4 small,\nh5 small,\nh6 small,\n.h1 small,\n.h2 small,\n.h3 small,\n.h4 small,\n.h5 small,\n.h6 small,\nh1 .small,\nh2 .small,\nh3 .small,\nh4 .small,\nh5 .small,\nh6 .small,\n.h1 .small,\n.h2 .small,\n.h3 .small,\n.h4 .small,\n.h5 .small,\n.h6 .small {\n  font-weight: normal;\n  line-height: 1;\n  color: #c8c8c8;\n}\nh1,\n.h1,\nh2,\n.h2,\nh3,\n.h3 {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\nh1 small,\n.h1 small,\nh2 small,\n.h2 small,\nh3 small,\n.h3 small,\nh1 .small,\n.h1 .small,\nh2 .small,\n.h2 .small,\nh3 .small,\n.h3 .small {\n  font-size: 65%;\n}\nh4,\n.h4,\nh5,\n.h5,\nh6,\n.h6 {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\nh4 small,\n.h4 small,\nh5 small,\n.h5 small,\nh6 small,\n.h6 small,\nh4 .small,\n.h4 .small,\nh5 .small,\n.h5 .small,\nh6 .small,\n.h6 .small {\n  font-size: 75%;\n}\nh1,\n.h1 {\n  font-size: 36px;\n}\nh2,\n.h2 {\n  font-size: 30px;\n}\nh3,\n.h3 {\n  font-size: 24px;\n}\nh4,\n.h4 {\n  font-size: 18px;\n}\nh5,\n.h5 {\n  font-size: 14px;\n}\nh6,\n.h6 {\n  font-size: 12px;\n}\np {\n  margin: 0 0 10px;\n}\n.lead {\n  margin-bottom: 20px;\n  font-size: 16px;\n  font-weight: 300;\n  line-height: 1.4;\n}\n@media (min-width: 768px) {\n  .lead {\n    font-size: 21px;\n  }\n}\nsmall,\n.small {\n  font-size: 85%;\n}\nmark,\n.mark {\n  background-color: #fcf8e3;\n  padding: .2em;\n}\n.text-left {\n  text-align: left;\n}\n.text-right {\n  text-align: right;\n}\n.text-center {\n  text-align: center;\n}\n.text-justify {\n  text-align: justify;\n}\n.text-nowrap {\n  white-space: nowrap;\n}\n.text-lowercase {\n  text-transform: lowercase;\n}\n.text-uppercase {\n  text-transform: uppercase;\n}\n.text-capitalize {\n  text-transform: capitalize;\n}\n.text-muted {\n  color: #c8c8c8;\n}\n.text-primary {\n  color: #5db0e1;\n}\na.text-primary:hover,\na.text-primary:focus {\n  color: #329bd9;\n}\n.text-success {\n  color: #3c763d;\n}\na.text-success:hover,\na.text-success:focus {\n  color: #2b542c;\n}\n.text-info {\n  color: #31708f;\n}\na.text-info:hover,\na.text-info:focus {\n  color: #245269;\n}\n.text-warning {\n  color: #8a6d3b;\n}\na.text-warning:hover,\na.text-warning:focus {\n  color: #66512c;\n}\n.text-danger {\n  color: #a94442;\n}\na.text-danger:hover,\na.text-danger:focus {\n  color: #843534;\n}\n.bg-primary {\n  color: #fff;\n  background-color: #5db0e1;\n}\na.bg-primary:hover,\na.bg-primary:focus {\n  background-color: #329bd9;\n}\n.bg-success {\n  background-color: #dff0d8;\n}\na.bg-success:hover,\na.bg-success:focus {\n  background-color: #c1e2b3;\n}\n.bg-info {\n  background-color: #d9edf7;\n}\na.bg-info:hover,\na.bg-info:focus {\n  background-color: #afd9ee;\n}\n.bg-warning {\n  background-color: #fcf8e3;\n}\na.bg-warning:hover,\na.bg-warning:focus {\n  background-color: #f7ecb5;\n}\n.bg-danger {\n  background-color: #f2dede;\n}\na.bg-danger:hover,\na.bg-danger:focus {\n  background-color: #e4b9b9;\n}\n.page-header {\n  padding-bottom: 9px;\n  margin: 40px 0 20px;\n  border-bottom: 1px solid #f6f6f6;\n}\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 10px;\n}\nul ul,\nol ul,\nul ol,\nol ol {\n  margin-bottom: 0;\n}\n.list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n  margin-left: -5px;\n}\n.list-inline > li {\n  display: inline-block;\n  padding-left: 5px;\n  padding-right: 5px;\n}\ndl {\n  margin-top: 0;\n  margin-bottom: 20px;\n}\ndt,\ndd {\n  line-height: 1.42857143;\n}\ndt {\n  font-weight: bold;\n}\ndd {\n  margin-left: 0;\n}\n@media (min-width: 768px) {\n  .dl-horizontal dt {\n    float: left;\n    width: 160px;\n    clear: left;\n    text-align: right;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .dl-horizontal dd {\n    margin-left: 180px;\n  }\n}\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #c8c8c8;\n}\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase;\n}\nblockquote {\n  padding: 10px 20px;\n  margin: 0 0 20px;\n  font-size: 17.5px;\n  border-left: 5px solid #f6f6f6;\n}\nblockquote p:last-child,\nblockquote ul:last-child,\nblockquote ol:last-child {\n  margin-bottom: 0;\n}\nblockquote footer,\nblockquote small,\nblockquote .small {\n  display: block;\n  font-size: 80%;\n  line-height: 1.42857143;\n  color: #c8c8c8;\n}\nblockquote footer:before,\nblockquote small:before,\nblockquote .small:before {\n  content: '\\2014 \\00A0';\n}\n.blockquote-reverse,\nblockquote.pull-right {\n  padding-right: 15px;\n  padding-left: 0;\n  border-right: 5px solid #f6f6f6;\n  border-left: 0;\n  text-align: right;\n}\n.blockquote-reverse footer:before,\nblockquote.pull-right footer:before,\n.blockquote-reverse small:before,\nblockquote.pull-right small:before,\n.blockquote-reverse .small:before,\nblockquote.pull-right .small:before {\n  content: '';\n}\n.blockquote-reverse footer:after,\nblockquote.pull-right footer:after,\n.blockquote-reverse small:after,\nblockquote.pull-right small:after,\n.blockquote-reverse .small:after,\nblockquote.pull-right .small:after {\n  content: '\\00A0 \\2014';\n}\naddress {\n  margin-bottom: 20px;\n  font-style: normal;\n  line-height: 1.42857143;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\n}\ncode {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #c7254e;\n  background-color: #f9f2f4;\n  border-radius: 4px;\n}\nkbd {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\nkbd kbd {\n  padding: 0;\n  font-size: 100%;\n  font-weight: bold;\n  box-shadow: none;\n}\npre {\n  display: block;\n  padding: 9.5px;\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.42857143;\n  word-break: break-all;\n  word-wrap: break-word;\n  color: #333333;\n  background-color: #f5f5f5;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\npre code {\n  padding: 0;\n  font-size: inherit;\n  color: inherit;\n  white-space: pre-wrap;\n  background-color: transparent;\n  border-radius: 0;\n}\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll;\n}\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n@media (min-width: 768px) {\n  .container {\n    width: 750px;\n  }\n}\n@media (min-width: 992px) {\n  .container {\n    width: 970px;\n  }\n}\n@media (min-width: 1200px) {\n  .container {\n    width: 1170px;\n  }\n}\n.container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.row {\n  margin-left: -15px;\n  margin-right: -15px;\n}\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left;\n}\n.col-xs-12 {\n  width: 100%;\n}\n.col-xs-11 {\n  width: 91.66666667%;\n}\n.col-xs-10 {\n  width: 83.33333333%;\n}\n.col-xs-9 {\n  width: 75%;\n}\n.col-xs-8 {\n  width: 66.66666667%;\n}\n.col-xs-7 {\n  width: 58.33333333%;\n}\n.col-xs-6 {\n  width: 50%;\n}\n.col-xs-5 {\n  width: 41.66666667%;\n}\n.col-xs-4 {\n  width: 33.33333333%;\n}\n.col-xs-3 {\n  width: 25%;\n}\n.col-xs-2 {\n  width: 16.66666667%;\n}\n.col-xs-1 {\n  width: 8.33333333%;\n}\n.col-xs-pull-12 {\n  right: 100%;\n}\n.col-xs-pull-11 {\n  right: 91.66666667%;\n}\n.col-xs-pull-10 {\n  right: 83.33333333%;\n}\n.col-xs-pull-9 {\n  right: 75%;\n}\n.col-xs-pull-8 {\n  right: 66.66666667%;\n}\n.col-xs-pull-7 {\n  right: 58.33333333%;\n}\n.col-xs-pull-6 {\n  right: 50%;\n}\n.col-xs-pull-5 {\n  right: 41.66666667%;\n}\n.col-xs-pull-4 {\n  right: 33.33333333%;\n}\n.col-xs-pull-3 {\n  right: 25%;\n}\n.col-xs-pull-2 {\n  right: 16.66666667%;\n}\n.col-xs-pull-1 {\n  right: 8.33333333%;\n}\n.col-xs-pull-0 {\n  right: auto;\n}\n.col-xs-push-12 {\n  left: 100%;\n}\n.col-xs-push-11 {\n  left: 91.66666667%;\n}\n.col-xs-push-10 {\n  left: 83.33333333%;\n}\n.col-xs-push-9 {\n  left: 75%;\n}\n.col-xs-push-8 {\n  left: 66.66666667%;\n}\n.col-xs-push-7 {\n  left: 58.33333333%;\n}\n.col-xs-push-6 {\n  left: 50%;\n}\n.col-xs-push-5 {\n  left: 41.66666667%;\n}\n.col-xs-push-4 {\n  left: 33.33333333%;\n}\n.col-xs-push-3 {\n  left: 25%;\n}\n.col-xs-push-2 {\n  left: 16.66666667%;\n}\n.col-xs-push-1 {\n  left: 8.33333333%;\n}\n.col-xs-push-0 {\n  left: auto;\n}\n.col-xs-offset-12 {\n  margin-left: 100%;\n}\n.col-xs-offset-11 {\n  margin-left: 91.66666667%;\n}\n.col-xs-offset-10 {\n  margin-left: 83.33333333%;\n}\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n.col-xs-offset-8 {\n  margin-left: 66.66666667%;\n}\n.col-xs-offset-7 {\n  margin-left: 58.33333333%;\n}\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n.col-xs-offset-5 {\n  margin-left: 41.66666667%;\n}\n.col-xs-offset-4 {\n  margin-left: 33.33333333%;\n}\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n.col-xs-offset-2 {\n  margin-left: 16.66666667%;\n}\n.col-xs-offset-1 {\n  margin-left: 8.33333333%;\n}\n.col-xs-offset-0 {\n  margin-left: 0%;\n}\n@media (min-width: 768px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left;\n  }\n  .col-sm-12 {\n    width: 100%;\n  }\n  .col-sm-11 {\n    width: 91.66666667%;\n  }\n  .col-sm-10 {\n    width: 83.33333333%;\n  }\n  .col-sm-9 {\n    width: 75%;\n  }\n  .col-sm-8 {\n    width: 66.66666667%;\n  }\n  .col-sm-7 {\n    width: 58.33333333%;\n  }\n  .col-sm-6 {\n    width: 50%;\n  }\n  .col-sm-5 {\n    width: 41.66666667%;\n  }\n  .col-sm-4 {\n    width: 33.33333333%;\n  }\n  .col-sm-3 {\n    width: 25%;\n  }\n  .col-sm-2 {\n    width: 16.66666667%;\n  }\n  .col-sm-1 {\n    width: 8.33333333%;\n  }\n  .col-sm-pull-12 {\n    right: 100%;\n  }\n  .col-sm-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-sm-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-sm-pull-9 {\n    right: 75%;\n  }\n  .col-sm-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-sm-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-sm-pull-6 {\n    right: 50%;\n  }\n  .col-sm-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-sm-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-sm-pull-3 {\n    right: 25%;\n  }\n  .col-sm-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-sm-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-sm-pull-0 {\n    right: auto;\n  }\n  .col-sm-push-12 {\n    left: 100%;\n  }\n  .col-sm-push-11 {\n    left: 91.66666667%;\n  }\n  .col-sm-push-10 {\n    left: 83.33333333%;\n  }\n  .col-sm-push-9 {\n    left: 75%;\n  }\n  .col-sm-push-8 {\n    left: 66.66666667%;\n  }\n  .col-sm-push-7 {\n    left: 58.33333333%;\n  }\n  .col-sm-push-6 {\n    left: 50%;\n  }\n  .col-sm-push-5 {\n    left: 41.66666667%;\n  }\n  .col-sm-push-4 {\n    left: 33.33333333%;\n  }\n  .col-sm-push-3 {\n    left: 25%;\n  }\n  .col-sm-push-2 {\n    left: 16.66666667%;\n  }\n  .col-sm-push-1 {\n    left: 8.33333333%;\n  }\n  .col-sm-push-0 {\n    left: auto;\n  }\n  .col-sm-offset-12 {\n    margin-left: 100%;\n  }\n  .col-sm-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-sm-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-sm-offset-9 {\n    margin-left: 75%;\n  }\n  .col-sm-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-sm-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-sm-offset-6 {\n    margin-left: 50%;\n  }\n  .col-sm-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-sm-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-sm-offset-3 {\n    margin-left: 25%;\n  }\n  .col-sm-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-sm-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-sm-offset-0 {\n    margin-left: 0%;\n  }\n}\n@media (min-width: 992px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left;\n  }\n  .col-md-12 {\n    width: 100%;\n  }\n  .col-md-11 {\n    width: 91.66666667%;\n  }\n  .col-md-10 {\n    width: 83.33333333%;\n  }\n  .col-md-9 {\n    width: 75%;\n  }\n  .col-md-8 {\n    width: 66.66666667%;\n  }\n  .col-md-7 {\n    width: 58.33333333%;\n  }\n  .col-md-6 {\n    width: 50%;\n  }\n  .col-md-5 {\n    width: 41.66666667%;\n  }\n  .col-md-4 {\n    width: 33.33333333%;\n  }\n  .col-md-3 {\n    width: 25%;\n  }\n  .col-md-2 {\n    width: 16.66666667%;\n  }\n  .col-md-1 {\n    width: 8.33333333%;\n  }\n  .col-md-pull-12 {\n    right: 100%;\n  }\n  .col-md-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-md-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-md-pull-9 {\n    right: 75%;\n  }\n  .col-md-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-md-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-md-pull-6 {\n    right: 50%;\n  }\n  .col-md-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-md-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-md-pull-3 {\n    right: 25%;\n  }\n  .col-md-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-md-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-md-pull-0 {\n    right: auto;\n  }\n  .col-md-push-12 {\n    left: 100%;\n  }\n  .col-md-push-11 {\n    left: 91.66666667%;\n  }\n  .col-md-push-10 {\n    left: 83.33333333%;\n  }\n  .col-md-push-9 {\n    left: 75%;\n  }\n  .col-md-push-8 {\n    left: 66.66666667%;\n  }\n  .col-md-push-7 {\n    left: 58.33333333%;\n  }\n  .col-md-push-6 {\n    left: 50%;\n  }\n  .col-md-push-5 {\n    left: 41.66666667%;\n  }\n  .col-md-push-4 {\n    left: 33.33333333%;\n  }\n  .col-md-push-3 {\n    left: 25%;\n  }\n  .col-md-push-2 {\n    left: 16.66666667%;\n  }\n  .col-md-push-1 {\n    left: 8.33333333%;\n  }\n  .col-md-push-0 {\n    left: auto;\n  }\n  .col-md-offset-12 {\n    margin-left: 100%;\n  }\n  .col-md-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-md-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-md-offset-9 {\n    margin-left: 75%;\n  }\n  .col-md-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-md-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-md-offset-6 {\n    margin-left: 50%;\n  }\n  .col-md-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-md-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-md-offset-3 {\n    margin-left: 25%;\n  }\n  .col-md-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-md-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-md-offset-0 {\n    margin-left: 0%;\n  }\n}\n@media (min-width: 1200px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left;\n  }\n  .col-lg-12 {\n    width: 100%;\n  }\n  .col-lg-11 {\n    width: 91.66666667%;\n  }\n  .col-lg-10 {\n    width: 83.33333333%;\n  }\n  .col-lg-9 {\n    width: 75%;\n  }\n  .col-lg-8 {\n    width: 66.66666667%;\n  }\n  .col-lg-7 {\n    width: 58.33333333%;\n  }\n  .col-lg-6 {\n    width: 50%;\n  }\n  .col-lg-5 {\n    width: 41.66666667%;\n  }\n  .col-lg-4 {\n    width: 33.33333333%;\n  }\n  .col-lg-3 {\n    width: 25%;\n  }\n  .col-lg-2 {\n    width: 16.66666667%;\n  }\n  .col-lg-1 {\n    width: 8.33333333%;\n  }\n  .col-lg-pull-12 {\n    right: 100%;\n  }\n  .col-lg-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-lg-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-lg-pull-9 {\n    right: 75%;\n  }\n  .col-lg-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-lg-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-lg-pull-6 {\n    right: 50%;\n  }\n  .col-lg-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-lg-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-lg-pull-3 {\n    right: 25%;\n  }\n  .col-lg-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-lg-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-lg-pull-0 {\n    right: auto;\n  }\n  .col-lg-push-12 {\n    left: 100%;\n  }\n  .col-lg-push-11 {\n    left: 91.66666667%;\n  }\n  .col-lg-push-10 {\n    left: 83.33333333%;\n  }\n  .col-lg-push-9 {\n    left: 75%;\n  }\n  .col-lg-push-8 {\n    left: 66.66666667%;\n  }\n  .col-lg-push-7 {\n    left: 58.33333333%;\n  }\n  .col-lg-push-6 {\n    left: 50%;\n  }\n  .col-lg-push-5 {\n    left: 41.66666667%;\n  }\n  .col-lg-push-4 {\n    left: 33.33333333%;\n  }\n  .col-lg-push-3 {\n    left: 25%;\n  }\n  .col-lg-push-2 {\n    left: 16.66666667%;\n  }\n  .col-lg-push-1 {\n    left: 8.33333333%;\n  }\n  .col-lg-push-0 {\n    left: auto;\n  }\n  .col-lg-offset-12 {\n    margin-left: 100%;\n  }\n  .col-lg-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-lg-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-lg-offset-9 {\n    margin-left: 75%;\n  }\n  .col-lg-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-lg-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-lg-offset-6 {\n    margin-left: 50%;\n  }\n  .col-lg-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-lg-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-lg-offset-3 {\n    margin-left: 25%;\n  }\n  .col-lg-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-lg-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-lg-offset-0 {\n    margin-left: 0%;\n  }\n}\ntable {\n  background-color: transparent;\n}\ncaption {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  color: #c8c8c8;\n  text-align: left;\n}\nth {\n  text-align: left;\n}\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 20px;\n}\n.table > thead > tr > th,\n.table > tbody > tr > th,\n.table > tfoot > tr > th,\n.table > thead > tr > td,\n.table > tbody > tr > td,\n.table > tfoot > tr > td {\n  padding: 8px;\n  line-height: 1.42857143;\n  vertical-align: top;\n  border-top: 1px solid #ddd;\n}\n.table > thead > tr > th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #ddd;\n}\n.table > caption + thead > tr:first-child > th,\n.table > colgroup + thead > tr:first-child > th,\n.table > thead:first-child > tr:first-child > th,\n.table > caption + thead > tr:first-child > td,\n.table > colgroup + thead > tr:first-child > td,\n.table > thead:first-child > tr:first-child > td {\n  border-top: 0;\n}\n.table > tbody + tbody {\n  border-top: 2px solid #ddd;\n}\n.table .table {\n  background-color: #fff;\n}\n.table-condensed > thead > tr > th,\n.table-condensed > tbody > tr > th,\n.table-condensed > tfoot > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > td {\n  padding: 5px;\n}\n.table-bordered {\n  border: 1px solid #ddd;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > tbody > tr > th,\n.table-bordered > tfoot > tr > th,\n.table-bordered > thead > tr > td,\n.table-bordered > tbody > tr > td,\n.table-bordered > tfoot > tr > td {\n  border: 1px solid #ddd;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > thead > tr > td {\n  border-bottom-width: 2px;\n}\n.table-striped > tbody > tr:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n.table-hover > tbody > tr:hover {\n  background-color: #f5f5f5;\n}\ntable col[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-column;\n}\ntable td[class*=\"col-\"],\ntable th[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-cell;\n}\n.table > thead > tr > td.active,\n.table > tbody > tr > td.active,\n.table > tfoot > tr > td.active,\n.table > thead > tr > th.active,\n.table > tbody > tr > th.active,\n.table > tfoot > tr > th.active,\n.table > thead > tr.active > td,\n.table > tbody > tr.active > td,\n.table > tfoot > tr.active > td,\n.table > thead > tr.active > th,\n.table > tbody > tr.active > th,\n.table > tfoot > tr.active > th {\n  background-color: #f5f5f5;\n}\n.table-hover > tbody > tr > td.active:hover,\n.table-hover > tbody > tr > th.active:hover,\n.table-hover > tbody > tr.active:hover > td,\n.table-hover > tbody > tr:hover > .active,\n.table-hover > tbody > tr.active:hover > th {\n  background-color: #e8e8e8;\n}\n.table > thead > tr > td.success,\n.table > tbody > tr > td.success,\n.table > tfoot > tr > td.success,\n.table > thead > tr > th.success,\n.table > tbody > tr > th.success,\n.table > tfoot > tr > th.success,\n.table > thead > tr.success > td,\n.table > tbody > tr.success > td,\n.table > tfoot > tr.success > td,\n.table > thead > tr.success > th,\n.table > tbody > tr.success > th,\n.table > tfoot > tr.success > th {\n  background-color: #dff0d8;\n}\n.table-hover > tbody > tr > td.success:hover,\n.table-hover > tbody > tr > th.success:hover,\n.table-hover > tbody > tr.success:hover > td,\n.table-hover > tbody > tr:hover > .success,\n.table-hover > tbody > tr.success:hover > th {\n  background-color: #d0e9c6;\n}\n.table > thead > tr > td.info,\n.table > tbody > tr > td.info,\n.table > tfoot > tr > td.info,\n.table > thead > tr > th.info,\n.table > tbody > tr > th.info,\n.table > tfoot > tr > th.info,\n.table > thead > tr.info > td,\n.table > tbody > tr.info > td,\n.table > tfoot > tr.info > td,\n.table > thead > tr.info > th,\n.table > tbody > tr.info > th,\n.table > tfoot > tr.info > th {\n  background-color: #d9edf7;\n}\n.table-hover > tbody > tr > td.info:hover,\n.table-hover > tbody > tr > th.info:hover,\n.table-hover > tbody > tr.info:hover > td,\n.table-hover > tbody > tr:hover > .info,\n.table-hover > tbody > tr.info:hover > th {\n  background-color: #c4e3f3;\n}\n.table > thead > tr > td.warning,\n.table > tbody > tr > td.warning,\n.table > tfoot > tr > td.warning,\n.table > thead > tr > th.warning,\n.table > tbody > tr > th.warning,\n.table > tfoot > tr > th.warning,\n.table > thead > tr.warning > td,\n.table > tbody > tr.warning > td,\n.table > tfoot > tr.warning > td,\n.table > thead > tr.warning > th,\n.table > tbody > tr.warning > th,\n.table > tfoot > tr.warning > th {\n  background-color: #fcf8e3;\n}\n.table-hover > tbody > tr > td.warning:hover,\n.table-hover > tbody > tr > th.warning:hover,\n.table-hover > tbody > tr.warning:hover > td,\n.table-hover > tbody > tr:hover > .warning,\n.table-hover > tbody > tr.warning:hover > th {\n  background-color: #faf2cc;\n}\n.table > thead > tr > td.danger,\n.table > tbody > tr > td.danger,\n.table > tfoot > tr > td.danger,\n.table > thead > tr > th.danger,\n.table > tbody > tr > th.danger,\n.table > tfoot > tr > th.danger,\n.table > thead > tr.danger > td,\n.table > tbody > tr.danger > td,\n.table > tfoot > tr.danger > td,\n.table > thead > tr.danger > th,\n.table > tbody > tr.danger > th,\n.table > tfoot > tr.danger > th {\n  background-color: #f2dede;\n}\n.table-hover > tbody > tr > td.danger:hover,\n.table-hover > tbody > tr > th.danger:hover,\n.table-hover > tbody > tr.danger:hover > td,\n.table-hover > tbody > tr:hover > .danger,\n.table-hover > tbody > tr.danger:hover > th {\n  background-color: #ebcccc;\n}\n.table-responsive {\n  overflow-x: auto;\n  min-height: 0.01%;\n}\n@media screen and (max-width: 767px) {\n  .table-responsive {\n    width: 100%;\n    margin-bottom: 15px;\n    overflow-y: hidden;\n    -ms-overflow-style: -ms-autohiding-scrollbar;\n    border: 1px solid #ddd;\n  }\n  .table-responsive > .table {\n    margin-bottom: 0;\n  }\n  .table-responsive > .table > thead > tr > th,\n  .table-responsive > .table > tbody > tr > th,\n  .table-responsive > .table > tfoot > tr > th,\n  .table-responsive > .table > thead > tr > td,\n  .table-responsive > .table > tbody > tr > td,\n  .table-responsive > .table > tfoot > tr > td {\n    white-space: nowrap;\n  }\n  .table-responsive > .table-bordered {\n    border: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:first-child,\n  .table-responsive > .table-bordered > tbody > tr > th:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n  .table-responsive > .table-bordered > thead > tr > td:first-child,\n  .table-responsive > .table-bordered > tbody > tr > td:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n    border-left: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:last-child,\n  .table-responsive > .table-bordered > tbody > tr > th:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n  .table-responsive > .table-bordered > thead > tr > td:last-child,\n  .table-responsive > .table-bordered > tbody > tr > td:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n    border-right: 0;\n  }\n  .table-responsive > .table-bordered > tbody > tr:last-child > th,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n  .table-responsive > .table-bordered > tbody > tr:last-child > td,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n    border-bottom: 0;\n  }\n}\nfieldset {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  min-width: 0;\n}\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 20px;\n  font-size: 21px;\n  line-height: inherit;\n  color: #333333;\n  border: 0;\n  border-bottom: 1px solid #e5e5e5;\n}\nlabel {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: bold;\n}\ninput[type=\"search\"] {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  margin-top: 1px \\9;\n  line-height: normal;\n}\ninput[type=\"file\"] {\n  display: block;\n}\ninput[type=\"range\"] {\n  display: block;\n  width: 100%;\n}\nselect[multiple],\nselect[size] {\n  height: auto;\n}\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\noutput {\n  display: block;\n  padding-top: 7px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #828282;\n}\n.form-control {\n  display: block;\n  width: 100%;\n  height: 34px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #828282;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n  -moz-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n  -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n}\n.form-control:focus {\n  border-color: #66afe9;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);\n  -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);\n  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);\n}\n.form-control::-moz-placeholder {\n  color: #999;\n  opacity: 1;\n}\n.form-control:-ms-input-placeholder {\n  color: #999;\n}\n.form-control::-webkit-input-placeholder {\n  color: #999;\n}\n.form-control::-ms-expand {\n  border: 0;\n  background-color: transparent;\n}\n.form-control[disabled],\n.form-control[readonly],\nfieldset[disabled] .form-control {\n  background-color: #f6f6f6;\n  opacity: 1;\n}\n.form-control[disabled],\nfieldset[disabled] .form-control {\n  cursor: not-allowed;\n}\ntextarea.form-control {\n  height: auto;\n}\ninput[type=\"search\"] {\n  -webkit-appearance: none;\n}\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 34px;\n  }\n  input[type=\"date\"].input-sm,\n  input[type=\"time\"].input-sm,\n  input[type=\"datetime-local\"].input-sm,\n  input[type=\"month\"].input-sm,\n  .input-group-sm input[type=\"date\"],\n  .input-group-sm input[type=\"time\"],\n  .input-group-sm input[type=\"datetime-local\"],\n  .input-group-sm input[type=\"month\"] {\n    line-height: 30px;\n  }\n  input[type=\"date\"].input-lg,\n  input[type=\"time\"].input-lg,\n  input[type=\"datetime-local\"].input-lg,\n  input[type=\"month\"].input-lg,\n  .input-group-lg input[type=\"date\"],\n  .input-group-lg input[type=\"time\"],\n  .input-group-lg input[type=\"datetime-local\"],\n  .input-group-lg input[type=\"month\"] {\n    line-height: 46px;\n  }\n}\n.form-group {\n  margin-bottom: 15px;\n}\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.radio label,\n.checkbox label {\n  min-height: 20px;\n  padding-left: 20px;\n  margin-bottom: 0;\n  font-weight: normal;\n  cursor: pointer;\n}\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px \\9;\n}\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -5px;\n}\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  font-weight: normal;\n  cursor: pointer;\n}\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: 10px;\n}\ninput[type=\"radio\"][disabled],\ninput[type=\"checkbox\"][disabled],\ninput[type=\"radio\"].disabled,\ninput[type=\"checkbox\"].disabled,\nfieldset[disabled] input[type=\"radio\"],\nfieldset[disabled] input[type=\"checkbox\"] {\n  cursor: not-allowed;\n}\n.radio-inline.disabled,\n.checkbox-inline.disabled,\nfieldset[disabled] .radio-inline,\nfieldset[disabled] .checkbox-inline {\n  cursor: not-allowed;\n}\n.radio.disabled label,\n.checkbox.disabled label,\nfieldset[disabled] .radio label,\nfieldset[disabled] .checkbox label {\n  cursor: not-allowed;\n}\n.form-control-static {\n  padding-top: 7px;\n  padding-bottom: 7px;\n  margin-bottom: 0;\n  min-height: 34px;\n}\n.form-control-static.input-lg,\n.form-control-static.input-sm {\n  padding-left: 0;\n  padding-right: 0;\n}\n.input-sm {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\nselect.input-sm {\n  height: 30px;\n  line-height: 30px;\n}\ntextarea.input-sm,\nselect[multiple].input-sm {\n  height: auto;\n}\n.form-group-sm .form-control {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.form-group-sm select.form-control {\n  height: 30px;\n  line-height: 30px;\n}\n.form-group-sm textarea.form-control,\n.form-group-sm select[multiple].form-control {\n  height: auto;\n}\n.form-group-sm .form-control-static {\n  height: 30px;\n  min-height: 32px;\n  padding: 6px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.input-lg {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\nselect.input-lg {\n  height: 46px;\n  line-height: 46px;\n}\ntextarea.input-lg,\nselect[multiple].input-lg {\n  height: auto;\n}\n.form-group-lg .form-control {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n.form-group-lg select.form-control {\n  height: 46px;\n  line-height: 46px;\n}\n.form-group-lg textarea.form-control,\n.form-group-lg select[multiple].form-control {\n  height: auto;\n}\n.form-group-lg .form-control-static {\n  height: 46px;\n  min-height: 38px;\n  padding: 11px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n.has-feedback {\n  position: relative;\n}\n.has-feedback .form-control {\n  padding-right: 42.5px;\n}\n.form-control-feedback {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  pointer-events: none;\n}\n.input-lg + .form-control-feedback,\n.input-group-lg + .form-control-feedback,\n.form-group-lg .form-control + .form-control-feedback {\n  width: 46px;\n  height: 46px;\n  line-height: 46px;\n}\n.input-sm + .form-control-feedback,\n.input-group-sm + .form-control-feedback,\n.form-group-sm .form-control + .form-control-feedback {\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n}\n.has-success .help-block,\n.has-success .control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #3c763d;\n}\n.has-success .form-control {\n  border-color: #3c763d;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n.has-success .form-control:focus {\n  border-color: #2b542c;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n}\n.has-success .input-group-addon {\n  color: #3c763d;\n  border-color: #3c763d;\n  background-color: #dff0d8;\n}\n.has-success .form-control-feedback {\n  color: #3c763d;\n}\n.has-warning .help-block,\n.has-warning .control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #8a6d3b;\n}\n.has-warning .form-control {\n  border-color: #8a6d3b;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n.has-warning .form-control:focus {\n  border-color: #66512c;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n}\n.has-warning .input-group-addon {\n  color: #8a6d3b;\n  border-color: #8a6d3b;\n  background-color: #fcf8e3;\n}\n.has-warning .form-control-feedback {\n  color: #8a6d3b;\n}\n.has-error .help-block,\n.has-error .control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #a94442;\n}\n.has-error .form-control {\n  border-color: #a94442;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n}\n.has-error .form-control:focus {\n  border-color: #843534;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n}\n.has-error .input-group-addon {\n  color: #a94442;\n  border-color: #a94442;\n  background-color: #f2dede;\n}\n.has-error .form-control-feedback {\n  color: #a94442;\n}\n.has-feedback label ~ .form-control-feedback {\n  top: 25px;\n}\n.has-feedback label.sr-only ~ .form-control-feedback {\n  top: 0;\n}\n.help-block {\n  display: block;\n  margin-top: 5px;\n  margin-bottom: 10px;\n  color: #737373;\n}\n@media (min-width: 768px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .form-inline .form-control-static {\n    display: inline-block;\n  }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .form-inline .input-group .input-group-addon,\n  .form-inline .input-group .input-group-btn,\n  .form-inline .input-group .form-control {\n    width: auto;\n  }\n  .form-inline .input-group > .form-control {\n    width: 100%;\n  }\n  .form-inline .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio label,\n  .form-inline .checkbox label {\n    padding-left: 0;\n  }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n.form-horizontal .radio,\n.form-horizontal .checkbox,\n.form-horizontal .radio-inline,\n.form-horizontal .checkbox-inline {\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 7px;\n}\n.form-horizontal .radio,\n.form-horizontal .checkbox {\n  min-height: 27px;\n}\n.form-horizontal .form-group {\n  margin-left: -15px;\n  margin-right: -15px;\n}\n@media (min-width: 768px) {\n  .form-horizontal .control-label {\n    text-align: right;\n    margin-bottom: 0;\n    padding-top: 7px;\n  }\n}\n.form-horizontal .has-feedback .form-control-feedback {\n  right: 15px;\n}\n@media (min-width: 768px) {\n  .form-horizontal .form-group-lg .control-label {\n    padding-top: 11px;\n    font-size: 18px;\n  }\n}\n@media (min-width: 768px) {\n  .form-horizontal .form-group-sm .control-label {\n    padding-top: 6px;\n    font-size: 12px;\n  }\n}\n.btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.btn:focus,\n.btn:active:focus,\n.btn.active:focus,\n.btn.focus,\n.btn:active.focus,\n.btn.active.focus {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n.btn:hover,\n.btn:focus,\n.btn.focus {\n  color: #333;\n  text-decoration: none;\n}\n.btn:active,\n.btn.active {\n  outline: 0;\n  background-image: none;\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  -moz-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n.btn.disabled,\n.btn[disabled],\nfieldset[disabled] .btn {\n  cursor: not-allowed;\n  opacity: 0.65;\n  filter: alpha(opacity=65);\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n}\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none;\n}\n.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-default:focus,\n.btn-default.focus {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #8c8c8c;\n}\n.btn-default:hover {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n.btn-default:active,\n.btn-default.active,\n.open > .dropdown-toggle.btn-default {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n.btn-default:active:hover,\n.btn-default.active:hover,\n.open > .dropdown-toggle.btn-default:hover,\n.btn-default:active:focus,\n.btn-default.active:focus,\n.open > .dropdown-toggle.btn-default:focus,\n.btn-default:active.focus,\n.btn-default.active.focus,\n.open > .dropdown-toggle.btn-default.focus {\n  color: #333;\n  background-color: #d4d4d4;\n  border-color: #8c8c8c;\n}\n.btn-default:active,\n.btn-default.active,\n.open > .dropdown-toggle.btn-default {\n  background-image: none;\n}\n.btn-default.disabled:hover,\n.btn-default[disabled]:hover,\nfieldset[disabled] .btn-default:hover,\n.btn-default.disabled:focus,\n.btn-default[disabled]:focus,\nfieldset[disabled] .btn-default:focus,\n.btn-default.disabled.focus,\n.btn-default[disabled].focus,\nfieldset[disabled] .btn-default.focus {\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-default .badge {\n  color: #fff;\n  background-color: #333;\n}\n.btn-primary {\n  color: #fff;\n  background-color: #5db0e1;\n  border-color: #47a6dd;\n}\n.btn-primary:focus,\n.btn-primary.focus {\n  color: #fff;\n  background-color: #329bd9;\n  border-color: #1a618b;\n}\n.btn-primary:hover {\n  color: #fff;\n  background-color: #329bd9;\n  border-color: #2488c3;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open > .dropdown-toggle.btn-primary {\n  color: #fff;\n  background-color: #329bd9;\n  border-color: #2488c3;\n}\n.btn-primary:active:hover,\n.btn-primary.active:hover,\n.open > .dropdown-toggle.btn-primary:hover,\n.btn-primary:active:focus,\n.btn-primary.active:focus,\n.open > .dropdown-toggle.btn-primary:focus,\n.btn-primary:active.focus,\n.btn-primary.active.focus,\n.open > .dropdown-toggle.btn-primary.focus {\n  color: #fff;\n  background-color: #2488c3;\n  border-color: #1a618b;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open > .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled.focus,\n.btn-primary[disabled].focus,\nfieldset[disabled] .btn-primary.focus {\n  background-color: #5db0e1;\n  border-color: #47a6dd;\n}\n.btn-primary .badge {\n  color: #5db0e1;\n  background-color: #fff;\n}\n.btn-success {\n  color: #fff;\n  background-color: #81bc41;\n  border-color: #74a93a;\n}\n.btn-success:focus,\n.btn-success.focus {\n  color: #fff;\n  background-color: #679634;\n  border-color: #334a1a;\n}\n.btn-success:hover {\n  color: #fff;\n  background-color: #679634;\n  border-color: #557c2b;\n}\n.btn-success:active,\n.btn-success.active,\n.open > .dropdown-toggle.btn-success {\n  color: #fff;\n  background-color: #679634;\n  border-color: #557c2b;\n}\n.btn-success:active:hover,\n.btn-success.active:hover,\n.open > .dropdown-toggle.btn-success:hover,\n.btn-success:active:focus,\n.btn-success.active:focus,\n.open > .dropdown-toggle.btn-success:focus,\n.btn-success:active.focus,\n.btn-success.active.focus,\n.open > .dropdown-toggle.btn-success.focus {\n  color: #fff;\n  background-color: #557c2b;\n  border-color: #334a1a;\n}\n.btn-success:active,\n.btn-success.active,\n.open > .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled.focus,\n.btn-success[disabled].focus,\nfieldset[disabled] .btn-success.focus {\n  background-color: #81bc41;\n  border-color: #74a93a;\n}\n.btn-success .badge {\n  color: #81bc41;\n  background-color: #fff;\n}\n.btn-info {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #46b8da;\n}\n.btn-info:focus,\n.btn-info.focus {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #1b6d85;\n}\n.btn-info:hover {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #269abc;\n}\n.btn-info:active,\n.btn-info.active,\n.open > .dropdown-toggle.btn-info {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #269abc;\n}\n.btn-info:active:hover,\n.btn-info.active:hover,\n.open > .dropdown-toggle.btn-info:hover,\n.btn-info:active:focus,\n.btn-info.active:focus,\n.open > .dropdown-toggle.btn-info:focus,\n.btn-info:active.focus,\n.btn-info.active.focus,\n.open > .dropdown-toggle.btn-info.focus {\n  color: #fff;\n  background-color: #269abc;\n  border-color: #1b6d85;\n}\n.btn-info:active,\n.btn-info.active,\n.open > .dropdown-toggle.btn-info {\n  background-image: none;\n}\n.btn-info.disabled:hover,\n.btn-info[disabled]:hover,\nfieldset[disabled] .btn-info:hover,\n.btn-info.disabled:focus,\n.btn-info[disabled]:focus,\nfieldset[disabled] .btn-info:focus,\n.btn-info.disabled.focus,\n.btn-info[disabled].focus,\nfieldset[disabled] .btn-info.focus {\n  background-color: #5bc0de;\n  border-color: #46b8da;\n}\n.btn-info .badge {\n  color: #5bc0de;\n  background-color: #fff;\n}\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n.btn-warning:focus,\n.btn-warning.focus {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #985f0d;\n}\n.btn-warning:hover {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n.btn-warning:active,\n.btn-warning.active,\n.open > .dropdown-toggle.btn-warning {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n.btn-warning:active:hover,\n.btn-warning.active:hover,\n.open > .dropdown-toggle.btn-warning:hover,\n.btn-warning:active:focus,\n.btn-warning.active:focus,\n.open > .dropdown-toggle.btn-warning:focus,\n.btn-warning:active.focus,\n.btn-warning.active.focus,\n.open > .dropdown-toggle.btn-warning.focus {\n  color: #fff;\n  background-color: #d58512;\n  border-color: #985f0d;\n}\n.btn-warning:active,\n.btn-warning.active,\n.open > .dropdown-toggle.btn-warning {\n  background-image: none;\n}\n.btn-warning.disabled:hover,\n.btn-warning[disabled]:hover,\nfieldset[disabled] .btn-warning:hover,\n.btn-warning.disabled:focus,\n.btn-warning[disabled]:focus,\nfieldset[disabled] .btn-warning:focus,\n.btn-warning.disabled.focus,\n.btn-warning[disabled].focus,\nfieldset[disabled] .btn-warning.focus {\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n.btn-warning .badge {\n  color: #f0ad4e;\n  background-color: #fff;\n}\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n.btn-danger:focus,\n.btn-danger.focus {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #761c19;\n}\n.btn-danger:hover {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n.btn-danger:active,\n.btn-danger.active,\n.open > .dropdown-toggle.btn-danger {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n.btn-danger:active:hover,\n.btn-danger.active:hover,\n.open > .dropdown-toggle.btn-danger:hover,\n.btn-danger:active:focus,\n.btn-danger.active:focus,\n.open > .dropdown-toggle.btn-danger:focus,\n.btn-danger:active.focus,\n.btn-danger.active.focus,\n.open > .dropdown-toggle.btn-danger.focus {\n  color: #fff;\n  background-color: #ac2925;\n  border-color: #761c19;\n}\n.btn-danger:active,\n.btn-danger.active,\n.open > .dropdown-toggle.btn-danger {\n  background-image: none;\n}\n.btn-danger.disabled:hover,\n.btn-danger[disabled]:hover,\nfieldset[disabled] .btn-danger:hover,\n.btn-danger.disabled:focus,\n.btn-danger[disabled]:focus,\nfieldset[disabled] .btn-danger:focus,\n.btn-danger.disabled.focus,\n.btn-danger[disabled].focus,\nfieldset[disabled] .btn-danger.focus {\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n.btn-danger .badge {\n  color: #d9534f;\n  background-color: #fff;\n}\n.btn-link {\n  color: #5db0e1;\n  font-weight: normal;\n  border-radius: 0;\n}\n.btn-link,\n.btn-link:active,\n.btn-link.active,\n.btn-link[disabled],\nfieldset[disabled] .btn-link {\n  background-color: transparent;\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n}\n.btn-link,\n.btn-link:hover,\n.btn-link:focus,\n.btn-link:active {\n  border-color: transparent;\n}\n.btn-link:hover,\n.btn-link:focus {\n  color: #268ecc;\n  text-decoration: underline;\n  background-color: transparent;\n}\n.btn-link[disabled]:hover,\nfieldset[disabled] .btn-link:hover,\n.btn-link[disabled]:focus,\nfieldset[disabled] .btn-link:focus {\n  color: #c8c8c8;\n  text-decoration: none;\n}\n.btn-lg,\n.btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n.btn-sm,\n.btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-xs,\n.btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-block {\n  display: block;\n  width: 100%;\n}\n.btn-block + .btn-block {\n  margin-top: 5px;\n}\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%;\n}\n.fade {\n  opacity: 0;\n  -o-transition: opacity 0.15s linear;\n  transition: opacity 0.15s linear;\n  -moz-transition: opacity 0.15s linear;\n  -webkit-transition: opacity 0.15s linear;\n}\n.fade.in {\n  opacity: 1;\n}\n.collapse {\n  display: none;\n}\n.collapse.in {\n  display: block;\n}\ntr.collapse.in {\n  display: table-row;\n}\ntbody.collapse.in {\n  display: table-row-group;\n}\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-property: height, visibility;\n  transition-property: height, visibility;\n  -webkit-transition-duration: 0.35s;\n  transition-duration: 0.35s;\n  -webkit-transition-timing-function: ease;\n  transition-timing-function: ease;\n}\n.caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px dashed;\n  border-top: 4px solid \\9;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent;\n}\n.dropup,\n.dropdown {\n  position: relative;\n}\n.dropdown-toggle:focus {\n  outline: 0;\n}\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  list-style: none;\n  font-size: 14px;\n  text-align: left;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  -moz-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  background-clip: padding-box;\n}\n.dropdown-menu.pull-right {\n  right: 0;\n  left: auto;\n}\n.dropdown-menu .divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n.dropdown-menu > li > a {\n  display: block;\n  padding: 3px 20px;\n  clear: both;\n  font-weight: normal;\n  line-height: 1.42857143;\n  color: #333333;\n  white-space: nowrap;\n}\n.dropdown-menu > li > a:hover,\n.dropdown-menu > li > a:focus {\n  text-decoration: none;\n  color: #262626;\n  background-color: #f5f5f5;\n}\n.dropdown-menu > .active > a,\n.dropdown-menu > .active > a:hover,\n.dropdown-menu > .active > a:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  background-color: #5db0e1;\n}\n.dropdown-menu > .disabled > a,\n.dropdown-menu > .disabled > a:hover,\n.dropdown-menu > .disabled > a:focus {\n  color: #c8c8c8;\n}\n.dropdown-menu > .disabled > a:hover,\n.dropdown-menu > .disabled > a:focus {\n  text-decoration: none;\n  background-color: transparent;\n  background-image: none;\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n  cursor: not-allowed;\n}\n.open > .dropdown-menu {\n  display: block;\n}\n.open > a {\n  outline: 0;\n}\n.dropdown-menu-right {\n  left: auto;\n  right: 0;\n}\n.dropdown-menu-left {\n  left: 0;\n  right: auto;\n}\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: 12px;\n  line-height: 1.42857143;\n  color: #c8c8c8;\n  white-space: nowrap;\n}\n.dropdown-backdrop {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  z-index: 990;\n}\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto;\n}\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  border-top: 0;\n  border-bottom: 4px dashed;\n  border-bottom: 4px solid \\9;\n  content: \"\";\n}\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px;\n}\n@media (min-width: 768px) {\n  .navbar-right .dropdown-menu {\n    left: auto;\n    right: 0;\n  }\n  .navbar-right .dropdown-menu-left {\n    left: 0;\n    right: auto;\n  }\n}\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n}\n.btn-group > .btn,\n.btn-group-vertical > .btn {\n  position: relative;\n  float: left;\n}\n.btn-group > .btn:hover,\n.btn-group-vertical > .btn:hover,\n.btn-group > .btn:focus,\n.btn-group-vertical > .btn:focus,\n.btn-group > .btn:active,\n.btn-group-vertical > .btn:active,\n.btn-group > .btn.active,\n.btn-group-vertical > .btn.active {\n  z-index: 2;\n}\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px;\n}\n.btn-toolbar {\n  margin-left: -5px;\n}\n.btn-toolbar .btn,\n.btn-toolbar .btn-group,\n.btn-toolbar .input-group {\n  float: left;\n}\n.btn-toolbar > .btn,\n.btn-toolbar > .btn-group,\n.btn-toolbar > .input-group {\n  margin-left: 5px;\n}\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0;\n}\n.btn-group > .btn:first-child {\n  margin-left: 0;\n}\n.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.btn-group > .btn-group {\n  float: left;\n}\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0;\n}\n.btn-group > .btn + .dropdown-toggle {\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.btn-group > .btn-lg + .dropdown-toggle {\n  padding-left: 12px;\n  padding-right: 12px;\n}\n.btn-group.open .dropdown-toggle {\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  -moz-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n.btn-group.open .dropdown-toggle.btn-link {\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n}\n.btn .caret {\n  margin-left: 0;\n}\n.btn-lg .caret {\n  border-width: 5px 5px 0;\n  border-bottom-width: 0;\n}\n.dropup .btn-lg .caret {\n  border-width: 0 5px 5px;\n}\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%;\n}\n.btn-group-vertical > .btn-group > .btn {\n  float: none;\n}\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0;\n}\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.btn-group-justified {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate;\n}\n.btn-group-justified > .btn,\n.btn-group-justified > .btn-group {\n  float: none;\n  display: table-cell;\n  width: 1%;\n}\n.btn-group-justified > .btn-group .btn {\n  width: 100%;\n}\n.btn-group-justified > .btn-group .dropdown-menu {\n  left: auto;\n}\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none;\n}\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n.input-group[class*=\"col-\"] {\n  float: none;\n  padding-left: 0;\n  padding-right: 0;\n}\n.input-group .form-control {\n  position: relative;\n  z-index: 2;\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n}\n.input-group .form-control:focus {\n  z-index: 3;\n}\n.input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n  border-radius: 0!important;\n  -webkit-border-radius: 0!important;\n  -moz-border-radius: 0!important;\n}\nselect.input-group-lg > .form-control,\nselect.input-group-lg > .input-group-addon,\nselect.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  line-height: 46px;\n}\ntextarea.input-group-lg > .form-control,\ntextarea.input-group-lg > .input-group-addon,\ntextarea.input-group-lg > .input-group-btn > .btn,\nselect[multiple].input-group-lg > .form-control,\nselect[multiple].input-group-lg > .input-group-addon,\nselect[multiple].input-group-lg > .input-group-btn > .btn {\n  height: auto;\n}\n.input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n  border-radius: 0!important;\n  -webkit-border-radius: 0!important;\n  -moz-border-radius: 0!important;\n}\nselect.input-group-sm > .form-control,\nselect.input-group-sm > .input-group-addon,\nselect.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  line-height: 30px;\n}\ntextarea.input-group-sm > .form-control,\ntextarea.input-group-sm > .input-group-addon,\ntextarea.input-group-sm > .input-group-btn > .btn,\nselect[multiple].input-group-sm > .form-control,\nselect[multiple].input-group-sm > .input-group-addon,\nselect[multiple].input-group-sm > .input-group-btn > .btn {\n  height: auto;\n}\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell;\n}\n.input-group-addon:not(:first-child):not(:last-child),\n.input-group-btn:not(:first-child):not(:last-child),\n.input-group .form-control:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n}\n.input-group-addon {\n  padding: 6px 12px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1;\n  color: #828282;\n  text-align: center;\n  background-color: #f6f6f6;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n.input-group-addon.input-sm {\n  padding: 5px 10px;\n  font-size: 12px;\n  border-radius: 3px;\n}\n.input-group-addon.input-lg {\n  padding: 10px 16px;\n  font-size: 18px;\n  border-radius: 6px;\n}\n.input-group-addon input[type=\"radio\"],\n.input-group-addon input[type=\"checkbox\"] {\n  margin-top: 0;\n}\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.input-group-addon:first-child {\n  border-right: 0;\n}\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.input-group-addon:last-child {\n  border-left: 0;\n}\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap;\n}\n.input-group-btn > .btn {\n  position: relative;\n}\n.input-group-btn > .btn + .btn {\n  margin-left: -1px;\n}\n.input-group-btn > .btn:hover,\n.input-group-btn > .btn:focus,\n.input-group-btn > .btn:active {\n  z-index: 2;\n}\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group {\n  margin-right: -1px;\n}\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group {\n  z-index: 2;\n  margin-left: -1px;\n}\n.nav {\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n}\n.nav > li {\n  position: relative;\n  display: block;\n}\n.nav > li > a {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n}\n.nav > li > a:hover,\n.nav > li > a:focus {\n  text-decoration: none;\n  background-color: #f6f6f6;\n}\n.nav > li.disabled > a {\n  color: #c8c8c8;\n}\n.nav > li.disabled > a:hover,\n.nav > li.disabled > a:focus {\n  color: #c8c8c8;\n  text-decoration: none;\n  background-color: transparent;\n  cursor: not-allowed;\n}\n.nav .open > a,\n.nav .open > a:hover,\n.nav .open > a:focus {\n  background-color: #f6f6f6;\n  border-color: #5db0e1;\n}\n.nav .nav-divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n.nav > li > a > img {\n  max-width: none;\n}\n.nav-tabs {\n  border-bottom: 1px solid #ddd;\n}\n.nav-tabs > li {\n  float: left;\n  margin-bottom: -1px;\n}\n.nav-tabs > li > a {\n  margin-right: 2px;\n  line-height: 1.42857143;\n  border: 1px solid transparent;\n  border-radius: 4px 4px 0 0;\n}\n.nav-tabs > li > a:hover {\n  border-color: #f6f6f6 #f6f6f6 #ddd;\n}\n.nav-tabs > li.active > a,\n.nav-tabs > li.active > a:hover,\n.nav-tabs > li.active > a:focus {\n  color: #828282;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-bottom-color: transparent;\n  cursor: default;\n}\n.nav-tabs.nav-justified {\n  width: 100%;\n  border-bottom: 0;\n}\n.nav-tabs.nav-justified > li {\n  float: none;\n}\n.nav-tabs.nav-justified > li > a {\n  text-align: center;\n  margin-bottom: 5px;\n}\n.nav-tabs.nav-justified > .dropdown .dropdown-menu {\n  top: auto;\n  left: auto;\n}\n@media (min-width: 768px) {\n  .nav-tabs.nav-justified > li {\n    display: table-cell;\n    width: 1%;\n  }\n  .nav-tabs.nav-justified > li > a {\n    margin-bottom: 0;\n  }\n}\n.nav-tabs.nav-justified > li > a {\n  margin-right: 0;\n  border-radius: 4px;\n}\n.nav-tabs.nav-justified > .active > a,\n.nav-tabs.nav-justified > .active > a:hover,\n.nav-tabs.nav-justified > .active > a:focus {\n  border: 1px solid #ddd;\n}\n@media (min-width: 768px) {\n  .nav-tabs.nav-justified > li > a {\n    border-bottom: 1px solid #ddd;\n    border-radius: 4px 4px 0 0;\n  }\n  .nav-tabs.nav-justified > .active > a,\n  .nav-tabs.nav-justified > .active > a:hover,\n  .nav-tabs.nav-justified > .active > a:focus {\n    border-bottom-color: #fff;\n  }\n}\n.nav-pills > li {\n  float: left;\n}\n.nav-pills > li > a {\n  border-radius: 4px;\n}\n.nav-pills > li + li {\n  margin-left: 2px;\n}\n.nav-pills > li.active > a,\n.nav-pills > li.active > a:hover,\n.nav-pills > li.active > a:focus {\n  color: #fff;\n  background-color: #5db0e1;\n}\n.nav-stacked > li {\n  float: none;\n}\n.nav-stacked > li + li {\n  margin-top: 2px;\n  margin-left: 0;\n}\n.nav-justified {\n  width: 100%;\n}\n.nav-justified > li {\n  float: none;\n}\n.nav-justified > li > a {\n  text-align: center;\n  margin-bottom: 5px;\n}\n.nav-justified > .dropdown .dropdown-menu {\n  top: auto;\n  left: auto;\n}\n@media (min-width: 768px) {\n  .nav-justified > li {\n    display: table-cell;\n    width: 1%;\n  }\n  .nav-justified > li > a {\n    margin-bottom: 0;\n  }\n}\n.nav-tabs-justified {\n  border-bottom: 0;\n}\n.nav-tabs-justified > li > a {\n  margin-right: 0;\n  border-radius: 4px;\n}\n.nav-tabs-justified > .active > a,\n.nav-tabs-justified > .active > a:hover,\n.nav-tabs-justified > .active > a:focus {\n  border: 1px solid #ddd;\n}\n@media (min-width: 768px) {\n  .nav-tabs-justified > li > a {\n    border-bottom: 1px solid #ddd;\n    border-radius: 4px 4px 0 0;\n  }\n  .nav-tabs-justified > .active > a,\n  .nav-tabs-justified > .active > a:hover,\n  .nav-tabs-justified > .active > a:focus {\n    border-bottom-color: #fff;\n  }\n}\n.tab-content > .tab-pane {\n  display: none;\n}\n.tab-content > .active {\n  display: block;\n}\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.navbar {\n  position: relative;\n  min-height: 50px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n}\n@media (min-width: 768px) {\n  .navbar {\n    border-radius: 4px;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-header {\n    float: left;\n  }\n}\n.navbar-collapse {\n  overflow-x: visible;\n  padding-right: 15px;\n  padding-left: 15px;\n  border-top: 1px solid transparent;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-overflow-scrolling: touch;\n}\n.navbar-collapse.in {\n  overflow-y: auto;\n}\n@media (min-width: 768px) {\n  .navbar-collapse {\n    width: auto;\n    border-top: 0;\n    box-shadow: none;\n  }\n  .navbar-collapse.collapse {\n    display: block !important;\n    height: auto !important;\n    padding-bottom: 0;\n    overflow: visible !important;\n  }\n  .navbar-collapse.in {\n    overflow-y: visible;\n  }\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-static-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    padding-left: 0;\n    padding-right: 0;\n  }\n}\n.navbar-fixed-top .navbar-collapse,\n.navbar-fixed-bottom .navbar-collapse {\n  max-height: 340px;\n}\n@media (max-device-width: 480px) and (orientation: landscape) {\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    max-height: 200px;\n  }\n}\n.container > .navbar-header,\n.container-fluid > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n@media (min-width: 768px) {\n  .container > .navbar-header,\n  .container-fluid > .navbar-header,\n  .container > .navbar-collapse,\n  .container-fluid > .navbar-collapse {\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n.navbar-static-top {\n  z-index: 1000;\n  border-width: 0 0 1px;\n}\n@media (min-width: 768px) {\n  .navbar-static-top {\n    border-radius: 0;\n  }\n}\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n@media (min-width: 768px) {\n  .navbar-fixed-top,\n  .navbar-fixed-bottom {\n    border-radius: 0;\n  }\n}\n.navbar-fixed-top {\n  top: 0;\n  border-width: 0 0 1px;\n}\n.navbar-fixed-bottom {\n  bottom: 0;\n  margin-bottom: 0;\n  border-width: 1px 0 0;\n}\n.navbar-brand {\n  float: left;\n  padding: 15px 15px;\n  font-size: 18px;\n  line-height: 20px;\n  height: 50px;\n}\n.navbar-brand:hover,\n.navbar-brand:focus {\n  text-decoration: none;\n}\n.navbar-brand > img {\n  display: block;\n}\n@media (min-width: 768px) {\n  .navbar > .container .navbar-brand,\n  .navbar > .container-fluid .navbar-brand {\n    margin-left: -15px;\n  }\n}\n.navbar-toggle {\n  position: relative;\n  float: right;\n  margin-right: 15px;\n  padding: 9px 10px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  background-color: transparent;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.navbar-toggle:focus {\n  outline: 0;\n}\n.navbar-toggle .icon-bar {\n  display: block;\n  width: 22px;\n  height: 2px;\n  border-radius: 1px;\n}\n.navbar-toggle .icon-bar + .icon-bar {\n  margin-top: 4px;\n}\n@media (min-width: 768px) {\n  .navbar-toggle {\n    display: none;\n  }\n}\n.navbar-nav {\n  margin: 7.5px -15px;\n}\n.navbar-nav > li > a {\n  padding-top: 10px;\n  padding-bottom: 10px;\n  line-height: 20px;\n}\n@media (max-width: 767px) {\n  .navbar-nav .open .dropdown-menu {\n    position: static;\n    float: none;\n    width: auto;\n    margin-top: 0;\n    background-color: transparent;\n    border: 0;\n    box-shadow: none;\n  }\n  .navbar-nav .open .dropdown-menu > li > a,\n  .navbar-nav .open .dropdown-menu .dropdown-header {\n    padding: 5px 15px 5px 25px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a {\n    line-height: 20px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-nav .open .dropdown-menu > li > a:focus {\n    background-image: none;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-nav {\n    float: left;\n    margin: 0;\n  }\n  .navbar-nav > li {\n    float: left;\n  }\n  .navbar-nav > li > a {\n    padding-top: 15px;\n    padding-bottom: 15px;\n  }\n}\n.navbar-form {\n  margin-left: -15px;\n  margin-right: -15px;\n  padding: 10px 15px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n@media (min-width: 768px) {\n  .navbar-form .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control-static {\n    display: inline-block;\n  }\n  .navbar-form .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .navbar-form .input-group .input-group-addon,\n  .navbar-form .input-group .input-group-btn,\n  .navbar-form .input-group .form-control {\n    width: auto;\n  }\n  .navbar-form .input-group > .form-control {\n    width: 100%;\n  }\n  .navbar-form .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio,\n  .navbar-form .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio label,\n  .navbar-form .checkbox label {\n    padding-left: 0;\n  }\n  .navbar-form .radio input[type=\"radio\"],\n  .navbar-form .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .navbar-form .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n@media (max-width: 767px) {\n  .navbar-form .form-group {\n    margin-bottom: 5px;\n  }\n  .navbar-form .form-group:last-child {\n    margin-bottom: 0;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-form {\n    width: auto;\n    border: 0;\n    margin-left: 0;\n    margin-right: 0;\n    padding-top: 0;\n    padding-bottom: 0;\n    -webkit-box-shadow: none;\n    -moz-box-shadow: none;\n    box-shadow: none;\n  }\n}\n.navbar-nav > li > .dropdown-menu {\n  margin-top: 0;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n  margin-bottom: 0;\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.navbar-btn {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n.navbar-btn.btn-sm {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.navbar-btn.btn-xs {\n  margin-top: 14px;\n  margin-bottom: 14px;\n}\n.navbar-text {\n  margin-top: 15px;\n  margin-bottom: 15px;\n}\n@media (min-width: 768px) {\n  .navbar-text {\n    float: left;\n    margin-left: 15px;\n    margin-right: 15px;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-left {\n    float: left !important;\n    float: left;\n  }\n  .navbar-right {\n    float: right !important;\n    float: right;\n    margin-right: -15px;\n  }\n  .navbar-right ~ .navbar-right {\n    margin-right: 0;\n  }\n}\n.navbar-default {\n  background-color: #f8f8f8;\n  border-color: #e7e7e7;\n}\n.navbar-default .navbar-brand {\n  color: #777;\n}\n.navbar-default .navbar-brand:hover,\n.navbar-default .navbar-brand:focus {\n  color: #5e5e5e;\n  background-color: transparent;\n}\n.navbar-default .navbar-text {\n  color: #777;\n}\n.navbar-default .navbar-nav > li > a {\n  color: #777;\n}\n.navbar-default .navbar-nav > li > a:hover,\n.navbar-default .navbar-nav > li > a:focus {\n  color: #333;\n  background-color: transparent;\n}\n.navbar-default .navbar-nav > .active > a,\n.navbar-default .navbar-nav > .active > a:hover,\n.navbar-default .navbar-nav > .active > a:focus {\n  color: #555;\n  background-color: #e7e7e7;\n}\n.navbar-default .navbar-nav > .disabled > a,\n.navbar-default .navbar-nav > .disabled > a:hover,\n.navbar-default .navbar-nav > .disabled > a:focus {\n  color: #ccc;\n  background-color: transparent;\n}\n.navbar-default .navbar-toggle {\n  border-color: #ddd;\n}\n.navbar-default .navbar-toggle:hover,\n.navbar-default .navbar-toggle:focus {\n  background-color: #ddd;\n}\n.navbar-default .navbar-toggle .icon-bar {\n  background-color: #888;\n}\n.navbar-default .navbar-collapse,\n.navbar-default .navbar-form {\n  border-color: #e7e7e7;\n}\n.navbar-default .navbar-nav > .open > a,\n.navbar-default .navbar-nav > .open > a:hover,\n.navbar-default .navbar-nav > .open > a:focus {\n  background-color: #e7e7e7;\n  color: #555;\n}\n@media (max-width: 767px) {\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n    color: #777;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #333;\n    background-color: transparent;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n    color: #555;\n    background-color: #e7e7e7;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n    color: #ccc;\n    background-color: transparent;\n  }\n}\n.navbar-default .navbar-link {\n  color: #777;\n}\n.navbar-default .navbar-link:hover {\n  color: #333;\n}\n.navbar-default .btn-link {\n  color: #777;\n}\n.navbar-default .btn-link:hover,\n.navbar-default .btn-link:focus {\n  color: #333;\n}\n.navbar-default .btn-link[disabled]:hover,\nfieldset[disabled] .navbar-default .btn-link:hover,\n.navbar-default .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-default .btn-link:focus {\n  color: #ccc;\n}\n.navbar-inverse {\n  background-color: #222;\n  border-color: #080808;\n}\n.navbar-inverse .navbar-brand {\n  color: #eeeeee;\n}\n.navbar-inverse .navbar-brand:hover,\n.navbar-inverse .navbar-brand:focus {\n  color: #fff;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-text {\n  color: #eeeeee;\n}\n.navbar-inverse .navbar-nav > li > a {\n  color: #eeeeee;\n}\n.navbar-inverse .navbar-nav > li > a:hover,\n.navbar-inverse .navbar-nav > li > a:focus {\n  color: #fff;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-nav > .active > a,\n.navbar-inverse .navbar-nav > .active > a:hover,\n.navbar-inverse .navbar-nav > .active > a:focus {\n  color: #fff;\n  background-color: #080808;\n}\n.navbar-inverse .navbar-nav > .disabled > a,\n.navbar-inverse .navbar-nav > .disabled > a:hover,\n.navbar-inverse .navbar-nav > .disabled > a:focus {\n  color: #444;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-toggle {\n  border-color: #333;\n}\n.navbar-inverse .navbar-toggle:hover,\n.navbar-inverse .navbar-toggle:focus {\n  background-color: #333;\n}\n.navbar-inverse .navbar-toggle .icon-bar {\n  background-color: #fff;\n}\n.navbar-inverse .navbar-collapse,\n.navbar-inverse .navbar-form {\n  border-color: #101010;\n}\n.navbar-inverse .navbar-nav > .open > a,\n.navbar-inverse .navbar-nav > .open > a:hover,\n.navbar-inverse .navbar-nav > .open > a:focus {\n  background-color: #080808;\n  color: #fff;\n}\n@media (max-width: 767px) {\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n    border-color: #080808;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n    background-color: #080808;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n    color: #eeeeee;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #fff;\n    background-color: transparent;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\n    color: #fff;\n    background-color: #080808;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n    color: #444;\n    background-color: transparent;\n  }\n}\n.navbar-inverse .navbar-link {\n  color: #eeeeee;\n}\n.navbar-inverse .navbar-link:hover {\n  color: #fff;\n}\n.navbar-inverse .btn-link {\n  color: #eeeeee;\n}\n.navbar-inverse .btn-link:hover,\n.navbar-inverse .btn-link:focus {\n  color: #fff;\n}\n.navbar-inverse .btn-link[disabled]:hover,\nfieldset[disabled] .navbar-inverse .btn-link:hover,\n.navbar-inverse .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-inverse .btn-link:focus {\n  color: #444;\n}\n.breadcrumb {\n  padding: 8px 15px;\n  margin-bottom: 20px;\n  list-style: none;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n}\n.breadcrumb > li {\n  display: inline-block;\n}\n.breadcrumb > li + li:before {\n  content: \"/\\00a0\";\n  padding: 0 5px;\n  color: #ccc;\n}\n.breadcrumb > .active {\n  color: #c8c8c8;\n}\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin: 20px 0;\n  border-radius: 4px;\n}\n.pagination > li {\n  display: inline;\n}\n.pagination > li > a,\n.pagination > li > span {\n  position: relative;\n  float: left;\n  padding: 6px 12px;\n  line-height: 1.42857143;\n  text-decoration: none;\n  color: #5db0e1;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  margin-left: -1px;\n}\n.pagination > li:first-child > a,\n.pagination > li:first-child > span {\n  margin-left: 0;\n  border-bottom-left-radius: 4px;\n  border-top-left-radius: 4px;\n}\n.pagination > li:last-child > a,\n.pagination > li:last-child > span {\n  border-bottom-right-radius: 4px;\n  border-top-right-radius: 4px;\n}\n.pagination > li > a:hover,\n.pagination > li > span:hover,\n.pagination > li > a:focus,\n.pagination > li > span:focus {\n  z-index: 2;\n  color: #268ecc;\n  background-color: #f6f6f6;\n  border-color: #ddd;\n}\n.pagination > .active > a,\n.pagination > .active > span,\n.pagination > .active > a:hover,\n.pagination > .active > span:hover,\n.pagination > .active > a:focus,\n.pagination > .active > span:focus {\n  z-index: 3;\n  color: #fff;\n  background-color: #5db0e1;\n  border-color: #5db0e1;\n  cursor: default;\n}\n.pagination > .disabled > span,\n.pagination > .disabled > span:hover,\n.pagination > .disabled > span:focus,\n.pagination > .disabled > a,\n.pagination > .disabled > a:hover,\n.pagination > .disabled > a:focus {\n  color: #c8c8c8;\n  background-color: #fff;\n  border-color: #ddd;\n  cursor: not-allowed;\n}\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-bottom-left-radius: 6px;\n  border-top-left-radius: 6px;\n}\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-bottom-right-radius: 6px;\n  border-top-right-radius: 6px;\n}\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-bottom-left-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-bottom-right-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.pager {\n  padding-left: 0;\n  margin: 20px 0;\n  list-style: none;\n  text-align: center;\n}\n.pager li {\n  display: inline;\n}\n.pager li > a,\n.pager li > span {\n  display: inline-block;\n  padding: 5px 14px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 15px;\n}\n.pager li > a:hover,\n.pager li > a:focus {\n  text-decoration: none;\n  background-color: #f6f6f6;\n}\n.pager .next > a,\n.pager .next > span {\n  float: right;\n}\n.pager .previous > a,\n.pager .previous > span {\n  float: left;\n}\n.pager .disabled > a,\n.pager .disabled > a:hover,\n.pager .disabled > a:focus,\n.pager .disabled > span {\n  color: #c8c8c8;\n  background-color: #fff;\n  cursor: not-allowed;\n}\n.label {\n  display: inline;\n  padding: .2em .6em .3em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25em;\n}\na.label:hover,\na.label:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n.label:empty {\n  display: none;\n}\n.btn .label {\n  position: relative;\n  top: -1px;\n}\n.label-default {\n  background-color: #c8c8c8;\n}\n.label-default[href]:hover,\n.label-default[href]:focus {\n  background-color: #afafaf;\n}\n.label-primary {\n  background-color: #5db0e1;\n}\n.label-primary[href]:hover,\n.label-primary[href]:focus {\n  background-color: #329bd9;\n}\n.label-success {\n  background-color: #81bc41;\n}\n.label-success[href]:hover,\n.label-success[href]:focus {\n  background-color: #679634;\n}\n.label-info {\n  background-color: #5bc0de;\n}\n.label-info[href]:hover,\n.label-info[href]:focus {\n  background-color: #31b0d5;\n}\n.label-warning {\n  background-color: #f0ad4e;\n}\n.label-warning[href]:hover,\n.label-warning[href]:focus {\n  background-color: #ec971f;\n}\n.label-danger {\n  background-color: #d9534f;\n}\n.label-danger[href]:hover,\n.label-danger[href]:focus {\n  background-color: #c9302c;\n}\n.badge {\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #fff;\n  line-height: 1;\n  vertical-align: middle;\n  white-space: nowrap;\n  text-align: center;\n  background-color: #c8c8c8;\n  border-radius: 10px;\n}\n.badge:empty {\n  display: none;\n}\n.btn .badge {\n  position: relative;\n  top: -1px;\n}\n.btn-xs .badge,\n.btn-group-xs > .btn .badge {\n  top: 0;\n  padding: 1px 5px;\n}\na.badge:hover,\na.badge:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n.list-group-item.active > .badge,\n.nav-pills > .active > a > .badge {\n  color: #5db0e1;\n  background-color: #fff;\n}\n.list-group-item > .badge {\n  float: right;\n}\n.list-group-item > .badge + .badge {\n  margin-right: 5px;\n}\n.nav-pills > li > a > .badge {\n  margin-left: 3px;\n}\n.jumbotron {\n  padding-top: 30px;\n  padding-bottom: 30px;\n  margin-bottom: 30px;\n  color: inherit;\n  background-color: #f6f6f6;\n}\n.jumbotron h1,\n.jumbotron .h1 {\n  color: inherit;\n}\n.jumbotron p {\n  margin-bottom: 15px;\n  font-size: 21px;\n  font-weight: 200;\n}\n.jumbotron > hr {\n  border-top-color: #dddddd;\n}\n.container .jumbotron,\n.container-fluid .jumbotron {\n  border-radius: 6px;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.jumbotron .container {\n  max-width: 100%;\n}\n@media screen and (min-width: 768px) {\n  .jumbotron {\n    padding-top: 48px;\n    padding-bottom: 48px;\n  }\n  .container .jumbotron,\n  .container-fluid .jumbotron {\n    padding-left: 60px;\n    padding-right: 60px;\n  }\n  .jumbotron h1,\n  .jumbotron .h1 {\n    font-size: 63px;\n  }\n}\n.thumbnail {\n  display: block;\n  padding: 4px;\n  margin-bottom: 20px;\n  line-height: 1.42857143;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -o-transition: border 0.2s ease-in-out;\n  transition: border 0.2s ease-in-out;\n  -moz-transition: border 0.2s ease-in-out;\n  -webkit-transition: border 0.2s ease-in-out;\n}\n.thumbnail > img,\n.thumbnail a > img {\n  margin-left: auto;\n  margin-right: auto;\n}\na.thumbnail:hover,\na.thumbnail:focus,\na.thumbnail.active {\n  border-color: #5db0e1;\n}\n.thumbnail .caption {\n  padding: 9px;\n  color: #333333;\n}\n.alert {\n  padding: 15px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.alert h4 {\n  margin-top: 0;\n  color: inherit;\n}\n.alert .alert-link {\n  font-weight: bold;\n}\n.alert > p,\n.alert > ul {\n  margin-bottom: 0;\n}\n.alert > p + p {\n  margin-top: 5px;\n}\n.alert-dismissable,\n.alert-dismissible {\n  padding-right: 35px;\n}\n.alert-dismissable .close,\n.alert-dismissible .close {\n  position: relative;\n  top: -2px;\n  right: -21px;\n  color: inherit;\n}\n.alert-success {\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n  color: #3c763d;\n}\n.alert-success hr {\n  border-top-color: #c9e2b3;\n}\n.alert-success .alert-link {\n  color: #2b542c;\n}\n.alert-info {\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n  color: #31708f;\n}\n.alert-info hr {\n  border-top-color: #a6e1ec;\n}\n.alert-info .alert-link {\n  color: #245269;\n}\n.alert-warning {\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n  color: #8a6d3b;\n}\n.alert-warning hr {\n  border-top-color: #f7e1b5;\n}\n.alert-warning .alert-link {\n  color: #66512c;\n}\n.alert-danger {\n  background-color: #f2dede;\n  border-color: #ebccd1;\n  color: #a94442;\n}\n.alert-danger hr {\n  border-top-color: #e4b9c0;\n}\n.alert-danger .alert-link {\n  color: #843534;\n}\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n.progress {\n  overflow: hidden;\n  height: 20px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  -moz-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n}\n.progress-bar {\n  float: left;\n  width: 0%;\n  height: 100%;\n  font-size: 12px;\n  line-height: 20px;\n  color: #fff;\n  text-align: center;\n  background-color: #5db0e1;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  -moz-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  -o-transition: width 0.6s ease;\n  transition: width 0.6s ease;\n  -moz-transition: width 0.6s ease;\n  -webkit-transition: width 0.6s ease;\n}\n.progress-striped .progress-bar,\n.progress-bar-striped {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 40px 40px;\n}\n.progress.active .progress-bar,\n.progress-bar.active {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n  /* Safari 4+ */\n  -moz-animation: progress-bar-stripes 2s linear infinite;\n  /* Fx 5+ */\n  -o-animation: progress-bar-stripes 2s linear infinite;\n  /* Opera 12+ */\n  animation: progress-bar-stripes 2s linear infinite;\n  /* IE 10+ */\n}\n.progress-bar-success {\n  background-color: #81bc41;\n}\n.progress-striped .progress-bar-success {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.progress-bar-info {\n  background-color: #5bc0de;\n}\n.progress-striped .progress-bar-info {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.progress-bar-warning {\n  background-color: #f0ad4e;\n}\n.progress-striped .progress-bar-warning {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.progress-bar-danger {\n  background-color: #d9534f;\n}\n.progress-striped .progress-bar-danger {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n}\n.media {\n  margin-top: 15px;\n}\n.media:first-child {\n  margin-top: 0;\n}\n.media,\n.media-body {\n  zoom: 1;\n  overflow: hidden;\n}\n.media-body {\n  width: 10000px;\n}\n.media-object {\n  display: block;\n}\n.media-object.img-thumbnail {\n  max-width: none;\n}\n.media-right,\n.media > .pull-right {\n  padding-left: 10px;\n}\n.media-left,\n.media > .pull-left {\n  padding-right: 10px;\n}\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top;\n}\n.media-middle {\n  vertical-align: middle;\n}\n.media-bottom {\n  vertical-align: bottom;\n}\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n.media-list {\n  padding-left: 0;\n  list-style: none;\n}\n.list-group {\n  margin-bottom: 20px;\n  padding-left: 0;\n}\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n.list-group-item:first-child {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n}\n.list-group-item:last-child {\n  margin-bottom: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\na.list-group-item,\nbutton.list-group-item {\n  color: #555;\n}\na.list-group-item .list-group-item-heading,\nbutton.list-group-item .list-group-item-heading {\n  color: #333;\n}\na.list-group-item:hover,\nbutton.list-group-item:hover,\na.list-group-item:focus,\nbutton.list-group-item:focus {\n  text-decoration: none;\n  color: #555;\n  background-color: #f5f5f5;\n}\nbutton.list-group-item {\n  width: 100%;\n  text-align: left;\n}\n.list-group-item.disabled,\n.list-group-item.disabled:hover,\n.list-group-item.disabled:focus {\n  background-color: #f6f6f6;\n  color: #c8c8c8;\n  cursor: not-allowed;\n}\n.list-group-item.disabled .list-group-item-heading,\n.list-group-item.disabled:hover .list-group-item-heading,\n.list-group-item.disabled:focus .list-group-item-heading {\n  color: inherit;\n}\n.list-group-item.disabled .list-group-item-text,\n.list-group-item.disabled:hover .list-group-item-text,\n.list-group-item.disabled:focus .list-group-item-text {\n  color: #c8c8c8;\n}\n.list-group-item.active,\n.list-group-item.active:hover,\n.list-group-item.active:focus {\n  z-index: 2;\n  color: #fff;\n  background-color: #5db0e1;\n  border-color: #5db0e1;\n}\n.list-group-item.active .list-group-item-heading,\n.list-group-item.active:hover .list-group-item-heading,\n.list-group-item.active:focus .list-group-item-heading,\n.list-group-item.active .list-group-item-heading > small,\n.list-group-item.active:hover .list-group-item-heading > small,\n.list-group-item.active:focus .list-group-item-heading > small,\n.list-group-item.active .list-group-item-heading > .small,\n.list-group-item.active:hover .list-group-item-heading > .small,\n.list-group-item.active:focus .list-group-item-heading > .small {\n  color: inherit;\n}\n.list-group-item.active .list-group-item-text,\n.list-group-item.active:hover .list-group-item-text,\n.list-group-item.active:focus .list-group-item-text {\n  color: #ffffff;\n}\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #dff0d8;\n}\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d;\n}\na.list-group-item-success .list-group-item-heading,\nbutton.list-group-item-success .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-success:hover,\nbutton.list-group-item-success:hover,\na.list-group-item-success:focus,\nbutton.list-group-item-success:focus {\n  color: #3c763d;\n  background-color: #d0e9c6;\n}\na.list-group-item-success.active,\nbutton.list-group-item-success.active,\na.list-group-item-success.active:hover,\nbutton.list-group-item-success.active:hover,\na.list-group-item-success.active:focus,\nbutton.list-group-item-success.active:focus {\n  color: #fff;\n  background-color: #3c763d;\n  border-color: #3c763d;\n}\n.list-group-item-info {\n  color: #31708f;\n  background-color: #d9edf7;\n}\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f;\n}\na.list-group-item-info .list-group-item-heading,\nbutton.list-group-item-info .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-info:hover,\nbutton.list-group-item-info:hover,\na.list-group-item-info:focus,\nbutton.list-group-item-info:focus {\n  color: #31708f;\n  background-color: #c4e3f3;\n}\na.list-group-item-info.active,\nbutton.list-group-item-info.active,\na.list-group-item-info.active:hover,\nbutton.list-group-item-info.active:hover,\na.list-group-item-info.active:focus,\nbutton.list-group-item-info.active:focus {\n  color: #fff;\n  background-color: #31708f;\n  border-color: #31708f;\n}\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n}\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b;\n}\na.list-group-item-warning .list-group-item-heading,\nbutton.list-group-item-warning .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-warning:hover,\nbutton.list-group-item-warning:hover,\na.list-group-item-warning:focus,\nbutton.list-group-item-warning:focus {\n  color: #8a6d3b;\n  background-color: #faf2cc;\n}\na.list-group-item-warning.active,\nbutton.list-group-item-warning.active,\na.list-group-item-warning.active:hover,\nbutton.list-group-item-warning.active:hover,\na.list-group-item-warning.active:focus,\nbutton.list-group-item-warning.active:focus {\n  color: #fff;\n  background-color: #8a6d3b;\n  border-color: #8a6d3b;\n}\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #f2dede;\n}\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442;\n}\na.list-group-item-danger .list-group-item-heading,\nbutton.list-group-item-danger .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-danger:hover,\nbutton.list-group-item-danger:hover,\na.list-group-item-danger:focus,\nbutton.list-group-item-danger:focus {\n  color: #a94442;\n  background-color: #ebcccc;\n}\na.list-group-item-danger.active,\nbutton.list-group-item-danger.active,\na.list-group-item-danger.active:hover,\nbutton.list-group-item-danger.active:hover,\na.list-group-item-danger.active:focus,\nbutton.list-group-item-danger.active:focus {\n  color: #fff;\n  background-color: #a94442;\n  border-color: #a94442;\n}\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3;\n}\n.panel {\n  margin-bottom: 20px;\n  background-color: #fff;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n}\n.panel-body {\n  padding: 15px;\n}\n.panel-heading {\n  padding: 10px 15px;\n  border-bottom: 1px solid transparent;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.panel-heading > .dropdown .dropdown-toggle {\n  color: inherit;\n}\n.panel-title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-size: 16px;\n  color: inherit;\n}\n.panel-title > a,\n.panel-title > small,\n.panel-title > .small,\n.panel-title > small > a,\n.panel-title > .small > a {\n  color: inherit;\n}\n.panel-footer {\n  padding: 10px 15px;\n  background-color: #f5f5f5;\n  border-top: 1px solid #ddd;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .list-group,\n.panel > .panel-collapse > .list-group {\n  margin-bottom: 0;\n}\n.panel > .list-group .list-group-item,\n.panel > .panel-collapse > .list-group .list-group-item {\n  border-width: 1px 0;\n  border-radius: 0;\n}\n.panel > .list-group:first-child .list-group-item:first-child,\n.panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n  border-top: 0;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.panel > .list-group:last-child .list-group-item:last-child,\n.panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n  border-bottom: 0;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n}\n.panel-heading + .list-group .list-group-item:first-child {\n  border-top-width: 0;\n}\n.list-group + .panel-footer {\n  border-top-width: 0;\n}\n.panel > .table,\n.panel > .table-responsive > .table,\n.panel > .panel-collapse > .table {\n  margin-bottom: 0;\n}\n.panel > .table caption,\n.panel > .table-responsive > .table caption,\n.panel > .panel-collapse > .table caption {\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.panel > .table:first-child,\n.panel > .table-responsive:first-child > .table:first-child {\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n  border-top-left-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n  border-top-right-radius: 3px;\n}\n.panel > .table:last-child,\n.panel > .table-responsive:last-child > .table:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n  border-bottom-left-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n  border-bottom-right-radius: 3px;\n}\n.panel > .panel-body + .table,\n.panel > .panel-body + .table-responsive,\n.panel > .table + .panel-body,\n.panel > .table-responsive + .panel-body {\n  border-top: 1px solid #ddd;\n}\n.panel > .table > tbody:first-child > tr:first-child th,\n.panel > .table > tbody:first-child > tr:first-child td {\n  border-top: 0;\n}\n.panel > .table-bordered,\n.panel > .table-responsive > .table-bordered {\n  border: 0;\n}\n.panel > .table-bordered > thead > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n.panel > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-bordered > thead > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n.panel > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-bordered > tfoot > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n  border-left: 0;\n}\n.panel > .table-bordered > thead > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n.panel > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-bordered > thead > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n.panel > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-bordered > tfoot > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n  border-right: 0;\n}\n.panel > .table-bordered > thead > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n.panel > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-bordered > thead > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n.panel > .table-bordered > tbody > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n  border-bottom: 0;\n}\n.panel > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-bordered > tfoot > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n  border-bottom: 0;\n}\n.panel > .table-responsive {\n  border: 0;\n  margin-bottom: 0;\n}\n.panel-group {\n  margin-bottom: 20px;\n}\n.panel-group .panel {\n  margin-bottom: 0;\n  border-radius: 4px;\n}\n.panel-group .panel + .panel {\n  margin-top: 5px;\n}\n.panel-group .panel-heading {\n  border-bottom: 0;\n}\n.panel-group .panel-heading + .panel-collapse > .panel-body,\n.panel-group .panel-heading + .panel-collapse > .list-group {\n  border-top: 1px solid #ddd;\n}\n.panel-group .panel-footer {\n  border-top: 0;\n}\n.panel-group .panel-footer + .panel-collapse .panel-body {\n  border-bottom: 1px solid #ddd;\n}\n.panel-default {\n  border-color: #ddd;\n}\n.panel-default > .panel-heading {\n  color: #333333;\n  background-color: #f5f5f5;\n  border-color: #ddd;\n}\n.panel-default > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ddd;\n}\n.panel-default > .panel-heading .badge {\n  color: #f5f5f5;\n  background-color: #333333;\n}\n.panel-default > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ddd;\n}\n.panel-primary {\n  border-color: #5db0e1;\n}\n.panel-primary > .panel-heading {\n  color: #fff;\n  background-color: #5db0e1;\n  border-color: #5db0e1;\n}\n.panel-primary > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #5db0e1;\n}\n.panel-primary > .panel-heading .badge {\n  color: #5db0e1;\n  background-color: #fff;\n}\n.panel-primary > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #5db0e1;\n}\n.panel-success {\n  border-color: #d6e9c6;\n}\n.panel-success > .panel-heading {\n  color: #3c763d;\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n}\n.panel-success > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #d6e9c6;\n}\n.panel-success > .panel-heading .badge {\n  color: #dff0d8;\n  background-color: #3c763d;\n}\n.panel-success > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #d6e9c6;\n}\n.panel-info {\n  border-color: #bce8f1;\n}\n.panel-info > .panel-heading {\n  color: #31708f;\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n}\n.panel-info > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #bce8f1;\n}\n.panel-info > .panel-heading .badge {\n  color: #d9edf7;\n  background-color: #31708f;\n}\n.panel-info > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #bce8f1;\n}\n.panel-warning {\n  border-color: #faebcc;\n}\n.panel-warning > .panel-heading {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n}\n.panel-warning > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #faebcc;\n}\n.panel-warning > .panel-heading .badge {\n  color: #fcf8e3;\n  background-color: #8a6d3b;\n}\n.panel-warning > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #faebcc;\n}\n.panel-danger {\n  border-color: #ebccd1;\n}\n.panel-danger > .panel-heading {\n  color: #a94442;\n  background-color: #f2dede;\n  border-color: #ebccd1;\n}\n.panel-danger > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ebccd1;\n}\n.panel-danger > .panel-heading .badge {\n  color: #f2dede;\n  background-color: #a94442;\n}\n.panel-danger > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ebccd1;\n}\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n}\n.embed-responsive .embed-responsive-item,\n.embed-responsive iframe,\n.embed-responsive embed,\n.embed-responsive object,\n.embed-responsive video {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border: 0;\n}\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%;\n}\n.embed-responsive-4by3 {\n  padding-bottom: 75%;\n}\n.well {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n}\n.well blockquote {\n  border-color: #ddd;\n  border-color: rgba(0, 0, 0, 0.15);\n}\n.well-lg {\n  padding: 24px;\n  border-radius: 6px;\n}\n.well-sm {\n  padding: 9px;\n  border-radius: 3px;\n}\n.close {\n  float: right;\n  font-size: 21px;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: 0.2;\n  filter: alpha(opacity=20);\n}\n.close:hover,\n.close:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n}\nbutton.close {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none;\n}\n.clearfix:before,\n.clearfix:after,\n.dl-horizontal dd:before,\n.dl-horizontal dd:after,\n.container:before,\n.container:after,\n.container-fluid:before,\n.container-fluid:after,\n.row:before,\n.row:after,\n.form-horizontal .form-group:before,\n.form-horizontal .form-group:after,\n.btn-toolbar:before,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:before,\n.btn-group-vertical > .btn-group:after,\n.nav:before,\n.nav:after,\n.navbar:before,\n.navbar:after,\n.navbar-header:before,\n.navbar-header:after,\n.navbar-collapse:before,\n.navbar-collapse:after,\n.pager:before,\n.pager:after,\n.panel-body:before,\n.panel-body:after {\n  content: \" \";\n  display: table;\n}\n.clearfix:after,\n.dl-horizontal dd:after,\n.container:after,\n.container-fluid:after,\n.row:after,\n.form-horizontal .form-group:after,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:after,\n.nav:after,\n.navbar:after,\n.navbar-header:after,\n.navbar-collapse:after,\n.pager:after,\n.panel-body:after {\n  clear: both;\n}\n.clearfix:before,\n.clearfix:after,\n.dl-horizontal dd:before,\n.dl-horizontal dd:after,\n.container:before,\n.container:after,\n.container-fluid:before,\n.container-fluid:after,\n.row:before,\n.row:after,\n.form-horizontal .form-group:before,\n.form-horizontal .form-group:after,\n.btn-toolbar:before,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:before,\n.btn-group-vertical > .btn-group:after,\n.nav:before,\n.nav:after,\n.navbar:before,\n.navbar:after,\n.navbar-header:before,\n.navbar-header:after,\n.navbar-collapse:before,\n.navbar-collapse:after,\n.pager:before,\n.pager:after,\n.panel-body:before,\n.panel-body:after {\n  content: \" \";\n  display: table;\n}\n.clearfix:after,\n.dl-horizontal dd:after,\n.container:after,\n.container-fluid:after,\n.row:after,\n.form-horizontal .form-group:after,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:after,\n.nav:after,\n.navbar:after,\n.navbar-header:after,\n.navbar-collapse:after,\n.pager:after,\n.panel-body:after {\n  clear: both;\n}\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n.pull-right {\n  float: right !important;\n}\n.pull-left {\n  float: left !important;\n}\n.hide {\n  display: none !important;\n}\n.show {\n  display: block !important;\n}\n.invisible {\n  visibility: hidden;\n}\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n.hidden {\n  display: none !important;\n}\n.affix {\n  position: fixed;\n}\n/**\n*\n*  Bootstrap default values:\n*\n@gray-darker:            lighten(#000, 13.5%); // #222\n@gray-dark:              lighten(#000, 20%);   // #333\n@gray:                   lighten(#000, 33.5%); // #555\n@gray-light:             lighten(#000, 60%);   // #999\n@gray-lighter:           lighten(#000, 93.5%); // #eee\n**/\n/**\n* Bootstrap default values for primary colors\n*\n@brand-primary:         #428bca;\n@brand-success:         #5cb85c;\n@brand-info:            #5bc0de;\n@brand-warning:         #f0ad4e;\n@brand-danger:          #d9534f;\n*/\n/*!\n *  Font Awesome 4.6.3 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url("+__webpack_require__(5)+"?v=4.7.0);\n  src: url("+__webpack_require__(5)+"?#iefix&v=4.7.0) format('embedded-opentype'), url("+__webpack_require__(21)+"?v=4.7.0) format('woff2'), url("+__webpack_require__(20)+"?v=4.7.0) format('woff'), url("+__webpack_require__(17)+"?v=4.7.0) format('truetype'), url("+__webpack_require__(23)+"?v=4.7.0#fontawesomeregular) format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333333em;\n  line-height: 0.75em;\n  vertical-align: -15%;\n}\n.fa-2x {\n  font-size: 2em;\n}\n.fa-3x {\n  font-size: 3em;\n}\n.fa-4x {\n  font-size: 4em;\n}\n.fa-5x {\n  font-size: 5em;\n}\n.fa-fw {\n  width: 1.28571429em;\n  text-align: center;\n}\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14285714em;\n  list-style-type: none;\n}\n.fa-ul > li {\n  position: relative;\n}\n.fa-li {\n  position: absolute;\n  left: -2.14285714em;\n  width: 2.14285714em;\n  top: 0.14285714em;\n  text-align: center;\n}\n.fa-li.fa-lg {\n  left: -1.85714286em;\n}\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em;\n}\n.fa-pull-left {\n  float: left;\n}\n.fa-pull-right {\n  float: right;\n}\n.fa.fa-pull-left {\n  margin-right: .3em;\n}\n.fa.fa-pull-right {\n  margin-left: .3em;\n}\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right;\n}\n.pull-left {\n  float: left;\n}\n.fa.pull-left {\n  margin-right: .3em;\n}\n.fa.pull-right {\n  margin-left: .3em;\n}\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear;\n}\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8);\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1);\n}\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1);\n}\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  filter: none;\n}\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle;\n}\n.fa-stack-1x,\n.fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center;\n}\n.fa-stack-1x {\n  line-height: inherit;\n}\n.fa-stack-2x {\n  font-size: 2em;\n}\n.fa-inverse {\n  color: #fff;\n}\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\f000\";\n}\n.fa-music:before {\n  content: \"\\f001\";\n}\n.fa-search:before {\n  content: \"\\f002\";\n}\n.fa-envelope-o:before {\n  content: \"\\f003\";\n}\n.fa-heart:before {\n  content: \"\\f004\";\n}\n.fa-star:before {\n  content: \"\\f005\";\n}\n.fa-star-o:before {\n  content: \"\\f006\";\n}\n.fa-user:before {\n  content: \"\\f007\";\n}\n.fa-film:before {\n  content: \"\\f008\";\n}\n.fa-th-large:before {\n  content: \"\\f009\";\n}\n.fa-th:before {\n  content: \"\\f00a\";\n}\n.fa-th-list:before {\n  content: \"\\f00b\";\n}\n.fa-check:before {\n  content: \"\\f00c\";\n}\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\f00d\";\n}\n.fa-search-plus:before {\n  content: \"\\f00e\";\n}\n.fa-search-minus:before {\n  content: \"\\f010\";\n}\n.fa-power-off:before {\n  content: \"\\f011\";\n}\n.fa-signal:before {\n  content: \"\\f012\";\n}\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\f013\";\n}\n.fa-trash-o:before {\n  content: \"\\f014\";\n}\n.fa-home:before {\n  content: \"\\f015\";\n}\n.fa-file-o:before {\n  content: \"\\f016\";\n}\n.fa-clock-o:before {\n  content: \"\\f017\";\n}\n.fa-road:before {\n  content: \"\\f018\";\n}\n.fa-download:before {\n  content: \"\\f019\";\n}\n.fa-arrow-circle-o-down:before {\n  content: \"\\f01a\";\n}\n.fa-arrow-circle-o-up:before {\n  content: \"\\f01b\";\n}\n.fa-inbox:before {\n  content: \"\\f01c\";\n}\n.fa-play-circle-o:before {\n  content: \"\\f01d\";\n}\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\f01e\";\n}\n.fa-refresh:before {\n  content: \"\\f021\";\n}\n.fa-list-alt:before {\n  content: \"\\f022\";\n}\n.fa-lock:before {\n  content: \"\\f023\";\n}\n.fa-flag:before {\n  content: \"\\f024\";\n}\n.fa-headphones:before {\n  content: \"\\f025\";\n}\n.fa-volume-off:before {\n  content: \"\\f026\";\n}\n.fa-volume-down:before {\n  content: \"\\f027\";\n}\n.fa-volume-up:before {\n  content: \"\\f028\";\n}\n.fa-qrcode:before {\n  content: \"\\f029\";\n}\n.fa-barcode:before {\n  content: \"\\f02a\";\n}\n.fa-tag:before {\n  content: \"\\f02b\";\n}\n.fa-tags:before {\n  content: \"\\f02c\";\n}\n.fa-book:before {\n  content: \"\\f02d\";\n}\n.fa-bookmark:before {\n  content: \"\\f02e\";\n}\n.fa-print:before {\n  content: \"\\f02f\";\n}\n.fa-camera:before {\n  content: \"\\f030\";\n}\n.fa-font:before {\n  content: \"\\f031\";\n}\n.fa-bold:before {\n  content: \"\\f032\";\n}\n.fa-italic:before {\n  content: \"\\f033\";\n}\n.fa-text-height:before {\n  content: \"\\f034\";\n}\n.fa-text-width:before {\n  content: \"\\f035\";\n}\n.fa-align-left:before {\n  content: \"\\f036\";\n}\n.fa-align-center:before {\n  content: \"\\f037\";\n}\n.fa-align-right:before {\n  content: \"\\f038\";\n}\n.fa-align-justify:before {\n  content: \"\\f039\";\n}\n.fa-list:before {\n  content: \"\\f03a\";\n}\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\f03b\";\n}\n.fa-indent:before {\n  content: \"\\f03c\";\n}\n.fa-video-camera:before {\n  content: \"\\f03d\";\n}\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\f03e\";\n}\n.fa-pencil:before {\n  content: \"\\f040\";\n}\n.fa-map-marker:before {\n  content: \"\\f041\";\n}\n.fa-adjust:before {\n  content: \"\\f042\";\n}\n.fa-tint:before {\n  content: \"\\f043\";\n}\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\f044\";\n}\n.fa-share-square-o:before {\n  content: \"\\f045\";\n}\n.fa-check-square-o:before {\n  content: \"\\f046\";\n}\n.fa-arrows:before {\n  content: \"\\f047\";\n}\n.fa-step-backward:before {\n  content: \"\\f048\";\n}\n.fa-fast-backward:before {\n  content: \"\\f049\";\n}\n.fa-backward:before {\n  content: \"\\f04a\";\n}\n.fa-play:before {\n  content: \"\\f04b\";\n}\n.fa-pause:before {\n  content: \"\\f04c\";\n}\n.fa-stop:before {\n  content: \"\\f04d\";\n}\n.fa-forward:before {\n  content: \"\\f04e\";\n}\n.fa-fast-forward:before {\n  content: \"\\f050\";\n}\n.fa-step-forward:before {\n  content: \"\\f051\";\n}\n.fa-eject:before {\n  content: \"\\f052\";\n}\n.fa-chevron-left:before {\n  content: \"\\f053\";\n}\n.fa-chevron-right:before {\n  content: \"\\f054\";\n}\n.fa-plus-circle:before {\n  content: \"\\f055\";\n}\n.fa-minus-circle:before {\n  content: \"\\f056\";\n}\n.fa-times-circle:before {\n  content: \"\\f057\";\n}\n.fa-check-circle:before {\n  content: \"\\f058\";\n}\n.fa-question-circle:before {\n  content: \"\\f059\";\n}\n.fa-info-circle:before {\n  content: \"\\f05a\";\n}\n.fa-crosshairs:before {\n  content: \"\\f05b\";\n}\n.fa-times-circle-o:before {\n  content: \"\\f05c\";\n}\n.fa-check-circle-o:before {\n  content: \"\\f05d\";\n}\n.fa-ban:before {\n  content: \"\\f05e\";\n}\n.fa-arrow-left:before {\n  content: \"\\f060\";\n}\n.fa-arrow-right:before {\n  content: \"\\f061\";\n}\n.fa-arrow-up:before {\n  content: \"\\f062\";\n}\n.fa-arrow-down:before {\n  content: \"\\f063\";\n}\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\f064\";\n}\n.fa-expand:before {\n  content: \"\\f065\";\n}\n.fa-compress:before {\n  content: \"\\f066\";\n}\n.fa-plus:before {\n  content: \"\\f067\";\n}\n.fa-minus:before {\n  content: \"\\f068\";\n}\n.fa-asterisk:before {\n  content: \"\\f069\";\n}\n.fa-exclamation-circle:before {\n  content: \"\\f06a\";\n}\n.fa-gift:before {\n  content: \"\\f06b\";\n}\n.fa-leaf:before {\n  content: \"\\f06c\";\n}\n.fa-fire:before {\n  content: \"\\f06d\";\n}\n.fa-eye:before {\n  content: \"\\f06e\";\n}\n.fa-eye-slash:before {\n  content: \"\\f070\";\n}\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\f071\";\n}\n.fa-plane:before {\n  content: \"\\f072\";\n}\n.fa-calendar:before {\n  content: \"\\f073\";\n}\n.fa-random:before {\n  content: \"\\f074\";\n}\n.fa-comment:before {\n  content: \"\\f075\";\n}\n.fa-magnet:before {\n  content: \"\\f076\";\n}\n.fa-chevron-up:before {\n  content: \"\\f077\";\n}\n.fa-chevron-down:before {\n  content: \"\\f078\";\n}\n.fa-retweet:before {\n  content: \"\\f079\";\n}\n.fa-shopping-cart:before {\n  content: \"\\f07a\";\n}\n.fa-folder:before {\n  content: \"\\f07b\";\n}\n.fa-folder-open:before {\n  content: \"\\f07c\";\n}\n.fa-arrows-v:before {\n  content: \"\\f07d\";\n}\n.fa-arrows-h:before {\n  content: \"\\f07e\";\n}\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\f080\";\n}\n.fa-twitter-square:before {\n  content: \"\\f081\";\n}\n.fa-facebook-square:before {\n  content: \"\\f082\";\n}\n.fa-camera-retro:before {\n  content: \"\\f083\";\n}\n.fa-key:before {\n  content: \"\\f084\";\n}\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\f085\";\n}\n.fa-comments:before {\n  content: \"\\f086\";\n}\n.fa-thumbs-o-up:before {\n  content: \"\\f087\";\n}\n.fa-thumbs-o-down:before {\n  content: \"\\f088\";\n}\n.fa-star-half:before {\n  content: \"\\f089\";\n}\n.fa-heart-o:before {\n  content: \"\\f08a\";\n}\n.fa-sign-out:before {\n  content: \"\\f08b\";\n}\n.fa-linkedin-square:before {\n  content: \"\\f08c\";\n}\n.fa-thumb-tack:before {\n  content: \"\\f08d\";\n}\n.fa-external-link:before {\n  content: \"\\f08e\";\n}\n.fa-sign-in:before {\n  content: \"\\f090\";\n}\n.fa-trophy:before {\n  content: \"\\f091\";\n}\n.fa-github-square:before {\n  content: \"\\f092\";\n}\n.fa-upload:before {\n  content: \"\\f093\";\n}\n.fa-lemon-o:before {\n  content: \"\\f094\";\n}\n.fa-phone:before {\n  content: \"\\f095\";\n}\n.fa-square-o:before {\n  content: \"\\f096\";\n}\n.fa-bookmark-o:before {\n  content: \"\\f097\";\n}\n.fa-phone-square:before {\n  content: \"\\f098\";\n}\n.fa-twitter:before {\n  content: \"\\f099\";\n}\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\f09a\";\n}\n.fa-github:before {\n  content: \"\\f09b\";\n}\n.fa-unlock:before {\n  content: \"\\f09c\";\n}\n.fa-credit-card:before {\n  content: \"\\f09d\";\n}\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\\f09e\";\n}\n.fa-hdd-o:before {\n  content: \"\\f0a0\";\n}\n.fa-bullhorn:before {\n  content: \"\\f0a1\";\n}\n.fa-bell:before {\n  content: \"\\f0f3\";\n}\n.fa-certificate:before {\n  content: \"\\f0a3\";\n}\n.fa-hand-o-right:before {\n  content: \"\\f0a4\";\n}\n.fa-hand-o-left:before {\n  content: \"\\f0a5\";\n}\n.fa-hand-o-up:before {\n  content: \"\\f0a6\";\n}\n.fa-hand-o-down:before {\n  content: \"\\f0a7\";\n}\n.fa-arrow-circle-left:before {\n  content: \"\\f0a8\";\n}\n.fa-arrow-circle-right:before {\n  content: \"\\f0a9\";\n}\n.fa-arrow-circle-up:before {\n  content: \"\\f0aa\";\n}\n.fa-arrow-circle-down:before {\n  content: \"\\f0ab\";\n}\n.fa-globe:before {\n  content: \"\\f0ac\";\n}\n.fa-wrench:before {\n  content: \"\\f0ad\";\n}\n.fa-tasks:before {\n  content: \"\\f0ae\";\n}\n.fa-filter:before {\n  content: \"\\f0b0\";\n}\n.fa-briefcase:before {\n  content: \"\\f0b1\";\n}\n.fa-arrows-alt:before {\n  content: \"\\f0b2\";\n}\n.fa-group:before,\n.fa-users:before {\n  content: \"\\f0c0\";\n}\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\f0c1\";\n}\n.fa-cloud:before {\n  content: \"\\f0c2\";\n}\n.fa-flask:before {\n  content: \"\\f0c3\";\n}\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\f0c4\";\n}\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\f0c5\";\n}\n.fa-paperclip:before {\n  content: \"\\f0c6\";\n}\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\f0c7\";\n}\n.fa-square:before {\n  content: \"\\f0c8\";\n}\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\f0c9\";\n}\n.fa-list-ul:before {\n  content: \"\\f0ca\";\n}\n.fa-list-ol:before {\n  content: \"\\f0cb\";\n}\n.fa-strikethrough:before {\n  content: \"\\f0cc\";\n}\n.fa-underline:before {\n  content: \"\\f0cd\";\n}\n.fa-table:before {\n  content: \"\\f0ce\";\n}\n.fa-magic:before {\n  content: \"\\f0d0\";\n}\n.fa-truck:before {\n  content: \"\\f0d1\";\n}\n.fa-pinterest:before {\n  content: \"\\f0d2\";\n}\n.fa-pinterest-square:before {\n  content: \"\\f0d3\";\n}\n.fa-google-plus-square:before {\n  content: \"\\f0d4\";\n}\n.fa-google-plus:before {\n  content: \"\\f0d5\";\n}\n.fa-money:before {\n  content: \"\\f0d6\";\n}\n.fa-caret-down:before {\n  content: \"\\f0d7\";\n}\n.fa-caret-up:before {\n  content: \"\\f0d8\";\n}\n.fa-caret-left:before {\n  content: \"\\f0d9\";\n}\n.fa-caret-right:before {\n  content: \"\\f0da\";\n}\n.fa-columns:before {\n  content: \"\\f0db\";\n}\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\f0dc\";\n}\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\f0dd\";\n}\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\f0de\";\n}\n.fa-envelope:before {\n  content: \"\\f0e0\";\n}\n.fa-linkedin:before {\n  content: \"\\f0e1\";\n}\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\f0e2\";\n}\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\f0e3\";\n}\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\f0e4\";\n}\n.fa-comment-o:before {\n  content: \"\\f0e5\";\n}\n.fa-comments-o:before {\n  content: \"\\f0e6\";\n}\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\f0e7\";\n}\n.fa-sitemap:before {\n  content: \"\\f0e8\";\n}\n.fa-umbrella:before {\n  content: \"\\f0e9\";\n}\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\f0ea\";\n}\n.fa-lightbulb-o:before {\n  content: \"\\f0eb\";\n}\n.fa-exchange:before {\n  content: \"\\f0ec\";\n}\n.fa-cloud-download:before {\n  content: \"\\f0ed\";\n}\n.fa-cloud-upload:before {\n  content: \"\\f0ee\";\n}\n.fa-user-md:before {\n  content: \"\\f0f0\";\n}\n.fa-stethoscope:before {\n  content: \"\\f0f1\";\n}\n.fa-suitcase:before {\n  content: \"\\f0f2\";\n}\n.fa-bell-o:before {\n  content: \"\\f0a2\";\n}\n.fa-coffee:before {\n  content: \"\\f0f4\";\n}\n.fa-cutlery:before {\n  content: \"\\f0f5\";\n}\n.fa-file-text-o:before {\n  content: \"\\f0f6\";\n}\n.fa-building-o:before {\n  content: \"\\f0f7\";\n}\n.fa-hospital-o:before {\n  content: \"\\f0f8\";\n}\n.fa-ambulance:before {\n  content: \"\\f0f9\";\n}\n.fa-medkit:before {\n  content: \"\\f0fa\";\n}\n.fa-fighter-jet:before {\n  content: \"\\f0fb\";\n}\n.fa-beer:before {\n  content: \"\\f0fc\";\n}\n.fa-h-square:before {\n  content: \"\\f0fd\";\n}\n.fa-plus-square:before {\n  content: \"\\f0fe\";\n}\n.fa-angle-double-left:before {\n  content: \"\\f100\";\n}\n.fa-angle-double-right:before {\n  content: \"\\f101\";\n}\n.fa-angle-double-up:before {\n  content: \"\\f102\";\n}\n.fa-angle-double-down:before {\n  content: \"\\f103\";\n}\n.fa-angle-left:before {\n  content: \"\\f104\";\n}\n.fa-angle-right:before {\n  content: \"\\f105\";\n}\n.fa-angle-up:before {\n  content: \"\\f106\";\n}\n.fa-angle-down:before {\n  content: \"\\f107\";\n}\n.fa-desktop:before {\n  content: \"\\f108\";\n}\n.fa-laptop:before {\n  content: \"\\f109\";\n}\n.fa-tablet:before {\n  content: \"\\f10a\";\n}\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\f10b\";\n}\n.fa-circle-o:before {\n  content: \"\\f10c\";\n}\n.fa-quote-left:before {\n  content: \"\\f10d\";\n}\n.fa-quote-right:before {\n  content: \"\\f10e\";\n}\n.fa-spinner:before {\n  content: \"\\f110\";\n}\n.fa-circle:before {\n  content: \"\\f111\";\n}\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\f112\";\n}\n.fa-github-alt:before {\n  content: \"\\f113\";\n}\n.fa-folder-o:before {\n  content: \"\\f114\";\n}\n.fa-folder-open-o:before {\n  content: \"\\f115\";\n}\n.fa-smile-o:before {\n  content: \"\\f118\";\n}\n.fa-frown-o:before {\n  content: \"\\f119\";\n}\n.fa-meh-o:before {\n  content: \"\\f11a\";\n}\n.fa-gamepad:before {\n  content: \"\\f11b\";\n}\n.fa-keyboard-o:before {\n  content: \"\\f11c\";\n}\n.fa-flag-o:before {\n  content: \"\\f11d\";\n}\n.fa-flag-checkered:before {\n  content: \"\\f11e\";\n}\n.fa-terminal:before {\n  content: \"\\f120\";\n}\n.fa-code:before {\n  content: \"\\f121\";\n}\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\f122\";\n}\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\f123\";\n}\n.fa-location-arrow:before {\n  content: \"\\f124\";\n}\n.fa-crop:before {\n  content: \"\\f125\";\n}\n.fa-code-fork:before {\n  content: \"\\f126\";\n}\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\f127\";\n}\n.fa-question:before {\n  content: \"\\f128\";\n}\n.fa-info:before {\n  content: \"\\f129\";\n}\n.fa-exclamation:before {\n  content: \"\\f12a\";\n}\n.fa-superscript:before {\n  content: \"\\f12b\";\n}\n.fa-subscript:before {\n  content: \"\\f12c\";\n}\n.fa-eraser:before {\n  content: \"\\f12d\";\n}\n.fa-puzzle-piece:before {\n  content: \"\\f12e\";\n}\n.fa-microphone:before {\n  content: \"\\f130\";\n}\n.fa-microphone-slash:before {\n  content: \"\\f131\";\n}\n.fa-shield:before {\n  content: \"\\f132\";\n}\n.fa-calendar-o:before {\n  content: \"\\f133\";\n}\n.fa-fire-extinguisher:before {\n  content: \"\\f134\";\n}\n.fa-rocket:before {\n  content: \"\\f135\";\n}\n.fa-maxcdn:before {\n  content: \"\\f136\";\n}\n.fa-chevron-circle-left:before {\n  content: \"\\f137\";\n}\n.fa-chevron-circle-right:before {\n  content: \"\\f138\";\n}\n.fa-chevron-circle-up:before {\n  content: \"\\f139\";\n}\n.fa-chevron-circle-down:before {\n  content: \"\\f13a\";\n}\n.fa-html5:before {\n  content: \"\\f13b\";\n}\n.fa-css3:before {\n  content: \"\\f13c\";\n}\n.fa-anchor:before {\n  content: \"\\f13d\";\n}\n.fa-unlock-alt:before {\n  content: \"\\f13e\";\n}\n.fa-bullseye:before {\n  content: \"\\f140\";\n}\n.fa-ellipsis-h:before {\n  content: \"\\f141\";\n}\n.fa-ellipsis-v:before {\n  content: \"\\f142\";\n}\n.fa-rss-square:before {\n  content: \"\\f143\";\n}\n.fa-play-circle:before {\n  content: \"\\f144\";\n}\n.fa-ticket:before {\n  content: \"\\f145\";\n}\n.fa-minus-square:before {\n  content: \"\\f146\";\n}\n.fa-minus-square-o:before {\n  content: \"\\f147\";\n}\n.fa-level-up:before {\n  content: \"\\f148\";\n}\n.fa-level-down:before {\n  content: \"\\f149\";\n}\n.fa-check-square:before {\n  content: \"\\f14a\";\n}\n.fa-pencil-square:before {\n  content: \"\\f14b\";\n}\n.fa-external-link-square:before {\n  content: \"\\f14c\";\n}\n.fa-share-square:before {\n  content: \"\\f14d\";\n}\n.fa-compass:before {\n  content: \"\\f14e\";\n}\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\f150\";\n}\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\f151\";\n}\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\f152\";\n}\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\f153\";\n}\n.fa-gbp:before {\n  content: \"\\f154\";\n}\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\f155\";\n}\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\f156\";\n}\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\f157\";\n}\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\f158\";\n}\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\f159\";\n}\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\f15a\";\n}\n.fa-file:before {\n  content: \"\\f15b\";\n}\n.fa-file-text:before {\n  content: \"\\f15c\";\n}\n.fa-sort-alpha-asc:before {\n  content: \"\\f15d\";\n}\n.fa-sort-alpha-desc:before {\n  content: \"\\f15e\";\n}\n.fa-sort-amount-asc:before {\n  content: \"\\f160\";\n}\n.fa-sort-amount-desc:before {\n  content: \"\\f161\";\n}\n.fa-sort-numeric-asc:before {\n  content: \"\\f162\";\n}\n.fa-sort-numeric-desc:before {\n  content: \"\\f163\";\n}\n.fa-thumbs-up:before {\n  content: \"\\f164\";\n}\n.fa-thumbs-down:before {\n  content: \"\\f165\";\n}\n.fa-youtube-square:before {\n  content: \"\\f166\";\n}\n.fa-youtube:before {\n  content: \"\\f167\";\n}\n.fa-xing:before {\n  content: \"\\f168\";\n}\n.fa-xing-square:before {\n  content: \"\\f169\";\n}\n.fa-youtube-play:before {\n  content: \"\\f16a\";\n}\n.fa-dropbox:before {\n  content: \"\\f16b\";\n}\n.fa-stack-overflow:before {\n  content: \"\\f16c\";\n}\n.fa-instagram:before {\n  content: \"\\f16d\";\n}\n.fa-flickr:before {\n  content: \"\\f16e\";\n}\n.fa-adn:before {\n  content: \"\\f170\";\n}\n.fa-bitbucket:before {\n  content: \"\\f171\";\n}\n.fa-bitbucket-square:before {\n  content: \"\\f172\";\n}\n.fa-tumblr:before {\n  content: \"\\f173\";\n}\n.fa-tumblr-square:before {\n  content: \"\\f174\";\n}\n.fa-long-arrow-down:before {\n  content: \"\\f175\";\n}\n.fa-long-arrow-up:before {\n  content: \"\\f176\";\n}\n.fa-long-arrow-left:before {\n  content: \"\\f177\";\n}\n.fa-long-arrow-right:before {\n  content: \"\\f178\";\n}\n.fa-apple:before {\n  content: \"\\f179\";\n}\n.fa-windows:before {\n  content: \"\\f17a\";\n}\n.fa-android:before {\n  content: \"\\f17b\";\n}\n.fa-linux:before {\n  content: \"\\f17c\";\n}\n.fa-dribbble:before {\n  content: \"\\f17d\";\n}\n.fa-skype:before {\n  content: \"\\f17e\";\n}\n.fa-foursquare:before {\n  content: \"\\f180\";\n}\n.fa-trello:before {\n  content: \"\\f181\";\n}\n.fa-female:before {\n  content: \"\\f182\";\n}\n.fa-male:before {\n  content: \"\\f183\";\n}\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\f184\";\n}\n.fa-sun-o:before {\n  content: \"\\f185\";\n}\n.fa-moon-o:before {\n  content: \"\\f186\";\n}\n.fa-archive:before {\n  content: \"\\f187\";\n}\n.fa-bug:before {\n  content: \"\\f188\";\n}\n.fa-vk:before {\n  content: \"\\f189\";\n}\n.fa-weibo:before {\n  content: \"\\f18a\";\n}\n.fa-renren:before {\n  content: \"\\f18b\";\n}\n.fa-pagelines:before {\n  content: \"\\f18c\";\n}\n.fa-stack-exchange:before {\n  content: \"\\f18d\";\n}\n.fa-arrow-circle-o-right:before {\n  content: \"\\f18e\";\n}\n.fa-arrow-circle-o-left:before {\n  content: \"\\f190\";\n}\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\f191\";\n}\n.fa-dot-circle-o:before {\n  content: \"\\f192\";\n}\n.fa-wheelchair:before {\n  content: \"\\f193\";\n}\n.fa-vimeo-square:before {\n  content: \"\\f194\";\n}\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\f195\";\n}\n.fa-plus-square-o:before {\n  content: \"\\f196\";\n}\n.fa-space-shuttle:before {\n  content: \"\\f197\";\n}\n.fa-slack:before {\n  content: \"\\f198\";\n}\n.fa-envelope-square:before {\n  content: \"\\f199\";\n}\n.fa-wordpress:before {\n  content: \"\\f19a\";\n}\n.fa-openid:before {\n  content: \"\\f19b\";\n}\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\f19c\";\n}\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\f19d\";\n}\n.fa-yahoo:before {\n  content: \"\\f19e\";\n}\n.fa-google:before {\n  content: \"\\f1a0\";\n}\n.fa-reddit:before {\n  content: \"\\f1a1\";\n}\n.fa-reddit-square:before {\n  content: \"\\f1a2\";\n}\n.fa-stumbleupon-circle:before {\n  content: \"\\f1a3\";\n}\n.fa-stumbleupon:before {\n  content: \"\\f1a4\";\n}\n.fa-delicious:before {\n  content: \"\\f1a5\";\n}\n.fa-digg:before {\n  content: \"\\f1a6\";\n}\n.fa-pied-piper-pp:before {\n  content: \"\\f1a7\";\n}\n.fa-pied-piper-alt:before {\n  content: \"\\f1a8\";\n}\n.fa-drupal:before {\n  content: \"\\f1a9\";\n}\n.fa-joomla:before {\n  content: \"\\f1aa\";\n}\n.fa-language:before {\n  content: \"\\f1ab\";\n}\n.fa-fax:before {\n  content: \"\\f1ac\";\n}\n.fa-building:before {\n  content: \"\\f1ad\";\n}\n.fa-child:before {\n  content: \"\\f1ae\";\n}\n.fa-paw:before {\n  content: \"\\f1b0\";\n}\n.fa-spoon:before {\n  content: \"\\f1b1\";\n}\n.fa-cube:before {\n  content: \"\\f1b2\";\n}\n.fa-cubes:before {\n  content: \"\\f1b3\";\n}\n.fa-behance:before {\n  content: \"\\f1b4\";\n}\n.fa-behance-square:before {\n  content: \"\\f1b5\";\n}\n.fa-steam:before {\n  content: \"\\f1b6\";\n}\n.fa-steam-square:before {\n  content: \"\\f1b7\";\n}\n.fa-recycle:before {\n  content: \"\\f1b8\";\n}\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\f1b9\";\n}\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\f1ba\";\n}\n.fa-tree:before {\n  content: \"\\f1bb\";\n}\n.fa-spotify:before {\n  content: \"\\f1bc\";\n}\n.fa-deviantart:before {\n  content: \"\\f1bd\";\n}\n.fa-soundcloud:before {\n  content: \"\\f1be\";\n}\n.fa-database:before {\n  content: \"\\f1c0\";\n}\n.fa-file-pdf-o:before {\n  content: \"\\f1c1\";\n}\n.fa-file-word-o:before {\n  content: \"\\f1c2\";\n}\n.fa-file-excel-o:before {\n  content: \"\\f1c3\";\n}\n.fa-file-powerpoint-o:before {\n  content: \"\\f1c4\";\n}\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\f1c5\";\n}\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\f1c6\";\n}\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\f1c7\";\n}\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\f1c8\";\n}\n.fa-file-code-o:before {\n  content: \"\\f1c9\";\n}\n.fa-vine:before {\n  content: \"\\f1ca\";\n}\n.fa-codepen:before {\n  content: \"\\f1cb\";\n}\n.fa-jsfiddle:before {\n  content: \"\\f1cc\";\n}\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\f1cd\";\n}\n.fa-circle-o-notch:before {\n  content: \"\\f1ce\";\n}\n.fa-ra:before,\n.fa-resistance:before,\n.fa-rebel:before {\n  content: \"\\f1d0\";\n}\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\f1d1\";\n}\n.fa-git-square:before {\n  content: \"\\f1d2\";\n}\n.fa-git:before {\n  content: \"\\f1d3\";\n}\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\\f1d4\";\n}\n.fa-tencent-weibo:before {\n  content: \"\\f1d5\";\n}\n.fa-qq:before {\n  content: \"\\f1d6\";\n}\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\f1d7\";\n}\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\f1d8\";\n}\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\f1d9\";\n}\n.fa-history:before {\n  content: \"\\f1da\";\n}\n.fa-circle-thin:before {\n  content: \"\\f1db\";\n}\n.fa-header:before {\n  content: \"\\f1dc\";\n}\n.fa-paragraph:before {\n  content: \"\\f1dd\";\n}\n.fa-sliders:before {\n  content: \"\\f1de\";\n}\n.fa-share-alt:before {\n  content: \"\\f1e0\";\n}\n.fa-share-alt-square:before {\n  content: \"\\f1e1\";\n}\n.fa-bomb:before {\n  content: \"\\f1e2\";\n}\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\f1e3\";\n}\n.fa-tty:before {\n  content: \"\\f1e4\";\n}\n.fa-binoculars:before {\n  content: \"\\f1e5\";\n}\n.fa-plug:before {\n  content: \"\\f1e6\";\n}\n.fa-slideshare:before {\n  content: \"\\f1e7\";\n}\n.fa-twitch:before {\n  content: \"\\f1e8\";\n}\n.fa-yelp:before {\n  content: \"\\f1e9\";\n}\n.fa-newspaper-o:before {\n  content: \"\\f1ea\";\n}\n.fa-wifi:before {\n  content: \"\\f1eb\";\n}\n.fa-calculator:before {\n  content: \"\\f1ec\";\n}\n.fa-paypal:before {\n  content: \"\\f1ed\";\n}\n.fa-google-wallet:before {\n  content: \"\\f1ee\";\n}\n.fa-cc-visa:before {\n  content: \"\\f1f0\";\n}\n.fa-cc-mastercard:before {\n  content: \"\\f1f1\";\n}\n.fa-cc-discover:before {\n  content: \"\\f1f2\";\n}\n.fa-cc-amex:before {\n  content: \"\\f1f3\";\n}\n.fa-cc-paypal:before {\n  content: \"\\f1f4\";\n}\n.fa-cc-stripe:before {\n  content: \"\\f1f5\";\n}\n.fa-bell-slash:before {\n  content: \"\\f1f6\";\n}\n.fa-bell-slash-o:before {\n  content: \"\\f1f7\";\n}\n.fa-trash:before {\n  content: \"\\f1f8\";\n}\n.fa-copyright:before {\n  content: \"\\f1f9\";\n}\n.fa-at:before {\n  content: \"\\f1fa\";\n}\n.fa-eyedropper:before {\n  content: \"\\f1fb\";\n}\n.fa-paint-brush:before {\n  content: \"\\f1fc\";\n}\n.fa-birthday-cake:before {\n  content: \"\\f1fd\";\n}\n.fa-area-chart:before {\n  content: \"\\f1fe\";\n}\n.fa-pie-chart:before {\n  content: \"\\f200\";\n}\n.fa-line-chart:before {\n  content: \"\\f201\";\n}\n.fa-lastfm:before {\n  content: \"\\f202\";\n}\n.fa-lastfm-square:before {\n  content: \"\\f203\";\n}\n.fa-toggle-off:before {\n  content: \"\\f204\";\n}\n.fa-toggle-on:before {\n  content: \"\\f205\";\n}\n.fa-bicycle:before {\n  content: \"\\f206\";\n}\n.fa-bus:before {\n  content: \"\\f207\";\n}\n.fa-ioxhost:before {\n  content: \"\\f208\";\n}\n.fa-angellist:before {\n  content: \"\\f209\";\n}\n.fa-cc:before {\n  content: \"\\f20a\";\n}\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\f20b\";\n}\n.fa-meanpath:before {\n  content: \"\\f20c\";\n}\n.fa-buysellads:before {\n  content: \"\\f20d\";\n}\n.fa-connectdevelop:before {\n  content: \"\\f20e\";\n}\n.fa-dashcube:before {\n  content: \"\\f210\";\n}\n.fa-forumbee:before {\n  content: \"\\f211\";\n}\n.fa-leanpub:before {\n  content: \"\\f212\";\n}\n.fa-sellsy:before {\n  content: \"\\f213\";\n}\n.fa-shirtsinbulk:before {\n  content: \"\\f214\";\n}\n.fa-simplybuilt:before {\n  content: \"\\f215\";\n}\n.fa-skyatlas:before {\n  content: \"\\f216\";\n}\n.fa-cart-plus:before {\n  content: \"\\f217\";\n}\n.fa-cart-arrow-down:before {\n  content: \"\\f218\";\n}\n.fa-diamond:before {\n  content: \"\\f219\";\n}\n.fa-ship:before {\n  content: \"\\f21a\";\n}\n.fa-user-secret:before {\n  content: \"\\f21b\";\n}\n.fa-motorcycle:before {\n  content: \"\\f21c\";\n}\n.fa-street-view:before {\n  content: \"\\f21d\";\n}\n.fa-heartbeat:before {\n  content: \"\\f21e\";\n}\n.fa-venus:before {\n  content: \"\\f221\";\n}\n.fa-mars:before {\n  content: \"\\f222\";\n}\n.fa-mercury:before {\n  content: \"\\f223\";\n}\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\\f224\";\n}\n.fa-transgender-alt:before {\n  content: \"\\f225\";\n}\n.fa-venus-double:before {\n  content: \"\\f226\";\n}\n.fa-mars-double:before {\n  content: \"\\f227\";\n}\n.fa-venus-mars:before {\n  content: \"\\f228\";\n}\n.fa-mars-stroke:before {\n  content: \"\\f229\";\n}\n.fa-mars-stroke-v:before {\n  content: \"\\f22a\";\n}\n.fa-mars-stroke-h:before {\n  content: \"\\f22b\";\n}\n.fa-neuter:before {\n  content: \"\\f22c\";\n}\n.fa-genderless:before {\n  content: \"\\f22d\";\n}\n.fa-facebook-official:before {\n  content: \"\\f230\";\n}\n.fa-pinterest-p:before {\n  content: \"\\f231\";\n}\n.fa-whatsapp:before {\n  content: \"\\f232\";\n}\n.fa-server:before {\n  content: \"\\f233\";\n}\n.fa-user-plus:before {\n  content: \"\\f234\";\n}\n.fa-user-times:before {\n  content: \"\\f235\";\n}\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\f236\";\n}\n.fa-viacoin:before {\n  content: \"\\f237\";\n}\n.fa-train:before {\n  content: \"\\f238\";\n}\n.fa-subway:before {\n  content: \"\\f239\";\n}\n.fa-medium:before {\n  content: \"\\f23a\";\n}\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\\f23b\";\n}\n.fa-optin-monster:before {\n  content: \"\\f23c\";\n}\n.fa-opencart:before {\n  content: \"\\f23d\";\n}\n.fa-expeditedssl:before {\n  content: \"\\f23e\";\n}\n.fa-battery-4:before,\n.fa-battery:before,\n.fa-battery-full:before {\n  content: \"\\f240\";\n}\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\\f241\";\n}\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\\f242\";\n}\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\\f243\";\n}\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\\f244\";\n}\n.fa-mouse-pointer:before {\n  content: \"\\f245\";\n}\n.fa-i-cursor:before {\n  content: \"\\f246\";\n}\n.fa-object-group:before {\n  content: \"\\f247\";\n}\n.fa-object-ungroup:before {\n  content: \"\\f248\";\n}\n.fa-sticky-note:before {\n  content: \"\\f249\";\n}\n.fa-sticky-note-o:before {\n  content: \"\\f24a\";\n}\n.fa-cc-jcb:before {\n  content: \"\\f24b\";\n}\n.fa-cc-diners-club:before {\n  content: \"\\f24c\";\n}\n.fa-clone:before {\n  content: \"\\f24d\";\n}\n.fa-balance-scale:before {\n  content: \"\\f24e\";\n}\n.fa-hourglass-o:before {\n  content: \"\\f250\";\n}\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\\f251\";\n}\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\\f252\";\n}\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\\f253\";\n}\n.fa-hourglass:before {\n  content: \"\\f254\";\n}\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\\f255\";\n}\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\\f256\";\n}\n.fa-hand-scissors-o:before {\n  content: \"\\f257\";\n}\n.fa-hand-lizard-o:before {\n  content: \"\\f258\";\n}\n.fa-hand-spock-o:before {\n  content: \"\\f259\";\n}\n.fa-hand-pointer-o:before {\n  content: \"\\f25a\";\n}\n.fa-hand-peace-o:before {\n  content: \"\\f25b\";\n}\n.fa-trademark:before {\n  content: \"\\f25c\";\n}\n.fa-registered:before {\n  content: \"\\f25d\";\n}\n.fa-creative-commons:before {\n  content: \"\\f25e\";\n}\n.fa-gg:before {\n  content: \"\\f260\";\n}\n.fa-gg-circle:before {\n  content: \"\\f261\";\n}\n.fa-tripadvisor:before {\n  content: \"\\f262\";\n}\n.fa-odnoklassniki:before {\n  content: \"\\f263\";\n}\n.fa-odnoklassniki-square:before {\n  content: \"\\f264\";\n}\n.fa-get-pocket:before {\n  content: \"\\f265\";\n}\n.fa-wikipedia-w:before {\n  content: \"\\f266\";\n}\n.fa-safari:before {\n  content: \"\\f267\";\n}\n.fa-chrome:before {\n  content: \"\\f268\";\n}\n.fa-firefox:before {\n  content: \"\\f269\";\n}\n.fa-opera:before {\n  content: \"\\f26a\";\n}\n.fa-internet-explorer:before {\n  content: \"\\f26b\";\n}\n.fa-tv:before,\n.fa-television:before {\n  content: \"\\f26c\";\n}\n.fa-contao:before {\n  content: \"\\f26d\";\n}\n.fa-500px:before {\n  content: \"\\f26e\";\n}\n.fa-amazon:before {\n  content: \"\\f270\";\n}\n.fa-calendar-plus-o:before {\n  content: \"\\f271\";\n}\n.fa-calendar-minus-o:before {\n  content: \"\\f272\";\n}\n.fa-calendar-times-o:before {\n  content: \"\\f273\";\n}\n.fa-calendar-check-o:before {\n  content: \"\\f274\";\n}\n.fa-industry:before {\n  content: \"\\f275\";\n}\n.fa-map-pin:before {\n  content: \"\\f276\";\n}\n.fa-map-signs:before {\n  content: \"\\f277\";\n}\n.fa-map-o:before {\n  content: \"\\f278\";\n}\n.fa-map:before {\n  content: \"\\f279\";\n}\n.fa-commenting:before {\n  content: \"\\f27a\";\n}\n.fa-commenting-o:before {\n  content: \"\\f27b\";\n}\n.fa-houzz:before {\n  content: \"\\f27c\";\n}\n.fa-vimeo:before {\n  content: \"\\f27d\";\n}\n.fa-black-tie:before {\n  content: \"\\f27e\";\n}\n.fa-fonticons:before {\n  content: \"\\f280\";\n}\n.fa-reddit-alien:before {\n  content: \"\\f281\";\n}\n.fa-edge:before {\n  content: \"\\f282\";\n}\n.fa-credit-card-alt:before {\n  content: \"\\f283\";\n}\n.fa-codiepie:before {\n  content: \"\\f284\";\n}\n.fa-modx:before {\n  content: \"\\f285\";\n}\n.fa-fort-awesome:before {\n  content: \"\\f286\";\n}\n.fa-usb:before {\n  content: \"\\f287\";\n}\n.fa-product-hunt:before {\n  content: \"\\f288\";\n}\n.fa-mixcloud:before {\n  content: \"\\f289\";\n}\n.fa-scribd:before {\n  content: \"\\f28a\";\n}\n.fa-pause-circle:before {\n  content: \"\\f28b\";\n}\n.fa-pause-circle-o:before {\n  content: \"\\f28c\";\n}\n.fa-stop-circle:before {\n  content: \"\\f28d\";\n}\n.fa-stop-circle-o:before {\n  content: \"\\f28e\";\n}\n.fa-shopping-bag:before {\n  content: \"\\f290\";\n}\n.fa-shopping-basket:before {\n  content: \"\\f291\";\n}\n.fa-hashtag:before {\n  content: \"\\f292\";\n}\n.fa-bluetooth:before {\n  content: \"\\f293\";\n}\n.fa-bluetooth-b:before {\n  content: \"\\f294\";\n}\n.fa-percent:before {\n  content: \"\\f295\";\n}\n.fa-gitlab:before {\n  content: \"\\f296\";\n}\n.fa-wpbeginner:before {\n  content: \"\\f297\";\n}\n.fa-wpforms:before {\n  content: \"\\f298\";\n}\n.fa-envira:before {\n  content: \"\\f299\";\n}\n.fa-universal-access:before {\n  content: \"\\f29a\";\n}\n.fa-wheelchair-alt:before {\n  content: \"\\f29b\";\n}\n.fa-question-circle-o:before {\n  content: \"\\f29c\";\n}\n.fa-blind:before {\n  content: \"\\f29d\";\n}\n.fa-audio-description:before {\n  content: \"\\f29e\";\n}\n.fa-volume-control-phone:before {\n  content: \"\\f2a0\";\n}\n.fa-braille:before {\n  content: \"\\f2a1\";\n}\n.fa-assistive-listening-systems:before {\n  content: \"\\f2a2\";\n}\n.fa-asl-interpreting:before,\n.fa-american-sign-language-interpreting:before {\n  content: \"\\f2a3\";\n}\n.fa-deafness:before,\n.fa-hard-of-hearing:before,\n.fa-deaf:before {\n  content: \"\\f2a4\";\n}\n.fa-glide:before {\n  content: \"\\f2a5\";\n}\n.fa-glide-g:before {\n  content: \"\\f2a6\";\n}\n.fa-signing:before,\n.fa-sign-language:before {\n  content: \"\\f2a7\";\n}\n.fa-low-vision:before {\n  content: \"\\f2a8\";\n}\n.fa-viadeo:before {\n  content: \"\\f2a9\";\n}\n.fa-viadeo-square:before {\n  content: \"\\f2aa\";\n}\n.fa-snapchat:before {\n  content: \"\\f2ab\";\n}\n.fa-snapchat-ghost:before {\n  content: \"\\f2ac\";\n}\n.fa-snapchat-square:before {\n  content: \"\\f2ad\";\n}\n.fa-pied-piper:before {\n  content: \"\\f2ae\";\n}\n.fa-first-order:before {\n  content: \"\\f2b0\";\n}\n.fa-yoast:before {\n  content: \"\\f2b1\";\n}\n.fa-themeisle:before {\n  content: \"\\f2b2\";\n}\n.fa-google-plus-circle:before,\n.fa-google-plus-official:before {\n  content: \"\\f2b3\";\n}\n.fa-fa:before,\n.fa-font-awesome:before {\n  content: \"\\f2b4\";\n}\n.fa-handshake-o:before {\n  content: \"\\f2b5\";\n}\n.fa-envelope-open:before {\n  content: \"\\f2b6\";\n}\n.fa-envelope-open-o:before {\n  content: \"\\f2b7\";\n}\n.fa-linode:before {\n  content: \"\\f2b8\";\n}\n.fa-address-book:before {\n  content: \"\\f2b9\";\n}\n.fa-address-book-o:before {\n  content: \"\\f2ba\";\n}\n.fa-vcard:before,\n.fa-address-card:before {\n  content: \"\\f2bb\";\n}\n.fa-vcard-o:before,\n.fa-address-card-o:before {\n  content: \"\\f2bc\";\n}\n.fa-user-circle:before {\n  content: \"\\f2bd\";\n}\n.fa-user-circle-o:before {\n  content: \"\\f2be\";\n}\n.fa-user-o:before {\n  content: \"\\f2c0\";\n}\n.fa-id-badge:before {\n  content: \"\\f2c1\";\n}\n.fa-drivers-license:before,\n.fa-id-card:before {\n  content: \"\\f2c2\";\n}\n.fa-drivers-license-o:before,\n.fa-id-card-o:before {\n  content: \"\\f2c3\";\n}\n.fa-quora:before {\n  content: \"\\f2c4\";\n}\n.fa-free-code-camp:before {\n  content: \"\\f2c5\";\n}\n.fa-telegram:before {\n  content: \"\\f2c6\";\n}\n.fa-thermometer-4:before,\n.fa-thermometer:before,\n.fa-thermometer-full:before {\n  content: \"\\f2c7\";\n}\n.fa-thermometer-3:before,\n.fa-thermometer-three-quarters:before {\n  content: \"\\f2c8\";\n}\n.fa-thermometer-2:before,\n.fa-thermometer-half:before {\n  content: \"\\f2c9\";\n}\n.fa-thermometer-1:before,\n.fa-thermometer-quarter:before {\n  content: \"\\f2ca\";\n}\n.fa-thermometer-0:before,\n.fa-thermometer-empty:before {\n  content: \"\\f2cb\";\n}\n.fa-shower:before {\n  content: \"\\f2cc\";\n}\n.fa-bathtub:before,\n.fa-s15:before,\n.fa-bath:before {\n  content: \"\\f2cd\";\n}\n.fa-podcast:before {\n  content: \"\\f2ce\";\n}\n.fa-window-maximize:before {\n  content: \"\\f2d0\";\n}\n.fa-window-minimize:before {\n  content: \"\\f2d1\";\n}\n.fa-window-restore:before {\n  content: \"\\f2d2\";\n}\n.fa-times-rectangle:before,\n.fa-window-close:before {\n  content: \"\\f2d3\";\n}\n.fa-times-rectangle-o:before,\n.fa-window-close-o:before {\n  content: \"\\f2d4\";\n}\n.fa-bandcamp:before {\n  content: \"\\f2d5\";\n}\n.fa-grav:before {\n  content: \"\\f2d6\";\n}\n.fa-etsy:before {\n  content: \"\\f2d7\";\n}\n.fa-imdb:before {\n  content: \"\\f2d8\";\n}\n.fa-ravelry:before {\n  content: \"\\f2d9\";\n}\n.fa-eercast:before {\n  content: \"\\f2da\";\n}\n.fa-microchip:before {\n  content: \"\\f2db\";\n}\n.fa-snowflake-o:before {\n  content: \"\\f2dc\";\n}\n.fa-superpowers:before {\n  content: \"\\f2dd\";\n}\n.fa-wpexplorer:before {\n  content: \"\\f2de\";\n}\n.fa-meetup:before {\n  content: \"\\f2e0\";\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\nbody {\n  background-color: #fff;\n  color: #666;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: 14px;\n  line-height: 1.75em;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Lato\", sans-serif;\n  font-weight: 300;\n  line-height: 120%;\n  color: #0099da;\n  margin: 20px 0 17px 0;\n}\nh1 {\n  font-size: 2.3em;\n}\nh2 {\n  font-size: 2em;\n}\nh3 {\n  font-size: 1.7em;\n}\nh4 {\n  font-size: 1.4em;\n}\nh5 {\n  font-size: 1.2em;\n  font-weight: 400;\n}\nh6 {\n  font-size: 1em;\n  font-weight: 400;\n}\na {\n  color: #0099da;\n}\n.form-control {\n  box-shadow: none!important;\n  -webkit-box-shadow: none!important;\n  -moz-box-shadow: none!important;\n}\n.form-control,\n.input-lg,\n.input-sm,\n.input-xs {\n  border-radius: 0!important;\n  -webkit-border-radius: 0!important;\n  -moz-border-radius: 0!important;\n}\neq-checkbox input[type=checkbox].checkbox {\n  display: none;\n}\neq-checkbox input[type=checkbox].checkbox + label {\n  position: relative;\n  cursor: pointer;\n  line-height: 16px;\n  top: -8px;\n  /* checkbox aspect */\n}\neq-checkbox input[type=checkbox].checkbox + label:before {\n  content: '';\n  position: absolute;\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  left: 0;\n  top: 0;\n  background: #ffffff;\n  cursor: pointer;\n  transition: all linear 0.1s;\n  border: 1px solid #c8c8c8;\n  border-radius: 3px;\n}\neq-checkbox input[type=checkbox].checkbox:indeterminate + label:after,\neq-checkbox input[type=checkbox].checkbox:checked + label:after {\n  position: absolute;\n  color: #c8c8c8;\n  content: '';\n  line-height: 0.8;\n  top: 2px;\n  left: 3px;\n  height: 7px;\n  width: 16px;\n  border-left: 3px solid #5db0e1;\n  border-bottom: 3px solid #5db0e1;\n  background: transparent;\n  border-radius: 2px;\n  -webkit-transform: rotate(-50deg);\n  -moz-transform: rotate(-50deg);\n  -o-transform: rotate(-50deg);\n  -ms-transform: rotate(-50deg);\n  transform: rotate(-50deg);\n}\neq-checkbox input[type=checkbox].checkbox:indeterminate + label:before {\n  border: 1px solid #333333;\n  background-color: #333333;\n}\neq-checkbox input[type=checkbox].checkbox:checked + label:before {\n  background-color: #ffffff;\n}\neq-checkbox input[type=checkbox].checkbox:indeterminate + label:after,\neq-checkbox input[type=checkbox].checkbox:checked + label:after {\n  opacity: 1;\n}\neq-checkbox input[type=checkbox].checkbox:disabled:not(:checked),\neq-checkbox input[type=checkbox].checkbox:disabled:checked {\n  position: absolute;\n  left: -9999px;\n}\neq-checkbox input[type=checkbox].checkbox:disabled:not(:checked) + label:before,\neq-checkbox input[type=checkbox].checkbox:disabled:checked + label:before {\n  box-shadow: none;\n  border-color: #bbb;\n  background-color: #ddd;\n}\neq-checkbox input[type=checkbox].checkbox:disabled:not(:checked) + label:after,\neq-checkbox input[type=checkbox].checkbox:disabled:checked + label:after {\n  color: #999;\n}\n";

/***/ }),

/***/ 56:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 57:
/***/ (function(module, exports) {

module.exports = "<label class=label ng-bind=$ctrl.label ng-if=$ctrl.label></label><label for={{::$ctrl.$id}} ng-class=\"{'input':$ctrl.type === 'text','checkbox':$ctrl.type === 'checkbox','state-disabled':$ctrl.disabled,'state-error':$ctrl.form[$ctrl.name].$invalid}\"><input type={{$ctrl.type}} id={{::$ctrl.$id}} ng-disabled=$ctrl.disabled placeholder={{::$ctrl.placeholder}} name={{::$ctrl.name}} ng-required=$ctrl.required list={{::$ctrl.datalist}} ng-model=$ctrl.model><i ng-if=\"$ctrl.type === 'checkbox'\"></i> <span ng-if=\"$ctrl.type === 'checkbox'\" ng-transclude=\"\"></span><datalist id={{::$ctrl.datalist}} ng-if=::$ctrl.autocomplete><option value={{opts.value}} ng-repeat=\"opts in $ctrl.autocomplete track by $index\">{{opts.name}}</datalist></label><p ng-if=$ctrl.note class=note ng-bind-html=$ctrl.note></p><div ng-if=\"$ctrl.noteError && $ctrl.form[$ctrl.name].$invalid\" class=\"note note-error\">This is a required field.</div>";

/***/ }),

/***/ 58:
/***/ (function(module, exports) {

module.exports = "<eq-nav></eq-nav><div ui-view=\"\" class=container></div>";

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = "<div class=container ng-controller=\"QueryBuilderController as $ctrl\"><h1>Angular.js Query Builder</h1><div class=\"alert alert-info\"><strong>Example Output</strong><br><span ng-bind-html=$ctrl.output></span></div><query-builder group=$ctrl.filters fields=$ctrl.fields on-update=$ctrl.onChanges($event) query-string=$ctrl.output></query-builder></div>";

/***/ }),

/***/ 60:
/***/ (function(module, exports) {

module.exports = "<input class=\"checkbox\" type=\"checkbox\" id=\"{{::$ctrl.$id}}\"\n       name=\"{{::$ctrl.name}}\"\n       eq-indeterminate=\"{{$ctrl.indeterminate}}\"\n       ng-model=\"$ctrl.model\">\n<label class=\"lcp-checkbox\" for=\"{{::$ctrl.$id}}\" ng-transclude></label>\n"

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(15)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/less-loader/index.js!./checkbox.less", function() {
			var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/less-loader/index.js!./checkbox.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 62:
/***/ (function(module, exports) {

/**
 * Created by ramor11 on 5/1/2016.
 *  ng-repeat="p in [] | range:3 track by $index"
 */
module.exports = function (app) {
	app.filter('range', function () {
		return function (input, total) {
			total = parseInt(total);
			for (var i = 0; i < total; i++) {
				input.push(i + 1);
			}
			return input;
		};
	});
};


/***/ }),

/***/ 63:
/***/ (function(module, exports) {

module.exports = function (app) {

	"use strict";

	/**
	 * @ngdoc service
	 * @name app.provider:lcpLazyLoaderProvider
	 *
	 * @description
	 *
	 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
	 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
	 * would need to be added into an angular module and delivered to the UI.
	 *
	 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
	 * main module.
	 *
	 */

	app
		.run(['lcpLazyLoader', function (Loader) {

			var _class = [];

			Loader.OnStateChangeStart(function (modules, to) {

				var body = angular.element(document.body),
					setClass = function (state, name) {
						if (!name)return;
						var _name = name.replace(/\./g, '_');
						_class.push(_name);
						body[state](_name);

					};

				_class.forEach(function (_c) {
					body.removeClass(_c);
				});

				//remove all class
				_class.splice(0, _class.length);

				setClass('addClass', modules.join(' '));
				setClass('addClass', to);

			});
		}])
		.provider('lcpLazyLoader', LazyLoaderConfig)
		.provider('jsBundleResolver', BundleResolver);

	function LazyLoaderConfig() {
		app.register = angular.noop;


		this.currentModule = [];

		/**
		 * @ngdoc service
		 * @name app.lcpLazyLoader
		 *
		 * @requires $document
		 * @requires $ocLazyLoad
		 *
		 * @description
		 *
		 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
		 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
		 * would need to be added into an angular module and delivered to the UI.
		 *
		 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
		 * main module.
		 *
		 */


		this.$get = ['$document', '$ocLazyLoad', '$transitions', function ($document, $ocLazyLoad, $transitions) {
			var _this = this;

			/**
			 * @ngdoc function
			 * @name app.lcpLazyLoader#register
			 * @methodOf app.lcpLazyLoader
			 *
			 * @description
			 *
			 *
			 */


			app.register = function (module) {

				this.currentModule = [];


				//if the module has dependencies, recursively include those dependencies
				module.requires.forEach(function (moduleName) {
					_this.currentModule.push(moduleName);
					$ocLazyLoad.inject(moduleName);
				});

				console.log('module._invokeQueue ---- ', module._invokeQueue.map(function (ary) {
					return ary[2][0]
				}));


				return $ocLazyLoad.load({name: module.name}).finally(function () {
					_this.currentModule.push(module.name);

				})
			};

			return {
				OnStateChangeStart: function (fn) {
					var func = typeof fn === 'function' ? fn : function () {
						};
					$transitions.onSuccess({to: '*'}, function (transition) {
						func(_this.currentModule, transition.$to().name)
					});
				}
			};
		}];

	}

	/**
	 * @ngdoc service
	 * @name app.provider:jsBundleResolverProvider
	 *
	 * @description
	 *
	 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
	 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
	 * would need to be added into an angular module and delivered to the UI.
	 *
	 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
	 * main module.
	 *
	 */


	function BundleResolver() {


		/**
		 * @ngdoc service
		 * @name app.provider:jsBundleResolver
		 *
		 * @requires $q
		 *
		 *
		 * @description
		 *
		 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
		 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
		 * would need to be added into an angular module and delivered to the UI.
		 *
		 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
		 * main module.
		 *
		 * @example

		 ```js
		 var routes = [
		 {
             name: 'billinglayout',
             parent: 'dashboard',
             abstract: true,
             views: {
                 //code ...
             },
             resolve: {
                 jsBundleBilling: ['jsBundleResolver', function (jsBundleResolver) {
					//LazyLoad the necessary dependencies for billing.js module
                     return jsBundleResolver(function(app, resolve){
                         require.ensure([], function () {
                             app.register(require('./billing.js'));
                             resolve();
                         });
                     });
                 }]
             }
         }];

		 module.exports = routes;

		 ```
		 *
		 */


		this.$get = ['$q', function ($q) {


			var Bundler = function (callback) {
				var defer = $q.defer(),
					func = angular.isFunction(callback) ? callback : angular.noop;

				func.apply(this, [app, defer.resolve]);


				return defer.promise;

			};


			return Bundler;
		}];


	}

};


/***/ }),

/***/ 64:
/***/ (function(module, exports) {

module.exports = function (app) {
	'use strict';


	app.run(['routeState', function (State) {
		var _class = [];
		State.OnStateChangeStart(function(to, from){
			var body = angular.element(document.body),
				_cName = to.name.replace(/\.?([A-Z])/g, function (x, y) {
					return "-" + y.toLowerCase()
				}).replace(/^_/, "");

			_class.forEach(function (_c) {
				body.removeClass(_c);
			});
			//remove all class
			_class.splice(0, _class.length);
			//replace whats in memory
			_class.push(_cName);
			angular.element(document.body).addClass(_cName); //body[0] !== document.body

		})
	}])
	/**
	 * @ngdoc service
	 * @name eqApp.provider:routeStateProvider
	 *
	 *
	 * @description
	 *
	 * Use `routeStateProvider` to inject|permission into eqApp during config

	 *
	 *
	 */
		.provider('routeState', routeInjector);

	routeInjector.$inject = ['$injector'];

	function routeInjector($injector) {

		var state = null,
			r = [],
			$stateProvider = $injector.get('$stateProvider', 'routeInjector'),
			$locationProvider = $injector.get('$locationProvider', 'routeInjector'),
			$urlRouterProvider = $injector.get('$urlRouterProvider', 'routeInjector');

		/**
		 * @ngdoc function
		 * @name eqApp.provider:routeStateProvider#inject
		 * @methodOf eqApp.provider:routeStateProvider
		 *
		 *
		 * @param {Array=} routes to inject for module
		 *
		 * @description
		 * Inject routes bases on uiRouter object tree
		 * @example

		 ```js
		 var routes = [
		 {
             name: 'modulelayout',
             parent: 'dashboard',
             abstract: true,
             views: {
                 //code ...
             },
             resolve: {
                 jsBundleBilling: ['jsBundleResolver', function (jsBundleResolver) {
					//LazyLoad the necessary dependencies for billing.js module
                     return jsBundleResolver(function(app, resolve){
                         require.ensure([], function () {
                             app.register(require('./billing.js'));
                             resolve();
                         });
                     });
                 }]
             }
         }];

		 module.exports = routes;

		 ```
		 *
		 */
		this.inject = function (routes) {
			angular.forEach(routes, function (route) {
				var views = route.views || {};

				Object.keys(views).forEach(function (key) {
					var tem = views[key].templateUrl;
					if (tem) {
						views[key].templateUrl = angular.isArray(tem) ? tem.join('/').replace(/\/\//g, '/') : tem;
					}
				});

				route.data = Object.assign({}, route.data, {
					debug: location.search.split('debug=')[1] || location.hash.split('debug=')[1]
				});

				r.push(route);
				$stateProvider.state(route);
			});


			$urlRouterProvider.otherwise(function ($injector) {
				$injector.get('$state').transitionTo('root');
			});

			/**
			 * ## HTML5 pushState support
			 *
			 * This enables urls to be routed with HTML5 pushState so they appear in a
			 * '/someurl' format without a page refresh
			 *
			 * The server must support routing all urls to index.html as a catch-all for
			 * this to function properly,
			 *
			 * The alternative is to disable this which reverts to '#!/someurl'
			 * anchor-style urls.
			 */
			// $locationProvider.html5Mode(true);

		};


		/**
		 * @ngdoc service
		 * @name eqApp.provider:routeState
		 *
		 * @requires $rootScope
		 * @requires $document
		 *
		 * @description
		 * Defines the state of the application rules and views
		 *
		 *
		 * @return {Object|Array} Reference to routeStateProvider injection and permission states
		 *
		 *
		 */

		this.$get = ['$rootScope', function ($rootScope) {


			return {
				OnStateChangeStart: function (fn) {
					var func = typeof fn === 'function' ? fn : function () {
					};
					$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
						func(toState, toParams, fromState, fromParams)
					});
				}
			};
		}];

	}
};


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(12);
module.exports = __webpack_require__(13);


/***/ })

},[65]);
//# sourceMappingURL=app.b0606c176cb4d36c9b84.bundle.map