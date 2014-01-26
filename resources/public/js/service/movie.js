define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');

	var toSlug = require('util/toslug');

	var Movie = {};

	/**
	 * Fetch the set of movies from the Xbmc server
	 *
	 * @return {$.Deferred}
	 */
	Movie.fetch = function() {
		return Xbmc.sendCommand("VideoLibrary.GetMovies", {
			properties: [
				"title", "genre", "year", "rating", "director", "trailer",
				"tagline", "plot", "plotoutline", "originaltitle", "lastplayed",
				"playcount", "writer", "studio", "mpaa", "cast", "country", "imdbnumber",
				"runtime", "set", "showlink", "streamdetails", "top250", "votes", "fanart",
				"thumbnail", "file", "sorttitle", "resume", "setid", "dateadded", "tag", "art"
			]
		}).then(function(response) {
			console.log("[ Movie.fetch ] response:", response);

			return response.result.movies.reduce(function(r, movie) {
				r[toSlug(movie.title)] = movie;
				return r;
			}, {});
		});
	};

	/**
	 * Return the link to a specific movie
	 *
	 * @param {Movie} movie
	 * @return {String}
	 */
	Movie.linkTo = function(movie) {
		return "#/movies/" + toSlug(movie.title);
	};

	return Movie;
});
