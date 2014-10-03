/**
 *  Init OpenLayers
*/
Gnx.OpenLayers = function () {

    var self = this;

    var _initialized = false;
    this.initialized = false;

    var _init = function () {
        // get center panel - clear it up, and create ol3 map container
        $('#center-inner').empty();

        self.mapDivId = $.getUuid();
    }

    this.setupMap = function (mapDivId) {

        if (!mapDivId) {
            mapDivId = self.mapDivId;
        }

        $('#center-inner').html('<div id=' + mapDivId + ' style="width:100%; height:100%;"></div>');

        self.map = new ol.Map({
            target: mapDivId,
            layers: [
              new ol.layer.Tile({
                  source: new ol.source.MapQuest({ layer: 'sat' })
              })
            ],
            view: new ol.View({
                center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4
            })
        });
    }

    // callbacks to resize map when parent container size change
    var onWestResizeStart = function () {
        updateMapContainer();
    }

    var onWestResizeEnd = function () {
        updateMapContainer();
    }

    var onWestOpenEnd = function () {
        updateMapContainer();
    }

    var onWestCloseEnd = function () {
        updateMapContainer();
    }

    var updateMapContainer = function () {
        self.map.updateSize();
    }



    this.getWmsCapabilities = function(url, userName, userPassword){
        var parser = new ol.format.WMSCapabilities();

        $.ajax(url).then(function (response) {
            var result = parser.read(response);
            //$('#log').html(window.JSON.stringify(result, null, 2));

            console.warn('capabilities response', JSON.stringify(result, null, 2));
        });
    }



    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        //updateSize()


        // capture west pane resize
        Gnx.Event.on('layout-west-resize-start', onWestResizeStart);
        Gnx.Event.on('layout-west-resize-end', onWestResizeEnd);

        Gnx.Event.on('layout-west-open-end', onWestOpenEnd);
        Gnx.Event.on('layout-west-close-end', onWestCloseEnd);
        

        

        return this.initialized;
    }
};
