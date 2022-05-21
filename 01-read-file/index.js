const fs = require('fs');
const path = require('path');
const { stdout } = process;

const readableStream = fs.createReadStream( path.join(__dirname, 'text.txt') );
readableStream.on('data', chunk => stdout.write(chunk));
