var Config = {};

Config.SERVER = {
	// Running Port
	SERVICE_PORT : 3000,
}

Config.UPLOAD = {
	// Temporary Upload Folder
	TEMP_PATH : 'public/storage/tmp',
	// Upload Folder
	UPLOAD_PATH : 'public/storage/user_images',
	// Max File Size To Be Uploaded
	FILE_MAX_SIZE : 5 * Math.pow(1024,2),
	// Allowed Mime Type
	VALID_MIME_TYPE : ['image/jpeg','image/png']
}

module.exports = Config;
