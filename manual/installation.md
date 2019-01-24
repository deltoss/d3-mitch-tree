# Installation

## Installing with Browser

1. Clone or download this git repository, and move the contents of the `dist` folder to your project. For example, you can put it in `/scripts/d3-mitch-tree` inside your project.

2. Import the D3MitchTree files as below, changing the path depending on where you copied it into for your project
   ```html
   <script src="/scripts/d3-mitch-tree/js/d3-mitch-tree.min.js"></script>
   <link rel="stylesheet" type="text/css" href="/scripts/d3-mitch-tree/css/d3-mitch-tree.min.css">
   <link rel="stylesheet" type="text/css" href="/scripts/d3-mitch-tree/css/d3-mitch-tree-default.min.css">
   ```

## Installing with NPM

D3MitchTree is available on npm. Add the following to your `package.json` file and then run `npm install`:

```
"dependencies": {
    ...
    "d3-mitch-tree": "~1.0.0"
}
```
Or, run `npm install d3-mitch-tree --save` from your project directory.