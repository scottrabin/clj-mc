"use strict";

var assoc = function(obj, key, val) {
	var o = {};
	o[key] = val;
	return $.extend(o, obj);
};
var first = function(coll) {
	if ($.isPlainObject(coll) || $.isArray(coll)) {
		for (var p in coll) {
			if (coll.hasOwnProperty(p)) {
				return p;
			}
		}
		return null;
	}
	throw new Error("Invalid collection given to `first`: " + JSON.stringify(coll));
}
var indexOf = function(coll, testFn, thisObj) {
	var $this = thisObj || null;
	for (var i = 0; i < coll.length; i++) {
		if (testFn.call($this, coll[i], i, coll)) {
			return i;
		}
	}
	return -1;
};
var leftPad = function(num) {
	return (num < 10 ? '0' : '') + num;
};
var toSlug = function(str) {
	return str.toString().toLowerCase().
		replace(/[^-a-z0-9]/g, "-").
		replace(/^-+|-+$/g, "");
};
var toAssetSource = function(asset) {
	return (asset
			? "/vfs/" + encodeURI(asset)
			: null
		   );
};
var toClassName = function(o) {
	var r;
	if ($.isPlainObject(o)) {
		r = [];
		$.each(o, function(cn, pass) {
			if (pass) {
				r.push(cn);
			}
		});
	} else if ($.isArray(o)) {
		r = o;
	} else {
		r = o.toString().split(' ');
	}

	return r.join(' ');
}

var Xbmc = (function() {
	var command_id = 1;

	return {
		sendCommand: function(command, data) {
			return $.ajax({
				type: 'POST',
				url: '/jsonrpc?' + command,
				contentType: "application/json;charset=UTF-8",
				dataType: 'json',
				data: JSON.stringify({
					id: command_id++,
					method: command,
					jsonrpc: "2.0",
					params: data
				})
			});
		}
	};
})();

var Movie = {
	fetch: function() {
		return Xbmc.sendCommand("VideoLibrary.GetMovies", {
			properties: [
				"title", "genre", "year", "rating", "director", "trailer",
				"tagline", "plot", "plotoutline", "originaltitle", "lastplayed",
				"playcount", "writer", "studio", "mpaa", "cast", "country", "imdbnumber",
				"runtime", "set", "showlink", "streamdetails", "top250", "votes", "fanart",
				"thumbnail", "file", "sorttitle", "resume", "setid", "dateadded", "tag", "art"
			]
		}).then(function(response) {
			console.log("[ Movie.fetch ] response:", response);

			return response.result.movies.reduce(function(r, movie) {
				r[toSlug(movie.title)] = movie;
				return r;
			}, {});
		});
	},
	linkTo: function(movie) {
		return "#/movies/" + toSlug(movie.title);
	}
};

var Season = {
	fetch: function(tvshow) {
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
	},
	linkTo: function(tvshow, season) {
		return TVShow.linkTo(tvshow) + '/S' + leftPad(season.season);
	}
};

var Episode = {
	fetch: function(tvshow) {
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
	},
	linkTo: function(tvshow, episode) {
		return TVShow.linkTo(tvshow) + '/S' + leftPad(episode.season) + "E" + leftPad(episode.episode);
	}
};

var TVShow = {
	fetch: function() {
		return Xbmc.sendCommand("VideoLibrary.GetTVShows", {
			properties: [
				"title", "genre", "year", "rating", "plot", "studio",
				"mpaa", "cast", "playcount", "episode", "imdbnumber",
				"premiered", "votes", "lastplayed", "fanart", "thumbnail",
				"file", "originaltitle", "sorttitle", "episodeguide",
				"season", "watchedepisodes", "dateadded", "tag", "art"
			]
		}).then(function(response) {
			console.log("[ TVShow.fetch ] response:", response);

			return response.result.tvshows.reduce(function(r, tvshow) {
				r[toSlug(tvshow.title)] = tvshow;
				return r;
			}, {});
		});
	},
	linkTo: function(tvshow) {
		return "#/tv-shows/" + toSlug(tvshow.title);
	}
}

var Route = function(destination) {
	var m;

	if (m = (/\/movies\/([-a-z0-9]+)\/?/).exec(destination)) {
		return {
			active: {
				type: "movie-detail",
				item: m[1]
			}
		};
	} else if (m = (/\/movies\/?/).exec(destination)) {
		return {
			active: {
				type: "movie-index"
			}
		};
	} else if (m = (/\/tv-shows\/([-a-z0-9]+)\/S(\d{2})E(\d{2})(?:\/.*)?/).exec(destination)) {
		return {
			active: {
				type: "tvshow-episode-detail",
				item: m[1],
				season: parseInt(m[2], 10),
				episode: parseInt(m[3], 10)
			}
		};
	} else if (m = (/\/tv-shows\/([-a-z0-9]+)\/S(\d{2})\/?/).exec(destination)) {
		return {
			active: {
				type: "tvshow-episode-index",
				item: m[1],
				season: parseInt(m[2], 10)
			}
		};
	} else if (m = (/\/tv-shows\/([-a-z0-9]+)\/?/).exec(destination)) {
		return {
			active: {
				type: "tvshow-episode-index",
				item: m[1]
			}
		};
	} else if (m = (/\/tv-shows\/?/).exec(destination)) {
		return {
			active: {
				type: "tvshow-index"
			}
		};
	} else {
		return {
			active: {
				type: "remote"
			}
		};
	}
};

var RootComponent = React.createClass({
	getInitialState: function() {
		return {
			active: {
				type: "remote"
			},
			movies: {},
			tvshows: {},
			seasons: {},
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

		this.setState(Route(window.location.hash.toString().substr(1)));
	},
	fetchSeasons: function(tvshow) {
		Season.fetch(tvshow).then(function(seasons) {
			this.setState({
				seasons: assoc(this.state.seasons, toSlug(tvshow.title), seasons)
			});
		}.bind(this));
	},
	fetchEpisodes: function(tvshow) {
		Episode.fetch(tvshow).then(function(episodes) {
			this.setState({
				episodes: assoc(this.state.episodes, toSlug(tvshow.title), episodes)
			});
		}.bind(this));
	},
	render: function() {
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
						"icon-calculator": true,
						"active": (this.state.active.type === "remote")
					}),
					href: "#/remote"
				}),
				React.DOM.a({
					className: toClassName({
						"icon-tv": true,
						"active": (["tvshow-index", "tvshow-episode-index", "tvshow-episode-detail"].indexOf(this.state.active.type) > -1)
					}),
					href: "#/tv-shows"
				}),
				React.DOM.a({
					className: toClassName({
						"icon-camera": true,
						"active": (["movie-index", "movie-detail"].indexOf(this.state.active.type) > -1)
					}),
					href: "#/movies"
				})
			),
			Remote({
				active: this.state.active
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

var Remote = React.createClass({
	render: function() {
		return React.DOM.div(
			{
				id: "remote",
				className: toClassName({
					"screen": true,
					"active": (this.props.active.type === 'remote')
				})
			}
		);
	}
});

var MovieIndex = React.createClass({
	render: function() {
		return React.DOM.ul({
			id: "movie-index",
			className: toClassName({
				"screen": true,
				"active": (this.props.active.type === 'movie-index')
			})
		},
		$.map(this.props.movies, function(movie, slug) {
			return React.DOM.li(
				{
					key: slug,
					className: "movie"
				},
				React.DOM.a(
					{
						href: Movie.linkTo(movie)
					},
					React.DOM.img({src: toAssetSource(movie.art.poster)}),
					React.DOM.span(
						{className: "movie--name"},
						movie.title
					)
				)
			);
		}));
	}
});

var TVShowIndex = React.createClass({
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
			season = props.seasons[props.active.item][first(props.seasons[props.active.item])].season;
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
						href: TVShow.linkTo(tvshow)
					},
					React.DOM.img({src: toAssetSource(tvshow.art.banner)})
				)
			);
		});
	},
	renderSeason: function(season) {
		var tvshow = this.props.tvshows[this.props.active.item];

		return React.DOM.li(
			{
				key: (this.props.active.item + "--S" + leftPad(season.season, 2)),
				className: toClassName({
					"season": true,
					"active": (this.state.season === season.season)
				})
			},
			React.DOM.a(
				{
					href: Season.linkTo(tvshow, season)
				},
				React.DOM.img({src: toAssetSource(season.art.poster)}),
				React.DOM.span(
					{
						className: "season--number"
					},
					season.season
				)
			)
		);
	},
	renderEpisode: function(episode) {
		var tvshow = this.props.tvshows[this.props.active.item];

		return React.DOM.li(
			{
				key: (this.props.active.item + "--S" + leftPad(episode.season, 2) + "E" + leftPad(episode.episode, 2)),
				className: toClassName({
					"episode": true,
					"hidden": (this.state.season !== episode.season)
				})
			},
			React.DOM.a(
				{
					href: Episode.linkTo(tvshow, episode)
				},
				React.DOM.img({src: toAssetSource(episode.art.thumb)}),
				React.DOM.div(
					{
						className: "episode--metadata"
					},
					React.DOM.div({
						className: "episode--serial"
					}, "S: " + episode.season + " E: " + episode.episode),
					React.DOM.div({
						className: "episode--airdate"
					}, episode.firstaired)
				),
				React.DOM.h3({
					className: "episode--title"
				}, episode.title)
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

var NowPlaying = React.createClass({
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

var CastList = React.createClass({
	render: function() {
		return React.DOM.ul(
			{
				className: "cast"
			},
			this.props.cast.map(function(actor) {
				return React.DOM.li(
					{
						className: "actor"
					},
					React.DOM.a(
						{
							className: "actor--photo",
							href: "http://www.imdb.com/find?s=nm&q=" + encodeURIComponent(actor.name)
						},
						React.DOM.img({
							className: toClassName({
								"hidden": !actor.thumbnail
							}),
							alt: actor.name,
							src: toAssetSource(actor.thumbnail)
						})
					),
					React.DOM.a(
						{
							href: "http://www.imdb.com/find?s=nm&q=" + encodeURIComponent(actor.name)
						},
						actor.name
					),
					" as ",
					React.DOM.a(
						{
							href: "http://www.imdb.com/find?s=nm&q=" + encodeURIComponent(actor.role)
						},
						actor.role
					)
				);
			}, this)
		);
	}
});

React.renderComponent(
	RootComponent({}),
	document.body
);
