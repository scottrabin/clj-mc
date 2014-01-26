define(function(require) {
	"use strict";

	var command_id = 1;
	var Xbmc = {};

	/**
	 * Send a command with the given (optional) data to the Xbmc server
	 *
	 * @param {String} command
	 * @param {Object=} data
	 * @return {$.Deferred}
	 */
	Xbmc.sendCommand = function(command, data) {
		return $.ajax({
			type: 'POST',
			url: '/jsonrpc?' + command,
			contentType: "application/json;charset=UTF-8",
			dataType: 'json',
			data: JSON.stringify({
				id: command_id++,
				method: command,
				jsonrpc: "2.0",
				params: data || {}
			})
		});
	};

	return Xbmc;
});
