define(function() {
	"use strict";

	/**
	 * Convert a string into a valid URL string "slug" version
	 *
	 * @param {String} str
	 * @return {String}
	 */
	return function toSlug(str) {
		return str.toString().toLowerCase().
			replace(/[^-a-z0-9]/g, "-").
			replace(/^-+|-+$/g, "");
	};
});
