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
    responseCode: 412,
    message: "The resource you requested ended unexpectedly"
  }
};

module.exports = errorMap;
