define(function() {
	"use strict";

	/**
	 * Get the first index in a collection where the given test function
	 * returns a truthy value
	 *
	 * @param {Array} coll
	 * @param {Function} testFn
	 * @param {*=} thisObj
	 * @return {Number}
	 */
	return function indexOf(coll, testFn, thisObj) {
		var context = thisObj || null;
		for (var i = 0; i < coll.length; i++) {
			if (testFn.call(context, coll[i], i, coll)) {
				return i;
			}
		}
		return -1;
	};
});
