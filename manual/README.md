[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![made-with-esdocs](https://img.shields.io/badge/Made%20with-ESDocs-green.svg)](https://esdoc.org/)

![MitchD3Tree Demo](manual/asset/MitchD3Tree&#32;Demo.gif)

# Introduction

A D3 plugin which lets you create a stunning interactive hierarchical tree visualisation with a flat/nested dataset. It has various features which makes it suitable for traversing large data sets.

# Features

* Zoom and Panning
* Automatically pan to the clicked node
* Hide irrelevant nodes while traversing the tree
* Supports AJAX load-on-demand
* Supports theming (via CSS)

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

## Usage

Now you can use MitchD3Tree. E.g:
```html
<section id="visualisation" style="border: 1px black solid;">
</section>
<script>
    var data = {
        "id": 1,
        "name": "Animals",
        "type": "Root",
        "description": "A living organism that feeds on organic matter",
        "children": [
            {
                "id": 2,
                "name": "Carnivores",
                "type": "Type",
                "description": "Diet consists solely of animal materials",
                "children": [
                    {
                        "id": 3,
                        "name": "Javanese Cat",
                        "type": "Organism",
                        "description": "Domestic breed of cats, of oriental origin",
                        "children": []
                    },
                    {
                        "id": 4,
                        "name": "Polar Bear",
                        "type": "Organism",
                        "description": "White bear native to the Arctic Circle",
                        "children": []
                    },
                    {
                        "id": 5,
                        "name": "Panda Bear",
                        "type": "Organism",
                        "description": "Spotted bear native to South Central China",
                        "children": []
                    }
                ]
            },
            {
                "id": 6,
                "name": "Herbivores",
                "type": "Type",
                "description": "Diet consists solely of plant matter",
                "children": [
                    {
                        "id": 7,
                        "name": "Angus Cattle",
                        "type": "Organism",
                        "description": "Scottish breed of black cattle",
                        "children": []
                    },
                    {
                        "id": 8,
                        "name": "Barb Horse",
                        "type": "Organism",
                        "description": "A breed of Northern African horses with high stamina and hardiness. Their generally hot temperament makes it harder to tame.",
                        "children": []
                    }
                ]
            }
        ]
    };
        
    var treePlugin = new MitchD3Tree.BoxedTree()
        .setData(data)
        .setContainerElement(document.getElementById("visualisation"))
        .setIdAccessor(function(data) {
            return data.id;
        })
        .setChildrenAccessor(function(data) {
            return data.children;
        })
        .setBodyDisplayTextAccessor(function(data) {
            return data.description;
        })
        .setTitleDisplayTextAccessor(function(data) {
            return data.name;
        })
        .initialize();
</script>
```

# Examples

HTML examples are included as part of the project as within the `examples` folder. Simply clone or download the repository and open up those files with your browser to see MitchD3Tree in action.

# API

The package can be configured using either the `method chaining` syntax, or the `options object` syntax.

## Method Chaining

```javascript
var treePlugin = new MitchD3Tree.BoxedTree()
    .setData(data)
    .setContainerElement(document.getElementById("visualisation"))
    .setIdAccessor(function(data) {
        return data.id;
    })
    .setChildrenAccessor(function(data) {
        return data.children;
    })
    .setBodyDisplayTextAccessor(function(data) {
        return data.description;
    })
    .setTitleDisplayTextAccessor(function(data) {
        return data.name;
    })
    .initialize();
```

## Options Object

```javascript
var options = {
    data: data,
    element: document.getElementById("visualisation"),
    getId: function (data) {
        return data.id;
    },
    getChildren: function (data) {
        return data.children;
    },
    getBodyDisplayText: function (data) {
        return data.description;
    },
    getTitleDisplayText: function (data) {
        return data.name;
    }
};
var treePlugin = new mitchD3Tree.BoxedTree(options).initialize();
```

For more information on the options object, refer to the `examples`, or the API documentations, particularly the constructors.

# License

MIT © Michael Tran