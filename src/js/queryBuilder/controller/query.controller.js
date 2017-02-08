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


		this.output = "Account Country equal `United States` AND ( ( Patient Gender less_than `M` AND Patient Age equal `` ) OR Patient Gender equal `F` )"
		// this.output = "Account Country equal `United States`"

		var ref = JSON_DATASET,
			mapping = function (d) {
				var handler = {
					description: d.description,
					name: d.resultColumnName,
					dataType: d.type,
					type: d.partType
				};
				if (d.function)Object.assign(handler, {'function': d.function});
				return handler;
			};

		this.fields = angular.copy(ref.dimension.map(mapping)).concat(ref.measures.map(mapping));


		this.onChanges = function (e) {
			if (e.group)this.getFields(e.group);
			if (!angular.equals(this.output, e.string)) {
				this.output = e.string;
			}
		};


		this.getFields = function (group) {
			var self = this;
			var cCopy = angular.copy(group);
			group.expressions.forEach(function (o, i) {
				!function (obj) {
					if (obj.type === 'condition') {
						var test = self.fields.map(function (o) {
							if (obj.field.name === o.name)
								return obj.field = o;
						});
					} else {
						obj = self.getFields(obj)
					}
				}(o)
			});

			return cCopy;
		};


	}

};
