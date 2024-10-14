const sharp = require('sharp');

module.exports = (buffer, path) => {
  return sharp(buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path);
};
