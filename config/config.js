var config = {};

config.server = {
	// Running Port
	servicePort : 3000,
}

config.upload = {
	// Temporary Upload Folder
	tmpPath : 'public/storage/tmp',
	// Upload Folder
	uploadPath : 'public/storage/user_images',
	// Max File Size To Be Uploaded
	fileMaxSize : 500000,
	// Allowed Mime Type
	validMimeType : ['image/jpeg','image/png']
}

config.upload.errors = {
	"INVALID_MIMETYPE"   : "File mime type not supported",
	"INVALID_FILESIZE"   : "File too large", // Can't change this string, shortcut to point to the err.code "LIMIT_FILE_SIZE" using the err.message instead
	"RESOURCE_NOT_FOUND" : "The resource you requested ended unexpectedly"
}

module.exports = config;