var LayerModel = function (id, visible, queryable, name, title, getMapUrl, type, olLayer, isOnMap) {
    var self = this;

    self.id = id;
    // observable are update elements upon changes, also update on element data changes [two way binding]
    self.visible = ko.observable(visible);
    self.queryable = ko.observable(queryable);
    self.name = ko.observable(name);
    self.title = ko.observable(title);
    self.getMapUrl = ko.observable(getMapUrl);
    self.type = ko.observable(type);
    self.olLayer = olLayer;
    self.isOnMap = ko.observable(isOnMap);


    // listen to visibility checkbox change
    self.visible.subscribe(function (newValue) {
        Gnx.Event.fireEvent('set-layer-visibility-change', { visible: newValue, layer: self });
    }, self);
};



var LayerViewModel = function (layers) {
    var self = this;
    self.layers = ko.observableArray(layers);

    self.registerLayer = function (l) {
        self.layers.push(new LayerModel(l.id, l.visible, l.queryable, l.Name, l.Title, l.getMapUrl, l.type, l.olLayer, l.isOnMap));
    };

    self.addLayer2Map = function (l) {
        //l.onMap(true);
        // fire event to OpenLayers module to add layer to the map
        Gnx.Event.fireEvent('add-layer', l);
    };

    self.removeLayer = function (l) {
        l.isOnMap(false);
        Gnx.Event.fireEvent('remove-layer', l);
        self.layers.remove(l);
    };

    self.removeAllLayers = function () {
        self.layers.removeAll();
    };

    self.save = function (form) {
        alert("Could now transmit to server: " + ko.utils.stringifyJson(self.layers));
        // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
    };

};

// init ko ViewModel
var layerViewModel = new LayerViewModel([]);
ko.applyBindings(layerViewModel);