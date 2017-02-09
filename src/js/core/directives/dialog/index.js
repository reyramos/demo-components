/**
 * Created by reyra on 11/6/2016.
 */


module.exports = function (app) {
	require('./dialog')(app);
	require('./dialog.directive')(app);
};
