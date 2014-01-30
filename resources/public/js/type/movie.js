define(function(require) {
	"use strict";
	var toSlug = require('util/toslug');
	var toAssetSource = require('util/toassetsource');

	function Movie(movie) {
		this._movie = movie;
	}

	/**
	 * Get the title of the movie
	 *
	 * @return {String}
	 */
	Movie.prototype.getTitle = function() {
		return this._movie.title;
	};

	/**
	 * Get the plot of the movie
	 *
	 * @return {String}
	 */
	Movie.prototype.getPlot = function() {
		return this._movie.plot;
	};

	/**
	 * Return the link to a specific movie
	 *
	 * @return {String}
	 */
	Movie.prototype.getUrl = function() {
		return "#/movies/" + toSlug(this._movie.title);
	};

	/**
	 * Get a link to a movie's artwork
	 *
	 * @return {String}
	 */
	Movie.prototype.getArt = function(type) {
		return toAssetSource(this._movie.art[type]);
	};

	/**
	 * Get the cast of the movie
	 *
	 * @return {Array<Actor>}
	 */
	Movie.prototype.getCast = function() {
		return this._movie.cast;
	};

	return Movie;
});
