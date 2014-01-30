define(function(require) {
	"use strict";
	var toSlug = require('util/toslug');
	var toAssetSource = require('util/toassetsource');

	function TVShow(tvshow) {
		this._tvshow = tvshow;
	}

	/**
	 * Get the unique ID of this TV show
	 *
	 * @return {Number}
	 */
	TVShow.prototype.getId = function() {
		return this._tvshow.tvshowid;
	};

	/**
	 * Get the title of the movie
	 *
	 * @return {String}
	 */
	TVShow.prototype.getTitle = function() {
		return this._tvshow.title;
	};

	/**
	 * Return the link to a specific TV Show
	 *
	 * @return {String}
	 */
	TVShow.prototype.getUrl = function() {
		return "#/tv-shows/" + toSlug(this._tvshow.title);
	};

	/**
	 * Get a link to a TV show's artwork
	 *
	 * @return {String}
	 */
	TVShow.prototype.getArt = function(type) {
		return toAssetSource(this._tvshow.art[type]);
	};

	return TVShow;
});
