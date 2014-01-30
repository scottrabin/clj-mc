define(function(require) {
	"use strict";
	var React = require('React');
	var Player = require('service/player');
	var Menu = require('service/menu');

	var Subtitle = require('component/subtitle');

	var toClassName = require('util/toclassname');

	var SUBTITLE_OFF = {
		index: "off",
		language: "None",
		name: "None"
	};

	return React.createClass({
		displayName: "Remote",
		decreaseSpeed: function() {
			Player.decreaseSpeed(this.props.player);
		},
		increaseSpeed: function() {
			Player.increaseSpeed(this.props.player);
		},
		togglePlayPause: function() {
			Player.setSpeed(this.props.player, this.props.player.speed === 1 ? 0 : 1);
		},
		clickUpButton: function() {
			Menu.up();
		},
		clickRightButton: function() {
			Menu.right();
		},
		clickLeftButton: function() {
			Menu.left();
		},
		clickDownButton: function() {
			Menu.down();
		},
		clickSelectbutton: function() {
			Menu.select();
		},
		clickStopButton: function() {
			Player.stop(this.props.player);
		},
		clickMenuButton: function() {
			Menu.contextMenu();
		},
		clickOsdButton: function() {
			Menu.menu();
		},
		clickHomeButton: function() {
			Menu.home();
		},
		clickBackButton: function() {
			Menu.back();
		},
		render: function() {
			return React.DOM.div(
				{
					id: "remote",
					className: toClassName({
						"screen": true,
						"active": (this.props.active.type === 'remote')
					})
				},
				React.DOM.div(
					{
						className: "remote--speed"
					},
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-stop button-stop",
							onClick: this.clickStopButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-backward",
							onClick: this.decreaseSpeed
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: toClassName({
								"fa": true,
								"fa-play": this.props.player.speed !== 1,
								"fa-pause": this.props.player.speed === 1
							}),
							onClick: this.togglePlayPause
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-forward",
							onClick: this.increaseSpeed
						}
					)
				),
				React.DOM.div(
					{
						className: "remote--subtitles"
					},
					[SUBTITLE_OFF].concat(this.props.player && this.props.player.subtitles || []).map(function(s) {
						return Subtitle({
							player: this.props.player,
							subtitle: s
						});
					}, this)
				),
				React.DOM.div(
					{
						className: "remote--menus"
					},
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-caret-up button-direction direction-up",
							onClick: this.clickUpButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-caret-right button-direction direction-right",
							onClick: this.clickRightButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-caret-left button-direction direction-left",
							onClick: this.clickLeftButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-caret-down button-direction direction-down",
							onClick: this.clickDownButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "button-select",
							onClick: this.clickSelectButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-bars button-menu",
							onClick: this.clickMenuButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-dashboard button-osd",
							onClick: this.clickOsdButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-home button-home",
							onClick: this.clickHomeButton
						}
					),
					React.DOM.button(
						{
							type: "button",
							className: "fa fa-arrow-circle-left button-back",
							onClick: this.clickBackButton
						}
					)
				)
			);
		}
	});
});
