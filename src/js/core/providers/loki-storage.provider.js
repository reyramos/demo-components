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
					var loki = require('lokijs/src/lokijs');
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
