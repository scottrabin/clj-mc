define(function(require) {
	"use strict";
	var Xbmc = require('service/xbmc');
	var Time = require('util/time');

	var Player = {};
	var _timeUpdate = null;

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
		"artist",
		"albumartist",
		"genre",
		"year",
		"rating",
		"album",
		"track",
		"duration",
		"comment",
		"lyrics",
		"musicbrainztrackid",
		"musicbrainzartistid",
		"musicbrainzalbumid",
		"musicbrainzalbumartistid",
		"playcount",
		"fanart",
		"director",
		"trailer",
		"tagline",
		"plot",
		"plotoutline",
		"originaltitle",
		"lastplayed",
		"writer",
		"studio",
		"mpaa",
		"cast",
		"country",
		"imdbnumber",
		"premiered",
		"productioncode",
		"runtime",
		"set",
		"showlink",
		"streamdetails",
		"top250",
		"votes",
		"firstaired",
		"season",
		"episode",
		"showtitle",
		"thumbnail",
		"file",
		"resume",
		"artistid",
		"albumid",
		"tvshowid",
		"setid",
		"watchedepisodes",
		"disc",
		"tag",
		"art",
		"genreid",
		"displayartist",
		"albumartistid",
		"description",
		"theme",
		"mood",
		"style",
		"albumlabel",
		"sorttitle",
		"episodeguide",
		"uniqueid",
		"dateadded",
		"channel",
		"channeltype",
		"hidden",
		"locked",
		"channelnumber",
		"starttime",
		"endtime"
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
			if (player.playerid) {
				return $.when(_getProperties(player.playerid),
							  _getItem(player.playerid));
			} else {
				Player.onUpdate.fire(null, null);
			}
		}).then(function(playerProperties, activeItem) {
			if (playerProperties && activeItem) {
				Player.onUpdate.fire(playerProperties, activeItem);

				if (_timeUpdate) {
					clearTimeout(_timeUpdate);
				}
				if (playerProperties.speed !== 0) {
					var lastUpdate = Date.now();
					var updateTime = function() {
						var now = Date.now();

						playerProperties.time.add(now - lastUpdate);
						lastUpdate = now;

						Player.onUpdate.fire(playerProperties, activeItem);
						_timeUpdate = setTimeout(updateTime, Math.abs((1000 - playerProperties.time.getMilliseconds())/ playerProperties.speed));
					};
					_timeUpdate = setTimeout(updateTime, Math.abs((1000 - playerProperties.time.getMilliseconds())/ playerProperties.speed));
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
			Player._poll = setInterval(Player._doPoll, 5000);
			_doPoll();
		} else if (!enable && Player._poll) {
			clearInterval(Player._poll);
			Player._poll = null;
		}
	};

	return Player;
});
