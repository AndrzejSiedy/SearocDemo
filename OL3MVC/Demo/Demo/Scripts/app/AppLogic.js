/**
 *  Business logic starts here
*/
(function ($, namespace, undefined) {

    var me = namespace;

    var _appStarted = false;

    /**
     * Method initializes freewall and other setup stuff 
     */
    me.appStart = function () {

        // prevent from calling method multiple times
        if (_appStarted) {
            console.warn('app stater already');
            return;
        }

        // jQuery Layout UI
        var l = me.Layout = new me.Layout();
        
        l.init();

        
        // init shindig container - will be placed in center panel
        var sc = me.Center = new me.Center();
        sc.init();

        _appStarted = true;

        
    }


    return me;

})(jQuery, window.Gnx);
