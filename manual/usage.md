# Usage

First, you should create a basic HTML page with the D3 MitchTree plugin set up.
You also need to create the `visualisation` element which we can use to
initialise to be a tree. It could look something like the below:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title></title>
        <script src="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/js/d3-mitch-tree.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree.min.css">
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree-default.min.css">
    </head>
    <body>
        <section id="visualisation">
        </section>
        
        <script>
            // ToDo...
        </script>
    </body>
</html>
```

Now we can initialise and adjust the visualisation through different ways by adding the script in.
Notice the `ToDo` placeholder is where we'll add our additional scripts.

## Basic Usage with Nested Data

We need to add scripts to initialise the `visualisation` element to be a tree.
Let's set up our data. For getting quickly set up, we'll just use hard-coded dummy data.

```javascript
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
```

Finally, we use the plugin by initialising it with options and the constructed dataset.

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

The final code would look like this:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title></title>
        <script src="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/js/d3-mitch-tree.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree.min.css">
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree-theme-default.min.css">
    </head>
    <body>
        <section id="visualisation">
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
        </script>
    </body>
</html>
```

## Basic Usage with Flat Data

We need to add scripts to initialise the `visualisation` element to be a tree.
Let's set up our data. For getting quickly set up, we'll just use hard-coded dummy data.

```javascript
var data = [
    {
        "id": 1,
        "name": "Animals",
        "type": "Root",
        "description": "A living organism that feeds on organic matter"
    },
    {
        "id": 2,
        "parentId": 1,
        "name": "Carnivores",
        "type": "Type",
        "description": "Diet consists solely of animal materials"
    },
    {
        "id": 3,
        "parentId": 2,
        "name": "Javanese Cat",
        "type": "Organism",
        "description": "Domestic breed of cats, of oriental origin"
    },
    {
        "id": 4,
        "parentId": 2,
        "name": "Polar Bear",
        "type": "Organism",
        "description": "White bear native to the Arctic Circle"
    },
    {
        "id": 5,
        "parentId": 2,
        "name": "Panda Bear",
        "type": "Organism",
        "description": "Spotted bear native to South Central China"
    },
    {
        "id": 6,
        "parentId": 1,
        "name": "Herbivores",
        "type": "Type",
        "description": "Diet consists solely of plant matter"
    },
    {
        "id": 7,
        "parentId": 6,
        "name": "Angus Cattle",
        "type": "Organism",
        "description": "Scottish breed of black cattle"
    },
    {
        "id": 8,
        "parentId": 6,
        "name": "Barb Horse",
        "type": "Organism",
        "description": "A breed of Northern African horses with high stamina and hardiness. Their generally hot temperament makes it harder to tame."
    }
];
```

Use the plugin by initialising it with options and the constructed dataset.

```javascript
var treePlugin = new d3.mitchTree.boxedTree()
    .setIsFlatData(true)
    .setData(data)
    .setElement(document.getElementById("visualisation"))
    .setIdAccessor(function(data) {
        return data.id;
    })
    .setParentIdAccessor(function(data) {
        return data.parentId;
    })
    .setBodyDisplayTextAccessor(function(data) {
        return data.description;
    })
    .setTitleDisplayTextAccessor(function(data) {
        return data.name;
    })
    .initialize();
```

The final code would look like this:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title></title>
        <script src="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/js/d3-mitch-tree.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree.min.css">
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/deltoss/d3-mitch-tree@1.0.2/dist/css/d3-mitch-tree-theme-default.min.css">
    </head>
    <body>
        <section id="visualisation">
        </section>
        
        <script>
            var data = [
                {
                    "id": 1,
                    "name": "Animals",
                    "type": "Root",
                    "description": "A living organism that feeds on organic matter"
                },
                {
                    "id": 2,
                    "parentId": 1,
                    "name": "Carnivores",
                    "type": "Type",
                    "description": "Diet consists solely of animal materials"
                },
                {
                    "id": 3,
                    "parentId": 2,
                    "name": "Javanese Cat",
                    "type": "Organism",
                    "description": "Domestic breed of cats, of oriental origin"
                },
                {
                    "id": 4,
                    "parentId": 2,
                    "name": "Polar Bear",
                    "type": "Organism",
                    "description": "White bear native to the Arctic Circle"
                },
                {
                    "id": 5,
                    "parentId": 2,
                    "name": "Panda Bear",
                    "type": "Organism",
                    "description": "Spotted bear native to South Central China"
                },
                {
                    "id": 6,
                    "parentId": 1,
                    "name": "Herbivores",
                    "type": "Type",
                    "description": "Diet consists solely of plant matter"
                },
                {
                    "id": 7,
                    "parentId": 6,
                    "name": "Angus Cattle",
                    "type": "Organism",
                    "description": "Scottish breed of black cattle"
                },
                {
                    "id": 8,
                    "parentId": 6,
                    "name": "Barb Horse",
                    "type": "Organism",
                    "description": "A breed of Northern African horses with high stamina and hardiness. Their generally hot temperament makes it harder to tame."
                }
            ];

            var treePlugin = new d3.mitchTree.boxedTree()
                .setIsFlatData(true)
                .setData(data)
                .setElement(document.getElementById("visualisation"))
                .setIdAccessor(function(data) {
                    return data.id;
                })
                .setParentIdAccessor(function(data) {
                    return data.parentId;
                })
                .setBodyDisplayTextAccessor(function(data) {
                    return data.description;
                })
                .setTitleDisplayTextAccessor(function(data) {
                    return data.name;
                })
                .initialize();
        </script>
    </body>
</html>
```

## Additional Information

For more information on the usage:
* Open up and view the example HTML files inside the repo's [examples folder](https://github.com/deltoss/d3-mitch-tree/tree/master/examples).
* Clone/download the repo and run the HTML files inside the `examples` folder.
* Refer to the API documentations.