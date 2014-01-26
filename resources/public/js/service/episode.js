define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var TVShow = require('service/tvshow');

	var leftPad = require('util/leftpad');
	var toSlug = require('util/toslug');

	var Episode = {};

	/**
	 * Fetch the episodes for a given TV show
	 *
	 * @param {TVShow} tvshow
	 * @return {$.Deferred}
	 */
	Episode.fetch = function(tvshow) {
		return Xbmc.sendCommand("VideoLibrary.GetEpisodes", {
			tvshowid: tvshow.tvshowid,
			properties: [
				"title", "plot", "votes", "rating", "writer", "firstaired",
				"playcount", "runtime", "director", "productioncode",
				"season", "episode", "originaltitle", "showtitle", "cast",
				"streamdetails", "lastplayed", "fanart", "thumbnail",
				"file", "resume", "tvshowid", "dateadded", "uniqueid", "art"
			]
		}).then(function(response) {
			console.log("[ Episode.fetch ] response:", response);

			return response.result.episodes.sort(function(a, b) {
				if (a.season !== b.season) {
					return (a.season - b.season);
				}
				return (a.episode - b.episode);
			});
		})
	};

	/**
	 * Generate a link to a specific episode of a TV show
	 *
	 * @param {TVShow} tvshow
	 * @param {Episode} episode
	 * @return {String}
	 */
	Episode.linkTo = function(tvshow, episode) {
		return TVShow.linkTo(tvshow) + '/S' + leftPad(episode.season) + "E" + leftPad(episode.episode);
	};

	return Episode;
});
