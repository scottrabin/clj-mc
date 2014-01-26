define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');

	var toSlug = require('util/toslug');

	var TVShow = {};
	/**
	 * Fetch all of the TV shows from the Xbmc server
	 *
	 * @return {$.Deferred}
	 */
	TVShow.fetch = function() {
		return Xbmc.sendCommand("VideoLibrary.GetTVShows", {
			properties: [
				"title", "genre", "year", "rating", "plot", "studio",
				"mpaa", "cast", "playcount", "episode", "imdbnumber",
				"premiered", "votes", "lastplayed", "fanart", "thumbnail",
				"file", "originaltitle", "sorttitle", "episodeguide",
				"season", "watchedepisodes", "dateadded", "tag", "art"
			]
		}).then(function(response) {
			console.log("[ TVShow.fetch ] response:", response);

			return response.result.tvshows.reduce(function(r, tvshow) {
				r[toSlug(tvshow.title)] = tvshow;
				return r;
			}, {});
		});
	};

	/**
	 * Return the link to a specific TV Show
	 *
	 * @param {TVShow} tvshow
	 * @return {String}
	 */
	TVShow.linkTo =  function(tvshow) {
		return "#/tv-shows/" + toSlug(tvshow.title);
	};

	return TVShow;
});
