const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, () => {
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
      fs.unlink(path.join(__dirname, 'files-copy', file), () => {});
    }
  });
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
      fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), () => {});
    }
  });
});
