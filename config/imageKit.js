const ImageKit = require('imagekit');
require('dotenv').config();

// Only initialize ImageKit if credentials are provided
let imageKit = null;

if (
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
) {
  imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
} else {
  console.warn(
    '⚠️  ImageKit credentials not found. Image uploads will not work.'
  );
}

module.exports = imageKit;

