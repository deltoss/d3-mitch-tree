# API

The package can be configured using either the `method chaining` syntax, or the `options object` syntax.

## Method Chaining

```javascript
var treePlugin = new d3.mitchTree.boxedTree()
    .setData(data)
    .setElement(document.getElementById("visualisation"))
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
var treePlugin = new d3.mitchTree.boxedTree(options).initialize();
```

## Additional Information

For more information on the available `options` and/or `methods`:
* Clone/download the repo and run the HTML files inside the `examples` folder.
* Refer to the API documentations, particularly the constructors.