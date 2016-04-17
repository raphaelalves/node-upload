// Importing external modules
const http = require('http');
const express = require('express');
const multer = require('multer');
const mmmagic = require('mmmagic');

// Importing internal modules
const config = require('./config/config.js');
const errorMap = require('./app_modules/errorsMap.js');
const helpers = require('./app_modules/helpers.js');
const fileManagement = require('./app_modules/fileManagement.js');

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

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/public/views/index.html')
});

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
					response.writeHead(errorMap.upload.INVALID_MIMETYPE.responseCode, headerContentType);
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
						var extension = request.file.originalname.match(/.+(\..+)/)[1];
						var filename = filename + extension;

						try {
							fileManagement.moveFileToPermanentFolder(request.file.path,filename);
							response.writeHead(200, headerContentType);
							response.write("{reason: 'File succefully saved!', description:" + JSON.stringify(request.file) + "}");
							response.end();
						} catch (err) {
							response.writeHead(err.responseCode, headerContentType);
							response.write("{reason: " + err.message + " description:" + serverFailureMessage + "}");
							response.end();
						}
					}
				}
			});
		}
	});
});

// Ask to the service keep listening the (constant SERVICE_PORT)
app.listen(config.server.servicePort, function() {
	console.log('Running service at ' + config.server.servicePort + ' Port');
});
