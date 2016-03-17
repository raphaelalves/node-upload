// Configuration Section
// Running Port
const SERVICE_PORT = 3000;
// Temporary Upload Folder
const TMP_UPLOAD_PATH = 'tmp';
// Upload Folder
const UPLOAD_PATH = 'myUploads';
// Max File Size To Be Uploaded
const UPLOADED_FILE_MAX_SIZE = 5000000;
// const UPLOADED_FILE_MAX_SIZE = 2;

// HANDLING FILES ERRORS
const ERROR_HANDLERS = {
	"INVALID_MIMETYPE"   : "File mime type not supported",
	"INVALID_FILESIZE"   : "File too large", // Can't change this string, shortcut to point to the err.code "LIMIT_FILE_SIZE" using the err.message instead
	"RESOURCE_NOT_FOUND" : "The resource you requested ended unexpectedly"
}

// Importing external modules
const http = require('http');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const mmmagic = require('mmmagic');

const app = new express();
const upload = multer({
		dest: TMP_UPLOAD_PATH,
		limits: {
			fileSize : UPLOADED_FILE_MAX_SIZE
		},
		fileFilter: function(request,file,cb) {
			// TODO: Check for files too big > 5mb
			// Check if the uploaded file size doesn't exceed ~5mb (UPLOADED_FILE_MAX_SIZE constant)
			if (!verifyExtensionRule(file.mimetype)) {
				cb(new Error(ERROR_HANDLERS.INVALID_MIMETYPE));
			} else {
				cb(null,true);
			}
		}
}).single('fileToUpload');

function verifyExtensionRule (subject) {
	return subject.match(/^image\/(jpeg|png)$/);
}

app.post('/', function(request, response) {

	// Argument 'err' comes from the fileFilter callback
	upload(request,response, function(err) {
		if (err) {
			switch (err.message) {
				case ERROR_HANDLERS.INVALID_MIMETYPE:
					response.writeHead(415, {'Content-Type' : 'application/json'});
					response.write("{responseCode: 415, reason: " + ERROR_HANDLERS.INVALID_MIMETYPE + "}");
					response.end();
					break;
				case ERROR_HANDLERS.INVALID_FILESIZE:
					response.writeHead(413, {'Content-Type' : 'application/json'});
					response.write("{responseCode: 413, reason: " + ERROR_HANDLERS.INVALID_FILESIZE + "}");
					response.end();
					break;
				default:
					response.writeHead(412, {'Content-Type' : 'application/json'});
					response.write("{responseCode: 412, reason: " + ERROR_HANDLERS.RESOURCE_NOT_FOUND + "}");
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
					response.writeHead(412, {'Content-Type' : 'application/json'});
					response.write("{responseCode: 412, reason: " + ERROR_HANDLERS.RESOURCE_NOT_FOUND + "}");
					response.end();
				} else {
					// Detect a fake Mime Type
					if (!verifyExtensionRule(result)) {
						fs.unlink(request.file.path);
						response.write("{responseCode: 415, reason: " + ERROR_HANDLERS.INVALID_MIMETYPE + "}");
						response.end();
					} else {
						// File passed all validations without errors to be handled
						// TODO: Find a properly filename
						var filename = 'ralves-' + Date.now();
						var extension = request.file.originalname.match(/.+(\..+)/)[1];
						var outputFolder = UPLOAD_PATH + '/' + filename + extension;

						console.log('From ' + request.file.path + ' To ' + outputFolder);
						fs.rename(request.file.path, outputFolder, function(err) {
							if (err) {
								fs.unlink(request.file.path);
								response.writeHead(417, {'Content-Type' : 'application/json'});
								response.write("{responseCode: 417, reason: 'Internal Problem', description:" + err.message + "}");
								response.end();
							} else {
								response.writeHead(200, {'Content-Type' : 'application/json'});
								response.write("{responseCode: 200, reason: 'File succefully saved!', description:" + JSON.stringify(request.file) + "}");
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
app.listen(SERVICE_PORT, function() {
	console.log('Running service at ' + SERVICE_PORT + ' Port');
});