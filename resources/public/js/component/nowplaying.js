define(function(require) {
	"use strict";
	var React = require('React');
	var Player = require('service/player');

	var CastList = require('component/castlist');

	var indexOf = require('util/indexof');
	var leftPad = require('util/leftpad');
	var toClassName = require('util/toclassname');

	var TYPE_TVSHOW = 'tvshow';
	var TYPE_MOVIE = 'movie';

	return React.createClass({
		displayName: "NowPlaying",
		getType: function() {
			return (this.props.active.type === 'tvshow-episode-detail' ? TYPE_TVSHOW : TYPE_MOVIE);
		},
		playItem: function() {
			var item;
			if (this.getType() === TYPE_MOVIE) {
				item = this.props.movies[this.props.active.item];
			} else {
				var episodeIndex = indexOf(this.props.episodes[this.props.active.item] || [], function(episode) {
					return (episode.getSeason() === this.props.active.season &&
							episode.getEpisode() === this.props.active.episode);
				}, this);
				item = this.props.episodes[this.props.active.item][episodeIndex];
			}

			Player.play(item);
		},
		renderMovie: function() {
			var movie = this.props.movies[this.props.active.item];

			if (!movie) {
				return React.DOM.div();
			}

			return [
				React.DOM.div(
					{
						key: "movie-view",
						id: "movie-view",
						className: "movie"
					},
					React.DOM.img({
						className: "movie--poster",
						src: movie.getArt('poster'),
						onClick: this.playItem
					}),
					React.DOM.h3({
						className: "movie--title"
					}, movie.getTitle()),
					React.DOM.p({
						className: "plot"
					}, movie.getPlot())
				),
				CastList({
					key: "cast",
					cast: movie.getCast()
				})
			];
		},
		renderEpisode: function() {
			var episodeIndex = indexOf(this.props.episodes[this.props.active.item] || [], function(episode) {
				return (episode.getSeason() === this.props.active.season &&
						episode.getEpisode() === this.props.active.episode);
			}, this);

			if (episodeIndex === -1) {
				return;
			}

			var tvshow = this.props.tvshows[this.props.active.item];
			var prevEpisode = this.props.episodes[this.props.active.item][episodeIndex - 1];
			var nextEpisode = this.props.episodes[this.props.active.item][episodeIndex + 1];
			var episode = this.props.episodes[this.props.active.item][episodeIndex];

			return [
				React.DOM.a(
					{
						className: toClassName({
							"episode--previous": true,
							"hidden": !prevEpisode
						}),
						href: prevEpisode ? prevEpisode.getUrl() : null
					},
					(prevEpisode ? "S" + leftPad(prevEpisode.getSeason()) + "E" + leftPad(prevEpisode.getEpisode()) : "")
				),
				React.DOM.a(
					{
						className: toClassName({
							"episode--next": true,
							"hidden": !nextEpisode
						}),
						href: nextEpisode ? nextEpisode.getUrl() : null
					},
					(nextEpisode ? "S" + leftPad(nextEpisode.getSeason()) + "E" + leftPad(nextEpisode.getEpisode()) : "")
				),
				React.DOM.div(
					{
						id: "tvshow-episode-view"
					},
					React.DOM.img({
						src: episode.getArt('thumb'),
						onClick: this.playItem
					}),
					React.DOM.h3({
						className: "episode--title"
					}, episode.getTitle()),
					React.DOM.p({
						className: "plot"
					}, episode.getPlot())
				),
				CastList({
					cast: episode.getCast()
				})
			];
		},
		render: function() {
			return React.DOM.section(
				{
					id: "now-playing",
					className: this.getType()
				},
				(this.getType() === TYPE_TVSHOW ? this.renderEpisode() : this.renderMovie())
			);
		}
	});
});
