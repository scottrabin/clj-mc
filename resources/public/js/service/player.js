define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var Time = require('util/time');

	var Player = {};

	/**
	 * @const {Array}
	 */
	var ACTIVE_PLAYER_PROPERTIES = [
		"type",
		"partymode",
		"speed",
		"time",
		"percentage",
		"totaltime",
		"playlistid",
		"position",
		"repeat",
		"shuffled",
		"canseek",
		"canchangespeed",
		"canmove",
		"canzoom",
		"canrotate",
		"canshuffle",
		"canrepeat",
		"currentaudiostream",
		"audiostreams",
		"subtitleenabled",
		"currentsubtitle",
		"subtitles",
		"live"
	];
	/**
	 * @const {Array}
	 */
	var ACTIVE_ITEM_PROPERTIES = [
		"title",
		//"artist",
		//"albumartist",
		//"genre",
		//"year",
		//"rating",
		//"album",
		//"track",
		//"duration",
		//"comment",
		//"lyrics",
		//"musicbrainztrackid",
		//"musicbrainzartistid",
		//"musicbrainzalbumid",
		//"musicbrainzalbumartistid",
		//"playcount",
		//"fanart",
		//"director",
		//"trailer",
		//"tagline",
		//"plot",
		//"plotoutline",
		//"originaltitle",
		//"lastplayed",
		//"writer",
		//"studio",
		//"mpaa",
		//"cast",
		//"country",
		//"imdbnumber",
		//"premiered",
		//"productioncode",
		//"runtime",
		//"set",
		//"showlink",
		//"streamdetails",
		//"top250",
		//"votes",
		//"firstaired",
		"season",
		"episode",
		"showtitle",
		//"thumbnail",
		//"file",
		//"resume",
		//"artistid",
		//"albumid",
		//"tvshowid",
		//"setid",
		//"watchedepisodes",
		//"disc",
		//"tag",
		//"art",
		//"genreid",
		//"displayartist",
		//"albumartistid",
		//"description",
		//"theme",
		//"mood",
		//"style",
		//"albumlabel",
		//"sorttitle",
		//"episodeguide",
		//"uniqueid",
		//"dateadded",
		//"channel",
		//"channeltype",
		//"hidden",
		//"locked",
		//"channelnumber",
		//"starttime",
		//"endtime"
	];

	/**
	 * Get the currently active XBMC player
	 * @private
	 *
	 * @return {$.Deferred}
	 */
	var _getActivePlayer = function() {
		return Xbmc.sendCommand("Player.GetActivePlayers").
			then(function(response) {
			return response.result && response.result[0];
		});
	};

	/**
	 * Get the properties of the current player
	 * @private
	 *
	 * @param {Number} playerId
	 * @return {$.Deferred}
	 */
	var _getProperties = function(playerId) {
		return Xbmc.sendCommand("Player.GetProperties", {
			playerid: playerId,
			properties: ACTIVE_PLAYER_PROPERTIES
		}).then(function(response) {
			response.result.time = new Time(response.result.time);
			response.result.totaltime = new Time(response.result.totaltime);
			return response.result;
		});
	};

	/**
	 * Get the currently playing item
	 * @private
	 *
	 * @param {Number} playerId
	 * @return {$.Deferred}
	 */
	var _getItem = function(playerId) {
		return Xbmc.sendCommand("Player.GetItem", {
			playerid: playerId,
			properties: ACTIVE_ITEM_PROPERTIES
		}).then(function(response) {
			return response.result && response.result.item;
		});
	};

	/**
	 * Iterative polling function to update the player properties
	 * @private
	 */
	var _doPoll = function() {
		_getActivePlayer().then(function(player) {
			if (player && player.playerid) {
				return $.when(player.playerid,
							  _getProperties(player.playerid),
							  _getItem(player.playerid));
			} else {
				Player.onUpdate.fire({}, {});
			}
		}).then(function(playerid,  playerProperties, activeItem) {
			var _timeUpdate;

			if (playerProperties && activeItem) {
				playerProperties.playerid = playerid;

				if (playerProperties.speed !== 0) {
					var lastUpdate = Date.now();
					var updateTime = function() {
						var now = Date.now();

						playerProperties.time.add(now - lastUpdate);
						lastUpdate = now;

						Player.onUpdate.fire(playerProperties, activeItem);
						_timeUpdate = setTimeout(updateTime, Math.abs((1000 - playerProperties.time.getMilliseconds())/ playerProperties.speed));
						// on next update, stop this timer
						Player.onUpdate.add(function clearTimeUpdateLoop() {
							clearTimeout(_timeUpdate);
							Player.onUpdate.remove(clearTimeUpdateLoop);
						});
					};
					updateTime();
				} else {
					Player.onUpdate.fire(playerProperties, activeItem);
				}
			}
		});
	};

	/**
	 * Callback list for updating when the Player updates
	 */
	Player.onUpdate = $.Callbacks();

	/**
	 * Set the player polling state
	 *
	 * @param {Boolean} enable
	 */
	Player.setPolling = function(enable) {
		if (enable && !Player._poll) {
			Player._poll = setInterval(_doPoll, 5000);
			_doPoll();
		} else if (!enable && Player._poll) {
			clearInterval(Player._poll);
			Player._poll = null;
		}
	};

	/**
	 * Set the speed of the player to the given value
	 *
	 * @param {Object} player
	 * @param {String|Number} speed
	 */
	Player.setSpeed = function(player, speed) {
		Xbmc.sendCommand('Player.SetSpeed', {
			playerid: player.playerid,
			speed: speed
		}).then(_doPoll);
	};

	/**
	 * Increase the speed of the current player
	 *
	 * @param {Object} player
	 */
	Player.increaseSpeed = function(player) {
		Player.setSpeed(player, 'increment');
	};

	/**
	 * Decrease the speed of the current player
	 *
	 * @param {Object} player
	 */
	Player.decreaseSpeed = function(player) {
		Player.setSpeed(player, 'decrement');
	};

	/**
	 * Play the given item
	 *
	 * @param {Movie|Episode} item
	 */
	Player.play = function(item) {
		var cmd;
		if (item.getType() === 'movie') {
			cmd = Xbmc.sendCommand('Player.Open', {
				item: {
					movieid: item.getId()
				}
			});
		} else {
			cmd = Xbmc.sendCommand('Player.Open', {
				item: {
					episodeid: item.getId()
				}
			});
		}
		cmd.then(_doPoll);
	};

	/**
	 * Stop playing the current item
	 *
	 * @param {Object} player
	 */
	Player.stop = function(player) {
		Xbmc.sendCommand('Player.Stop', {
			playerid: player.playerid
		});
	};

	/**
	 * Set the subtitle
	 *
	 * @param {Object} player
	 * @param {Object} subtitle
	 */
	Player.setSubtitle = function(player, subtitle) {
		Xbmc.sendCommand('Player.SetSubtitle', {
			playerid: player.playerid,
			enable: subtitle.index !== 'off',
			subtitle: subtitle.index
		}).then(_doPoll);
	};

	return Player;
});
