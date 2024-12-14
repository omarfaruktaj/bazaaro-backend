import type { ParsedQs } from "qs";

/**
 * Filters the specified fields from the query string (req.query).
 * Supports both flat and nested query parameters. Returns only specified fields.
 *
 * @param {ParsedQs} query - The query object from req.query (express).
 * @param {string[]} fields - An array of strings representing the field names to pick.
 * @returns {Record<string, string | Record<string, string>>} - A new object containing only the specified fields from the query.
 */
export function filterQueryParams(
	query: ParsedQs,
	fields: string[],
): Record<string, string | number | Record<string, string | number>> {
	if (!Array.isArray(fields)) {
		throw new Error('The "fields" argument must be an array of strings.');
	}

	const filteredParams: Record<
		string,
		string | number | Record<string, string | number>
	> = {};

	for (const field of fields) {
		// If the field exists in the query, process it
		if (field in query) {
			const value = query[field];

			// Exclude empty, null, undefined, 'null', and 'undefined' values
			if (
				value !== "" &&
				value !== null &&
				value !== undefined &&
				value !== "null" &&
				value !== "undefined" &&
				!isEmptyObject(value)
			) {
				// If the value is an object (i.e., a nested query), handle it properly
				if (isObject(value)) {
					// Recursively filter nested objects
					const filteredNestedParams = filterNestedQueryParams(value);
					if (Object.keys(filteredNestedParams).length > 0) {
						filteredParams[field] = filteredNestedParams;
					}
				} else if (typeof value === "string") {
					// Only include non-empty string values
					filteredParams[field] = value;
				}
			}
		}
	}

	return filteredParams;
}

/**
 * Helper function to recursively filter nested query parameters.
 * This helps to ensure that only valid nested fields (gte, gt, lte, lt) are included.
 *
 * @param {ParsedQs} value - The query parameter value, which could be an object or array.
 * @returns {Record<string, string>} - The filtered value, which could be a nested object.
 */
// function filterNestedQueryParams(value: ParsedQs): Record<string, string> {
// 	// Define the allowed keys in a nested query (gte, gt, lte, lt)
// 	// const allowedKeys = ["gte", "gt", "lte", "lt"];
// 	const allowedKeys = [
// 		"gte",
// 		"gt",
// 		"lte",
// 		"lt",
// 		"in",
// 		"notIn",
// 		"contains",
// 		"startsWith",
// 		"endsWith",
// 		// Add more operators as necessary
// 	];
// 	if (isObject(value)) {
// 		return Object.keys(value).reduce(
// 			(filtered, key) => {
// 				const fieldValue = value[key];

// 				// Only include valid keys (gte, gt, lte, lt) in nested objects
// 				if (allowedKeys.includes(key)) {
// 					if (typeof fieldValue === "string" && fieldValue !== "") {
// 						filtered[key] = fieldValue;
// 					}
// 				}

// 				return filtered;
// 			},
// 			{} as Record<string, string>,
// 		);
// 	}

// 	return {}; // If the value is not a plain object or string, return an empty object
// }
function filterNestedQueryParams(
	value: ParsedQs,
): Record<string, string | number> {
	// Define the allowed keys in a nested query (gte, gt, lte, lt)
	const allowedKeys = [
		"gte",
		"gt",
		"lte",
		"lt",
		"in",
		"notIn",
		"contains",
		"not",
		"startsWith",
		"endsWith",
		// Add more operators as necessary
	];

	if (isObject(value)) {
		return Object.keys(value).reduce(
			(filtered, key) => {
				const fieldValue = value[key];

				// Only include valid keys (gte, gt, lte, lt) in nested objects
				if (allowedKeys.includes(key)) {
					if (typeof fieldValue === "string" && fieldValue !== "") {
						// For the numerical keys (gte, gt, lte, lt), convert string values to numbers if valid
						if (["gte", "gt", "lte", "lt"].includes(key)) {
							// Attempt to convert the value to a number
							const numberValue = Number.parseFloat(fieldValue);
							if (!Number.isNaN(numberValue)) {
								// Include the number value (as a number)
								filtered[key] = numberValue; // Storing as a number
							}
						} else {
							// For other keys like "contains", "in", etc., leave them as strings
							filtered[key] = fieldValue;
						}
					}
				}

				return filtered;
			},
			{} as Record<string, string | number>,
		);
	}

	return {}; // If the value is not a plain object or string, return an empty object
}

/**
 * Simple check for plain objects (not arrays or other non-object types).
 *
 * @param value - The value to check.
 * @returns {boolean} - True if the value is a plain object, false otherwise.
 */
function isObject(
	value: unknown,
): value is Record<string, string | Record<string, string>> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Helper function to check if an object is empty (no keys).
 *
 * @param value - The value to check.
 * @returns {boolean} - True if the object has no keys, false otherwise.
 */
function isEmptyObject(value: unknown): boolean {
	return isObject(value) && Object.keys(value).length === 0;
}
