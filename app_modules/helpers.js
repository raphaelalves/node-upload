const Config = require('../config/Config.js');

var helpers = {
	// Verify if the mimetype is a valid one
	validateMimeType : function(context) {
		return (Config.UPLOAD.VALID_MIME_TYPE.indexOf(context) >= 0 ? true : false);
	}
}

module.exports = helpers;
