var sample = {
	"type": "group",
	"op": "AND",
	"expressions": [{
		"type": "condition",
		"field": {
			"description": "Account Country"
		},
		"operator": "EQ",
		"values": ["United States"]
	}, { //NEW GROUP
		"type": "group",
		"op": "AND",
		"expressions": [{
			//NEW GROUP
			"type": "group",
			"op": "AND",
			"expressions": []
		}]
	}]
};
