/**
 *  Init OpenLayers
*/
Gnx.OL3 = function () {

    var _initialized = false;
    this.initialized = false;

    var _init = function () {
        
    }

    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        //Gnx.Event.on('layout-west-resize-start', onWestResizeStart);
        //Gnx.Event.on('layout-west-resize-end', onWestResizeEnd);

        return this.initialized;
    }
};
