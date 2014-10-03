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

    // simple method conatinating user, pass and url
    var _getWmsCapabilities = function (evt, data) {
        

        var url = data.url;

        // inject user and and pass to the capabilities request
        if (data.userName.length > 0 && data.password.length > 0) {
            
            if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
                var u = url.split('://');
                url = u[0] + '://' + data.userName + ':' + data.password + '@' + u[1];
            }
            else {
                url = 'http://' + data.userName + ':' + data.password + '@' + url;
            }

            if (url.indexOf('service') == -1) {
                url = url + '&service=wms';
            }
            if (url.indexOf('request') == -1) {
                url = url + '&request=GetCapabilities';
            }
        }

        var parser = new ol.format.WMSCapabilities();

        console.warn('xxxx', url)

        $.ajax({
            type: "GET",
            url: 'http://demo:searoc@gis-demo.seaplanner.com:8080/ows?&service=wms&request=GetCapabilities',
            contentType: 'application/json; charset=utf-8',
            //crossDomain: true,
            success: function (data) {
                console.warn('dupa', data);
            },
            error: function (data) {
                console.warn('error', data);
            }
        })


        //$.ajax(url).done(function (response) {
        //    var result = parser.read(response);
        //    //$('#log').html(window.JSON.stringify(result, null, 2));

        //    console.warn('capabilities response', JSON.stringify(result, null, 2));
        //});
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

        // bind callbact to user clicked "get WMS Capabilities
        Gnx.Event.on('get-wms-capabilities', _getWmsCapabilities);
        

        return this.initialized;
    }
};
