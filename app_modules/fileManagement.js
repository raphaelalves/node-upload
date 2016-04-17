const fs = require('fs');
const config = require('../config/config.js');

var fileManagement = {};

	fileManagement.detectFileMimeType = function() {

	}

	fileManagement.moveFileToPermanentFolder = function(tmpFolder, filename) {
		console.log('From ' + tmpFolder + ' To ' + config.upload.uploadPath);
		fs.rename(tmpFolder, config.upload.uploadPath + '/' + filename, function(err) {
			if (err) {
				console.error(err);
				// Removes the uploaded file which has error
				fs.unlink(request.file.path);
				throw(errorMap.server.INTERNAL_SERVER_ERROR);
			}
		});
	}

module.exports = fileManagement;
