var errorMap = {};

errorMap.upload = {
  "INVALID_MIMETYPE" : {
    responseCode: 415,
    message: "File mime type not supported"
  },
	"INVALID_FILESIZE" : {
    responseCode: 413,
    message: "File too large"
  },
	"RESOURCE_NOT_FOUND" : {
    responseCode: 501,
    message: "The resource you requested is not supported"
  }
};

errorMap.server = {
	"INTERNAL_SERVER_ERROR" : {
			responseCode: 500,
			message: "Internal Problem"
	}
}

module.exports = errorMap;
