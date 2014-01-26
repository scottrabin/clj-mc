define(function(require) {
	"use strict";
	var React = require('React');
	var Movie = require('service/movie');
	var toClassName = require('util/toclassname');
	var toAssetSource = require('util/toassetsource');

	return React.createClass({
		displayName: "MovieIndex",
		render: function() {
			return React.DOM.ul(
				{
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
				})
			);
		}
	});
});
