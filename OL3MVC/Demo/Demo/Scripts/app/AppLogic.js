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
        
        // init and setup center container
        var sc = me.Center = new me.Center();
        sc.init();

        // init west container
        var sw = me.West = new me.West();
        sw.init();

        // init and load ol3
        var ol3 = me.ol3 = new me.OpenLayers();
        ol3.init();

        // generate map div id
        var mapDivId = $.getUuid();

        // init map container and map
        ol3.setupMap(mapDivId);

        _appStarted = true;

        
    }


    return me;

})(jQuery, window.Gnx);
