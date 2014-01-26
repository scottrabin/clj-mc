define(function() {
	"use strict";

	/**
	 * Transform a number into a string with the given number of digits,
	 * filling in 0 when necessary.
	 *
	 * @param {Number} n
	 * @param {Number=} size The size of the resulting string; default: 2
	 * @return {String}
	 */
	return function leftPad(n, size) {
		if (!size) {
			size = 2;
		}
		var str = "" + n;

		return (str.length < size
				? (new Array(size - str.length + 1)).join("0") + str
				: str
			   );
	};
});
