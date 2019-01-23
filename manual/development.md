# Development

## Major Dependencies
* [D3.js](https://d3js.org/) 5.0.0+
  * Used to build the main bulk of the visualisation
* [D3Plus Textbox](https://github.com/d3plus/d3plus-text) 0.9.0+
  * Truncates text to fit to a node
  * Vertical alignment of texts
  * Title tooltips on hover

Note these dependencies does not need to be imported by the user in the front end. This is only needed when building the project, or when using module loaders such as `CommonJS`, `AMD`, etc.

## Technologies Used

This package was created using:
* `webpack` as the bundler
* `npm` scripts to run common tasks (e.g. build and sass compilation), instead of gulp, grunt
* `babel` with webpack to transpile JavaScript from ES6 to ES5, so this package codebase can utilise the newest ES6 features
* `esdoc` to build the API documentations.

## Available NPM Commands
- `npm run build-docs` - Build the HTML documentations using ESDoc.
- `npm run build-dev` - Build code with development settings.
- `npm run build-prd` - Build code with production settings.
- `npm run watch` - Build code and docs with development settings anytime when a change has been detected.