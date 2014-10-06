
$.getUuid = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

/**
 * Plugin to show loadmask on given div, a, span elements
 * usage: $('#west-pane-div').showLoadMask();
 */
$.fn.showLoadMask = function () {
    var lmId = this.data("_loadMaskId_");

    if (!lmId) {

        lmId = $.getUuid();
        // assign loadmask id to DOM object data
        this.data("_loadMaskId_", lmId);
        // html template
        var html = '<div id="' + lmId + '" style="position: absolute;top: 0px;left: 0px;height: 100%;width: 100%;background-color: transparent;display: none;">' +
                        '<img src="../Content/Images/loading-blue.gif" alt="Loading" style="position: absolute;left: 50%;top: 50%;margin-left: -100px;margin-top: -50px;height: auto;width: 100px;" />' +
                    '</div>';
        this.append(html);
    }

    $("#" + lmId).show();
};

/**
 * Plugin to hide loadmask assigned to given div, a, span elements if shown using "showLoadMask" plugin
 * usage: $('#west-pane-div').hideLoadMask();
 */
$.fn.hideLoadMask = function () {
    // get assigned loadmask id from DOM object data
    var lmId = this.data("_loadMaskId_");
    $("#" + lmId).hide();
};