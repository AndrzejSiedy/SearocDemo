/**
 *  Init Layout UI
*/
Gnx.Layout = function () {

    var self = this;
    var _initialized = false;
    this.initialized = false;

    this.viewport = null;

    var westResizeCallback = function () {
        Gnx.Event.fireEvent('layout-west-resize-start');
    }

    var westResizeEndCallback = function () {
        Gnx.Event.fireEvent('layout-west-resize-end');
    }

    var westOpenEnd = function () {
        Gnx.Event.fireEvent('layout-west-open-end');
    }
    var westCloseEnd = function () {
        Gnx.Event.fireEvent('layout-west-close-end');
    }

    var _initLayout = function () {

        self.viewport = $('#sub-content-center').layout({
            resizeWhileDragging: true
            , animatePaneSizing: true
            , spacing_open: 0
            , spacing_closed: 0

            , west: {
                spacing_closed: 50
                , spacing_open: 50
                , size: '100%'
                , minSize: 300
                , maxSize: '70%'
                , initClosed: false
                , togglerLength_closed: '100%'
                , togglerLength_open: '100%'

                , togglerContent_open: '<div class="west-toggler-collapse"><span class="glyphicon glyphicon-circle-arrow-left" style="font-size:22px;"/> <p>Hide right panel</p></div>'
                , togglerContent_closed: '<div class="west-toggler-expand"><span class="glyphicon glyphicon-circle-arrow-right" style="font-size:22px;"/> <p>Show right panel</p></div>'

                //, onresize: westResizeCallback
                , onresize_start: westResizeCallback
                , onresize_end: westResizeEndCallback
                , onopen_end: westOpenEnd
                , onclose_end: westCloseEnd
            }
        });

        //// copy background color from nav-container class
        //// so JQuery Layout UI pane togglers update dynamically
        //$('.ui-layout-toggler').css('background-color', $('#nav-container').css('background-color'));
        //$('.west-toggler-collapse').css('color', $('#nav-container').css('color'));
        //$('.west-toggler-expand').css('color', $('#nav-container').css('color'));

    }


    this.init = function () {

        if (_initialized) return;

        _initLayout();

        this.initialized = _initialized = true;

        return this.initialized;
    }
};
