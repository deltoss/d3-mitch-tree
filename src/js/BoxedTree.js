import d3 from './CustomD3';
import {TextBox as d3PlusTextBox} from 'd3plus-text';
import BaseTree from './BaseTree';
import BoxedNodeSettings from './BoxedNodeSettings';

class BoxedTree extends BaseTree{
    /** 
     * @param {object} options The options object.
     * @param {bodyDisplayTextAccessorCallBack} options.getBodyDisplayText Determines how to obtain the body text to display for a node corresponding to a data item.
     * @param {titleDisplayTextAccessorCallBack} options.getTitleDisplayText Determines how to obtain the title text to display for a node corresponding to a data item.
    */
    constructor(options) {
        super(options);
        var mergedOptions = {
            ...BaseTree.defaults,
            ...BoxedTree.defaults,
            ...options
        };

        this._getBodyDisplayText = mergedOptions.getBodyDisplayText;
        this._getTitleDisplayText = mergedOptions.getTitleDisplayText;
        this.nodeSettings = new BoxedNodeSettings(this, mergedOptions.nodeSettings);
    }

    /** @inheritdoc */
    initialize() {
        super.initialize();

        // Create the svg, and set its dimensions
        this.getSvg().classed('boxed-tree', true);
        return this;
    }

    /** @inheritdoc */
    _nodeEnter(nodeEnter, nodes) {
        var self = this;
        // Declare box dimensions
        var nodeBodyBoxWidth = self.nodeSettings.getBodyBoxWidth();
        var nodeBodyBoxHeight = self.nodeSettings.getBodyBoxHeight();
        var nodeBodyBoxPadding = self.nodeSettings.getBodyBoxPadding();

        var nodeTitleBoxWidth = self.nodeSettings.getTitleBoxWidth();
        var nodeTitleBoxHeight = self.nodeSettings.getTitleBoxHeight();
        var nodeTitleBoxPadding = self.nodeSettings.getTitleBoxPadding();

        /* Add Body Rectangle and Text for Node */
        var bodyGroups = nodeEnter.append("g")
            .classed("body-group", true);

        bodyGroups.append("rect")
            .classed("body-box", true)
            .attr("width", 0.000001)
            .attr("height", 0.000001);

        bodyGroups.each(function(data, index, arr) {
            var element = this;
            var selection = d3.select(element);
            var singledOutData = [];
            singledOutData.push(data);

            var recalculatedPaddingTop = nodeBodyBoxPadding.top;
            if (self.getTitleDisplayText.call(self, data))
            {
                recalculatedPaddingTop += nodeTitleBoxHeight / 2;
            }

            // D3Plus Textbox with resizing capability
            var d3PlusBodyTextBox = new d3PlusTextBox()
                .select(element) // Sets the D3Plus code to append to the specified DOM element.
                .data(singledOutData)
                .text((data, index, arr) => {
                    return self.getBodyDisplayText.call(self, data);
                })
                .textAnchor("middle")
                .verticalAlign("middle")
                .fontSize(13) // in pixels
                .x(nodeBodyBoxPadding.left)
                .y(recalculatedPaddingTop - nodeBodyBoxHeight / 2)
                .width(nodeBodyBoxWidth - nodeBodyBoxPadding.left - nodeBodyBoxPadding.right)
                .height(nodeBodyBoxHeight - recalculatedPaddingTop - nodeBodyBoxPadding.bottom)
                .ellipsis((text, line) => {
                    // If text was cut-off, add tooltip
                    selection.append("title")
                        .text(self.getBodyDisplayText(data));
                    return ((text.replace(/\.|,$/g, "")) + "...");
                })
                .render();
        });

        /* Add Title Rectangle and Text for Node */
        var titleGroups = nodeEnter.append("g")
            .classed("title-group", true)
            .attr("transform", "translate(" + -nodeTitleBoxWidth / 3 + ", " + (-nodeTitleBoxHeight / 2 - nodeBodyBoxHeight / 2) + ")");

        titleGroups.each(function(data, index, arr) {
            if (!self.getTitleDisplayText.call(self, data))
                return;
            var element = this;
            var selection = d3.select(element);
            var singledOutData = [];
            singledOutData.push(data);

            selection.append("rect")
                .classed("title-box", true)
                .attr("width", nodeTitleBoxWidth)
                .attr("height", nodeTitleBoxHeight);

            // D3Plus Textbox with resizing capability
            var d3PlusTitleTextBox = new d3PlusTextBox()
                .select(element) // Sets the D3Plus code to append to the DOM element.
                .data(singledOutData)
                .text((data, index, arr) => {
                    return self.getTitleDisplayText.call(self, data);
                })
                .textAnchor("middle")
                .verticalAlign("middle")
                .x(nodeTitleBoxPadding.left)
                .y(nodeTitleBoxPadding.top)
                .fontWeight(700)
                .fontMin(6)
                .fontMax(16)
                .fontResize(true) // Resizes the text to fit the content
                .width(nodeTitleBoxWidth - nodeTitleBoxPadding.left - nodeTitleBoxPadding.right)
                .height(nodeTitleBoxHeight - nodeTitleBoxPadding.top - nodeTitleBoxPadding.bottom)
                .render();
        });
        return self;
    }

    /** @inheritdoc */
    _nodeUpdate(nodeUpdate, nodeUpdateTransition, nodes) {
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

        var nodeBodyBoxWidth = this.nodeSettings.getBodyBoxWidth();
        var nodeBodyBoxHeight = this.nodeSettings.getBodyBoxHeight();

        // Update the node attributes and style
        nodeUpdate.select(".node .body-group .body-box")
            .attr("y", -(nodeBodyBoxHeight / 2))
            .attr("width", nodeBodyBoxWidth)
            .attr("height", nodeBodyBoxHeight);

        nodeUpdate.select(".d3plus-textBox")
            .style("fill-opacity", 1);
        return this;
    }

    /** @inheritdoc */
    _nodeExit(nodeExit, nodeExitTransition, nodes) {
        var nodeBodyBoxWidth = this.nodeSettings.getBodyBoxWidth();
        var nodeBodyBoxHeight = this.nodeSettings.getBodyBoxHeight();

        nodeExitTransition.attr("transform", (data, index, arr) => {
                var highestCollapsingParent = data.parent;
                while (highestCollapsingParent.parent && !highestCollapsingParent.parent.children) {
                    highestCollapsingParent = highestCollapsingParent.parent;
                }

                if (this.getOrientation().toLowerCase() === 'toptobottom')
                {
                    return "translate(" + (highestCollapsingParent.x + nodeBodyBoxWidth / 2) + "," + (highestCollapsingParent.y + nodeBodyBoxHeight) + ")";
                }
                else
                {
                    // Translating while inverting X/Y to
                    // make tree direction from left to right,
                    // instead of the typical top-to-down tree
                    return "translate(" + (highestCollapsingParent.y + nodeBodyBoxWidth) + "," + (highestCollapsingParent.x + nodeBodyBoxHeight / 2) + ")";
                }
            })
            .remove();

        // On exit animate out
        nodeExitTransition.select(".node .body-group rect")
            .attr("width", 0.000001)
            .attr("height", 0.000001);

        nodeExitTransition.select(".node .body-group .d3plus-textBox")
            .style("fill-opacity", 0.000001)
            .attr("transform", (data, index, arr) => "translate(0," + (-nodeBodyBoxHeight / 2) + ")")
            .selectAll("text")
                .style("font-size", 0)
                .attr("y", "0px")
                .attr("x", "0px");

        nodeExitTransition.select(".node .title-group")
            .attr("transform", "translate(0, " + (-nodeBodyBoxHeight / 2) + ")");

        nodeExitTransition.select(".node .title-group rect")
            .attr("width", 0.000001)
            .attr("height", 0.000001);

        nodeExitTransition.select(".node .title-group .d3plus-textBox")
            .style("fill-opacity", 0.000001)
            .attr("transform", "translate(0,0)")
            .selectAll("text")
                .style("font-size", 0)
                .attr("y", "0px")
                .attr("x", "0px");

        // On exit reduce the opacity of text labels
        nodeExitTransition.select(".d3plus-textBox")
            .style("fill-opacity", 0.000001);
        return this;
    }

    /** @inheritdoc */
    _getNodeSize() {
        if (this.getOrientation().toLowerCase() === 'toptobottom')
        {
            return [
                this.nodeSettings.getBodyBoxWidth() + this.nodeSettings.getHorizontalSpacing(),
                this.nodeSettings.getBodyBoxHeight() + this.nodeSettings.getVerticalSpacing()
            ];
        }
        else
        {
            return [
                this.nodeSettings.getBodyBoxHeight() + this.nodeSettings.getVerticalSpacing(),
                this.nodeSettings.getBodyBoxWidth() + this.nodeSettings.getHorizontalSpacing()
            ];
        }
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
            
            var sourceCoordinate = null;
            if (this.getOrientation().toLowerCase() === 'toptobottom')
            {
                var nodeBodyBoxHeight = this.nodeSettings.getBodyBoxHeight();
                sourceCoordinate = {
                    x: highestCollapsingParent.x,
                    y: highestCollapsingParent.y + nodeBodyBoxHeight
                };
            }
            else
            {
                var nodeBodyBoxWidth = this.nodeSettings.getBodyBoxWidth();
                sourceCoordinate = {
                    x: highestCollapsingParent.x,
                    y: highestCollapsingParent.y + nodeBodyBoxWidth
                };
            }

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
        // Declare box dimensions
        var nodeBodyBoxWidth = this.nodeSettings.getBodyBoxWidth();
        var nodeBodyBoxHeight = this.nodeSettings.getBodyBoxHeight();

        // We specify arrow functions that returns
        // an array specifying how to get the
        // the x/y cordinates from the object,
        // in the format of [x, y], the default
        // format for the link generator to
        // generate the path
        if (this.getOrientation().toLowerCase() === 'toptobottom')
        {
            return d3.linkVertical()
                .source((data) => [data.source.x + nodeBodyBoxWidth / 2, data.source.y - nodeBodyBoxHeight / 2])
                .target((data) => [data.target.x + nodeBodyBoxWidth / 2, data.target.y + nodeBodyBoxHeight / 2]);
        }
        else
        {
            return d3.linkHorizontal()
                // Inverts the X/Y coordinates to draw links for a
                // tree starting from left to right,
                // instead of the typical top-to-down tree
                .source((data) => [data.source.y, data.source.x])
                .target((data) => [data.target.y + nodeBodyBoxWidth, data.target.x]);
        }
    }

    /** @inheritdoc */
    validateSettings() {
        super.validateSettings();
        if (!this._getBodyDisplayText)
            throw "Need to define the getBodyDisplayText function as part of the options";
        return this;
    }

    /**
     * Sets the body display text accessor,
     * used to get the body display text
     * for the nodes.
     * 
     * @param {bodyDisplayTextAccessorCallBack} newBodyDisplayTextAccessor 
     */
    setBodyDisplayTextAccessor(newBodyDisplayTextAccessor) {
        this._getBodyDisplayText = newBodyDisplayTextAccessor;
        return this;
    }

    /**
     * Gets the body display text for a given data item.
     * 
     * @param {object} nodeDataItem The data item to get the body display text from.
     * @returns {string} The body display text to render for the node.
     */
    getBodyDisplayText(nodeDataItem) {
        // Note that data in this context refers to D3 Tree data, not the original item data
        // To Access the original item data, use the ".data" property
        return this._getBodyDisplayText(nodeDataItem.data);
    }

    /**
     * Sets the title display text accessor,
     * used to get the title display text
     * for the nodes.
     * 
     * @param {titleDisplayTextAccessorCallBack} newTitleDisplayTextAccessor 
     */
    setTitleDisplayTextAccessor(newTitleDisplayTextAccessor) {
        this._getTitleDisplayText = newTitleDisplayTextAccessor;
        return this;
    }

    /**
     * Gets the title display text for a given data item.
     * 
     * @param {object} nodeDataItem The D3 node data item to get the title display text from.
     * @returns {string} The title display text to render for the node.
     */
    getTitleDisplayText(nodeDataItem) {
        // Note that data in this context refers to D3 Tree data, not the original item data
        // To Access the original item data, use the ".data" property
        return this._getTitleDisplayText(nodeDataItem.data);
    }

    /** @inheritdoc */
    centerNode(nodeDataItem) {
        var nodeBodyBoxWidth = this.nodeSettings.getBodyBoxWidth();
        var nodeBodyBoxHeight = this.nodeSettings.getBodyBoxHeight();
        if (this.getOrientation().toLowerCase() === 'toptobottom')
        {
            nodeDataItem.x0 = nodeDataItem.x0;
            nodeDataItem.y0 = nodeDataItem.y0 + nodeBodyBoxHeight / 2;
        }
        else
        {
            nodeDataItem.y0 = nodeDataItem.y0 + nodeBodyBoxWidth / 2;
            nodeDataItem.x0 = nodeDataItem.x0;
        }
        return super.centerNode(nodeDataItem);
    }

    /**
     * Determines how to obtain the body text
     * to display for a node corresponding
     * to a data item.
     * 
     * @callback bodyDisplayTextAccessorCallBack
     * @param {object} data The data item to get the body display text from.
     * @returns {string} The body display text to render for the node.
     */

    /**
     * Determines how to obtain the title text
     * to display for a node corresponding
     * to a data item.
     * 
     * @callback titleDisplayTextAccessorCallBack
     * @param {object} data The data item to get the title display text from.
     * @returns {string} The title display text to render for the node.
     */
}

BoxedTree.defaults = {
    getBodyDisplayText: null,
    getTitleDisplayText: (dataItem) => {
        return null;
    }
}

export default BoxedTree;