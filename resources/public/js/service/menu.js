define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');

	var Menu = {};

	/**
	 * Send the "up" command
	 */
	Menu.up = function() {
		Xbmc.sendCommand('Input.Up');
	};

	/**
	 * Send the "down" command
	 */
	Menu.down = function() {
		Xbmc.sendCommand('Input.Down');
	};

	/**
	 * Send the "right" command
	 */
	Menu.right = function() {
		Xbmc.sendCommand('Input.Right');
	};

	/**
	 * Send the "left" command
	 */
	Menu.left = function() {
		Xbmc.sendCommand('Input.Left');
	};

	/**
	 * Send the "select" command
	 */
	Menu.select = function() {
		Xbmc.sendCommand('Input.Select');
	};

	/**
	 * Send the "home" command
	 */
	Menu.home = function() {
		Xbmc.sendCommand('Input.Home');
	};

	/**
	 * Send the "back" command
	 */
	Menu.back = function() {
		Xbmc.sendCommand('Input.Back');
	};

	/**
	 * Send the "menu" command
	 */
	Menu.menu = function() {
		Xbmc.sendCommand('Input.ShowOSD');
	};

	/**
	 * Send the "context menu" command
	 */
	Menu.contextMenu = function() {
		Xbmc.sendCommand('Input.ContextMenu');
	};

	return Menu;
});
