# Usage

## Basic Usage with Nested Data

You'll need to create a HTML element that acts as the container for the visualisation.

```html
<section id="visualisation">
</section>
```

Construct the dataset.

```html
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
</script>
```

Use the plugin by initialising it with options and the constructed dataset.

```html
<script>
    var treePlugin = new D3MitchTree.BoxedTree()
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

## Basic Usage with Flat Data

You'll need to create a HTML element that acts as the container for the visualisation.

```html
<section id="visualisation">
</section>
```

Construct the dataset.

```html
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
</script>
```

Use the plugin by initialising it with options and the constructed dataset.

```html
<script>
    var treePlugin = new D3MitchTree.BoxedTree()
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
```

## Additional Information

For more information on the usage:
* Clone/download the repo and run the HTML files inside the `examples` folder.
* Refer to the API documentations.