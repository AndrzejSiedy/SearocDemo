/**
 *  Init Gnx namespace
 *  Other modules, classes will extend it
*/
(function ($, namespace, undefined) {

    var me = namespace;

    me.Layout = null;

    // this is private method against which we do checks if can call Gnx.init and Gnx.appStart methods
    var _initialized = false;
    /**
     * Method initializes freewall and other setup stuff 
     */
    me.init = function () {

        // this is to prevent calling them after app is propperly initialized
        if (_initialized) {
            console.warn('app initilized already');
            return;
        }

        me.initialized = _initialized = true;
        return me.initialized;
    }

    return me;

})(jQuery, window.Gnx = window.Gnx || {});
