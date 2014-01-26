define(function(require) {
	"use strict";
	var React = require('React');

	var Episode = require('service/episode');
	var CastList = require('component/castlist');

	var indexOf = require('util/indexof');
	var leftPad = require('util/leftpad');
	var toAssetSource = require('util/toassetsource');
	var toClassName = require('util/toclassname');

	return React.createClass({
		displayName: "NowPlaying",
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
						src: toAssetSource(movie.art.poster)
					}),
					React.DOM.h3({
						className: "movie--title"
					}, movie.title),
					React.DOM.p({
						className: "plot"
					}, movie.plot)
				),
				CastList({
					key: "cast",
					cast: movie.cast
				})
			];
		},
		renderEpisode: function() {
			var episodeIndex = indexOf(this.props.episodes[this.props.active.item] || [], function(episode) {
				return (episode.season === this.props.active.season &&
						episode.episode === this.props.active.episode);
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
						href: prevEpisode ? Episode.linkTo(tvshow, prevEpisode) : null
					},
					(prevEpisode ? "S" + leftPad(prevEpisode.season) + "E" + leftPad(prevEpisode.episode) : "")
				),
				React.DOM.a(
					{
						className: toClassName({
							"episode--next": true,
							"hidden": !nextEpisode
						}),
						href: nextEpisode ? Episode.linkTo(tvshow, nextEpisode) : null
					},
					(nextEpisode ? "S" + leftPad(nextEpisode.season) + "E" + leftPad(nextEpisode.episode) : "")
				),
				React.DOM.div(
					{
						id: "tvshow-episode-view"
					},
					React.DOM.img({src: toAssetSource(episode.thumbnail)}),
					React.DOM.h3({
						className: "episode--title"
					}, episode.title),
					React.DOM.p({
						className: "plot"
					}, episode.plot)
				),
				CastList({
					cast: episode.cast
				})
			];
		},
		render: function() {
			return React.DOM.section(
				{
					id: "now-playing",
					className: toClassName([
						(this.props.active.type === 'tvshow-episode-detail' ? 'tvshow' : 'movie')
					])
				},
				(this.props.active.type === 'tvshow-episode-detail'
				 ? this.renderEpisode()
				 : this.renderMovie())
			);
		}
	});
});
