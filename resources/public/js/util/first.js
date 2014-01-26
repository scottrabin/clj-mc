define(function() {
	"use strict";

	/**
	 * Get the first key defined in a given collection
	 *
	 * @param {Array|Object} coll
	 * @return {Number|String}
	 */
	return function first(coll) {
		if ($.isPlainObject(coll) || $.isArray(coll)) {
			for (var p in coll) {
				if (coll.hasOwnProperty(p)) {
					return p;
				}
			}
			return null;
		}
		throw new Error("Invalid collection: " + JSON.stringify(coll));
	};
});
