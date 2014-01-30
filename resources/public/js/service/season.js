define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var Season = require('type/season');

	var SeasonService = {};

	/**
	 * Get all of the seasons for a given TV show
	 *
	 * @param {TVShow}
	 * @return {$.Deferred}
	 */
	SeasonService.fetch = function(tvshow) {
		return Xbmc.sendCommand("VideoLibrary.GetSeasons", {
			tvshowid: tvshow.getId(),
			properties: [
				"season", "art"
			]
		}).then(function(response) {
			console.log("[ SeasonService.fetch ] response:", response);

			return response.result.seasons.sort(function(a, b) {
				return (a.season - b.season);
			}).map(function(season) {
				return new Season(tvshow, season);
			});
		});
	};

	return SeasonService;
});
