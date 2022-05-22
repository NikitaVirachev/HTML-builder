const fs = require('fs');
const path = require('path');

const readableStreamTemplate = fs.createReadStream( path.join(__dirname, 'template.html'), 'utf-8' );
let template = '';
readableStreamTemplate.on('data', chunk => template += chunk);

let allTagNames = [];
let components = {};
readableStreamTemplate.on('end', () => {
  allTagNames = template.match(/{{.*}}/g).map(item => item = item.slice(2, -2));

  for (let i = 0; i < allTagNames.length; i++) {
    let readableStreamComponents = fs.createReadStream( path.join(__dirname, 'components', `${allTagNames[i]}.html`), 'utf-8' );

    readableStreamComponents.on('data', chunk => {
      if (!components[allTagNames[i]]) components[allTagNames[i]] = '';
      components[allTagNames[i]] += chunk;
    });

    readableStreamComponents.on('end', () => {
      for (const component in components) {
        if (template.includes(`{{${component}}}`)) {
          template = template.slice(0, template.indexOf(`{{${component}}}`)) +
            components[component] +
            template.slice(template.indexOf(`{{${component}}}`) + `{{${component}}}`.length);
        } 
      }

      fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, () => {
        const outputHTML = fs.createWriteStream( path.join(__dirname, 'project-dist', 'index.html') );
        outputHTML.write(template);
      });
    });
  }
});

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, () => {
  const outputCSS = fs.createWriteStream( path.join(__dirname, 'project-dist', 'style.css') );

  fs.readdir( path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let readableStream = fs.createReadStream( path.join(__dirname, 'styles', file.name) );
        readableStream.on('data', chunk => outputCSS.write(chunk));
      }
    }
  });
});

function copyFiles(nameDirectory) {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets', nameDirectory), {recursive: true}, () => {
    fs.readdir(path.join(__dirname, 'assets', nameDirectory), {withFileTypes: true}, (err, files) => {
      if (err) console.log(err.code);
      for (const file of files) {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, 'assets', nameDirectory, file.name), path.join(__dirname, 'project-dist', 'assets', nameDirectory, file.name), (err) => {
            if (err) console.log(err);
          });
        } else if (file.isDirectory()) {
          copyFiles(nameDirectory + file.name);
        }
      }
    });
  });
}

copyFiles('');