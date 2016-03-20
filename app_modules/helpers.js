const config = require('../config/config.js');

var helpers = {
	// Verify if the mimetype is a valid one
	validateMimeType : function(context) {
		return (config.upload.validMimeType.indexOf(context) >= 0 ? true : false);
	}
}

module.exports = helpers;
