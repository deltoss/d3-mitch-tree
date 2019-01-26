# Installation

## With Browser

Note that you don't actually need `D3` itself to start using this library. You can use this library with or without `D3`.

### Local Files

1. Clone or download this git repository, and move the contents of the `dist` folder to your project. For example, you can put it in `/scripts/d3-mitch-tree` inside your project.

2. Import the D3MitchTree files as below, changing the path depending on where you copied it into for your project
   ```html
   <script src="/scripts/d3-mitch-tree/js/d3-mitch-tree.min.js"></script>
   <link rel="stylesheet" type="text/css" href="/scripts/d3-mitch-tree/css/d3-mitch-tree.min.css">
   <link rel="stylesheet" type="text/css" href="/scripts/d3-mitch-tree/css/d3-mitch-tree-default.min.css">
   ```

### CDN

You can alternatively use CDN so you don't have to download and set up the files:
```html
<script src="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/js/d3-mitch-tree.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree-default.min.css">
```

## With NPM

D3MitchTree is available on npm. You can perform the following steps to get it set up.

1. Open up your terminal, and run the below command from your project directory:
   ```bash
   npm install d3-mitch-tree --save
   ```

2. Now you can use CommonJS, AMD, or ES6 to import the plugin. For example:
   ```JavaScript
   var mitchTree = require('d3-mitch-tree');
   ```