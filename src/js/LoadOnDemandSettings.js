class LoadOnDemandSettings {
    /**
     * 
     * @param {object} ownerObject The owner object.
     * @param {object} options The options object.
     * @param {hasChildrenCallBack} options.hasChildren Sets the hasChildren callback function, used to determine whether a node or data item has children or not.
     * @param {loadChildrenCallBack} options.loadChildren the loadChildren callback function, used to load children data items for a node.
     */
    constructor(ownerObject, options) {
        // Define option defaults
        var mergedOptions = {
            ...LoadOnDemandSettings.defaults,
            ...options
        };

        this._ownerObject = ownerObject;
        this._hasChildren = mergedOptions.hasChildren;
        this._loadChildren = mergedOptions.loadChildren;
    }

    /**
     * Gets the owner object.
     * 
     * @returns {object} The owner object.
     */
    back() {
        return this._ownerObject;
    }

    /**
     * Validates whether the provided
     * settings are correct or not.
     * 
     * @returns {object} The tree object.
     */
    validateSettings() {
        if (!this.hasChildren && this.loadChildren)
            throw "With load on demand enabled, you need to define hasChildren as part of the options";
        if (!this.loadChildren && this.hasChildren)
            throw "With load on demand enabled, you need to define loadChildren as part of the options";
        return this;
    }

    /**
     * Load the children for a given data object.
     * 
     * @param {*} data The data item, which should be used to load the children of the data item via AJAX.
     * @param {*} processData Callback function to process the children data items.
     * @returns {*}
     */
    loadChildren(data, processData){
        return this._loadChildren.call(this._ownerObject, data, processData);
    }

    /**
     * Returns a boolean indicating whether
     * the passed data item has children.
     * 
     * @param {object} dataItem The data item to check if it has children or not.
     * @returns {boolean} Whether the data item has children or not.
     */
    hasChildren(dataItem){
        return this._hasChildren.call(this._ownerObject, dataItem);
    }

    /**
     * Sets the loadChildren callback function,
     * used to load children data items for
     * a node.
     * 
     * @param {loadChildrenCallBack} newLoadChildrenMethod
     * @returns {object} The tree object.
     */
    setLoadChildrenMethod(newLoadChildrenMethod){
        this._loadChildren = newLoadChildrenMethod;
        return this;
    }

    /**
     * Sets the hasChildren callback function,
     * used to determine whether a node
     * or data item has children or not.
     * 
     * @param {hasChildrenCallBack} newHasChildrenMethod
     * @returns {object} The tree object.
     */
    setHasChildrenMethod(newHasChildrenMethod){
        this._hasChildren = newHasChildrenMethod;
        return this;
    }

    /**
     * Returns a boolean indicating whether
     * load-on-demand is enabled or not.
     * 
     * @returns {boolean} Whether load-on-demand is enabled or not.
     */
    isEnabled() {
        return this._hasChildren || this._loadChildren;
    }

    /**
     * Determines whether a node data item
     * has children or not.
     * 
     * @callback hasChildrenCallBack
     * @param {object} dataItem Can be used to to load the childrens from the server via AJAX.
     * @returns {boolean} True if the node or data item has children to load via AJAX, false otherwise.
     */

    /**
     * Load the children items for a given
     * node data item.
     * @callback loadChildrenCallBack
     * @param {object} nodeDataItem Node data item, which can be used to to load the childrens from the server via AJAX.
     * @param {object} nodeDataItem.data The data item, which can be used to to load the childrens from the server via AJAX.
     * @param {childrenDataProcessorCallBack} processData Data processor callback function which you should use to call, passing in the children data that's been loaded via AJAX.
     * @returns {undefined}
     */

    /**
     * Processes the children items.
     * @callback childrenDataProcessorCallBack
     * @param {object[]} childrenDataItems The array of children data for the node being processed.
     * @returns {undefined}
     */
}

LoadOnDemandSettings.defaults = {
    // Takes in a function that accepts a parameter:
    // - The node and data item which can be used
    //   to load the childrens from server
    // Returns true or false
    hasChildren: null,
    // Takes in a function that accepts two parameters:
    // - The node and data item which can be used
    //   to load the childrens from server
    // - the data processor function, which
    //   you should call, passing in the
    //   children data you loaded with
    //   your server AJAX request
    loadChildren: null,
}

export default LoadOnDemandSettings;