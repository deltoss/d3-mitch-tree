import NodeSettings from './NodeSettings';

class BoxedNodeSettings extends NodeSettings {
    /**
     * @param {object} ownerObject The owner object.
     * @param {object} options The options object.
     * @param {number} [options.bodyBoxWidth=200] Body box width.
     * @param {number} [options.bodyBoxHeight=75] Body box height.
     * @param {object} [options.bodyBoxPadding] Body box padding object.
     * @param {number} [options.bodyBoxPadding.top=5] Body box padding top.
     * @param {number} [options.bodyBoxPadding.right=10] Body box padding right.
     * @param {number} [options.bodyBoxPadding.bottom=5] Body box padding bottom.
     * @param {number} [options.bodyBoxPadding.left=10] Body box padding left.
     * @param {number} [options.titleBoxWidth] Title box width.
     * @param {number} [options.titleBoxHeight=40] Title box height.
     * @param {object} [options.titleBoxPadding] Title box padding object.
     * @param {number} [options.titleBoxPadding.top=2] Title box padding top.
     * @param {number} [options.titleBoxPadding.right=5] Title box padding right.
     * @param {number} [options.titleBoxPadding.bottom=2] Title box padding bottom.
     * @param {number} [options.titleBoxPadding.left=5] Title box padding left.
     */
    constructor(ownerObject, options) {
        super(ownerObject, options);

        var mergedOptions = {
            ...BoxedNodeSettings.defaults,
            ...options
        };

        this._bodyBoxWidth = mergedOptions.bodyBoxWidth;
        this._bodyBoxHeight = mergedOptions.bodyBoxHeight;
        this._bodyBoxPadding = mergedOptions.bodyBoxPadding;
        this._titleBoxWidth = mergedOptions.titleBoxWidth;
        this._titleBoxHeight = mergedOptions.titleBoxHeight;
        this._titleBoxPadding = mergedOptions.titleBoxPadding;
    }

    /**
     * Gets the body box width value.
     * 
     * @returns {number} The body box width value.
     */
    getBodyBoxWidth() {
        return this._bodyBoxWidth;
    }

    /**
     * Sets the body box width value.
     * 
     * @param {number} width The body box width value.
     * @returns {object} The node settings object.
     */
    setBodyBoxWidth(width) {
        this._bodyBoxWidth = width;
        return this;
    }

    /**
     * Gets the body box height value.
     * 
     * @returns {number} The body box height value.
     */
    getBodyBoxHeight() {
        return this._bodyBoxHeight;
    }

    /**
     * Sets the body box height value.
     * 
     * @param {number} height The body box height value.
     * @returns {object} The node settings object.
     */
    setBodyBoxHeight(height) {
        this._bodyBoxHeight = height;
        return this;
    }

    /**
     * Sets the body box padding values.
     * 
     * @param {object} newPadding The body box padding object value.
     * @param {number} newPadding.top The body box padding top value.
     * @param {number} newPadding.right The body box padding right value.
     * @param {number} newPadding.bottom The body box padding bottom value.
     * @param {number} newPadding.left The body box padding left value.
     * @returns {object} The node settings object.
     */
    setBodyBoxPadding(newPadding) {
        this._bodyBoxPadding = newPadding;
        return this;
    }

    /**
     * Gets the body box padding values.
     * 
     * @returns {object} The body box padding object.
     */
    getBodyBoxPadding() {
        return this._bodyBoxPadding;
    }

    /**
     * Gets the title box width value.
     * 
     * @returns {number} The title box width value.
     */
    getTitleBoxWidth() {
        if (this._titleBoxWidth)
            return this._titleBoxWidth;
        else
            return this.getBodyBoxWidth() / 2;
    }

    /**
     * Sets the title box width value.
     * 
     * @param {number} width The title box width value.
     * @returns {object} The node settings object.
     */
    setTitleBoxWidth(width) {
        this._titleBoxWidth = width;
        return this;
    }

    /**
     * Gets the title box height value.
     * 
     * @returns {number} The title box height value.
     */
    getTitleBoxHeight() {
        return this._titleBoxHeight;
    }

    /**
     * Sets the title box height value.
     * 
     * @param {number} height The title box height value.
     * @returns {object} The node settings object.
     */
    setTitleBoxHeight(height) {
        this._titleBoxHeight = height;
        return this;
    }

    /**
     * Gets the title box padding values.
     * 
     * @returns {object} The title box padding object.
     */
    getTitleBoxPadding() {
        return this._titleBoxPadding;
    }
    
    /**
     * Sets the title box padding values.
     * 
     * @param {object} newPadding The body box padding object value.
     * @param {number} newPadding.top The body box padding top value.
     * @param {number} newPadding.right The body box padding right value.
     * @param {number} newPadding.bottom The body box padding bottom value.
     * @param {number} newPadding.left The body box padding left value.
     * @returns {object} The node settings object.
     */
    setTitleBoxPadding(newPadding) {
        this._titleBoxPadding = newPadding;
        return this;
    }
}

BoxedNodeSettings.defaults = {
    bodyBoxWidth: 200,
    bodyBoxHeight: 75,
    bodyBoxPadding: {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10
    },
    titleBoxWidth: null,
    titleBoxHeight: 40,
    titleBoxPadding: {
        top: 2,
        right: 5,
        bottom: 2,
        left: 5
    },
}

export default BoxedNodeSettings;