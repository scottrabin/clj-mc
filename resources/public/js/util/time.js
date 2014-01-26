define(function(require) {
	"use strict";
	var leftPad = require('util/leftpad');

	var Time = function(t) {
		this._date = new Date((t.hours || 0) * 3600 * 60 * 1000 +
							  (t.minutes || 0) * 60 * 1000 +
							  (t.seconds || 0) * 1000 +
							  (t.milliseconds || 0));
	};
	Time.prototype.getHours = function() {
		return this._date.getUTCHours();
	};
	Time.prototype.getMinutes = function() {
		return this._date.getUTCMinutes();
	};
	Time.prototype.getSeconds = function() {
		return this._date.getUTCSeconds();
	};
	Time.prototype.getMilliseconds = function() {
		return this._date.getUTCMilliseconds();
	};
	Time.prototype.add = function(ms) {
		this._date.setUTCMilliseconds(this._date.getUTCMilliseconds() + ms);
	};
	Time.prototype.toString = function() {
		var result = [];
		var hrs = this.getHours();
		if (hrs > 0) {
			result.push(hrs);
		}
		result.push(leftPad(this.getMinutes()), leftPad(this.getSeconds()));
		return result.join(":");
	};

	return Time;
});
