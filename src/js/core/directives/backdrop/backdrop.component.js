/**
 * Created by reyra on 1/2/2017.
 */


module.exports = function (app) {
	"use strict";

	require('./backdrop.less');

	app.component('eqBackdrop', {
		controller: ['$element', function ($ele) {
			var timeout = setTimeout(function () {
				$ele.addClass('fade-in');
			}, 1);
			this.$onDestroy = function () {
				clearTimeout(timeout);
			}
		}]
	});


};

