// Importing external modules
const http = require('http');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const mmmagic = require('mmmagic');

// Importing internal modules
const Config = require('./config/Config.js');
const Messages = require('./app_modules/Messages.js');
const helpers = require('./app_modules/helpers.js');
const FileManagement = require('./app_modules/FileManagement.js');

const app = new express();
const upload = multer({
		dest: Config.UPLOAD.TEMP_PATH,
		dest: Config.UPLOAD.TEMP_PATH,
		limits: {
			files    : 1,
			fileSize : Config.UPLOAD.FILE_MAX_SIZE
		},
		fileFilter: function(request, file, cb) {
			if (!helpers.validateMimeType(file.mimetype)) {
				cb(new Error(Messages.ERROR.UPLOAD.INVALID_MIMETYPE.message));
			} else {
				cb(null,true);
			}
		}
}).single('fileToUpload');

app.get('/', function(request, response) {
	// Return the index form page
	response.sendFile(__dirname + '/public/views/index.html');
});

app.post('/', function(request, response) {
	// Set the route default header
	const headerContentType = {
		'Content-Type' : 'application/json'
	}
	// Argument 'err' comes from the fileFilter callback
	upload(request, response, function(err) {
		/* Handling upload exceptions */
		if (err) {
			switch (err.message) {
				// Mimetype not accepted
				case Messages.ERROR.UPLOAD.INVALID_MIMETYPE.message:
					response.writeHead(Messages.ERROR.UPLOAD.INVALID_MIMETYPE.responseCode, headerContentType);
					response.write("{message: " + Messages.ERROR.UPLOAD.INVALID_MIMETYPE.message + "}");
					response.end();
					break;
				// File size exceeds the maximum limit
				case Messages.ERROR.UPLOAD.INVALID_FILESIZE.message:
					response.writeHead(Messages.ERROR.UPLOAD.INVALID_FILESIZE.responseCode, headerContentType);
					response.write("{message: " + Messages.ERROR.UPLOAD.INVALID_FILESIZE.message + "}");
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
					response.writeHead(Messages.ERROR.UPLOAD.RESOURCE_NOT_FOUND.responseCode, headerContentType);
					response.write("{message: " + Messages.ERROR.UPLOAD.RESOURCE_NOT_FOUND.message + "}");
					response.end();
				} else {
					// Detect a fake Mime Type (double checking with MMMagic)
					if (!helpers.validateMimeType(result)) {
						fs.unlink(request.file.path);
						response.writeHead(Messages.ERROR.UPLOAD.INVALID_MIMETYPE.responseCode, headerContentType);
						response.write("{message: " + Messages.ERROR.UPLOAD.INVALID_MIMETYPE.message + "}");
						response.end();
					} else {
						// File passed all validations without errors to be handled
						var extension = request.file.originalname.match(/.+(\..+)/)[1];
						var filename = filename + extension;
						// Moving file into a permanent folder
						FileManagement.moveFileToPermanentFolder(request.file.path,filename, function(success, err) {
							if (success) {
								response.writeHead(200, headerContentType);
								response.write("{message: " + Messages.SUCCESS.UPLOAD.FILE_UPLOADED.message + ", details:" + JSON.stringify(request.file) + "}");
								response.end();
							} else {
								response.writeHead(err.responseCode, headerContentType);
								response.write("{message: " + err.message + "}");
								response.end();
							}
						});
					}
				}
			});
		}
	});
});

// Ask to the service keep listening the (constant SERVICE_PORT)
app.listen(Config.SERVER.SERVICE_PORT, function() {
	console.log('Running service at ' + Config.SERVER.SERVICE_PORT + ' Port');
});
