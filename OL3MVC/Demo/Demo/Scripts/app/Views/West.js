/**
 *  Init West container UI
*/
Gnx.West = function () {

    var _initialized = false;
    this.initialized = false;

    var _init = function () {

    };

    // colect form data
    this.getWmsCapabilitiesCredentials = function () {

        if ($('#inpWmsUrl').val().length == 0) {

            $("#dialog-info").html("WMS Url - field required");

            // Define the Dialog and its properties.
            $("#dialog-info").dialog({
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

            return;
        }

        // fire event to inform interested modules that user provided Wms capabilities credentials
        Gnx.Event.fireEvent('get-wms-capabilities', {
            userName: $('#inpUserName').val(),
            password: $('#inpPass').val(),
            url: $('#inpWmsUrl').val()
        });

    };

    this.getWfsCapabilitiesCredentials = function () {
        if ($('#inpWfsUrl').val().length == 0) {

            $("#dialog-info").html("WFS Url - field required");

            // Define the Dialog and its properties.
            $("#dialog-info").dialog({
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

            return;
        }

        // fire event to inform interested modules that user provided Wms capabilities credentials
        Gnx.Event.fireEvent('get-wfs-capabilities', {
            userName: $('#inpUserName').val(),
            password: $('#inpPass').val(),
            url: $('#inpWfsUrl').val()
        });
    };
    
    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        return this.initialized;
    };
};
