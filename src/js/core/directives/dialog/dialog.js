/**
 * Created by reyra on 11/4/2016.
 *
 *
 * @ngdoc module
 * @name eq.components.dialog
 */


module.exports = function (app) {

	'use strict';

	require('./index.less');

	app.factory('$eqDialog', DialogService)

	DialogService.$inject = ['$eqCompiler', 'utilities'];

	/**
	 * @ngdoc service
	 * @name $mdDialog
	 * @module eq.components.dialog
	 *
	 * * @description
	 * `$mdDialog` opens a dialog over the app to inform users about critical information or require
	 *  them to make decisions. There are two approaches for setup: a simple promise API
	 *  and regular object syntax.
	 *
	 * ## Restrictions
	 *
	 * - The dialog is always given an isolate scope.
	 * - The dialog's template must have an outer `<md-dialog>` element.
	 *
	 *
	 * @usage
	 * <hljs lang="html">
	 *  return new $eqDialog({
			templateUrl: '{string}',
			controller: '{string | function}',
			controllerAs: '{string}',
			backdrop: '{boolean = true}',
			//if backdrop exist, draggable is false
			//if draggable is true, then backdrop is false
			draggable: '{boolean = false}',
			transformTemplate: '{function}',
			bindToController: '{boolean = false}',
			//define local parameter to inject into controller
			locals: {
				Filter: _this
			},
			//define promise resolve to inject into controller
			resolve: {
				SomeResolveObject: '{function | Promise}'
			},
		}).show(function (param) {
			//Invoke during $eqMaterial.hide(param)
		}, function (param) {
			//Invoke during $eqMaterial.cancel(param)
		}).clickOutsideToClose('{boolean|function}')
	 // When clickOutsideToClose is define it will allow for closing the dialog outside of the content
	 *
	 * </hljs>
	 *
	 */
	function DialogService($compiler, utilities) {

		var Dialog = function (opt) {
			if (typeof opt === 'object') this.options = opt;
		};


		Dialog.prototype.inject = function (target, html) {
			var _this = this,
				template = angular.element(_this.o.template),
				panel = template.find(target).empty(),
				body = angular.element(html);

			panel.append(body);
			angular.extend(_this.o, {template: template[0].outerHTML});

			return _this;
		};

		Dialog.prototype.show = function () {
			if (this.compiled) this.cancel();

			var args = utilities.getArgs.apply(this, arguments);
			var _this = this,
				opts = typeof args[0] === 'object' ? args : function () {
					args.splice(0, 0, _this.options);
					return args;
				}(),
				$eqDialog = {};


			['cancel', 'hide', 'show'].forEach(function (h) {
				$eqDialog[h] = function () {
					this[h].apply(this, utilities.getArgs.apply(this, arguments));
				}.bind(_this)
			});

			Object.assign(opts[0], {$eqDialog: $eqDialog});

			$compiler.apply(_this, opts);

			return {
				clickOutsideToClose: function () {
					_this.clickOutsideToClose = utilities.getArgs.apply(_this, arguments);
				},
				then: function (resolve, reject) {
					_this.deffer = {
						resolve: angular.isFunction(resolve) ? resolve : angular.noop,
						reject: angular.isFunction(resolve) ? reject : angular.noop
					};
				}
			}
		};


		function _Promise(res, args) {
			var _this = this;
			return _this.$destroy().then(function ($element) {
				$element.remove();
				clearTimeout(_this.timeout);
				if (_this.hasOwnProperty('deffer')) {
					var deffer = _this.deffer[res ? 'resolve' : 'reject'];
					if (deffer)deffer.apply(_this, utilities.getArgs.apply(_this, args));
					delete _this.deffer;
				}
			}, angular.noop);
		}

		Dialog.prototype.cancel = function () {
			_Promise.apply(this, [false, utilities.getArgs.apply(this, arguments)]);
		};

		Dialog.prototype.hide = function () {
			_Promise.apply(this, [true, utilities.getArgs.apply(this, arguments)]);
		};

		return Dialog;
	}


};
