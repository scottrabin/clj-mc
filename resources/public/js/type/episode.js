define(function(require) {
	"use strict";
	var leftPad = require('util/leftpad');
	var toSlug = require('util/toslug');
	var toAssetSource = require('util/toassetsource');

	function Episode(tvshow, episode) {
		this._tvshow = tvshow;
		this._episode = episode;
	}

	/**
	 * Get the season number for this episode
	 *
	 * @return {Number}
	 */
	Episode.prototype.getSeason = function() {
		return this._episode.season;
	};

	/**
	 * Get the episode number for this episode
	 *
	 * @return {Number}
	 */
	Episode.prototype.getEpisode = function() {
		return this._episode.episode;
	};

	/**
	 * Get the title of the episode
	 *
	 * @return {String}
	 */
	Episode.prototype.getTitle = function() {
		return this._episode.title;
	};

	/**
	 * Get the plot of the episode
	 *
	 * @return {String}
	 */
	Episode.prototype.getPlot = function() {
		return this._episode.plot;
	};

	/**
	 * Get the first aired date of the episode
	 *
	 * @return {String}
	 */
	Episode.prototype.getFirstAired = function() {
		return this._episode.firstaired;
	};

	/**
	 * Generate a link to a specific episode of a TV show
	 *
	 * @return {String}
	 */
	Episode.prototype.getUrl = function() {
		return this._tvshow.getUrl() +
			'/S' + leftPad(this.getSeason()) +
			'E' + leftPad(this.getEpisode());
	};

	/**
	 * Get a link to an episode's artwork
	 *
	 * @return {String}
	 */
	Episode.prototype.getArt = function(type) {
		return toAssetSource(this._episode.art[type]);
	};

	/**
	 * Get a list of actors in the episode
	 *
	 * @return {String}
	 */
	Episode.prototype.getCast = function() {
		return this._episode.cast;
	};

	return Episode;
});
