define(function(require) {
	"use strict";
	var React = require('React');
	var toClassName = require('util/toclassname');

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
							key: movie.getId(),
							className: "movie"
						},
						React.DOM.a(
							{
								href: movie.getUrl()
							},
							React.DOM.img({src: movie.getArt('poster')}),
							React.DOM.span(
								{className: "movie--name"},
								movie.getTitle()
							)
						)
					);
				})
			);
		}
	});
});
