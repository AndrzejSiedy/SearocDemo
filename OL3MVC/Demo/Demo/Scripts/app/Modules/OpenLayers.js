/**
 *  Init OpenLayers
*/
Gnx.OpenLayers = function () {

    var self = this;

    var _initialized = false;
    this.initialized = false;

    // loaded layers store
    this.layers = [];
    // map object
    this.map = null;

    this.proxy = '/Proxy/xDomainProxy.ashx?url=';

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
            title: 'ne:ne',
            url: 'http://demo.opengeo.org/geoserver/wms',
            params: { 'LAYERS': 'ne:ne' },
            serverType: 'geoserver'
        });

        var wmsLayer = new ol.layer.Image({
            source: wmsSource
        });

        var wmsSource1 = new ol.source.ImageWMS({
            title: 'searoc:Bathy',
            url: 'http://gis-demo.seaplanner.com:8080/wms',
            params: { 'LAYERS': 'searoc:Bathy' },
            serverType: 'geoserver'
        });

        var wmsLayer1 = new ol.layer.Image({
            source: wmsSource1
        });

        var view = new ol.View({
            center: [-8234182.45122, 4980466.18673],
            maxZoom: 19,
            zoom: 11
        });

        //base layers
        var osm = new ol.layer.Tile({
            //just mark the layer as the base layer, so it is possible to distinguish between hgis layers and the layers that are meant to act as base layers
            //ol3 does not really need a base layer
            is_base_layer: true,
            source: new ol.source.OSM(),
            title: 'OSM'
        });


        self.map = new ol.Map({
            target: mapDivId,
            layers: [
               //osm
              new ol.layer.Tile({
                  source: new ol.source.MapQuest({ layer: 'sat' }),
                  title: 'Base-Sat'
              })
              //wmsLayer,
              //wmsLayer1
            ],
            controls: ol.control.defaults({
                attributionOptions: {
                    collapsible: false
                }
            }).extend([
                new ol.control.ScaleLine(),
                new ol.control.MousePosition({
                    //projection: ol.proj.get('EPSG:4326'),
                    coordinateFormat: function (coords) {
                        var output = '';
                        if (coords) {
                            output = coords[0].toFixed(5) + ' : ' + coords[1].toFixed(5);
                        }
                        return output;
                    }
                })
            ]),
            view: view
        });

        // add layer switcher
        //var layerSwitcher = new ol.control.LayerSwitcher();
        //self.map.addControl(layerSwitcher);

        // add popup
        self.popup = new ol.Overlay.Popup();
        self.map.addOverlay(self.popup);

        self.map.on('singleclick', function (evt) {
            getWmsFeatureInfo(evt);
            getWfsFeatureInfo(evt);
        });

    };

    var getWmsFeatureInfo = function (evt) {

        var mapProjection = self.map.getView().getProjection();
        var mapProjCode = mapProjection.getCode();

        var viewResolution = /** @type {number} */ (self.map.getView().getResolution());

        var gfiIframes = '';

        for (var i = 0 ; i < self.layers.length; i++) {
            var l = self.layers[i];

            if (l.queryable && l.isOnMap && l.olLayer.getVisible() && l.type == 'WMS') {
                var url = l.olLayer.getSource().getGetFeatureInfoUrl(
                    evt.coordinate, viewResolution, mapProjCode,
                    { 'INFO_FORMAT': 'text/html' });
                if (url) {
                    gfiIframes = gfiIframes + '<br/><iframe seamless src="' + url + '"></iframe>';

                    self.popup.show(evt.coordinate, '<div>' + gfiIframes + '</div>');
                }
            }
        }
        
    };

    var getWfsFeatureInfo = function (evt) {
        var pixel = evt.pixel;

        var feature = self.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            return feature;
        });

        if (!feature) return;

        var fProp = feature.getProperties();
        var pData = '';
        for (var p in fProp) {
            if (p != 'geometry') {
                pData = pData + '<p><b>' + p + '</b>: ' + fProp[p] + '</p>';
            }
        }

        self.popup.show(evt.coordinate, '<div>' + pData + '</div>');

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

        var lFromLocalStore = self.getLayerById(data.id);
        if (!lFromLocalStore) return;

        data.isOnMap(true);
        data.visible(true);
        self.map.addLayer(data.olLayer);

        lFromLocalStore.isOnMap = true;

        var mapProjection = self.map.getView().getProjection();
        var mapProjCode = mapProjection.getCode();

        // WMS layer
        if (data.type == 'WMS') {
            // try to zoom to added layer
            try{
                // get bounding box for layer from capabilities
                var bbox = lFromLocalStore.BoundingBox[1];
                var lProjCode = bbox.crs;

                var extent = ol.proj.transformExtent(lFromLocalStore.EX_GeographicBoundingBox, 'EPSG:4326', mapProjCode);

                self.map.getView().fitExtent(extent, self.map.getSize());
            }
            catch(ex){
                // silent fail
            }
        }
        // zoom to WFS layers can be done only after data are loaded - this is done in "loadFeatures" method
    };

    var _onRemoveLayer = function (evt, data) {
        // get layer in stored layers
        for (var i = 0 ; i < self.layers.length; i++) {
            var l = self.layers[i];
            if (l.id == data.id) {
                self.map.removeLayer(l.olLayer);
                self.layers.splice(i, 1);
                break;
            }
        }
    };

    this.getLayerById = function (id) {

        for (var i = 0 ; i < self.layers.length; i++) {
            var l = self.layers[i];
            if (l.id == id) {
                return l;
                break;
            }
        }

        return null;
    };

    // set layer visibility 
    var _onLayerVisibilityChange = function (evt, data) {
        data.layer.olLayer.setVisible(data.visible);
    };

    var _registerWmsLayer = function (layer) {

        // create ol3 layer
        var sourceParams = {
            url: layer.getMapUrl,
            params: { 'LAYERS': layer.Name },
            serverType: 'geoserver'
        };

        var l = new ol.layer.Image({
            source: new ol.source.ImageWMS(sourceParams),
            visible: true,
            title: layer.Name
        });

        // add back reference to the layer record
        layer.olLayer = l;
        // add to stored data
        self.layers.push(layer);
    };


    var _removeAllLayers = function () {
        // remove all WMS loaded layers from local store
        while (self.layers.length > 0) {
            self.map.removeLayer(self.layers[0].olLayer);
            self.layers.splice(0, 1);
        }
        // remove layers from knockout object
        layerViewModel.removeAllLayers();

    };

    var _registerWfsLayer = function (data) {

        var urlStr = self.proxy + data.href.get;

        var loader = function (extent, resolution, projection) {
            var url = urlStr +
                '&service=WFS&version=1.1.0&typename=' + data.ns + ':' + data.name +
                '&outputFormat=JSON' +
                '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
            $.ajax({
                url: url,
                success: function (response) {
                    loadFeatures(response);
                }
            });
        };

        var vectorSource = new ol.source.ServerVector({
            format: new ol.format.GeoJSON(),
            loader: loader,
            strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
                maxZoom: 19
            })),
            projection: 'EPSG:3857'
        });

        var loadFeatures = function (response) {
            vectorSource.addFeatures(vectorSource.readFeatures(response));
            // after data loaded zoom to layer data extent
            self.map.getView().fitExtent(vectorSource.getExtent(), self.map.getSize());
        };

        var vector = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                })
            })
        });

        var layer = data;
        // add unique layer indentifier;
        layer.id = $.getUuid();
        
        // inject extra parameters
        // NOTE - duplicated properties are used for registering WFS layer with knockout module
        // when in proper development - models, props names etc. need to be syncronised, or separate classed should be created
        layer.visible = false;
        layer.Name = data.ns + ':' + data.name;
        layer.Title = layer.name;
        layer.getMapUrl = null;
        layer.getFeatureUrl = urlStr;
        layer.isOnMap = false;
        layer.type = 'WFS';
        layer.queryable = true;
        layer.visible = false;
        layer.olLayer = vector;



        // add to stored data
        self.layers.push(layer);

        return layer;

    };

    var _wfsRawLayersDataReady = function (evt, data) {
        var fts = data.featureTypeList.featureTypes;
        var href = data.capability.request.getfeature.href;

        // clear off any previously loaded layers
        _removeAllLayers();

        for (var i = 0; i < fts.length; i++) {
            fts[i].href = href;
            var l = _registerWfsLayer(fts[i]);
            layerViewModel.registerLayer(l);
        }
    };

    var _parseWmsCapabilities = function (rawData) {
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
            l.isOnMap = false;
            l.type = 'WMS';

            // add unique layer indentifier;
            l.id = $.getUuid();

            // register & prepare layer
            _registerWmsLayer(l);

            // add layer to the knockout model
            layerViewModel.registerLayer(l);
        }

    };

    // simple method conatinating user, pass and url
    var _getWmsCapabilities = function (evt, data) {

        var url = data.url;

        if (url.indexOf('service') == -1) {
            url = url + '&service=wms';
        }
        if (url.indexOf('request') == -1) {
            url = url + '&request=GetCapabilities';
        }

        url = self.proxy + url;

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

    };

    // matcher between GeoServer workspace Name and workspace Uri
    var _getGeoserverWorkspaces = function (req, wfsCaps) {

        if (!req || req.length == 0) return;

        var format = new OpenLayers.Format.XML();
        var xmlDoc = format.read(req);
        var match = [];

        if (xmlDoc && xmlDoc.activeElement && xmlDoc.activeElement.attributes) {
            var attribs = xmlDoc.activeElement.attributes;
            for (var i = 0; i < attribs.length; i++) {
                match.push({
                    workspaceName: attribs[i].localName,
                    workspaceUri: attribs[i].value
                });
            }
        }

        // assign feature namespace to featureTypes
        var fTs = wfsCaps.featureTypeList.featureTypes;
        for (var i = 0; i < fTs.length; i++) {
            fTs[i].ns = getNameSpaceByUri(match, fTs[i].featureNS);
        }

        // fire event internaly
        Gnx.Event.fireEvent('wfs-layers-ready-to-load', wfsCaps);
    };

    var getNameSpaceByUri = function (matchArr, uri) {

        for (var i = 0; i < matchArr.length; i++) {
            if (matchArr[i].workspaceUri == uri) return matchArr[i].workspaceName;
        }
        return null;
    };

    var _parseWfsCapabilities = function (rawData, url, credentials) {

        var parser = new OpenLayers.Format.WFSCapabilities({});
        var result = parser.read(rawData);

        // after capabilities ready, call Wfs DescribeFeatureType

        // first need to get list of workspace name and assigned Namespace URI
        // when getting response from WfsCapabilities, we get Namespace URI only
        // but to build WFS layer we need Namespace NAME
        var options = {
            type: "GET",
            url: self.proxy + url + 'SERVICE=WFS&VERSION=1.1.0&REQUEST=DescribeFeatureType',
            success: function (response) {
                _getGeoserverWorkspaces(response, result);
            },
            error: function (data) {
                console.warn('error', data);
            }
        }

        // inject user and and pass to the capabilities request
        if (credentials.username && credentials.password && credentials.username.length > 0 && credentials.password.length > 0) {
            options.data = credentials;
        }

        $.ajax(options);
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

        // force version for OL2 WFSCapabilities parser
        url = url + '&version=1.0.0';

        url = self.proxy + url;

        var options = {
            type: "GET",
            url: url,
            success: function (response) {
                _parseWfsCapabilities(response, data.url, {
                    username: data.userName,
                    password: data.password
                });
            },
            error: function (response) {
                console.warn('error', response);
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
        $.ajax(options);

    }

    var bindUiEvents = function () {
        // capture west pane resize
        Gnx.Event.on('layout-west-resize-start', onWestResizeStart);
        Gnx.Event.on('layout-west-resize-end', onWestResizeEnd);

        Gnx.Event.on('layout-west-open-end', onWestOpenEnd);
        Gnx.Event.on('layout-west-close-end', onWestCloseEnd);
    };

    var bindAppEvent = function () {
        // bind callbact to user clicked "get WMS Capabilities
        Gnx.Event.on('get-wms-capabilities', _getWmsCapabilities);
        // bind callbact to user clicked "get WFS Capabilities
        Gnx.Event.on('get-wfs-capabilities', _getWfsCapabilities);



        // listen to event called from koWmsViewModel
        Gnx.Event.on('add-layer', _onAddLayer);
        Gnx.Event.on('remove-layer', _onRemoveLayer);

        // user changed layer visibility in data grid
        Gnx.Event.on('set-layer-visibility-change', _onLayerVisibilityChange);


        // user internally by OpenLayers module
        Gnx.Event.on('wfs-layers-ready-to-load', _wfsRawLayersDataReady);
    };

    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        bindUiEvents();
        bindAppEvent();
        

        return this.initialized;
    };
};
