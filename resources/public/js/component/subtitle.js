define(function(require) {
	"use strict";
	var React = require('React');

	var Player = require('service/player');

	var toClassName = require('util/toclassname');

	return React.createClass({
		displayName: "Subtitle",
		setSubtitle: function() {
			Player.setSubtitle(this.props.player, this.props.subtitle);
		},
		isSubtitleActive: function() {
			// if subtitles are enabled, this subtitle is active if the indices match
			if (this.props.player.subtitleenabled) {
				return this.props.player.currentsubtitle.index === this.props.subtitle.index;
			}
			// otherwise, if this is the disabler...
			return (this.props.subtitle.language === "None");
		},
		render: function() {
			if (!this.props.subtitle) {
				debugger;
			}
			return React.DOM.button(
				{
					type: "button",
					key: this.props.subtitle.index,
					className: toClassName({
						"active": this.isSubtitleActive()
					}),
					onClick: this.setSubtitle
				},
				this.props.subtitle.language
			);
		}
	});
});
