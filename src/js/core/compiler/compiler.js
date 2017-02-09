/**
 * Created by reyra on 1/4/2017.
 */


module.exports = function (app) {

	'use strict';

	app.factory('$eqCompiler', DialogCompile);

	DialogCompile.$inject = ['$rootElement', '$rootScope', '$q', '$compile', '$templateCache', "$injector", "$controller", "utilities"];

	function DialogCompile($rootElement, $rootScope, $q, $compile, $templateCache, $injector, $controller, utilities) {

		var _defaults = {
			template: "",
			templateUrl: "",
			draggable: false,
			backdrop: true,
			locals: {},
			resolve: {},
			controllerAs: "",
			bindToController: false,
			clickOutsideToClose: false,
			target: false
		};

		Object.freeze(_defaults);

		function setOpts(opt) {
			var _this = this,
				options = angular.extend({}, angular.copy(_defaults), {
					scope: $rootScope.$new(opt.isolateScope),
					parent: document.querySelector('body'),
					transformTemplate: angular.identity,
					controller: angular.noop
				}, opt || {}, function (opt) {
					var _options = {
						backdrop: opt.draggable ? ( opt.backdrop ? opt.backdrop : false) : _defaults.backdrop
					};
					_options.draggable = opt.draggable ? (opt.backdrop ? !opt.backdrop : opt.draggable) : _defaults.draggable;

					if (angular.isDefined(opt.bindToScope)) {
						opt.bindToScope.$on('$destroy', function () {
							this.cancel();
						}.bind(this));

					}
					return _options;
				}.bind(this)(opt || {}));

			options.template = options.template || $templateCache.get(options.templateUrl);
			if (!_this.options) _this.options = {};
			Object.assign(_this.options, options);
			return options;
		}

		/*
		 * @ngdoc service
		 * @name $eqCompiler
		 * @module eq.core
		 * @description
		 * The $eqCompiler service is an abstraction of angular's compiler, that allows the developer
		 * to easily compile an element with a templateUrl, controller, and locals.
		 *
		 * @usage
		 * <hljs lang="js">
		 * $eqCompiler.compile({
		 *   templateUrl: 'modal.html',
		 *   controller: 'ModalCtrl',
		 *   locals: {
		 *     modal: myModalInstance;
		 *   }
		 * }).then(function(compiled) {
		 *   compiled.element; // modal.html's template in an element
		 *   compiled.link(myScope); //attach controller & scope to element
		 * });
		 * </hljs>
		 */
		function compile() {

			var _this = this,
				args = utilities.getArgs.apply(this, arguments),
				cb = angular.noop,
				opts = typeof args[0] === 'object' ? setOpts.apply(_this, [args[0]]) : false,
				resolve = (opts ? args[1] : args[0]) || cb,
				reject = (opts ? args[2] : args[1]) || cb;


			_this.deffer = {
				resolve: resolve,
				reject: reject
			};

			_this.$destroy = destroy;

			// Take resolve values and invoke them.
			// Resolves can either be a string (value: 'MyRegisteredAngularConst'),
			// or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
			angular.forEach(opts.resolve, function (value, key) {
				opts.resolve[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value);
			});

			//Add the locals, which are just straight values to inject
			//eg locals: { three: 3 }, will inject three into the controller
			angular.extend(opts.resolve, opts.locals);
			opts.resolve.$template = opts.template || $templateCache.get(opts.templateUrl);

			// Wait for all the resolves to finish if they are promises
			return $q.all(opts.resolve).then(function (locals) {

				var compiledData;
				var template = opts.transformTemplate(locals.$template, opts);
				var element = opts.element || angular.element('<div>').html(template.trim()).contents();
				var linkFn = $compile(element);

				element.data('$eqCompiler', opts);

				// Return a linking function that can be used later when the element is ready
				compiledData = {
					locals: locals,
					element: element,
					link: function link(scope) {
						locals.$scope = Object.assign(scope, {
							$$id: (new Date().getTime()).toString(36)
						});

						//Instantiate controller if it exists, because we have scope
						if (opts.controller) {
							var invokeCtrl = $controller(opts.controller, locals, true, opts.controllerAs);
							if (opts.bindToController) {
								angular.extend(invokeCtrl.instance, locals);
							}
							var ctrl = invokeCtrl();
							//See angular-route source for this logic
							element.data('$ngControllerController', ctrl);
							element.children().data('$ngControllerController', ctrl);

							if (opts.controllerAs) {
								scope[opts.controllerAs] = ctrl;
							}

							// Publish reference to this controller
							compiledData.controller = ctrl;
						}
						return linkFn(scope);
					}
				};


				var element = linkElement(compiledData, opts);

				_this.compiled = compiledData;
				opts.parent.append(element);
				element.addClass('enter');

				if (angular.isDefined(opts.clickOutsideToClose)) clickOutsideToClose.apply(_this, [opts.clickOutsideToClose]);
				return _this;
			});

		}

		/**
		 *  Link an element with compiled configuration
		 */
		function linkElement(compiled, options) {
			angular.extend(compiled.locals, options);

			var element = compiled.link(options.scope);

			// Search for parent at insertion time, if not specified
			options.element = element;
			options.parent = findParent(element, options);

			return element;
		}

		/**
		 * Search for parent at insertion time, if not specified
		 */
		function findParent(element, options) {
			var parent = options.parent;

			// Search for parent at insertion time, if not specified
			if (angular.isFunction(parent)) {
				parent = parent(options.scope, element, options);
			} else if (angular.isString(parent)) {
				parent = angular.element($document[0].querySelector(parent));
			} else {
				parent = angular.element(parent);
			}

			// If parent querySelector/getter function fails, or it's just null,
			// find a default.
			if (!(parent || {}).length) {
				var el;
				if ($rootElement[0] && $rootElement[0].querySelector) {
					el = $rootElement[0].querySelector(':not(svg) > body');
				}
				if (!el) el = $rootElement[0];
				if (el.nodeName == '#comment') {
					el = $document[0].body;
				}
				return angular.element(el);
			}

			return parent;
		}

		function clickOutsideToClose(cb) {
			var _this = this,
				is = typeof cb === 'boolean' ? cb : angular.isFunction(cb),
				$element = _this.compiled.element,
				ch = $element.children();
			if (is)$element.on('click', function (e) {
				e.preventDefault();

				if (!ch[0].contains(e.target)) {
					destroy.apply(_this, []).then(function ($element) {
						$element.remove();
						clearTimeout(_this.timeout);
						if (_this.hasOwnProperty('deffer') && _this.deffer.reject) {
							_this.deffer.reject.apply(_this, []);
							delete _this.deffer;
						}
					}, angular.noop);
					if (is && angular.isFunction(cb)) cb();
				}
			});
		}


		function destroy() {
			var _this = this;
			return new Promise(function (resolve, reject) {
				var $element = angular.isDefined(_this.compiled) ? _this.compiled.element : (angular.isDefined(_this.element) ? _this.element : null);
				if (!$element) reject();
				$element.addClass('leave');
				_this.timeout = setTimeout(function () {
					$element.removeClass('enter leave');
					try {
						$element.contents().scope().$destroy();
					} catch (e) {
					}
					resolve($element);
				}, 250);
			});
		}

		return compile

	}


};
