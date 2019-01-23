# Installation

## Installing with Browser

1. Clone or download this git repository, and move the contents of the `dist` folder to your project. For example, you can put it in `/scripts/mitchd3tree` inside your project.

2. Import the MitchD3Tree files as below, changing the path depending on where you copied it into for your project
   ```html
   <script src="/scripts/mitchd3tree/js/mitchD3Tree.min.js"></script>
   <link rel="stylesheet" type="text/css" href="/scripts/mitchd3tree/css/mitchd3tree.min.css">
   <link rel="stylesheet" type="text/css" href="/scripts/mitchd3tree/css/mitchd3tree-default.min.css">
   ```

## Installing with NPM

MitchD3Tree is available on npm. Add the following to your `package.json` file and then run `npm install`:

```
"dependencies": {
    ...
    "mitchD3Tree": "~1.0.0"
}
```
Or, run `npm install mitchd3tree --save` from your project directory.