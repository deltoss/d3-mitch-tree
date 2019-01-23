class NodeSettings {
    /**
     * @param {object} ownerObject The owner object
     * @param {object} options The options for the node settings.
     * @param {('nodeSize'|'size')} [options.sizingMode=size] The sizing mode. Should be either 'nodeSize' to automatically size the SVG based on the nodes, or 'size' to use the configured width and height.
     * @param {number} [options.horizontalSpacing=25] The horizontal spacing value.
     * @param {number} [options.verticalSpacing=25] The vertical spacing value.
     */
    constructor(ownerObject, options) {
        var mergedOptions = {
            ...NodeSettings.defaults,
            ...options
        };

        this._ownerObject = ownerObject;
        this._sizingMode = mergedOptions.sizingMode;
        this._horizontalSpacing = mergedOptions.horizontalSpacing;
        this._verticalSpacing = mergedOptions.verticalSpacing;
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
     * Gets the horizontal spacing value.
     * 
     * @returns {number} The horizontal spacing value.
     */
    getHorizontalSpacing() {
        return this._horizontalSpacing;
    }

    /**
     * Sets the horizontal spacing value.
     * 
     * @param {number} newHorizontalSpacing The new horizontal spacing value.
     * @returns {object} The node settings object.
     */
    setHorizontalSpacing(newHorizontalSpacing) {
        this._horizontalSpacing = newHorizontalSpacing;
        return this;
    }

    /**
     * Gets the vertical spacing value.
     * 
     * @returns {number} The vertical spacing value.
     */
    getVerticalSpacing() {
        return this._verticalSpacing;
    }

    /**
     * Sets the vertical spacing value.
     * 
     * @param {number} newVerticalSpacing The new vertical spacing value.
     * @returns {object} The node settings object.
     */
    setVerticalSpacing(newVerticalSpacing) {
        this._verticalSpacing = newVerticalSpacing;
        return this;
    }

    /**
     * Gets the sizing mode.
     * 
     * @returns {string} The configured node sizing mode.
     */
    getSizingMode() {
        return this._sizingMode;
    }

    /**
     * Sets the sizing mode.
     * 
     * @param {('nodeSize'|'size')} newSizingMode The sizing mode. Should be either 'nodeSize' to automatically size the SVG based on the nodes, or 'size' to use the configured width and height.
     * @returns {object} The node settings object.
     */
    setSizingMode(newSizingMode) {
        this._sizingMode = newSizingMode;
        return this;
    }
}

NodeSettings.defaults = {
    sizingMode: "size", // set to 'nodeSize' for the tree size to automatically be based on the node dimensions itself.
    horizontalSpacing: 25,
    verticalSpacing: 25
}

export default NodeSettings;