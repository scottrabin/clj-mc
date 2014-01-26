define(function(require) {
	"use strict";
	var React = require('React');

	var toClassName = require('util/toclassname');

	return React.createClass({
		displayName: "Remote",
		render: function() {
			return React.DOM.div(
				{
					id: "remote",
					className: toClassName({
						"screen": true,
						"active": (this.props.active.type === 'remote')
					})
				}
			);
		}
	});
});
