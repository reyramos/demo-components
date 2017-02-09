/**
 * Created by ramor11 on 1/11/2016.
 */

module.exports = function (app) {
	"use strict";


	app.provider('eq$http', Custom$http);


	function Custom$http() {
		var _routes = {};

		this.prefix = '';
		this.headers = {};

		this.defineRoutes = function (routes) {
			var self = this;
			Object.keys(routes).forEach(function (key) {
				var string = angular.isArray(routes[key]) ? routes[key].join('/') : routes[key];
				_routes[key] = ([self.prefix, string].join('/')).replace(/\/\//g, '/');
			})
		};

		/**
		 * @ngdoc service
		 *
		 * @requires $location
		 * @requires $http
		 * @requires $q
		 *
		 * @description
		 * Define url services routes
		 *
		 */

		this.$get = ['$http', '$q', function ($http, $q) {

			var host = '';

			var service = {
				/**
				 * @ngdoc object
				 *
				 * @description
				 * Define available routes
				 *
				 */
				routes: _routes,
				/**
				 * @ngdoc object
				 *
				 * @description
				 * Define available headers
				 *
				 */
				headers: this.headers,
				prefix: this.prefix,
				defineRoutes: this.defineRoutes

			};


			function getUrl(string) {

				var route = _routes.hasOwnProperty(string) ? _routes[string] : false,
					args = angular.copy(arguments);

				if (!route)return;

				return route_injector(route, args);
			};

			function route_injector(route, array) {
				var pos = 1;

				angular.forEach(angular.copy(route.split('/')), function (r, i) {
					if (r.indexOf('@') > -1) {
						var re = /(@\w+)/,
							m = re.exec(r);
						route = route.replace(m[0], array[pos] ? array[pos] : "")
						pos++;
					}
				});

				return route;
			}

			/**
			 * @ngdoc function
			 *
			 * @params {String|Array} route KEY_ENUMS from define routes
			 * @params {object=} configs define http config
			 * @params {object=} params = object of data to pass to service
			 *
			 *
			 * @description
			 *
			 *
			 *
			 */
			service.http = function (route, configs, params) {

				var defer = $q.defer(),
					self = this,
					url = service.getUrl(route),
					header = angular.extend({}, {
						method: 'GET',
						url: url,
						data: params,
					}, {
						headers: self.headers
					}, configs);


				$http(header).then(function (res) {
					defer.resolve(res.data);
				}, function (err) {
					defer.reject(err);
				});

				return defer.promise;

			};

			/**
			 * @ngdoc function
			 * @name eq$http#getUrl
			 *
			 *
			 * @params {String|Array} route KEY_ENUMS from define routes
			 *
			 *
			 * @description
			 *
			 * @returns {string} Reference to route KEY_ENUMS with
			 *
			 */
			service.getUrl = function (route) {
				var self = this,
					getUrlRoute = angular.isString(route) ? getUrl(route) : (angular.isArray(route) ? function () {
						var arr = [route[0]];
						angular.forEach(route, function (arg, idx) {
							if (idx > 0 && arg)this.push(arg);
						}, arr);


						return arr.length ? route_injector(_routes[route[0]], arr) : getUrl(route[0]);
					}() : null);


				return angular.copy([!host ? location.origin : host, getUrlRoute].join("/"));
			}

			return service;
		}]


	}

}
