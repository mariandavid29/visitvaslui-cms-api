const fs = require('fs/promises');
const fsSync = require('fs');

module.exports = imgPath => {
  if (fsSync.existsSync(imgPath)) {
    return fs.unlink(imgPath);
  }
};
