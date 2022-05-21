const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir( path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  for (const file of files) {
    if (file.isFile()) { 
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        stdout.write(`${path.basename(file.name, path.extname(file.name))} - ${path.extname(file.name).slice(1)} - ${stats.size / 1024}kb\n`);
      });
    }
  }
});