var config = require('../config/config.js');

var helpers = {

	validateMimeType : function(context) {
		return (config.upload.validMimeType.indexOf(context) >= 0 ? true : false);
	}
}


module.exports = helpers;