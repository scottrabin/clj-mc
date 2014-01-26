define(function() {
	"use strict";

	/**
	 * Convert an object into a set of classes.
	 *
	 * If the host object is a hash, then include any key
	 * for which the value is truthy;
	 *
	 * If the host object is an array, then include each
	 * value of the array;
	 *
	 * If the host object is anything else, convert it into
	 * a string and include all items in the space-separated list
	 *
	 * @param {Object|Array|*} o
	 * @return {String}
	 */
	return function toClassName(o) {
		var r;
		if ($.isPlainObject(o)) {
			r = [];
			$.each(o, function(cn, pass) {
				if (pass) {
					r.push(cn);
				}
			});
		} else if ($.isArray(o)) {
			r = o;
		} else {
			r = o.toString().split(/\s+/);
		}

		return r.join(' ');
	};
});
