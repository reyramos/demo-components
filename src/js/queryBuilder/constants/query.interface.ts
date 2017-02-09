/**
 * Created by ramor11 on 12/8/2016.
 */


export const QUERY_INTERFACE: any = Object.freeze(
    {
        filters: {
            "type": "group",                // Group | Condition;  If Group, op should be "AND" | "OR" and should contain an "expressions" element whose value is an array of other expressions.
            "op": "AND",                    // AND | OR
            "expressions": [
                {
                    "type": "condition",    // If expression type is "condition", should contain field, operator, and values fields (see description of each below)
                    "field": {
                        "dataType": "",		// This should come from cubeDetails.[measures|dimensions].type
                        "name": "",    		// For both Measures and Dimensions, this should be populated from cubeDetails.[measure|dimension].name
                        "type": "",    		// Either MEASURE or DIMENSION
                        "function": "" 		// If filtering based on Measure, include this field (should come from cubeDetails.measures.function)
                    },
                    "operator": "EQ",    	// LT, LE, GT, GE, EQ, NE, IN, BETWEEN, CONTAINS
                    "values": []       		// For LT, LE, GT, GE, EQ, NE, CONTAINS -> Single value; For IN -> One or more values; For BETWEEN -> Two values
                }
            ]
        }
    }
);

