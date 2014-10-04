/**
 *  Init OpenLayers
*/
Gnx.OpenLayers = function () {

    var self = this;

    var _initialized = false;
    this.initialized = false;

    // loaded layers store
    this.layers = [];

    var _init = function () {
        // get center panel - clear it up, and create ol3 map container
        $('#center-inner').empty();

        self.mapDivId = $.getUuid();
    };

    this.setupMap = function (mapDivId) {

        if (!mapDivId) {
            mapDivId = self.mapDivId;
        }

        $('#center-inner').html('<div id=' + mapDivId + ' style="width:100%; height:100%;"></div>');


        //var searoc:Bathy
        var wmsSource = new ol.source.ImageWMS({
            url: 'http://demo.opengeo.org/geoserver/wms',
            params: { 'LAYERS': 'ne:ne' },
            serverType: 'geoserver'
        });

        var wmsLayer = new ol.layer.Image({
            source: wmsSource
        });

        var wmsSource1 = new ol.source.ImageWMS({
            url: 'http://gis-demo.seaplanner.com:8080/wms',
            params: { 'LAYERS': 'searoc:Bathy' },
            serverType: 'geoserver'
        });

        var wmsLayer1 = new ol.layer.Image({
            source: wmsSource1
        });

        var view = new ol.View({
            center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
            zoom: 4
        });

        //base layers
        var osm = new ol.layer.Tile({
            //just mark the layer as the base layer, so it is possible to distinguish between hgis layers and the layers that are meant to act as base layers
            //ol3 does not really need a base layer
            is_base_layer: true,
            source: new ol.source.OSM()
        });

        self.map = new ol.Map({
            target: mapDivId,
            layers: [
                osm
              //new ol.layer.Tile({
              //    source: new ol.source.MapQuest({ layer: 'sat' })
              //})
              //wmsLayer,
              //wmsLayer1
            ],
            view: view
        });

        self.map.on('singleclick', function (evt) {
            var viewResolution = /** @type {number} */ (view.getResolution());
            var url = wmsSource1.getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:3857',
                { 'INFO_FORMAT': 'text/html' });
            if (url) {

                $("#dialog-info").html('<iframe seamless src="' + url + '"></iframe>').dialog({
                    resizable: false,
                    modal: true,
                    title: "Missing field value",
                    height: 250,
                    width: 400,
                    buttons: {
                        "OK": function () {
                            $(this).dialog('close');
                        }
                    }
                });
            }
        });

    };

    // callbacks to resize map when parent container size change
    var onWestResizeStart = function () {
        updateMapContainer();
    };

    var onWestResizeEnd = function () {
        updateMapContainer();
    };

    var onWestOpenEnd = function () {
        updateMapContainer();
    };

    var onWestCloseEnd = function () {
        updateMapContainer();
    };

    var updateMapContainer = function () {
        self.map.updateSize();
    };


    var _onAddLayer = function (evt, data) {
        data.onMap(true);
        data.visible(true);
        self.map.addLayer(data.olLayer);
    };

    // set layer visibility 
    var _onLayerVisibilityChange = function (evt, data) {
        data.layer.olLayer.setVisible(data.visible);
    };

    var _registerWmsLayer = function (layer) {

        var sourceParams = {
            url: layer.getMapUrl,
            params: { 'LAYERS': layer.Name },
            serverType: 'geoserver'
        };

        var wmsLayer = new ol.layer.Image({
            source: new ol.source.ImageWMS(sourceParams),
            visible: true
        });

        layer.olLayer = wmsLayer;

        self.layers.push(layer);
    };


    var _removeAllLayers = function () {

        // remove all WMS loaded layers from local store
        while (self.layers.length > 0) {
            self.map.removeLayer(self.layers[0]);
            self.layers.splice(0, 1);
        }
        // remove layers from knockout object
        wmsLayerViewModel.removeAllLayers();

    };

    var _parseWmsCapabilities = function(rawData){
        var parser = new ol.format.WMSCapabilities();
        var result = parser.read(rawData);

        var layers = result.Capability.Layer.Layer;
        
        var getMapUrl = result.Capability.Request.GetMap.DCPType[0].HTTP.Get.OnlineResource.split('?')[0] + '?';

        // clear off all loaded previously layers from knockout model
        _removeAllLayers();

        // load layers records to show them in grid
        for (var i = 0; i < layers.length; i++) {
            var l = layers[i];

            // inject extra parameters
            l.getMapUrl = getMapUrl;
            l.onMap = false;

            // register & prepare layer
            _registerWmsLayer(l);

            // add layer to the knockout model
            wmsLayerViewModel.registerLayer(l);
        }

        console.warn(result);
    }

    var _parseWfsCapabilities = function (rawData) {
        var parser = new ol.format.WFSCapabilities();
        var result = parser.read(rawData);
        console.warn(result);
    }

    // simple method conatinating user, pass and url
    var _getWmsCapabilities = function (evt, data) {
        
        var url = data.url;

        if (url.indexOf('service') == -1) {
            url = url + '&service=wms';
        }
        if (url.indexOf('request') == -1) {
            url = url + '&request=GetCapabilities';
        }

        var proxy = '/Proxy/xDomainProxy.ashx?url=';
        url = proxy + url;

        var options = {
            type: "GET",
            url: url,
            success: function (data) {
                _parseWmsCapabilities(data);
            },
            error: function (data) {
                console.warn('error', data);
            }
        }

        // inject user and and pass to the capabilities request
        if (data.userName.length > 0 && data.password.length > 0) {

            options.data = {
                username: data.userName,
                password: data.password
            };

        }

        //'http://demo:searoc@gis-demo.seaplanner.com:8080/ows?&service=wms&request=GetCapabilities'

        // make capabilities request
        $.ajax(options)

    }

    // simple method conatinating user, pass and url
    var _getWfsCapabilities = function (evt, data) {

        var url = data.url;

        if (url.indexOf('service') == -1) {
            url = url + '&service=wfs';
        }
        if (url.indexOf('request') == -1) {
            url = url + '&request=GetCapabilities';
        }

        var proxy = '/Proxy/xDomainProxy.ashx?url=';
        url = proxy + url;

        var options = {
            type: "GET",
            url: url,
            success: function (data) {
                //_parseWfsCapabilities(data);
                console.warn('wfs capabilities', data);
            },
            error: function (data) {
                console.warn('error', data);
            }
        }

        // inject user and and pass to the capabilities request
        if (data.userName.length > 0 && data.password.length > 0) {

            options.data = {
                username: data.userName,
                password: data.password
            };

        }

        //'http://demo:searoc@gis-demo.seaplanner.com:8080/ows?&service=wms&request=GetCapabilities'

        // make capabilities request
        $.ajax(options)

    }

    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        // capture west pane resize
        Gnx.Event.on('layout-west-resize-start', onWestResizeStart);
        Gnx.Event.on('layout-west-resize-end', onWestResizeEnd);

        Gnx.Event.on('layout-west-open-end', onWestOpenEnd);
        Gnx.Event.on('layout-west-close-end', onWestCloseEnd);

        // bind callbact to user clicked "get WMS Capabilities
        Gnx.Event.on('get-wms-capabilities', _getWmsCapabilities);
        // bind callbact to user clicked "get WFS Capabilities
        Gnx.Event.on('get-wfs-capabilities', _getWfsCapabilities);



        // listen to event called from koWmsViewModel
        Gnx.Event.on('add-layer', _onAddLayer);

        // user changed layer visibility in data grid
        Gnx.Event.on('set-layer-visibility-change', _onLayerVisibilityChange);

        


        return this.initialized;
    }
};
