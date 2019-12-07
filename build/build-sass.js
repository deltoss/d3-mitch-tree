const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const sassSourceFolder = './src/sass';
const sassTargetFolder = './dist/css';
const mkdirp = require('mkdirp');

// Create the recursive directory if it doesn't exist
mkdirp.sync(sassTargetFolder);

function writeCssFiles(css, cssMap, targetFilePath) {
  fs.writeFile(targetFilePath, css.toString(), function (err) {
    if (err)
      return console.log(err);
    console.log(`Successfully written to the file of:\n  ${targetFilePath}`)
  });
  if (cssMap) {
    fs.writeFile(`${targetFilePath}.map`, cssMap.toString(), function (err) {
      if (err)
        return console.log(err);
      console.log(`Successfully written to the file of:\n  ${targetFilePath}`)
    });
  }
}

function isFile(path) {
  var stats = fs.statSync(path);
  if (stats.isFile())
    return true;
  return false;
}

// Non-Minified CSS
fs.readdir(sassSourceFolder, function (err, files) {
  if (err)
    throw err;

  files.forEach((file) => {
    var baseName = path.basename(path.basename(file, '.scss'), '.sass');
    var sourceFilePath = path.resolve(`${sassSourceFolder}/${file}`);
    var targetFilePath = path.resolve(`${sassTargetFolder}/${baseName + '.css'}`);

    if (!isFile(sourceFilePath))
      return;

    var nodeSassResult = sass.renderSync({
      file: sourceFilePath,
      outFile: targetFilePath,
      outputStyle: 'expanded',
      sourceMapContents: true,
      sourceMap: true,
    });

    writeCssFiles(nodeSassResult.css, nodeSassResult.map, targetFilePath);

    postcss([autoprefixer])
      .process(nodeSassResult.css, { 
        from: sourceFilePath,
        to: targetFilePath
      })
      .then(function(postCssResult) {
        writeCssFiles(postCssResult.css, postCssResult.map, targetFilePath);
      });
  });
});

// Minified CSS
fs.readdir(sassSourceFolder, function (err, files) {
  if (err)
    throw err;

  files.forEach((file) => {
    var baseName = path.basename(path.basename(file, '.scss'), '.sass');
    var sourceFilePath = path.resolve(`${sassSourceFolder}/${file}`);
    var targetFilePath = path.resolve(`${sassTargetFolder}/${baseName + '.min.css'}`);

    if (!isFile(sourceFilePath))
      return;

    var nodeSassResult = sass.renderSync({
      file: sourceFilePath,
      outFile: targetFilePath,
      outputStyle: 'compressed',
      sourceMapContents: true,
      sourceMap: true,
    });

    writeCssFiles(nodeSassResult.css, nodeSassResult.map, targetFilePath);

    postcss([autoprefixer])
      .process(nodeSassResult.css, { 
        from: sourceFilePath,
        to: targetFilePath
      })
      .then(function(postCssResult) {
        writeCssFiles(postCssResult.css, postCssResult.map, targetFilePath);
      });
  });
});