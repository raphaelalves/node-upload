const fs = require('fs');
const Messages = require('../app_modules/Messages.js');
const Config = require('../config/Config.js');

var FileManagement = {};

	FileManagement.moveFileToPermanentFolder = function(tmpFolder, filename, callback) {
		console.log('From ' + tmpFolder + ' To ' + Config.UPLOAD.UPLOAD_PATH);
		fs.rename(tmpFolder, Config.UPLOAD.UPLOAD_PATH + '/' + filename, function(err) {
			if (err) {
				// Removes the uploaded file which has error
				fs.unlink(request.file.path);
				callback(false, Messages.ERROR.SERVER.INTERNAL_SERVER_ERROR);
			} else {
				callback(true);
			}
		});
	}

module.exports = FileManagement;
