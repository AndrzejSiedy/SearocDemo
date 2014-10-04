(function ($) {

    var app_initiated = false;

    var app = $.sammy('#main', function () {

        this.get("#/welcome", function (context) {
            $(".view").hide();
            $("#welcome-view").show("slide", { direction: "left" }, 500);
        });

        this.get("#/demo", function (context) {
            $(".view").hide();

            // NOTE: for main app we cannot use "slide" effects as it will re-render whole app
            // will load scripts etc.
            $("#demo-view").show("slide", { direction: "left" }, 500, function () {
                // Animation complete.
                // Cannot start app when DOM is not read/visible on init
                // Hence init app after first time app-view gets rendered
                if (!app_initiated) {
                    Gnx.init();
                    Gnx.appStart();
                    app_initiated = true;
                }
                else {
                    // browser size could change - resize them all
                    //Gnx.Layout.viewport.resizeAll();
                }

            });
        });

        this.get("#/contact", function (context) {
            $(".view").hide();
            $("#contact-view").show("slide", { direction: "left" }, 500);
        });

    });

    $(function () {
        //$("#app-view").hide();
        app.run('#/welcome');
    });

})(jQuery);