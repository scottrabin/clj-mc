define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var Movie = require('type/movie');

	var toSlug = require('util/toslug');

	var MovieService = {};

	/**
	 * Fetch the set of movies from the Xbmc server
	 *
	 * @return {$.Deferred}
	 */
	MovieService.fetch = function() {
		return Xbmc.sendCommand("VideoLibrary.GetMovies", {
			properties: [
				"title", "genre", "year", "rating", "director", "trailer",
				"tagline", "plot", "plotoutline", "originaltitle", "lastplayed",
				"playcount", "writer", "studio", "mpaa", "cast", "country", "imdbnumber",
				"runtime", "set", "showlink", "streamdetails", "top250", "votes", "fanart",
				"thumbnail", "file", "sorttitle", "resume", "setid", "dateadded", "tag", "art"
			]
		}).then(function(response) {
			console.log("[ MovieService.fetch ] response:", response);

			return response.result.movies.reduce(function(r, movie) {
				r[toSlug(movie.title)] = new Movie(movie);
				return r;
			}, {});
		});
	};

	return MovieService;
});
