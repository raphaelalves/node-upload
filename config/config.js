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

module.exports = config;
