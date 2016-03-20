// Importing external modules
const http = require('http');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const mmmagic = require('mmmagic');

// Importing internal modules
const config = require('./config/config.js');
const errorMap = require('./app_modules/errorsMap.js');
const helpers = require('./app_modules/helpers.js');

const app = new express();
const upload = multer({
		dest: config.upload.tmpPath,
		dest: config.upload.tmpPath,
		limits: {
			files    : 1,
			fileSize : config.upload.fileMaxSize
		},
		fileFilter: function(request, file, cb) {
			if (!helpers.validateMimeType(file.mimetype)) {
				cb(new Error(errorMap.upload.INVALID_MIMETYPE.message));
			} else {
				cb(null,true);
			}
		}
}).single('fileToUpload');

app.post('/', function(request, response) {
	// Set the route default header
	const headerContentType = {
		'Content-Type' : 'application/json'
	}
	// Argument 'err' comes from the fileFilter callback
	upload(request, response, function(err) {
		if (err) {
			switch (err.message) {
				case errorMap.upload.INVALID_MIMETYPE.message:
					response.writeHead(errorMap.upload.INVALID_MIMETYPE.responseCode, {});
					response.write("{reason: " + errorMap.upload.INVALID_MIMETYPE.message + "}");
					response.end();
					break;
				case errorMap.upload.INVALID_FILESIZE.message:
					response.writeHead(errorMap.upload.INVALID_FILESIZE.responseCode, headerContentType);
					response.write("{reason: " + errorMap.upload.INVALID_FILESIZE.message + "}");
					response.end();
					break;
			}
		} else {
			var Magic = mmmagic.Magic;
			var magic = new Magic(mmmagic.MAGIC_MIME_TYPE);
			// Double check the Mime Type to make sure its a valid one
			magic.detectFile(request.file.path, function(err, result) {
				if (err) {
					fs.unlink(request.file.path)
					response.writeHead(errorMap.upload.RESOURCE_NOT_FOUND.responseCode, headerContentType);
					response.write("{reason: " + errorMap.upload.RESOURCE_NOT_FOUND.message + "}");
					response.end();
				} else {
					// Detect a fake Mime Type
					if (!helpers.validateMimeType(result)) {
						fs.unlink(request.file.path);
						response.writeHead(errorMap.upload.INVALID_MIMETYPE.responseCode, headerContentType);
						response.write("{reason: " + errorMap.upload.INVALID_MIMETYPE.message + "}");
						response.end();
					} else {
						// File passed all validations without errors to be handled
						// TODO: Find a properly filename
						var filename = Math.random(1,100) + Date.now();
						var extension = request.file.originalname.match(/.+(\..+)/)[1];
						var outputFolder = config.upload.uploadPath + '/' + filename + extension;

						console.log('From ' + request.file.path + ' To ' + outputFolder);
						fs.rename(request.file.path, outputFolder, function(err) {
							if (err) {
								fs.unlink(request.file.path);
								response.writeHead(417, headerContentType);
								response.write("{reason: 'Internal Problem', description:" + err.message + "}");
								response.end();
							} else {
								response.writeHead(200, headerContentType);
								response.write("{reason: 'File succefully saved!', description:" + JSON.stringify(request.file) + "}");
								response.end();
							}
						});
					}
				}
			});
		}
	});
});

// Ask to the service keep listening the (SERVICE_PORT constant)
app.listen(config.server.servicePort, function() {
	console.log('Running service at ' + config.server.servicePort + ' Port');
});
