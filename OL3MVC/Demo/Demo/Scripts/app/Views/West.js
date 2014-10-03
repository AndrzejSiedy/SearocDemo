/**
 *  Init West container UI
*/
Gnx.West = function () {

    var _initialized = false;
    this.initialized = false;

    var _init = function () {
        
    }
    
    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        return this.initialized;
    }
};
