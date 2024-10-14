const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('node:path');

module.exports = async (dirPath, fileName) => {
  const relativePath = path.join(dirPath, fileName);

  const absolutePath = path.resolve(relativePath);

  if (fsSync.existsSync(absolutePath)) await fs.unlink(absolutePath);
};
