/**
 * Init Center container UI
 * Will hold OpenLayers3 map
*/
Gnx.Center = function () {

    var _initialized = false;
    this.initialized = false;

    var _init = function () {
        var html = 'loaded center stuff on init';
        $('#center-inner').html(html);
    }
    
    var onWestResizeStart = function () {
        // show load mask on center - shindig container
        // this is to prevent loosing cursor scope to iframe container
        $('#center-inner').showLoadMask();
    }

    var onWestResizeEnd = function () {
        // a bit delayed mask remove
        setTimeout(function () {
            $('#center-inner').hideLoadMask();
        }, 500);
        
    }

    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        Gnx.Event.on('layout-west-resize-start', onWestResizeStart);
        Gnx.Event.on('layout-west-resize-end', onWestResizeEnd);

        return this.initialized;
    }
};
