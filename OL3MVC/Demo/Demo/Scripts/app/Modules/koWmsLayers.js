var WmsLayerModel = function (visible, queryable, name, title, getMapUrl, type, olLayer, onMap) {
    var self = this;

    // observable are update elements upon changes, also update on element data changes [two way binding]
    self.visible = ko.observable(visible);
    self.queryable = ko.observable(queryable);
    self.name = ko.observable(name);
    self.title = ko.observable(title);
    self.getMapUrl = ko.observable(getMapUrl);
    self.type = ko.observable(type);
    self.olLayer = olLayer;
    self.onMap = ko.observable(onMap);


    // listen to visibility checkbox change
    self.visible.subscribe(function (newValue) {
        Gnx.Event.fireEvent('set-layer-visibility-change', { visible: newValue, layer: self });
    }, self);
};



var WmsLayerViewModel = function (layers) {
    var self = this;
    self.layers = ko.observableArray(layers);

    self.registerLayer = function (l) {
        self.layers.push(new WmsLayerModel(l.visible, l.queryable, l.Name, l.Title, l.getMapUrl, l.type, l.olLayer, l.onMap));
    };

    self.addLayer2Map = function (l) {
        //l.onMap(true);
        // fire event to OpenLayers module to add layer to the map
        Gnx.Event.fireEvent('add-layer', l);
    };

    self.removeLayer = function (layer) {
        layer.onMap(false);
        self.layers.remove(layer);
    };

    self.removeAllLayers = function () {
        self.layers.removeAll();
    };

    self.save = function (form) {
        alert("Could now transmit to server: " + ko.utils.stringifyJson(self.layers));
        // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
    };

};

var wmsLayerViewModel = new WmsLayerViewModel([
    //{ visible: true, queryable: true, name: "Tall Hat", title: "39.95", type: 'WMS' },
    //{ visible: false, queryable: true, name: "Long Cloak", title: "120.00", type: 'WFS' }
]);
ko.applyBindings(wmsLayerViewModel);