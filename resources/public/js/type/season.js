define(function(require) {
	"use strict";
	var leftPad = require('util/leftpad');
	var toSlug = require('util/toslug');
	var toAssetSource = require('util/toassetsource');

	function Season(tvshow, season) {
		this._tvshow = tvshow;
		this._season = season;
	}

	/**
	 * Get the season number for this season
	 *
	 * @return {Number}
	 */
	Season.prototype.getSeason = function() {
		return this._season.season;
	};

	/**
	 * Link to a given TV show's season
	 *
	 * @return {String}
	 */
	Season.prototype.getUrl = function() {
		return this._tvshow.getUrl() + '/S' + leftPad(this.getSeason());
	};

	/**
	 * Get a link to a season's artwork
	 *
	 * @return {String}
	 */
	Season.prototype.getArt = function(type) {
		return toAssetSource(this._season.art[type]);
	};

	return Season;
});
