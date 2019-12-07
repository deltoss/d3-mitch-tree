import d3 from './CustomD3';
import BaseTree from './BaseTree';
import CircleNodeSettings from './CircleNodeSettings';

class CircleTree extends BaseTree{
    /**
     * @param {object} [options] The options object.
     * @param {displayTextAccessorCallBack} [options.getDisplayText] Determines how to obtain the text to display for a node corresponding to a data item.
     */
    constructor(options) {
        super(options);
        var mergedOptions = {
            ...BaseTree.defaults,
            ...CircleTree.defaults,
            ...options
        };

        this._getDisplayText = mergedOptions.getDisplayText;
        this.nodeSettings = new CircleNodeSettings(this, mergedOptions.nodeSettings);
    }

    /** @inheritdoc */
    initialize() {
        // Create the svg, and set its dimensions
        super.initialize();
        this.getSvg().classed('circle-tree', true);
        return this;
    }

    /** @inheritdoc */
    _nodeEnter(nodeEnter, nodes) {
        // Add Circle for the nodes
        nodeEnter.append("circle")
            .attr("r", "0.5em");

        // Add labels for the nodes
        nodeEnter.append("text")
            .text((data, index, arr) => this.getDisplayText.call(this, data));
        return this;
    }

    /** @inheritdoc */
    _nodeUpdate(nodeUpdate, nodeUpdateTransition, nodes) {
        nodeUpdate.classed('middle', (data, index, arr) => {
            var isMiddleChild = false;
            if (data.parent && data.parent.children.length % 2 !== 0) {
                var siblings = data.parent.children;
                var indexOfSiblings = siblings.indexOf(data);
                if (indexOfSiblings === Math.floor(siblings.length / 2))
                    isMiddleChild = true;
            }
            return isMiddleChild;
        });

        // Transition to the proper position for the node

        // Translating while inverting X/Y to
        // make tree direction from left to right,
        // instead of the typical top-to-down tree
        if (this.getOrientation().toLowerCase() === 'toptobottom')
        {
            nodeUpdateTransition.attr("transform", (data, index, arr) => "translate(" + data.x + "," + data.y + ")");
        }
        else
        {
            nodeUpdateTransition.attr("transform", (data, index, arr) => "translate(" + data.y + "," + data.x + ")");
        }

        nodeUpdate.select("text")
            .style("fill-opacity", 1);
        return this;
    }

    /** @inheritdoc */
    _nodeExit(nodeExit, nodeExitTransition, nodes) {
        // Remove any exiting nodes
        nodeExitTransition.attr("transform", (data, index, arr) => {
            var highestCollapsingParent = data.parent;
            while (highestCollapsingParent.parent && !highestCollapsingParent.parent.children) {
                highestCollapsingParent = highestCollapsingParent.parent;
            }

            // Translating while inverting X/Y to
            // make tree direction from left to right,
            // instead of the typical top-to-down tree
            if (this.getOrientation().toLowerCase() === 'toptobottom')
            {
                return "translate(" + highestCollapsingParent.x + "," + highestCollapsingParent.y + ")";
            }
            else
            {
                return "translate(" + highestCollapsingParent.y + "," + highestCollapsingParent.x + ")";
            }
        })
        .remove();

        // On exit reduce the node circles size to 0
        nodeExitTransition.select("circle")
            .attr("r", "0.000001em");

        // On exit reduce the opacity of text labels
        nodeExitTransition.select("text")
            .style("fill-opacity", 0.000001);
        return this;
    }

    /** @inheritdoc */
    _getNodeSize() {
        return [
            this.nodeSettings.getVerticalSpacing(),
            this.nodeSettings.getHorizontalSpacing()
        ];
    }

    /** @inheritdoc */
    _linkEnter(source, linkEnter, links, linkPathGenerator)	{
        linkEnter.attr("d", (data, index, arr) => {
            var sourceCoordinate = {
                x: source.x0,
                y: source.y0
            };

            var coordinatesObject = {
                source: sourceCoordinate,
                target: sourceCoordinate
            };

            return linkPathGenerator(coordinatesObject);
        });
        return this;
    }

    /** @inheritdoc */
    _linkUpdate(source, linkUpdate, linkUpdateTransition, links, linkPathGenerator) {
        linkUpdateTransition.attr("d", (data, index, arr) => {
            var sourceCoordinate = data;
            var targetCoordinate = data.parent;

            var coordinatesObject = {
                source: sourceCoordinate,
                target: targetCoordinate
            };

            return linkPathGenerator(coordinatesObject);
        });
        return this;
    }

    /** @inheritdoc */
    _linkExit(source, linkExit, linkExitTransition, links, linkPathGenerator) {
        linkExitTransition.attr("d", (data, index, arr) => {
            var highestCollapsingParent = data.parent;
            while (highestCollapsingParent.parent && !highestCollapsingParent.parent.children) {
                highestCollapsingParent = highestCollapsingParent.parent;
            }
            var sourceCoordinate = {
                x: highestCollapsingParent.x,
                y: highestCollapsingParent.y
            };

            var targetCoordinate = {
                x: highestCollapsingParent.x,
                y: highestCollapsingParent.y
            };

            var coordinatesObject = {
                source: sourceCoordinate,
                target: targetCoordinate
            };

            return linkPathGenerator(coordinatesObject);
        });

        return this;
    }

    /** @inheritdoc */
    _getLinkPathGenerator() {
        // We specify arrow functions that returns
        // an array specifying how to get the
        // the x/y cordinates from the object,
        // in the format of [x, y], the default
        // format for the link generator to
        // generate the path
        if (this.getOrientation().toLowerCase() === 'toptobottom')
        {
            return d3.linkVertical()
                .source((data) => [data.source.x, data.source.y])
                .target((data) => [data.target.x, data.target.y]);
        }
        else
        {
            return d3.linkHorizontal()
                // Inverts the X/Y coordinates to draw links for a
                // tree starting from left to right,
                // instead of the typical top-to-down tree
                .source((data) => [data.source.y, data.source.x])
                .target((data) => [data.target.y, data.target.x]);
        }
    }

    /** @inheritdoc */
    validateSettings() {
        super.validateSettings();
        if (!this.getDisplayText)
            throw "Need to define the getDisplayText function as part of the options";
        return this;
    }

    /**
     * Sets the display text accessor,
     * used to get the display text
     * for the nodes.
     * 
     * @param {displayTextAccessorCallBack} newDisplayTextAccessor 
     */
    setDisplayTextAccessor(newDisplayTextAccessor) {
        this._getDisplayText = newDisplayTextAccessor;
        return this;
    }

    /**
     * Gets the display text for a given data item.
     * 
     * @param {object} nodeDataItem The data item to get the display text from.
     * @returns {string} The display text to render for the node.
     */
    getDisplayText(nodeDataItem) {
        // Note that data in this context refers to D3 Tree data, not the original item data
        // To Access the original item data, use the ".data" property
        return this._getDisplayText(nodeDataItem.data);
    }

    /**
     * Determines how to obtain the text
     * to display for a node corresponding
     * to a data item.
     * 
     * @callback displayTextAccessorCallBack
     * @param {object} data The data item to get the display text from.
     * @returns {string} The display text to render for the node.
     */
}

CircleTree.defaults = {
    getDisplayText: (nodeDataItem) => null
}

export default CircleTree;