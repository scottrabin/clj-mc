define(function(require) {
	"use strict";
	var React = require('React');

	var toClassName = require('util/toclassname');

	return React.createClass({
		displayName: "PlayerStatus",
		render: function() {
			var args = [{
				id: "player-status",
				className: toClassName({
					"active": this.props.player !== null
				})
			}];
			if (this.props.player && this.props.playing) {
				args.push(
					React.DOM.span(
						{
							className: toClassName({
								"fa": true,
								"fa-play": this.props.player.speed !== 0,
								"fa-pause": this.props.player.speed === 0
							})
						}
					),
					React.DOM.div(
						{
							className: "elapsed-time"
						},
						this.props.player.time.toString(),
						" / ",
						this.props.player.totaltime.toString()
					),
					React.DOM.a(
						{
							href: this.props.playing.getUrl(),
							className: "player-status--item-name"
						},
						this.props.playing.getTitle()
					)
				);
			}
			return React.DOM.div.apply(React.DOM, args);
		}
	});
});
