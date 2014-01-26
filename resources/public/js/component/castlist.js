define(function(require) {
	"use strict";
	var React = require('React');

	var toAssetSource = require('util/toassetsource');
	var toClassName = require('util/toclassname');

	return React.createClass({
		displayName: "CastList",
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
});
