/**
 * Created by ramor11 on 3/1/2016.
 */

var JSON_DATASET = JSON.parse(require('!!raw!../constants/datasets.json'));

module.exports = function (app) {

	app.controller('QueryBuilderController', FilterController);

	FilterController.$inject = ['QUERY_INTERFACE'];

	function FilterController(QUERY_INTERFACE) {

		console.clear();
		this.filters = angular.copy(QUERY_INTERFACE.filters);
		// this.filters = {
		// 	"type": "group",
		// 	"op": "AND",
		// 	"expressions": [{
		// 		"type": "condition",
		// 		"field": {
		// 			"description": "Account Country",
		// 			"name": "DB_PHX_ORDERS_TZ.ORDER_FLAT_2016_DEC_15_TO_31_TABLE.ACCOUNT_COUNTRY",
		// 			"dataType": "STRING",
		// 			"type": "DIMENSION"
		// 		},
		// 		"operator": "EQ",
		// 		"values": ["United States"]
		// 	}, {
		// 		"type": "group",
		// 		"op": "OR",
		// 		"expressions": [{
		// 			"type": "group",
		// 			"op": "AND",
		// 			"expressions": [{
		// 				"type": "condition",
		// 				"field": {
		// 					"description": "Patient Gender",
		// 					"name": "DB_PHX_ORDERS_TZ.ORDER_FLAT_2016_DEC_15_TO_31_TABLE.PATIENT_GENDER",
		// 					"dataType": "STRING",
		// 					"type": "DIMENSION"
		// 				},
		// 				"operator": "LT",
		// 				"values": ["M"]
		// 			}, {
		// 				"type": "condition",
		// 				"operator": "EQ",
		// 				"field": {
		// 					"description": "Patient Age",
		// 					"name": "DB_PHX_ORDERS_TZ.ORDER_FLAT_2016_DEC_15_TO_31_TABLE.PATIENT_AGE",
		// 					"dataType": "STRING",
		// 					"type": "DIMENSION"
		// 				},
		// 				"values": []
		// 			}],
		// 		}, {
		// 			"type": "group",
		// 			"op": "AND",
		// 			"expressions": [{
		// 				"type": "condition",
		// 				"field": {
		// 					"description": "Patient Gender",
		// 					"name": "DB_PHX_ORDERS_TZ.ORDER_FLAT_2016_DEC_15_TO_31_TABLE.PATIENT_GENDER",
		// 					"dataType": "STRING",
		// 					"type": "DIMENSION"
		// 				},
		// 				"operator": "EQ",
		// 				"values": ["F"]
		// 			}]
		// 		}]
		// 	}]
		// };

		var mapping = function (d) {
			var handler = {
				description: d.description,
				name: d.name
			};
			return handler;
		};

		this.fields = angular.copy(JSON_DATASET.dimension.map(mapping));

		this.onChanges = function (e) {

			if (!angular.equals(this.output, e.string)) {
				this.output = e.string;
			}
		};


		// this.getFields = function (group) {
		// 	console.log('getFields', group)
		//
		// 	var self = this;
		// 	group.expressions.forEach(function (o, i) {
		// 		!function (obj) {
		// 			if (obj.type === 'condition') {
		// 				var test = self.fields.map(function (o) {
		// 					if (obj.field.name && obj.field.name === o.name) {
		// 						return obj.field = o;
		// 					} else if (obj.field.description && obj.field.description === o.description) {
		// 						return obj.field = o;
		// 					}
		// 				});
		// 			} else {
		// 				obj = self.getFields(obj)
		// 			}
		// 		}(o)
		// 	});
		//
		// };


	}

};




// WEBPACK FOOTER //
// ./src/js/queryBuilder/controller/query.controller.js