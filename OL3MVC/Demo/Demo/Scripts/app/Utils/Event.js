/**
* Simple utility singleton class for events triggering, subscribing and unsubscribing
* Usage example:
*   evt callback: fn = function(evt, data){console.warn('evt callback', evt, data);}
*   bind to event: Gnx.Event.on('evtName', fn);
*   fire/trigger event with data: Gnx.Event.fireEvent('evtName', {x:1, y:'a'}, callbackFn);
*   unbind event: Gnx.Event.un('evtName', fn);
*/
Gnx.Events = (function () {

    var me = this;
    var _initialized = false;
    me.initialized = false;

    // Instance stores a reference to the Singleton
    var instance;

    var init = function () {

        if (_initialized) return;

        // Singleton
        // Private methods and variables
        var _divId = $.getUuid();

        // create DOM object to which we bind events
        var _dom = $('body').append($('<div id="' + _divId + '" style="visibility: hidden;display: none; width:1px;height:1px; top:-100px;">', {}));


        _initialized = true;

        return {
            // trigger/fire event
            fireEvent: function (evtName, data, callbackFn) {
                var opts = {
                    type: evtName,
                    callbackFn: callbackFn
                }
                //$.extend(opts.data, data);
                $("#" + _divId).trigger(opts, [data = data || {}]);
            },
            // bind to event
            on: function (evtName, data, fn) {
                $("#" + _divId).on(evtName, data, fn);
            },
            // unbind event
            un: function (evtName, fn) {
                $("#" + _divId).off(evtName, fn);
            }
        };

    };

    // internal method for getting/setting Evt object
    var _getInstance = function () {

        if (!instance) {
            instance = init();
        }

        me.initialized = true;
        return instance;
    };

    // create singleton namespaced event object
    Gnx.Event = _getInstance();

    return {

        initialized: me.initialized
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        //getInstance: _getInstance

    };

})();