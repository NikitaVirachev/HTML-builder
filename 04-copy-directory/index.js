const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    for (const file of files) {
      fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), () => {});
    }
  })
});
