define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var TVShow = require('type/tvshow');

	var toSlug = require('util/toslug');

	var TVShowService = {};

	/**
	 * Fetch all of the TV shows from the Xbmc server
	 *
	 * @return {$.Deferred}
	 */
	TVShowService.fetch = function() {
		return Xbmc.sendCommand("VideoLibrary.GetTVShows", {
			properties: [
				"title", "genre", "year", "rating", "plot", "studio",
				"mpaa", "cast", "playcount", "episode", "imdbnumber",
				"premiered", "votes", "lastplayed", "fanart", "thumbnail",
				"file", "originaltitle", "sorttitle", "episodeguide",
				"season", "watchedepisodes", "dateadded", "tag", "art"
			]
		}).then(function(response) {
			console.log("[ TVShowService.fetch ] response:", response);

			return response.result.tvshows.reduce(function(r, tvshow) {
				r[toSlug(tvshow.title)] = new TVShow(tvshow);
				return r;
			}, {});
		});
	};

	return TVShowService;
});
