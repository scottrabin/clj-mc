define(function(require) {
	"use strict";

	/**
	 * TODO documentation
	 */
	var Route = function(destination) {
		var m;

		if (m = (/\/movies\/([-a-z0-9]+)\/?/).exec(destination)) {
			return {
				active: {
					type: "movie-detail",
					item: m[1]
				}
			};
		} else if (m = (/\/movies\/?/).exec(destination)) {
			return {
				active: {
					type: "movie-index"
				}
			};
		} else if (m = (/\/tv-shows\/([-a-z0-9]+)\/S(\d{2})E(\d{2})(?:\/.*)?/).exec(destination)) {
			return {
				active: {
					type: "tvshow-episode-detail",
					item: m[1],
					season: parseInt(m[2], 10),
					episode: parseInt(m[3], 10)
				}
			};
		} else if (m = (/\/tv-shows\/([-a-z0-9]+)\/S(\d{2})\/?/).exec(destination)) {
			return {
				active: {
					type: "tvshow-episode-index",
					item: m[1],
					season: parseInt(m[2], 10)
				}
			};
		} else if (m = (/\/tv-shows\/([-a-z0-9]+)\/?/).exec(destination)) {
			return {
				active: {
					type: "tvshow-episode-index",
					item: m[1]
				}
			};
		} else if (m = (/\/tv-shows\/?/).exec(destination)) {
			return {
				active: {
					type: "tvshow-index"
				}
			};
		} else {
			return {
				active: {
					type: "remote"
				}
			};
		}
	};

	return Route;
});
