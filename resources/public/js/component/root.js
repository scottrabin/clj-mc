define(function(require) {
	"use strict";
	var React = require("React");

	var Player = require('service/player');
	var Movie = require('service/movie');
	var TVShow = require('service/tvshow');
	var Route = require('util/route');
	var Season = require('service/season');
	var Episode = require('service/episode');

	var PlayerStatus = require('component/playerstatus');
	var Remote = require('component/remote');
	var MovieIndex = require('component/movieindex');
	var TVShowIndex = require('component/tvshowindex');
	var NowPlaying = require('component/nowplaying');

	var assoc = require('util/assoc');
	var indexOf = require('util/indexof');
	var toClassName = require('util/toclassname');
	var toSlug = require('util/toslug');

	var RootComponent = React.createClass({
		getInitialState: function() {
			return {
				/**
				 * The state of the current player
				 * @type {Object}
				 */
				player: {},
				/**
				 * The currently playing item
				 * @type {Movie|Episode}
				 */
				playing: {},
				/**
				 * The currently active screen for the application
				 * @type {Object}
				 */
				active: {
					type: "remote"
				},
				/**
				 * The cached set of movies
				 * @type {Object.<string, Movie>}
				 */
				movies: {},
				/**
				 * The cached set of TV shows
				 * @type {Object.<string, TVShow>}
				 */
				tvshows: {},
				/**
				 * The cached set of seasons for all TV shows
				 * @type {Object.<string, Array<Season>>}
				 */
				seasons: {},
				/**
				 * The cached set of episodes for all TV shows
				 * @type {Object.<string, Array<Episode>>}
				 */
				episodes: {}
			};
		},
		componentWillMount: function() {
			Movie.fetch().then(function(movies) {
				this.setState({movies: movies});
			}.bind(this));

			TVShow.fetch().then(function(tvshows) {
				this.setState({tvshows: tvshows});
			}.bind(this));

			$(window).on('hashchange', function(evt) {
				var destination = window.location.hash.toString().substr(1);
				var newState = Route(destination);
				console.debug("NEW STATE:", newState);
				this.setState(newState);
			}.bind(this));

			Player.onUpdate.add(this.updatePlayer);
			Player.setPolling(true);

			this.setState(Route(window.location.hash.toString().substr(1)));
		},
		fetchSeasons: function(tvshow) {
			Season.fetch(tvshow).then(function(seasons) {
				this.setState({
					seasons: assoc(this.state.seasons, toSlug(tvshow.getTitle()), seasons)
				});
			}.bind(this));
		},
		fetchEpisodes: function(tvshow) {
			Episode.fetch(tvshow).then(function(episodes) {
				this.setState({
					episodes: assoc(this.state.episodes, toSlug(tvshow.getTitle()), episodes)
				});
			}.bind(this));
		},
		updatePlayer: function(playerState, playing) {
			this.setState({
				player: playerState,
				playing: playing
			});
		},
		getPlayingItem: function(playing) {
			switch (playing.type) {
			case 'movie':
				return this.getMovie(toSlug(playing.title));
			case 'episode':
				return this.getEpisode(
					toSlug(playing.showtitle),
					playing.season,
					playing.episode
				);
			default:
				return null;
			}
		},
		getMovie: function(slug) {
			return this.state.movies[slug];
		},
		getEpisode: function(slug, seasonNum, episodeNum) {
			if (!this.state.episodes[slug]) {
				var tvshow = this.state.tvshows[slug];
				if (tvshow) {
					this.fetchEpisodes(tvshow);
				}
				return;
			}
			var index = indexOf(this.state.episodes[slug], function(episode) {
				return (episode.getSeason() === seasonNum &&
						episode.getEpisode() === episodeNum);
			});
			return this.state.episodes[slug][index];
		},
		render: function() {
			var playing = this.getPlayingItem(this.state.playing);

			return React.DOM.div(
				{
					id: "main",
				},
				React.DOM.nav(
					{
						id: "top-navigation",
					},
					React.DOM.a({
						className: toClassName({
							"fa": true,
							// TODO - better icon for remote
							"fa-th": true,
							"active": (this.state.active.type === "remote")
						}),
						href: "#/remote"
					}),
					React.DOM.a({
						className: toClassName({
							"fa": true,
							// TODO - better icon for TV
							"fa-desktop": true,
							"active": (["tvshow-index", "tvshow-episode-index", "tvshow-episode-detail"].indexOf(this.state.active.type) > -1)
						}),
						href: "#/tv-shows"
					}),
					React.DOM.a({
						className: toClassName({
							"fa": true,
							"fa-film": true,
							"active": (["movie-index", "movie-detail"].indexOf(this.state.active.type) > -1)
						}),
						href: "#/movies"
					})
				),
				PlayerStatus({
					player: this.state.player,
					playing: playing
				}),
				Remote({
					active: this.state.active,
					player: this.state.player,
					playing: playing
				}),
				MovieIndex({
					active: this.state.active,
					movies: this.state.movies
				}),
				TVShowIndex({
					active: this.state.active,
					tvshows: this.state.tvshows,
					seasons: this.state.seasons,
					episodes: this.state.episodes,
					fetchSeasons: this.fetchSeasons,
					fetchEpisodes: this.fetchEpisodes
				}),
				NowPlaying({
					active: this.state.active,
					movies: this.state.movies,
					tvshows: this.state.tvshows,
					seasons: this.state.seasons,
					episodes: this.state.episodes
				})
			);
		}
	});

	return RootComponent;
});
