define(function(require) {
	"use strict";

	/**
	 * Convert an Xbmc asset into a valid asset path
	 *
	 * @param {String?} asset
	 * @return {String|null}
	 */
	return function toAssetSource(asset) {
		return (asset
				? "/vfs/" + encodeURI(asset)
				: null
			   );
	};
});
