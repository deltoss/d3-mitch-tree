import d3 from './CustomD3';
import NodeSettings from './NodeSettings';
import LoadOnDemandSettings from './LoadOnDemandSettings';

/**
 * Recursively find a particular object within a hierarchical dataset.
 * 
 * @param {object} hierarchicalObject The initial hierarchical object to start the recursive find.
 * @param {function} getChildren The callback function that gets the children items of the hierarchical object.
 * @param {function} findCondition The callback function that defines whether the object matches the condition to be returned or not.
 * @returns {object|null} The first object matching the conditions.
 */
function recursiveFind(hierarchicalObject, getChildren, findCondition) {
    if (findCondition(hierarchicalObject))
        return hierarchicalObject;
    var children = getChildren(hierarchicalObject);
    var foundNode = children.find(findCondition);
    if (!foundNode)
    {
        for (var child of children) {
            foundNode = recursiveFind(child, getChildren, findCondition);
            if (foundNode)
                break;
        }
    }
    return foundNode;
}

/**
 * Recursively gets a set of objects within a hierarchical dataset.
 * 
 * @param {object} hierarchicalObject The initial hierarchical object to start the recursive get.
 * @param {function} getChildren The callback function that gets the children items of the hierarchical object.
 */
function recursiveGet(hierarchicalObject, getChildren) {
    var allItems = [];
    var children = getChildren(hierarchicalObject);
    if (children)
    {
        for (var child of children) {
            allItems.push(child);
            var descendants = recursiveGet(child, getChildren);
            if (descendants)
                allItems = [...allItems, ...descendants];
        }
    }
    return allItems;
}

class BaseTree {
    /**
     * @param {object} options The options object.
     * @param {string} [options.theme=default] The theme of the tree.
     * @param {string} [options.orientation=leftToRight] The orientation of the tree.
     * @param {boolean} [options.allowPan=true] Enables/disables the mouse drag to pan feature.
     * @param {boolean} [options.allowZoom=true] Enables/disables the mouse wheel to zoom feature.
     * @param {boolean} [options.allowFocus=true] If true, clicking on a node would focus to the node, hiding all irrelevant nodes that's not a parent, ancestor, or sibling.
     * @param {boolean} [options.allowNodeCentering=true] If true, clicking on a node would pan to the node.
     * @param {number} [options.minScale=1] Minimum zoom scaling.
     * @param {number} [options.maxScale=2] Maximum zoom scaling.
     * @param {number} [options.nodeDepthMultiplier=300] The distance between the parent and child nodes.
     * @param {boolean} [options.isFlatData=false] Indicates whether the passed data was a flat array of objects. If true, you must specify the `getParentId` option.
     * @param {getIdCallBack} options.getId
     * @param {getParentIdCallBack} [options.getParentId]
     * @param {getChildrenCallBack} [options.getChildren]
     * @param {number} [options.widthWithoutMargins=960] The width of the tree, not including the margins.
     * @param {number} [options.heightWithoutMargins=800] The height of the tree, not including the margins.
     * @param {object} [options.margins] Object specifying the margins of the tree diagram.
     * @param {number} [options.margins.top] The top margin for the tree diagram.
     * @param {number} [options.margins.right] The right margin for the tree diagram.
     * @param {number} [options.margins.bottom] The bottom margin for the tree diagram.
     * @param {number} [options.margins.left] The left margin for the tree diagram.
     * @param {number} [options.duration] Integer in milliseconds determining the duration of the animations for the tree.
     * @param {object} [options.events] Object specifying the events for the tree.
     * @param {nodeClickCallBack} [options.events.nodeClick]
     * @param {LoadOnDemandSettings} [options.loadOnDemandSettings] Object specifying the load-on-demand settings.
     * @param {NodeSettings} [options.nodeSettings] Object specifying the node settings for the tree.
     */
    constructor(options) {
        options = options || {}; // Defaults options to an empty object

        var mergedOptions = {
            ...BaseTree.defaults,
            ...options
        };

        // We define our prototype properties which would be set later
        this._root = null;
        this._svg = null;
        this._panningContainer = null,
        this._view = null;
        this._treeGenerator = null;
        this._linkPathGenerator = null;
        this._visibleNodes = null;
        this._links = null;
        this._zoomListener = null,

        // Assign/Set prototype properties, using values passed from the options object
        this.setTheme(mergedOptions.theme);
        this.setOrientation(mergedOptions.orientation);
        this.setData(mergedOptions.data);
        this.setElement(mergedOptions.element);
        this.setWidthWithoutMargins(mergedOptions.widthWithoutMargins);
        this.setHeightWithoutMargins(mergedOptions.heightWithoutMargins);
        this.setMargins(mergedOptions.margins);
        this.setDuration(mergedOptions.duration);
        this.setAllowPan(mergedOptions.allowPan);
        this.setAllowZoom(mergedOptions.allowZoom);
        this.setAllowFocus(mergedOptions.allowFocus);
        this.setAllowNodeCentering(mergedOptions.allowNodeCentering);
        this.setMinScale(mergedOptions.minScale);
        this.setMaxScale(mergedOptions.maxScale);
        this.setIsFlatData(mergedOptions.isFlatData);
        this.setNodeDepthMultiplier(mergedOptions.nodeDepthMultiplier)

        // We define our events
        if (mergedOptions.events.nodeClick)
            this.onNodeClick = mergedOptions.events.nodeClick;

        // We define our sub-prototype (AKA sub-class) properties

        this.loadOnDemandSettings = new LoadOnDemandSettings(this, mergedOptions.loadOnDemandSettings);
        this.nodeSettings = new NodeSettings(this, mergedOptions.nodeSettings);

        // We define our methods, which derives from our options
        this._getId = mergedOptions.getId;
        this._getChildren = mergedOptions.getChildren;
        this._getParentId = mergedOptions.getParentId;
    }

    /**
     * Defines how to create the nodes for newly
     * added data objects.
     *
     * @param {*} nodeEnter The D3 Enter selection of nodes.
     * @param {*} nodes
     * @returns {object} The tree object.
     */
    _nodeEnter(nodeEnter, nodes) {
        throw 'The function _nodeEnter must be implemented';
    }

    /**
     * Defines how to update the nodes for the
     * data objects.
     *
     * @param {*} nodeUpdate The D3 Update selection of nodes.
     * @param {*} nodeUpdateTransition The D3 transition object for the D3 Update selection of nodes.
     * @param {*} nodes
     * @returns {object} The tree object.
     */
    _nodeUpdate(nodeUpdate, nodeUpdateTransition, nodes) {
        throw 'The function _nodeUpdate must be implemented';
    }

    /**
     * Defines how to remove the nodes for the
     * removed data objects.
     *
     * @param {*} nodeExit The D3 Exit selection of nodes.
     * @param {*} nodeExitTransition The D3 transition object for the D3 Exit selection of nodes.
     * @param {*} nodes
     * @returns {object} The tree object.
     */
    _nodeExit(nodeExit, nodeExitTransition, nodes) {
        throw 'The function _nodeExit must be implemented';
    }

    /**
     * Gets the path generator used to render
     * the links between the nodes.
     *
     * @returns {function} The callback function that generates the SVG path coordinates for the links, given a coordinates object.
     */
    _getLinkPathGenerator() {
        throw 'The function _getLinkPathGenerator must be implemented';
    }

    /**
     * Defines how to create the links for newly
     * added data objects.
     *
     * @param {*} source The original data object that the links are being drawn for.
     * @param {*} linkEnter The D3 Enter selection of links.
     * @param {*} links
     * @param {*} linkPathGenerator
     * @returns {object} The tree object.
     */
    _linkEnter(source, linkEnter, links, linkPathGenerator) {
        throw 'The function _linkEnter must be implemented';
    }

    /**
     * Defines how to update the links for the
     * data objects.
     *
     * @param {*} source The original data object that the links are being drawn for.
     * @param {*} linkUpdate The D3 Update selection of links.
     * @param {*} linkUpdateTransition The D3 transition object for the D3 Update selection of links.
     * @param {*} links
     * @param {*} linkPathGenerator The link path generator function.
     * @returns {object} The tree object.
     */
    _linkUpdate(source, linkUpdate, linkUpdateTransition, links, linkPathGenerator) {
        throw 'The function _linkUpdate must be implemented';
    }

    /**
     * Defines how to remove the links for the
     * removed data objects.
     *
     * @param {object} source The original data object that the links are being drawn for.
     * @param {*} linkExit The D3 Exit selection of links.
     * @param {*} linkExitTransition The D3 transition object for the D3 Update selection of links.
     * @param {*} links
     * @param {*} linkPathGenerator The link path generator function.
     * @returns {object} The tree object.
     */
    _linkExit(source, linkExit, linkExitTransition, links, linkPathGenerator) {
        throw 'The function _linkExit must be implemented';
    }

    /**
     * Called when updating dimensions when
     * node settings is configured to be
     * 'nodesize'.
     * 
     * @returns {number[]} An array with two values, representing the height and width of the node respectively.
     */
    _getNodeSize() {
        throw 'The function _getNodeSize must be implemented';
    }

    /**
     * Focuses and expands all the way through to a node.
     * 
     * @param {*} idOrNodeDataItem The id of the node to focus, or the node data item object.
     * @returns {object} The tree object.
     */
    focusToNode(idOrNodeDataItem) {
        this.removeSelection(this.getRoot());
        
        var nodeDataItem = idOrNodeDataItem;
        if (typeof nodeDataItem !== 'object' && nodeDataItem !== null)
            nodeDataItem = this.getNode(nodeDataItem);
        var parentNode = null;
        
        // Expand every parent/ancestor node
        parentNode = nodeDataItem.parent;
        while(parentNode)
        {
            if (parentNode._children)
                this.expand(parentNode);
            parentNode = parentNode.parent;
        }

        if (this.getAllowFocus())
        {
            // Hide the parent/ancestor node siblings
            parentNode = nodeDataItem.parent;
            while(parentNode)
            {
                this.hideSiblings(parentNode);
                parentNode = parentNode.parent;
            }
            
            this.updateTreeWithFocusOnNode(nodeDataItem);
            nodeDataItem.selected = true;
        }

        this.update(this.getRoot());
        this.centerNode(nodeDataItem);

        return this;
    }

    /**
     * Attaches a handler to the event.
     * Note you can only attach one handler
     * to an event at this stage.
     * 
     * @param {string} event The event name.
     * @param {function} handler A callback function that executes when the event is triggerred.
     * @returns {object} The tree object.
     */
    on(event, handler) {
        if (event.indexOf("on") == 0)
            event.slice(2); // Remove the "on"
        var pascalCasedEventName = event.charAt(0).toUpperCase() + event.slice(1);
        this["on" + pascalCasedEventName] = handler;
        return this;
    }

    /**
     * Triggers all handlers associated with an event.
     * 
     * @param {string} event The event name.
     * @param {...object} [args] The arguments supplied to the event.
     * @returns {*} The returned value of the triggered handler.
     */
    emit(event, ...args) {
        if (event.indexOf("on") == 0)
            event.slice(2); // Remove the "on"
        var pascalCasedEventName = event.charAt(0).toUpperCase() + event.slice(1);
        var handler = this["on" + pascalCasedEventName];
        if (handler)
            return handler.apply(this, args);
    }

    /**
     * Returns a boolean whether the
     * tree is using flat data or not.
     * 
     * @returns {boolean} Whether the tree is using flat data or not.
     */
    getIsFlatData() {
        return this._isFlatData;
    }
    
    /**
     * Sets the is flat data flag.
     * If set to true, you must specify
     * the `getParentId` option.
     * 
     * @param {boolean} newIsFlatData Whether the tree is using flat data or not.
     */
    setIsFlatData(newIsFlatData) {
        this._isFlatData = newIsFlatData;
        return this;
    }

    /**
     * Regenerates the node data.
     * 
     * @returns {object} The tree object.
     */
    regenerateNodeData() {
        // Assigns parent, children, height, depth
        if (!this.getIsFlatData()) {
            if (!this._getChildren)
                throw "If you are providing hierarchical structured data, then you must set the getChildren accessor property.";

            // Specify your children property here,
            // so that D3's resulting root object
            // has a mapping from its "children" property
            // to your specified children property
            this._root = d3.hierarchy(this.getData(), (data) => this.getChildren.call(this, data));
        }
        else {
            if (!this._getParentId)
                throw "If you are providing flat structured data, then you must set the getParentId accessor property.";

            // stratifier is a function that would convert the flat
            // dataset into hierarchically structured data
            // to be used with D3 trees.
            // It accepts the dataset as its parameter,
            // and returns the converted data.

            // Note that this is used instead of the d3.hierarchy()
            // method as d3.hierarchy() should only be used if the
            // data is already in heirarchical structure, and
            // needs to be converted to D3 hierarchical nodes
            var stratifier = d3.stratify()
                .id((data, index, arr) => this.getId.call(this, data))
                .parentId((data, index, arr) => this.getParentId.call(this, data));
            this._root = stratifier(this.getData());
        }
        return this;
    }

    /**
     * Gets the tree theme.
     * 
     * @returns {string} The theme the tree is using.
     */
    getTheme() {
        return this._theme;
    }

    /**
     * Sets the tree theme.
     * 
     * @param {string} theme The theme to set the tree to.
     * @returns {object} The tree object.
     */
    setTheme(theme) {
        this._theme = theme;
        return this;
    }

    /**
     * Gets the tree orientation.
     * 
     * @returns {string} The orientation the tree is using.
     */
    getOrientation() {
        return this._orientation;
    }

    /**
     * Sets the tree orientation.
     * 
     * @param {string} orientation The orientation to set the tree to.
     * @returns {object} The tree object.
     */
    setOrientation(orientation) {
        this._orientation = orientation;
        return this;
    }

    /**
     * Gets the data items used to render
     * the nodes.
     * 
     * @returns {object[]} The array of data items the tree uses.
     */
    getData() {
        return this._data;
    }

    /**
     * Sets the data items the tree should
     * use to render the nodes.
     * 
     * @param {object[]} newData The new set of data items.
     * @returns {object} The tree object.
     */
    setData(newData) {
        this._data = newData;
        return this;
    }

    /**
     * Gets the node depth multiplier that
     * affects the distance between the
     * parent node and the child node.
     * 
     * @returns {number} The node depth multiplier value
     */
    getNodeDepthMultiplier() {
        return this._nodeDepthMultiplier;
    }

    /**
     * Sets the node depth multiplier value.
     * 
     * @param {number} newNodeDepthMultiplier The value that affects the distance between the parent node and the child node.
     * @returns {object} The tree object.
     */
    setNodeDepthMultiplier(newNodeDepthMultiplier) {
        this._nodeDepthMultiplier = newNodeDepthMultiplier;
        return this;
    }

    /**
     * Gets the duration of animations
     * for the tree.
     * 
     * @returns {number} The animation duration in milliseconds.
     */
    getDuration() {
        return this._duration;
    }

    /**
     * Sets the duration of animations
     * for the tree.
     * 
     * @param {*} newDuration The animation duration in milliseconds.
     * @returns {object} The tree object.
     */
    setDuration(newDuration) {
        this._duration = newDuration;
        return this;
    }

    /**
     * Gets the boolean value indicating
     * whether the drag-to-pan pan feature
     * is enabled or not.
     * 
     * @returns {boolean} Whether panning is enabled or not.
     */
    getAllowPan() {
        return this._allowPan;
    }

    /**
     * Sets the boolean value indicating
     * whether the drag-to-pan pan feature
     * is enabled or not.
     * 
     * @param {*} newAllowPan Whether panning is enabled or not.
     * @returns {object} The tree object.
     */
    setAllowPan(newAllowPan) {
        this._allowPan = newAllowPan;
        return this;
    }

    /**
     * Gets the boolean value indicating
     * whether the mouse wheel to zoom in/out
     * feature is enabled or not.
     * 
     * @returns {boolean} Whether zooming is enabled or not.
     */
    getAllowZoom() {
        return this._allowZoom;
    }

    /**
     * Sets the boolean value indicating
     * whether the mouse wheel to zoom in/out
     * feature is enabled or not.
     * 
     * @param {boolean} newAllowZoom Whether zooming is enabled or not.
     * @returns {object} The tree object.
     */
    setAllowZoom(newAllowZoom) {
        this._allowZoom = newAllowZoom;
        return this;
    }

    /**
     * Gets the boolean value indicating
     * whether to focus to the clicked node
     * or not. Focusing on a node would hide
     * all irrelevant nodes that's not a 
     * parent, sibling or ancestor of the
     * clicked node.
     * 
     * @returns {boolean} Whether to focus to the clicked node.
     */
    getAllowFocus() {
        return this._allowFocus;
    }

    /**
     * Sets the boolean value indicating
     * whether to pan to the clicked node
     * feature is enabled or not.
     * 
     * @param {boolean} newAllowFocus Whether to pan to the clicked node.
     * @returns {object} The tree object.
     */
    setAllowFocus(newAllowFocus) {
        this._allowFocus = newAllowFocus;
        return this;
    }

    /**
     * Gets the boolean value indicating
     * whether to pan to a clicked node.
     * 
     * @returns {boolean} Whether to pan to the clicked node.
     */
    getAllowNodeCentering() {
        return this._allowNodeCentering;
    }

    /**
     * Whether to pan to a clicked node.
     * 
     * @param {boolean} newAllowNodeCentering Whether to pan to the clicked node.
     * @returns {object} The tree object.
     */
    setAllowNodeCentering(newAllowNodeCentering) {
        this._allowNodeCentering = newAllowNodeCentering;
        return this;
    }

    /**
     * Gets the minimum zoom scaling.
     * 
     * @returns {number} The minimum zoom scale value.
     */
    getMinScale() {
        return this._minScale;
    }

    /**
     * Sets the minimum zoom scaling.
     * 
     * @param {*} newMinScale The minimum zoom scale value.
     * @returns {object} The tree object.
     */
    setMinScale(newMinScale) {
        this._minScale = newMinScale;
        return this;
    }

    /**
     * Gets the maximum zoom scaling.
     * 
     * @returns {number} Maximum zoom scale value.
     */
    getMaxScale() {
        return this._maxScale;
    }

    /**
     * Sets the maximum zoom scaling.
     * 
     * @param {*} newMaxScale The maximum zoom scale value.
     * @returns {object} The tree object.
     */
    setMaxScale(newMaxScale) {
        this._maxScale = newMaxScale;
        return this;
    }

    /**
     * Gets the load on demand settings object.
     * 
     * @returns {LoadOnDemandSettings} The load on demand settings.
     */
    getLoadOnDemandSettings() {
        return this.loadOnDemandSettings;
    }

    /**
     * Gets the node settings object.
     * 
     * @returns {NodeSettings} The node settings.
     */
    getNodeSettings() {
        return this.nodeSettings;
    }

    /**
     * Gets the container DOM element.
     * 
     * @returns {object} The container DOM element.
     */
    getElement() {
        return this._element;
    }

    /**
     * Sets the container DOM element
     * 
     * @param {object} newElement The container DOM element.
     * @returns {object} The tree object.
     */
    setElement(newElement) {
        this._element = newElement;
        return this;
    }

    /**
     * Gets the root node object.
     * 
     * @return {object} The root D3 tree node object.
     */
    getRoot() {
        return this._root;
    }

    /**
     * Gets the D3 selection object for the SVG element.
     * 
     * @return {object} Returns the D3 selection object.
     */
    getSvg() {
        return this._svg;
    }

    /**
     * Gets the D3 selection object for the view element.
     * 
     * @returns {object} D3 selection object for the view element.
     */
    getView() {
        return this._view;
    }

    /**
     * Gets the D3 selection object for the
     * panning container element.
     * 
     * @returns {object} D3 selection object for the panning container element.
     */
    getPanningContainer() {
        return this._panningContainer;
    }

    /**
     * Gets the D3 generator object used to
     * generate the tree nodes coordinates.
     * 
     * @returns {function} D3 tree generator object.
     */
    getTreeGenerator() {
        return this._treeGenerator;
    }

    /**
     * Get a single node given an id or a data item.
     * 
     * @param {*|object} idOrDataItem The ID or data item to retrieve the D3 tree node data item with.
     * @returns {object} D3 tree node data item.
     */
    getNode(idOrDataItem) {
        var id = idOrDataItem;
        if (typeof id === 'object' && id !== null)
            id = this.getId(id);        
        var rootNode = this.getRoot();

        var getNodeChildren = (node) => {
            if (node._children)
                return node._children;
            return [];
        }
        var node = recursiveFind(rootNode, getNodeChildren, x => this.getId(x.data) == id);
        return node;
    }

    /**
     * Get a single data item given an id.
     * 
     * @param {*} id The ID to retrieve the data item with.
     * @returns {object} The data item with the given ID.
     */
    getDataItem(id) {
        var node = this.getNode(id);
        return node.data;
    }

    /**
     * Get the array of D3 node data items
     * the D3 tree has generated.
     * 
     * @returns {object[]} Array of D3 node data items.
     */
    getNodes() {
        return this._nodes;
    }

    /**
     * Get the array of visible D3 node
     * data items the D3 tree has generated.
     * 
     * @returns {object[]} Array of D3 node data items.
     */
    getVisibleNodes() {
        return this._visibleNodes;
    }

    /**
     * Get the array of D3 link data items
     * the D3 tree has generated.
     * 
     * @returns {object[]} Array of D3 link data items.
     */
    getLinks() {
        return this._links;
    }

    /**
     * Gets the D3 zoom listener used for
     * the panning, zooming and focus features.
     * 
     * @returns {function} The D3 zoom listener
     */
    getZoomListener() {
        return this._zoomListener;
    }

    /**
     * Gets the ID for a given data item.
     * 
     * @param {object} dataItem The data item to get the ID from.
     * @returns {*} The ID for the given data item.
     */
    getId(dataItem) {
        return this._getId(dataItem);
    }

    /**
     * Gets the children data items for a given data item.
     * 
     * @param {object} dataItem The data item to get the children data items from.
     * @returns {object[]} The array of child data items.
     */
    getChildren(dataItem) {
        return this._getChildren(dataItem);
    }

    /**
     * Gets the parent ID for a given data item.
     * 
     * @param {object} dataItem The data item to get the parent ID from.
     * @returns {*} The parent ID for the given data item.
     */
    getParentId(dataItem) {
        return this._getParentId(dataItem);
    }

    /**
     * Sets the ID accessor callback function,
     * defining how to get a unique ID from a
     * given data item.
     * 
     * @param {getIdCallBack} newIdAccessor Callback function to get the ID for a given data item.
     * @returns {object} The tree object.
     */
    setIdAccessor(newIdAccessor) {
        this._getId = newIdAccessor;
        return this;
    }

    /**
     * Sets the children accessor callback function,
     * defining how to get the children data items
     * from a given data item.
     * 
     * @param {getChildrenCallBack} newChildrenAccessor Callback function to get the children for a given data item.
     * @returns {object} The tree object.
     */
    setChildrenAccessor(newChildrenAccessor) {
        this._getChildren = newChildrenAccessor;
        return this;
    }

    /**
     * Sets the parent ID accessor callback function,
     * defining how to get the parent ID from a
     * given data item.
     * 
     * @param {getParentIdCallBack} newParentIdAccessor Callback function to get the parent id for a given data item.
     * @returns {object} The tree object.
     */
    setParentIdAccessor(newParentIdAccessor) {
        this._getParentId = newParentIdAccessor;
        return this;
    }

    /**
     * Gets the width of SVG, including the margins.
     * 
     * @returns {number} The width of the SVG.
     */
    getWidth() {
        return this.getWidthWithoutMargins() - this.getMargins().left - this.getMargins().right;
    }

    /**
     * Gets the height of SVG, including the margins.
     * 
     * @returns {number} The height of the SVG.
     */
    getHeight() {
        return this.getHeightWithoutMargins() - this.getMargins().top - this.getMargins().bottom;
    }

    /**
     * Sets the margins for the tree diagram.
     * 
     * @param {object} newMargins The margin object.
     * @param {number} newMargins.top The margin top for the tree diagram.
     * @param {number} newMargins.right The margin right for the tree diagram.
     * @param {number} newMargins.bottom The margin bottom for the tree diagram.
     * @param {number} newMargins.left The margin left for the tree diagram.
     * @returns {object} The tree object.
     */
    setMargins(newMargins) {
        this._margins = newMargins;
        return this;
    }

    /**
     * Gets the margins for the tree diagram.
     * 
     * @returns {object} The margins object.
     */
    getMargins() {
        return this._margins;
    }

    /**
     * Sets the width of the SVG for the tree diagram.
     * 
     * @param {*} newWidthWithoutMargin The width of SVG for the tree diagram.
     * @returns {object} The tree object.
     */
    setWidthWithoutMargins(newWidthWithoutMargin) {
        this._widthWithoutMargin = newWidthWithoutMargin;
        return this;
    }

    /**
     * Gets the width of the SVG for the tree diagram.
     * Does not include the margins.
     * 
     * @returns {number} The width (not including the margins) of the SVG for the tree diagram.
     */
    getWidthWithoutMargins() {
        return this._widthWithoutMargin;
    }

    /**
     * Sets the height of the SVG for the tree diagram.
     * 
     * @param {*} newHeightWithoutMargin The height of SVG for the tree diagram.
     * @returns {object} The tree object.
     */
    setHeightWithoutMargins(newHeightWithoutMargin) {
        this._heightWithoutMargin = newHeightWithoutMargin;
        return this;
    }

    /**
     * Gets the height of the SVG for the tree diagram.
     * Does not include the margins.
     * 
     * @returns {number} The height (not including the margins) of the SVG for the tree diagram.
     */
    getHeightWithoutMargins() {
        return this._heightWithoutMargin;
    }

    /**
     * Updates the dimensions of the SVG.
     * 
     * @returns {object} The tree object.
     */
    updateDimensions() {
        // Update SVG with new width and height
        this.getSvg()
            // Use viewBox to set SVG width and height
            // so it is responsive, and can be resized
            // based on the parent element
            .attr("viewBox", "0 0 " + this.getWidthWithoutMargins() + " " + this.getHeightWithoutMargins());

        var margins = this.getMargins();

        var needToCenterView = false;
        // update the tree generator with the new width and height
        var sizingMode = this.nodeSettings.getSizingMode();
        if (typeof sizingMode === 'string')
            sizingMode = sizingMode.trim().toLowerCase();
        if (sizingMode === "nodesize") {
            this.getTreeGenerator()
                .nodeSize(this._getNodeSize());

            // Only perform centering if node centering is turned off,
            // as that would center to the root node anyway. Node
            // centering is turned on when allow focus is turned on.
            if (this.getAllowFocus() === false)
                needToCenterView = true;
        }
        else {
            this.getTreeGenerator()
                .size([this.getHeight(), this.getWidth()]);
        }

        // If we need to center the tree by adjusting the view and the node position
        if (this.getOrientation().toLowerCase() === 'toptobottom')
        {
            if (needToCenterView === false) {
                // Update the view with the new margins
                this.getView()
                    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");
                this.getRoot().y0 = this.getHeight() / 2;
            }
            else {
                // Move the view downwards as to center the root node
                // This is due to when you use node-size, it sets the
                // node origin at 0, 0 instead of automatically
                // centering it as it does with size()
                this.getView()
                    .attr("transform", "translate(" + margins.left + ", " + (this.getHeight() / 2 + margins.top) + ")");
                this.getRoot().y0 = 0;
            }
            this.getRoot().x0 = 0;
        }
        else
        {
            if (needToCenterView === false) {
                // Update the view with the new margins
                this.getView()
                    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");
                this.getRoot().x0 = this.getHeight() / 2;
            }
            else {
                // Move the view downwards as to center the root node
                // This is due to when you use node-size, it sets the
                // node origin at 0, 0 instead of automatically
                // centering it as it does with size()
                this.getView()
                    .attr("transform", "translate(" + margins.left + ", " + (this.getHeight() / 2 + margins.top) + ")");
                    this.getRoot().x0 = 0;
            }
            this.getRoot().y0 = 0;
        }

        if (this.getZoomListener()) {
            this.getZoomListener()
                .extent([[0, 0], [this.getWidthWithoutMargins(), this.getHeightWithoutMargins()]]);
        }
        
        return this;
    }

    /**
     * Validates the settings to ensure the
     * tree diagram is ready to be generated.
     * 
     * @returns {object} The tree object.
     */
    validateSettings() {
        // Check to make sure compulsory options are provided
        if (!this.getElement())
            throw "Need to pass in an element as part of the options";
        if (!this.getData())
            throw "Need to pass in data as part of the options";

        // Checks if mandatory methods to specify exists
        if (!this._getId)
            throw "Need to define the getId function as part of the options";
        this.loadOnDemandSettings.validateSettings();
        return this;
    }

    /**
     * Creates and set up the the tree diagram.
     * 
     * @returns {object} The tree object.
     */
    initialize() {
        this.validateSettings();
        this.regenerateNodeData();

        while (this.getElement().firstChild) {
            this.getElement().removeChild(this.getElement().firstChild);
        };

        // Create the svg, and set its dimensions
        this._svg = d3.select(this.getElement())
            .append("svg")
                .classed('mitch-d3-tree', true)
                .classed(this.getTheme(), true)
                .attr("preserveAspectRatio", "xMidYMid meet")
                .style("width", "100%")
                .style("height", "100%");

        // Create the view with margins
        this._view = this.getSvg().append("g")
            .classed("view", true);

        // Create tree generator to position the nodes
        this._treeGenerator = d3.tree();

        // Create the panning container which panning should act upon
        this._panningContainer = this.getView().append("g")
            .classed("panningContainer", true);

        this._zoomListener = d3.zoom()
            // Limit zoom level
            .scaleExtent([this.getMinScale(), this.getMaxScale()])
            // Zoom in D3 translates to the native HTML/JS events of:
            // - Double Clicking (i.e. to zoom in)
            // - Dragging (i.e. panning or moving around)
            // - Wheel (i.e. zoom in/out)
            .on("zoom", () => {
                // The "zoom" event populates d3.event with an object that has
                // a "transform" property (an object with three properties
                // of x, y, and k), where x and y is for translation purposes,
                // and k is the scaling factor
                var transform = d3.event.transform;
                this.getPanningContainer().attr("transform", transform);
            });
        this.getSvg().call(this.getZoomListener());

        if (this.getAllowPan() === false) {
            this.getSvg()
                .on("mousedown.zoom", null)
                .on("touchstart.zoom", null)
                .on("touchmove.zoom", null)
                .on("touchend.zoom", null);
        }
        if (this.getAllowZoom() === false) {
            this.getSvg()
                .on("dblclick.zoom", null)
                .on("wheel.zoom", null);
        }

        this.updateDimensions();

        this._populateUnderlyingChildren(this.getRoot());

        if (this.getRoot().children)
            this.getRoot().children.forEach(this.collapseRecursively);
        this.removeSelection(this.getRoot());

        // Call the first update, which renders
        // the initial tree
        this.update(this.getRoot());

        // Centers the root node
        this.centerNode(this.getRoot());

        return this;
    }

    /**
     * Expands the given node data item.
     * 
     * @param {object} nodeDataItem The D3 node data item to expand.
     * @returns {object} The tree object.
     */
    expand(nodeDataItem) {
        nodeDataItem.children = nodeDataItem._children;
        return this;
    }

    /**
     * Expands the given node data item,
     * and its children and descendants.
     * 
     * @param {object} nodeDataItem The D3 node data item to expand.
     * @returns {object} The tree object.
     */
    expandRecursively(nodeDataItem) {
        var rec = function recursive(directNodeDataItem) {
            if (directNodeDataItem.children) {
                directNodeDataItem.children.forEach(recursive);
                directNodeDataItem.children = directNodeDataItem._children;
            }
        };
        rec(nodeDataItem);
        return this;
    }

    /**
     * Collapses the given node data item.
     * 
     * @param {object} nodeDataItem The D3 node data item to collapse.
     * @returns {object} The tree object.
     */
    collapse(nodeDataItem) {
        nodeDataItem.children = null;
        return this;
    }

    /**
     * Collapses the given node data item,
     * and its children and descendants.
     * 
     * @param {object} nodeDataItem The D3 node data item to collapse.
     * @returns {object} The tree object.
     */
    collapseRecursively(nodeDataItem) {
        var rec = function recursive(directNodeDataItem) {
            if (directNodeDataItem.children) {
                directNodeDataItem.children.forEach(recursive);
                directNodeDataItem.children = null;
            }
        };
        rec(nodeDataItem);
        return this;
    }
    
    /**
     * Populates the node's children to a hidden property.
     * 
     * @param {object} nodeDataItem The D3 node data item to collapse.
     * @returns {object} The tree object.
     */
    _populateUnderlyingChildren(nodeDataItem) {
        var rec = function recursive(directNodeDataItem) {
            if (directNodeDataItem.children) {
                directNodeDataItem._children = directNodeDataItem.children;
                directNodeDataItem._children.forEach(recursive);
            }
        };
        rec(nodeDataItem);
        return this;
    }

    /**
     * Remove node selections for a given node and it's children.
     * 
     * @param {object} nodeDataItem The D3 node data item to remove selection from.
     * @returns {object} The tree object.
     */
    removeSelection(nodeDataItem) {
        var rec = function recursive(directNodeDataItem) {
            directNodeDataItem.selected = false;
            if (directNodeDataItem.children) {
                directNodeDataItem.children.forEach(recursive);
            }
        };
        rec(nodeDataItem);
        return this;
    }

    /**
     * Center the view to a D3 tree node.
     * 
     * @param {*} nodeDataItem The D3 node data item to focus on.
     * @returns {object} The tree object.
     */
    centerNode(nodeDataItem) {
        var transform = d3.zoomTransform(this.getSvg().node());
        var scale = transform.k;

        var x, y, translateX, translateY;
        if (this.getOrientation().toLowerCase() === 'toptobottom')
        {
            x = -nodeDataItem.x0;
            y = -nodeDataItem.y0;
            translateX = x * scale + this.getWidth() / 2;
            translateY = y * scale + this.getHeight() / 2;
        }
        else
        {
            x = -nodeDataItem.y0;
            y = -nodeDataItem.x0;
            translateX = x * scale + this.getWidth() / 4;
            translateY = y * scale + this.getHeight() / 2;
        }

        this.getSvg().transition()
            .duration(this.getDuration())
            .call(this.getZoomListener().transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
        return this;
    }

    /**
     * Triggers the nodeClick event when a
     * D3 node is clicked on, and proceeds
     * to focus/expand/collapse the node.
     * 
     * @param {object} nodeDataItem The D3 node data item that was clicked.
     * @param {number} index The index of the D3 node being clicked in the array of siblings.
     * @param {object[]} arr Array of siblings D3 node, inclusive of the clicked node data item itself.
     * @returns {boolean} True meaning it successfully focused/expanded/collapsed a node. False otherwise.
     */
    _onNodeClick(nodeDataItem, index, arr) {
        var continueFocus = true;
        continueFocus = this.emit('nodeClick', nodeDataItem, index, arr);
        if (continueFocus === false)
            return false;
        if (this.getAllowFocus())
            this.nodeFocus.call(this, nodeDataItem);
        else
            this.nodeToggle.call(this, nodeDataItem);
        return true;
    }

    /**
     * Creates a child D3 tree node.
     * 
     * @param {object} parentNodeDataItem The parent D3 tree node data item.
     * @param {object} dataItem The data item.
     * @returns {object} The newly created D3 node;
     */
    _createNode(parentNodeDataItem, dataItem) {
        // Create a D3 node object from resulting data items using d3.hierarchy()
        var newNode = d3.hierarchy(dataItem);

        // Now add missing properties to Node like child, parent, depth
        newNode.depth = parentNodeDataItem.depth + 1;
        newNode.height = parentNodeDataItem.height - 1;
        newNode.parent = parentNodeDataItem;
        newNode.id = this.getId.call(this, dataItem);
        return newNode;
    }

    /**
     * Creates and adds a child D3 tree
     * node to a given parent D3 tree node.
     * 
     * @param {object} parentNodeDataItem The parent D3 tree node data item.
     * @param {object} dataItem The data item.
     * @returns {object} The newly created and added D3 node;
     */
    _addUnderlyingChildNode(parentNodeDataItem, dataItem) {
        var newNode = this._createNode(parentNodeDataItem, dataItem);
        parentNodeDataItem._children.push(newNode);
        return newNode;
    }
    
    /**
     * Process the loaded data from AJAX
     * resulting from a node expand.
     * 
     * @param {object} nodeDataItem The D3 node data item being expanded.
     * @param {object[]} result The children data items to process.
     * @returns {object} The tree object.
     */
    _processLoadedDataForNodeFocus(nodeDataItem, result) {
        nodeDataItem._children = [];
        result.forEach((currentItem) => this._addUnderlyingChildNode(nodeDataItem, currentItem));

        this._populateUnderlyingChildren(nodeDataItem);

        this.updateTreeWithFocusOnNode(nodeDataItem);

        var wasSelected = nodeDataItem.selected;
        this.removeSelection(this.getRoot());
        nodeDataItem.selected = true;

        this.update(nodeDataItem);

        if (this.getAllowNodeCentering() === true && 
            (wasSelected === false || typeof wasSelected === 'undefined'))
            this.centerNode(nodeDataItem);
        return this;
    }

    /**
     * Focuses to a node, given a node data item.
     * 
     * @param {object} nodeDataItem The node being focused on.
     * @returns {object} The tree object.
     */
    nodeFocus(nodeDataItem) {
        if (!nodeDataItem.children && !nodeDataItem._children
            && this.loadOnDemandSettings.isEnabled()
            && this.loadOnDemandSettings.hasChildren(nodeDataItem.data)) {
            var processData = (result) => this._processLoadedDataForNodeFocus(nodeDataItem, result);
            this.loadOnDemandSettings.loadChildren(nodeDataItem.data, processData);
        }
        else {
            this.updateTreeWithFocusOnNode(nodeDataItem);

            var wasSelected = nodeDataItem.selected;
            this.removeSelection(this.getRoot());
            nodeDataItem.selected = true;

            this.update(nodeDataItem);

            if (this.getAllowNodeCentering() === true && 
                (wasSelected === false || typeof wasSelected === 'undefined'))
                this.centerNode(nodeDataItem);
        }
        return this;
    }

    /**
     * Process the loaded data from AJAX
     * resulting from a node toggle.
     * 
     * @param {object} nodeDataItem The D3 node data item.
     * @param {object[]} result Array of sibling node data items, inclusive the node being toggled.
     * @returns {object} The tree object.
     */
    _processLoadedDataForNodeToggle(nodeDataItem, result) {
        nodeDataItem._children = [];
        result.forEach((currentItem) => this._addUnderlyingChildNode(nodeDataItem, currentItem));

        this.expand(nodeDataItem);

        this.update(nodeDataItem);
        if (this.getAllowNodeCentering() === true)
            this.centerNode(nodeDataItem);
        return this;
    }

    /**
     * Toggles the children visibility for a given node data item.
     * 
     * @param {*} nodeDataItem D3 Node data item.
     * @returns {object} The tree object.
     */
    nodeToggle(nodeDataItem) {
        // If it hasn't been loaded, and it's specified to have children,
        // then perform load-on-demand to load new items from server
        // and add them as child nodes
        if (!nodeDataItem.children && !nodeDataItem._children
            && this.loadOnDemandSettings.isEnabled()
            && this.loadOnDemandSettings.hasChildren(nodeDataItem.data)) {
            var processData = (result) => this._processLoadedDataForNodeToggle(nodeDataItem, result);
            this.loadOnDemandSettings.loadChildren(nodeDataItem.data, processData);
        }
        else {
            if (nodeDataItem.children)
                this.collapse(nodeDataItem);
            else
                this.expand(nodeDataItem)
            this.update(nodeDataItem);
            if (this.getAllowNodeCentering() === true)
                this.centerNode(nodeDataItem);
        }
        return this;
    }

    /**
     * Hide the siblings nodes
     * for a given node.
     * 
     * @param {object} nodeDataItem The D3 node to hide siblings for.
     * @returns {object} The tree object.
     */
    hideSiblings(nodeDataItem) {
        var parentNode = nodeDataItem.parent;

        if (parentNode) {
            var nodeId = this.getId(nodeDataItem.data);
            parentNode.children.filter(x => this.getId(x.data) != nodeId).forEach(this.collapseRecursively);
            parentNode.children = [];
            parentNode.children.push(nodeDataItem);
        }
        return this;
    }

    /**
     * Updates the tree diagram so only the relevant
     * focused node and direct parent hierarchies are
     * shown.
     * 
     * @param {object} nodeDataItem D3 Node data item.
     * @returns {object} The tree object.
     */
    updateTreeWithFocusOnNode(nodeDataItem) {
        if (!nodeDataItem.children && nodeDataItem._children) { // If there's no children nodes, but there a some children items to expand
            this.hideSiblings(nodeDataItem);

            this.expand(nodeDataItem);
            // Collapse the current focused node's children, so only direct childrens are shown
            nodeDataItem.children.forEach(this.collapseRecursively);
        }
        else if (nodeDataItem.children) { // If there are rendered children nodes
            // Checks if its children has any rendered children
            var hasNestedChildren = nodeDataItem.children.some((currentItem, index, arr) => currentItem.children);

            var isPreviouslyExpandedNode = !hasNestedChildren;
            // If it is a parent node with children, and
            // is not the previous expanded node,
            // then we'll focus on it, expanding it
            // and showing all of its children
            if (isPreviouslyExpandedNode === false) {
                this.collapseRecursively(nodeDataItem);
                this.expand(nodeDataItem);
            }
        }
        return this;
    }

    /**
     * Updates the tree nodes given
     * a D3 tree node.
     * 
     * @param {object} nodeDataItem The D3 node data item to update.
     * @param {object[]} nodes Array of D3 node data items.
     * @returns {object} The tree object.
     */
    _updateNodes(nodeDataItem, nodes) {
        // Normalize for fixed-depth.
        
        // You can increase the depth multiplication to get more depth,
        // i.e. increasing the distance between the parent node and child node
        nodes.forEach((data) => data.y = data.depth * this.getNodeDepthMultiplier());

        // ****************** Nodes section ***************************

        // Update the nodes...
        var nodes = this.getPanningContainer().selectAll("g.node")
            // The second parameter of data() takes in a 
            // function, determining the key of the data
            // items, which is useful to retrieve items,
            // and databind them
            .data(nodes, (data) => this.getId.call(this, data.data));

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = nodes.enter().append("g")
            .classed("node", true)
            .attr("transform", (data, index, arr) => {
                if (this.getOrientation().toLowerCase() === 'toptobottom')
                    return "translate(" + nodeDataItem.x0 + "," + nodeDataItem.y0 + ")";
                else
                    return "translate(" + nodeDataItem.y0 + "," + nodeDataItem.x0 + ")";
            })
            .on("click", (data, index, arr) => this._onNodeClick.call(this, data, index, arr));

        this._nodeEnter(nodeEnter, nodes);

        // UPDATE
        var nodeUpdate = nodeEnter.merge(nodes);
        var nodeUpdateTransition = nodeUpdate.transition().duration(this.getDuration());

        nodeUpdate
            .classed("collapsed", (data, index, arr) => {
                if (!data.children && data._children)
                    return true;
                else if (this.loadOnDemandSettings.isEnabled()
                            && this.loadOnDemandSettings.hasChildren(data.data)
                            && !data.children && !data._children) // If it does have children to load via AJAX
                    return true;
                return false;
            })
            .classed("expanded", (data, index, arr) => data.children)
            .classed("childless", (data, index, arr) => !data.children && !data._children)
            .classed("selected", (data, index, arr) => data.selected);

            this._nodeUpdate(nodeUpdate, nodeUpdateTransition, nodes);

        // Remove any exiting nodes
        var nodeExit = nodes.exit();
        var nodeExitTransition = nodeExit.transition().duration(this.getDuration());

        this._nodeExit(nodeExit, nodeExitTransition, nodes);
        return this;
    }

    /**
     * Updates the tree node links given
     * a D3 tree node.
     * 
     * @param {object} nodeDataItem The D3 node data item. 
     * @param {object[]} links Array of D3 link data items.
     * @returns {object} The tree object.
     */
    _updateLinks(nodeDataItem, links) {
        var linkPathGenerator = this._getLinkPathGenerator();

        // Update the links...
        var link = this.getPanningContainer().selectAll("path.link")
            .data(links, (data) => this.getId.call(this, data.data));

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert("path", "g")
            .classed("link", true);
        this._linkEnter(nodeDataItem, linkEnter, link, linkPathGenerator);

        // UPDATE
        var linkUpdate = linkEnter.merge(link);
        var linkUpdateTransition = linkUpdate.transition()
                                             .duration(this.getDuration());

        // Transition back to the parent element position
        this._linkUpdate(nodeDataItem, linkUpdate, linkUpdateTransition, link, linkPathGenerator);

        // Remove any exiting links
        var linkExit = link.exit();
        var linkExitTransition = linkExit.transition()
                                          .duration(this.getDuration())

        this._linkExit(nodeDataItem, linkExit, linkExitTransition, link, linkPathGenerator);

        // Store the old positions for transition.
        this.getVisibleNodes().forEach((data) => {
            data.x0 = data.x;
            data.y0 = data.y;
        });
        return this;
    }

    /**
     * Updates the tree given a D3 tree node.
     * 
     * @param {object} nodeDataItem The D3 node data item.
     * @returns {object} The tree object.
     */
    update(nodeDataItem) {
        var treeGenerator = this.getTreeGenerator();
        // Assigns the x and y position for the nodes
        var treeData = treeGenerator(this.getRoot());
        this._visibleNodes = treeData.descendants();
        this._nodes = [this.getRoot(), ...recursiveGet(this.getRoot(), (node) => node._children)];
        this._links = treeData.descendants().slice(1);

        this._updateNodes(nodeDataItem, this.getVisibleNodes())
            ._updateLinks(nodeDataItem, this.getLinks());

        return this;
    }

    /**
     * Gets the unique ID for a given data item.
     * @callback getIdCallBack
     * @param {object} data Represents the single data item to extract the ID from.
     * @returns {*} The unique ID from the given data item.
     */

    /**
     * Gets the parent ID for a given data item.
     * @callback getParentIdCallBack
     * @param {object} data Represents the single data item to extract the parent ID from.
     * @returns {*} The parent ID from the given data item.
     */

    /**
     * Gets the children items for a given
     * data item.
     * @callback getChildrenCallBack
     * @param {object} data Represents the single data item to extract the children data items from.
     * @returns {object[]} The array of data items representing the children of the given data item.
     */

    /**
     * Event handler for the node click event.
     * @callback nodeClickCallBack
     * @param {object} nodeDataItem Node data item representing the clicked node.
     * @param {object} nodeDataItem.data The data item of the clicked node.
     * @param {number} index Index of the clicked item in the array of siblings.
     * @param {object[]} arr The array of sibling rendered SVG elements, inclusive of the node itself.
     * @returns {boolean} If returns false, it'll prevent propogation to focus/expand/collapse the node.
     */
}

// Define option defaults using a class static property
BaseTree.defaults = {
    theme: 'default',
    orientation: 'leftToRight', // topToBottom, rightToLeft, bottomToTop
    allowPan: true,
    allowZoom: true,
    allowFocus: true,
    allowNodeCentering: true,
    minScale: 1, // Minimum zoom scaling
    maxScale: 2, // Maximum zoom scaling
    // You can increase the depth multiplication to get more depth,
    // i.e. increasing the distance between the parent node and child node
    nodeDepthMultiplier: 300,
    isFlatData: false,
    getId: null,
    getParentId: null,
    getChildren: null,
    widthWithoutMargins: 960,
    heightWithoutMargins: 800,
    margins: {
        top: 40,
        right: 20,
        bottom: 40,
        left: 100
    },
    duration: 750,
    events: {
        nodeClick: null
    },
    loadOnDemandSettings: {
        // Defaults are defined in the load-on-demand settings prototype
    },
    nodeSettings: {
        // Defaults are defined in the node settings prototype
    },
}

export default BaseTree;