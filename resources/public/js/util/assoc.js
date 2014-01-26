define(function(require) {
	"use strict";

	/**
	 * Create a new object with an additional key/value pair,
	 * merged with a given object. Does not modify the original object.
	 *
	 * @param {Object} obj Base set of key/value pairs
	 * @param {String} key New key to associate into the object
	 * @param {*} val New value to associate into the object
	 * @return {Object} A new object with the values of the original object, plus
	 *                  the given key/value pair
	 */
	return function assoc(obj, key, val) {
		var o = {};
		o[key] = val;
		return $.extend(o, obj);
	};
});
