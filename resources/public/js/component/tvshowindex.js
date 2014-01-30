define(function(require) {
	"use strict";
	var React = require('React');

	var TVShow = require('service/tvshow');
	var Season = require('service/season');
	var Episode = require('service/episode');

	var first = require('util/first');
	var leftPad = require('util/leftpad');
	var toClassName = require('util/toclassname');
	var toAssetSource = require('util/toassetsource');

	return React.createClass({
		displayName: "TVShowIndex",
		componentWillMount: function() {
			this.fetchEpisodeData(this.props);
			this.setActiveSeason(this.props);
		},
		componentWillReceiveProps: function(nextProps) {
			this.fetchEpisodeData(nextProps);
			this.setActiveSeason(nextProps);
		},
		fetchEpisodeData: function(props) {
			var tvshow = props.tvshows[props.active.item];
			var seasons = props.seasons[props.active.item];
			var episodes = props.episodes[props.active.item];

			if (tvshow && !seasons) {
				props.fetchSeasons(tvshow);
			}
			if (tvshow && !episodes) {
				props.fetchEpisodes(tvshow);
			}
		},
		setActiveSeason: function(props) {
			var season;
			if (props.active.hasOwnProperty('season')) {
				season = props.active.season;
			} else if (props.seasons[props.active.item]) {
				season = props.seasons[props.active.item][first(props.seasons[props.active.item])].getSeason();
			}
			this.setState({
				season: +season
			});
		},
		renderTVShowIndex: function() {
			return $.map(this.props.tvshows, function(tvshow, slug) {
				return React.DOM.li(
					{
						key: slug,
						className: "tvshow"
					},
					React.DOM.a(
						{
							href: tvshow.getUrl()
						},
						React.DOM.img({src: tvshow.getArt('banner')})
					)
				);
			});
		},
		renderSeason: function(season) {
			var tvshow = this.props.tvshows[this.props.active.item];

			return React.DOM.li(
				{
					key: season.getUrl(),
					className: toClassName({
						"season": true,
						"active": (this.state.season === season.getSeason())
					})
				},
				React.DOM.a(
					{
						href: season.getUrl()
					},
					React.DOM.img({src: season.getArt('poster')}),
					React.DOM.span(
						{
							className: "season--number"
						},
						season.getSeason()
					)
				)
			);
		},
		renderEpisode: function(episode) {
			var tvshow = this.props.tvshows[this.props.active.item];

			return React.DOM.li(
				{
					key: episode.getUrl(),
					className: toClassName({
						"episode": true,
						"hidden": (this.state.season !== episode.getSeason())
					})
				},
				React.DOM.a(
					{
						href: episode.getUrl()
					},
					React.DOM.img({src: episode.getArt('thumb')}),
					React.DOM.div(
						{
							className: "episode--metadata"
						},
						React.DOM.div({
							className: "episode--serial"
						}, "S: " + episode.getSeason() + " E: " + episode.getEpisode()),
						React.DOM.div({
							className: "episode--airdate"
						}, episode.getFirstAired())
					),
					React.DOM.h3({
						className: "episode--title"
					}, episode.getTitle())
				)
			);
		},
		renderTVShowEpisodeIndex: function() {
			var seasons = this.props.seasons[this.props.active.item] || [];
			var episodes = this.props.episodes[this.props.active.item] || [];

			return [
				React.DOM.ol(
					{
						key: (this.props.active.item + "--seasons"),
						className: "seasons"
					},
					seasons.map(this.renderSeason, this)
				),
				React.DOM.ol(
					{
						key: (this.props.active.item + "--episodes"),
						className: "episodes"
					},
					episodes.map(this.renderEpisode, this)
				)
			];
		},
		render: function() {
			return React.DOM.ul(
				{
					id: "tvshow-index",
					className: toClassName({
						"screen": true,
						"active": (['tvshow-index', 'tvshow-episode-index'].indexOf(this.props.active.type) > -1)
					})
				},
				(
					'tvshow-index' === this.props.active.type ? this.renderTVShowIndex() :
					'tvshow-episode-index' === this.props.active.type ? this.renderTVShowEpisodeIndex() :
					null
				)
			);
		}
	});
});
