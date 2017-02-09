/**
 * # Application
 *
 * Core Application controller that includes functions used before we kickStart the Application
 * The functions store within this files live outside of the ngView and are used as global function
 */

module.exports = function (app) {
	'use strict';

	app.controller('Contact$eqDialogCtrl', Contact$eqDialogCtrl)


	Contact$eqDialogCtrl.$inject = ['$eqDialog'];

	function Contact$eqDialogCtrl( $eqDialog) {
		this.$eqDialog = $eqDialog;
	}


};
