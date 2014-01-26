define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var TVShow = require('service/tvshow');

	var leftPad = require('util/leftpad');
	var toSlug = require('util/toslug');

	var Season = {};

	/**
	 * Get all of the seasons for a given TV show
	 *
	 * @param {TVShow}
	 * @return {$.Deferred}
	 */
	Season.fetch = function(tvshow) {
		return Xbmc.sendCommand("VideoLibrary.GetSeasons", {
			tvshowid: tvshow.tvshowid,
			properties: [
				"season", "art"
			]
		}).then(function(response) {
			console.log("[ Season.fetch ] response:", response);

			return response.result.seasons.sort(function(a, b) {
				return (a.season - b.season);
			});
		});
	};

	/**
	 * Link to a given TV show's season
	 *
	 * @param {TVShow} tvshow
	 * @param {Number} season
	 * @return {String}
	 */
	Season.linkTo = function(tvshow, season) {
		return TVShow.linkTo(tvshow) + '/S' + leftPad(season.season);
	};

	return Season;
});
