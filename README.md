# node-upload

*This application was developed for study purposes, so only few basic good practices were used, just to keep it simple.*

## Dependencies
All dependencies are written in the ``package.json``, so just use `` npm install ``
  * [Express] (https://www.npmjs.com/package/express)
  * [Multer] (https://www.npmjs.com/package/multer)
  * [MMMagic] (https://www.npmjs.com/package/mmmagic)

## Criterials
  * Max file size: 5 MB
  * JPG or PNG formats
  * One upload at a time

## Features
Upload of images, validating the file in 3 steps :
  * Multer (Third-party) - Checks the size of the file and the mime type
  * MMMagic (Third-party) - Read the begin of the file to really detect the file mime type (to double check if its real valid image) and stores it to the next step
  * Simple validation to accept either 'image/jpeg' or 'image/png' mime types

*If everything is right, the file stored in the temporary folder is moved to the permanent one, otherwhise its deleted.*
