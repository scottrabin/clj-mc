define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var Episode = require('type/episode');

	var EpisodeService = {};

	/**
	 * Fetch the episodes for a given TV show
	 *
	 * @param {TVShow} tvshow
	 * @return {$.Deferred}
	 */
	EpisodeService.fetch = function(tvshow) {
		return Xbmc.sendCommand("VideoLibrary.GetEpisodes", {
			tvshowid: tvshow.getId(),
			properties: [
				"title", "plot", "votes", "rating", "writer", "firstaired",
				"playcount", "runtime", "director", "productioncode",
				"season", "episode", "originaltitle", "showtitle", "cast",
				"streamdetails", "lastplayed", "fanart", "thumbnail",
				"file", "resume", "tvshowid", "dateadded", "uniqueid", "art"
			]
		}).then(function(response) {
			console.log("[ EpisodeService.fetch ] response:", response);

			return response.result.episodes.sort(function(a, b) {
				if (a.season !== b.season) {
					return (a.season - b.season);
				}
				return (a.episode - b.episode);
			}).map(function(episode) {
				return new Episode(tvshow, episode);
			});
		})
	};

	return EpisodeService;
});
