const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream( path.join(__dirname, 'project-dist', 'bundle.css') );

fs.readdir( path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      let readableStream = fs.createReadStream( path.join(__dirname, 'styles', file.name) );
      readableStream.on('data', chunk => output.write(`${chunk}\n`));
    }
  }
});